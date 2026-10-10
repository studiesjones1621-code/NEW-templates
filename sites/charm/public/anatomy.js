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

function buildSyringe() {
  const gold = new THREE.MeshPhysicalMaterial({ color: 0xd9b87c, metalness: 1, roughness: 0.22, clearcoat: 0.6, clearcoatRoughness: 0.2 })
  const steel = new THREE.MeshPhysicalMaterial({ color: 0xe8ecef, metalness: 1, roughness: 0.15 })
  const rubber = new THREE.MeshPhysicalMaterial({ color: 0x2b2f2d, roughness: 0.55, clearcoat: 0.3 })
  // Clear glass as a bright, reflective transparent shell (reads lighter on a dark stage than transmission)
  const glass = new THREE.MeshPhysicalMaterial({
    color: 0xf4fbff, metalness: 0, roughness: 0.03, transparent: true, opacity: 0.32, ior: 1.5,
    specularIntensity: 1, clearcoat: 1, clearcoatRoughness: 0.02, side: THREE.DoubleSide, envMapIntensity: 2.4,
    depthWrite: false,
  })
  const gel = new THREE.MeshPhysicalMaterial({
    color: 0xdff3ee, roughness: 0.04, transparent: true, opacity: 0.62, ior: 1.36, clearcoat: 1,
    iridescence: 0.5, iridescenceIOR: 1.3, envMapIntensity: 2.2, emissive: 0x5f8f86, emissiveIntensity: 0.12,
  })
  const hubMat = new THREE.MeshPhysicalMaterial({ color: 0xf3ead8, roughness: 0.12, transparent: true, opacity: 0.7, clearcoat: 1, envMapIntensity: 2 })

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
  const plunger = part("plunger", { off: [0.5, -2.6, 0.2], delay: 0.05, wobble: [0.15, 0, 0.18], anchor: [0.95, -5.6, 0] })
  plunger.add(cyl(0.95, 0.95, 0.16, gold, -5.6))
  const fin = new THREE.BoxGeometry(0.07, 4.1, 0.5)
  for (const r of [0, Math.PI / 2]) {
    const f = new THREE.Mesh(fin, gold)
    f.position.y = -3.45
    f.rotation.y = r
    plunger.add(f)
  }
  plunger.add(cyl(0.5, 0.5, 0.08, gold, -1.42))

  const stopper = part("stopper", { off: [-0.5, -1.5, 0.4], delay: 0.12, wobble: [0.3, 0, -0.2], anchor: [0.56, -1.2, 0] })
  stopper.add(cyl(0.555, 0.555, 0.5, rubber, -1.15))
  stopper.add(ring(0.56, 0.035, rubber, -1.32))
  stopper.add(ring(0.56, 0.035, rubber, -0.98))

  const barrel = part("barrel", { off: [-0.6, 0, -0.3], delay: 0, anchor: [-0.66, 0.2, 0] })
  barrel.add(cyl(0.64, 0.64, 5.3, glass, 1.1, 72, true))
  barrel.add(cyl(0.2, 0.64, 0.5, glass, 4.0, 72, true))
  const flange = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.14, 1.05), gold)
  flange.position.y = -1.55
  barrel.add(flange)
  barrel.add(ring(0.64, 0.045, gold, -1.5))
  const tick = new THREE.MeshBasicMaterial({ color: 0x9c8350, transparent: true, opacity: 0.55 })
  for (let i = 0; i < 9; i++) barrel.add(ring(0.645, i % 2 ? 0.006 : 0.011, tick, -0.6 + i * 0.5))

  const gelPart = part("gel", { off: [2.5, 0.6, 1.2], delay: 0.2, wobble: [0, 0.4, -0.25], anchor: [0.54, 3.2, 0] })
  gelPart.add(cyl(0.53, 0.53, 4.6, gel, 1.3))
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.53, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), gel)
  cap.position.y = 3.6
  gelPart.add(cap)

  const hub = part("hub", { off: [0.3, 1.1, 0.2], delay: 0.28, wobble: [0.2, 0.3, 0.1], anchor: [0.26, 4.6, 0] })
  hub.add(cyl(0.24, 0.27, 0.65, hubMat, 4.57, 6))
  hub.add(cyl(0.12, 0.2, 0.25, hubMat, 5.0))

  const needle = part("needle", { off: [0.4, 2.0, 0], delay: 0.34, wobble: [0, 0, 0.12], anchor: [0.05, 6.0, 0] })
  needle.add(cyl(0.03, 0.03, 2.6, steel, 6.4, 16))
  const bevel = cyl(0.0, 0.03, 0.16, steel, 7.78, 16)
  needle.add(bevel)
  const drop = new THREE.Mesh(new THREE.SphereGeometry(0.1, 24, 16), gel)
  drop.position.y = 7.92
  needle.add(drop)

  const model = new THREE.Group()
  for (const p of Object.values(parts)) {
    p.base = p.group.position.clone()
    model.add(p.group)
  }
  model.position.y = -1 // centre the assembled syringe
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
    model.rotation.y = (reduce ? 0 : time * 0.25) + p * 2.2
    pivot.position.set(wide ? 3.8 : 0, wide ? 0.2 : 2.6, 0)
    const dist = (wide ? 27 : 46) + e * (wide ? 11 : 10)
    camera.position.set(0, 0.6, dist)
    camera.lookAt(0, wide ? 0 : 1.4, 0)

    // Gel drip at the needle tip once reassembled
    const cycle = (time % 2.2) / 2.2
    const show = 1 - e
    const fall = cycle > 0.5 ? (cycle - 0.5) / 0.5 : 0
    drop.scale.setScalar(Math.max(0.001, show * (cycle < 0.45 ? cycle / 0.45 : 1) * (1 - fall * 0.6)))
    // In the needle's frame "down" depends on the tilt, so fall along local -Y and slightly out
    drop.position.set(fall * 0.2, 7.92 - fall * fall * 2.2, 0)
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
  requestAnimationFrame(frame)
}

const auto = document.querySelector("[data-anatomy]")
if (auto) init(auto)
