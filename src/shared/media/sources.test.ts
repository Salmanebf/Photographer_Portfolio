import { describe, expect, it } from 'vitest'
import { bunnyUrls, clipSource, parseVideoRef } from './sources'

describe('parseVideoRef', () => {
  it('parses bunny ids', () => {
    expect(parseVideoRef('bunny:3f1c2d4e-aaaa-bbbb-cccc-123456789abc')).toEqual({
      kind: 'bunny',
      id: '3f1c2d4e-aaaa-bbbb-cccc-123456789abc',
    })
  })
  it('parses YouTube (watch + short) and Vimeo', () => {
    expect(parseVideoRef('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toEqual({ kind: 'youtube', id: 'dQw4w9WgXcQ' })
    expect(parseVideoRef('https://youtu.be/dQw4w9WgXcQ')).toEqual({ kind: 'youtube', id: 'dQw4w9WgXcQ' })
    expect(parseVideoRef('https://vimeo.com/123456')).toEqual({ kind: 'vimeo', id: '123456' })
  })
  it('treats other URLs and root paths as files', () => {
    expect(parseVideoRef('https://cdn.example.com/a.mp4')).toEqual({ kind: 'file', url: 'https://cdn.example.com/a.mp4' })
    expect(parseVideoRef('/videos/a.webm')).toEqual({ kind: 'file', url: '/videos/a.webm' })
  })
  it('returns null for empty or unrecognised input', () => {
    expect(parseVideoRef('')).toBeNull()
    expect(parseVideoRef(undefined)).toBeNull()
    expect(parseVideoRef('bunny:x')).toBeNull()
    expect(parseVideoRef('not a video')).toBeNull()
  })
})

describe('bunnyUrls', () => {
  it('builds URLs from the pull-zone host', () => {
    const u = bunnyUrls('abc', 'vz-1.b-cdn.net')
    expect(u.enabled).toBe(true)
    expect(u.hls).toBe('https://vz-1.b-cdn.net/abc/playlist.m3u8')
    expect(u.thumbnail).toBe('https://vz-1.b-cdn.net/abc/thumbnail.jpg')
    expect(u.mp4(480)).toBe('https://vz-1.b-cdn.net/abc/play_480p.mp4')
  })
  it('tolerates a scheme or trailing slash in the host', () => {
    expect(bunnyUrls('abc', 'https://vz-1.b-cdn.net/').hls).toBe('https://vz-1.b-cdn.net/abc/playlist.m3u8')
  })
  it('is disabled without a host', () => {
    const u = bunnyUrls('abc', '')
    expect(u.enabled).toBe(false)
    expect(u.hls).toBeNull()
  })
})

describe('clipSource', () => {
  it('plays files directly and never uses YouTube/Vimeo', () => {
    expect(clipSource({ kind: 'file', url: '/a.mp4' })).toBe('/a.mp4')
    expect(clipSource({ kind: 'youtube', id: 'dQw4w9WgXcQ' })).toBeNull()
    expect(clipSource(null)).toBeNull()
  })
})
