/**
 * Motion for the orbit hero: a huge headline in the middle and cards riding a 3D ring around it.
 * Plain DOM maths (no React) so the component only has to render markup. Ported from the client's
 * supplied design; positions are written straight to element styles, never to React state.
 */

const TAU = Math.PI * 2
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/** Width factors and height/width ratios give the cards slightly different shapes. */
const WF = [0.92, 1, 0.8, 0.94, 0.86, 1, 0.82, 0.96, 0.8, 1, 0.9]
const AR = [1.28, 1.0, 1.36, 1.18, 1.3, 0.96, 1.24, 1.12, 1.34, 1.0, 1.2]
/** Base speed in rad/s (about 37 s per lap) */
const SPEED = 0.17

export interface OrbitElements {
  stage: HTMLElement
  /** The headline: the ring turns around its box */
  headline: HTMLElement
  /** The button area: cards never reach it */
  actions: HTMLElement
  /** Optional faint decorative lines */
  map?: HTMLCanvasElement | null
  /** One element per card; each has a `.orbit-flip` child */
  cards: HTMLElement[]
  reducedMotion: boolean
}

interface Card {
  el: HTMLElement
  flip: HTMLElement | null
  idx: number
  w: number
  h: number
  da: number
  D?: number
  ph: number
  delay: number
  jx: number
  jy: number
  rot: number
  kx: number
  sf: number
  zs: number
  yc: number
  amp: number
  yph: number
  tilt: number
  turn: number
  wv: number
  p: number
  u: number
  g: number
  a: number
  z: number
  s: number
  px: number
  py: number
}

function mulberry(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Starts the animation; returns a function that stops it and removes every listener. */
export function startOrbit(els: OrbitElements, random: () => number = Math.random): () => void {
  const { stage, headline, actions, map, cards: nodes, reducedMotion } = els
  const COUNT = nodes.length
  if (COUNT === 0) return () => {}

  let W = 0
  let H = 0
  let CW = 200
  let EX = { l: 0, r: 0 }
  let TOPL = 0
  let BOTL = 0

  const cards: Card[] = nodes.map((el, i) => {
    const lane = random()
    return {
      el,
      flip: el.querySelector<HTMLElement>('.orbit-flip'),
      idx: i,
      w: 0,
      h: 0,
      da: 0,
      ph: (i / COUNT) * TAU + (random() - 0.5) * 0.4,
      delay: i * 0.09, // the top card of the pile leaves first
      jx: (random() - 0.5) * 10,
      jy: (random() - 0.5) * 6,
      rot: -5 + (random() - 0.5) * 8,
      kx: 1 + lane * 0.3,
      sf: 1.06 - lane * 0.1 + (random() - 0.5) * 0.03,
      zs: 0.85 + random() * 0.25,
      yc: (((i * 0.618034) % 1) - 0.5) * 2,
      amp: random() * 0.1,
      yph: random() * TAU,
      tilt: 0.06 + random() * 0.12,
      turn: 0.5 + random() * 0.2,
      wv: 0.2 + random() * 0.25,
      p: random() * TAU,
      u: 0,
      g: 0,
      a: 0,
      z: 0,
      s: 1,
      px: 0,
      py: 0,
    }
  })

  function drawMap() {
    if (!map) return
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    map.width = Math.round(W * dpr)
    map.height = Math.round(H * dpr)
    const c = map.getContext('2d')
    if (!c) return
    c.setTransform(dpr, 0, 0, dpr, 0, 0)
    c.clearRect(0, 0, W, H)
    const r = mulberry(11)
    c.lineJoin = 'round'
    for (let b = 0; b < 8; b++) {
      const cx = r() * W
      const cy = r() * H
      const R = (0.12 + r() * 0.2) * Math.max(W, H)
      const ph = [r() * TAU, r() * TAU, r() * TAU]
      for (let k = 0; k < 4; k++) {
        const rr = R * (1 - k * 0.22)
        c.strokeStyle = `rgba(255,255,255,${0.055 - k * 0.015})`
        c.lineWidth = 1
        c.beginPath()
        for (let a = 0; a <= 48; a++) {
          const an = (a / 48) * TAU
          const rad =
            rr *
            (1 +
              0.16 * Math.sin(3 * an + ph[0]) +
              0.1 * Math.sin(5 * an + ph[1]) +
              0.06 * Math.sin(8 * an + ph[2]))
          const x = cx + Math.cos(an) * rad
          const y = cy + Math.sin(an) * rad * 0.8
          if (a) c.lineTo(x, y)
          else c.moveTo(x, y)
        }
        c.closePath()
        c.stroke()
      }
    }
    c.strokeStyle = 'rgba(255,255,255,0.04)'
    for (let l = 0; l < 7; l++) {
      let x = r() * W
      let y = r() * H
      let an = r() * TAU
      c.beginPath()
      c.moveTo(x, y)
      for (let k = 0; k < 14; k++) {
        an += (r() - 0.5) * 1.1
        x += Math.cos(an) * W * 0.06
        y += Math.sin(an) * H * 0.06
        c.lineTo(x, y)
      }
      c.stroke()
    }
  }

  function measure() {
    W = stage.clientWidth
    H = stage.clientHeight
    CW = Math.max(96, Math.min(300, W * (W < 600 ? 0.27 : 0.2), H * 0.27))
    stage.style.setProperty('--cw', CW + 'px')
    cards.forEach((p, i) => {
      p.w = CW * WF[i % WF.length]
      p.h = p.w * AR[i % AR.length]
      p.el.style.width = p.w + 'px'
      p.el.style.height = p.h + 'px'
    })
    drawMap()
    const sr = stage.getBoundingClientRect()
    const q = headline.getBoundingClientRect()
    EX = { l: q.left - sr.left - W / 2, r: q.right - sr.left - W / 2 }
    TOPL = -H / 2 + 22
    BOTL = actions.getBoundingClientRect().top - sr.top - H / 2 - 12 // cards never reach the button
  }

  // Pointer parallax
  let gy = 0
  let gx = 0
  let gyT = 0
  let gxT = 0
  const onMove = (e: PointerEvent) => {
    const r = stage.getBoundingClientRect()
    gyT = ((e.clientX - r.left) / r.width - 0.5) * 0.3
    gxT = ((e.clientY - r.top) / r.height - 0.5) * 0.2
  }
  const onLeave = () => {
    gyT = 0
    gxT = 0
  }
  if (!reducedMotion) {
    stage.addEventListener('pointermove', onMove)
    stage.addEventListener('pointerleave', onLeave)
  }

  let introT = reducedMotion ? 99 : 0

  function render(t: number, dt = 0) {
    const k = 1 - Math.exp(-dt * 2.2)
    gy += (gyT - gy) * k
    gx += (gxT - gx) * k
    introT += dt
    const pad = 14
    const cxT = (EX.l + EX.r) / 2
    const hwT = (EX.r - EX.l) / 2
    const maxH = Math.max(...cards.map((p) => p.h))
    const mid = (TOPL + BOTL) / 2
    const band = Math.max(0, ((BOTL - TOPL) / 2 - maxH * 0.62) * 0.85)

    for (const p of cards) {
      const u = clamp01((introT - p.delay) / 1.7)
      const g = 1 - (1 - u) * (1 - u)
      p.u = u
      p.g = g
      const aNom = p.ph - SPEED * p.sf * t + p.da
      if (p.D === undefined) {
        // start angle: somewhere on the far side
        const wrapPi = (v: number) => {
          v = ((v % TAU) + TAU) % TAU
          return v > Math.PI ? v - TAU : v
        }
        const m = ((aNom % TAU) + TAU) % TAU
        const lo = Math.PI / 2 + 0.4
        const hi = (3 * Math.PI) / 2 - 0.4
        p.D =
          m >= lo && m <= hi
            ? 0
            : Math.abs(wrapPi(lo - m)) < Math.abs(wrapPi(hi - m))
              ? wrapPi(lo - m)
              : wrapPi(hi - m)
      }
      const a = aNom + (1 - g) * p.D
      const sa = Math.sin(a)
      const ca = Math.cos(a)
      const z = ca * p.zs * g - 0.6 * (1 - g) // > 0 in front of the text, < 0 behind it
      const s = 1 / (1 - z * 0.17)
      const halfH = (p.h * s) / 2
      const A = Math.min((hwT + p.w * 0.55 + pad) * p.kx, W * 0.5 - 4)
      const sc = CW / 260
      const stackX = (-p.idx * 2.6 + p.jx) * sc
      const stackY = (p.idx * 3.2 + p.jy) * sc
      let X = g * A * sa + (1 - g) * stackX
      let Y =
        g *
          (p.yc * band +
            p.amp * p.h * Math.sin(a + p.yph) +
            z * p.tilt * p.h +
            5 * Math.sin(t * p.wv + p.p)) +
        (1 - g) * stackY
      X -= gy * W * 0.1 * z
      Y += gx * H * 0.08 * z
      p.a = a
      p.z = z
      p.s = s
      p.px = cxT + X
      p.py = g < 1 ? mid + Y : Math.max(TOPL + halfH, Math.min(BOTL - halfH, mid + Y))
    }

    // Cards at a similar depth that overlap slide apart along their rings.
    const kd = introT > 3 ? Math.min(1, dt * 3) : 0
    for (let i = 0; i < cards.length; i++) {
      for (let j = i + 1; j < cards.length; j++) {
        const A = cards[i]
        const B = cards[j]
        const needX = (A.w * A.s + B.w * B.s) * 0.5 * 0.92
        const needY = (A.h * A.s + B.h * B.s) * 0.5 * 0.92
        if (
          Math.abs(A.z - B.z) < 0.7 &&
          Math.abs(A.px - B.px) < needX &&
          Math.abs(A.py - B.py) < needY
        ) {
          let d = (A.a - B.a) % TAU
          if (d > Math.PI) d -= TAU
          else if (d < -Math.PI) d += TAU
          const dir = d >= 0 ? 1 : -1
          A.da += dir * 0.06 * kd
          B.da -= dir * 0.06 * kd
        }
      }
    }
    for (const p of cards) p.da = Math.max(-0.7, Math.min(0.7, p.da * Math.exp(-dt * 0.12)))

    // Draw. Cards turn with the flow; far cards are dimmed.
    const appear = clamp01(introT / 0.2)
    for (const p of cards) {
      p.el.style.transform = `translate3d(${p.px.toFixed(2)}px, ${p.py.toFixed(2)}px, 0) scale(${p.s.toFixed(4)}) rotate(${((1 - p.g) * p.rot).toFixed(2)}deg)`
      p.el.style.opacity = appear.toFixed(3)
      const dim = 0.4 + 0.6 * clamp01((p.z + 0.9) / 0.9)
      p.el.style.filter = `brightness(${dim.toFixed(3)})`
      p.el.style.zIndex = String(
        p.u <= 0.7
          ? 20 + (COUNT - p.idx)
          : p.z > 0
            ? 100 + Math.round(p.z * 10)
            : 10 + Math.round((p.z + 1.3) * 10)
      )
      if (p.flip) {
        const turn = (p.a * p.turn * 180 * p.g) / Math.PI
        p.flip.style.transform =
          `rotateY(${turn.toFixed(2)}deg) rotateX(${(5 * p.g * Math.sin(t * 0.3 + p.p)).toFixed(2)}deg) ` +
          `rotateZ(${(3.5 * p.g * Math.sin(t * 0.22 + p.p + 1)).toFixed(2)}deg)`
      }
    }
  }

  const settle = () => {
    for (let i = 0; i < 80; i++) render(12, 0.05)
    // Nothing moves, so no card may cover the headline: every card goes behind it
    for (const p of cards) p.el.style.zIndex = String(10 + p.idx)
  }
  measure()
  if (reducedMotion) settle()
  else render(12)

  const remeasure = () => {
    measure()
    if (reducedMotion) settle()
  }
  const ro = new ResizeObserver(remeasure)
  ro.observe(stage)
  ro.observe(headline)
  let cancelled = false
  document.fonts?.ready.then(() => {
    if (!cancelled) remeasure()
  })

  let io: IntersectionObserver | undefined
  let raf = 0
  let running = false

  if (!reducedMotion) {
    let last = 0
    let clock = 12
    const loop = (now: number) => {
      if (!running) return
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      clock += dt
      render(clock, dt)
      raf = requestAnimationFrame(loop)
    }
    let inView = false
    const sync = () => {
      const was = running
      running = inView && !document.hidden
      if (running && !was) {
        last = performance.now()
        raf = requestAnimationFrame(loop)
      }
    }
    io = new IntersectionObserver(([en]) => {
      inView = en.isIntersecting
      sync()
    })
    io.observe(stage)
    const onVis = sync
    document.addEventListener('visibilitychange', onVis)
    return () => {
      cancelled = true
      running = false
      cancelAnimationFrame(raf)
      io?.disconnect()
      ro.disconnect()
      stage.removeEventListener('pointermove', onMove)
      stage.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVis)
    }
  }

  return () => {
    cancelled = true
    ro.disconnect()
  }
}
