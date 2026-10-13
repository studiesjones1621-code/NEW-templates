// The exploded fabric-stack scene (three.js, no build step). It has no DOM access, so the same code runs in a Web
// Worker on an OffscreenCanvas (keeping the page's main thread free for scrolling) or, as a fallback, on the page.
// layers.js decides which. Four layers of the jacket (iridescent shell with rain beading on it, ripstop, quilted
// insulation, satin lining) rest stacked, then part as you scroll; each layer reports a 3D anchor point that the
// page connects to its callout card.
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.min.js"

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
export const span = (p, a, b) => clamp((p - a) / (b - a))
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

// Seeded random so the stack looks identical on every load
let seed = 11
const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646
const between = (a, b) => a + rand() * (b - a)

const canvas2d = (w, h) =>
  typeof OffscreenCanvas !== "undefined" ? new OffscreenCanvas(w, h) : Object.assign(document.createElement("canvas"), { width: w, height: h })

// A dark studio with coloured light panels: what the lacquered, iridescent surfaces reflect
function studioEnvironment(renderer) {
  const env = new THREE.Scene()
  env.add(new THREE.Mesh(new THREE.BoxGeometry(20, 12, 20), new THREE.MeshBasicMaterial({ color: 0x07070c, side: THREE.BackSide })))
  const panel = (w, h, color, intensity, pos, rot) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color }))
    m.material.color.multiplyScalar(intensity)
    m.position.set(...pos)
    m.rotation.set(...rot)
    env.add(m)
  }
  // Overhead strips: what a flat, lacquered sheet viewed from above mostly reflects
  panel(12, 0.8, 0xffffff, 1.6, [0, 5.9, -3], [Math.PI / 2, 0, 0])
  panel(12, 2.2, 0x6a4dff, 1.4, [0, 5.9, 0.5], [Math.PI / 2, 0, 0])
  panel(12, 1.2, 0x2fd8ff, 1.3, [0, 5.9, 3.5], [Math.PI / 2, 0, 0])
  panel(1.2, 12, 0xff5ad1, 0.9, [-4, 5.9, 0], [Math.PI / 2, 0, 0])
  panel(3, 9, 0x5a7dff, 5, [-9.8, 0, 2], [0, Math.PI / 2, 0])
  panel(3, 9, 0xb05cff, 4, [9.8, 0, -2], [0, -Math.PI / 2, 0])
  panel(8, 1.2, 0x39e0ff, 3, [0, -1, -9.8], [0, 0, 0])
  const pmrem = new THREE.PMREMGenerator(renderer)
  const tex = pmrem.fromScene(env, 0.03).texture
  pmrem.dispose()
  return tex
}

// The shell's printed graphic: a near-black panel with a cyan tech band, fine type and a violet tag
function shellTexture() {
  const c = canvas2d(512, 512)
  const g = c.getContext("2d")
  g.fillStyle = "#0b0b16"
  g.fillRect(0, 0, 512, 512)
  g.strokeStyle = "rgba(90,220,255,0.55)"
  g.lineWidth = 3
  for (let i = 0; i < 6; i++) {
    g.beginPath()
    g.moveTo(40, 140 + i * 8)
    for (let x = 40; x < 470; x += 22) g.lineTo(x, 140 + i * 8 + (x % 44 === 18 ? -6 : 0))
    g.stroke()
  }
  g.fillStyle = "rgba(90,220,255,0.7)"
  for (let i = 0; i < 26; i++) g.fillRect(40 + i * 16, 210, 10, 10 + (i % 3) * 6)
  g.fillStyle = "rgba(176,92,255,0.85)"
  g.fillRect(330, 360, 130, 36)
  g.fillStyle = "rgba(255,255,255,0.75)"
  g.font = "bold 20px monospace"
  g.fillText("WR-20K / 3L", 46, 400)
  g.font = "14px monospace"
  g.fillText("SHELL 01  PU-LACQUER", 46, 428)
  return new THREE.CanvasTexture(c)
}

// Ripstop: a fine weave with a heavier reinforcing grid every few millimetres
function ripstopTexture() {
  const c = canvas2d(512, 512)
  const g = c.getContext("2d")
  g.fillStyle = "#2e1a63"
  g.fillRect(0, 0, 512, 512)
  for (let y = 0; y < 512; y += 4) {
    g.fillStyle = `rgba(255,255,255,${0.03 + (y % 8 ? 0 : 0.03)})`
    g.fillRect(0, y, 512, 2)
  }
  g.strokeStyle = "rgba(210,190,255,0.45)"
  g.lineWidth = 2
  for (let i = 0; i <= 512; i += 32) {
    g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 512); g.stroke()
    g.beginPath(); g.moveTo(0, i); g.lineTo(512, i); g.stroke()
  }
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(2, 2)
  return t
}

// A soft dark pool under the stack
function shadowTexture() {
  const c = canvas2d(256, 256)
  const g = c.getContext("2d")
  const r = g.createRadialGradient(128, 128, 10, 128, 128, 128)
  r.addColorStop(0, "rgba(0,0,0,0.85)")
  r.addColorStop(1, "rgba(0,0,0,0)")
  g.fillStyle = r
  g.fillRect(0, 0, 256, 256)
  return new THREE.CanvasTexture(c)
}

const SIZE = 4
// A square sheet with a gentle drape; `amp` sets how much it ripples
function sheet(amp, seg, phase) {
  const geo = new THREE.PlaneGeometry(SIZE, SIZE, seg, seg)
  geo.rotateX(-Math.PI / 2)
  const pos = geo.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i)
    pos.setY(i, amp * (Math.sin(x * 1.1 + phase) * 0.7 + Math.sin(z * 1.7 + phase * 2) * 0.5 + Math.sin((x + z) * 2.3) * 0.15))
  }
  geo.computeVertexNormals()
  return geo
}

let LITE = false

function buildStack() {
  const model = new THREE.Group()
  const seg = LITE ? 40 : 80
  const make = (id, base, off, delay) => {
    const group = new THREE.Group()
    group.position.set(0, base, 0)
    model.add(group)
    return { id, group, base: new THREE.Vector3(0, base, 0), off: new THREE.Vector3(0, off, 0), delay, anchor: new THREE.Vector3(1.25, 0.15, -1.25) }
  }
  const parts = {
    shell: make("shell", 0.62, 1.55, 0),
    ripstop: make("ripstop", 0.34, 0.6, 0.12),
    insulation: make("insulation", 0.02, -0.35, 0.22),
    lining: make("lining", -0.36, -1.3, 0.32),
  }

  // 01 Outer shell: lacquered, oil-slick iridescent nylon with rain beading on it
  {
    const P = parts.shell
    const geo = sheet(0.11, seg, 0.4)
    const shell = new THREE.Mesh(
      geo,
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff, map: shellTexture(), metalness: 0.15, roughness: 0.14, envMapIntensity: 1.3, clearcoat: 1, clearcoatRoughness: 0.05,
        specularColor: 0xb9a6ff, specularIntensity: 1, sheen: 0.2, sheenColor: 0x3a6bff, side: THREE.DoubleSide,
      }),
    )
    shell.material.map.colorSpace = THREE.SRGBColorSpace
    P.group.add(shell)
    const count = LITE ? 70 : 150
    const drops = new THREE.InstancedMesh(
      new THREE.SphereGeometry(1, LITE ? 10 : 18, LITE ? 8 : 12),
      // Glossy clear beads. (A true glass "transmission" material looked marginally better but re-renders the whole
      // scene every frame, which made scrolling into this section stutter.)
      new THREE.MeshPhysicalMaterial({ color: 0xbfd6ff, roughness: 0.02, metalness: 0.1, clearcoat: 1, transparent: true, opacity: 0.38, envMapIntensity: 3 }),
      count,
    )
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3()
    const pos = geo.attributes.position
    for (let i = 0; i < count; i++) {
      const vi = Math.floor(between(0, pos.count))
      const r = rand() < 0.12 ? between(0.06, 0.09) : between(0.018, 0.045)
      p.set(pos.getX(vi), pos.getY(vi) + r * 0.3, pos.getZ(vi))
      s.set(r, r * 0.55, r * between(0.85, 1.2))
      drops.setMatrixAt(i, m.compose(p, q, s))
    }
    P.group.add(drops)
    P.anchor.set(1.1, 0.25, -1.3)
  }

  // 02 Ripstop: tear-resistant woven layer
  {
    const P = parts.ripstop
    const mat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, map: ripstopTexture(), roughness: 0.45, sheen: 0.5, sheenColor: 0xb48cff, sheenRoughness: 0.35, clearcoat: 0.4, clearcoatRoughness: 0.3, side: THREE.DoubleSide })
    mat.map.colorSpace = THREE.SRGBColorSpace
    P.group.add(new THREE.Mesh(sheet(0.08, seg, 1.3), mat))
  }

  // 03 Thermal insulation: quilted baffles, plump and glossy
  {
    const P = parts.insulation
    const mat = new THREE.MeshPhysicalMaterial({
      color: 0x4a24b0, roughness: 0.16, envMapIntensity: 1.6, clearcoat: 1, clearcoatRoughness: 0.12, iridescence: 0.35, iridescenceIOR: 1.4,
      sheen: 0.6, sheenColor: 0xd3b8ff,
    })
    const rows = 4
    const geo = new THREE.CapsuleGeometry(0.52, SIZE - 1.05, LITE ? 8 : 14, LITE ? 16 : 28)
    for (let r = 0; r < rows; r++) {
      const baffle = new THREE.Mesh(geo, mat)
      baffle.rotation.z = Math.PI / 2
      baffle.scale.set(0.58, 1, 0.98) // flatten (x is the capsule's radius axis once it is laid down)
      baffle.position.set(0, 0, -SIZE / 2 + (r + 0.5) * (SIZE / rows))
      P.group.add(baffle)
    }
    const base = new THREE.Mesh(new THREE.BoxGeometry(SIZE, 0.04, SIZE), new THREE.MeshStandardMaterial({ color: 0x241544, roughness: 0.7 }))
    base.position.y = -0.24
    P.group.add(base)
    P.anchor.set(1.25, 0.3, -1.4)
  }

  // 04 Lining: smooth satin against the body
  {
    const P = parts.lining
    P.group.add(
      new THREE.Mesh(
        sheet(0.06, seg, 2.2),
        new THREE.MeshPhysicalMaterial({ color: 0x3b3678, roughness: 0.3, sheen: 0.7, sheenColor: 0xffffff, sheenRoughness: 0.3, clearcoat: 0.3, side: THREE.DoubleSide }),
      ),
    )
  }

  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(SIZE * 1.9, SIZE * 1.9), new THREE.MeshBasicMaterial({ map: shadowTexture(), transparent: true, depthWrite: false }))
  shadow.rotation.x = -Math.PI / 2
  model.add(shadow)

  return { model, parts, shadow }
}

/**
 * Builds the scene on `canvas` (an OffscreenCanvas or a canvas element). `step` is awaited between setup stages
 * so heavy work waits for a moment when the page isn't being scrolled. Returns `draw(goal, pointer, now)`, which
 * eases toward the scroll progress and pointer and renders, returning the anchor positions and the active layer,
 * or null when nothing changed.
 */
export async function createEngine({ canvas, lite, reduce, dpr, step = async () => {} }) {
  LITE = lite
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !lite || dpr < 2, alpha: true, powerPreference: "high-performance" })
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.1
  renderer.outputColorSpace = THREE.SRGBColorSpace

  await step()
  const scene = new THREE.Scene()
  scene.environment = studioEnvironment(renderer)
  await step()
  const key = new THREE.DirectionalLight(0xffffff, 1.6)
  key.position.set(-5, 9, 6)
  scene.add(key)
  const rim = new THREE.DirectionalLight(0x9a6bff, 1.4)
  rim.position.set(7, -1, -6)
  scene.add(rim)
  const fill = new THREE.DirectionalLight(0x4fd4ff, 0.6)
  fill.position.set(6, 4, 8)
  scene.add(fill)

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 200)
  const { model, parts, shadow } = buildStack()
  await step()
  const pivot = new THREE.Group()
  pivot.add(model)
  scene.add(pivot)
  const order = ["shell", "ripstop", "insulation", "lining"]

  let W = 1, H = 1, wide = true, dirty = true
  const setSize = (w, h, isWide) => {
    W = w
    H = h
    wide = isWide
    renderer.setPixelRatio(Math.min(dpr, wide ? 1.5 : 1.5))
    renderer.setSize(W, H, false)
    camera.aspect = W / H
    camera.fov = wide ? 30 : 36
    camera.updateProjectionMatrix()
    dirty = true
  }

  // Upload textures and compile shaders before the first frame, one piece at a time
  const textures = new Set()
  scene.traverse((o) => [o.material].flat().forEach((m) => m?.map && textures.add(m.map)))
  for (const t of textures) {
    await step()
    renderer.initTexture(t)
  }
  const groups = [...Object.values(parts).map((x) => x.group), shadow]
  for (const g of groups) {
    await step()
    groups.forEach((o) => (o.visible = o === g))
    // compileAsync lets the GPU driver build shaders in parallel without blocking (KHR_parallel_shader_compile)
    if (renderer.compileAsync) await renderer.compileAsync(scene, camera)
    else renderer.compile(scene, camera)
  }
  groups.forEach((o) => (o.visible = true))
  await step()
  renderer.render(scene, camera)
  await step()

  const v = new THREE.Vector3()
  let smoothP = 0, last = 0, time = 0, drawnKey = ""
  const ptr = { x: 0, y: 0 }
  const draw = (goal, pointer, now) => {
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016
    last = now
    time += dt
    const k = reduce ? 1 : 1 - Math.exp(-dt * 6)
    smoothP += (goal - smoothP) * k
    ptr.x += ((pointer?.[0] ?? 0) - ptr.x) * (reduce ? 1 : 1 - Math.exp(-dt * 4))
    ptr.y += ((pointer?.[1] ?? 0) - ptr.y) * (reduce ? 1 : 1 - Math.exp(-dt * 4))
    const p = smoothP
    const key = `${p.toFixed(4)}|${ptr.x.toFixed(3)}|${ptr.y.toFixed(3)}`
    // Nothing moves on its own: once scroll and pointer settle there's nothing to redraw, so approaching or resting
    // in this section costs no GPU time (an idle sway that redrew every frame made scrolling here stutter)
    if (!dirty && key === drawnKey) return null
    drawnKey = key
    dirty = false

    // The stack parts early, then holds open while each layer is explained
    const e = span(p, 0.06, 0.36)
    for (const part of Object.values(parts)) {
      const t = ease(clamp((e - part.delay * 0.5) / 0.75))
      part.group.position.copy(part.base).addScaledVector(part.off, t)
      const w = Math.sin(t * Math.PI)
      part.group.rotation.set(w * 0.05 * (part.delay ? 1 : -1), 0, w * 0.04)
    }
    shadow.position.y = parts.lining.group.position.y - 0.9 - e * 0.6
    shadow.material.opacity = 0.9 - e * 0.3

    const sway = 0
    pivot.rotation.x = 0.5 + ptr.y * 0.12
    model.rotation.y = -Math.PI / 4 + p * 0.5 + ptr.x * 0.35 + sway
    pivot.position.set(wide ? 0.4 : 0, wide ? -0.2 + e * 0.1 : 1.6, 0)
    const dist = wide ? 14.5 + e * 3.5 : 24 + e * 4
    camera.position.set(0, 0.4, dist)
    camera.lookAt(0, wide ? 0 : 0.6, 0)

    renderer.render(scene, camera)

    const labels = order.map((id) => {
      const L = parts[id]
      L.group.updateWorldMatrix(true, false)
      v.copy(L.anchor).applyMatrix4(L.group.matrixWorld).project(camera)
      return [(v.x * 0.5 + 0.5) * W, (-v.y * 0.5 + 0.5) * H]
    })
    const active = p < 0.3 ? 0 : Math.min(3, Math.floor((p - 0.3) / 0.16))
    return { labels, active, open: e }
  }
  return { draw, setSize }
}
