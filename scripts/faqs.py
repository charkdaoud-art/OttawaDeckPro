# Source of truth for the FAQ library. Run: python3 scripts/faqs.py  -> content/collections/faqs.json
# Rules: company facts only from the existing site (warranty, insurance, deposit, design fee, areas, colours).
# Code/bylaw facts checked against City of Ottawa pages and the Ontario Building Code (Nov 2026). Always "confirm for your property".
import json, re

CATS = {
  'cost': 'Cost & budgeting', 'materials': 'Decking materials', 'lifespan': 'Lifespan & maintenance',
  'permits': 'Permits & building code', 'design': 'Design & features', 'railings': 'Railings',
  'hottub': 'Hot tubs & pools', 'climate': 'Ottawa climate & seasons', 'repair': 'Repair, resurfacing & staining',
  'fences': 'Fences', 'process': 'Working with Ottawa Deck Pro', 'commercial': 'Commercial & multi-unit',
  'wellness': 'Saunas, cold plunges & wellness',
}

F = []
def q(cat, tags, question, answer, link=None):
    F.append({'cat': cat, 'tags': tags.split(), 'q': question, 'a': answer, 'link': link})

COST = '/post/deck-cost-ottawa'
# ---------- cost ----------
q('cost', 'cost general', 'How much does a deck cost per square foot in Ottawa?',
  'Installed prices in Ottawa usually fall around $35 to $55 per sq ft for pressure-treated wood, $45 to $75 for composite and $60 to $90+ for PVC. Height, stairs, railings, access and site prep move a project up or down that range.', [COST, 'Deck cost guide'])
q('cost', 'cost general', 'How much does a 12x12 deck cost in Ottawa?',
  'A 12x12 deck (144 sq ft) typically lands around $6,000 to $12,000+, depending mostly on material and how high it sits off the ground. Railings and stairs are the biggest add-ons at that size.', [COST, 'Deck cost guide'])
q('cost', 'cost general', 'How much does a 16x16 deck cost?',
  'A 16x16 deck (256 sq ft) is commonly in the $12,000 to $20,000+ range in Ottawa. Composite or PVC, glass railings and multiple stair runs push it toward the top.', [COST, 'Deck cost guide'])
q('cost', 'cost general', 'How much should I budget for a deck?',
  'Start from size times a per-square-foot range for your material, then add 10 to 15% for the extras people forget: stairs, lighting, skirting, removal of an old deck and permits. Ask that every quote lists these lines so you can compare fairly.', ['/post/how-much-should-you-budget-for-deck-building-in-ottawa', 'Budget guide'])
q('cost', 'cost composite', 'Is a composite deck worth the extra cost?',
  'For most Ottawa homeowners planning to stay 7+ years, yes. Composite costs more up front but skips the sanding and staining every 2 to 3 years that wood needs, so the total cost often evens out over the life of the deck.', ['/post/composite-vs-wood-decking-for-ottawa-homeowners-which-is-the-right-choice', 'Composite vs wood'])
q('cost', 'cost general', 'What makes a deck more expensive?',
  'Height above grade, number of stairs, curves and picture framing, premium boards, glass railings, built-in lighting, difficult access for equipment, and removing an old structure. Simple rectangular decks close to the ground are the most cost efficient.')
q('cost', 'cost general', 'Is a bigger deck cheaper per square foot?',
  'Usually a little. Fixed costs like mobilization, permits and stairs are spread over more area, so the per-square-foot price can drop slightly on larger decks even though the total goes up.')
q('cost', 'cost railings', 'How much do deck railings add to the cost?',
  'Railings are often 20 to 35% of a deck budget on raised decks because every linear foot counts. Aluminum picket is the most economical maintenance-free option; glass panels cost more but keep the view open.', ['/railings', 'Railing options'])
q('cost', 'cost general', 'Does a new deck increase home value?',
  'A well-built, permitted deck adds usable living space and curb appeal, and buyers in Ottawa notice outdoor space. Return depends on the neighbourhood and the deck matching the house, so build for how you will use it rather than as a pure investment.')
q('cost', 'cost general', 'What is the cheapest way to build a nice deck?',
  'Keep it low to the ground (often no railings or permit needed), use a simple rectangle, choose pressure-treated framing with an entry-level composite board, and add features like lighting later. A package deck can also lock in a clear price.', ['/deck-packages', 'Deck packages'])
q('cost', 'cost packages', 'What is included in a deck package?',
  'Our packages list the size, material and base price up front, with optional upgrades priced separately so there are no surprises. Check the package page for current sizes and what each tier includes.', ['/deck-packages', 'See deck packages'])
q('cost', 'cost general', 'Why do deck quotes vary so much between contractors?',
  'Differences usually come from footing type and depth, joist spacing, board grade, railing system, whether permits and drawings are included, insurance coverage and cleanup. Compare line by line, not just the total.', ['/post/deck-building-mistakes-ottawa', 'Common deck mistakes'])
q('cost', 'cost general', 'Do deck prices go up in spring?',
  'Demand peaks from April to July, so schedules fill and material pricing can move. Planning and signing in winter usually gets you an earlier start date.')
q('cost', 'cost general', 'Can I finance my deck?',
  'Many homeowners use a line of credit or home-equity financing for larger outdoor projects. Ask us about the payment schedule when you get your quote so you can plan cash flow around the deposit, midpoint and completion payments.')

# ---------- materials ----------
CVW = ['/post/composite-vs-wood-decking-for-ottawa-homeowners-which-is-the-right-choice', 'Composite vs wood guide']
q('materials', 'materials composite wood', 'Trex vs wood: which is better for an Ottawa deck?',
  'Trex is a composite brand. Compared with wood it resists rot, splintering and insects and does not need staining, which matters in Ottawa\'s freeze-thaw winters. Wood costs less up front and can be refinished, but needs regular maintenance to last.', CVW)
q('materials', 'materials composite pvc', 'What lasts longer, composite or PVC decking?',
  'Both are long-life options. PVC is 100% plastic, fully waterproof and generally the longest lasting with the least fading. Composite blends wood fibre and plastic and is a durable, slightly more affordable choice.')
q('materials', 'materials wood lifespan', 'What deck material lasts the longest?',
  'PVC typically lasts the longest (30+ years), followed by composite (25 to 30 years), cedar (15 to 20 years) and pressure-treated wood (10 to 15 years), assuming proper installation and maintenance.')
q('materials', 'materials wood', 'Cedar vs pressure-treated wood: which should I choose?',
  'Cedar is naturally rot resistant, lighter and better looking, and costs more. Pressure-treated pine is the budget choice and is also what most decks use for framing. Both need sealing or staining to look their best.')
q('materials', 'materials composite', 'Does composite decking get hot in the sun?',
  'Darker composite and PVC boards can get noticeably warm in direct summer sun. Lighter colours, capped boards designed for heat, and some shade from a pergola or umbrella make a big difference.')
q('materials', 'materials composite', 'Is composite decking slippery?',
  'Modern capped composite has an embossed grain that gives decent traction. Like any deck surface it can be slick with ice or wet leaves, so clear snow with a plastic shovel and keep it clean.')
q('materials', 'materials composite', 'Does composite decking fade?',
  'Today\'s capped composite resists fading far better than early generations. Expect some slight weathering in the first months, then stable colour. PVC generally holds colour best.')
q('materials', 'materials composite', 'Can composite decking mould or stain?',
  'It resists mould far better than wood, but dirt and pollen can still let mildew form on the surface in shaded, damp spots. A simple wash with soap and water or a composite deck cleaner a couple of times a year keeps it clean.')
q('materials', 'materials composite pvc', 'What are capped composite boards?',
  'Capped boards have a protective polymer shell around the core. The cap resists stains, fading and moisture much better than older uncapped composite, and it is the standard for quality decks now.')
q('materials', 'materials framing', 'What is a composite deck frame made of?',
  'Almost always pressure-treated lumber. The surface boards are composite, but the joists, beams and posts underneath are treated wood sized to code, so framing quality matters as much as the boards.')
q('materials', 'materials framing', 'What joist spacing do you need for composite decking?',
  'Composite usually requires joists at 16 inches on centre, and 12 inches for diagonal layouts or some products. Follow the manufacturer\'s span rules or the warranty may not apply.')
q('materials', 'materials composite pvc', 'Do composite and PVC decks need hidden fasteners?',
  'Most premium boards use hidden clips for a clean, screw-free surface. Colour-matched face screws are used at edges and stairs. Both are acceptable when installed per the manufacturer.')
q('materials', 'materials composite', 'Can I mix composite boards with wood?',
  'Yes. A common approach is a composite surface with aluminum railings on a treated wood frame. Some homeowners also use composite for the surface and wood for a pergola or privacy screen.')
q('materials', 'materials pvc', 'Is PVC decking good for around pools and hot tubs?',
  'PVC is fully waterproof and does not absorb moisture, so it is a strong choice near water. Choose a textured, lighter colour for grip and heat.', ['/post/deck-with-hot-tub-ottawa', 'Hot tub deck guide'])
q('materials', 'materials composite', 'What composite decking brands do you install?',
  'We work with major composite and PVC manufacturers and will recommend specific lines based on budget, colour and warranty. Ask during your estimate to see samples side by side.')
q('materials', 'materials wood', 'Is pressure-treated wood safe for kids and pets?',
  'Modern residential pressure-treated lumber uses copper-based preservatives approved for decks. Washing hands after handling bare wood and keeping it sealed is good practice.')
q('materials', 'materials composite pvc', 'What is the best decking for low maintenance?',
  'PVC and capped composite are the lowest-maintenance options. No staining, no sanding, just occasional washing.', ['/decks', 'Custom decks'])
q('materials', 'materials composite', 'Does composite decking expand and contract?',
  'Yes, it moves with temperature, mostly along its length. Installers leave specific end gaps based on the temperature on install day, which is one reason professional installation matters in Ottawa.')
q('materials', 'materials composite', 'Can composite decking be recycled?',
  'Many composite boards are made largely from recycled plastic and wood fibre. End-of-life recycling options are limited and vary by manufacturer.')

# ---------- lifespan & maintenance ----------
q('lifespan', 'lifespan maintenance wood', 'How do I know if my deck needs to be replaced?',
  'Warning signs include soft or spongy boards, rot at posts or the ledger, wobbly railings, footings that have heaved, and loose stairs. Surface wear can often be fixed by resurfacing; structural rot usually means rebuilding.', ['/deck-repair-kanata', 'Deck repair'])
q('lifespan', 'maintenance composite', 'How do I clean a composite deck?',
  'Sweep regularly and wash with warm soapy water and a soft brush. A low-pressure rinse is fine; avoid high pressure close to the surface and metal shovels in winter.')
q('lifespan', 'maintenance wood', 'Can I pressure wash my wood deck?',
  'Yes, carefully, at low pressure with a wide fan tip held at a distance. Too much pressure raises the grain and gouges the wood, which then needs sanding before staining.', ['/staining', 'Deck staining'])
q('lifespan', 'maintenance', 'How do I remove snow from my deck?',
  'Use a plastic shovel and push along the boards, not across them. Avoid metal blades and rock salt; calcium chloride ice melt is generally safer for composite, but check your board manufacturer.')
q('lifespan', 'maintenance', 'Is rock salt bad for decks?',
  'Rock salt can damage wood finishes and stain some surfaces, and it is hard on fasteners. Use a deck-safe ice melt and rinse in spring.')
q('lifespan', 'lifespan framing', 'How long does deck framing last?',
  'Properly built pressure-treated framing with good drainage and ventilation commonly lasts 20+ years. Joist tape on top of the joists helps protect them under composite boards.')
q('lifespan', 'lifespan framing', 'What is joist tape and is it worth it?',
  'Joist tape is a waterproof membrane applied to the tops of joists and beams to keep water out of fastener holes. It is inexpensive and helps the frame last as long as long-life composite boards.')
q('lifespan', 'maintenance', 'What maintenance does a deck need each spring?',
  'Clear debris between boards, wash the surface, check railings and stairs for movement, look at footings for heave, and tighten anything loose. Wood decks also need a check on finish wear.')
q('lifespan', 'lifespan', 'Why do decks fail early?',
  'Most early failures come from footings that are too shallow for Ottawa\'s frost, poor ledger flashing, under-sized joists, and missing permits or inspections. Good structure matters more than the boards you see.', ['/post/deck-building-mistakes-ottawa', 'Deck mistakes to avoid'])
q('lifespan', 'maintenance', 'How do I keep my deck from getting mouldy?',
  'Let air flow underneath, trim back plants, keep gaps between boards clear, and wash shaded areas a couple of times a year.')
q('lifespan', 'maintenance wood', 'Should I seal a new pressure-treated deck right away?',
  'New treated wood is often wet. Many stain makers recommend letting it dry until water soaks in rather than beading, which can take a few weeks to a season, before applying finish.', ['/staining', 'Staining service'])

# ---------- permits & code ----------
CITY = ['/deck-builder-ottawa', 'Deck builder Ottawa']
q('permits', 'permits code', 'Do I need a permit to build a deck in Ottawa?',
  'In the City of Ottawa, a permit is needed if the deck is attached to or adjacent to the house and more than 600 mm (24 in) above grade, if it is an elevated deck providing principal access, or if it is freestanding, over 10 m² and over 600 mm high. Confirm with the City for your property; we handle permit drawings for our clients.', CITY)
q('permits', 'permits code', 'Do I need a permit for a deck under 24 inches high?',
  'Often not in Ottawa, as long as it is not an elevated principal-access deck. It still has to meet zoning setbacks, and building it to code is still the smart choice.')
q('permits', 'permits code', 'How long does a deck permit take in Ottawa?',
  'It depends on the City\'s workload and whether the drawings are complete. Plan for a few weeks in busy season and factor it into your timeline.')
q('permits', 'permits code', 'How much does a deck permit cost in Ottawa?',
  'City permit fees are usually a modest part of the budget. The bigger cost is preparing proper drawings, which we can handle as part of the project.', ['/post/how-much-should-you-budget-for-deck-building-in-ottawa', 'Budget guide'])
q('permits', 'permits code', 'What happens if I build a deck without a permit?',
  'The City can issue orders to comply, and unpermitted work can cause problems with insurance and when you sell. It is usually more expensive to fix after the fact.')
q('permits', 'permits code railings', 'When is a railing required on a deck in Ontario?',
  'The Ontario Building Code requires a guard where the walking surface is more than 600 mm (about 24 in) above the adjacent ground.', ['/railings', 'Railings'])
q('permits', 'code railings', 'How high does a deck railing need to be in Ontario?',
  'For a house deck, at least 900 mm (about 36 in) when the deck is 1.8 m (about 6 ft) or less above grade, and at least 1,070 mm (about 42 in) when it is higher.', ['/railings', 'Railings'])
q('permits', 'code railings', 'How far apart can deck balusters be?',
  'Openings in a guard must stop a 100 mm (about 4 in) sphere from passing through, and the guard must not be easy to climb between roughly 140 mm and 900 mm above the deck.')
q('permits', 'code framing climate', 'How deep do deck footings need to be in Ottawa?',
  'Footings must sit below the frost line so they do not heave. In the Ottawa area that commonly means about 1.2 to 1.5 m (4 to 5 ft) deep, or an engineered option like helical piles.')
q('permits', 'code framing', 'What are helical piles and are they good for decks?',
  'Helical piles are steel posts screwed into the ground below the frost line. They install quickly with little digging and work well in tight yards or poor soil. Concrete footings are the other common option.')
q('permits', 'permits code', 'Are there setback rules for decks in Ottawa?',
  'Yes. Zoning sets how close a deck can be to property lines and limits size and height in some yards. Corner lots and decks above 600 mm are more restricted. We check this before design.')
q('permits', 'permits code', 'Do I need a survey to get a deck permit?',
  'A site plan showing the deck and property lines is required. A survey makes it more accurate and is recommended, especially near setbacks.')

# ---------- design & features ----------
q('design', 'design', 'What size deck do I need?',
  'Plan around furniture: a dining table for six needs roughly 12x12 ft on its own, a lounge area about the same. Add walkways and grill space. A rough sketch with your furniture is the best starting point.', ['/decks', 'Custom deck ideas'])
q('design', 'design', 'What is a multi-level deck and when does it make sense?',
  'A multi-level deck uses two or more platforms connected by steps. It works well on sloped yards and for separating dining, lounging and hot tub zones.', ['/gallery', 'See projects'])
q('design', 'design', 'What is picture framing on a deck?',
  'Picture framing is a border of boards around the edge running perpendicular to the main field. It hides cut ends and gives a finished, premium look.')
q('design', 'design lighting', 'Should I add lighting to my deck?',
  'Yes, if you use the deck at night. Low-voltage stair, post-cap and under-rail lights improve safety and look great. Planning it during the build hides the wiring.')
q('design', 'design', 'What is deck skirting and do I need it?',
  'Skirting closes in the space under a raised deck. It looks finished and keeps animals out, but needs to leave room for ventilation so the frame can dry.')
q('design', 'design privacy', 'How can I add privacy to my deck?',
  'Options include privacy screens, horizontal slat walls, pergolas with louvres, planters and tall glass with frosted panels. Check fence and height bylaws for screens near property lines.', ['/backyard-makeover', 'Backyard makeovers'])
q('design', 'design makeover', 'Can you build a pergola on my deck?',
  'Yes. A pergola needs proper post support and connections, so it is best designed with the deck. It adds shade and structure for lights or a privacy screen.', ['/backyard-makeover', 'Backyard makeovers'])
q('design', 'design', 'What are the best deck colours for an Ottawa home?',
  'Mid-tone greys and browns hide dirt and pollen best and stay cooler than very dark boards. Match the deck to your roof, windows or brick rather than the siding exactly.')
q('design', 'design', 'Can I see my deck in 3D before it is built?',
  'Yes. We offer a 3D design consultation, and the fee is credited to your project if you build with us.', ['/faq#do-you-offer-design-or-3d-renderings-before-building', 'About 3D design'])
q('design', 'design', 'What is a floating deck?',
  'A floating or ground-level deck is freestanding and sits close to the ground. It is often simpler and cheaper, but still needs a solid base so it does not shift with frost.')
q('design', 'design', 'Can a deck be built around a tree?',
  'Yes, with a framed opening that leaves room for the trunk to grow and roots to stay undisturbed. Plan to enlarge the opening over time.')
q('design', 'design', 'Can I add built-in seating or planters?',
  'Yes. Built-in benches and planters save space and look custom. Note that seating along an edge can affect required guard height, so it has to be planned to code.')
q('design', 'design', 'How many stairs will my deck need?',
  'It depends on the height above grade. Each riser is roughly 7 to 8 inches, so a 3 ft deck usually needs about 5 risers. Wider stairs feel more inviting and suit larger decks.')
q('design', 'design', 'Can you build a deck with a covered roof?',
  'Yes, but a roof adds structural and permit requirements because the deck has to carry snow loads. It is designed as a structure, not added later.')
q('design', 'design makeover', 'What is included in a backyard makeover?',
  'A makeover can combine a deck, railings, lighting, privacy screens, pergolas, fencing and landscaping into one plan and one schedule.', ['/backyard-makeover', 'Backyard makeovers'])

# ---------- railings ----------
R = ['/railings', 'Railing options']
q('railings', 'railings aluminum glass', 'Aluminum vs glass railings: which is better?',
  'Aluminum picket is durable, maintenance free and the most economical. Glass keeps views open and looks modern, costs more, and needs occasional cleaning. Many homes mix both: glass on the view side, aluminum elsewhere.', R)
q('railings', 'railings glass', 'Are glass deck railings safe?',
  'Yes, when they use tempered safety glass in a tested system and are installed to code. The glass is designed to withstand the required loads.', R)
q('railings', 'railings glass', 'Do glass railings get dirty fast?',
  'They show water spots and pollen, especially near trees. A quick clean with glass cleaner or water and vinegar a few times a season keeps them clear.')
q('railings', 'railings aluminum', 'Do aluminum railings rust?',
  'Aluminum does not rust. Powder-coated aluminum resists corrosion and fading, which is why it suits Ottawa winters.', R)
q('railings', 'railings aluminum', 'What colours do aluminum railings come in?',
  'We offer black, white and bronze as standard, and you can mix spindle and frame colours for a custom look.', R)
q('railings', 'railings', 'Can I replace my railings without replacing my deck?',
  'Usually yes, if the posts and framing are sound. New aluminum or glass railings are one of the quickest ways to update an older deck.', R)
q('railings', 'railings stairs', 'Do deck stairs need a handrail?',
  'Ontario requires handrails on stairs above a certain number of risers. In practice most deck stairs over two or three steps should have one for safety.')
q('railings', 'railings', 'What is a top-mount vs fascia-mount railing?',
  'Top-mount posts sit on the deck surface. Fascia-mount posts attach to the side of the deck frame, freeing up floor space and giving a cleaner look, especially with glass.')
q('railings', 'railings glass', 'Frameless vs framed glass railings: what is the difference?',
  'Framed glass sits in an aluminum top and bottom rail. Frameless or post-less designs use clamps or a base shoe for an almost invisible look and cost more.')
q('railings', 'railings', 'How long do aluminum railings last?',
  'Quality powder-coated aluminum railings commonly last for decades with minimal care, often outlasting the deck boards.')
q('railings', 'railings', 'Can railings be installed in winter?',
  'Railing installation can often continue in cold weather when the deck is already built, as long as surfaces are clear and safe to work on.')

# ---------- hot tubs & pools ----------
HT = ['/post/deck-with-hot-tub-ottawa', 'Hot tub deck guide']
q('hottub', 'hottub design', 'Can my deck hold a hot tub?',
  'Only if it is designed for it. A filled hot tub with people can weigh several thousand pounds, so the deck under it needs extra footings, beams and joists. Never place one on an existing deck without checking the structure.', HT)
q('hottub', 'hottub design', 'Should a hot tub sit on the deck or be recessed?',
  'Both work. On the deck is simpler; recessed into the deck gives a sleek look and easy entry but needs access for service panels and careful framing.', HT)
q('hottub', 'hottub permits', 'Does a hot tub need a fence in Ottawa?',
  'Under Ottawa\'s Pool Enclosure By-law, a hot tub needs an enclosure unless it has a compliant lockable safety cover that is kept locked when not in use. A pool enclosure permit is still required.')
q('hottub', 'hottub', 'What decking is best around a hot tub?',
  'PVC or capped composite, because they do not absorb water. Choose a textured surface and plan for drainage away from the frame.', HT)
q('hottub', 'hottub fences permits', 'How high does a pool fence need to be in Ottawa?',
  'Pool enclosures in Ottawa must be at least 1.5 m (5 ft) high with self-closing, self-latching gates. A pool enclosure permit is required.', ['/fences', 'Fences'])
q('hottub', 'hottub design', 'Can you build a deck around an above-ground pool?',
  'Yes. A pool deck needs proper footings independent of the pool, a code-compliant guard and enclosure, and gaps that let the pool walls be serviced.')

# ---------- climate ----------
q('climate', 'climate', 'Can you build a deck in winter in Ottawa?',
  'Yes in many cases. Footings and helical piles can go in on frozen ground with the right equipment, and framing continues in cold weather. Some finishes and products have temperature limits.')
q('climate', 'climate', 'When should I book my deck for summer?',
  'Plan design and quotes in winter, and book by February or March for a spring or early summer build.')
q('climate', 'climate lifespan', 'How does Ottawa weather affect decks?',
  'Freeze-thaw cycles, heavy snow and humid summers are hard on wood finishes and shallow footings. Deep footings, good drainage and low-maintenance boards handle it best.')
q('climate', 'climate framing', 'What is frost heave?',
  'Frost heave happens when wet soil freezes and pushes footings upward. It causes uneven decks and doors that rub. Footings below the frost line prevent it.')
q('climate', 'climate', 'Should I cover my deck in winter?',
  'No need for composite or PVC. Covering can trap moisture. Just clear heavy snow and keep drains and gaps clear.')
q('climate', 'climate wood', 'Will snow damage my wood deck?',
  'Snow itself is fine if the deck was built for snow loads. Moisture sitting on worn finishes is the issue, which is why wood needs regular sealing.')
q('climate', 'climate', 'How long does a typical deck build take in Ottawa?',
  'Once permits and materials are ready, most standard decks take one to two weeks on site, with larger multi-level builds taking longer. Weather can shift dates.', ['/faq', 'Full FAQ'])
q('climate', 'climate', 'What is the best month to build a deck in Ottawa?',
  'May to October gives the most predictable weather. Late summer and fall often have shorter waits than spring.')

# ---------- repair, resurfacing, staining ----------
q('repair', 'repair', 'Can I resurface my deck instead of replacing it?',
  'Yes, if the frame and footings are sound. Resurfacing replaces boards and railings on the existing structure, often with composite, at a lower cost than a full rebuild.', ['/deck-repair-kanata', 'Deck repair'])
q('repair', 'repair', 'Can composite boards go on an old wood frame?',
  'Sometimes. The frame must be solid, level and at the joist spacing composite requires, which often means adding joists. We inspect before recommending it.')
q('repair', 'repair', 'How do you fix a sagging deck?',
  'Sagging usually means undersized or rotted beams, too few posts or failed footings. The fix is adding or replacing structural members and footings, not just the surface.', ['/deck-repair-kanata', 'Deck repair'])
q('repair', 'repair', 'What is a deck ledger and why does it matter?',
  'The ledger is the board that attaches the deck to the house. Improper fastening or flashing can let water into the house and cause the deck to pull away. It is one of the most important parts to get right.')
q('repair', 'repair staining wood', 'Should I stain or paint my deck?',
  'Stain soaks in and wears gradually, making recoats easier. Paint and solid coatings can peel on horizontal surfaces and are harder to maintain.', ['/staining', 'Staining service'])
q('repair', 'staining wood', 'Semi-transparent or solid stain: which is better?',
  'Semi-transparent shows the grain and wears gracefully. Solid stain hides imperfections on older wood but can peel and needs more prep when you recoat.', ['/staining', 'Staining service'])
q('repair', 'staining wood', 'What is the best weather to stain a deck?',
  'Dry days with mild temperatures and no rain in the forecast for at least a day. Avoid staining in direct midday sun, which dries it too fast.')
q('repair', 'staining wood', 'Can you stain a deck in the fall?',
  'Yes, while daytime temperatures stay above the product\'s minimum and nights do not drop too far. Early fall is often ideal.', ['/staining', 'Staining service'])
q('repair', 'repair', 'How much does deck removal cost?',
  'It depends on size, height and access. Removal and disposal are usually priced into a replacement quote.')
q('repair', 'repair', 'Can you repair just my deck stairs?',
  'Yes. Stairs often wear out before the rest of the deck. Replacing stringers, treads and handrails is a common standalone repair.', ['/deck-repair-kanata', 'Deck repair'])

# ---------- fences ----------
FN = ['/fences', 'Fence installation']
q('fences', 'fences permits', 'How tall can a fence be in Ottawa?',
  'Under Ottawa\'s Fence By-law, residential fences are generally limited to 2.13 m (7 ft) in side and rear yards and 1 m in front yards. Exemptions and corner-lot rules apply.', FN)
q('fences', 'fences', 'Do I need a permit for a fence in Ottawa?',
  'Most residential fences that meet the Fence By-law do not need a building permit. Pool enclosures are the exception and need a pool enclosure permit.', FN)
q('fences', 'fences', 'PVC vs ornamental iron fence: which is better?',
  'PVC gives full privacy with almost no maintenance. Ornamental iron and aluminum styles look elegant and keep sightlines open. Your goal, privacy or definition, decides it.', FN)
q('fences', 'fences', 'Who pays for a fence between neighbours in Ottawa?',
  'The City\'s Fence By-law includes rules for shared boundary fences. Talk to your neighbour first, and check the by-law if you cannot agree.')
q('fences', 'fences', 'How long does a PVC fence last?',
  'Quality PVC fencing can last for decades with occasional washing, and it will not rot or need painting.', FN)
q('fences', 'fences', 'Can you match my fence to my deck?',
  'Yes. Coordinating colours and materials between fence, deck and railings makes the yard feel designed rather than assembled.', ['/backyard-makeover', 'Backyard makeovers'])

# ---------- process ----------
q('process', 'process', 'What happens during a deck estimate?',
  'We visit, measure, talk about how you want to use the space, review materials and colours, and check access and grading. You then get a detailed written proposal.', ['/contacts', 'Book an estimate'])
q('process', 'process', 'What should I ask a deck builder before hiring?',
  'Ask about insurance and WSIB, permits, footing type and depth, joist spacing, warranty, payment schedule, and to see recent work. Compare quotes line by line.', ['/post/deck-building-mistakes-ottawa', 'Mistakes to avoid'])
q('process', 'process', 'Do I need to be home during construction?',
  'Not usually. We need access to the yard and sometimes an outdoor outlet. We keep you updated on progress.')
q('process', 'process', 'What do I need to do before construction starts?',
  'Clear the area of furniture and planters, mark irrigation and buried lines if you know them, and arrange pet access. Utility locates are booked before digging.')
q('process', 'process', 'Will my lawn be damaged during the build?',
  'Some wear around the work zone is normal. We protect access routes where possible and clean up at the end.')
q('process', 'process', 'Who manages the permit process?',
  'We can prepare permit drawings and handle submission and inspections as part of the project.', CITY)
q('process', 'process company', 'Is Ottawa Deck Pro locally owned?',
  'Yes. We are a locally owned deck builder based in Stittsville, serving Kanata, Barrhaven, Orleans and the wider Ottawa region.', ['/service-areas', 'Service areas'])
q('process', 'process company', 'Where can I read reviews of Ottawa Deck Pro?',
  'Our Google reviews are linked on the site, and you can see completed work in our gallery.', ['/gallery', 'Gallery'])
q('process', 'process', 'What warranty comes with my deck?',
  'Every project includes our 2-year workmanship warranty. Board and railing manufacturers carry their own material warranties, which we will show you for the products you choose.', ['/faq#do-you-offer-warranties', 'Warranty details'])
q('process', 'process', 'Can you work with my own design or drawings?',
  'Yes. We review your plans for code, structure and buildability, and suggest changes where needed.')

# ---------- commercial ----------
CM = ['/commercial-deck-construction', 'Commercial deck construction']
q('commercial', 'commercial', 'Do you build decks for condos and multi-unit buildings?',
  'Yes. Our commercial division handles multi-unit and condominium deck and balcony projects, including repeatable designs across many units.', CM)
q('commercial', 'commercial', 'Can you work with property managers and condo boards?',
  'Yes. We coordinate scheduling, resident access and communication through the property manager or board.', CM)
q('commercial', 'commercial', 'Can you replace balcony decking in occupied buildings?',
  'Yes. Work is phased so residents keep access where possible, with clear notices before each stage.', CM)
q('commercial', 'commercial permits', 'Do commercial deck projects need engineered drawings?',
  'Often yes. Multi-unit and commercial projects commonly require engineered drawings and inspections. We work with the project engineer or architect.', CM)
q('commercial', 'commercial', 'Can you match an existing design across many units?',
  'Yes. Consistent materials, colours and railing systems across units is a core part of multi-unit work.', CM)
q('commercial', 'commercial', 'How do I start a commercial deck project?',
  'Send the property type, number of units or decks, timeline and any drawings through our commercial form, and we will set up a site review.', ['/commercial-deck-construction#commercial-quote', 'Commercial project form'])
q('commercial', 'commercial', 'Do you work with builders and general contractors?',
  'Yes. We can work as the deck and railing trade on larger projects.', CM)

# ---------- wellness ----------
W = ['/wellness', 'ODP Wellness']
q('wellness', 'wellness', 'Do I need a permit for an outdoor sauna in Ottawa?',
  'Ottawa requires a building permit for detached accessory buildings over 10 m² (about 108 sq ft). Smaller saunas may not need one, but zoning setbacks and electrical permits still apply.', W)
q('wellness', 'wellness', 'What electrical service does an outdoor sauna need?',
  'Most electric sauna heaters need a dedicated 240V circuit sized to the heater. A licensed electrician confirms your panel has capacity.', W)
q('wellness', 'wellness', 'Electric or wood-burning sauna heater?',
  'Electric heaters are convenient and can be app controlled with supported models. Wood heaters give a traditional experience but need a chimney, clearances and more care.', W)
q('wellness', 'wellness', 'Can an outdoor sauna be used in winter?',
  'Yes. Winter is when many Ottawa owners use it most. A well-insulated sauna on a solid base heats up fine in cold weather.', W)
q('wellness', 'wellness', 'What is a cold plunge?',
  'A cold plunge is a tub kept at cold water temperatures for short immersion, often paired with a sauna. Some use a chiller, others rely on cold weather.', W)
q('wellness', 'wellness', 'Does a cold plunge need a chiller in Ottawa?',
  'For year-round cold water, a chiller keeps temperature steady in summer. In winter, many owners use a cover and natural cold.', W)
q('wellness', 'wellness design', 'Can a sauna go on a deck?',
  'Yes, if the deck is designed for the weight. Saunas and plunges are often placed on a purpose-built composite deck section.', W)
q('wellness', 'wellness', 'How long does it take to install a backyard sauna?',
  'It depends on the model, base and electrical. Design, permits and delivery usually take longer than the installation itself.', W)
q('wellness', 'wellness', 'Can I design my sauna and plunge setup online?',
  'Yes. Our Retreat Configurator lets you choose a package, decking, sauna, plunge, lighting and privacy and see it in 3D.', ['/wellness/retreat-configurator', 'Open the configurator'])
q('wellness', 'wellness', 'Do smart sauna heaters work with an app?',
  'Some heater models support app control, scheduling and monitoring. Features depend on the manufacturer, so we confirm them for the exact heater you choose.', W)

def slug(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')[:70]

out = []
for i, f in enumerate(F):
    f['id'] = slug(f['q'])
    out.append(f)
ids = [f['id'] for f in out]
assert len(ids) == len(set(ids)), 'duplicate ids'
for f in out:
    assert '—' not in f['a'] + f['q'], f['q']
json.dump({'categories': CATS, 'items': out}, open('content/collections/faqs.json', 'w'), indent=1, ensure_ascii=False)
from collections import Counter
print(len(out), Counter(f['cat'] for f in out))
