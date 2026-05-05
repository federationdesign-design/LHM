"""
Updates CorporateServicePage.tsx + 3 client files to use responsive
hero images via <picture> element.
"""
import os
import sys

# ── 1. Update CorporateServicePage.tsx ────────────────────────
path = 'app/corporate/components/CorporateServicePage.tsx'
with open(path, 'r') as f:
    content = f.read()

old_prop = """  /** Hero background image path. */
  heroImage: string;"""
new_prop = """  /** Hero background image path - mobile (<768px). */
  heroImageMobile: string;
  /** Hero background image path - desktop (>=768px). */
  heroImageDesktop: string;"""

if old_prop not in content:
    print("ERROR: heroImage prop not found in CorporateServicePage")
    sys.exit(1)
content = content.replace(old_prop, new_prop)

old_jsx = """          <div className="cs-hero-image">
            <Image
              src={props.heroImage}
              alt=""
              fill
              priority
              sizes="100vw"
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />
            <div className="cs-hero-overlay" aria-hidden="true" />
          </div>"""

new_jsx = """          <div className="cs-hero-image">
            <picture>
              <source media="(min-width: 768px)" srcSet={props.heroImageDesktop} />
              <img src={props.heroImageMobile} alt="" className="cs-hero-img" />
            </picture>
            <div className="cs-hero-overlay" aria-hidden="true" />
          </div>"""

if old_jsx not in content:
    print("ERROR: hero image JSX not found")
    sys.exit(1)
content = content.replace(old_jsx, new_jsx)

old_css = """        .cs-hero-image {
          position: absolute;
          inset: 0;
        }"""
new_css = """        .cs-hero-image {
          position: absolute;
          inset: 0;
        }
        .cs-hero-image picture,
        .cs-hero-image picture img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }"""

if old_css not in content:
    print("ERROR: hero CSS not found")
    sys.exit(1)
content = content.replace(old_css, new_css)

with open(path, 'w') as f:
    f.write(content)
print("OK: CorporateServicePage.tsx updated")

# ── 2. Update 3 client files ──────────────────────────────────
updates = [
    ('app/corporate/in-chair-massage/InChairMassageClient.tsx',
     'heroImage="/corporate-chair-massage.jpg"',
     'heroImageMobile="/corporate-chair-hero-mobile.jpg"\n      heroImageDesktop="/corporate-chair-hero-desktop.jpg"'),
    ('app/corporate/dsc-assessments/DscAssessmentsClient.tsx',
     'heroImage="/corporate-dsc.jpg"',
     'heroImageMobile="/corporate-dsc-assessments-hero-mobile.jpg"\n      heroImageDesktop="/corporate-dsc-assessments-hero-desktop.jpg"'),
    ('app/corporate/posture-consultations/PostureConsultationsClient.tsx',
     'heroImage="/corporate-posture.jpg"',
     'heroImageMobile="/corporate-posture-hero-mobile.jpg"\n      heroImageDesktop="/corporate-posture-hero-desktop.jpg"'),
]

for cpath, old, new in updates:
    if not os.path.exists(cpath):
        print(f"SKIP (missing): {cpath}")
        continue
    c = open(cpath).read()
    if old not in c:
        print(f"SKIP (text not found): {cpath}")
        continue
    c = c.replace(old, new)
    open(cpath, 'w').write(c)
    print(f"OK: {cpath}")

print("\nAll done.")
