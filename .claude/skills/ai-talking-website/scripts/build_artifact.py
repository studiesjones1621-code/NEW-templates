#!/usr/bin/env python3
"""Turn a Next.js static export of the site into a single artifact page (claude.ai Artifact).

Usage:
  1. Temporarily add `output: "export"` to next.config.mjs, run `npx next build`, restore the config
     (and `git checkout tsconfig.json` if Next touched it). The export lands in ./out — move it aside.
  2. python3 build_artifact.py <export-dir> <artifact-dir> "<Page Title>"
  3. Publish <artifact-dir>/index.html with the Artifact tool, root=<artifact-dir>, files = every
     biz/... and brand/... path the page references (grep 'src="(biz|brand)/').

What it does, and why: artifacts run under a strict CSP (no outside scripts, iframes or mic), and
the page is wrapped in its own <html> skeleton. So it inlines the CSS with next/font woff2 files as
data URIs, keeps only the server-rendered body markup (no Next runtime), makes scroll-reveal
content visible at rest, swaps the Google Maps iframe for a photo card linking to Maps, and adds
small vanilla JS for the header, mobile menu, menu accordion, cinematic hero, open-now badge and
a note explaining the voice assistant runs on the deployed site. Selectors match the bundled
components (assets/components); adjust if the site's markup differs.
"""
import re, sys, base64, pathlib, shutil
src = pathlib.Path(sys.argv[1]); dst = pathlib.Path(sys.argv[2])
page_title = sys.argv[3] if len(sys.argv) > 3 else "Business Site"
html = (src/"index.html").read_text()

# 1. CSS, with next/font woff2 files embedded as data URIs (they're small)
css = ""
for href in re.findall(r'<link rel="stylesheet" href="([^"]+)"', html):
    css += (src/href.lstrip("/")).read_text() + "\n"
def font_uri(m):
    data = (src/"_next/static/media"/m.group(1).split("/")[-1]).read_bytes()
    return "url(data:font/woff2;base64," + base64.b64encode(data).decode() + ")"
css = re.sub(r'url\(([^)]*media/[^)]+\.woff2)\)', font_uri, css)

# 2. Body markup only, no Next runtime scripts
body = re.search(r'<body[^>]*>(.*)</body>', html, re.S).group(1)
body_cls = re.search(r'<body class="([^"]*)"', html).group(1)
html_cls = re.search(r'<html[^>]*class="([^"]*)"', html).group(1)
body = re.sub(r'<script\b[^>]*>.*?</script>', '', body, flags=re.S)
body = re.sub(r'<link[^>]*>', '', body)
body = re.sub(r'<template\b.*?</template>', '', body, flags=re.S)
body = re.sub(r'<div hidden="">.*?</div>', '', body, flags=re.S)

# 3. Relative asset paths
body = body.replace('src="/biz/', 'src="biz/').replace('src="/brand/', 'src="brand/')

# 4. Visible at rest: drop scroll-reveal hidden states
body = body.replace('opacity-0 translate-y-8', 'opacity-100 translate-y-0').replace('opacity-0 translate-y-6', 'opacity-100 translate-y-0')
body = body.replace('transform:scaleY(1)', 'transform:scaleY(0)')
body = body.replace('stroke-dashoffset:200', 'stroke-dashoffset:0')

# 5. Map iframe is blocked in artifacts: swap for a styled directions card
def map_card(m):
    title = re.search(r'title="Map to ([^"]+)"', m.group(0))
    place = title.group(1) if title else ""
    from urllib.parse import quote
    import html as _h
    place = _h.unescape(place)
    addr = place.split(", ", 1)[1] if ", " in place else place
    photo = next((f"biz/{f.name}" for f in sorted((src/"biz").glob("*")) if "studio" in f.name or "office" in f.name or "interior" in f.name), None)
    img = f'<img src="{photo}" alt="Inside the business" />' if photo else ""
    return (f'<a href="https://www.google.com/maps/search/?api=1&amp;query={quote(place)}" target="_blank" rel="noopener noreferrer" class="fcc-mapcard">'
            f'{img}<span class="fcc-mapcard-label"><strong>{_h.escape(addr)}</strong><span>Get directions ↗</span></span></a>')
body = re.sub(r'<iframe[^>]*></iframe>', map_card, body)

extra_css = """
:root{color-scheme:light}
html,body{background:oklch(0.975 0.007 85)}
body{margin:0}
.fcc-mapcard{position:absolute;inset:0;display:block;color:#fff;text-decoration:none}
.fcc-mapcard img{width:100%;height:100%;object-fit:cover;filter:brightness(.55)}
.fcc-mapcard-label{position:absolute;left:24px;right:24px;bottom:24px;display:flex;flex-direction:column;gap:4px;font-size:15px}
.fcc-mapcard-label strong{font-size:22px;font-weight:500}
.fcc-mapcard-label span{color:oklch(0.86 0.09 88)}
.fcc-mapcard:hover img{filter:brightness(.7)}
#fcc-note{position:fixed;z-index:70;right:16px;bottom:calc(88px + env(safe-area-inset-bottom,0px));max-width:min(20rem,calc(100vw - 32px));background:oklch(0.985 0.005 85);color:oklch(0.17 0.008 70);border:1px solid oklch(0.88 0.012 85);box-shadow:0 20px 40px rgba(0,0,0,.18);padding:16px 18px;font-size:14px;line-height:1.5}
#fcc-note b{display:block;margin-bottom:4px}
#fcc-note .num{font-weight:700;user-select:all}
#fcc-note button{position:absolute;top:8px;right:10px;border:0;background:none;font-size:18px;cursor:pointer;color:inherit}
"""

js = r"""
(function(){
  var header = document.querySelector('header');
  var top = 'bg-transparent py-4 top-0 left-0 right-0'.split(' ');
  var scrolled = 'bg-primary/95 backdrop-blur-md py-3 top-3 left-3 right-3 md:top-4 md:left-4 md:right-4 rounded-2xl shadow-lg shadow-black/20'.split(' ');
  var menuBtn = header.querySelector('button[aria-label="Open menu"]');
  var panel = header.lastElementChild;
  var open = false;
  function paint(){
    var on = window.scrollY > 50 || open;
    top.forEach(function(c){ header.classList.toggle(c, !on) });
    scrolled.forEach(function(c){ header.classList.toggle(c, on) });
  }
  window.addEventListener('scroll', paint, {passive:true}); paint();
  var openIcon = menuBtn.innerHTML;
  var closeIcon = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
  function setMenu(v){
    open = v;
    ['max-h-0','opacity-0'].forEach(function(c){ panel.classList.toggle(c, !v) });
    ['max-h-[640px]','opacity-100','mt-6'].forEach(function(c){ panel.classList.toggle(c, v) });
    menuBtn.innerHTML = v ? closeIcon : openIcon;
    menuBtn.setAttribute('aria-expanded', v); paint();
  }
  menuBtn.addEventListener('click', function(){ setMenu(!open) });
  panel.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ setMenu(false) }) });

  // Full-menu accordion
  var groups = document.querySelectorAll('#menu button[aria-controls]');
  groups.forEach(function(btn){
    btn.addEventListener('click', function(){
      var wasOpen = btn.getAttribute('aria-expanded') === 'true';
      groups.forEach(function(b){
        var p = document.getElementById(b.getAttribute('aria-controls'));
        var on = b === btn && !wasOpen;
        b.setAttribute('aria-expanded', on);
        b.querySelector('svg').classList.toggle('rotate-45', on);
        b.querySelector('svg').classList.toggle('rotate-0', !on);
        p.classList.toggle('max-h-[1400px]', on); p.classList.toggle('opacity-100', on);
        p.classList.toggle('max-h-0', !on); p.classList.toggle('opacity-0', !on);
      });
    });
  });

  // Talk buttons: the voice agent runs on the deployed site; explain that here
  var telLink = document.querySelector('a[href^="tel:"]');
  var phone = telLink ? (telLink.textContent.match(/\(?\d{3}\)?[-. ]?\d{3}[-. ]\d{4}/) || [''])[0] : '';
  var note = document.createElement('div'); note.id = 'fcc-note'; note.hidden = true; note.setAttribute('role','status');
  note.innerHTML = '<button type="button" aria-label="Dismiss">×</button><b>Voice assistant runs on the live site</b>This preview can’t use your microphone. Once deployed, this button starts a call with the AI assistant.' + (phone ? ' To book now, call <span class="num">' + phone + '</span>.' : '');
  document.body.appendChild(note);
  note.querySelector('button').addEventListener('click', function(){ note.hidden = true });
  document.querySelectorAll('button').forEach(function(b){
    var t = (b.textContent || '') + (b.getAttribute('aria-label') || '');
    if (/talk to|assistant|start talking|book this/i.test(t) && b !== menuBtn) b.addEventListener('click', function(){ note.hidden = false });
  });

  // Launcher prompt after a few seconds
  var launcher = document.querySelector('button[aria-label="Talk to our voice assistant"]');
  if (launcher) {
    var prompt = document.createElement('div');
    prompt.className = 'relative max-w-[17rem] bg-background text-foreground border border-border shadow-xl shadow-black/15 p-4 pr-9';
    prompt.innerHTML = '<p class="text-sm font-semibold mb-1">Questions? Want to book?</p><p class="text-sm text-muted-foreground leading-relaxed mb-3">Talk to our assistant. It can check openings and book you.</p><button type="button" class="text-sm font-semibold underline decoration-gold underline-offset-4 cursor-pointer">Start talking</button><button type="button" aria-label="Dismiss" class="absolute top-2.5 right-2.5 p-1 text-muted-foreground cursor-pointer">×</button>';
    prompt.hidden = true;
    launcher.parentElement.insertBefore(prompt, launcher);
    var btns = prompt.querySelectorAll('button');
    btns[0].addEventListener('click', function(){ prompt.hidden = true; note.hidden = false });
    btns[1].addEventListener('click', function(){ prompt.hidden = true });
    setTimeout(function(){ if (note.hidden) prompt.hidden = false }, 4000);
  }


  // Cinematic hero (vanilla port of components/hero.tsx)
  (function(){
    var sec = document.getElementById('hero'); if (!sec) return;
    var q = function(n){ return sec.querySelector('[data-hero="'+n+'"]') };
    var bg=q('bg'), shade=q('shade'), grade=q('grade'), one=q('one'), two=q('two'), cue=q('cue'),
        fill=q('fill'), bank=q('bank'), wisps=q('wisps'), jet=q('jet'), wf=q('wisps-front');
    var clamp=function(v){return Math.min(1,Math.max(0,v))}, span=function(p,a,b){return clamp((p-a)/(b-a))};
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches, f=0;
    function upd(){ f=0;
      var travel = sec.offsetHeight - innerHeight, p = reduce?0:clamp(-sec.getBoundingClientRect().top/Math.max(travel,1));
      var o=span(p,0,.22), i=span(p,.2,.4), climb=span(p,.5,.66), white=span(p,.62,.74), clear=span(p,.74,1);
      var wide = innerWidth >= 1024;
      bg.style.transform='translate('+(wide?i*17:0)+'%, '+(i*15)+'%) scale('+((1.14-i*.2)*(1+climb*.15))+')';
      shade.style.opacity=.4-i*.36;
      if (grade) grade.style.opacity=1-i*.7;
      one.style.transform='translateY('+(o*-90)+'px) rotateX('+(o*28)+'deg) scale('+(1-o*.12)+')';
      one.style.opacity=1-o; one.style.filter='blur('+(o*8)+'px)'; one.style.pointerEvents=o>.6?'none':'auto';
      var tw=i*(1-span(p,.46,.54));
      two.style.transform='translateY('+((1-i)*60)+'px)'; two.style.opacity=tw; two.style.pointerEvents=tw>.4?'auto':'none';
      if (bank) { bank.style.opacity=Math.min(1,climb*1.5)*(1-clear); bank.style.transform='translateY('+(70-climb*75-clear*30)+'%) scale('+(1+climb*.15+clear*.5)+')'; }
      if (wisps) { wisps.style.opacity=span(p,.54,.68)*(1-clear); wisps.style.transform='translateY('+((1-climb)*25)+'%) scale('+(1.1+climb*.3+clear*.7)+')'; }
      if (fill) fill.style.opacity=white;
      if (wf) { wf.style.opacity=.4*span(p,.6,.7)*(1-span(p,.76,.9)); wf.style.transform='translate3d('+((.5-span(p,.58,.9))*30)+'%,0,0) scale('+(1.2+clear*.6)+')'; }
      if (jet) { var fly=span(p,.58,.83), jw=jet.offsetWidth, jx=-jw+fly*(innerWidth+jw*1.1), jy=(.5-fly)*innerHeight*.16;
        jet.style.transform='translate3d('+jx+'px,'+jy+'px,0) rotate('+(-2-fly*3)+'deg) scale('+(.85+fly*.3)+')';
        jet.style.opacity=(fly>0&&fly<1)?Math.min(1,fly*10,(1-fly)*10):0; }
      cue.style.opacity=1-span(p,0,.15);
    }
    addEventListener('scroll',function(){ if(!f) f=requestAnimationFrame(upd) },{passive:true});
    addEventListener('resize',upd); upd();
  })();

  // Scroll reveals: the static markup ships fully visible (thumbnails, no-JS); here, anything that starts
  // below the fold is hidden again and animates in when it scrolls into view, like the live site.
  (function(){
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var below = function(el){ return el.getBoundingClientRect().top > innerHeight * 0.9; };
    // Photo curtains (Services cards)
    document.querySelectorAll('#services .origin-top').forEach(function(cur){
      var box = cur.parentElement; if (!below(box)) return;
      cur.style.transform = 'scaleY(1)';
      var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting) { cur.style.transform = 'scaleY(0)'; io.disconnect(); } }); }, { threshold: 0.2 });
      io.observe(box);
    });
    // Fade-up items (Why Choose Us, Testimonials)
    document.querySelectorAll('#why [data-index], #reviews [data-index]').forEach(function(el){
      if (!below(el)) return;
      el.classList.remove('opacity-100', 'translate-y-0'); el.classList.add('opacity-0', 'translate-y-8');
      var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting) {
        el.classList.remove('opacity-0', 'translate-y-8'); el.classList.add('opacity-100', 'translate-y-0'); io.disconnect(); } }); }, { threshold: 0.2 });
      io.observe(el);
    });
  })();

  // Studio-time "today" highlight + open/closed
  try {
    var parts = new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',weekday:'long',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date());
    var get = function(t){ return (parts.find(function(p){return p.type===t})||{}).value };
    var day = get('weekday'), mins = +get('hour')*60 + +get('minute');
    var hrs = {Monday:[600,1200],Tuesday:[540,1200],Wednesday:[540,1200],Thursday:[540,1200],Friday:[480,1140],Saturday:[480,1200],Sunday:[840,1020]};
    document.querySelectorAll('#visit dl > div').forEach(function(row){
      var isToday = row.querySelector('dt').textContent.trim() === day;
      row.classList.toggle('text-gold-light', isToday); row.classList.toggle('font-medium', isToday);
      row.classList.toggle('text-primary-foreground/80', !isToday);
    });
    var badge = document.querySelector('#visit h3 + span');
    if (badge) { var o = mins >= hrs[day][0] && mins < hrs[day][1]; badge.textContent = o ? 'Open now' : 'Closed now'; }
  } catch(e) {}
})();
"""

out = f"""<meta charset="utf-8">
<title>{page_title}</title>
<style>{css}
{extra_css}</style>
<div class="{html_cls} {body_cls}">
{body}
</div>
<script>{js}</script>
"""
dst.mkdir(exist_ok=True)
(dst/"index.html").write_text(out)
for d in ("biz","brand"):
    if (dst/d).exists(): shutil.rmtree(dst/d)
    shutil.copytree(src/d, dst/d)
print(len(out)//1024, "KB")
