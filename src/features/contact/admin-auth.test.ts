import { describe, expect, it } from 'vitest'
import { isAdminAuthorized } from './admin-auth'

describe('isAdminAuthorized', () => {
  it('accepts the exact bearer token', () => {
    expect(isAdminAuthorized('Bearer s3cret', 's3cret')).toBe(true)
  })
  it('rejects wrong, missing or malformed headers', () => {
    expect(isAdminAuthorized('Bearer nope', 's3cret')).toBe(false)
    expect(isAdminAuthorized(null, 's3cret')).toBe(false)
    expect(isAdminAuthorized('s3cret', 's3cret')).toBe(false)
  })
})
