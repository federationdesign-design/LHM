"""
Batch A — bundle of trivial fixes.

Run once from project root: python3 batch-a.py

Each step is independently re-runnable (idempotent where possible).
If any assertion fails, the script bails on that step but continues
with the rest. The output at the end summarises what landed.
"""
import os
import sys

results = []

def patch(label, path, old, new, expect=1):
    """Replace `old` with `new` in `path`. Records result."""
    if not os.path.exists(path):
        results.append(f"SKIP: {label} (file not found: {path})")
        return
    with open(path, 'r') as f:
        c = f.read()
    n = c.count(old)
    if n == 0:
        results.append(f"SKIP: {label} (pattern not found, may already be applied)")
        return
    if expect != -1 and n != expect:
        results.append(f"SKIP: {label} (expected {expect} matches, found {n})")
        return
    c = c.replace(old, new)
    with open(path, 'w') as f:
        f.write(c)
    results.append(f"OK:   {label}")


# ──────────────────────────────────────────────────────────────
# 1. Remove "Services" h2 above ServicesCarousel grid
# ──────────────────────────────────────────────────────────────
patch(
    "Remove Services h2 (mobile)",
    'app/PrivateHomeClient.tsx',
    """          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 24px 16px', flexShrink: 0 }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 600, color: '#ffffff', textAlign: 'center', margin: 0 }}>Services</h2>
          </div>""",
    "",
)

patch(
    "Remove Services h2 (desktop)",
    'app/PrivateHomeClient.tsx',
    """        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32, padding: '0 24px' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 600, color: '#ffffff', textAlign: 'center', margin: 0 }}>Services</h2>
        </div>""",
    "",
)

# ──────────────────────────────────────────────────────────────
# 2. Sports Therapy rename — display text only.
#    URL/slug rename is bigger; we'll do that separately.
#    For now, just rename "Physiotherapy" → "Sports Therapy"
#    in user-facing display strings only.
# ──────────────────────────────────────────────────────────────
patch(
    "Rename Physiotherapy → Sports Therapy on PrivateHomeClient services",
    'app/PrivateHomeClient.tsx',
    "  { slug: 'physiotherapy-treatment', title: 'Physiotherapy', image: '/Physiotherapy-mobile.jpg', href: '/physiotherapy-treatment', cta: 'Book Treatment' },",
    "  { slug: 'physiotherapy-treatment', title: 'Sports Therapy', image: '/Physiotherapy-mobile.jpg', href: '/physiotherapy-treatment', cta: 'Book Treatment' },",
)

patch(
    "Rename Physiotherapy → Sports Therapy in Footer",
    'app/Footer.tsx',
    "  ['Physiotherapy', '/physiotherapy-treatment'],",
    "  ['Sports Therapy', '/physiotherapy-treatment'],",
)

patch(
    "Rename Physiotherapy → Sports Therapy in TreatmentsIndexClient menu",
    'app/TreatmentsIndexClient.tsx',
    "  { label: 'Physiotherapy', href: '/physiotherapy-treatment', slideIndex: 7 },",
    "  { label: 'Sports Therapy', href: '/physiotherapy-treatment', slideIndex: 7 },",
)

patch(
    "Rename Physiotherapy → Sports Therapy in TreatmentsIndexClient slide title",
    'app/TreatmentsIndexClient.tsx',
    "    type: 'treatment' as const, slug: 'physiotherapy-treatment', title: 'Physiotherapy',",
    "    type: 'treatment' as const, slug: 'physiotherapy-treatment', title: 'Sports Therapy',",
)

# ──────────────────────────────────────────────────────────────
# 3. Cupping image case fix in TreatmentsIndexClient
# ──────────────────────────────────────────────────────────────
patch(
    "Fix Cupping image case (Cupping-mobile.jpg → cupping-mobile.jpg)",
    'app/TreatmentsIndexClient.tsx',
    "    image: '/Cupping-mobile.jpg', color: '#cb8f77', cta: 'Book Now', ctaHref: '/cupping',",
    "    image: '/cupping-mobile.jpg', color: '#cb8f77', cta: 'Book Now', ctaHref: '/cupping',",
)

# ──────────────────────────────────────────────────────────────
# 4. Footer opening times update (private side)
#    New schedule:
#    Monday 12pm-8pm, Tuesday 10am-6pm, Wednesday 10am-8pm,
#    Thursday 10am-6pm, Friday 9am-5pm, Saturday 9am-5pm, Sunday 9am-5pm
# ──────────────────────────────────────────────────────────────
patch(
    "Footer mobile hours block",
    'app/Footer.tsx',
    """      <div className={styles.footerHours}>
        Monday &nbsp;&nbsp;&nbsp;~ 9am to 8pm<br />
        Tuesday &nbsp;&nbsp;~ 9am to 8pm<br />
        Wednesday ~ 9am to 8pm<br />
        Thursday &nbsp;~ 9am to 8pm<br />
        Friday &nbsp;&nbsp;&nbsp;&nbsp;~ 9am to 6pm<br />
        Saturday &nbsp;~ 9am to 5.30pm<br />
        Sunday &nbsp;&nbsp;&nbsp;~ 10am to 5pm
      </div>""",
    """      <div className={styles.footerHours}>
        Monday &nbsp;&nbsp;&nbsp;~ 12pm to 8pm<br />
        Tuesday &nbsp;&nbsp;~ 10am to 6pm<br />
        Wednesday ~ 10am to 8pm<br />
        Thursday &nbsp;~ 10am to 6pm<br />
        Friday &nbsp;&nbsp;&nbsp;&nbsp;~ 9am to 5pm<br />
        Saturday &nbsp;~ 9am to 5pm<br />
        Sunday &nbsp;&nbsp;&nbsp;~ 9am to 5pm
      </div>""",
)

patch(
    "Footer desktop hours block",
    'app/Footer.tsx',
    """          <p style={{ fontSize: '0.82rem', color: '#ffffff', fontWeight: 300, lineHeight: 1.9 }}>
            Monday – 9am to 8pm<br />
            Tuesday – 9am to 8pm<br />
            Wednesday – 9am to 8pm<br />
            Thursday – 9am to 8pm<br />
            Friday – 9am to 6pm<br />
            Saturday – 9am to 5.30pm<br />
            Sunday – 10am to 5pm
          </p>""",
    """          <p style={{ fontSize: '0.82rem', color: '#ffffff', fontWeight: 300, lineHeight: 1.9 }}>
            Monday – 12pm to 8pm<br />
            Tuesday – 10am to 6pm<br />
            Wednesday – 10am to 8pm<br />
            Thursday – 10am to 6pm<br />
            Friday – 9am to 5pm<br />
            Saturday – 9am to 5pm<br />
            Sunday – 9am to 5pm
          </p>""",
)

# ──────────────────────────────────────────────────────────────
# 5. Gift voucher colour preload → #b9e8a0
#    Need to find what file currently sets a colour preload.
# ──────────────────────────────────────────────────────────────
import subprocess
try:
    res = subprocess.run(
        ['grep', '-rln', 'GiftVoucher', 'app/'],
        capture_output=True, text=True
    )
    gift_files = [l for l in res.stdout.split('\n') if l.strip()]
    if not gift_files:
        results.append("SKIP: Gift voucher colour (no GiftVoucher files found)")
    else:
        # Try common patterns
        for f in gift_files:
            with open(f) as fp:
                fc = fp.read()
            if 'b9e8a0' in fc:
                results.append(f"SKIP: Gift voucher colour ({f} already has b9e8a0)")
                continue
            # Look for any preload colour pattern
            # Common: data attributes, default state colours
            results.append(f"INFO: Gift voucher file found: {f} (manual verification needed for colour preload)")
except Exception as e:
    results.append(f"SKIP: Gift voucher colour (diagnostic failed: {e})")

# ──────────────────────────────────────────────────────────────
# 6. Receipts small print update
# ──────────────────────────────────────────────────────────────
old_receipt_a = "By submitting this form, you agree to our terms"
new_receipt = "By submitting this form, you agree to us processing your information to provide your receipt. Your data will be handled in accordance with our Privacy Policy."
# Try common variants — we'll do the search & replace if found
for old in [
    "By submitting this form, you agree to our terms.",
    "By submitting this form, you agree to our terms",
    "By submitting this form, you agree to our terms and conditions.",
]:
    patch(
        f"Receipts small print ('{old[:40]}...')",
        'app/receipts/ReceiptsClient.tsx',
        old,
        new_receipt,
    )

# ──────────────────────────────────────────────────────────────
# 7. Swap Spotify with Clayton on splash + corp pages,
#    add Speechmatics + AstraZeneca
# ──────────────────────────────────────────────────────────────
patch(
    "Splash company clients: replace Spotify with Clayton",
    'app/SplashClient.tsx',
    "  { name: 'Spotify',                 src: '/spotify.png' },",
    "  { name: 'Clayton Hotel',           src: '/Clayton-img.png' },",
)

patch(
    "Splash company clients: add Speechmatics + AstraZeneca",
    'app/SplashClient.tsx',
    """  { name: 'Clayton Hotel',           src: '/Clayton-img.png' },
  { name: 'University of Cambridge', src: '/university-cambridge.png' },
  { name: 'Amazon',                  src: '/amazon.png' },
  { name: 'Redgate',                 src: '/redgate-logo.png' },
];""",
    """  { name: 'Clayton Hotel',           src: '/Clayton-img.png' },
  { name: 'University of Cambridge', src: '/university-cambridge.png' },
  { name: 'Amazon',                  src: '/amazon.png' },
  { name: 'Redgate',                 src: '/redgate-logo.png' },
  { name: 'Speechmatics',            src: '/speechmatics.png' },
  { name: 'AstraZeneca',             src: '/astrazeneca-img.png' },
];""",
)

# Same for corp homepage
patch(
    "Corp company clients: replace Spotify with Clayton",
    'app/corporate/CorporateHomeClient.tsx',
    "  { name: 'Spotify',                 src: '/spotify.png' },",
    "  { name: 'Clayton Hotel',           src: '/Clayton-img.png' },",
)

# ──────────────────────────────────────────────────────────────
# 8. DSC → DSE display text replacements
#    Keep route slugs intact (`/corporate/dsc-assessments` URL)
#    just rename the visible label.
# ──────────────────────────────────────────────────────────────
patch(
    "DSC → DSE in CorporateNav menu label",
    'app/CorporateNav.tsx',
    "  ['DSC Assessments',            '/corporate/dsc-assessments'],",
    "  ['DSE Assessments',            '/corporate/dsc-assessments'],",
)

# Also in metadata strings
patch(
    "DSC → DSE in /corporate metadata",
    'app/corporate/page.tsx',
    "DSC assessments",
    "DSE assessments",
)
patch(
    "DSC → DSE in /corporate/dsc-assessments metadata",
    'app/corporate/dsc-assessments/page.tsx',
    "Workplace DSE/DSC assessments",
    "Workplace DSE assessments",
)

# Look for client-facing DSC strings in DscAssessmentsClient
import os
ds_path = 'app/corporate/dsc-assessments/DscAssessmentsClient.tsx'
if os.path.exists(ds_path):
    with open(ds_path) as f:
        c = f.read()
    # Replace standalone "DSC" with "DSE"
    n_before = c.count('DSC')
    if n_before > 0:
        c = c.replace('DSC', 'DSE')
        with open(ds_path, 'w') as f:
            f.write(c)
        results.append(f"OK:   DSC → DSE in DscAssessmentsClient ({n_before} replacements)")

# Also check CorporateHomeClient for DSC mentions
ch_path = 'app/corporate/CorporateHomeClient.tsx'
if os.path.exists(ch_path):
    with open(ch_path) as f:
        c = f.read()
    n_before = c.count('DSC')
    if n_before > 0:
        c = c.replace('DSC', 'DSE')
        with open(ch_path, 'w') as f:
            f.write(c)
        results.append(f"OK:   DSC → DSE in CorporateHomeClient ({n_before} replacements)")

# ──────────────────────────────────────────────────────────────
# 9. Corp menu: "Book a massage" → "Book myself a massage"
# ──────────────────────────────────────────────────────────────
patch(
    "Corp menu: Book a massage → Book myself a massage",
    'app/CorporateNav.tsx',
    "  ['Book a massage',             '/private'],",
    "  ['Book myself a massage',      '/private'],",
)

# ──────────────────────────────────────────────────────────────
# 10. Remove booking logos from corp findUsLogos.
#     The corp page shows Tripadvisor/SBM/LinkedIn/Wheree only.
#     If bookingpage is present we strip it.
# ──────────────────────────────────────────────────────────────
patch(
    "Corp findUs: remove BookingPage logo",
    'app/corporate/CorporateHomeClient.tsx',
    "  { src: '/bookingpage.png',  alt: 'Booking Page' },\n",
    "",
)
patch(
    "Corp findUs: remove BookingPage logo (alt format)",
    'app/corporate/CorporateHomeClient.tsx',
    "  { src: '/bookingpage.png', alt: 'BookingPage' },\n",
    "",
)

# ──────────────────────────────────────────────────────────────
# 11. Add real logos to corp testimonials
#     Currently using placeholder for Costello, Softwire, Brand.
# ──────────────────────────────────────────────────────────────
ch = 'app/corporate/CorporateHomeClient.tsx'
if os.path.exists(ch):
    with open(ch) as f:
        c = f.read()
    # Costello — find first `'/company-placeholder.png'` for Costello entry
    # Easiest: do them by their nearest-line context (the company name)
    replacements = [
        # (company_marker_substring, new_logo_path)
        ("Costello Medical", "/costello-medical.png"),
        ("Softwire", "/softwire-logo.png"),
        ("Brand Recruitment", "/brand-recruitment.png"),
    ]
    for marker, new_logo in replacements:
        # Find the testimonial entry containing the marker, then back-search for `logo: '/company-placeholder.png'`
        idx = c.find(marker)
        if idx == -1:
            results.append(f"SKIP: testimonial logo for {marker} (entry not found)")
            continue
        # Look back for the most recent logo: line before this marker
        logo_line = "logo: '/company-placeholder.png',"
        back_idx = c.rfind(logo_line, 0, idx)
        if back_idx == -1:
            # Maybe Costello already has its own logo; check if it has one nearer
            results.append(f"SKIP: testimonial logo for {marker} (no placeholder line before it)")
            continue
        # Replace just this one occurrence
        new_logo_line = f"logo: '{new_logo}',"
        c = c[:back_idx] + new_logo_line + c[back_idx + len(logo_line):]
        results.append(f"OK:   Testimonial logo for {marker} → {new_logo}")
    with open(ch, 'w') as f:
        f.write(c)

# Also update corp-testimonials-data.ts if it has placeholder refs
ct = 'app/components/Testimonials/corporate-testimonials-data.ts'
if os.path.exists(ct):
    with open(ct) as f:
        c = f.read()
    # Different format; the file uses Testimonial type which doesn't have `logo` field.
    # The corp-testimonials-data.ts uses `avatar` (a single character).
    # No logo refs to update there.
    pass

# ──────────────────────────────────────────────────────────────
# 12. Add new "What's Included" item — Direct Expert Support
# ──────────────────────────────────────────────────────────────
ch = 'app/corporate/CorporateHomeClient.tsx'
if os.path.exists(ch):
    with open(ch) as f:
        c = f.read()
    new_item_text = "Direct Expert Support"
    if new_item_text not in c:
        # Find the whatsIncluded array end. The array contains 7 items;
        # we're adding an 8th.
        marker = "const whatsIncluded"
        if marker in c:
            arr_start = c.index(marker)
            arr_end = c.index("];", arr_start)
            # Insert before the closing ];
            new_entry = """  {
    title: 'Direct Expert Support',
    body: 'We are not an agency — your team works directly with qualified workplace health professionals, ensuring personalised, consistent support without delays, handovers, or generic one-size-fits-all advice. We provide practical, tailored guidance from start to finish to help create a healthier, more comfortable workplace.',
  },
"""
            c = c[:arr_end] + new_entry + c[arr_end:]
            with open(ch, 'w') as f:
                f.write(c)
            results.append("OK:   Added 'Direct Expert Support' to whatsIncluded array")
        else:
            results.append("SKIP: whatsIncluded array not found in CorporateHomeClient")

# ──────────────────────────────────────────────────────────────
# 13. Cambridge logo white-invert filter removal on PRIVATE side
#     The private homepage's company/clients carousel needs the
#     same fix the corp side already had.
# ──────────────────────────────────────────────────────────────
# The private homepage has logos in the 'Find us on:' slider.
# Look for filter: brightness(0) invert(1) in PrivateHomeClient or splash.
# This is sensitive — we only want to remove from logos that have multi-tone art.
# Easier: find all `filter: brightness(0) invert(1)` occurrences and let user audit.
priv_path = 'app/PrivateHomeClient.tsx'
if os.path.exists(priv_path):
    with open(priv_path) as f:
        c = f.read()
    n = c.count("filter: brightness(0) invert(1)")
    if n == 0:
        results.append("SKIP: no white-invert filter found in PrivateHomeClient")
    else:
        results.append(f"INFO: PrivateHomeClient has {n} 'brightness(0) invert(1)' filter rules — manual audit recommended")

# Also check page.module.css since logoImg/logoRowImg are styled there
css = 'app/page.module.css'
if os.path.exists(css):
    with open(css) as f:
        c = f.read()
    if "filter: brightness(0) invert(1)" in c:
        # Show locations
        lines = c.split("\n")
        invert_lines = [i+1 for i, l in enumerate(lines) if "filter: brightness(0) invert(1)" in l]
        results.append(f"INFO: page.module.css has invert filter at lines: {invert_lines}")

# ──────────────────────────────────────────────────────────────
# Output summary
# ──────────────────────────────────────────────────────────────
print()
print("=" * 60)
print("BATCH A SUMMARY")
print("=" * 60)
for r in results:
    print(r)
print("=" * 60)
ok_count = sum(1 for r in results if r.startswith("OK:"))
skip_count = sum(1 for r in results if r.startswith("SKIP:"))
info_count = sum(1 for r in results if r.startswith("INFO:"))
print(f"  {ok_count} applied  |  {skip_count} skipped  |  {info_count} info")
print("=" * 60)
print()
print("Next steps after running:")
print("  npm run build")
print("  git add -A && git commit -m 'Batch A: client feedback round 1' && git push")
