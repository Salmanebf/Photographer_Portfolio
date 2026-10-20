'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import VideoLoop from '@/shared/media/video-loop'
import { heroPlayback } from '@/shared/media/playback-limiter'
import type { SiteSettings } from '@/shared/content/types'
import { measureGeometry, startOrbit, type OrbitHandle } from './orbit-engine'
import {
  DEFAULT_RATIO,
  MAX_CARDS,
  SHAPE_RATIO,
  alternateShapes,
  chooseCardCount,
  type Shape,
} from './orbit-math'
import './orbit-hero.css'

/** What a card shows. `preview` is an optional short silent clip (`bunny:<id>` / MP4). */
export interface OrbitItem {
  id: string
  title: string
  image: string
  preview?: string
  /** Shape of the preview clip (so the card is the right shape before the clip loads) */
  shape?: Shape
}

interface OrbitHeroProps {
  hero: SiteSettings['hero']
  items: OrbitItem[]
}

/**
 * The "Add your idea" button reacts to the pointer from far away: it leans toward it, grows as it gets near,
 * the warm light on its surface follows, and it squeezes when pressed. Returns the cleanup.
 */
function attachTrace(stage: HTMLElement, btn: HTMLElement): () => void {
  const REACH = 460 // px: how far away the button starts to notice the pointer
  const rest = { x: 78, y: 108, lx: 0, ly: 0, sc: 1 }
  const target = { ...rest }
  const cur = { ...rest }
  let raf = 0
  const keys = ['x', 'y', 'lx', 'ly', 'sc'] as const
  const tick = () => {
    let moving = false
    for (const k of keys) {
      const d = target[k] - cur[k]
      if (Math.abs(d) > (k === 'sc' ? 0.002 : 0.05)) {
        cur[k] += d * 0.14
        moving = true
      } else cur[k] = target[k]
    }
    btn.style.setProperty('--mx', cur.x.toFixed(1) + '%')
    btn.style.setProperty('--my', cur.y.toFixed(1) + '%')
    btn.style.setProperty('--lx', cur.lx.toFixed(2) + 'px')
    btn.style.setProperty('--ly', cur.ly.toFixed(2) + 'px')
    btn.style.setProperty('--sc', cur.sc.toFixed(3))
    raf = moving ? requestAnimationFrame(tick) : 0
  }
  const kick = () => {
    if (!raf) raf = requestAnimationFrame(tick)
  }
  const aim = (e: PointerEvent) => {
    const r = btn.getBoundingClientRect()
    const nx = (e.clientX - r.left) / r.width
    const ny = (e.clientY - r.top) / r.height
    target.x = Math.max(-15, Math.min(115, nx * 100))
    target.y = Math.max(-30, Math.min(140, ny * 100))
    const dx = e.clientX - (r.left + r.width / 2)
    const dy = e.clientY - (r.top + r.height / 2)
    const near = Math.max(0, 1 - Math.hypot(dx, dy) / REACH)
    const pull = Math.pow(near, 0.8)
    target.lx = Math.max(-1, Math.min(1, dx / 160)) * 22 * pull
    target.ly = Math.max(-1, Math.min(1, dy / 120)) * 16 * pull
    target.sc = 1 + 0.2 * Math.pow(near, 1.4)
    kick()
  }
  const reset = () => {
    Object.assign(target, rest)
    kick()
  }
  stage.addEventListener('pointermove', aim)
  btn.addEventListener('pointerdown', aim)
  stage.addEventListener('pointerleave', reset)
  return () => {
    cancelAnimationFrame(raf)
    stage.removeEventListener('pointermove', aim)
    btn.removeEventListener('pointerdown', aim)
    stage.removeEventListener('pointerleave', reset)
  }
}

/**
 * The home page's first screen. The headline is plain server-rendered text (no entrance animation),
 * so it is the first thing painted; the card ring starts once the page is interactive.
 */
export default function OrbitHero({ hero, items }: OrbitHeroProps) {
  const t = useTranslations('hero')
  const stageRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const actionsRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<HTMLCanvasElement>(null)
  const traceRef = useRef<HTMLAnchorElement>(null)
  // The cards (and their pictures) are added once the page is interactive, so the headline —
  // the first thing seen — never waits on them.
  const [cardsOn, setCardsOn] = useState(false)
  useEffect(() => {
    const id = window.setTimeout(() => setCardsOn(true), 150)
    return () => window.clearTimeout(id)
  }, [])

  // Which face of each card looks at the viewer; only that face's video plays
  const [front, setFront] = useState<boolean[]>(() => Array(MAX_CARDS).fill(true))

  // Real shapes learnt from the media itself (height ÷ width), by project: a clip's size beats the declared shape
  const [videoRatio, setVideoRatio] = useState<Record<string, number>>({})
  const [imageRatio, setImageRatio] = useState<Record<string, number>>({})
  const learn = (set: typeof setVideoRatio) => (id: string, w: number, h: number) => {
    const r = Math.round((h / w) * 1000) / 1000
    set((prev) => (prev[id] === r ? prev : { ...prev, [id]: r }))
  }
  const learnVideo = learn(setVideoRatio)
  const learnImage = learn(setImageRatio)
  const ratioOf = (it: OrbitItem) =>
    videoRatio[it.id] ?? (it.shape ? SHAPE_RATIO[it.shape] : undefined) ?? imageRatio[it.id] ?? DEFAULT_RATIO

  const words = useMemo(() => hero.headline.trim().split(/\s+/).filter(Boolean), [hero.headline])
  const longest = Math.max(1, ...words.map((w) => w.length))

  // How many cards, and which: as many as keep the ring neither crowded nor bare for the real card shapes,
  // wide and tall ones taking turns. Re-decided when the screen changes size.
  const [picked, setPicked] = useState<OrbitItem[]>([])
  const ratiosRef = useRef(ratioOf)
  useEffect(() => {
    ratiosRef.current = ratioOf
  })
  useEffect(() => {
    const stage = stageRef.current
    const title = titleRef.current
    const actions = actionsRef.current
    if (!cardsOn || !stage || !title || !actions || items.length === 0) return
    const arranged = alternateShapes(items)
    let timer = 0
    const decide = () => {
      const geo = measureGeometry(stage, title, actions)
      const n = chooseCardCount(
        arranged.map((it) => ratiosRef.current(it)),
        geo
      )
      const next = Array.from({ length: n }, (_, i) => arranged[i % arranged.length])
      setPicked((prev) =>
        prev.length === next.length && prev.every((p, i) => p.id === next[i].id) ? prev : next
      )
    }
    decide()
    const ro = new ResizeObserver(() => {
      window.clearTimeout(timer)
      timer = window.setTimeout(decide, 250)
    })
    ro.observe(stage)
    return () => {
      window.clearTimeout(timer)
      ro.disconnect()
    }
  }, [items, cardsOn])

  const cards = useMemo(() => picked.map((it, i) => ({ ...it, key: `${it.id}-${i}` })), [picked])
  const handle = useRef<OrbitHandle | null>(null)
  const ratioKey = cards.map((c) => ratioOf(c).toFixed(3)).join('|')

  useEffect(() => {
    const stage = stageRef.current
    const title = titleRef.current
    const actions = actionsRef.current
    const btn = traceRef.current
    if (!stage || !title || !actions || cards.length === 0) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const nodes = Array.from(stage.querySelectorAll<HTMLElement>('.orbit-card'))
    handle.current = startOrbit({
      stage,
      headline: title,
      actions,
      map: mapRef.current,
      cards: nodes,
      reducedMotion,
      onFace: (i, isFront) =>
        setFront((prev) => (prev[i] === isFront ? prev : prev.map((v, k) => (k === i ? isFront : v)))),
    })
    const stopTrace = btn && !reducedMotion ? attachTrace(stage, btn) : () => {}
    return () => {
      handle.current?.stop()
      handle.current = null
      stopTrace()
    }
  }, [cards])

  // A clip's real shape became known: let the ring resize that card
  useEffect(() => {
    handle.current?.refresh()
  }, [ratioKey])

  return (
    <section id="home" ref={stageRef} className="orbit-stage" aria-label={t('aria')}>
      {/* Default: the dark stage. Only if a picture was added in the Studio is it shown, dimmed. */}
      {hero.image && (
        <>
          <Image
            src={hero.image}
            alt=""
            fill
            sizes="100vw"
            fetchPriority="low"
            className="orbit-backdrop object-cover"
          />
          <div className="orbit-shade" aria-hidden="true" />
        </>
      )}
      <canvas ref={mapRef} className="orbit-map" aria-hidden="true" />

      {cards.map((c, i) => (
        <figure
          key={c.key}
          className="orbit-card"
          aria-hidden="true"
          data-card={i}
          data-ratio={ratioOf(c).toFixed(3)}
        >
          <div className="orbit-flip">
            {(['front', 'back'] as const).map((side) => (
              <div key={side} className={`orbit-face ${side}`}>
                {/* the picture is always there; a clip plays over it and, if it cannot load, the picture stays */}
                <Image
                  src={c.image}
                  alt=""
                  fill
                  sizes="340px"
                  onLoad={(e) =>
                    learnImage(c.id, e.currentTarget.naturalWidth, e.currentTarget.naturalHeight)
                  }
                />
                {c.preview && (
                  <VideoLoop
                    src={c.preview}
                    limiter={heroPlayback}
                    maxQuality={480}
                    onSize={(w, h) => learnVideo(c.id, w, h)}
                    suspended={side === 'front' ? !front[i] : front[i]}
                    className="absolute inset-0"
                  />
                )}
                <span className="orbit-sheen" aria-hidden="true" />
                <span className="orbit-cap">{c.title}</span>
              </div>
            ))}
          </div>
        </figure>
      ))}

      <div className="orbit-copy">
        <h1
          ref={titleRef}
          className="orbit-title"
          style={{ '--lines': words.length, '--longest': longest } as React.CSSProperties}
          aria-label={hero.headline}
        >
          {words.map((w, i) => (
            <span key={`${w}-${i}`} aria-hidden="true">
              {w}
            </span>
          ))}
        </h1>
      </div>

      <div ref={actionsRef} className="orbit-actions">
        {hero.tagline && <p className="orbit-tagline">{hero.tagline}</p>}
        <a ref={traceRef} className="orbit-trace" href="#contact" data-cursor="hover">
          {t('cta')}
        </a>
        <a className="orbit-link" href="#portfolio">
          {t('viewProjects')}
        </a>
      </div>
    </section>
  )
}
