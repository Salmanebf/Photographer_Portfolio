/**
 * The maths of the hero's card ring, with no DOM: given the stage geometry and the time, where is each card,
 * how big, how turned, how dim. Pure, so it is tested without a browser; `orbit-engine.ts` just applies it.
 *
 * The picture: six two-sided cards ride a tilted ring around the headline. Near cards pass in front of the words,
 * far cards behind them (smaller, dimmer, slightly soft). Every few seconds each card turns over like a coin to show
 * its other face. The whole ring is centred on the headline.
 */

export const CARD_COUNT = 6
const TAU = Math.PI * 2
const WF = [0.95, 1, 0.86, 0.98, 0.9, 1] // card widths (× the base width)
const AR = [1.26, 1.32, 1.2, 1.36, 1.24, 1.3] // card heights (× own width)
/** Ring size per card (1 = just clears the words) and height per card, balanced so the ring stays centred. */
const RING = [1, 1.2, 0.96, 1.24, 1.06, 1.14]
const LANE = [-0.65, 0.5, -0.2, 0.65, -0.5, 0.2]
/** Base speed in rad/s (about 37 s per lap) */
export const BASE_SPEED = 0.17

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
  w: number
  h: number
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

export function makeCards(cardW: number, random: () => number = rng(7)): CardSpec[] {
  return Array.from({ length: CARD_COUNT }, (_, i) => {
    const w = cardW * WF[i]
    return {
      idx: i,
      w,
      h: w * AR[i],
      phase: (i / CARD_COUNT) * TAU + (random() - 0.5) * 0.18,
      p: random() * TAU,
      zs: 0.9 + random() * 0.1,
      rot: -6 + (random() - 0.5) * 8,
      spin: -(1.1 + random() * 0.6),
    }
  })
}

/** Base card width for a stage of this size. */
export function cardWidth(W: number, H: number): number {
  return Math.max(100, Math.min(290, W * (W < 600 ? 0.3 : 0.18), H * 0.27))
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
  const reach = (g.halfW + c.w * 0.5 + 14) * RING[c.idx]
  const rx = Math.min(reach, g.W / 2 - c.w * 0.6 - 6) * (1 + 0.55 * s.scroll)
  const x = g.cx + e * rx * sa - s.px * g.W * 0.07 * z * e

  // Vertical: own height around the headline's centre; the far side of the ring sits a little higher (seen from above)
  const maxH = g.cardW * Math.max(...WF.map((w, i) => w * AR[i]))
  const room = Math.min(g.cy - g.top, g.bottom - g.cy) - maxH * 0.55
  const band = Math.max(0, room * 0.9)
  const tilt = Math.min(g.H * 0.06, band * 0.35 + 6)
  const bob = 5 * Math.sin(s.t * (0.2 + (c.idx % 3) * 0.07) + c.p)
  let y = g.cy + e * (LANE[c.idx] * band * (1 + 0.35 * s.scroll) - z * tilt + bob) + s.py * g.H * 0.05 * z * e
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
      u <= 0.6 ? 20 + (CARD_COUNT - c.idx) : z > 0 ? 100 + Math.round(z * 10) : 10 + Math.round((z + 1) * 10),
    front: Math.cos(rad) >= 0,
    sheenX: -Math.sin(rad) * 55,
    sheenOpacity: 0.55 * Math.pow(Math.abs(Math.sin(rad)), 0.8),
  }
}
