// Scroll-driven exploded fabric stack. This file is the page side: it tracks scroll progress and the pointer, draws
// the callout lines from each layer to its card and highlights the active card. The 3D drawing itself
// (layers-scene.js) runs in a Web Worker on an OffscreenCanvas wherever the browser supports it, so three.js
// setup and every frame happen off the main thread. Older browsers draw on the page instead.

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const LITE = matchMedia("(max-width: 1023px), (pointer: coarse)").matches

let lastScroll = 0
addEventListener("scroll", () => (lastScroll = performance.now()), { passive: true })

const pause = (root) =>
  new Promise((resolve) => {
    const go = () =>
      performance.now() - lastScroll > 150 || root.getBoundingClientRect().top < innerHeight * 1.1
        ? requestAnimationFrame(() => setTimeout(resolve, 0))
        : setTimeout(go, 100)
    go()
  })

const canUseWorker = () => {
  try {
    if (!("OffscreenCanvas" in window) || !HTMLCanvasElement.prototype.transferControlToOffscreen) return false
    return !!new OffscreenCanvas(1, 1).getContext("webgl2")
  } catch {
    return false
  }
}

export async function init(root) {
  const stage = root.querySelector("[data-layers-stage]")
  let canvas = root.querySelector("canvas")
  const cards = [...root.querySelectorAll("[data-layer-card]")]
  const svg = root.querySelector("[data-layers-lines]")
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches

  // One connector (line + end dot) per layer
  const NS = "http://www.w3.org/2000/svg"
  const links = cards.map(() => {
    const line = document.createElementNS(NS, "path")
    line.setAttribute("class", "layers-link")
    const dot = document.createElementNS(NS, "rect")
    dot.setAttribute("width", "7")
    dot.setAttribute("height", "7")
    dot.setAttribute("class", "layers-dot")
    svg.append(line, dot)
    return { line, dot }
  })

  let stageRect = stage.getBoundingClientRect()
  let cardPts = []
  const measure = () => {
    stageRect = stage.getBoundingClientRect()
    cardPts = cards.map((c) => {
      const r = c.getBoundingClientRect()
      return [r.left - stageRect.left, r.top - stageRect.top + 22, r.right - stageRect.left, r.top - stageRect.top]
    })
  }

  let activeStep = -1
  const apply = ({ labels, active, open }) => {
    if (!cardPts.length) measure()
    const wide = stageRect.width >= 1024
    labels.forEach(([x, y], i) => {
      const [cx, cy, cr, ct] = cardPts[i] || [x, y, x, y]
      const on = i === active ? 1 : 0
      const shown = clamp((open - 0.5) * 4)
      let d
      if (wide) {
        // Desktop: elbow from the layer across to its card on the right
        const mid = cx - 28
        d = `M${x.toFixed(1)} ${y.toFixed(1)} L${mid.toFixed(1)} ${cy.toFixed(1)} L${cx.toFixed(1)} ${cy.toFixed(1)}`
      } else {
        // Phones: one card at a time under the stack. The line runs out to the right edge (clear of the layers),
        // down the margin and hooks into the top of the card, so each fact still points at its layer.
        const edge = Math.min(stageRect.width - 8, cr + 8)
        d = `M${x.toFixed(1)} ${y.toFixed(1)} L${edge.toFixed(1)} ${y.toFixed(1)} L${edge.toFixed(1)} ${(ct + 22).toFixed(1)} L${cr.toFixed(1)} ${(ct + 22).toFixed(1)}`
      }
      links[i].line.setAttribute("d", d)
      // Phones show only the active pointer; desktop keeps the others faint
      links[i].line.style.opacity = String(shown * (wide ? 0.18 + on * 0.82 : on))
      links[i].dot.setAttribute("x", (x - 3.5).toFixed(1))
      links[i].dot.setAttribute("y", (y - 3.5).toFixed(1))
      links[i].dot.style.opacity = String(shown * (wide ? 0.35 + on * 0.65 : on))
      links[i].dot.classList.toggle("is-active", !!on)
    })
    if (active !== activeStep) {
      activeStep = active
      cards.forEach((c, i) => c.toggleAttribute("data-active", i === active))
      measure()
    }
  }

  const size = () => {
    const w = stage.clientWidth
    return { w, h: stage.clientHeight, wide: w >= 1024 }
  }
  const goal = () => {
    const r = root.getBoundingClientRect()
    return clamp(-r.top / Math.max(1, root.offsetHeight - stage.clientHeight))
  }
  const pointer = [0, 0]
  if (!LITE)
    addEventListener("pointermove", (e) => {
      pointer[0] = (e.clientX / innerWidth) * 2 - 1
      pointer[1] = (e.clientY / innerHeight) * 2 - 1
    }, { passive: true })

  let visible = false
  new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: "100px" }).observe(root)
  addEventListener("resize", measure)
  // Cards can reflow when fonts land
  document.fonts?.ready.then(measure)

  const common = { lite: LITE, reduce, dpr: devicePixelRatio }

  if (canUseWorker()) {
    try {
      const worker = new Worker(new URL("./layers-worker.js", import.meta.url), { type: "module" })
      const offscreen = canvas.transferControlToOffscreen()
      let wasQuiet = true
      const quietTimer = setInterval(() => {
        const q = performance.now() - lastScroll > 400 || root.getBoundingClientRect().top < innerHeight * 1.1
        if (q !== wasQuiet) worker.postMessage({ type: "quiet", quiet: (wasQuiet = q) })
      }, 50)
      const ok = await new Promise((resolve) => {
        worker.onmessage = ({ data }) => (data.ready ? resolve(true) : data.failed ? resolve(false) : data.labels && apply(data))
        worker.onerror = () => resolve(false)
        worker.postMessage({ type: "init", canvas: offscreen, ...common, ...size() }, [offscreen])
      })
      clearInterval(quietTimer)
      if (ok) {
        worker.onmessage = ({ data }) => data.labels && apply(data)
        addEventListener("resize", () => worker.postMessage({ type: "size", ...size() }))
        let sent = ""
        const tick = () => {
          requestAnimationFrame(tick)
          const msg = visible ? `${goal().toFixed(5)}|${pointer.join()}` : "hidden"
          if (msg === sent) return
          sent = msg
          worker.postMessage({ type: "state", goal: visible ? goal() : 0, pointer: [...pointer], visible })
        }
        requestAnimationFrame(tick)
        return
      }
      worker.terminate()
      const fresh = canvas.cloneNode(false)
      canvas.replaceWith(fresh)
      canvas = fresh
    } catch {
      /* fall through to drawing on the page */
    }
  }

  const { createEngine } = await import("./layers-scene.js")
  const engine = await createEngine({ canvas, ...common, step: () => pause(root) })
  const s = size()
  engine.setSize(s.w, s.h, s.wide)
  addEventListener("resize", () => {
    const n = size()
    engine.setSize(n.w, n.h, n.wide)
  })
  const frame = (now) => {
    requestAnimationFrame(frame)
    if (!visible) return
    const out = engine.draw(goal(), pointer, now)
    if (out) apply(out)
  }
  requestAnimationFrame(frame)
}

// Setting up 3D briefly ties up the graphics pipeline, whatever thread does it, so it happens in the first quiet
// moment after the page opens rather than when the visitor reaches the section mid-swipe.
export function lazy(root) {
  if (!root || root.dataset.lazy) return
  root.dataset.lazy = "1"
  let started = false
  const start = () => {
    if (started) return
    started = true
    init(root)
  }
  const wait = () => {
    if (started) return
    const close = root.getBoundingClientRect().top < innerHeight * 1.5
    if (close || performance.now() - lastScroll > 700) start()
    else setTimeout(wait, 100)
  }
  wait()
}

const auto = document.querySelector("[data-layers]")
if (auto) lazy(auto)
