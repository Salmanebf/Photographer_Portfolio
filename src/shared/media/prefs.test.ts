import { describe, expect, it } from 'vitest'
import { allowAutoplay, pickClipQuality } from './prefs'

describe('allowAutoplay', () => {
  const ok = { reducedMotion: false, saveData: false }
  it('allows by default', () => expect(allowAutoplay(ok)).toBe(true))
  it('blocks on reduced motion or data saver', () => {
    expect(allowAutoplay({ ...ok, reducedMotion: true })).toBe(false)
    expect(allowAutoplay({ ...ok, saveData: true })).toBe(false)
  })
  it('blocks on 2g, allows on 3g/4g', () => {
    expect(allowAutoplay({ ...ok, effectiveType: '2g' })).toBe(false)
    expect(allowAutoplay({ ...ok, effectiveType: '3g' })).toBe(true)
    expect(allowAutoplay({ ...ok, effectiveType: '4g' })).toBe(true)
  })
})

describe('pickClipQuality', () => {
  it('scales with connection and viewport', () => {
    expect(pickClipQuality(1440, '4g')).toBe(720)
    expect(pickClipQuality(390, '4g')).toBe(480)
    expect(pickClipQuality(1440, '3g')).toBe(360)
  })
})
