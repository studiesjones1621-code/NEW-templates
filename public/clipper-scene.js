// The 3D exploded clipper (three.js, no build step). It has no DOM access, so the same code runs in a Web Worker on an
// OffscreenCanvas (keeping the page's main thread free for scrolling) or, as a fallback, on the page itself;
// clipper.js decides which. Technique as on the Charm and Beneath the Skin sites: every part has a resting position and
// an offset, scroll progress eases each part apart with a small stagger, and the labels are projected from 3D anchors.
//
// Modeled on Reem's own cordless clipper (from his portrait photo): an angular, faceted matte-black body that tapers
// to the grip, a side taper lever, and here gold blades and gold trim to match the site's black-and-gold brand.
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.min.js"

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
export const span = (p, a, b) => clamp((p - a) / (b - a))
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

let LITE = false // set by createEngine

// A warm studio "room" for reflections on the gold and the satin black (no addons needed)
function studioEnvironment(renderer) {
  const env = new THREE.Scene()
  env.add(new THREE.Mesh(new THREE.BoxGeometry(20, 12, 20), new THREE.MeshBasicMaterial({ color: 0x15130f, side: THREE.BackSide })))
  const panel = (w, h, color, intensity, pos, rot) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color }))
    m.material.color.multiplyScalar(intensity)
    m.position.set(...pos)
    m.rotation.set(...rot)
    env.add(m)
  }
  panel(8, 3, 0xffffff, 5, [0, 5.5, 0], [Math.PI / 2, 0, 0])
  panel(4, 8, 0xffe7c4, 5, [-9.8, 0, 0], [0, Math.PI / 2, 0])
  panel(3, 8, 0xfff2dc, 2.5, [9.8, 0, -2], [0, -Math.PI / 2, 0])
  panel(10, 1, 0xffd9a0, 1.5, [0, -4, -9.8], [0, 0, 0])
  const pmrem = new THREE.PMREMGenerator(renderer)
  const tex = pmrem.fromScene(env, 0.04).texture
  pmrem.dispose()
  return tex
}

const MAT = () => {
  const physical = (o) => (LITE ? new THREE.MeshStandardMaterial(o) : new THREE.MeshPhysicalMaterial(o))
  return {
    // Satin black body with a soft clear-coat sheen, flat-shaded so the facets catch the light like the real one
    shell: physical({ color: 0x1a1a1c, roughness: 0.42, metalness: 0.15, flatShading: true, side: THREE.DoubleSide, ...(LITE ? {} : { clearcoat: 0.5, clearcoatRoughness: 0.35 }) }),
    inner: new THREE.MeshStandardMaterial({ color: 0x0c0c0d, roughness: 0.9, side: THREE.DoubleSide }),
    gold: new THREE.MeshStandardMaterial({ color: 0xd8b25a, metalness: 1, roughness: 0.22 }),
    goldDark: new THREE.MeshStandardMaterial({ color: 0xa8823a, metalness: 1, roughness: 0.32 }),
    steel: new THREE.MeshStandardMaterial({ color: 0xb8bcc2, metalness: 1, roughness: 0.28 }),
    copper: new THREE.MeshStandardMaterial({ color: 0xb8692e, metalness: 1, roughness: 0.35 }),
    pcb: new THREE.MeshStandardMaterial({ color: 0x1d3b2a, roughness: 0.6 }),
    chip: new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 }),
    cell: new THREE.MeshStandardMaterial({ color: 0x232326, roughness: 0.5, metalness: 0.2 }),
  }
}

// A blade plate with real teeth along its top edge, extruded to its thickness
function bladeGeometry(width, height, teeth, toothLen, thick) {
  const s = new THREE.Shape()
  const w = width / 2
  s.moveTo(-w, 0)
  s.lineTo(w, 0)
  s.lineTo(w, height)
  const step = width / teeth
  for (let i = teeth - 1; i >= 0; i--) {
    const x0 = -w + i * step
    s.lineTo(x0 + step * 0.78, height)
    s.lineTo(x0 + step * 0.62, height + toothLen)
    s.lineTo(x0 + step * 0.38, height + toothLen)
    s.lineTo(x0 + step * 0.22, height)
  }
  s.lineTo(-w, height)
  s.lineTo(-w, 0)
  const g = new THREE.ExtrudeGeometry(s, { depth: thick, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 1 })
  g.translate(0, 0, -thick / 2)
  return g
}

function buildClipper() {
  const M = MAT()
  const model = new THREE.Group()
  const parts = {}
  const add = (id, offset, delay, anchor, wobble = [0, 0, 0]) => {
    const group = new THREE.Group()
    model.add(group)
    parts[id] = {
      group,
      base: new THREE.Vector3(),
      off: new THREE.Vector3(...offset),
      delay,
      wobble: new THREE.Vector3(...wobble),
      anchor: new THREE.Vector3(...anchor),
    }
    return group
  }
  const seg = LITE ? 1 : 2

  // Body: a faceted octagonal shell that tapers from the head (y≈3.4) to the grip (y≈-4.6), split front and back
  const bodyLen = 6.6, rTop = 2.05, rBot = 1.4
  const shellGeo = (front) => {
    const g = new THREE.CylinderGeometry(rTop, rBot, bodyLen, 8, seg, false, front ? 0 : Math.PI, Math.PI)
    g.scale(1, 1, 0.66) // flatter front to back, like a real clipper
    g.translate(0, 0.1, 0)
    return g
  }
  const shellFront = add("shellFront", [0, 0, 2.2], 0.05, [rTop * 0.85, -1.2, 0.9], [0.06, 0, 0.03])
  const shellBack = add("shellBack", [0, 0, -2.2], 0.05, [0, 0, 0], [-0.06, 0, -0.03])
  shellFront.add(new THREE.Mesh(shellGeo(true), M.shell))
  shellBack.add(new THREE.Mesh(shellGeo(false), M.shell))
  // Gold trim: the grip ring and a small crown badge on the front, plus the power button
  const ring = new THREE.Mesh(new THREE.TorusGeometry(rBot * 1.0, 0.07, 10, 8, Math.PI), M.gold)
  ring.scale.set(1, 0.66, 1)
  ring.rotation.x = Math.PI / 2
  ring.rotation.z = Math.PI
  ring.position.y = -2.85
  shellFront.add(ring)
  const ringB = ring.clone()
  ringB.rotation.z = 0
  shellBack.add(ringB)
  const badge = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.06, 6), M.gold)
  badge.rotation.x = Math.PI / 2
  badge.position.set(0, 1.4, 1.2)
  shellFront.add(badge)
  const button = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.08, 20), M.goldDark)
  button.rotation.x = Math.PI / 2
  button.position.set(0, -1.0, 1.08)
  shellFront.add(button)
  // LED dots under the button, like the charge indicator on Reem's tools
  for (let i = 0; i < 4; i++) {
    const d = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 6), new THREE.MeshStandardMaterial({ color: 0xffe2a0, emissive: 0xffc860, emissiveIntensity: 1.2 }))
    d.position.set(-0.27 + i * 0.18, -1.45, 1.04)
    shellFront.add(d)
  }
  // Base cap with the charging contacts
  const cap = add("cap", [0, -1.8, 0], 0.15, [0, -3.4, 0])
  const capMesh = new THREE.Mesh(new THREE.CylinderGeometry(rBot * 0.98, rBot * 0.9, 0.35, 8), M.gold)
  capMesh.scale.set(1, 1, 0.66)
  capMesh.position.y = -3.4
  cap.add(capMesh)

  // Blades: the wide stationary blade behind, the finer cutting blade in front of it
  const blades = add("blades", [0, 2.4, 0.35], 0, [1.9, 4.65, 0], [0.08, 0, -0.04])
  const fixed = new THREE.Mesh(bladeGeometry(4.0, 0.9, 32, 0.42, 0.1), M.gold)
  fixed.position.set(0, 3.45, 0.18)
  blades.add(fixed)
  const cutter = new THREE.Mesh(bladeGeometry(3.5, 0.7, 28, 0.3, 0.08), M.steel)
  cutter.position.set(0, 3.5, 0.33)
  blades.add(cutter)
  // Two gold screws through the fixed blade
  for (const x of [-1.0, 1.0]) {
    const screw = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.12, 14), M.goldDark)
    screw.rotation.x = Math.PI / 2
    screw.position.set(x, 3.75, 0.28)
    blades.add(screw)
  }

  // Taper lever and the blade drive: the lever arm on its pivot, the eccentric cam that rocks the cutter
  const lever = add("lever", [2.2, 1.2, 0], 0.1, [2.45, 2.55, 0], [0, 0, -0.15])
  const arm = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.5, 0.22), M.gold)
  arm.position.set(2.15, 2.15, 0)
  arm.rotation.z = -0.25
  lever.add(arm)
  const pivot = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.35, 16), M.goldDark)
  pivot.rotation.z = Math.PI / 2
  pivot.position.set(2.0, 2.8, 0)
  lever.add(pivot)
  const drive = add("drive", [0, 1.4, 0], 0.1, [0, 2.6, 0])
  const cam = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.35, 20), M.goldDark)
  cam.rotation.x = Math.PI / 2
  cam.position.set(0.12, 2.65, 0)
  drive.add(cam)
  const camPin = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.6, 12), M.steel)
  camPin.position.set(0.12, 2.95, 0)
  drive.add(camPin)

  // Motor: a steel can with copper windings showing through, and its shaft up to the cam
  const motor = add("motor", [0, 0.4, 0], 0.15, [0.85, 1.1, 0.5], [0.04, 0, 0.04])
  const can = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 2.1, 24, 1, true), M.steel)
  can.position.y = 1.05
  motor.add(can)
  for (let i = 0; i < 9; i++) {
    const w = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.07, 8, 24), M.copper)
    w.rotation.x = Math.PI / 2
    w.position.y = 0.25 + i * 0.21
    motor.add(w)
  }
  const top = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.12, 24), M.goldDark)
  top.position.y = 2.18
  motor.add(top)
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.6, 10), M.steel)
  shaft.position.y = 2.5
  motor.add(shaft)

  // Battery pack and control board
  const power = add("power", [0, -1.0, 0], 0.2, [0.75, -1.4, 0.5], [-0.04, 0, -0.04])
  for (const x of [-0.42, 0.42]) {
    const cell = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 2.2, 20), M.cell)
    cell.position.set(x, -1.35, -0.05)
    power.add(cell)
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.405, 0.405, 0.18, 20), M.gold)
    band.position.set(x, -0.2, -0.05)
    power.add(band)
  }
  const board = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.9, 0.06), M.pcb)
  board.position.set(0, -1.35, 0.48)
  power.add(board)
  for (const [x, y, w, h] of [[-0.3, -0.85, 0.45, 0.35], [0.35, -1.3, 0.3, 0.3], [-0.2, -1.9, 0.55, 0.25]]) {
    const c = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.08), M.chip)
    c.position.set(x, y, 0.54)
    power.add(c)
  }

  for (const p of Object.values(parts)) p.base.copy(p.group.position)
  return { model, parts }
}

/**
 * Builds the scene on `canvas` (an OffscreenCanvas or a canvas element). `step` is awaited between setup stages.
 * Returns `draw(goal, now)`, which eases toward the scroll progress `goal` and renders, returning label positions and
 * the active step, or null when nothing changed.
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
  const key = new THREE.DirectionalLight(0xfff0d8, 2.2)
  key.position.set(-6, 9, 8)
  scene.add(key)
  const rim = new THREE.DirectionalLight(0xffcf80, 1.6)
  rim.position.set(7, 2, -6)
  scene.add(rim)

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 200)
  const { model, parts } = buildClipper()
  await step()
  const pivot = new THREE.Group()
  pivot.add(model)
  scene.add(pivot)
  const anchors = [
    { p: parts.blades, at: 0.34 },
    { p: parts.lever, at: 0.43 },
    { p: parts.motor, at: 0.52 },
    { p: parts.shellFront, at: 0.61 },
  ]

  let W = 1, H = 1, wide = true, dirty = true
  const setSize = (w, h, isWide) => {
    W = w
    H = h
    wide = isWide
    renderer.setPixelRatio(Math.min(dpr, wide ? 1.75 : 1.25))
    renderer.setSize(W, H, false)
    camera.aspect = W / H
    camera.fov = wide ? 30 : 38
    camera.updateProjectionMatrix()
    dirty = true
  }

  // Compile shaders one part at a time (compile only covers visible objects), so the GPU never stalls for long
  const groups = Object.values(parts).map((x) => x.group)
  for (const g of groups) {
    await step()
    groups.forEach((o) => (o.visible = o === g))
    renderer.compile(scene, camera)
  }
  groups.forEach((o) => (o.visible = true))
  await step()
  renderer.render(scene, camera)
  await step()

  const v = new THREE.Vector3()
  let smoothP = 0, last = 0, time = 0, drawnP = -1
  const draw = (goal, now) => {
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016
    last = now
    time += dt
    smoothP += (goal - smoothP) * (reduce ? 1 : 1 - Math.exp(-dt * 6))
    const p = smoothP
    // On phones there's no idle spin, so once the parts settle there's nothing to redraw
    if (lite && !dirty && Math.abs(p - drawnP) < 0.0002) return null
    drawnP = p
    dirty = false

    // Parts come apart, hold while each one is explained, then click back together
    const e = span(p, 0.12, 0.42) * (1 - span(p, 0.8, 0.92))
    for (const part of Object.values(parts)) {
      const t = ease(clamp((e - part.delay * 0.6) / 0.7))
      part.group.position.copy(part.base).addScaledVector(part.off, t)
      const w = Math.sin(t * Math.PI)
      part.group.rotation.set(part.wobble.x * w, part.wobble.y * w, part.wobble.z * w)
    }

    // Tilted like it is resting in the hand, turning to show its side as it opens
    pivot.rotation.z = -0.5 + e * 0.25
    pivot.rotation.x = 0.18
    model.rotation.y = -0.55 + (reduce || lite ? 0 : Math.sin(time * 0.35) * 0.25) + p * 1.4 + e * 0.4
    // Phones: smaller and higher, so the parts stay above the copy and the labels fit on the right
    pivot.position.set(wide ? 4.4 : -1.3, wide ? -0.4 : 6.2 - e * 0.5, 0)
    pivot.scale.setScalar(wide ? 1 : 0.9)
    const dist = (wide ? 27 : 44) + e * (wide ? 9 : 10)
    camera.position.set(0, 0.6, dist)
    camera.lookAt(0, wide ? 0 : 1.4, 0)

    renderer.render(scene, camera)

    const labels = anchors.map((L) => {
      L.p.group.updateWorldMatrix(true, false)
      v.copy(L.p.anchor).applyMatrix4(L.p.group.matrixWorld).project(camera)
      const on = clamp((p - L.at) / 0.06) * (1 - span(p, 0.8, 0.86))
      return [(v.x * 0.5 + 0.5) * W, (-v.y * 0.5 + 0.5) * H, on]
    })
    const active = p < 0.3 ? 0 : p > 0.82 ? 5 : 1 + Math.min(3, Math.floor((p - 0.3) / 0.12))
    return { labels, active }
  }
  return { draw, setSize }
}
