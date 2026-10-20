/**
 * Decide whether the viewer should get autoplaying background video.
 * Respects "reduce motion", the Data Saver setting and slow connections.
 */

export type MediaPrefsInput = {
  reducedMotion: boolean
  saveData: boolean
  /** navigator.connection.effectiveType */
  effectiveType?: string
}

export function allowAutoplay({ reducedMotion, saveData, effectiveType }: MediaPrefsInput): boolean {
  if (reducedMotion || saveData) return false
  if (effectiveType === 'slow-2g' || effectiveType === '2g') return false
  return true
}

/** Lower-quality clip on slow links and small screens. */
export function pickClipQuality(viewportWidth: number, effectiveType?: string): 360 | 480 | 720 {
  if (effectiveType === '3g') return 360
  if (viewportWidth < 640) return 480
  return 720
}
