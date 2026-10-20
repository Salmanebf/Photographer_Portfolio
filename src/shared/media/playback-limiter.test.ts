import { describe, expect, it, vi } from 'vitest'
import { createPlaybackLimiter } from './playback-limiter'

describe('createPlaybackLimiter', () => {
  it('pauses the longest-playing clip when the cap is exceeded', () => {
    const l = createPlaybackLimiter(2)
    const [p1, p2, p3] = [vi.fn(), vi.fn(), vi.fn()]
    l.acquire(p1)
    l.acquire(p2)
    expect(l.size).toBe(2)
    l.acquire(p3)
    expect(p1).toHaveBeenCalledTimes(1)
    expect(p2).not.toHaveBeenCalled()
    expect(l.size).toBe(2)
  })
  it('frees a slot on release, without pausing anyone', () => {
    const l = createPlaybackLimiter(1)
    const p1 = vi.fn()
    const release = l.acquire(p1)
    release()
    release() // idempotent
    l.acquire(vi.fn())
    expect(p1).not.toHaveBeenCalled()
    expect(l.size).toBe(1)
  })
})
