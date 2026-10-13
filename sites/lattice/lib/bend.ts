// Bending cut-out: draws a transparent product image (a jacket) on a finely divided WebGL sheet, so the mouse
// sway (lib/sway) curves it instead of rotating it stiffly. The body bends from the collar, so the hem trails
// further than the chest. The sleeves are part of the same sheet: they hinge at the shoulders and swing on their
// own springs, with no seams. A faint ripple runs down the fabric while the mouse is moving fast. Plain WebGL2,
// no library, and it only draws when the sway changes.

export type BendState = {
  lean: number // body lean in degrees (+ = hem swings right)
  tip: number // forward/back tip in degrees
  armL: number // extra swing of each sleeve over the body, degrees
  armR: number
  speed: number // 0..1 how fast the mouse is moving (drives the ripple)
  time: number
}

// The sheet is drawn larger than the image so the sleeves and hem can swing outside it
export const BEND_MARGIN = 0.18

const VERT = `#version 300 es
in vec2 uv;
uniform float lean, tip, armL, armR, speed, time, margin, hinge;
out vec2 vUv;
const vec2 COLLAR = vec2(0.5, 0.12);
const vec2 SHOULDER_L = vec2(0.24, 0.21);
const vec2 SHOULDER_R = vec2(0.76, 0.21);
vec2 rot(vec2 p, vec2 c, float a) {
  float s = sin(a), k = cos(a);
  p -= c;
  return c + vec2(p.x * k - p.y * s, p.x * s + p.y * k);
}
void main() {
  vUv = uv;
  // Work in image space, y down, then flip angles so "+" means the hem swings right
  vec2 p = uv;
  // Sleeves: everything outside the torso, below the shoulder line, hinges at its shoulder
  // hinge = 0 for rigid products: no sleeves, the whole cut-out bends as one piece
  float wl = hinge * smoothstep(0.31, 0.2, uv.x) * smoothstep(0.1, 0.26, uv.y);
  float wr = hinge * smoothstep(0.69, 0.8, uv.x) * smoothstep(0.1, 0.26, uv.y);
  float dl = clamp(distance(uv, SHOULDER_L) / 0.7, 0.0, 1.0);
  float dr = clamp(distance(uv, SHOULDER_R) / 0.7, 0.0, 1.0);
  p = rot(p, SHOULDER_L, -radians(armL) * wl * (0.55 + 0.8 * dl));
  p = rot(p, SHOULDER_R, -radians(armR) * wr * (0.55 + 0.8 * dr));
  // Body: bends from the collar; lower parts turn further, so the jacket curves rather than pivots
  float t = clamp((uv.y - COLLAR.y) / (1.0 - COLLAR.y), 0.0, 1.0);
  p = rot(p, COLLAR, -radians(lean) * (0.45 + 0.85 * t));
  // Fabric shear and a travelling ripple while the mouse moves fast
  p.x += radians(lean) * 0.12 * t * t;
  p.x += sin(uv.y * 13.0 - time * 9.0) * 0.006 * speed * t;
  // Tip forward/back: the hem tucks under a little
  p.y -= radians(tip) * 0.05 * t * t;
  // Image space -> clip space, inside the margin
  vec2 c = (p - 0.5) / (0.5 + margin);
  gl_Position = vec4(c.x, -c.y, 0.0, 1.0);
}`

const FRAG = `#version 300 es
precision mediump float;
in vec2 vUv;
uniform sampler2D img;
out vec4 color;
void main() {
  color = texture(img, vUv);
}`

export function createBender(canvas: HTMLCanvasElement, image: HTMLImageElement, hinges = true) {
  const gl = canvas.getContext("webgl2", { premultipliedAlpha: true, alpha: true, antialias: true })
  if (!gl) return null
  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!
    gl.shaderSource(s, src)
    gl.compileShader(s)
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || "shader")
    return s
  }
  const prog = gl.createProgram()!
  try {
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null
  } catch {
    return null
  }
  gl.useProgram(prog)

  // A 48×48 grid of triangles: fine enough for smooth bends
  const N = 48
  const verts = new Float32Array((N + 1) * (N + 1) * 2)
  for (let y = 0, i = 0; y <= N; y++) for (let x = 0; x <= N; x++) (verts[i++] = x / N), (verts[i++] = y / N)
  const idx = new Uint16Array(N * N * 6)
  for (let y = 0, i = 0; y < N; y++)
    for (let x = 0; x < N; x++) {
      const a = y * (N + 1) + x, b = a + 1, c = a + N + 1, d = c + 1
      idx.set([a, c, b, b, c, d], i)
      i += 6
    }
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
  gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW)
  const loc = gl.getAttribLocation(prog, "uv")
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer())
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx, gl.STATIC_DRAW)

  const tex = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
  gl.generateMipmap(gl.TEXTURE_2D)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

  const u = (name: string) => gl.getUniformLocation(prog, name)
  const U = { lean: u("lean"), tip: u("tip"), armL: u("armL"), armR: u("armR"), speed: u("speed"), time: u("time"), margin: u("margin") }
  gl.uniform1f(U.margin, BEND_MARGIN)
  gl.uniform1f(u("hinge"), hinges ? 1 : 0)

  let lost = false
  canvas.addEventListener("webglcontextlost", () => (lost = true))

  return {
    get lost() {
      return lost
    },
    /**
     * Match the drawing buffer to the canvas's on-screen size (capped). Reallocating a big canvas is expensive, so
     * this only happens when the size has changed a lot (it's sharp enough until it's ~25% too small, and fine to
     * be oversized), and in 128px steps. While the product is shrinking or growing between slots, CSS scales the
     * existing buffer instead of rebuilding it every frame. Returns true when it resized (then redraw).
     */
    resize(cssPx: number, dpr = devicePixelRatio || 1) {
      const want = Math.min(1536, cssPx * Math.min(dpr, 2))
      const have = canvas.width
      if (have >= want * 0.75 && have <= want * 2) return false
      const px = Math.max(128, Math.min(1536, Math.ceil(want / 128) * 128))
      canvas.width = canvas.height = px
      gl.viewport(0, 0, px, px)
      return true
    },
    draw(s: BendState) {
      if (lost) return
      gl.uniform1f(U.lean, s.lean)
      gl.uniform1f(U.tip, s.tip)
      gl.uniform1f(U.armL, s.armL)
      gl.uniform1f(U.armR, s.armR)
      gl.uniform1f(U.speed, s.speed)
      gl.uniform1f(U.time, s.time)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawElements(gl.TRIANGLES, idx.length, gl.UNSIGNED_SHORT, 0)
    },
  }
}

/** Loads the image (already cached by the page's <img>) and resolves once it can be uploaded. */
export const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.decoding = "async"
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
