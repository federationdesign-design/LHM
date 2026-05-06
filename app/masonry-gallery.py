"""
Gallery rebuild #3 — pure CSS masonry.

Removes:
  - galleryOuterRef + scroll-hijack useEffect
  - corp-gallery-outer + corp-gallery-sticky wrapping divs
  - Horizontal scroll CSS

Replaces with:
  - Simple masonry container using CSS columns
  - 3 columns desktop, 2 columns mobile
  - Images use width: 100% + height: auto so they keep aspect ratios
  - Lightbox unchanged (still triggered on click)
  - Per-image fade removed (was tied to horizontal scroll)
"""
import os
import sys
import re

path = 'app/corporate/CorporateHomeClient.tsx'
if not os.path.exists(path):
    print(f"ERROR: {path} not found")
    sys.exit(1)

with open(path, 'r') as f:
    c = f.read()

# ── 1. Replace gallery JSX with simple masonry markup ─────────
gal_start_marker = "        {/* \u2500\u2500 GALLERY"
if gal_start_marker not in c:
    print("ERROR: gallery section comment not found")
    sys.exit(1)

gs = c.index(gal_start_marker)
sec_close_idx = c.index("</section>", gs) + len("</section>")

new_section = """        {/* \u2500\u2500 GALLERY (CSS masonry, 3 cols desktop / 2 mobile) \u2500 */}
        <section className="corp-gallery">
          <h2 className="corp-gallery-heading">Gallery</h2>
          <div className="corp-gallery-masonry">
            {gallery.map((g, i) => (
              <button
                key={i}
                type="button"
                onClick={() => { setLightboxSrc(g.src); setLightboxOpen(true); }}
                className="corp-gallery-item"
                aria-label="Open image"
              >
                <img
                  src={g.src}
                  alt={g.alt}
                  className="corp-gallery-img"
                  loading="lazy"
                  draggable={false}
                />
              </button>
            ))}
          </div>
        </section>"""

c = c[:gs] + new_section + c[sec_close_idx:]
print("OK: gallery JSX replaced with masonry markup")

# ── 2. Remove galleryOuterRef declaration ─────────────────────
if "const galleryOuterRef" in c:
    c = re.sub(
        r"\s*const galleryOuterRef = useRef<HTMLDivElement>\(null\);",
        "",
        c
    )
    print("OK: removed galleryOuterRef declaration")

# ── 3. Remove the scroll-hijack useEffect ─────────────────────
# Find any useEffect that references galleryOuterRef
# (which was the scroll-hijack effect we just nuked the ref for)
pattern_a = "Gallery scroll-hijack:"
pattern_b = "Per-image fade based on viewport"

for marker in [pattern_a, pattern_b]:
    while marker in c:
        midx = c.index(marker)
        # Find start of the useEffect — walk back to "useEffect"
        ueidx = c.rfind("useEffect", 0, midx)
        if ueidx == -1:
            break
        # Walk back to the line start (the comment block above)
        # Find preceding `// ` comment block start
        comment_start = ueidx
        while True:
            prev_line = c.rfind("\n", 0, comment_start - 1)
            if prev_line == -1:
                break
            line = c[prev_line+1:comment_start].strip()
            if line.startswith("//") or line.startswith("/*"):
                comment_start = prev_line + 1
            else:
                break
        # Walk back to start of comment line including indent
        block_start = c.rfind("\n", 0, comment_start) + 1
        # Find end: next `}, []);` or `}, [..]);`
        end_match = re.search(r"\}, \[[^\]]*\]\);", c[ueidx:])
        if not end_match:
            break
        block_end = ueidx + end_match.end()
        # Include trailing newline
        if block_end < len(c) and c[block_end] == '\n':
            block_end += 1
        c = c[:block_start] + c[block_end:]
        print(f"OK: removed useEffect block (matched '{marker}')")

# ── 4. Replace gallery CSS ─────────────────────────────────────
css_old_start = "        /* \u2500\u2500 GALLERY"
if css_old_start in c:
    i1 = c.index(css_old_start)
    # Find next CSS comment to bound the replacement
    next_comment_idx = c.index("        /* \u2500\u2500", i1 + 50)

    css_new = """        /* \u2500\u2500 GALLERY (CSS masonry) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
        /* Pure CSS masonry using the `columns` property.
           Each image keeps its natural aspect ratio (width:100%
           + height:auto), and CSS distributes them across the
           columns automatically. Click any image to open the
           Lightbox. */
        .corp-gallery {
          padding: 60px 24px;
          background: #000000;
          max-width: 1600px;
          margin: 0 auto;
        }
        .corp-gallery-heading {
          font-size: clamp(1.4rem, 2vw, 1.8rem);
          font-weight: 400;
          color: #ffffff;
          text-align: center;
          margin: 0 0 40px;
          letter-spacing: 0.02em;
        }
        .corp-gallery-masonry {
          column-count: 2;
          column-gap: 16px;
          /* Mobile-first: 2 columns. Desktop: 3 columns below. */
        }
        .corp-gallery-item {
          /* break-inside avoids splitting an image across columns */
          break-inside: avoid;
          -webkit-column-break-inside: avoid;
          page-break-inside: avoid;
          display: block;
          width: 100%;
          margin: 0 0 16px 0;
          padding: 0;
          border: none;
          background: transparent;
          cursor: zoom-in;
          overflow: hidden;
          /* Subtle hover effect to suggest clickability */
          transition: opacity 0.2s ease;
        }
        .corp-gallery-item:hover {
          opacity: 0.85;
        }
        .corp-gallery-img {
          display: block;
          width: 100%;
          height: auto;
        }
        @media (min-width: 768px) {
          .corp-gallery {
            padding: 80px 40px;
          }
          .corp-gallery-masonry {
            column-count: 3;
            column-gap: 20px;
          }
          .corp-gallery-item {
            margin-bottom: 20px;
          }
        }

"""

    c = c[:i1] + css_new + c[next_comment_idx:]
    print("OK: gallery CSS replaced with masonry layout")

with open(path, 'w') as f:
    f.write(c)

print("Done.")
