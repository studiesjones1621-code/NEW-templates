// Scroll-driven exploded cross-section of human skin. This file is the page side: it tracks scroll progress,
// places the HTML labels and highlights the steps. The 3D drawing itself (anatomy-scene.js) runs in a Web Worker
// on an OffscreenCanvas wherever the browser supports it, so three.js loading, setup and every frame happen off
// the main thread and can never make the page's scrolling stutter. Older browsers draw on the page instead.

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const LITE = matchMedia("(max-width: 1023px), (pointer: coarse)").matches

let lastScroll = 0
addEventListener("scroll", () => (lastScroll = performance.now()), { passive: true })

// Waits for a quiet moment: a frame where the page isn't being swiped (or the section is about to show)
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
    // WebGL inside OffscreenCanvas (missing on older Safari, which only had 2D)
    return !!new OffscreenCanvas(1, 1).getContext("webgl2")
  } catch {
    return false
  }
}

export async function init(root) {
  const stage = root.querySelector("[data-anatomy-stage]")
  let canvas = root.querySelector("canvas")
  const labelsEl = root.querySelector("[data-anatomy-labels]")
  const steps = [...root.querySelectorAll("[data-step]")]
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches

  const labels = [
    ["01", "Epidermis"],
    ["02", "Dermis"],
    ["03", "Hypodermis"],
    ["04", "The root cause"],
  ].map(([n, text]) => {
    const el = document.createElement("div")
    el.className = "anatomy-tag"
    el.innerHTML = `<span class="anatomy-pin"></span><span class="anatomy-txt"><b>${n}</b>${text}</span>`
    labelsEl.appendChild(el)
    return el
  })
  let activeStep = -1
  const apply = ({ labels: pos, active }) => {
    pos.forEach(([x, y, o], i) => {
      labels[i].style.opacity = String(o)
      labels[i].style.transform = `translate3d(${x}px, ${y}px, 0)`
    })
    if (active !== activeStep) {
      activeStep = active
      steps.forEach((s) => s.toggleAttribute("data-active", Number(s.dataset.step) === active))
    }
  }

  const size = () => {
    const w = root.clientWidth
    return { w, h: Math.min(stage.clientHeight, innerHeight), wide: w >= 1024 }
  }
  const goal = () => {
    const r = root.getBoundingClientRect()
    return clamp(-r.top / Math.max(1, root.offsetHeight - Math.min(stage.clientHeight, innerHeight)))
  }

  let visible = false
  new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: "100px" }).observe(root)

  // Hide the header and the assistant pop-up while the stage is pinned, so nothing covers it
  const pinCheck = () => {
    const r = root.getBoundingClientRect()
    document.documentElement.classList.toggle("anatomy-pinned", r.top <= 2 && r.bottom >= innerHeight * 0.9)
  }
  addEventListener("scroll", pinCheck, { passive: true })
  pinCheck()

  const common = { lite: LITE, reduce, dpr: devicePixelRatio }

  if (canUseWorker()) {
    try {
      const worker = new Worker(new URL("./anatomy-worker.js", import.meta.url), { type: "module" })
      const offscreen = canvas.transferControlToOffscreen()
      // Let the worker know when the page is still, so its setup work never lands mid-swipe
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
        // Only a couple of numbers cross to the worker each frame; it does all the drawing
        let sent = ""
        const tick = () => {
          requestAnimationFrame(tick)
          const msg = visible ? `${goal().toFixed(5)}` : "hidden"
          if (msg === sent) return
          sent = msg
          worker.postMessage({ type: "state", goal: visible ? goal() : 0, visible })
        }
        requestAnimationFrame(tick)
        return
      }
      worker.terminate()
      // The canvas now belongs to the dead worker; swap in a fresh one for the fallback
      const fresh = canvas.cloneNode(false)
      canvas.replaceWith(fresh)
      canvas = fresh
    } catch {
      /* fall through to drawing on the page */
    }
  }

  // Fallback: draw on the page, with setup split into small steps that run only while the page is still
  const { createEngine } = await import("./anatomy-scene.js")
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
    const out = engine.draw(goal(), now)
    if (out) apply(out)
  }
  requestAnimationFrame(frame)
}

// Setting up 3D briefly ties up the graphics pipeline (context, shaders, textures), whatever thread does it. So it
// happens early, in the first quiet moment after the page opens (usually while the visitor reads the headline),
// rather than when they reach the section mid-swipe. The section coming close forces it as a fallback.
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

const auto = document.querySelector("[data-anatomy]")
if (auto) lazy(auto)
