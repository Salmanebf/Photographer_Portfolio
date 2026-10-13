import { describe, expect, it } from 'vitest'
import { CARD_COUNT, cardWidth, frameAt, makeCards, type Geometry, type Input } from './orbit-math'

const geo = (): Geometry => ({
  W: 1440,
  H: 900,
  cx: 0,
  cy: 18,
  halfW: 230,
  top: -450 + 84,
  bottom: 300,
  cardW: cardWidth(1440, 900),
})
const settled = (over: Partial<Input> = {}): Input => ({ angle: 0, t: 30, intro: 99, px: 0, py: 0, scroll: 0, ...over })

describe('orbit maths', () => {
  const g = geo()
  const cards = makeCards(g.cardW)

  it('uses exactly six cards', () => {
    expect(CARD_COUNT).toBe(6)
    expect(cards).toHaveLength(6)
  })

  it('keeps the ring centred on the headline: the cards\' average position stays at its centre all the way round', () => {
    for (let a = 0; a < 6.3; a += 0.3) {
      const frames = cards.map((c) => frameAt(c, g, settled({ angle: a })))
      const mx = frames.reduce((s, f) => s + f.x, 0) / frames.length
      const my = frames.reduce((s, f) => s + f.y, 0) / frames.length
      expect(Math.abs(mx - g.cx), `x at angle ${a}`).toBeLessThan(g.W * 0.06)
      expect(Math.abs(my - g.cy), `y at angle ${a}`).toBeLessThan(g.H * 0.08)
    }
  })

  it('keeps every card between the menu and the button, whatever the angle, pointer or time', () => {
    for (let a = 0; a < 6.3; a += 0.4) {
      for (const px of [-0.5, 0, 0.5]) {
        for (const c of cards) {
          const f = frameAt(c, g, settled({ angle: a, px, py: px, t: a * 7 }))
          const half = (c.h * f.scale) / 2
          expect(f.y - half).toBeGreaterThanOrEqual(g.top - 0.01)
          expect(f.y + half).toBeLessThanOrEqual(g.bottom + 0.01)
        }
      }
    }
  })

  it('puts near cards in front of the headline and far cards behind it', () => {
    const fr = cards.map((c) => frameAt(c, g, settled({ angle: 1.1 })))
    for (const f of fr) {
      if (f.z > 0) expect(f.zIndex).toBeGreaterThan(100)
      else expect(f.zIndex).toBeLessThan(50)
    }
    expect(fr.some((f) => f.z > 0)).toBe(true)
    expect(fr.some((f) => f.z < 0)).toBe(true)
  })

  it('draws far cards smaller, dimmer and softer than near cards', () => {
    const fr = cards.map((c) => frameAt(c, g, settled({ angle: 0.7 })))
    const near = fr.reduce((a, b) => (a.z > b.z ? a : b))
    const far = fr.reduce((a, b) => (a.z < b.z ? a : b))
    expect(near.scale).toBeGreaterThan(far.scale)
    expect(near.brightness).toBeGreaterThan(far.brightness)
    expect(far.blur).toBeGreaterThan(near.blur)
    expect(near.blur).toBe(0)
  })

  it('every card turns over to show its other face now and then, and both faces get used', () => {
    for (const c of cards) {
      const seen = new Set<boolean>()
      let changes = 0
      let last: boolean | undefined
      for (let t = 0; t < 60; t += 0.1) {
        const f = frameAt(c, g, settled({ t })).front
        seen.add(f)
        if (last !== undefined && f !== last) changes++
        last = f
      }
      expect(seen.size, `card ${c.idx}`).toBe(2)
      expect(changes, `card ${c.idx}`).toBeGreaterThanOrEqual(4)
    }
  })

  it('cards do not all flip at the same moment', () => {
    // mid-flip = turning much faster than the gentle lean ever does
    const turning = (t: number) =>
      cards.filter((c) => Math.abs(frameAt(c, g, settled({ t: t + 0.1 })).yaw - frameAt(c, g, settled({ t })).yaw) > 6).length
    let worst = 0
    for (let t = 0; t < 60; t += 0.2) worst = Math.max(worst, turning(t))
    expect(worst).toBeGreaterThan(0)
    expect(worst).toBeLessThanOrEqual(3) // never more than half the cards at once
  })

  it('starts as a pile in the middle (invisible), then spreads out', () => {
    const start = cards.map((c) => frameAt(c, g, settled({ intro: 0 })))
    expect(start.every((f) => f.opacity === 0)).toBe(true)
    expect(start.every((f) => Math.abs(f.x - g.cx) < 1)).toBe(true)
    const done = cards.map((c) => frameAt(c, g, settled({ intro: 5 })))
    expect(Math.max(...done.map((f) => Math.abs(f.x - g.cx)))).toBeGreaterThan(g.halfW)
    expect(done.every((f) => f.opacity === 1)).toBe(true)
  })

  it('fades the cards out as the hero scrolls away', () => {
    expect(cards.every((c) => frameAt(c, g, settled({ scroll: 1 })).opacity < 0.1)).toBe(true)
    expect(cards.every((c) => frameAt(c, g, settled({ scroll: 0 })).opacity === 1)).toBe(true)
  })

  it('is the same picture for the same input (no hidden randomness)', () => {
    const a = cards.map((c) => frameAt(c, g, settled({ angle: 2, t: 11 })))
    const b = makeCards(g.cardW).map((c) => frameAt(c, g, settled({ angle: 2, t: 11 })))
    expect(b).toEqual(a)
  })

  it('stays inside a phone screen and still has a sensible card size', () => {
    const p: Geometry = { W: 390, H: 780, cx: 0, cy: 10, halfW: 150, top: -306, bottom: 230, cardW: cardWidth(390, 780) }
    expect(p.cardW).toBeGreaterThanOrEqual(100)
    for (let a = 0; a < 6.3; a += 0.5) {
      for (const c of makeCards(p.cardW)) {
        const f = frameAt(c, p, settled({ angle: a }))
        expect(Math.abs(f.x) + (c.w * f.scale) / 2).toBeLessThanOrEqual(p.W / 2 + 40)
      }
    }
  })
})

