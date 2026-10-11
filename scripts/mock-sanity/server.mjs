/**
 * A small fake of the Sanity "query" API, so the website's CMS code path can be
 * run and tested WITHOUT a Sanity account.
 *
 *   npm run cms:mock          # listens on http://localhost:3333
 *
 * It evaluates the site's real GROQ queries (with the `groq-js` library) over the
 * documents in dataset.mjs, and imitates the two perspectives the site uses:
 *   - "published" (no token needed)        → published documents only
 *   - "drafts"    (needs the read token)   → unpublished changes laid over them
 *
 * It is a TEST TOOL: it does not imitate every Sanity feature (no auth beyond the
 * token check, no CDN, no assets pipeline). Real Sanity must still be checked.
 */
import http from 'node:http'
import { parse, evaluate } from 'groq-js'
import { baseDocuments, draftDocuments } from './dataset.mjs'

export const MOCK_TOKEN = 'mock-read-token'

function documentsFor(perspective, documents) {
  const published = documents.filter((d) => !d._id.startsWith('drafts.'))
  if (perspective !== 'drafts' && perspective !== 'previewDrafts') return published
  const drafts = documents.filter((d) => d._id.startsWith('drafts.'))
  const draftIds = new Set(drafts.map((d) => d._id.slice('drafts.'.length)))
  return [
    ...published.filter((d) => !draftIds.has(d._id)),
    ...drafts.map((d) => ({ ...d, _id: d._id.slice('drafts.'.length) })),
  ]
}

/** Start the fake API. Returns `{ url, close, requests, reset, setDocuments, failNext }`. */
export async function startMockSanity({ port = 0, documents = [...baseDocuments(), ...draftDocuments()] } = {}) {
  const defaults = documents
  let docs = defaults
  const requests = []
  let failures = 0

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://mock')
    const send = (status, body) => {
      res.writeHead(status, { 'content-type': 'application/json' })
      res.end(JSON.stringify(body))
    }

    // helpers for tests
    if (url.pathname === '/__requests') return send(200, requests)
    if (url.pathname === '/__reset') { requests.length = 0; return send(200, { ok: true }) }

    const m = url.pathname.match(/^\/v[^/]+\/data\/query\/([^/]+)$/)
    if (!m) return send(404, { error: 'not found' })

    let query, params = {}, perspective = url.searchParams.get('perspective') || 'published'
    if (req.method === 'POST') {
      const body = await new Promise((r) => { let s = ''; req.on('data', (c) => (s += c)); req.on('end', () => r(JSON.parse(s || '{}'))) })
      query = body.query; params = body.params || {}; perspective = body.perspective || perspective
    } else {
      query = url.searchParams.get('query')
      for (const [k, v] of url.searchParams) if (k.startsWith('$')) params[k.slice(1)] = JSON.parse(v)
    }

    const authorization = req.headers.authorization || ''
    requests.push({ perspective, authorized: authorization === `Bearer ${MOCK_TOKEN}`, hasAuthHeader: Boolean(authorization), query: String(query).slice(0, 60) })

    if (failures > 0) { failures--; return send(500, { error: { description: 'mock failure' } }) }
    if ((perspective === 'drafts' || perspective === 'previewDrafts') && authorization !== `Bearer ${MOCK_TOKEN}`) {
      return send(401, { error: { description: 'Unauthorized - drafts need a read token' } })
    }

    try {
      const tree = parse(query, { params })
      const value = await evaluate(tree, { dataset: documentsFor(perspective, docs), params })
      const result = await value.get()
      send(200, { ms: 1, query, result })
    } catch (e) {
      send(400, { error: { description: String(e.message || e) } })
    }
  })

  await new Promise((r) => server.listen(port, '127.0.0.1', r))
  const address = server.address()
  return {
    url: `http://127.0.0.1:${address.port}`,
    requests,
    reset: () => { requests.length = 0 },
    /** Replace the documents; call with no argument to restore the defaults. */
    setDocuments: (d) => { docs = d ?? defaults },
    failNext: (n = 1) => { failures = n },
    close: () => new Promise((r) => server.close(r)),
  }
}

// `node scripts/mock-sanity/server.mjs` → run until stopped
if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(process.env.PORT || 3333)
  const mock = await startMockSanity({ port })
  console.log(`Fake Sanity API on ${mock.url}   (read token: ${MOCK_TOKEN})`)
  console.log('Run the site against it:')
  console.log(`  NEXT_PUBLIC_SANITY_PROJECT_ID=mock SANITY_API_HOST=${mock.url} \\`)
  console.log(`  SANITY_API_READ_TOKEN=${MOCK_TOKEN} SANITY_PREVIEW_SECRET=letmein npm run dev`)
}
