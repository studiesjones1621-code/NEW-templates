"use client"

import type React from "react"
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { Minus, Plus, ShoppingBag, X } from "lucide-react"
import { product, type SizeId } from "@/lib/business"

type Line = { size: SizeId; subscribe: boolean; qty: number }
type Cart = {
  lines: Line[]
  count: number
  subtotal: number
  open: boolean
  setOpen: (v: boolean) => void
  add: (size: SizeId, subscribe: boolean, qty?: number) => void
  setQty: (i: number, qty: number) => void
}

const CartCtx = createContext<Cart | null>(null)
const STORE_KEY = "saffra-bag"

export const unitPrice = (size: SizeId, subscribe: boolean) => {
  const base = product.sizes.find((s) => s.id === size)?.price ?? 0
  return subscribe ? Math.round(base * (1 - product.subscribeOff) * 100) / 100 : base
}
export const money = (n: number) => `$${n % 1 ? n.toFixed(2) : n}`

/** Demo bag: lives in this browser only. Checkout is disabled because the brand is fictional. */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<Line[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE_KEY) ?? "[]")
      if (Array.isArray(saved)) setLines(saved)
    } catch {}
  }, [])
  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(lines))
    } catch {}
  }, [lines])

  const add = useCallback((size: SizeId, subscribe: boolean, qty = 1) => {
    setLines((ls) => {
      const i = ls.findIndex((l) => l.size === size && l.subscribe === subscribe)
      if (i < 0) return [...ls, { size, subscribe, qty }]
      return ls.map((l, j) => (j === i ? { ...l, qty: Math.min(9, l.qty + qty) } : l))
    })
    setOpen(true)
  }, [])
  const setQty = useCallback((i: number, qty: number) => {
    setLines((ls) => (qty <= 0 ? ls.filter((_, j) => j !== i) : ls.map((l, j) => (j === i ? { ...l, qty: Math.min(9, qty) } : l))))
  }, [])

  const value = useMemo<Cart>(
    () => ({
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal: lines.reduce((n, l) => n + l.qty * unitPrice(l.size, l.subscribe), 0),
      open,
      setOpen,
      add,
      setQty,
    }),
    [lines, open, add, setQty],
  )
  return (
    <CartCtx.Provider value={value}>
      {children}
      <CartDrawer />
    </CartCtx.Provider>
  )
}

export function useCart() {
  const c = useContext(CartCtx)
  if (!c) throw new Error("useCart outside CartProvider")
  return c
}

export function CartButton() {
  const { count, setOpen } = useCart()
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="relative inline-flex items-center justify-center w-10 h-10 rounded-full border border-ink/15 hover:border-ember transition-colors cursor-pointer"
      aria-label={`Open bag, ${count} item${count === 1 ? "" : "s"}`}
    >
      <ShoppingBag className="w-[18px] h-[18px]" aria-hidden />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-ember text-white text-[11px] font-bold grid place-items-center tabular-nums">{count}</span>
      )}
    </button>
  )
}

function CartDrawer() {
  const { lines, subtotal, open, setOpen, setQty } = useCart()
  const [note, setNote] = useState(false)
  useEffect(() => {
    if (!open) return
    setNote(false)
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, setOpen])
  if (!open) return null
  const toFree = Math.max(0, product.freeShipping - subtotal)
  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Your bag">
      <button type="button" className="absolute inset-0 bg-ink/40 cursor-default" onClick={() => setOpen(false)} aria-label="Close bag" />
      <aside className="drawer-in absolute right-0 top-0 h-full w-full max-w-sm bg-card shadow-2xl flex flex-col">
        <header className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-display text-2xl font-semibold">Your bag</h2>
          <button type="button" onClick={() => setOpen(false)} className="p-2 -mr-2 cursor-pointer" aria-label="Close bag">
            <X className="w-5 h-5" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {lines.length === 0 ? (
            <p className="text-muted-foreground">Your bag is empty.</p>
          ) : (
            <ul className="grid gap-4">
              {lines.map((l, i) => (
                <li key={`${l.size}-${l.subscribe}`} className="flex gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.photo} alt="" className="w-16 h-20 rounded-lg object-cover bg-secondary" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold leading-tight">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.sizes.find((s) => s.id === l.size)?.label} · {l.subscribe ? "Every 6 weeks" : "One-time"}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full border border-border">
                        <button type="button" onClick={() => setQty(i, l.qty - 1)} className="p-2 cursor-pointer" aria-label="Remove one">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm tabular-nums">{l.qty}</span>
                        <button type="button" onClick={() => setQty(i, l.qty + 1)} className="p-2 cursor-pointer" aria-label="Add one">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="font-semibold tabular-nums">{money(l.qty * unitPrice(l.size, l.subscribe))}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <footer className="border-t border-border px-5 py-5">
          {lines.length > 0 && (
            <p className="text-sm text-muted-foreground mb-3">{toFree > 0 ? `${money(toFree)} away from free shipping` : "You've got free shipping"}</p>
          )}
          <div className="flex items-baseline justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-display text-3xl font-semibold tabular-nums">{money(subtotal)}</span>
          </div>
          <button
            type="button"
            disabled={!lines.length}
            onClick={() => setNote(true)}
            className="mt-4 w-full rounded-full bg-ink text-primary-foreground py-3.5 font-bold hover:bg-ember transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Checkout
          </button>
          <p className="mt-3 text-xs text-muted-foreground" aria-live="polite">
            {note ? "This is a concept store, so checkout is turned off. On a real brand this connects to Shopify or Stripe." : "Demo store · no payment is taken."}
          </p>
        </footer>
      </aside>
    </div>
  )
}
