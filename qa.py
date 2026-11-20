"""Migration check: compares every original URL (crawl of the live site) with the rebuilt dist/."""
import json, os, re, sys, csv, html
from bs4 import BeautifulSoup
B = json.load(open('content/blocks.json')); M = json.load(open('content/meta.json')); IM = json.load(open('content/image-map.json'))
DIST = 'dist'
def page_file(p): return os.path.join(DIST, 'index.html' if p == '/' else p.strip('/') + '/index.html')
def norm(t): t = re.sub(r'\[([^\]]*)\]\([^)]+\)', r'\1', t or ''); t = t.replace('​', '').replace('’', "'").replace('‘', "'").replace('“', '"').replace('”', '"'); t = re.sub(r'(^|\s)[-•]\s', ' ', t); return re.sub(r'\s+', ' ', t).strip().lower()
REDIRECTS = {'/copy-of-pvc-deck-carp': '/pvc-deck-carp'}
SKIP_TEXT = re.compile(r'^(email|phone|address|timing|text)\s*:|^\*|^instant quote|^shop$|^submit$|^\[\]', re.I)
rows = []; all_ok = True
pages = set(p for p in M if p not in REDIRECTS) | {'/service-areas', '/wellness', '/wellness/retreat-configurator', '/commercial-deck-construction'}
broken = set()
for p in sorted(M):
    r = {'url': p}
    if p in REDIRECTS: r.update(status='301 → ' + REDIRECTS[p]); rows.append(r); continue
    f = page_file(p)
    if not os.path.exists(f): r['status'] = 'MISSING'; rows.append(r); all_ok = False; continue
    soup = BeautifulSoup(open(f).read(), 'html.parser')
    title = soup.title.string if soup.title else ''
    desc = (soup.find('meta', attrs={'name': 'description'}) or {}).get('content', '')
    canon = (soup.find('link', rel='canonical') or {}).get('href', '')
    h1s = [norm(h.get_text(' ')) for h in soup.find_all('h1')]
    orig_h1 = [norm(b['x']) for b in B[p] if b['t'] == 'h1']
    main = soup.find('main'); body = norm(main.get_text(' ')) if main else ''
    # content coverage: every heading, paragraph and list item from the original page
    texts = [norm(b.get('x')) for b in B[p] if b['t'] in ('p', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6') and b.get('x')]
    texts = [t for t in texts if t and not SKIP_TEXT.search(t) and 'google.com/maps' not in t]
    bodyc = body.replace(' ', '')
    missing = [t for t in texts if t.replace(' ', '') not in bodyc]
    # internal links from the original page body
    orig_links = set(re.sub(r'^https://www\.ottawadeckpro\.ca', '', b.get('h') or '') or '/' for b in B[p] if b['t'] == 'a' and (b.get('h') or '').startswith(('/', 'https://www.ottawadeckpro.ca')))
    for b in B[p]:
        for m in re.finditer(r'\]\((/[^)]*|https://www\.ottawadeckpro\.ca[^)]*)\)', b.get('x') or ''): orig_links.add(re.sub(r'^https://www\.ottawadeckpro\.ca', '', m.group(1)) or '/')
    new_links = set(a['href'].split('#')[0] or '/' for a in soup.find_all('a', href=True) if a['href'].startswith('/'))
    lost_links = sorted(l for l in orig_links if l.split('#')[0] not in new_links and l not in ('/deck-packages',) or False)
    for l in new_links:
        if l.split('?')[0] not in pages and not l.startswith(('/img/', '/assets/')): broken.add((p, l))
    imgs_orig = {b['s'] for b in B[p] if b['t'] == 'img' and '11062b_' not in b['s']}
    imgs_kept = sum(1 for s in imgs_orig if s in IM)
    r.update(status='200', title_match=title == M[p]['title'], desc_match=(desc or '') == (M[p]['desc'] or ''), canonical_match=canon == M[p]['canonical'],
             h1_original=' / '.join(orig_h1), h1_new=' / '.join(h1s), h1_match=h1s[:1] == orig_h1[:1],
             text_blocks=len(texts), text_missing=len(missing), coverage=f"{100*(len(texts)-len(missing))/max(1,len(texts)):.1f}%",
             links_original=len(orig_links), links_missing=' '.join(lost_links), images_original=len(imgs_orig), images_rehosted=imgs_kept,
             missing_sample=' || '.join(missing[:3])[:400])
    rows.append(r)
keys = ['url','status','title_match','desc_match','canonical_match','h1_match','h1_original','h1_new','text_blocks','text_missing','coverage','links_original','links_missing','images_original','images_rehosted','missing_sample']
with open('migration-report.csv', 'w', newline='', encoding='utf-8-sig') as fh:
    w = csv.DictWriter(fh, fieldnames=keys); w.writeheader(); [w.writerow({k: r.get(k, '') for k in keys}) for r in rows]
ok = [r for r in rows if r.get('status') == '200']
print('pages checked', len(rows), '| built', len(ok))
for k in ['title_match', 'desc_match', 'canonical_match', 'h1_match']: print(k, sum(1 for r in ok if r[k]), '/', len(ok))
tb = sum(r['text_blocks'] for r in ok); tm = sum(r['text_missing'] for r in ok)
print(f'text blocks {tb}, missing {tm} ({100*(tb-tm)/tb:.2f}% preserved)')
print('pages with lost links', sum(1 for r in ok if r['links_missing']))
print('broken internal links', len(broken), sorted(broken)[:10])
print('h1 mismatches:', [(r['url'], r['h1_original'], r['h1_new']) for r in ok if not r['h1_match']][:12])
worst = sorted(ok, key=lambda r: -r['text_missing'])[:8]
for r in worst: print(r['url'], r['text_missing'], '|', r['missing_sample'][:300])
