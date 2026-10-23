// Verifies the site-music behaviour in headless Chromium on a phone viewport.
// Usage: node test-music.cjs <site-url>
// Checks: autoplay blocked -> silent until first tap, then playing; toggle mutes; mute is remembered after reload;
// autoplay allowed -> plays on its own. Uses the global Playwright install and /opt/pw-browsers/chromium.
const { chromium } = require(require('child_process').execSync('npm root -g').toString().trim()+'/playwright');
(async()=>{
 for (const [label,policy] of [['autoplay-blocked','user-gesture-required'],['autoplay-allowed','no-user-gesture-required']]) {
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--autoplay-policy='+policy]});
  const ctx=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.addInitScript(()=>{ const O=window.Audio; window.Audio=function(...a){ const el=new O(...a); window.__music=el; return el }; });
  await p.goto(process.argv[2],{waitUntil:'load'}); await p.waitForTimeout(3500);
  const st=()=>p.evaluate(()=>({pressed:document.querySelector('.site-music').getAttribute('aria-pressed'),bars:document.querySelector('.site-music').dataset.sound,playing: window.__music? !window.__music.paused:false}));
  console.log(label,'after load', JSON.stringify(await st()));
  await p.touchscreen.tap(200,500); await p.waitForTimeout(2500); console.log(label,'after first tap on page', JSON.stringify(await st()));
  await p.locator('.site-music').tap(); await p.waitForTimeout(2200); console.log(label,'tap toggle', JSON.stringify(await st()), errs);
  if(label==='autoplay-blocked'){ await p.screenshot({path:require('path').join(require('os').tmpdir(),'music3-m.png'),clip:{x:0,y:0,width:390,height:90}}); await p.reload({waitUntil:'load'}); await p.waitForTimeout(2000); await p.touchscreen.tap(200,500); await p.waitForTimeout(2000); console.log(label,'reload after muting, tap', JSON.stringify(await st())); }
  await b.close(); }
})();
