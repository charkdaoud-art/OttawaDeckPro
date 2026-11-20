// Ottawa Deck Pro form handler: estimate leads + $5,000 email list, sent through Brevo.
// Env: BREVO_API_KEY (required), BREVO_LIST_ID, LEAD_TO, MAIL_FROM, API_PORT
import http from 'node:http'

// accepts a plain xkeysib- key, or the base64 {"api_key": ...} form Brevo shows for MCP
function readKey(raw) {
  raw = String(raw || '').trim()
  if (!raw || raw.startsWith('xkeysib-')) return raw
  try { const j = JSON.parse(Buffer.from(raw, 'base64').toString('utf8')); if (j && j.api_key) return String(j.api_key) } catch {}
  return raw
}
const KEY = readKey(process.env.BREVO_API_KEY)
const LIST_ID = Number(process.env.BREVO_LIST_ID || 0)
const LEAD_TO = (process.env.LEAD_TO || 'hello@ottawadeckpro.ca').split(',').map((s) => s.trim()).filter(Boolean)
const FROM = { name: 'Ottawa Deck Pro', email: process.env.MAIL_FROM || 'hello@ottawadeckpro.ca' }
const BREVO = process.env.BREVO_BASE || 'https://api.brevo.com/v3'
const PORT = Number(process.env.API_PORT || 3001)
const MAX_BODY = 25 * 1024 * 1024
const MAX_ATTACH = 15 * 1024 * 1024
const PHONE = '613-639-1744'
const SITE = 'https://www.ottawadeckpro.ca'

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
const clean = (s, n = 2000) => String(s ?? '').trim().slice(0, n)
const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)

// simple per-IP rate limit: 8 submissions per 10 minutes
let lastError = null
const hits = new Map()
function limited(ip) {
  const now = Date.now(), list = (hits.get(ip) || []).filter((t) => now - t < 600000)
  list.push(now); hits.set(ip, list)
  if (hits.size > 5000) hits.clear()
  return list.length > 8
}

async function brevo(path, body) {
  const r = await fetch(BREVO + path, { method: 'POST', headers: { 'api-key': KEY, 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify(body) })
  if (!r.ok && !(path === '/contacts' && r.status === 204)) throw new Error(`Brevo ${path} ${r.status}: ${(await r.text()).slice(0, 300)}`)
}

function shell(title, inner) {
  return `<!DOCTYPE html><html><body style="margin:0;background:#F4F1EA;font-family:Inter,Helvetica,Arial,sans-serif;color:#20252A">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F1EA;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:18px;overflow:hidden">
<tr><td style="background:#121614;padding:22px 28px;color:#F4F1EA">
<div style="font-size:16px;font-weight:800;letter-spacing:.14em">OTTAWA DECK PRO</div>
<div style="font-size:10px;letter-spacing:.3em;color:#9fa39f;margin-top:4px">OUTDOOR LIVING. ELEVATED.</div></td></tr>
<tr><td style="padding:28px">
<div style="font-size:24px;font-weight:800;line-height:1.2;margin-bottom:14px">${title}</div>
${inner}
</td></tr>
<tr><td style="padding:18px 28px;background:#F4F1EA;font-size:12px;color:#6b6f6c;line-height:1.6">
Ottawa Deck Pro · 6930 Fallowfield Road, Ottawa, ON · ${PHONE} · <a href="${SITE}" style="color:#4f7d2a">ottawadeckpro.ca</a></td></tr>
</table></td></tr></table></body></html>`
}
const rows = (pairs) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px">${pairs
  .filter(([, v]) => v)
  .map(([k, v]) => `<tr><td style="padding:9px 12px 9px 0;border-bottom:1px solid #eee;color:#6b6f6c;width:150px;vertical-align:top">${esc(k)}</td><td style="padding:9px 0;border-bottom:1px solid #eee;font-weight:600">${esc(v).replace(/\n/g, '<br>')}</td></tr>`)
  .join('')}</table>`
const btn = (href, label) => `<a href="${href}" style="display:inline-block;background:#7CBC42;color:#121614;font-weight:700;text-decoration:none;padding:12px 22px;border-radius:999px;margin-top:20px">${label}</a>`


// warm confirmation the customer gets after the estimate form
function welcomeEmail({ first, service, area, base }) {
  const img = (f) => `${base}/img/email/${f}`
  const font = "font-family:Inter,'Helvetica Neue',Helvetica,Arial,sans-serif"
  return `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"></head>
<body style="margin:0;padding:0;background:#EFEBE2;${font};color:#20252A">
<div style="display:none;max-height:0;overflow:hidden">We'll be in touch within 24 hours. In the meantime, here's a look at what we build.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EFEBE2"><tr><td align="center" style="padding:28px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:22px;overflow:hidden">
  <tr><td align="center" style="padding:26px 24px 18px">
    <img src="${img('ottawa-deck-pro-logo-email.png')}" width="64" height="64" alt="Ottawa Deck Pro" style="display:block;border:0">
  </td></tr>
  <tr><td style="padding:0 18px">
    <img src="${img('ottawa-deck-pro-team-email.jpg')}" width="564" alt="The Ottawa Deck Pro team" style="display:block;width:100%;height:auto;border:0;border-radius:16px">
  </td></tr>
  <tr><td align="center" style="padding:30px 32px 6px">
    <div style="font-size:13px;font-weight:700;letter-spacing:.22em;color:#5C8F31;text-transform:uppercase">Request received</div>
    <div style="font-size:32px;line-height:1.15;font-weight:800;margin-top:10px;letter-spacing:-.01em">Thanks, ${esc(first)}!<br>We'll be in touch<br>within <span style="color:#5C8F31">24 hours</span>.</div>
    <div style="font-size:16px;line-height:1.6;color:#5a5f5c;margin-top:14px">The crew is already excited about your ${esc(service.toLowerCase())} project${area ? ' in ' + esc(area) : ''}.</div>
  </td></tr>
  <tr><td style="padding:28px 18px 6px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td width="50%" style="padding:0 6px 0 0;vertical-align:top">
        <img src="${img('3d-deck-design-email.jpg')}" width="276" alt="3D design of a second-storey composite deck" style="display:block;width:100%;height:auto;border:0;border-radius:14px">
        <div style="font-size:12px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#8a8f8b;padding-top:9px;text-align:center">The 3D design</div>
      </td>
      <td width="50%" style="padding:0 0 0 6px;vertical-align:top">
        <img src="${img('built-deck-email.jpg')}" width="276" alt="The same deck built by Ottawa Deck Pro" style="display:block;width:100%;height:auto;border:0;border-radius:14px">
        <div style="font-size:12px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#5C8F31;padding-top:9px;text-align:center">Built by our crew</div>
      </td>
    </tr></table>
  </td></tr>
  <tr><td align="center" style="padding:14px 32px 0">
    <div style="font-size:15px;line-height:1.6;color:#5a5f5c">Same project, idea to backyard. Yours is next.</div>
  </td></tr>
  <tr><td align="center" style="padding:26px 32px 34px">
    <a href="${SITE}/gallery" style="display:inline-block;background:#7CBC42;color:#121614;font-weight:700;font-size:15px;text-decoration:none;padding:14px 26px;border-radius:999px">See more of our work</a>
    <div style="font-size:14px;color:#5a5f5c;margin-top:16px">Can't wait? Call or text <a href="tel:6136391744" style="color:#20252A;font-weight:700;text-decoration:none">${PHONE}</a></div>
  </td></tr>
  <tr><td style="padding:22px 32px;background:#121614;color:#cfd2cf;font-size:13px;line-height:1.6" align="center">
    <div style="color:#ffffff;font-weight:700;font-size:14px">Mike, Elie, Sami and the whole crew</div>
    <div style="color:#9fa39f">(plus Ivy, our unofficial site inspector)</div>
    <div style="margin-top:12px;font-size:12px;color:#8a8f8b">Ottawa Deck Pro · 6930 Fallowfield Road, Ottawa, ON · <a href="${SITE}" style="color:#9ccf6c">ottawadeckpro.ca</a></div>
  </td></tr>
</table>
</td></tr></table></body></html>`
}

async function readForm(req) {
  const len = Number(req.headers['content-length'] || 0)
  if (len > MAX_BODY) throw Object.assign(new Error('too large'), { status: 413 })
  const request = new Request('http://local' + req.url, { method: 'POST', headers: req.headers, body: req, duplex: 'half' })
  return request.formData()
}

async function lead(fd, ip, base) {
  const f = (k, n) => clean(fd.get(k), n)
  const name = f('name', 120), email = f('email', 200), phone = f('phone', 40), area = f('area', 120), service = f('service', 80)
  if (!name || !isEmail(email) || phone.replace(/\D/g, '').length < 10 || !area || !service) return { status: 400, error: 'Please fill in the required fields.' }
  let selections = ''
  try { const s = JSON.parse(f('selections', 4000) || 'null'); if (s && typeof s === 'object') selections = Object.entries(s).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join('\n') } catch { selections = f('selections', 4000) }
  const attachment = []; let total = 0, skipped = 0
  for (const key of ['photos', 'documents']) for (const file of fd.getAll(key)) {
    if (!file || typeof file === 'string' || !file.size) continue
    if (total + file.size > MAX_ATTACH) { skipped++; continue }
    total += file.size
    attachment.push({ name: clean(file.name, 120).replace(/[^\w.\- ]/g, '_') || 'file', content: Buffer.from(await file.arrayBuffer()).toString('base64') })
  }
  const pairs = [['Name', name], ['Email', email], ['Phone', phone], ['Location', area], ['Service', service], ['Size', f('size', 120)], ['Material', f('material', 120)], ['Timeline', f('timeline', 120)], ['Budget', f('budget', 120)], ['Selections', selections], ['Message', f('message', 4000)], ['Files', attachment.length ? `${attachment.length} attached` + (skipped ? `, ${skipped} too large to attach` : '') : skipped ? `${skipped} too large to attach` : ''], ['Page', f('page', 200)]]
  await brevo('/smtp/email', {
    sender: FROM, to: LEAD_TO.map((email) => ({ email })), replyTo: { email, name },
    subject: `New estimate request: ${name}, ${service}, ${area}`,
    htmlContent: shell('New estimate request', `<p style="margin:0 0 16px;font-size:15px;color:#4a4f4c">Reply to this email to answer ${esc(name)} directly.</p>${rows(pairs)}${btn(`tel:${phone.replace(/[^\d+]/g, '')}`, `Call ${esc(name.split(' ')[0])}`)}`),
    ...(attachment.length ? { attachment } : {}),
    tags: ['website-lead'],
  })
  // confirmation to the customer (a failure here never loses the lead)
  brevo('/smtp/email', {
    sender: FROM, to: [{ email, name }], replyTo: { email: LEAD_TO[0], name: 'Ottawa Deck Pro' },
    subject: `Thanks ${name.split(' ')[0]}, we'll be in touch within 24 hours`,
    htmlContent: welcomeEmail({ first: name.split(' ')[0], service, area, base }),
    tags: ['lead-confirmation'],
  }).catch((e) => console.error('confirmation failed', e.message))
  console.log('lead sent', ip, service, area)
  return { status: 200 }
}

async function subscribe(fd, ip) {
  const email = clean(fd.get('email'), 200), first = clean(fd.get('first_name'), 80)
  if (!isEmail(email)) return { status: 400, error: 'Enter a valid email address.' }
  if (clean(fd.get('consent'), 10) !== 'yes') return { status: 400, error: 'Please tick the box to agree to receive our emails.' }
  const consent = `${clean(fd.get('consent_text'), 400)} | at ${clean(fd.get('consent_at'), 40) || new Date().toISOString()} | ip ${ip} | ${clean(fd.get('source'), 40)} ${clean(fd.get('page'), 200)}`
  if (LIST_ID) {
    await brevo('/contacts', { email, updateEnabled: true, listIds: [LIST_ID], attributes: { ...(first ? { FIRSTNAME: first } : {}) } })
  }
  brevo('/smtp/email', {
    sender: FROM, to: [{ email, ...(first ? { name: first } : {}) }],
    subject: 'Your $5,000 backyard makeover offer is saved',
    htmlContent: shell(`You're on the list${first ? ', ' + esc(first) : ''}.`, `<p style="font-size:15px;line-height:1.6;margin:0 0 12px">Your <b>$5,000 off</b> offer is saved to this email address. Mention it when you book your consultation and we'll apply it to your project.</p>
<p style="font-size:13px;line-height:1.6;color:#6b6f6c;margin:0 0 12px"><b>Offer conditions:</b> valid on new projects with a signed contract of $40,000 or more, before tax. You must join the list before your contract is signed. One offer per household and property. Applied as a credit on your final invoice. No cash value. Cannot be combined with other offers or deck packages. Available in Ottawa Deck Pro service areas only. Ottawa Deck Pro may change or end this offer at any time; offers already in a signed contract are honoured.</p>
<p style="font-size:12px;color:#6b6f6c;margin:0">You're receiving this because you joined our list on ottawadeckpro.ca. Reply "unsubscribe" anytime.</p>${btn(SITE + '/contacts', 'Book a free consultation')}`),
    tags: ['offer-welcome'],
  }).catch((e) => console.error('welcome failed', e.message))
  brevo('/smtp/email', {
    sender: FROM, to: LEAD_TO.map((e) => ({ email: e })), replyTo: { email },
    subject: `New $5,000 offer signup: ${first || email}`,
    htmlContent: shell('New email list signup', rows([['Name', first], ['Email', email], ['Consent', consent]])),
    tags: ['offer-signup'],
  }).catch((e) => console.error('signup notice failed', e.message))
  console.log('signup', ip)
  return { status: 200 }
}

http.createServer(async (req, res) => {
  const send = (status, obj) => { res.writeHead(status, { 'content-type': 'application/json', 'cache-control': 'no-store' }); res.end(JSON.stringify(obj)) }
  try {
    const route = req.url.split('?')[0]
    if (req.method === 'GET' && route === '/api/health') {
      const out = { ok: true, brevo: !!KEY, list: !!LIST_ID, lastError, keyFormat: KEY.startsWith('xkeysib-') ? 'api' : KEY ? 'other' : 'none' }
      if (KEY && req.url.includes('check=1')) {
        try { const r = await fetch(BREVO + '/account', { headers: { 'api-key': KEY, accept: 'application/json' } }); out.brevoStatus = r.status; if (!r.ok) out.brevoError = (await r.text()).slice(0, 300) } catch (e) { out.brevoError = e.message }
      }
      return send(200, out)
    }
    if (req.method !== 'POST' || !['/api/lead', '/api/subscribe'].includes(route)) return send(404, { ok: false })
    const ip = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim()
    if (limited(ip)) return send(429, { ok: false, error: 'Too many submissions. Please call ' + PHONE + '.' })
    const fd = await readForm(req)
    if (clean(fd.get('company_website'))) return send(200, { ok: true }) // honeypot: pretend success
    if (!KEY) { console.error('BREVO_API_KEY not set'); return send(503, { ok: false, error: 'Form temporarily unavailable. Please call ' + PHONE + '.' }) }
    const host = String(req.headers['x-forwarded-host'] || req.headers.host || '').split(',')[0].trim()
    const base = /^(www\.)?ottawadeckpro\.ca$|\.up\.railway\.app$/.test(host) ? 'https://' + host : SITE
    const out = route === '/api/lead' ? await lead(fd, ip, base) : await subscribe(fd, ip)
    send(out.status, out.status === 200 ? { ok: true } : { ok: false, error: out.error })
  } catch (e) {
    console.error('form error', e.message); lastError = { at: new Date().toISOString(), msg: String(e.message).replace(/xkeysib-[\w-]+/g, '[key]').slice(0, 300) }
    send(e.status || 500, { ok: false, error: 'Something went wrong. Please call ' + PHONE + '.' })
  }
}).listen(PORT, '127.0.0.1', () => console.log('form api on', PORT))
