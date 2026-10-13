// Runs the 3D fabric stack off the page's main thread, so drawing it never competes with scrolling.
// The page sends scroll progress and pointer; the worker draws and sends back where the callout lines attach.
import { createEngine } from "./layers-scene.js"

let engine = null
let goal = 0
let pointer = [0, 0]
let visible = false
let running = false
// The page tells us when nobody is swiping; heavy setup steps wait for that so they never interrupt a scroll
let quiet = true
const waitQuiet = () =>
  new Promise((resolve) => {
    const go = () => (quiet ? setTimeout(resolve, 0) : setTimeout(go, 60))
    go()
  })
const nextFrame = self.requestAnimationFrame ? (fn) => self.requestAnimationFrame(fn) : (fn) => setTimeout(() => fn(performance.now()), 16)

const loop = (now) => {
  if (!visible || !engine) {
    running = false
    return
  }
  const out = engine.draw(goal, pointer, now)
  if (out) self.postMessage(out)
  nextFrame(loop)
}
const kick = () => {
  if (!running && visible && engine) {
    running = true
    nextFrame(loop)
  }
}

self.onmessage = async ({ data }) => {
  if (data.type === "init") {
    try {
      engine = await createEngine({ ...data, step: waitQuiet })
      engine.setSize(data.w, data.h, data.wide)
      self.postMessage({ ready: true })
    } catch {
      self.postMessage({ failed: true }) // the page falls back to drawing itself
      return
    }
    kick()
  } else if (data.type === "size") {
    engine?.setSize(data.w, data.h, data.wide)
  } else if (data.type === "state") {
    goal = data.goal
    pointer = data.pointer
    visible = data.visible
    kick()
  } else if (data.type === "quiet") {
    quiet = data.quiet
  }
}
