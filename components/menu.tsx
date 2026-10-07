"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { menu } from "@/lib/business"
import { TalkButton } from "./talk-button"

export function Menu() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleCategory = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="menu" className="py-24 md:py-32">
      <div className="container mx-auto px-5 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="max-w-3xl">
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-5">Full Menu</p>
            <h2 className="text-5xl font-medium leading-[1.1] tracking-tight text-balance lg:text-7xl">
              Prices, <span className="font-serif italic font-normal text-gold-deep">up front.</span>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-xs">Not sure what to book? Ask our assistant. It knows every service.</p>
        </div>

        <div>
          {menu.map((group, index) => {
            const isOpen = openIndex === index
            return (
              <div key={group.category} className="border-b border-border">
                <button
                  onClick={() => toggleCategory(index)}
                  aria-expanded={isOpen}
                  aria-controls={`menu-panel-${index}`}
                  className="w-full py-6 flex items-center justify-between gap-6 text-left group cursor-pointer"
                >
                  <span className="text-xl md:text-2xl font-medium text-foreground transition-colors group-hover:text-foreground/70">
                    {group.category}
                    <span className="ml-3 text-sm text-muted-foreground font-normal">{group.items.length}</span>
                  </span>
                  <Plus
                    className={`w-6 h-6 text-foreground flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-45" : "rotate-0"
                    }`}
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </button>
                <div
                  id={`menu-panel-${index}`}
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isOpen ? "max-h-[1400px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <ul className="grid md:grid-cols-2 gap-x-12 pb-8">
                    {group.items.map((item) => (
                      <li key={item.name} className="flex items-baseline gap-3 py-3.5 border-t border-border/60">
                        <div className="min-w-0">
                          <p className="font-medium">{item.name}</p>
                          {item.note && <p className="text-sm text-muted-foreground">{item.note}</p>}
                        </div>
                        <span className="flex-1 border-b border-dotted border-border translate-y-[-4px] min-w-6" aria-hidden />
                        <div className="text-right whitespace-nowrap">
                          <p className="font-semibold">{item.price}</p>
                          <p className="text-xs text-muted-foreground">{item.time}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-12 flex flex-col sm:flex-row sm:items-center gap-4">
          <TalkButton className="inline-flex items-center justify-center gap-2.5 bg-primary text-primary-foreground px-7 py-4 text-sm tracking-wide hover:bg-primary/85 transition-colors">
            Ask the assistant to book
          </TalkButton>
          <p className="text-sm text-muted-foreground">Enhancement add-on available for $5–$10.</p>
        </div>
      </div>
    </section>
  )
}
