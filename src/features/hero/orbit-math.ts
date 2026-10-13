/**
 * The maths of the hero's card ring, with no DOM: given the stage geometry and the time, where is each card,
 * how big, how turned, how dim. Pure, so it is tested without a browser; `orbit-engine.ts` just applies it.
 *
 * The picture: six two-sided cards ride a tilted ring around the headline. Near cards pass in front of the words,
 * far cards behind them (smaller, dimmer, slightly soft). Every few seconds each card turns over like a coin to show
 * its other face. The whole ring is centred on the headline.
 */

export const MIN_CARDS = 3
export const MAX_CARDS = 8
const TAU = Math.PI * 2
/** Small size differences between cards, so they do not look stamped out. */
const WF = [0.95, 1, 0.88, 0.98, 0.92, 1]
/** Every card has about this area (in base-width squares), whatever its shape, so wide and tall cards weigh the same. */
const AREA = 1.08
/** How much of the stage band the cards should cover: fuller looks crowded, emptier looks bare. */
export const TARGET_COVERAGE = 0.4
/** Base speed in rad/s (about 37 s per lap) */
export const BASE_SPEED = 0.17

export type Shape = 'landscape' | 'portrait' | 'square'
/** Height ÷ width of each shape (a phone-style tall video is 16:9 turned on its side). */
export const SHAPE_RATIO: Record<Shape, number> = { landscape: 9 / 16, portrait: 16 / 9, square: 1 }
/** The card shape until anything better is known: film stills are usually wide (16:9). */
export const DEFAULT_RATIO = 9 / 16

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}

/** Stage geometry, all in px, relative to the stage centre. */
export interface Geometry {
  W: number
  H: number
  /** Centre of the headline: the ring turns around this point */
  cx: number
  cy: number
  /** Half the headline's width */
  halfW: number
  /** Cards stay between these two heights (below the menu, above the button) */
  top: number
  bottom: number
  /** Base card width */
  cardW: number
}

export interface CardSpec {
  idx: number
  /** How many cards are on the ring */
  count: number
  w: number
  h: number
  /** Height ÷ width of this card */
  ratio: number
  /** The tallest card on the ring (to keep the whole ring inside the screen) */
  maxH: number
  /** Own ring size (1 = just clears the words) and own height, balanced so the ring stays centred */
  ring: number
  lane: number
  /** Angle on the ring at time 0 */
  phase: number
  /** Own random numbers (a stable look per card) */
  p: number
  zs: number
  rot: number
  spin: number
}

export interface Input {
  /** Angle the whole ring has turned (accumulated by the engine, so speed changes never jump) */
  angle: number
  /** Seconds since start (drives the flips and the small sways) */
  t: number
  /** Seconds since the cards started appearing */
  intro: number
  /** Pointer position, -0.5..0.5 each way (smoothed) */
  px: number
  py: number
  /** 0 at the top of the page → 1 when the hero has scrolled away */
  scroll: number
}

export interface Frame {
  x: number
  y: number
  scale: number
  z: number
  roll: number
  pitch: number
  /** Total turn around the vertical axis, including the coin flips (deg) */
  yaw: number
  opacity: number
  brightness: number
  blur: number
  zIndex: number
  /** Which face looks at the viewer */
  front: boolean
  /** Moving glint on the card surface */
  sheenX: number
  sheenOpacity: number
}

/** A small deterministic random generator, so a card always looks the same. */
export function rng(seed: number) {
  let a = seed | 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** The stage band the cards live in. */
export interface Plan {
  W: number
  H: number
  top: number
  bottom: number
  cardW: number
}

/** One card's size: the same area for every shape, but never wider than a third of the screen or taller than the band. */
export function cardSize(ratio: number, p: Plan, wf = 1): { w: number; h: number } {
  const w0 = Math.sqrt((AREA * p.cardW * p.cardW) / ratio) * wf
  const k = Math.min(1, (p.W * 0.36) / w0, ((p.bottom - p.top) * 0.46) / (w0 * ratio))
  return { w: w0 * k, h: w0 * ratio * k }
}

/** How much room a card takes up on the ring; very wide or very tall cards weigh a bit more. */
const weight = (w: number, h: number) => w * h * (1 + 0.25 * (Math.max(w / h, h / w) - 1))

/**
 * How many cards fit: as many as keep the ring about `TARGET_COVERAGE` full — neither crowded nor bare — given the real
 * shapes of the cards (`ratios`, in the order they would be placed; reused round if there are fewer than needed).
 */
export function chooseCardCount(ratios: number[], p: Plan): number {
  const list = ratios.length ? ratios : [DEFAULT_RATIO]
  const area = p.W * (p.bottom - p.top)
  let best = MIN_CARDS
  let bestGap = Infinity
  let used = 0
  for (let n = 1; n <= MAX_CARDS; n++) {
    const { w, h } = cardSize(list[(n - 1) % list.length], p, WF[(n - 1) % WF.length])
    used += weight(w, h)
    if (n < MIN_CARDS) continue
    const gap = Math.abs(used / area - TARGET_COVERAGE)
    if (gap < bestGap - 1e-9) {
      best = n
      bestGap = gap
    }
  }
  return best
}

/** Wide and tall items take turns around the ring (when there are both), so neighbours differ in shape. */
export function alternateShapes<T extends { shape?: Shape }>(items: T[]): T[] {
  const wide = items.filter((i) => i.shape === 'landscape')
  const other = items.filter((i) => i.shape !== 'landscape')
  if (wide.length === 0 || other.length === 0) return items
  const [first, second] = wide.length >= other.length ? [wide, other] : [other, wide]
  const out: T[] = []
  for (let i = 0; i < first.length || i < second.length; i++) {
    if (i < first.length) out.push(first[i])
    if (i < second.length) out.push(second[i])
  }
  return out
}

export function makeCards(ratios: number[], p: Plan, random: () => number = rng(7)): CardSpec[] {
  const count = ratios.length
  const sizes = ratios.map((r, i) => cardSize(r, p, WF[i % WF.length]))
  const maxH = Math.max(...sizes.map((s) => s.h))
  // heights spread over the band, with the average exactly in the middle (so the ring stays centred)
  const raw = ratios.map((_, i) => Math.sin(i * 2.399963))
  const mean = raw.reduce((a, b) => a + b, 0) / count
  const peak = Math.max(0.001, ...raw.map((v) => Math.abs(v - mean)))
  return ratios.map((ratio, i) => ({
    idx: i,
    count,
    w: sizes[i].w,
    h: sizes[i].h,
    ratio,
    maxH,
    ring: 0.96 + 0.28 * ((i * 0.618034) % 1),
    lane: ((raw[i] - mean) / peak) * 0.7,
    phase: (i / count) * TAU + (random() - 0.5) * 0.18,
    p: random() * TAU,
    zs: 0.9 + random() * 0.1,
    rot: -6 + (random() - 0.5) * 8,
    spin: -(1.1 + random() * 0.6),
  }))
}

/** Base card width for a stage of this size. */
export function cardWidth(W: number, H: number): number {
  return Math.max(100, Math.min(290, W * (W < 600 ? 0.3 : W < 1000 ? 0.24 : 0.18), H * 0.27))
}

/** Seconds a card shows one face before it turns over; staggered so cards do not flip together. */
const flipPeriod = (i: number) => 6.2 + (i % 3) * 1.3
const FLIP_HOLD = 0.74 // part of each period spent holding still

export function frameAt(c: CardSpec, g: Geometry, s: Input): Frame {
  const u = clamp01((s.intro - c.idx * 0.11) / 1.9)
  const e = easeOutCubic(u)

  const theta = c.phase + s.angle + (1 - e) * c.spin + 0.1 * Math.sin(s.t * 0.21 + c.p)
  const sa = Math.sin(theta)
  const ca = Math.cos(theta)
  const z = ca * c.zs * e - 0.5 * (1 - e) // > 0: in front of the words, < 0: behind them
  const scale = (1 / (1 - z * 0.2)) * (0.6 + 0.4 * e)

  // Horizontal: out to just beyond the words (never past the screen edge), then round
  const reach = (g.halfW + c.w * 0.5 + 14) * c.ring
  const rx = Math.min(reach, g.W / 2 - c.w * 0.6 - 6) * (1 + 0.55 * s.scroll)
  const x = g.cx + e * rx * sa - s.px * g.W * 0.07 * z * e

  // Vertical: own height around the headline's centre; the far side of the ring sits a little higher (seen from above)
  const room = Math.min(g.cy - g.top, g.bottom - g.cy) - c.maxH * 0.55
  const band = Math.max(0, room * 0.9)
  const tilt = Math.min(g.H * 0.06, band * 0.35 + 6)
  const bob = 5 * Math.sin(s.t * (0.2 + (c.idx % 3) * 0.07) + c.p)
  let y = g.cy + e * (c.lane * band * (1 + 0.35 * s.scroll) - z * tilt + bob) + s.py * g.H * 0.05 * z * e
  y -= s.scroll * g.H * 0.1
  const halfH = (c.h * scale) / 2
  y = Math.max(g.top + halfH, Math.min(g.bottom - halfH, y))

  // Turning: a gentle lean with the ring, plus a coin flip every few seconds
  const period = flipPeriod(c.idx)
  const tau = s.t + c.idx * 1.7
  const n = Math.floor(tau / period)
  const f = (tau - n * period) / period
  const flip = f < FLIP_HOLD ? 0 : easeInOutCubic((f - FLIP_HOLD) / (1 - FLIP_HOLD))
  const lean = -sa * 24 + 7 * Math.sin(s.t * 0.5 + c.p)
  const yaw = (lean + 180 * (n + flip)) * e
  const rad = (yaw * Math.PI) / 180

  return {
    x,
    y,
    scale,
    z,
    roll: (1 - e) * c.rot + e * (-4 * ca + 3 * Math.sin(s.t * 0.22 + c.p + 1)),
    pitch: e * (4 * Math.sin(s.t * 0.3 + c.p) - s.py * 8),
    yaw,
    opacity: clamp01(u * 4) * (1 - 0.92 * clamp01(s.scroll * 1.15)),
    brightness: 0.42 + 0.58 * smoothstep(-1, 0.6, z),
    blur: Math.max(0, -z - 0.15) * 2.6,
    zIndex:
      u <= 0.6 ? 20 + (c.count - c.idx) : z > 0 ? 100 + Math.round(z * 10) : 10 + Math.round((z + 1) * 10),
    front: Math.cos(rad) >= 0,
    sheenX: -Math.sin(rad) * 55,
    sheenOpacity: 0.55 * Math.pow(Math.abs(Math.sin(rad)), 0.8),
  }
}
