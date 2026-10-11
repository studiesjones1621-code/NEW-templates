// The 3D skin cross-section scene (three.js, no build step). It has no DOM access, so the same code runs in a
// Web Worker on an OffscreenCanvas (keeping the page's main thread free for scrolling) or, as a fallback, on the
// page itself. anatomy.js decides which. Same technique as the Charm syringe: every layer has a resting position and an offset; scroll progress eases
// each layer apart with a small stagger, and HTML labels are pinned to 3D anchor points by projecting them through
// the camera each frame. The layers map to where Beneath the Skin's treatments work, down to the root cause.
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.min.js"

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
export const span = (p, a, b) => clamp((p - a) / (b - a))
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

// Seeded random so the sample looks identical on every load
let seed = 7
const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646
const between = (a, b) => a + rand() * (b - a)

// A soft, warm studio "room" for reflections (no addons, so no import map is needed)
function studioEnvironment(renderer) {
  const env = new THREE.Scene()
  env.add(new THREE.Mesh(new THREE.BoxGeometry(20, 12, 20), new THREE.MeshBasicMaterial({ color: 0x2a211c, side: THREE.BackSide })))
  const panel = (w, h, color, intensity, pos, rot) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color }))
    m.material.color.multiplyScalar(intensity)
    m.position.set(...pos)
    m.rotation.set(...rot)
    env.add(m)
  }
  panel(8, 3, 0xffffff, 5, [0, 5.5, 0], [Math.PI / 2, 0, 0])
  panel(4, 8, 0xffe9d2, 4, [-9.8, 0, 0], [0, Math.PI / 2, 0])
  panel(3, 8, 0xffe2cc, 2, [9.8, 0, -2], [0, -Math.PI / 2, 0])
  const pmrem = new THREE.PMREMGenerator(renderer)
  const tex = pmrem.fromScene(env, 0.04).texture
  pmrem.dispose()
  return tex
}

// Painted cut faces, like a dermatology textbook block: stratified cells, wavy collagen with vessels, fat cells,
// and a dark "root" layer with glowing nodes
function sideTexture(kind) {
  // OffscreenCanvas in the worker; a regular canvas on older browsers that run the fallback on the page
  const c = typeof OffscreenCanvas !== "undefined" ? new OffscreenCanvas(1024, 384) : Object.assign(document.createElement("canvas"), { width: 1024, height: 384 })
  const g = c.getContext("2d")
  const W = c.width, H = c.height
  if (kind === "epidermis") {
    const grad = g.createLinearGradient(0, 0, 0, H)
    grad.addColorStop(0, "#9a6545")
    grad.addColorStop(0.25, "#c48b63")
    grad.addColorStop(1, "#e2b296")
    g.fillStyle = grad
    g.fillRect(0, 0, W, H)
    // Cells flatten as they rise to the surface
    for (let row = 0; row < 7; row++) {
      const y = H - (row + 0.5) * (H / 7)
      const cw = 40 + row * 10, ch = H / 7 - row * 3
      for (let x = (row % 2) * cw * 0.5; x < W + cw; x += cw) {
        g.strokeStyle = `rgba(110,62,40,${0.25 + row * 0.04})`
        g.lineWidth = 3
        g.beginPath()
        g.ellipse(x, y, cw * 0.46, Math.max(6, ch * 0.42), 0, 0, Math.PI * 2)
        g.stroke()
        if (row < 4) {
          g.fillStyle = "rgba(90,50,34,0.35)"
          g.beginPath()
          g.arc(x, y, 5, 0, Math.PI * 2)
          g.fill()
        }
      }
    }
  } else if (kind === "dermis") {
    g.fillStyle = "#e7b3a2"
    g.fillRect(0, 0, W, H)
    // Wavy collagen bundles
    for (let i = 0; i < 26; i++) {
      const y0 = between(10, H - 10), amp = between(6, 16), f = between(0.01, 0.025), ph = between(0, 6)
      g.strokeStyle = `rgba(250,226,212,${between(0.5, 0.9)})`
      g.lineWidth = between(3, 7)
      g.beginPath()
      for (let x = 0; x <= W; x += 8) g.lineTo(x, y0 + Math.sin(x * f + ph) * amp)
      g.stroke()
    }
    // Cut vessels: arteries red, veins blue
    for (let i = 0; i < 9; i++) {
      const x = between(40, W - 40), y = between(40, H - 40), r = between(10, 18)
      g.fillStyle = i % 2 ? "#4b5fa6" : "#b8323a"
      g.beginPath()
      g.ellipse(x, y, r * 1.3, r, between(0, 3), 0, Math.PI * 2)
      g.fill()
      g.fillStyle = "rgba(255,230,225,0.5)"
      g.beginPath()
      g.arc(x - r * 0.3, y - r * 0.3, r * 0.3, 0, Math.PI * 2)
      g.fill()
    }
  } else if (kind === "hypodermis") {
    g.fillStyle = "#e9c98d"
    g.fillRect(0, 0, W, H)
    for (let y = 18; y < H + 30; y += 44) {
      for (let x = (y / 44) % 2 ? 0 : 26; x < W + 40; x += 52) {
        const r = between(20, 27)
        g.fillStyle = "#f6e1ae"
        g.strokeStyle = "rgba(190,140,70,0.75)"
        g.lineWidth = 3
        g.beginPath()
        g.arc(x + between(-4, 4), y + between(-4, 4), r, 0, Math.PI * 2)
        g.fill()
        g.stroke()
      }
    }
  } else {
    const grad = g.createLinearGradient(0, 0, 0, H)
    grad.addColorStop(0, "#4a3428")
    grad.addColorStop(1, "#22180f")
    g.fillStyle = grad
    g.fillRect(0, 0, W, H)
    for (let i = 0; i < 70; i++) {
      const x = between(0, W), y = between(0, H), r = between(3, 9)
      const glow = g.createRadialGradient(x, y, 0, x, y, r * 4)
      glow.addColorStop(0, "rgba(255,226,190,0.95)")
      glow.addColorStop(0.3, "rgba(224,188,152,0.5)")
      glow.addColorStop(1, "rgba(224,188,152,0)")
      g.fillStyle = glow
      g.beginPath()
      g.arc(x, y, r * 4, 0, Math.PI * 2)
      g.fill()
    }
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

const S = 6 // the sample is a 6 × 6 block
// Phones and tablets get lighter geometry and materials, and only redraw while the page is scrolling
let LITE = false // set by createEngine
const Physical = (o) => {
  if (!LITE) return new THREE.MeshPhysicalMaterial(o)
  const { sheen, sheenColor, clearcoat, clearcoatRoughness, ...rest } = o
  return new THREE.MeshStandardMaterial(rest)
}

function tube(points, radius, material, segments = 64) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)))
  // Phones: fewer segments; at that size nobody can see the difference
  const seg = LITE ? Math.max(12, Math.round(segments * 0.4)) : segments
  return new THREE.Mesh(new THREE.TubeGeometry(curve, seg, radius, LITE ? 5 : 8, false), material)
}

function buildSkin() {
  const model = new THREE.Group()
  const parts = {}
  // Assembled layout (bottom → top): root 0.7, hypodermis 1.6, dermis 2.0, epidermis 0.45
  const layers = [
    { id: "root", h: 0.7, top: 0x3a2a20, off: -3.1 },
    { id: "hypodermis", h: 1.6, top: 0xeccf92, off: -1.15 },
    { id: "dermis", h: 2.0, top: 0xe8b5a4, off: 1.05 },
    { id: "epidermis", h: 0.45, top: 0xc48b63, off: 3.3 },
  ]
  let y = -2.375
  layers.forEach((L, i) => {
    const group = new THREE.Group()
    const side = new THREE.MeshStandardMaterial({ map: sideTexture(L.id), roughness: 0.75 })
    const cap = new THREE.MeshStandardMaterial({ color: L.top, roughness: 0.7 })
    const box = new THREE.Mesh(new THREE.BoxGeometry(S, L.h, S), [side, side, cap, cap, side, side])
    box.position.y = L.h / 2
    group.add(box)
    group.position.y = y
    model.add(group)
    parts[L.id] = {
      group,
      base: group.position.clone(),
      off: new THREE.Vector3(0, L.off, 0),
      delay: Math.abs(L.off) > 2 ? 0 : 0.15,
      wobble: new THREE.Vector3(0.05 * (i % 2 ? 1 : -1), 0, 0.04 * (i % 2 ? -1 : 1)),
      anchor: new THREE.Vector3(S / 2, L.h, S / 2),
      top: L.h,
    }
    y += L.h
  })

  // Epidermis: a living surface, fine creases and pores displaced into a real skin texture
  {
    const P = parts.epidermis
    const geo = new THREE.PlaneGeometry(S, S, LITE ? 110 : 180, LITE ? 110 : 180)
    geo.rotateX(-Math.PI / 2)
    const pos = geo.attributes.position
    const pores = Array.from({ length: 70 }, () => [between(-2.8, 2.8), between(-2.8, 2.8)])
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), z = pos.getZ(i)
      // Diamond-shaped crease network, like real skin under magnification
      const a = Math.abs(Math.sin((x + z) * 3.1)), b = Math.abs(Math.sin((x - z) * 2.7))
      let h = Math.min(a, b) * 0.05 + Math.sin(x * 9.1) * Math.sin(z * 8.3) * 0.008
      for (const [px, pz] of pores) {
        const d = Math.hypot(x - px, z - pz)
        if (d < 0.07) h -= (0.07 - d) * 0.9
      }
      const edge = Math.min(S / 2 - Math.abs(x), S / 2 - Math.abs(z))
      pos.setY(i, h * clamp(edge / 0.15))
    }
    geo.computeVertexNormals()
    const surface = new THREE.Mesh(
      geo,
      Physical({ color: 0xc48b63, roughness: 0.48, sheen: 0.6, sheenColor: 0xffd7bd, clearcoat: 0.25, clearcoatRoughness: 0.5 }),
    )
    surface.position.y = P.top + 0.002
    P.group.add(surface)
    P.anchor.y = P.top + 0.05
  }

  // Dermis: collagen fibers, a looping artery and vein, and hair follicles rising through the epidermis
  {
    const P = parts.dermis
    const fiber = new THREE.MeshStandardMaterial({ color: 0xf8e2d4, roughness: 0.55 })
    for (let i = 0; i < (LITE ? 22 : 34); i++) {
      const z0 = between(-2.7, 2.7), amp = between(0.08, 0.2), ph = between(0, 6), f = between(2, 3.5)
      const pts = []
      for (let k = 0; k <= 12; k++) {
        const x = -2.85 + (k / 12) * 5.7
        pts.push([x, P.top + 0.03, z0 + Math.sin(x * f + ph) * amp])
      }
      P.group.add(tube(pts, between(0.022, 0.04), fiber, 48))
    }
    const artery = new THREE.MeshStandardMaterial({ color: 0xb8323a, roughness: 0.35, metalness: 0.05 })
    const vein = new THREE.MeshStandardMaterial({ color: 0x4b5fa6, roughness: 0.35, metalness: 0.05 })
    const loop = (zs, mat, r) => {
      const pts = []
      for (let k = 0; k <= 16; k++) {
        const x = -2.9 + (k / 16) * 5.8
        pts.push([x, P.top + 0.02, zs + Math.sin(k * 0.9) * 0.55])
      }
      P.group.add(tube(pts, r, mat, 96))
    }
    loop(-1.1, artery, 0.09)
    loop(1.25, vein, 0.1)
    const hair = new THREE.MeshStandardMaterial({ color: 0x2b1a12, roughness: 0.4 })
    const bulb = new THREE.MeshStandardMaterial({ color: 0xd99a86, roughness: 0.6 })
    for (const [hx, hz] of [[-1.6, 0.3], [0.9, -0.4], [1.9, 1.9], [-0.3, 2.1], [-2.2, -2.0], [0.4, -2.3]]) {
      const lean = between(-0.35, 0.35)
      P.group.add(
        tube([[hx, P.top - 0.02, hz], [hx + lean * 0.3, P.top + 0.6, hz], [hx + lean, P.top + 1.4, hz + 0.1]], 0.035, hair, 24),
      )
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.14, LITE ? 10 : 20, LITE ? 7 : 14), bulb)
      b.scale.y = 0.6
      b.position.set(hx, P.top, hz)
      P.group.add(b)
    }
  }

  // Hypodermis: soft fat lobules that cushion and shape the face
  {
    const P = parts.hypodermis
    const count = 70
    const mesh = new THREE.InstancedMesh(
      new THREE.SphereGeometry(1, LITE ? 12 : 24, LITE ? 8 : 16),
      Physical({ color: 0xf2d38f, roughness: 0.35, sheen: 0.5, sheenColor: 0xfff1cc }),
      count,
    )
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3()
    for (let i = 0; i < count; i++) {
      const r = between(0.22, 0.4)
      p.set(between(-2.7, 2.7), P.top, between(-2.7, 2.7))
      s.set(r, r * 0.55, r)
      mesh.setMatrixAt(i, m.compose(p, q, s))
    }
    P.group.add(mesh)
  }

  // The root cause: a glowing network of nodes (hormones, gut health, inflammation) beneath everything
  {
    const P = parts.root
    const nodes = Array.from({ length: 34 }, () => new THREE.Vector3(between(-2.7, 2.7), P.top + between(0.05, 0.25), between(-2.7, 2.7)))
    const glow = new THREE.MeshStandardMaterial({ color: 0xffe2c2, emissive: 0xe0a878, emissiveIntensity: 1.6, roughness: 0.3 })
    const dots = new THREE.InstancedMesh(new THREE.SphereGeometry(1, LITE ? 8 : 16, LITE ? 6 : 12), glow, nodes.length)
    const m = new THREE.Matrix4()
    nodes.forEach((n, i) => dots.setMatrixAt(i, m.makeScale(0.09, 0.09, 0.09).setPosition(n)))
    P.group.add(dots)
    const seg = []
    nodes.forEach((a, i) => {
      nodes
        .map((b, j) => [a.distanceTo(b), j])
        .filter(([d, j]) => j > i && d < 1.5)
        .slice(0, 3)
        .forEach(([, j]) => seg.push(a, nodes[j]))
    })
    const lines = new THREE.LineSegments(
      new THREE.BufferGeometry().setFromPoints(seg),
      new THREE.LineBasicMaterial({ color: 0xe0bc98, transparent: true, opacity: 0.55 }),
    )
    P.group.add(lines)
    P.anchor.y = P.top + 0.25
    P.glow = glow
  }

  return { model, parts }
}

/**
 * Builds the scene on `canvas` (an OffscreenCanvas or a canvas element). `step` is awaited between setup stages
 * (the page passes a "wait for a quiet moment" pause; the worker needs none). Returns `draw(goal, now)`, which
 * eases toward the scroll progress `goal` and renders, returning label positions and the active step, or null
 * when nothing changed.
 */
export async function createEngine({ canvas, lite, reduce, dpr, step = async () => {} }) {
  LITE = lite
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !lite || dpr < 2, alpha: true, powerPreference: "high-performance" })
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  renderer.outputColorSpace = THREE.SRGBColorSpace

  await step()
  const scene = new THREE.Scene()
  scene.environment = studioEnvironment(renderer)
  await step()
  const key = new THREE.DirectionalLight(0xfff0de, 1.7)
  key.position.set(-6, 9, 8)
  scene.add(key)
  const rim = new THREE.DirectionalLight(0xffd9c2, 0.9)
  rim.position.set(8, -2, -6)
  scene.add(rim)

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 200)
  const { model, parts } = buildSkin()
  await step()
  const pivot = new THREE.Group()
  pivot.add(model)
  scene.add(pivot)
  const anchors = ["epidermis", "dermis", "hypodermis", "root"].map((id, i) => ({ p: parts[id], at: 0.34 + i * 0.09 }))

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

  // Upload textures and compile shaders ahead of the first frame, one piece at a time
  const textures = new Set()
  scene.traverse((o) => [o.material].flat().forEach((m) => m?.map && textures.add(m.map)))
  for (const t of textures) {
    await step()
    renderer.initTexture(t)
  }
  // Compile shaders one layer at a time (compile only covers visible objects), so the GPU never stalls for long
  const groups = Object.values(parts).map((x) => x.group)
  for (const g of groups) {
    await step()
    groups.forEach((o) => (o.visible = o === g))
    renderer.compile(scene, camera)
  }
  groups.forEach((o) => (o.visible = true))
  await step()
  renderer.render(scene, camera) // first full frame: geometry uploads
  await step()

  const v = new THREE.Vector3()
  let smoothP = 0, last = 0, time = 0, drawnP = -1
  const draw = (goal, now) => {
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016
    last = now
    time += dt
    smoothP += (goal - smoothP) * (reduce ? 1 : 1 - Math.exp(-dt * 6))
    const p = smoothP
    // On phones there's no idle spin, so once the layers settle there's nothing to redraw
    if (lite && !dirty && Math.abs(p - drawnP) < 0.0002) return null
    drawnP = p
    dirty = false

    // Layers part, hold while each one is explained, then settle back together
    const e = span(p, 0.12, 0.42) * (1 - span(p, 0.8, 0.92))
    for (const part of Object.values(parts)) {
      const t = ease(clamp((e - part.delay * 0.6) / 0.7))
      part.group.position.copy(part.base).addScaledVector(part.off, t)
      const w = Math.sin(t * Math.PI)
      part.group.rotation.set(part.wobble.x * w, part.wobble.y * w, part.wobble.z * w)
    }
    parts.root.glow.emissiveIntensity = 1.2 + (lite ? 0.3 : Math.sin(time * 2.2) * 0.5) + span(p, 0.6, 0.7) * 1.2

    pivot.rotation.x = 0.42 - e * 0.12 // look down onto the surface, flatten slightly as the layers part
    model.rotation.y = -0.6 + (reduce || lite ? 0 : time * 0.18) + p * 1.6
    // Phones: smaller and higher, so the parted layers stay above the copy and the labels fit on the right
    pivot.position.set(wide ? 4.2 : -0.9, wide ? 0 : 6.4 - e * 0.6, 0)
    pivot.scale.setScalar(wide ? 1 : 0.82)
    const dist = (wide ? 26 : 44) + e * (wide ? 9 : 10)
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
