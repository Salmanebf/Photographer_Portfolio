import { describe, expect, it } from 'vitest'
import {
  DEFAULT_RATIO,
  MAX_CARDS,
  MIN_CARDS,
  SHAPE_RATIO,
  alternateShapes,
  cardSize,
  cardWidth,
  chooseCardCount,
  frameAt,
  makeCards,
  type Geometry,
  type Input,
  type Shape,
} from './orbit-math'

const stage = (W: number, H: number, halfW: number): Geometry => ({
  W,
  H,
  cx: 0,
  cy: 18,
  halfW,
  top: -H / 2 + 84,
  bottom: H / 2 - 150,
  cardW: cardWidth(W, H),
})
const desktop = () => stage(1440, 900, 230)
const phone = () => stage(390, 780, 150)
const settled = (over: Partial<Input> = {}): Input => ({
  angle: 0,
  t: 30,
  intro: 99,
  px: 0,
  py: 0,
  scroll: 0,
  ...over,
})
const ratios = (shapes: Shape[]) => shapes.map((s) => SHAPE_RATIO[s])
const ring = (g: Geometry, shapes: Shape[]) => makeCards(ratios(shapes), g)

describe('card sizes', () => {
  const g = desktop()
  it('give wide and square cards the same area, and tall cards the same unless the band is too short for them', () => {
    const area = (s: Shape) => {
      const { w, h } = cardSize(SHAPE_RATIO[s], g)
      return w * h
    }
    expect(area('landscape')).toBeCloseTo(area('square'), -2)
    expect(area('portrait')).toBeLessThanOrEqual(area('square') + 1)
    expect(area('portrait')).toBeGreaterThan(area('square') * 0.7)
  })
  it('keep the real shape (a wide card is wide, a tall card is tall)', () => {
    const wide = cardSize(SHAPE_RATIO.landscape, g)
    const tall = cardSize(SHAPE_RATIO.portrait, g)
    expect(wide.w).toBeGreaterThan(wide.h)
    expect(tall.h).toBeGreaterThan(tall.w)
    expect(wide.h / wide.w).toBeCloseTo(9 / 16, 3)
  })
  it('never exceed a third of the screen width or half the band height, even for an extreme shape', () => {
    for (const r of [0.2, 0.5, 1, 2, 4]) {
      const { w, h } = cardSize(r, phone())
      expect(w).toBeLessThanOrEqual(390 * 0.36 + 0.01)
      expect(h).toBeLessThanOrEqual((phone().bottom - phone().top) * 0.46 + 0.01)
    }
  })
})

describe('how many cards', () => {
  it('is six for tall-ish cards on a desktop screen (the size the client liked)', () => {
    expect(chooseCardCount([1.25], desktop())).toBe(6)
  })
  it('stays between the minimum and the maximum for any screen and any mix', () => {
    for (const g of [
      desktop(),
      phone(),
      stage(820, 1100, 200),
      stage(1920, 1080, 280),
      stage(1366, 640, 150),
    ]) {
      for (const mix of [
        ['landscape'],
        ['portrait'],
        ['square'],
        ['landscape', 'portrait'],
        ['landscape', 'landscape', 'portrait'],
      ] as Shape[][]) {
        const n = chooseCardCount(ratios(mix), g)
        expect(n).toBeGreaterThanOrEqual(MIN_CARDS)
        expect(n).toBeLessThanOrEqual(MAX_CARDS)
      }
    }
  })
  it('puts fewer cards on a small screen than on a big one (same cards, less room)', () => {
    const mix = ratios(['landscape', 'portrait', 'landscape', 'portrait'])
    expect(chooseCardCount(mix, phone())).toBeLessThanOrEqual(chooseCardCount(mix, desktop()))
  })
  it('is never crowded or bare: the cards cover roughly 25–60 % of the band', () => {
    for (const g of [desktop(), phone(), stage(1920, 1080, 280)]) {
      for (const mix of [['landscape'], ['portrait'], ['landscape', 'portrait']] as Shape[][]) {
        const rs = ratios(mix)
        const n = chooseCardCount(rs, g)
        let used = 0
        for (let i = 0; i < n; i++) {
          const s = cardSize(rs[i % rs.length], g)
          used += s.w * s.h
        }
        const coverage = used / (g.W * (g.bottom - g.top))
        expect(coverage, `${g.W}x${g.H} ${mix}`).toBeGreaterThan(0.2)
        expect(coverage, `${g.W}x${g.H} ${mix}`).toBeLessThan(0.65)
      }
    }
  })
  it('assumes wide film stills when nothing is known about a card', () => {
    expect(DEFAULT_RATIO).toBeLessThan(1)
  })
  it('copes with no information at all', () => {
    expect(chooseCardCount([], desktop())).toBeGreaterThanOrEqual(MIN_CARDS)
  })
})

describe('alternateShapes', () => {
  const item = (id: string, shape?: Shape) => ({ id, shape })
  it('makes wide and tall items take turns', () => {
    const out = alternateShapes([
      item('a', 'landscape'),
      item('b', 'landscape'),
      item('c', 'portrait'),
      item('d', 'portrait'),
    ])
    expect(out.map((i) => i.id)).toEqual(['a', 'c', 'b', 'd'])
  })
  it('keeps the order when all items have the same shape, or none is declared', () => {
    const all = [item('a', 'portrait'), item('b', 'portrait'), item('c')]
    expect(alternateShapes(all).map((i) => i.id)).toEqual(['a', 'b', 'c'])
  })
  it('keeps every item exactly once when the numbers are uneven', () => {
    const out = alternateShapes([
      item('a', 'landscape'),
      item('b', 'portrait'),
      item('c', 'portrait'),
      item('d', 'square'),
      item('e', 'portrait'),
    ])
    expect(out.map((i) => i.id).sort()).toEqual(['a', 'b', 'c', 'd', 'e'])
  })
})

describe('the ring', () => {
  const mixes: [string, Shape[]][] = [
    ['six tall cards', Array(6).fill('portrait')],
    ['six wide cards', Array(6).fill('landscape')],
    ['wide and tall', ['landscape', 'portrait', 'landscape', 'portrait', 'landscape', 'portrait']],
    ['three cards', ['landscape', 'portrait', 'square']],
    [
      'eight cards',
      ['landscape', 'portrait', 'square', 'landscape', 'portrait', 'square', 'landscape', 'portrait'],
    ],
  ]

  it.each(mixes)('stays centred on the headline all the way round: %s', (_n, shapes) => {
    const g = desktop()
    const cards = ring(g, shapes)
    for (let a = 0; a < 6.3; a += 0.3) {
      const frames = cards.map((c) => frameAt(c, g, settled({ angle: a })))
      const mx = frames.reduce((s, f) => s + f.x, 0) / frames.length
      const my = frames.reduce((s, f) => s + f.y, 0) / frames.length
      // fewer cards are lumpier, so the allowance is wider for them
      const slack = shapes.length <= 3 ? 0.2 : 0.07
      expect(Math.abs(mx - g.cx), `x at ${a}`).toBeLessThan(g.W * slack)
      expect(Math.abs(my - g.cy), `y at ${a}`).toBeLessThan(g.H * (slack + 0.02))
    }
  })

  it.each(mixes)('keeps every card between the menu and the button: %s', (_n, shapes) => {
    const g = desktop()
    const cards = ring(g, shapes)
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
    const g = desktop()
    const fr = ring(g, mixes[2][1]).map((c) => frameAt(c, g, settled({ angle: 1.1 })))
    for (const f of fr) {
      if (f.z > 0) expect(f.zIndex).toBeGreaterThan(100)
      else expect(f.zIndex).toBeLessThan(50)
    }
    expect(fr.some((f) => f.z > 0)).toBe(true)
    expect(fr.some((f) => f.z < 0)).toBe(true)
  })

  it('draws far cards smaller, dimmer and softer than near cards', () => {
    const g = desktop()
    const fr = ring(g, Array(6).fill('square')).map((c) => frameAt(c, g, settled({ angle: 0.7 })))
    const near = fr.reduce((a, b) => (a.z > b.z ? a : b))
    const far = fr.reduce((a, b) => (a.z < b.z ? a : b))
    expect(near.scale).toBeGreaterThan(far.scale)
    expect(near.brightness).toBeGreaterThan(far.brightness)
    expect(far.blur).toBeGreaterThan(near.blur)
    expect(near.blur).toBe(0)
  })

  it('has every card turn over now and then, showing both faces', () => {
    const g = desktop()
    for (const c of ring(g, mixes[2][1])) {
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

  it('never has more than half of the cards flipping at once', () => {
    const g = desktop()
    const cards = ring(g, mixes[2][1])
    const turning = (t: number) =>
      cards.filter(
        (c) => Math.abs(frameAt(c, g, settled({ t: t + 0.1 })).yaw - frameAt(c, g, settled({ t })).yaw) > 6
      ).length
    let worst = 0
    for (let t = 0; t < 60; t += 0.2) worst = Math.max(worst, turning(t))
    expect(worst).toBeGreaterThan(0)
    expect(worst).toBeLessThanOrEqual(Math.ceil(cards.length / 2))
  })

  it('starts as an invisible pile in the middle, then spreads out', () => {
    const g = desktop()
    const cards = ring(g, mixes[2][1])
    const start = cards.map((c) => frameAt(c, g, settled({ intro: 0 })))
    expect(start.every((f) => f.opacity === 0 && Math.abs(f.x - g.cx) < 1)).toBe(true)
    const done = cards.map((c) => frameAt(c, g, settled({ intro: 5 })))
    expect(Math.max(...done.map((f) => Math.abs(f.x - g.cx)))).toBeGreaterThan(g.halfW)
    expect(done.every((f) => f.opacity === 1)).toBe(true)
  })

  it('fades the cards out as the hero scrolls away', () => {
    const g = desktop()
    const cards = ring(g, mixes[2][1])
    expect(cards.every((c) => frameAt(c, g, settled({ scroll: 1 })).opacity < 0.1)).toBe(true)
    expect(cards.every((c) => frameAt(c, g, settled({ scroll: 0 })).opacity === 1)).toBe(true)
  })

  it('is the same picture for the same input (no hidden randomness)', () => {
    const g = desktop()
    const a = ring(g, mixes[2][1]).map((c) => frameAt(c, g, settled({ angle: 2, t: 11 })))
    const b = ring(g, mixes[2][1]).map((c) => frameAt(c, g, settled({ angle: 2, t: 11 })))
    expect(b).toEqual(a)
  })

  it('stays inside a phone screen with a mix of wide and tall cards', () => {
    const g = phone()
    const shapes: Shape[] = ['landscape', 'portrait', 'landscape', 'portrait']
    expect(g.cardW).toBeGreaterThanOrEqual(100)
    for (let a = 0; a < 6.3; a += 0.5) {
      for (const c of ring(g, shapes)) {
        const f = frameAt(c, g, settled({ angle: a }))
        expect(Math.abs(f.x) + (c.w * f.scale) / 2).toBeLessThanOrEqual(g.W / 2 + 40)
      }
    }
  })
})
