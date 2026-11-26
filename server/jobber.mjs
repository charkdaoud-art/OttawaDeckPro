// Jobber: save every website lead as a Jobber client (not a request).
// Env: JOBBER_CLIENT_ID, JOBBER_CLIENT_SECRET, JOBBER_REFRESH_TOKEN (from /api/jobber/connect),
//      JOBBER_TOKEN_FILE (optional, only needed if refresh token rotation is ON), JOBBER_BASE (tests)
import crypto from 'node:crypto'
import fs from 'node:fs'

const BASE = process.env.JOBBER_BASE || 'https://api.getjobber.com'
const VERSION = process.env.JOBBER_API_VERSION || '2025-04-16'
const env = (k) => String(process.env[k] || '').trim().replace(/^['"]|['"]$/g, '').trim() // tolerate stray spaces or quotes pasted into Railway
const ID = env('JOBBER_CLIENT_ID')
const SECRET = env('JOBBER_CLIENT_SECRET')
const FILE = process.env.JOBBER_TOKEN_FILE || ''

let refresh = ''
try { if (FILE) refresh = JSON.parse(fs.readFileSync(FILE, 'utf8')).refresh || '' } catch {}
refresh = refresh || env('JOBBER_REFRESH_TOKEN')
let access = '', accessExp = 0
export const state = { lastError: null, lastSaved: null, rotated: false }

export const configured = () => !!(ID && SECRET)
export const connected = () => configured() && !!refresh

function keep(tok) {
  if (tok.refresh_token && tok.refresh_token !== refresh) {
    if (refresh) state.rotated = true
    refresh = tok.refresh_token
    if (FILE) try { fs.writeFileSync(FILE, JSON.stringify({ refresh })) } catch (e) { console.error('jobber token file', e.message) }
  }
  access = tok.access_token || ''
  let exp = Date.now() + 50 * 60e3
  try { exp = JSON.parse(Buffer.from(access.split('.')[1], 'base64url').toString()).exp * 1000 } catch {}
  accessExp = exp
}

async function token(body) {
  const params = new URLSearchParams({ client_id: ID, client_secret: SECRET, ...body })
  // form body first (current docs); Jobber's older docs pass the same values in the query string, so fall back to that
  const tries = [() => fetch(BASE + '/api/oauth/token', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded', accept: 'application/json' }, body: params }),
    () => fetch(BASE + '/api/oauth/token?' + params, { method: 'POST', headers: { accept: 'application/json' } })]
  let last = ''
  for (const t of tries) {
    const r = await t(); const txt = await r.text(); let j = {}
    try { j = JSON.parse(txt) } catch {}
    if (r.ok && j.access_token) { keep(j); return j }
    last = `${r.status}: ${String(j.error_description || j.error || j.message || txt || 'no reason given').replace(/\s+/g, ' ').slice(0, 160)}`
    console.error('jobber token refused', last, '| id', ID.length, 'chars, secret', SECRET.length, 'chars,', body.grant_type, body.redirect_uri || '')
  }
  throw new Error('Jobber token ' + last)
}

async function accessToken() {
  if (access && Date.now() < accessExp - 60e3) return access
  if (!connected()) throw new Error('Jobber not connected')
  await token({ grant_type: 'refresh_token', refresh_token: refresh })
  return access
}

export async function gql(query, variables = {}) {
  const r = await fetch(BASE + '/api/graphql', { method: 'POST', headers: { authorization: 'Bearer ' + await accessToken(), 'x-jobber-graphql-version': VERSION, 'content-type': 'application/json' }, body: JSON.stringify({ query, variables }) })
  const j = await r.json().catch(() => ({}))
  if (r.status === 401) access = ''
  if (!r.ok || j.errors?.length) throw new Error(`Jobber ${r.status}: ${(j.errors || []).map((e) => e.message).join('; ').slice(0, 200) || 'request failed'}`)
  return j.data
}

// read the live schema once so we only send fields this Jobber API version accepts
const T = `type { name kind ofType { name kind ofType { name kind ofType { name } } } }`
const unwrap = (t) => { let list = false; while (t && !t.name) { if (t.kind === 'LIST') list = true; t = t.ofType } return { name: t?.name, list } }
async function describe(name) {
  if (!name) return {}
  const d = await gql(`query($n: String!) { t: __type(name: $n) { inputFields { name ${T} } } }`, { n: name })
  return Object.fromEntries((d.t?.inputFields || []).map((f) => [f.name, unwrap(f.type)]))
}
let schema = null
async function fields() {
  if (schema) return schema
  const input = await describe('ClientCreateInput')
  const billing = input.billingAddress ? await describe(input.billingAddress.name) : {}
  // propertyCreate(clientId, input): the job address Jobber shows on the client
  const m = await gql(`{ m: __type(name: "Mutation") { fields { name args { name ${T} } } } }`)
  const pc = (m.m?.fields || []).find((f) => f.name === 'propertyCreate')
  const pcArgs = Object.fromEntries((pc?.args || []).map((a) => [a.name, unwrap(a.type)]))
  const pcInput = pcArgs.input ? await describe(pcArgs.input.name) : {}
  const propType = pcInput.properties ? await describe(pcInput.properties.name) : {}
  const propAddr = propType.address ? await describe(propType.address.name) : pcInput.address ? await describe(pcInput.address.name) : {}
  schema = { input, billing, pcArgs, pcInput, propType, propAddr }
  console.log('jobber schema', JSON.stringify({ client: Object.keys(input), billing: Object.keys(billing), propertyCreate: Object.keys(pcArgs), propertyInput: Object.keys(pcInput), property: Object.keys(propType), propertyAddress: Object.keys(propAddr) }))
  return schema
}
const street = (af) => ['street1', 'street', 'address1', 'line1'].find((k) => af[k]) || null

async function addProperty(clientId, address) {
  const { pcArgs, pcInput, propType, propAddr } = await fields()
  const k = street(propAddr)
  if (!pcArgs.clientId || !k) return console.log('jobber property skipped: no matching fields')
  const addr = { [k]: address }
  const input = pcInput.properties ? { properties: [propType.address ? { address: addr } : addr] } : pcInput.address ? { address: addr } : null
  if (!input) return console.log('jobber property skipped: unknown input shape')
  const d = await gql(`mutation($c: ${'EncodedId!'}, $i: ${pcArgs.input.name}!) { propertyCreate(clientId: $c, input: $i) { userErrors { message path } } }`, { c: clientId, i: input })
  const errs = d.propertyCreate?.userErrors || []
  if (errs.length) console.error('jobber property rejected', JSON.stringify(errs).slice(0, 300))
  else console.log('jobber property added')
}

async function existing(email) {
  try {
    const d = await gql(`query($q: String!) { clients(first: 5, searchTerm: $q) { nodes { id emails { address } } } }`, { q: email })
    return (d.clients?.nodes || []).find((c) => (c.emails || []).some((e) => String(e.address).toLowerCase() === email.toLowerCase())) || null
  } catch (e) { console.error('jobber search skipped', e.message); return null }
}

// lead -> Jobber client. Returns { id, existing } ; throws on failure.
export async function saveClient({ name, email, phone, address, company }) {
  const found = await existing(email)
  if (found) { state.lastSaved = { at: new Date().toISOString(), existing: true }; return { id: found.id, existing: true } }
  const { input, billing } = await fields()
  const parts = name.trim().split(/\s+/)
  const c = { firstName: parts[0], lastName: parts.slice(1).join(' ') }
  if (company && input.companyName) c.companyName = company
  if (input.emails) c.emails = [{ description: 'MAIN', primary: true, address: email }]
  if (input.phones) c.phones = [{ description: 'MAIN', primary: true, number: phone }]
  const bk = street(billing)
  if (address && input.billingAddress && bk) c.billingAddress = { [bk]: address }
  const M = `mutation($input: ClientCreateInput!) { clientCreate(input: $input) { client { id } userErrors { message path } } }`
  let d = await gql(M, { input: c })
  let errs = d.clientCreate?.userErrors || []
  if (errs.length && c.billingAddress) { console.error('jobber billing address rejected', JSON.stringify(errs).slice(0, 300)); delete c.billingAddress; d = await gql(M, { input: c }); errs = d.clientCreate?.userErrors || [] } // never lose a client over an address format
  if (errs.length || !d.clientCreate?.client?.id) throw new Error('Jobber rejected client: ' + errs.map((e) => e.message).join('; ').slice(0, 200))
  const id = d.clientCreate.client.id
  if (address) await addProperty(id, address).catch((e) => console.error('jobber property failed', e.message))
  state.lastSaved = { at: new Date().toISOString(), existing: false }
  return { id, existing: false }
}

// one-time owner setup: /api/jobber/connect -> Jobber login -> /api/jobber/callback
const pending = new Map()
export function connectUrl(base) {
  const st = crypto.randomBytes(16).toString('hex'), verifier = crypto.randomBytes(32).toString('base64url')
  pending.set(st, { verifier, exp: Date.now() + 15 * 60e3 })
  for (const [k, v] of pending) if (v.exp < Date.now()) pending.delete(k)
  const challenge = crypto.createHash('sha256').update(verifier).digest('base64url')
  return `${BASE}/api/oauth/authorize?` + new URLSearchParams({ response_type: 'code', client_id: ID, redirect_uri: base + '/api/jobber/callback', state: st, code_challenge: challenge, code_challenge_method: 'S256' })
}
export async function callback(base, code, st) {
  const p = pending.get(st); pending.delete(st)
  if (!p || p.exp < Date.now()) throw new Error('This link expired. Start again from /api/jobber/connect.')
  await token({ grant_type: 'authorization_code', code, redirect_uri: base + '/api/jobber/callback', code_verifier: p.verifier })
  schema = null
  const d = await gql('{ account { name } }')
  return { account: d.account?.name || 'your Jobber account', refresh }
}
