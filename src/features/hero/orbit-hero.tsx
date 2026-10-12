'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import VideoLoop from '@/shared/media/video-loop'
import type { SiteSettings } from '@/shared/content/types'
import { startOrbit } from './orbit-engine'
import './orbit-hero.css'

/** What a card shows. `preview` is an optional short silent clip (`bunny:<id>` / MP4). */
export interface OrbitItem {
  id: string
  title: string
  image: string
  preview?: string
}

interface OrbitHeroProps {
  hero: SiteSettings['hero']
  items: OrbitItem[]
}

/** Cards on the ring: enough to look full even with only a few projects. */
const MIN_CARDS = 8
const MAX_CARDS = 11

/** Moves the light on the button toward the pointer; returns the cleanup. */
function attachTrace(stage: HTMLElement, btn: HTMLElement): () => void {
  const target = { x: 78, y: 108, lx: 0, ly: 0 }
  const cur = { ...target }
  let raf = 0
  const keys = ['x', 'y', 'lx', 'ly'] as const
  const tick = () => {
    let moving = false
    for (const k of keys) {
      const d = target[k] - cur[k]
      if (Math.abs(d) > 0.05) {
        cur[k] += d * 0.16
        moving = true
      } else cur[k] = target[k]
    }
    btn.style.setProperty('--mx', cur.x.toFixed(1) + '%')
    btn.style.setProperty('--my', cur.y.toFixed(1) + '%')
    btn.style.setProperty('--lx', cur.lx.toFixed(2) + 'px')
    btn.style.setProperty('--ly', cur.ly.toFixed(2) + 'px')
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
    const near = Math.max(0, 1 - Math.hypot((nx - 0.5) * r.width, (ny - 0.5) * r.height) / 260)
    target.lx = Math.max(-1, Math.min(1, (nx - 0.5) * 2)) * 5 * near
    target.ly = Math.max(-1, Math.min(1, (ny - 0.5) * 2)) * 4 * near
    kick()
  }
  const reset = () => {
    Object.assign(target, { x: 78, y: 108, lx: 0, ly: 0 })
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

  const words = useMemo(() => hero.headline.trim().split(/\s+/).filter(Boolean), [hero.headline])
  const longest = Math.max(1, ...words.map((w) => w.length))

  // Repeat the projects to fill the ring (a ring of 4 would look empty)
  const cards = useMemo(() => {
    if (!cardsOn || items.length === 0) return []
    const count = Math.min(MAX_CARDS, Math.max(MIN_CARDS, items.length))
    return Array.from({ length: count }, (_, i) => ({
      ...items[i % items.length],
      key: `${items[i % items.length].id}-${i}`,
    }))
  }, [items, cardsOn])

  useEffect(() => {
    const stage = stageRef.current
    const title = titleRef.current
    const actions = actionsRef.current
    const btn = traceRef.current
    if (!stage || !title || !actions) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const nodes = Array.from(stage.querySelectorAll<HTMLElement>('.orbit-card'))
    const stop = startOrbit({
      stage,
      headline: title,
      actions,
      map: mapRef.current,
      cards: nodes,
      reducedMotion,
    })
    const stopTrace = btn && !reducedMotion ? attachTrace(stage, btn) : () => {}
    return () => {
      stop()
      stopTrace()
    }
  }, [cards])

  return (
    <section id="home" ref={stageRef} className="orbit-stage" aria-label={t('aria')}>
      {hero.video ? (
        <VideoLoop
          eager
          src={hero.video}
          poster={hero.image}
          className="orbit-backdrop object-cover"
        />
      ) : hero.image ? (
        <Image
          src={hero.image}
          alt=""
          fill
          sizes="100vw"
          fetchPriority="low"
          className="orbit-backdrop object-cover"
        />
      ) : null}
      <canvas ref={mapRef} className="orbit-map" aria-hidden="true" />

      {cards.map((c, i) => (
        <figure key={c.key} className="orbit-card" aria-hidden="true" data-card={i}>
          <div className="orbit-flip">
            <div className="orbit-face front">
              {c.preview ? (
                <VideoLoop src={c.preview} poster={c.image} className="absolute inset-0" />
              ) : (
                <Image src={c.image} alt="" fill sizes="300px" />
              )}
              <span className="orbit-cap">{c.title}</span>
            </div>
            <div className="orbit-face back">
              <Image src={c.image} alt="" fill sizes="300px" />
              <span className="orbit-cap">{c.title}</span>
            </div>
          </div>
        </figure>
      ))}

      <div className="orbit-copy">
        <div>
          {(hero.eyebrow || hero.nameLine1) && (
            <p className="orbit-kicker">
              {[hero.eyebrow, `${hero.nameLine1} ${hero.nameLine2}`.trim()]
                .filter(Boolean)
                .join(' · ')}
            </p>
          )}
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
