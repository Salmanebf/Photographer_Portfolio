/**
 * Motion for the orbit hero: applies `orbit-math` to the card elements every frame.
 * Positions go straight to element styles (never React state); the only thing reported back to React is which face of
 * a card looks at the viewer, so the hidden face's video can rest.
 */
import {
  BASE_SPEED,
  DEFAULT_RATIO,
  MAX_CARDS,
  cardWidth,
  clamp01,
  frameAt,
  makeCards,
  rng,
  type Geometry,
  type Input,
} from './orbit-math'

export interface OrbitElements {
  stage: HTMLElement
  /** The headline: the ring turns around its centre */
  headline: HTMLElement
  /** The button area: cards never reach it */
  actions: HTMLElement
  /** Optional faint decorative lines */
  map?: HTMLCanvasElement | null
  /** One element per card (at most MAX_CARDS); each holds an `.orbit-flip` and a `data-ratio` (height ÷ width) */
  cards: HTMLElement[]
  reducedMotion: boolean
  /** Told when a card turns its other face to the viewer */
  onFace?: (index: number, front: boolean) => void
}

const TAU = Math.PI * 2

/** The stage geometry the ring turns in (also used to decide how many cards fit). */
export function measureGeometry(stage: HTMLElement, headline: HTMLElement, actions: HTMLElement): Geometry {
  const W = stage.clientWidth
  const H = stage.clientHeight
  const sr = stage.getBoundingClientRect()
  const q = headline.getBoundingClientRect()
  return {
    W,
    H,
    // the ring turns around the middle of the big words
    cx: (q.left + q.right) / 2 - sr.left - W / 2,
    cy: (q.top + q.bottom) / 2 - sr.top - H / 2,
    halfW: (q.right - q.left) / 2,
    top: -H / 2 + 84, // below the menu
    bottom: actions.getBoundingClientRect().top - sr.top - H / 2 - 12, // above the button
    cardW: cardWidth(W, H),
  }
}

export interface OrbitHandle {
  stop: () => void
  /** Re-read the card shapes (a clip's real shape became known) */
  refresh: () => void
}

/** Starts the animation; returns a function that stops it and removes every listener. */
export function startOrbit(els: OrbitElements): OrbitHandle {
  const { stage, headline, actions, map, reducedMotion, onFace } = els
  const nodes = els.cards.slice(0, MAX_CARDS)
  if (nodes.length === 0) return { stop: () => {}, refresh: () => {} }

  const flips = nodes.map((n) => n.querySelector<HTMLElement>('.orbit-flip'))
  const sheens = nodes.map((n) => Array.from(n.querySelectorAll<HTMLElement>('.orbit-sheen')))
  const facing = nodes.map(() => true)
  let geo: Geometry = { W: 0, H: 0, cx: 0, cy: 0, halfW: 0, top: 0, bottom: 0, cardW: 200 }
  let cards = makeCards(
    nodes.map(() => DEFAULT_RATIO),
    geo
  )

  function drawMap() {
    if (!map) return
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    map.width = Math.round(geo.W * dpr)
    map.height = Math.round(geo.H * dpr)
    const c = map.getContext('2d')
    if (!c) return
    const { W, H } = geo
    c.setTransform(dpr, 0, 0, dpr, 0, 0)
    c.clearRect(0, 0, W, H)
    const r = rng(11)
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
    geo = measureGeometry(stage, headline, actions)
    stage.style.setProperty('--cw', geo.cardW + 'px')
    cards = makeCards(
      nodes.map((n) => Number(n.dataset.ratio) || DEFAULT_RATIO),
      geo
    )
    nodes.forEach((n, i) => {
      n.style.width = cards[i].w + 'px'
      n.style.height = cards[i].h + 'px'
    })
    drawMap()
  }

  // Pointer and scroll
  let px = 0
  let py = 0
  let pxT = 0
  let pyT = 0
  let scroll = 0
  const onMove = (e: PointerEvent) => {
    const r = stage.getBoundingClientRect()
    pxT = (e.clientX - r.left) / r.width - 0.5
    pyT = (e.clientY - r.top) / r.height - 0.5
  }
  const onLeave = () => {
    pxT = 0
    pyT = 0
  }
  const onScroll = () => {
    const r = stage.getBoundingClientRect()
    scroll = clamp01(-r.top / Math.max(1, r.height * 0.9))
  }
  if (!reducedMotion) {
    stage.addEventListener('pointermove', onMove)
    stage.addEventListener('pointerleave', onLeave)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
  }

  let angle = reducedMotion ? 0.5 : 0
  let t = 0
  let intro = reducedMotion ? 99 : 0

  function draw() {
    const input: Input = { angle, t, intro, px, py, scroll }
    for (let i = 0; i < nodes.length; i++) {
      const f = frameAt(cards[i], geo, input)
      const el = nodes[i]
      el.style.transform = `translate3d(${f.x.toFixed(2)}px, ${f.y.toFixed(2)}px, 0) scale(${f.scale.toFixed(4)}) rotate(${f.roll.toFixed(2)}deg)`
      el.style.opacity = f.opacity.toFixed(3)
      el.style.filter =
        f.blur > 0.05 && !reducedMotion
          ? `brightness(${f.brightness.toFixed(3)}) blur(${f.blur.toFixed(2)}px)`
          : `brightness(${f.brightness.toFixed(3)})`
      // Nothing moves for reduced-motion visitors, so no card may cover the headline
      el.style.zIndex = String(reducedMotion ? 10 + i : f.zIndex)
      const flip = flips[i]
      if (flip) flip.style.transform = `rotateX(${f.pitch.toFixed(2)}deg) rotateY(${f.yaw.toFixed(2)}deg)`
      for (const s of sheens[i]) {
        s.style.opacity = f.sheenOpacity.toFixed(3)
        s.style.transform = `translateX(${f.sheenX.toFixed(1)}%)`
      }
      if (f.front !== facing[i]) {
        facing[i] = f.front
        onFace?.(i, f.front)
      }
    }
  }

  measure()
  draw()

  const remeasure = () => {
    measure()
    draw()
  }
  const ro = new ResizeObserver(remeasure)
  ro.observe(stage)
  ro.observe(headline)
  let cancelled = false
  document.fonts?.ready.then(() => {
    if (!cancelled) remeasure()
  })

  if (reducedMotion) {
    return {
      stop: () => {
        cancelled = true
        ro.disconnect()
      },
      refresh: remeasure,
    }
  }

  let raf = 0
  let running = false
  let inView = false
  let last = 0
  const loop = (now: number) => {
    if (!running) return
    const dt = Math.min((now - last) / 1000, 0.05)
    last = now
    t += dt
    intro += dt
    const k = 1 - Math.exp(-dt * 2.4)
    px += (pxT - px) * k
    py += (pyT - py) * k
    // moving the pointer right speeds the ring up, left slows it (never stops or reverses); scrolling away slows it too
    const speed = Math.max(0.2, 1 + 1.6 * px) * (1 - 0.55 * scroll)
    angle += BASE_SPEED * speed * dt
    draw()
    raf = requestAnimationFrame(loop)
  }
  const sync = () => {
    const was = running
    running = inView && !document.hidden
    if (running && !was) {
      last = performance.now()
      raf = requestAnimationFrame(loop)
    }
  }
  const io = new IntersectionObserver(([en]) => {
    inView = en.isIntersecting
    sync()
  })
  io.observe(stage)
  document.addEventListener('visibilitychange', sync)

  return {
    stop: () => {
      cancelled = true
      running = false
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      stage.removeEventListener('pointermove', onMove)
      stage.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', sync)
    },
    refresh: remeasure,
  }
}
