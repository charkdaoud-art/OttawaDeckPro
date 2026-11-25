/* Ottawa Deck Pro: progressive enhancement only. Every page works without this file. */
(function () {
  var d = document, root = d.documentElement
  root.classList.add('js')
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches

  // header: solid after scrolling past the hero; mobile estimate bar after the first screen
  var header = d.querySelector('[data-header]'), bar = d.querySelector('[data-mobile-bar]')
  function onScroll() {
    var y = window.scrollY
    if (header) header.classList.toggle('is-solid', y > 40)
    if (bar) bar.classList.toggle('show', y > window.innerHeight * 0.6)
  }
  onScroll(); addEventListener('scroll', onScroll, { passive: true })

  // mobile menu
  var menu = d.querySelector('[data-menu]'), openBtn = d.querySelector('[data-menu-open]')
  function setMenu(open) {
    if (!menu) return
    menu.hidden = !open; openBtn && openBtn.setAttribute('aria-expanded', String(open))
    d.body.style.overflow = open ? 'hidden' : ''
    if (open) { var f = menu.querySelector('button, a'); f && f.focus() } else openBtn && openBtn.focus()
  }
  openBtn && openBtn.addEventListener('click', function () { setMenu(true) })
  d.querySelectorAll('[data-menu-close]').forEach(function (b) { b.addEventListener('click', function () { setMenu(false) }) })
  addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu && !menu.hidden) setMenu(false) })

  // reveal on scroll
  var els = d.querySelectorAll('.reveal')
  if (reduce || !('IntersectionObserver' in window)) els.forEach(function (e) { e.classList.add('in') })
  else {
    var io = new IntersectionObserver(function (entries) { entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target) } }) }, { rootMargin: '0px 0px -8% 0px' })
    els.forEach(function (e) { io.observe(e) })
  }

  // before / after sliders
  d.querySelectorAll('[data-ba]').forEach(function (el) {
    var r = el.querySelector('input[type=range]')
    r && r.addEventListener('input', function () { el.style.setProperty('--pos', r.value + '%') })
  })

  // gallery filters + lightbox with keyboard and swipe
  var grid = d.querySelector('[data-gallery]')
  if (grid) {
    var items = Array.prototype.slice.call(grid.querySelectorAll('.m-item'))
    d.querySelectorAll('[data-filter]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var f = btn.getAttribute('data-filter')
        d.querySelectorAll('[data-filter]').forEach(function (b) { var on = b === btn; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', String(on)) })
        items.forEach(function (it) { it.classList.toggle('hide', f !== 'all' && it.getAttribute('data-cats').split(' ').indexOf(f) < 0) })
      })
    })
    var lb = d.querySelector('[data-lightbox]'), img = lb.querySelector('[data-lb-img]'), cap = lb.querySelector('[data-lb-cap]'), cur = 0, last = null
    function visible() { return items.filter(function (i) { return !i.classList.contains('hide') }) }
    function show(i) { var v = visible(); cur = (i + v.length) % v.length; var it = v[cur]; img.src = it.getAttribute('data-full'); img.alt = it.getAttribute('data-alt'); cap.textContent = it.getAttribute('data-alt') }
    function open(it) { last = it; lb.hidden = false; d.body.style.overflow = 'hidden'; show(visible().indexOf(it)); lb.querySelector('[data-lb-close]').focus() }
    function close() { lb.hidden = true; d.body.style.overflow = ''; last && last.focus() }
    items.forEach(function (it) { it.addEventListener('click', function () { open(it) }) })
    lb.querySelector('[data-lb-close]').addEventListener('click', close)
    lb.querySelector('[data-lb-prev]').addEventListener('click', function () { show(cur - 1) })
    lb.querySelector('[data-lb-next]').addEventListener('click', function () { show(cur + 1) })
    lb.addEventListener('click', function (e) { if (e.target === lb) close() })
    addEventListener('keydown', function (e) { if (lb.hidden) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') show(cur + 1); if (e.key === 'ArrowLeft') show(cur - 1) })
    var sx = null
    lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX }, { passive: true })
    lb.addEventListener('touchend', function (e) { if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) show(cur + (dx < 0 ? 1 : -1)); sx = null })
  }


  /* ===== 2026 upgrade ===== */
  // animated stats: count up numbers inside [data-count] once visible
  if (!reduce && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (es) { es.forEach(function (en) {
      if (!en.isIntersecting) return; cio.unobserve(en.target)
      var el = en.target, txt = el.getAttribute('data-count'), m = txt.match(/[\d,.]+/); if (!m) return
      var target = parseFloat(m[0].replace(/,/g, '')), pre = txt.slice(0, m.index), post = txt.slice(m.index + m[0].length), t0 = performance.now(), dur = 1400, comma = m[0].indexOf(',') >= 0
      ;(function tick(t) { var k = Math.min(1, (t - t0) / dur), v = Math.round(target * (1 - Math.pow(1 - k, 3))); el.textContent = pre + (comma ? v.toLocaleString('en-CA') : v) + post; if (k < 1) requestAnimationFrame(tick) })(t0)
    }) }, { threshold: 0.6 })
    d.querySelectorAll('[data-count]').forEach(function (e) { cio.observe(e) })
  }
  // subtle parallax on large architectural images
  var px = d.querySelectorAll('[data-parallax]')
  if (px.length && !reduce) {
    var ticking = false
    addEventListener('scroll', function () { if (ticking) return; ticking = true; requestAnimationFrame(function () { px.forEach(function (el) { var r = el.parentElement.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return; el.style.transform = 'translate3d(0,' + (r.top * -0.12).toFixed(1) + 'px,0) scale(1.12)' }); ticking = false }) }, { passive: true })
  }
  // commercial split: animate residential → multi-unit when in view
  d.querySelectorAll('[data-split]').forEach(function (el) {
    if (reduce || !('IntersectionObserver' in window)) return
    var on = false, timer
    new IntersectionObserver(function (es) { es.forEach(function (en) {
      clearInterval(timer); if (!en.isIntersecting) return
      timer = setInterval(function () { on = !on; el.style.setProperty('--split', on ? '8%' : '92%') }, 3200); el.style.setProperty('--split', '92%')
    }) }, { threshold: 0.4 }).observe(el)
  })
  // reels: drag to scroll on desktop + custom "Drag" cursor
  d.querySelectorAll('[data-reels]').forEach(function (track) {
    var down = false, sx = 0, sl = 0, moved = false
    var cur = d.createElement('div'); cur.className = 'cursor-drag'; cur.textContent = 'DRAG'; d.body.appendChild(cur)
    var fine = matchMedia('(pointer: fine)').matches
    track.addEventListener('mouseenter', function () { if (fine && !reduce) cur.classList.add('on') })
    track.addEventListener('mouseleave', function () { cur.classList.remove('on'); down = false })
    track.addEventListener('mousemove', function (e) { cur.style.left = e.clientX + 'px'; cur.style.top = e.clientY + 'px'; if (!down) return; var dx = e.pageX - sx; if (Math.abs(dx) > 4) moved = true; track.scrollLeft = sl - dx })
    track.addEventListener('mousedown', function (e) { down = true; moved = false; sx = e.pageX; sl = track.scrollLeft; track.style.scrollSnapType = 'none' })
    addEventListener('mouseup', function () { down = false; track.style.scrollSnapType = '' })
    track.addEventListener('click', function (e) { if (moved) { e.preventDefault(); moved = false } }, true)
  })
  // map: filters + floating project card
  var map = d.querySelector('[data-map]')
  if (map) {
    var card = map.querySelector('[data-map-card]'), q = function (s) { return card.querySelector(s) }
    map.querySelectorAll('[data-marker]').forEach(function (m) {
      m.addEventListener('click', function () {
        q('[data-mc-title]').textContent = m.dataset.title; q('[data-mc-desc]').textContent = m.dataset.desc; q('[data-mc-area]').textContent = m.dataset.area + (m.dataset.type === 'review' ? ' · Client review' : '')
        var im = q('[data-mc-img]'); if (m.dataset.img) { im.src = m.dataset.img; im.hidden = false } else im.hidden = true
        var a = q('[data-mc-link]'); if (m.dataset.link) { a.href = m.dataset.link; a.textContent = m.dataset.type === 'review' ? 'Read the review' : 'View project'; a.hidden = false } else a.hidden = true
        card.hidden = false
      })
    })
    q('[data-map-close]').addEventListener('click', function () { card.hidden = true })
    d.querySelectorAll('[data-map-filter]').forEach(function (b) {
      b.addEventListener('click', function () {
        var f = b.dataset.mapFilter, shown = 0
        d.querySelectorAll('[data-map-filter]').forEach(function (x) { var on = x === b; x.classList.toggle('chip-on', on); x.setAttribute('aria-pressed', on) })
        map.querySelectorAll('[data-marker]').forEach(function (m) { var ok = f === 'all' || m.dataset.cats.split(' ').indexOf(f) >= 0; m.classList.toggle('dim', !ok); if (ok) shown++ })
        var empty = d.querySelector('[data-map-empty]'); if (empty) empty.hidden = shown > 0; card.hidden = true
      })
    })
  }
  // before/after category tabs
  var baTabs = d.querySelectorAll('[data-ba-tab]')
  baTabs.forEach(function (t) {
    t.addEventListener('click', function () {
      var c = t.dataset.baTab, n = 0
      baTabs.forEach(function (x) { var on = x === t; x.classList.toggle('is-on', on); x.setAttribute('aria-selected', on) })
      d.querySelectorAll('[data-ba-cat]').forEach(function (it) { var ok = it.dataset.baCat === c; it.hidden = !ok; if (ok) n++ })
      var e = d.querySelector('[data-ba-empty]'); if (e) e.classList.toggle('hidden', n > 0)
    })
  })
  // lead path tabs
  // tabs switch only their own form section (a page can hold several estimate sections); setLead(k) with no scope switches all
  function setLead(k, scope) {
    var root = scope || d
    root.querySelectorAll('[data-lead-tab]').forEach(function (x) { var on = x.dataset.leadTab === k; x.classList.toggle('on', on); x.setAttribute('aria-selected', on) })
    root.querySelectorAll('[data-lead-panel]').forEach(function (p) { p.hidden = p.dataset.leadPanel !== k })
  }
  d.querySelectorAll('[data-lead-tab]').forEach(function (t) { t.addEventListener('click', function () { setLead(t.dataset.leadTab, t.closest('[data-lead-section]')) }) })
  // project wizard: select → options → inspiration → estimate (selections carried into the form; no prices)
  var wz = d.querySelector('[data-wizard]')
  if (wz) {
    var type = null, step = 1
    function go(n) { step = n; wz.querySelectorAll('[data-step]').forEach(function (s) { s.hidden = +s.dataset.step !== n }); wz.querySelectorAll('[data-step-dot]').forEach(function (s) { s.classList.toggle('on', +s.dataset.stepDot <= n) }) }
    function picks() { var out = []; wz.querySelectorAll('[data-wiz-opts="' + type + '"] fieldset').forEach(function (f) { var c = f.querySelector('input:checked'); if (c) out.push(f.querySelector('legend').textContent + ': ' + c.value) }); return out }
    wz.querySelectorAll('[data-wiz-type]').forEach(function (b) { b.addEventListener('click', function () {
      type = b.dataset.wizType; wz.querySelectorAll('[data-wiz-type]').forEach(function (x) { x.classList.toggle('on', x === b) })
      wz.querySelectorAll('[data-wiz-opts]').forEach(function (o) { o.hidden = o.dataset.wizOpts !== type }); go(2)
    }) })
    wz.querySelectorAll('[data-wiz-back]').forEach(function (b) { b.addEventListener('click', function () { go(step - 1) }) })
    wz.querySelectorAll('[data-wiz-next]').forEach(function (b) { b.addEventListener('click', function () {
      if (step === 2) {
        var mat = (picks().find(function (p) { return /^Material/.test(p) }) || '').toLowerCase(), want = type === 'residential' ? (/cedar|pressure/.test(mat) ? 'wood' : /composite|pvc/.test(mat) ? 'composite' : '') : ''
        var pool = Array.prototype.slice.call(wz.querySelectorAll('[data-insp-pool] span')).filter(function (s) { return s.dataset.k.split(' ')[0] === type && (!want || s.dataset.k.indexOf(want) >= 0 || type !== 'residential') })
        if (!pool.length) pool = Array.prototype.slice.call(wz.querySelectorAll('[data-insp-pool] span')).filter(function (s) { return s.dataset.k.split(' ')[0] === type })
        wz.querySelector('[data-wiz-insp]').innerHTML = !pool.length ? '<div class="md:col-span-3 rounded-2xl bg-ivory p-8 text-[16px] leading-relaxed text-graphite/70">We\u2019ll walk you through relevant ' + (type === 'wellness' ? 'sauna and cold-plunge' : 'multi-unit') + ' work during your consultation. Continue to send us your selections.</div>' : pool.slice(0, 6).map(function (s) { return '<figure class="media relative aspect-[4/3] overflow-hidden rounded-2xl"><img src="' + s.dataset.src + '" alt="' + s.dataset.alt.replace(/"/g, '&quot;') + '" class="h-full w-full object-cover" loading="lazy">' + '' + '</figure>' }).join('')
        go(3)
      } else if (step === 3) {
        var label = { residential: 'Luxury Residential Deck', commercial: 'Commercial / Multi-Unit Project', wellness: 'Outdoor Wellness' }[type], list = picks()
        wz.querySelector('[data-wiz-summary]').innerHTML = '<b>' + label + '</b><br>' + (list.length ? list.join('<br>') : 'No options selected')
        var summary = label + (list.length ? ' | ' + list.join(' | ') : '')
        d.querySelectorAll('[data-lead-panel="' + type + '"] [data-selections]').forEach(function (i) { i.value = summary })
        var msg = d.querySelector('[data-lead-panel="' + type + '"] textarea'); if (msg && !msg.value) msg.value = 'Selections: ' + summary
        setLead(type); go(4)
      }
    }) })
  }

  // estimate form v2: choice tiles drive hidden selects, live progress, photo dropzone
  d.querySelectorAll('form.ef').forEach(function (form) {
    var req = function () { return [].slice.call(form.querySelectorAll('[required]')) }
    var bar = form.querySelector('[data-ef-bar]'), label = form.querySelector('[data-ef-label]')
    var valid = function (i) { var v = (i.value || '').trim(); if (!v) return false; if (i.type === 'email') return /^\S+@\S+\.\S+$/.test(v); if (i.type === 'tel') return v.replace(/\D/g, '').length >= 10; return true }
    var update = function () {
      var r = req(), n = r.filter(valid).length, pct = Math.max(4, Math.round(n / r.length * 100))
      if (bar) bar.style.width = pct + '%'
      if (label) { var done = n === r.length; label.classList.toggle('done', done); label.textContent = done ? 'Ready to send \u2713 Add details below for a sharper quote' : (n === 0 ? 'Step 1 of 2 \u00b7 Your project' : n + ' of ' + r.length + ' complete') }
    }
    form.querySelectorAll('[data-ef-choice]').forEach(function (grp) {
      var sel = grp.parentNode.querySelector('select')
      grp.addEventListener('click', function (e) {
        var b = e.target.closest('[data-value]'); if (!b) return
        grp.querySelectorAll('[data-value]').forEach(function (x) { var on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-checked', on ? 'true' : 'false') })
        sel.value = b.getAttribute('data-value'); sel.dispatchEvent(new Event('change', { bubbles: true }))
        var f = grp.closest('.field'); f.classList.remove('invalid'); var er = f.querySelector('.err'); if (er) er.textContent = ''
      })
      grp.addEventListener('keydown', function (e) { if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return; var bs = [].slice.call(grp.querySelectorAll('[data-value]')), i = bs.indexOf(d.activeElement); if (i < 0) return; e.preventDefault(); bs[(i + (e.key === 'ArrowRight' ? 1 : bs.length - 1)) % bs.length].focus() })
    })
    form.addEventListener('input', function (e) { var f = e.target.closest && e.target.closest('.field'); if (f && f.classList.contains('invalid') && valid(e.target)) { f.classList.remove('invalid'); var er = f.querySelector('.err'); if (er) er.textContent = '' } update() })
    form.addEventListener('change', update)
    var drop = form.querySelector('[data-ef-drop]')
    if (drop) {
      var fin = drop.querySelector('input[type=file]'), txt = drop.querySelector('[data-ef-drop-text]'), orig = txt.textContent
      ;['dragenter', 'dragover'].forEach(function (ev) { drop.addEventListener(ev, function () { drop.classList.add('drag') }) })
      ;['dragleave', 'drop'].forEach(function (ev) { drop.addEventListener(ev, function () { drop.classList.remove('drag') }) })
      fin.addEventListener('change', function () { var n = fin.files.length; drop.classList.toggle('has', n > 0); txt.textContent = n ? n + (n === 1 ? ' file' : ' files') + ' added \u2713' : orig })
    }
    update()
  })

  // forms: validation, honeypot, confirmation. FORM_ENDPOINT is set at deploy time; without it nothing is sent.
  var ENDPOINT = window.ODP_FORM_ENDPOINT || ''
  d.querySelectorAll('form[data-form]').forEach(function (form) {
    var status = form.querySelector('.form-status')
    form.addEventListener('submit', function (e) {
      e.preventDefault()
      var ok = true
      form.querySelectorAll('[required]').forEach(function (inp) {
        var field = inp.closest('.field'), err = field && field.querySelector('.err'), v = (inp.value || '').trim(), msg = ''
        if (!v) msg = 'Required'
        else if (inp.type === 'email' && !/^\S+@\S+\.\S+$/.test(v)) msg = 'Enter a valid email'
        else if (inp.type === 'tel' && v.replace(/\D/g, '').length < 10) msg = 'Enter a 10-digit phone number'
        if (field) field.classList.toggle('invalid', !!msg)
        if (err) err.textContent = msg
        if (msg) ok = false
      })
      if (!ok) { var bad = form.querySelector('.field.invalid'); if (bad) { bad.scrollIntoView({ behavior: 'smooth', block: 'center' }); var fi = bad.querySelector('input:not(.ef-native), select:not(.ef-native), [data-value]'); fi && setTimeout(function () { fi.focus({ preventScroll: true }) }, 350) } return }
      if (form.company_website && form.company_website.value) return // spam
      var data = new FormData(form); data.append('page', location.pathname); data.append('form', form.getAttribute('data-form')); data.append('_subject', 'New estimate request from ottawadeckpro.ca')
      var done = function (sent) {
        var first = ((form.name && form.name.value) || '').trim().split(' ')[0].replace(/[<>&"]/g, '')
        form.innerHTML = '<div class="ef-done"><div class="ef-done-check"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg></div><p class="mt-6 font-display text-[30px] font-extrabold tracking-tight">' + (sent ? 'Thank you' + (first ? ', ' + first : '') + '!' : 'Your request is ready.') + '</p><p class="mx-auto mt-3 max-w-sm text-[16px] leading-relaxed text-graphite/70">' +
          (sent ? 'Thanks for sending your quote request. A team member will be in touch within 24 hours.' : 'This is the preview site, so nothing was sent. On the live site this goes straight to Ottawa Deck Pro.') + '</p>' +
          '<div class="ef-spam"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg><p><b>We just emailed you a confirmation.</b> Not in your inbox? Check your spam or junk folder and mark it <b>Not junk</b> so you get our future emails.</p></div>' +
          '<a href="/gallery" class="btn btn-dark mt-6">See our recent projects</a></div>'
        form.scrollIntoView({ behavior: 'smooth', block: 'center' })
        if (sent && window.gtag) gtag('event', 'generate_lead', { form_name: form.getAttribute('data-form') })
        if (sent && window.fbq) fbq('track', 'Lead')
      }
      if (!ENDPOINT) return done(false)
      status.textContent = 'Sending…'
      // drop empty file inputs; if the form service refuses attachments, resend the details without them
      var hasFiles = false
      ;['photos', 'documents'].forEach(function (k) { var fs = data.getAll(k).filter(function (f) { return f && f.size }); data.delete(k); fs.forEach(function (f) { data.append(k, f); hasFiles = true }) })
      var post = function (body) { return fetch(ENDPOINT, { method: 'POST', body: body, headers: { Accept: 'application/json' } }) }
      var fail = function () { status.textContent = 'Something went wrong. Please call 613-639-1744 or email hello@ottawadeckpro.ca.' }
      post(data).then(function (r) {
        if (r.ok) return done(true)
        if (!hasFiles) return fail()
        var lite = new FormData(); data.forEach(function (v, k) { if (k !== 'photos' && k !== 'documents') lite.append(k, v) })
        lite.append('attachments', 'Customer attached files that could not be uploaded. Ask them to email photos to hello@ottawadeckpro.ca.')
        return post(lite).then(function (r2) { r2.ok ? done(true) : fail() })
      }).catch(fail)
    })
  })

  // phone-click tracking (one event per click)
  d.addEventListener('click', function (e) { var a = e.target.closest && e.target.closest('a[href^="tel:"]'); if (a && window.gtag) gtag('event', 'phone_click', { link_url: a.href }) })
})()

/* FAQ library search */
;(() => {
  const lib = document.querySelector('[data-faq-lib]'); if (!lib) return
  const input = lib.querySelector('[data-faq-search]'), empty = lib.querySelector('[data-faq-empty]')
  const items = [...lib.querySelectorAll('[data-faq-q]')], groups = [...lib.querySelectorAll('[data-faq-group]')]
  input.addEventListener('input', () => {
    const t = input.value.trim().toLowerCase().split(/\s+/).filter(Boolean)
    items.forEach((d) => { const hit = t.every((w) => d.dataset.faqQ.includes(w)); d.hidden = !hit; if (t.length && hit) d.open = false })
    groups.forEach((g) => { g.hidden = !g.querySelector('[data-faq-q]:not([hidden])') })
    empty.classList.toggle('hidden', items.some((d) => !d.hidden))
  })
  if (location.hash) { const d = document.getElementById(location.hash.slice(1)); if (d && d.tagName === 'DETAILS') d.open = true }
})()

/* Wellness: load the live configurator into the hero on desktop only (saves mobile data) */
;(() => {
  const f = document.querySelector('[data-cfg-src]'); if (!f) return
  const load = () => { if (!f.src && window.matchMedia('(min-width:1024px)').matches) f.src = f.dataset.cfgSrc }
  load(); window.addEventListener('resize', load, { passive: true })
})()

/* drag-to-scroll photo bands (mouse); touch scrolls natively */
;(() => {
  document.querySelectorAll('.photo-band').forEach((el) => {
    let down = false, x0 = 0, s0 = 0, moved = false
    el.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = true; moved = false; x0 = e.clientX; s0 = el.scrollLeft; el.style.scrollSnapType = 'none' })
    window.addEventListener('pointermove', (e) => { if (!down) return; const d = e.clientX - x0; if (Math.abs(d) > 4) moved = true; el.scrollLeft = s0 - d })
    window.addEventListener('pointerup', () => { if (!down) return; down = false; el.style.scrollSnapType = '' })
    el.addEventListener('click', (e) => { if (moved) { e.preventDefault(); moved = false } }, true)
    el.addEventListener('dragstart', (e) => e.preventDefault())
  })
})()

/* review collage: tap the client video to play the full testimonial with sound */
;(() => {
  document.querySelectorAll('[data-rv-video]').forEach((fig) => {
    const v = fig.querySelector('video'), b = fig.querySelector('[data-rv-play]')
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { v.removeAttribute('autoplay'); v.pause() }
    b.addEventListener('click', () => { v.src = v.dataset.full; v.muted = false; v.loop = false; v.controls = true; fig.classList.add('playing'); fig.closest('[data-drag]') && fig.closest('[data-drag]').classList.remove('cursor-drag'); v.play() })
  })
})()

/* review collage: expand long reviews, show all */
;(() => {
  document.querySelectorAll('[data-rv-quote]').forEach((q) => q.addEventListener('click', () => q.classList.toggle('open')))
  // /reviews: filter review cards by project type
  document.querySelectorAll('[data-rvp-filter]').forEach((bar) => {
    const sec = bar.nextElementSibling && bar.nextElementSibling.matches('[data-rv]') ? bar.nextElementSibling : document.querySelector('[data-rv]')
    if (!sec) return
    bar.querySelectorAll('[data-rvp-tag]').forEach((chip) => chip.addEventListener('click', () => {
      const tag = chip.getAttribute('data-rvp-tag')
      bar.querySelectorAll('[data-rvp-tag]').forEach((c) => { c.classList.toggle('on', c === chip); c.setAttribute('aria-pressed', c === chip ? 'true' : 'false') })
      sec.classList.add('rv-all'); sec.classList.toggle('rvp-filtered', !!tag)
      sec.querySelectorAll('.rv-text').forEach((t) => { t.classList.add('in'); t.classList.toggle('rvp-hide', !!tag && !(t.getAttribute('data-rv-tags') || '').split(' ').includes(tag)) })
    }))
  })
  document.querySelectorAll('[data-rv-more]').forEach((b) => b.addEventListener('click', () => { const s = b.closest('[data-rv]'); s.classList.add('rv-all'); b.parentElement.remove() }))
})()

/* Start each page at the top, even when the preview frame keeps the previous scroll position */
;(() => { if (!location.hash) addEventListener('load', () => { try { document.documentElement.scrollIntoView({ block: 'start' }) } catch (e) {} }) })()

// email list offer: one-time popup for new visitors + list signup forms
;(function () {
  var d = document, KEY = 'odp_offer_v1', LIST = window.ODP_LIST_ENDPOINT || ''
  var store = { get: function () { try { return localStorage.getItem(KEY) } catch (e) { return '1' } }, set: function (v) { try { localStorage.setItem(KEY, v) } catch (e) {} } }
  var pop = d.querySelector('[data-offer-pop]'), last = null
  function open() {
    if (!pop || store.get() || /\/contacts/.test(location.pathname)) return
    store.set('seen'); last = d.activeElement; pop.hidden = false
    var f = pop.querySelector('input[type=email]'); f && setTimeout(function () { f.focus() }, 60)
    if (window.gtag) gtag('event', 'view_promotion', { promotion_name: 'offer_5000' })
  }
  function close() { if (!pop) return; pop.hidden = true; last && last.focus && last.focus() }
  if (pop) {
    pop.querySelectorAll('[data-offer-close]').forEach(function (b) { b.addEventListener('click', close) })
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !pop.hidden) close() })
    var fired = false, fire = function () { if (!fired) { fired = true; open() } }
    setTimeout(fire, 20000)
    addEventListener('scroll', function () { if (scrollY > (d.documentElement.scrollHeight - innerHeight) * 0.45) fire() }, { passive: true })
    d.addEventListener('mouseout', function (e) { if (!e.relatedTarget && e.clientY < 8) fire() })
  }
  d.querySelectorAll('form[data-list]').forEach(function (form) {
    var err = form.querySelector('.offer-err')
    form.addEventListener('submit', function (e) {
      e.preventDefault()
      var email = (form.email.value || '').trim()
      if (!/^\S+@\S+\.\S+$/.test(email)) { err.textContent = 'Enter a valid email address.'; form.email.focus(); return }
      if (!form.consent.checked) { err.textContent = 'Please tick the box to agree to receive our emails.'; return }
      if (form.company_website && form.company_website.value) return
      err.textContent = ''
      var done = function (sent) {
        if (sent) store.set('joined')
        form.innerHTML = '<div class="py-4"><p class="font-display text-[24px] font-bold">You&rsquo;re on the list.</p><p class="mt-1 text-[14px] opacity-70">' +
          (sent ? 'Your $5,000 offer is saved to your email. Mention it when you book your consultation.' : 'Preview site: nothing was sent. On the live site this adds you to the Ottawa Deck Pro list.') + '</p></div>'
        if (sent && window.gtag) gtag('event', 'sign_up', { method: 'offer_5000', form_id: form.getAttribute('data-list') })
        if (sent && window.fbq) fbq('track', 'CompleteRegistration', { content_name: 'offer_5000' })
      }
      if (!LIST) return done(false)
      var data = new FormData(form); data.append('source', form.getAttribute('data-list')); data.append('_subject', 'New $5,000 offer signup'); data.append('page', location.pathname); data.append('consent_text', form.querySelector('label span').textContent); data.append('consent_at', new Date().toISOString())
      fetch(LIST, { method: 'POST', body: data, headers: { Accept: 'application/json' } }).then(function (r) { if (r.ok) return done(true); return r.json().catch(function () { return {} }).then(function (j) { store.set('seen'); err.textContent = j.error || 'Something went wrong. Please try again.' }) }).catch(function () { err.textContent = 'Something went wrong. Please try again.' })
    })
  })
})()

// deck cost calculator (/decks)
;(function () {
  var root = document.querySelector('[data-calc]'); if (!root) return
  var cfg = JSON.parse(root.getAttribute('data-calc'))
  var $ = function (s) { return root.querySelector(s) }
  var L = $('[data-calc-l]'), W = $('[data-calc-w]'), S = $('[data-calc-slider]'), LF = $('[data-calc-lf]'), lfWrap = $('[data-calc-lf-wrap]')
  var lfTouched = false
  var pick = function (name, list) { var el = root.querySelector('input[name="' + name + '"]:checked'); return list.filter(function (o) { return o.id === (el && el.value) })[0] || list[0] }
  var money = function (n) { n = Math.round(n / 100) * 100; return '$' + n.toLocaleString('en-CA') }
  var clamp = function (v, a, b) { v = parseFloat(v) || 0; return Math.max(a, Math.min(b, v)) }
  var state = ''
  function calc(from) {
    var l = clamp(L.value, 4, 80), w = clamp(W.value, 4, 60)
    if (from === 'slider') { var a = clamp(S.value, 60, 1200), ratio = l / w; w = Math.max(4, Math.round(Math.sqrt(a / ratio))); l = Math.max(4, Math.round(a / w)); L.value = l; W.value = w }
    var area = l * w; S.value = Math.min(1200, area)
    root.querySelector('[data-calc-area]').textContent = area.toLocaleString('en-CA')
    if (!lfTouched) LF.value = Math.round(l + 2 * w)
    var m = pick('calc-mat', cfg.materials), r = pick('calc-rail', cfg.railings), st = pick('calc-stairs', cfg.stairs)
    lfWrap.hidden = r.id === 'none'
    var lf = r.id === 'none' ? 0 : clamp(LF.value, 0, 400)
    var parts = [[m.label + ' deck · ' + area + ' sq ft', area * m.low, area * m.high], [r.label + ' railing' + (lf ? ' · ' + lf + ' ft' : ''), lf * r.low, lf * r.high], ['Stairs · ' + st.label.toLowerCase(), st.low, st.high]].filter(function (p) { return p[2] > 0 })
    var lo = parts.reduce(function (s, p) { return s + p[1] }, 0), hi = parts.reduce(function (s, p) { return s + p[2] }, 0)
    var plus = m.plus ? '+' : ''
    root.querySelector('[data-calc-total]').textContent = money(lo) + ' to ' + money(hi) + plus
    var brk = root.querySelector('[data-calc-break]'); if (brk) brk.innerHTML = parts.map(function (p) { return '<div><dt>' + p[0] + '</dt><dd>' + money(p[1]) + ' to ' + money(p[2]) + '</dd></div>' }).join('')
    state = 'Calculator estimate: ' + l + ' x ' + w + ' ft (' + area + ' sq ft) ' + m.label + ' deck, ' + r.label.toLowerCase() + ' railing' + (lf ? ' (' + lf + ' ft)' : '') + ', stairs: ' + st.label.toLowerCase() + '. Range shown: ' + money(lo) + ' to ' + money(hi) + plus + '.'
  }
  L.addEventListener('input', function () { calc() }); W.addEventListener('input', function () { calc() })
  S.addEventListener('input', function () { calc('slider') })
  LF.addEventListener('input', function () { lfTouched = true; calc() })
  root.addEventListener('change', function (e) { if (e.target.type === 'radio') calc() })
  $('[data-calc-cta]').addEventListener('click', function () {
    var msg = document.querySelector('#estimate textarea[name="message"]')
    if (msg && !msg.value) msg.value = state
    var det = msg && msg.closest('details'); if (det) det.open = true
    if (window.gtag) gtag('event', 'calculator_quote', { value_text: state })
  })
  calc()
})()

// occasion bar: shows the occasion whose MM-DD range includes today (content/collections/occasions.json)
;(function () {
  var d = document, el = d.getElementById('odp-occasions'); if (!el) return
  var cfg; try { cfg = JSON.parse(el.textContent) } catch (e) { return }
  if (!cfg || !cfg.enabled) return
  var now = new Date(), md = ('0' + (now.getMonth() + 1)).slice(-2) + '-' + ('0' + now.getDate()).slice(-2)
  var forced = (location.search.match(/[?&]occasion=([\w-]+)/) || [])[1]
  var inRange = function (s, e) { return s <= e ? md >= s && md <= e : md >= s || md <= e }
  var o = (cfg.items || []).filter(function (x) { return forced ? x.id === forced : inRange(x.start, x.end) })[0]
  if (!o) return
  var key = 'odp_occ_closed_' + o.id
  try { if (!forced && localStorage.getItem(key)) return } catch (e) {}
  var icons = { christmas: ['🎄', '🎁'], halloween: ['🎃', '👻'], fathers: ['🔥', '🍔'], mothers: ['💐', '🌷'], canada: ['🍁', '🍁'], thanksgiving: ['🍂', '🦃'], spring: ['🌱', '☀️'], plain: ['', ''] }
  var ic = icons[o.theme] || icons.plain
  var esc = function (t) { return String(t || '').replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] }) }
  var bar = d.createElement('div'); bar.className = 'occ occ-' + esc(o.theme); bar.setAttribute('role', 'region'); bar.setAttribute('aria-label', 'Announcement')
  var lights = ''
  if (o.theme === 'christmas') { var cols = ['#FF4B4B', '#FFD34D', '#4BD37A', '#4BB3FF', '#FF7AD9']; for (var i = 0; i < 24; i++) lights += '<i style="--c:' + cols[i % 5] + ';--d:' + (i % 7) * 0.25 + 's"></i>'; lights = '<span class="occ-lights" aria-hidden="true">' + lights + '</span>' }
  bar.innerHTML = lights + '<span class="occ-msg">' + (ic[0] ? '<span class="occ-ico" aria-hidden="true">' + ic[0] + '</span>' : '') + '<span class="occ-long">' + esc(o.message) + '</span><span class="occ-short">' + esc(o.short || o.message) + '</span>' + (ic[1] ? '<span class="occ-ico" aria-hidden="true">' + ic[1] + '</span>' : '') + '</span>' +
    (o.link && o.cta ? '<a class="occ-cta" href="' + esc(o.link) + '">' + esc(o.cta) + '</a>' : '') + '<button type="button" class="occ-x" aria-label="Close announcement">×</button>'
  if (o.link) { bar.setAttribute('data-href', o.link); bar.addEventListener('click', function (e) { if (innerWidth <= 640 && !e.target.closest('.occ-x')) location.href = o.link }) }
  d.body.insertBefore(bar, d.body.firstChild); d.documentElement.classList.add('has-occ')
  bar.querySelector('.occ-x').addEventListener('click', function () { bar.remove(); d.documentElement.classList.remove('has-occ'); try { localStorage.setItem(key, '1') } catch (e) {} })
})()
