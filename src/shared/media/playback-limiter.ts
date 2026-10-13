/**
 * Caps how many clips play at the same time. When a new clip asks to play and
 * the cap is reached, the clip that has been playing longest is paused.
 */

type Entry = { id: symbol; pause: () => void }

export function createPlaybackLimiter(max: number) {
  const active: Entry[] = []

  return {
    /** Register a playing clip. Returns a function to call when it stops. */
    acquire(pause: () => void): () => void {
      const entry: Entry = { id: Symbol('clip'), pause }
      active.push(entry)
      while (active.length > max) active.shift()!.pause()
      return () => {
        const i = active.indexOf(entry)
        if (i !== -1) active.splice(i, 1)
      }
    },
    get size() {
      return active.length
    },
  }
}

/** One shared limiter for the whole page. */
export const pagePlayback = createPlaybackLimiter(3)

/** A separate allowance for the home hero's cards (all six are on screen together), so they neither starve nor starve the page. */
export const heroPlayback = createPlaybackLimiter(6)

export type PlaybackLimiter = ReturnType<typeof createPlaybackLimiter>
