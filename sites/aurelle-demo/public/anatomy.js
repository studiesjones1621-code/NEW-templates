// Scroll-driven exploded view of a filler syringe (three.js, no build step).
// Technique follows open-source scroll-explode demos (e.g. github.com/IRdotAI/pc-exploded): every part has a
// resting position and an offset vector; scroll progress eases each part along its offset with a small stagger
// and wobble, HTML labels are pinned to 3D anchor points by projecting them through the camera each frame.
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.min.js"

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const span = (p, a, b) => clamp((p - a) / (b - a))
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

// A soft studio "room" for reflections (stand-in for three's RoomEnvironment addon, so no import map is needed)
function studioEnvironment(renderer) {
  const env = new THREE.Scene()
  const room = new THREE.Mesh(
    new THREE.BoxGeometry(20, 12, 20),
    new THREE.MeshBasicMaterial({ color: 0x1a2621, side: THREE.BackSide }),
  )
  env.add(room)
  const panel = (w, h, color, intensity, pos, rotY = 0) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color }))
    m.material.color.multiplyScalar(intensity)
    m.position.set(...pos)
    m.rotation.y = rotY
    env.add(m)
  }
  panel(8, 3, 0xffffff, 6, [0, 5.5, 0], 0) // overhead softbox
  env.children.at(-1).rotation.x = Math.PI / 2
  panel(4, 8, 0xfff1d8, 4, [-9.8, 0, 0], Math.PI / 2) // warm key
  panel(3, 8, 0xdfe9ff, 2.5, [9.8, 0, -2], -Math.PI / 2) // cool rim
  panel(10, 1.2, 0xffffff, 2, [0, -1, -9.8], 0)
  const pmrem = new THREE.PMREMGenerator(renderer)
  const tex = pmrem.fromScene(env, 0.04).texture
  pmrem.dispose()
  return tex
}

// A generic, unbranded 1 mL prefilled hyaluronic filler syringe: round thumb pad and plunger rod, finger grip
// with two oval cut-outs, slim clear barrel printed with 0.1–1.0 mL graduations and a pale label band, black
// ribbed stopper, clear HA gel, clear luer hub and a fine 30G needle.
function graduationTexture() {
  const c = document.createElement("canvas")
  c.width = 1024
  c.height = 1024
  const g = c.getContext("2d")
  g.clearRect(0, 0, 1024, 1024)
  g.fillStyle = "rgba(28,40,72,0.92)"
  g.strokeStyle = "rgba(28,40,72,0.92)"
  g.font = "bold 34px Helvetica, Arial, sans-serif"
  g.textAlign = "right"
  g.textBaseline = "middle"
  // Graduations printed in three columns around the barrel so some always face the camera as it turns;
  // v runs bottom (0) → top (1)
  g.font = "bold 40px Helvetica, Arial, sans-serif"
  for (const cx of [170, 510, 850]) {
    for (let k = 0; k <= 20; k++) {
      const y = 1024 - (60 + k * 44)
      const major = k % 2 === 0
      g.lineWidth = major ? 7 : 4
      g.beginPath()
      g.moveTo(cx, y)
      g.lineTo(cx + (major ? 90 : 50), y)
      g.stroke()
      if (major && k > 0) g.fillText((k / 20).toFixed(1), cx - 10, y)
    }
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

function fingerGripGeometry() {
  // Flat grip seen from above: rounded wings with two oval openings, extruded thin
  const w = 1.55, d = 0.62, r = 0.45
  const s = new THREE.Shape()
  s.moveTo(-w + r, -d)
  s.lineTo(w - r, -d)
  s.quadraticCurveTo(w, -d, w, -d + r)
  s.lineTo(w, d - r)
  s.quadraticCurveTo(w, d, w - r, d)
  s.lineTo(-w + r, d)
  s.quadraticCurveTo(-w, d, -w, d - r)
  s.lineTo(-w, -d + r)
  s.quadraticCurveTo(-w, -d, -w + r, -d)
  for (const sx of [-1, 1]) {
    const h = new THREE.Path()
    h.absellipse(sx * 0.98, 0, 0.36, 0.42, 0, Math.PI * 2, false, 0)
    s.holes.push(h)
  }
  const hole = new THREE.Path() // opening the barrel passes through
  hole.absarc(0, 0, 0.43, 0, Math.PI * 2, true)
  s.holes.push(hole)
  const geo = new THREE.ExtrudeGeometry(s, { depth: 0.2, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 3, curveSegments: 32 })
  geo.rotateX(-Math.PI / 2)
  geo.translate(0, -0.1, 0)
  return geo
}

function buildSyringe() {
  const navy = new THREE.MeshPhysicalMaterial({ color: 0xc9a96e, metalness: 0.35, roughness: 0.32, clearcoat: 0.5, clearcoatRoughness: 0.3 })
  const steel = new THREE.MeshPhysicalMaterial({ color: 0xe8ecef, metalness: 1, roughness: 0.15 })
  const rubber = new THREE.MeshPhysicalMaterial({ color: 0x151515, roughness: 0.5, clearcoat: 0.4 })
  const glass = new THREE.MeshPhysicalMaterial({
    color: 0xf4fbff, metalness: 0, roughness: 0.03, transparent: true, opacity: 0.3, ior: 1.5,
    specularIntensity: 1, clearcoat: 1, clearcoatRoughness: 0.02, side: THREE.DoubleSide, envMapIntensity: 2.4,
    depthWrite: false,
  })
  const print = new THREE.MeshBasicMaterial({ map: graduationTexture(), transparent: true, depthWrite: false, opacity: 0.95 })
  const pink = new THREE.MeshPhysicalMaterial({ color: 0xf1e8d8, roughness: 0.5, transparent: true, opacity: 0.9, clearcoat: 0.6 })
  const gel = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, roughness: 0.03, transparent: true, opacity: 0.38, ior: 1.36, clearcoat: 1,
    iridescence: 0.3, iridescenceIOR: 1.3, envMapIntensity: 2.6, emissive: 0xffffff, emissiveIntensity: 0.06,
  })
  const clear = new THREE.MeshPhysicalMaterial({ color: 0xf3f6f7, roughness: 0.1, transparent: true, opacity: 0.55, clearcoat: 1, envMapIntensity: 2 })

  const cyl = (rt, rb, h, mat, y, seg = 64, open = false) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg, 1, open), mat)
    m.position.y = y
    return m
  }
  const ring = (r, tube, mat, y) => {
    const m = new THREE.Mesh(new THREE.TorusGeometry(r, tube, 12, 72), mat)
    m.rotation.x = Math.PI / 2
    m.position.y = y
    return m
  }

  const parts = {}
  const part = (id, { off, delay = 0, wobble = [0, 0, 0], anchor }) => {
    const g = new THREE.Group()
    parts[id] = { id, group: g, off: new THREE.Vector3(...off), delay, wobble: new THREE.Vector3(...wobble), anchor: new THREE.Vector3(...anchor) }
    return g
  }

  // Built along +Y (needle up); the whole model is tilted afterwards.
  const plunger = part("plunger", { off: [0.5, -2.6, 0.2], delay: 0.05, wobble: [0.15, 0, 0.18], anchor: [0.8, -6.45, 0] })
  plunger.add(cyl(0.78, 0.78, 0.14, navy, -6.45))
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.78, 48, 16, 0, Math.PI * 2, 0, 0.5), navy)
  dome.scale.y = 0.35
  dome.rotation.x = Math.PI
  dome.position.y = -6.52
  plunger.add(dome)
  plunger.add(cyl(0.16, 0.16, 4.3, navy, -4.25, 32))
  plunger.add(cyl(0.3, 0.3, 0.12, navy, -2.08))

  const stopper = part("stopper", { off: [-0.5, -1.5, 0.4], delay: 0.12, wobble: [0.3, 0, -0.2], anchor: [0.38, -1.3, 0] })
  stopper.add(cyl(0.375, 0.375, 0.6, rubber, -1.3))
  for (const y of [-1.52, -1.3, -1.08]) stopper.add(ring(0.38, 0.03, rubber, y))

  const barrel = part("barrel", { off: [-0.6, 0, -0.3], delay: 0, anchor: [-0.45, 1.6, 0] })
  barrel.add(cyl(0.42, 0.42, 6.3, glass, 1.45, 72, true))
  const marks = cyl(0.426, 0.426, 6.3, print, 1.45, 72, true)
  marks.rotation.y = -Math.PI / 2
  barrel.add(marks)
  barrel.add(cyl(0.432, 0.432, 0.5, pink, -1.25, 72, true))
  barrel.add(cyl(0.16, 0.42, 0.32, glass, 4.76, 72, true))
  const grip = new THREE.Mesh(fingerGripGeometry(), navy)
  grip.position.y = -1.72
  barrel.add(grip)

  const gelPart = part("gel", { off: [2.2, 0.6, 1.1], delay: 0.2, wobble: [0, 0.4, -0.25], anchor: [0.36, 3.0, 0] })
  gelPart.add(cyl(0.355, 0.355, 5.5, gel, 1.75))
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.355, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), gel)
  cap.position.y = 4.5
  gelPart.add(cap)

  const hub = part("hub", { off: [0.3, 1.1, 0.2], delay: 0.28, wobble: [0.2, 0.3, 0.1], anchor: [0.24, 5.2, 0] })
  hub.add(cyl(0.22, 0.24, 0.55, clear, 5.2, 8))
  hub.add(cyl(0.1, 0.17, 0.3, clear, 5.6))

  const needle = part("needle", { off: [0.4, 2.0, 0], delay: 0.34, wobble: [0, 0, 0.12], anchor: [0.04, 6.6, 0] })
  needle.add(cyl(0.022, 0.022, 1.9, steel, 6.7, 16))
  needle.add(cyl(0.0, 0.022, 0.14, steel, 7.72, 16))
  const drop = new THREE.Mesh(new THREE.SphereGeometry(0.09, 24, 16), gel)
  drop.position.y = 7.85
  needle.add(drop)

  const model = new THREE.Group()
  for (const p of Object.values(parts)) {
    p.base = p.group.position.clone()
    model.add(p.group)
  }
  model.position.y = -0.6 // centre the assembled syringe
  return { model, parts, drop }
}

export function init(root) {
  if (!root || root.dataset.ready) return
  root.dataset.ready = "1"
  const canvas = root.querySelector("canvas")
  const labelsEl = root.querySelector("[data-anatomy-labels]")
  const steps = [...root.querySelectorAll("[data-step]")]
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" })
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  renderer.outputColorSpace = THREE.SRGBColorSpace

  const scene = new THREE.Scene()
  scene.environment = studioEnvironment(renderer)
  const key = new THREE.DirectionalLight(0xfff0d6, 1.6)
  key.position.set(-6, 8, 8)
  scene.add(key)
  const rim = new THREE.DirectionalLight(0xcfe0ff, 1.1)
  rim.position.set(8, -2, -6)
  scene.add(rim)

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 200)
  const { model, parts, drop } = buildSyringe()
  const pivot = new THREE.Group()
  pivot.add(model)
  scene.add(pivot)

  // Labels for the four parts the copy talks about
  const labelDefs = [
    ["plunger", "01", "Controlled press"],
    ["gel", "02", "Hyaluronic acid gel"],
    ["barrel", "03", "Sterile glass barrel"],
    ["needle", "04", "Ultra-fine needle"],
  ]
  const labels = labelDefs.map(([id, n, text], i) => {
    const el = document.createElement("div")
    el.className = "anatomy-tag"
    el.innerHTML = `<span class="anatomy-pin"></span><span class="anatomy-txt"><b>${n}</b>${text}</span>`
    labelsEl.appendChild(el)
    return { p: parts[id], el, at: 0.34 + i * 0.09 }
  })

  let W = 0, H = 0, wide = true
  const resize = () => {
    W = root.clientWidth
    H = Math.min(root.querySelector("[data-anatomy-stage]").clientHeight, innerHeight)
    wide = W >= 1024
    renderer.setPixelRatio(Math.min(devicePixelRatio, wide ? 1.75 : 1.5))
    renderer.setSize(W, H, false)
    camera.aspect = W / H
    camera.fov = wide ? 30 : 38
    camera.updateProjectionMatrix()
  }
  resize()
  addEventListener("resize", resize)

  let visible = false
  new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: "100px" }).observe(root)

  // Slide the site header away while the stage is pinned full-screen
  const pinCheck = () => {
    const r = root.getBoundingClientRect()
    document.documentElement.classList.toggle("anatomy-pinned", r.top <= 2 && r.bottom >= innerHeight * 0.9)
  }
  addEventListener("scroll", pinCheck, { passive: true })
  pinCheck()

  const v = new THREE.Vector3()
  let smoothP = 0, last = performance.now(), time = 0
  const frame = (now) => {
    requestAnimationFrame(frame)
    if (!visible) return
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    time += dt

    const r = root.getBoundingClientRect()
    const goal = clamp(-r.top / Math.max(1, root.offsetHeight - H))
    smoothP += (goal - smoothP) * (reduce ? 1 : 1 - Math.exp(-dt * 6))
    const p = smoothP

    // Explode in, hold, reassemble at the end
    const e = span(p, 0.12, 0.42) * (1 - span(p, 0.8, 0.92))
    for (const part of Object.values(parts)) {
      const t = ease(clamp((e - part.delay * 0.6) / 0.7))
      part.group.position.copy(part.base).addScaledVector(part.off, t)
      const w = Math.sin(t * Math.PI)
      part.group.rotation.set(part.wobble.x * w, part.wobble.y * w, part.wobble.z * w)
    }

    // Tilted like a product shot, turning slowly; framed right of the copy on desktop, above it on phones
    pivot.rotation.z = -0.95 + e * 0.35
    pivot.rotation.x = 0.32 // look slightly down onto the finger grip so its oval cut-outs read
    model.rotation.y = (reduce ? 0 : time * 0.25) + p * 2.2
    pivot.position.set(wide ? 3.8 : 0, wide ? 0.2 : 3.6, 0)
    const dist = (wide ? 27 : 46) + e * (wide ? 11 : 10)
    camera.position.set(0, 0.6, dist)
    camera.lookAt(0, wide ? 0 : 1.4, 0)

    // Gel drip at the needle tip once reassembled
    const cycle = (time % 2.2) / 2.2
    const show = 1 - e
    const fall = cycle > 0.5 ? (cycle - 0.5) / 0.5 : 0
    drop.scale.setScalar(Math.max(0.001, show * (cycle < 0.45 ? cycle / 0.45 : 1) * (1 - fall * 0.6)))
    // In the needle's frame "down" depends on the tilt, so fall along local -Y and slightly out
    drop.position.set(fall * 0.2, 7.85 - fall * fall * 2.2, 0)
    drop.visible = fall < 0.98

    renderer.render(scene, camera)

    // Pin labels to their parts
    for (const L of labels) {
      const on = clamp((p - L.at) / 0.06) * (1 - span(p, 0.8, 0.86))
      L.p.group.updateWorldMatrix(true, false)
      v.copy(L.p.anchor).applyMatrix4(L.p.group.matrixWorld).project(camera)
      const x = (v.x * 0.5 + 0.5) * W
      const y = (-v.y * 0.5 + 0.5) * H
      L.el.style.opacity = String(on)
      L.el.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }
    const active = p < 0.3 ? 0 : p > 0.82 ? 5 : 1 + Math.min(3, Math.floor((p - 0.3) / 0.12))
    steps.forEach((s) => s.toggleAttribute("data-active", Number(s.dataset.step) === active))
  }
  renderer.compile(scene, camera)
  requestAnimationFrame(frame)
}

// Start the 3D only as the section approaches (about a screen and a half away), in idle time, so
// WebGL setup and shader compiling never compete with the page's first scroll.
export function lazy(root) {
  if (!root || root.dataset.lazy) return
  root.dataset.lazy = "1"
  const io = new IntersectionObserver(
    ([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const go = () => init(root)
      "requestIdleCallback" in window ? requestIdleCallback(go, { timeout: 600 }) : setTimeout(go, 50)
    },
    { rootMargin: "150% 0px" },
  )
  io.observe(root)
}

const auto = document.querySelector("[data-anatomy]")
if (auto) lazy(auto)
