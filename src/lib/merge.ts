export type DeepPartial<T> = T extends readonly unknown[]
  ? T
  : T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v)

/**
 * Returns `base` with `override` laid over it. Objects merge key by key;
 * arrays and primitives in `override` replace the base value entirely.
 * Neither argument is modified.
 */
export function deepMerge<T>(base: T, override?: DeepPartial<T> | null): T {
  if (override === undefined || override === null) return base
  if (!isPlainObject(base) || !isPlainObject(override)) return override as T
  const out: Record<string, unknown> = { ...base }
  for (const [key, value] of Object.entries(override)) {
    if (value === undefined) continue
    out[key] = deepMerge((base as Record<string, unknown>)[key], value as never)
  }
  return out as T
}
