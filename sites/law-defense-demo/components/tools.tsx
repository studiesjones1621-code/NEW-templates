"use client"

import { useMemo, useState } from "react"
import { Check, ShieldAlert } from "lucide-react"
import { charges, rights } from "@/lib/business"
import { TalkButton } from "./talk-button"

const eyebrow = "text-[11px] md:text-xs font-semibold uppercase tracking-[0.24em]"
const display = "font-display font-semibold tracking-tight leading-[0.95]"

/** "What are you facing?" Real Maryland law, summarized. */
export function ChargePicker() {
  const [id, setId] = useState<(typeof charges)[number]["id"]>("dui")
  const c = charges.find((x) => x.id === id) ?? charges[0]
  return (
    <section id="practice" className="relative bg-ink py-20 md:py-28">
      <div className="container mx-auto px-5 md:px-10">
        <div className="reveal max-w-2xl">
          <p className={`${eyebrow} text-ember`}>Practice areas</p>
          <h2 className={`mt-3 ${display} text-5xl md:text-6xl`}>
            What are you <span className="ember-text italic">facing?</span>
          </h2>
        </div>
        <div role="tablist" aria-label="Charge types" className="reveal mt-8 flex flex-wrap gap-2">
          {charges.map((x) => (
            <button
              key={x.id}
              role="tab"
              id={`tab-${x.id}`}
              aria-selected={x.id === id}
              aria-controls="charge-panel"
              onClick={() => setId(x.id)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors cursor-pointer ${
                x.id === id ? "bg-ember text-ink border-ember" : "border-white/15 text-white/80 hover:border-ember/60"
              }`}
            >
              {x.name}
            </button>
          ))}
        </div>
        <div id="charge-panel" role="tabpanel" aria-labelledby={`tab-${c.id}`} key={c.id} className="mt-8 grid lg:grid-cols-[0.8fr_1.2fr] gap-8 items-start animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div>
            <h3 className={`${display} text-4xl md:text-5xl`}>{c.headline}</h3>
            <TalkButton className="mt-6 inline-flex items-center gap-2 rounded-full bg-ember text-ink px-6 py-3.5 text-sm font-bold hover:bg-ember-soft transition-colors">
              Talk about my case
            </TalkButton>
          </div>
          <div>
            <ul className="grid gap-3">
              {c.facts.map((f) => (
                <li key={f} className="flex gap-4 rounded-2xl bg-card p-5 ring-1 ring-white/5">
                  <Check className="w-5 h-5 text-ember shrink-0 mt-0.5" aria-hidden />
                  <span className="text-white/85 leading-relaxed">{f}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-white/45">Source: {c.source}. General information, not legal advice.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

/** "If you're stopped": tap through your rights. */
export function Rights() {
  const [seen, setSeen] = useState<number[]>([0])
  const done = seen.length === rights.length
  return (
    <section id="rights" className="relative bg-background py-20 md:py-28">
      <div className="container mx-auto px-5 md:px-10 grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-16 items-start">
        <div className="reveal lg:sticky lg:top-28">
          <p className={`${eyebrow} text-ember`}>Know your rights</p>
          <h2 className={`mt-3 ${display} text-5xl md:text-6xl`}>
            If you&apos;re <span className="ember-text italic">stopped.</span>
          </h2>
          <p className="mt-4 max-w-md text-white/75 leading-relaxed">Five things to remember. Tap each one.</p>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-sm text-white/80" aria-live="polite">
            <ShieldAlert className="w-4 h-4 text-ember" aria-hidden /> {seen.length} of {rights.length} {done ? "· you've got it" : ""}
          </p>
        </div>
        <ol className="grid gap-3">
          {rights.map((r, i) => {
            const open = seen.includes(i)
            return (
              <li key={r.title} className="reveal">
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setSeen((s) => (s.includes(i) ? s : [...s, i]))}
                  className={`w-full text-left rounded-2xl p-5 md:p-6 ring-1 transition-colors cursor-pointer ${open ? "bg-card ring-ember/40" : "bg-card/60 ring-white/5 hover:ring-ember/30"}`}
                >
                  <span className="flex items-baseline gap-4">
                    <span className={`${display} text-3xl ember-text tabular-nums`}>{i + 1}</span>
                    <span className="font-semibold text-lg">{r.title}</span>
                  </span>
                  {open && <span className="mt-2 block pl-10 text-white/75 leading-relaxed animate-in fade-in duration-300">{r.body}</span>}
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

/** Maryland's general 3-year deadline for injury claims (CJP § 5-101). */
export function DeadlineCalc() {
  const [date, setDate] = useState("")
  const out = useMemo(() => {
    if (!date) return null
    const d = new Date(date + "T12:00:00")
    if (Number.isNaN(d.getTime())) return null
    const deadline = new Date(d)
    deadline.setFullYear(deadline.getFullYear() + 3)
    const days = Math.ceil((deadline.getTime() - Date.now()) / 86400000)
    return { deadline, days }
  }, [date])
  return (
    <section id="deadline" className="relative bg-ink py-20 md:py-28">
      <div className="container mx-auto px-5 md:px-10 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="reveal">
          <p className={`${eyebrow} text-ember`}>Hurt in an accident?</p>
          <h2 className={`mt-3 ${display} text-5xl md:text-6xl`}>
            How long do you <span className="ember-text italic">have?</span>
          </h2>
          <p className="mt-4 max-w-md text-white/75 leading-relaxed">
            Most Maryland injury claims must be filed within 3 years of the injury. Some claims have shorter deadlines or notice rules, so
            don&apos;t wait for the last day.
          </p>
        </div>
        <div className="reveal rounded-2xl bg-card ring-1 ring-white/10 p-6 md:p-8">
          <label htmlFor="injury-date" className="text-sm text-white/75">
            Date of the accident
          </label>
          <input
            id="injury-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-2 w-full rounded-xl bg-ink border border-white/15 px-4 py-3 text-base focus-visible:outline-2 focus-visible:outline-ember"
          />
          <div className="mt-6 rounded-xl bg-ink p-5 min-h-[112px]" aria-live="polite">
            {!out ? (
              <p className="text-white/55">Pick a date to see the general filing deadline.</p>
            ) : (
              <>
                <p className="text-sm text-white/60">General deadline to file</p>
                <p className={`${display} text-3xl md:text-4xl mt-1`}>
                  {out.deadline.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </p>
                <p className={`mt-2 font-semibold ${out.days < 0 ? "text-red-400" : out.days < 180 ? "text-ember" : "text-frost"}`}>
                  {out.days < 0 ? "That date may have passed. Call us; exceptions sometimes apply." : `${out.days.toLocaleString()} days left`}
                </p>
              </>
            )}
          </div>
          <p className="mt-3 text-xs text-white/45">Md. Code, Cts. &amp; Jud. Proc. § 5-101. General information, not legal advice.</p>
          <TalkButton className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-semibold hover:border-ember transition-colors">
            Ask about my injury
          </TalkButton>
        </div>
      </div>
    </section>
  )
}
