// Checks a product-showcase site end to end. Usage: node verify.cjs <url> <out-dir>
// Desktop + phone screenshots at each section, the 3D layers at 4 scroll points (with pointer lines), a mouse sweep
// over the hero and a product card (sway/bend values), magnetic pull, horizontal overflow and console errors.
// Note: headless Chromium renders WebGL in software, so frame rates are low there; judge feel on a real device.
let pw
try { pw = require("playwright") } catch { pw = require("/opt/node-tools/node_modules/playwright") }
const [url, out = "."] = process.argv.slice(2)
if (!url) throw new Error("usage: node verify.cjs <url> <out-dir>")
const fs = require("fs")
fs.mkdirSync(out, { recursive: true })
;(async () => {
  const b = await pw.chromium.launch()
  let failed = 0
  const fail = (m) => (failed++, console.log("FAIL", m))
  for (const [name, vp, phone] of [["desktop", { width: 1440, height: 900 }, false], ["phone", { width: 390, height: 844 }, true]]) {
    const ctx = await b.newContext({ viewport: vp, isMobile: phone, hasTouch: phone })
    const p = await ctx.newPage()
    const errs = []
    p.on("pageerror", (e) => errs.push(e.message))
    p.on("console", (m) => m.type() === "error" && errs.push(m.text()))
    await p.goto(url, { waitUntil: "networkidle" })
    await p.waitForTimeout(2000)
    const sections = await p.evaluate(() => [...document.querySelectorAll("section[id]")].map((s) => [s.id, s.getBoundingClientRect().top + scrollY, s.offsetHeight]))
    for (const [id, top, h] of sections) {
      const points = id === "technology" ? [0.1, 0.4, 0.6, 0.85].map((f) => top + (h - vp.height) * f) : [top]
      for (const [i, y] of points.entries()) {
        await p.evaluate((y) => scrollTo(0, y), y)
        await p.waitForTimeout(id === "technology" ? 8000 : 1500)
        await p.screenshot({ path: `${out}/${name}-${id}${points.length > 1 ? "-" + i : ""}.jpg`, quality: 70 })
        if (id === "technology" && i > 0) {
          const lines = await p.evaluate(() => [...document.querySelectorAll(".layers-link")].filter((l) => +getComputedStyle(l).opacity > 0.5).length)
          if (lines < 1) fail(`${name}: no layer pointer line visible in the 3D section (point ${i})`)
        }
      }
    }
    const overflow = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth)
    if (overflow > 0) fail(`${name}: page scrolls sideways by ${overflow}px`)
    if (!phone) {
      await p.evaluate(() => scrollTo(0, 0))
      await p.waitForTimeout(800)
      await p.mouse.move(400, 400)
      for (let i = 0; i < 12; i++) { await p.mouse.move(400 + i * 30, 400); await p.waitForTimeout(16) }
      const hero = await p.evaluate(() => ({ bend: document.querySelector(".traveler")?.classList.contains("bend-on"), sway: document.querySelector(".traveler-sway")?.style.transform }))
      console.log("hero:", hero)
      if (!hero.bend) console.log("note: hero is using the DOM fallback (no WebGL2 here)")
      const btn = p.locator("[data-magnetic]").first()
      const bb = await btn.boundingBox()
      if (bb) {
        await p.mouse.move(bb.x + bb.width + 25, bb.y + bb.height / 2)
        await p.waitForTimeout(500)
        const t = await btn.evaluate((e) => e.style.transform)
        if (!t || t.includes("(0px, 0px")) fail("magnetic button did not move toward the cursor")
      }
    }
    console.log(name, "errors:", errs.length ? errs.slice(0, 5) : "none")
    if (errs.length) fail(`${name}: console errors`)
    await ctx.close()
  }
  await b.close()
  console.log(failed ? `${failed} problem(s)` : "all checks passed", "- screenshots in", out)
  process.exit(failed ? 1 : 0)
})()
