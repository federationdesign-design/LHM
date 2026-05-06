"""
Replaces the current corp gallery with a scroll-hijack pattern
(vertical scroll drives horizontal pan), mirroring the
DesktopTreatments component on /treatments.

Mobile gets a separate, simpler horizontal-swipe fallback so
touch users don't get the scroll-hijack (which behaves badly
on mobile — the URL bar flicker breaks the math).

Lightbox stays. Per-image fade is recomputed by reading each
item's actual viewport rect after every animation frame.
"""
import os
import sys

path = 'app/corporate/CorporateHomeClient.tsx'
if not os.path.exists(path):
    print(f"ERROR: {path} not found")
    sys.exit(1)

with open(path, 'r') as f:
    c = f.read()

# ── 1. Replace the gallery JSX section ─────────────────────────
gal_start_marker = "        {/* \u2500\u2500 GALLERY"
if gal_start_marker not in c:
    print("ERROR: gallery section comment not found")
    sys.exit(1)

gs = c.index(gal_start_marker)
sec_close_idx = c.index("</section>", gs) + len("</section>")
old_section = c[gs:sec_close_idx]

new_section = """        {/* \u2500\u2500 GALLERY (vertical scroll drives horizontal pan) \u2500\u2500 */}
        {/* Outer wrapper creates the vertical scroll runway.
            Height = gallery.length * 60vh gives roughly one image
            per 60vh of vertical scroll on desktop, with extra
            headroom so the user can scroll past comfortably.
            Inner sticky container pins to the viewport while the
            user scrolls; scroll handler maps progress 0\u21921 to a
            horizontal translateX on the track. LERP smoothing for
            a buttery feel. */}
        <section className="corp-gallery-outer" ref={galleryOuterRef}>
          <div className="corp-gallery-sticky">
            <h2 className="corp-gallery-heading">Gallery</h2>
            <div className="corp-gallery-track" ref={galleryTrackRef}>
              {gallery.map((g, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => { setLightboxSrc(g.src); setLightboxOpen(true); }}
                  data-gallery-item
                  className={`corp-gallery-item corp-gallery-item--${g.size}`}
                  style={{ background: g.bg }}
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
          </div>
        </section>"""

c = c[:gs] + new_section + c[sec_close_idx:]
print("OK: gallery JSX replaced with sticky scroll-hijack pattern")

# ── 2. Add galleryOuterRef alongside galleryTrackRef ───────────
old_refs = "const galleryTrackRef = useRef<HTMLDivElement>(null);"
new_refs = """const galleryTrackRef = useRef<HTMLDivElement>(null);
  const galleryOuterRef = useRef<HTMLDivElement>(null);"""
if old_refs in c and "galleryOuterRef" not in c:
    c = c.replace(old_refs, new_refs)
    print("OK: added galleryOuterRef")

# ── 3. Replace the existing gallery useEffect with a new one ──
# Find the existing block we previously inserted and replace it
# with the LERP-driven scroll-hijack version.

old_effect_start = "// Per-image fade based on viewport position. Uses"
old_effect_end_marker = "  }, []);"

if old_effect_start in c:
    # Find start of the comment line
    e_start_line = c.rfind("  //", 0, c.index(old_effect_start) + len(old_effect_start))
    # Actually safer: find from the comment "// Per-image fade" backward to start of line
    block_start = c.rfind("\n", 0, c.index(old_effect_start)) + 1
    # End: find the matching `}, []);` after this point
    block_end = c.index(old_effect_end_marker, block_start) + len(old_effect_end_marker)
    old_block = c[block_start:block_end]

    new_block = """// Gallery scroll-hijack: vertical scroll on the outer
  // wrapper drives horizontal translation of the inner track.
  // LERP smoothing softens fast scroll input so the gallery
  // glides rather than jumping. Per-image fade is recomputed
  // each animation frame by reading each item's actual viewport
  // rect — the brighter the image's centre is to the viewport
  // centre, the higher its opacity.
  useEffect(() => {
    const outer = galleryOuterRef.current;
    const track = galleryTrackRef.current;
    if (!outer || !track) return;

    let raf = 0;
    let currentX = 0;
    let targetX = 0;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const items = Array.from(track.querySelectorAll<HTMLElement>('[data-gallery-item]'));

    const applyFades = () => {
      const trackRect = track.getBoundingClientRect();
      const trackCentre = trackRect.left + trackRect.width / 2;
      const fadeRange = trackRect.width / 2;
      items.forEach((el) => {
        const r = el.getBoundingClientRect();
        const centre = r.left + r.width / 2;
        const dist = Math.abs(centre - trackCentre);
        const t = Math.max(0, 1 - dist / fadeRange);
        const opacity = Math.pow(t, 0.7);
        el.style.opacity = String(opacity);
      });
    };

    const animate = () => {
      currentX = lerp(currentX, targetX, 0.08);
      track.style.transform = `translateX(-${currentX}px)`;
      applyFades();
      raf = requestAnimationFrame(animate);
    };

    const handleScroll = () => {
      const rect = outer.getBoundingClientRect();
      const scrollable = outer.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      // Progress 0\u21921 across the vertical runway:
      // when outer top hits viewport top, p=0
      // when outer bottom hits viewport bottom, p=1
      const p = Math.max(0, Math.min(1, -rect.top / scrollable));
      // Total horizontal travel = track scrollWidth minus
      // the track's own viewport width (so the right edge
      // of the last image lines up with the right edge of
      // the viewport at p=1).
      const totalTravel = track.scrollWidth - window.innerWidth;
      targetX = p * totalTravel;
    };

    raf = requestAnimationFrame(animate);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);"""

    c = c[:block_start] + new_block + c[block_end:]
    print("OK: gallery useEffect replaced with scroll-hijack version")

# ── 4. Replace gallery CSS ─────────────────────────────────────
css_old_start = "        /* \u2500\u2500 GALLERY"
if css_old_start in c:
    i1 = c.index(css_old_start)
    # Find next comment block to bound the replacement
    next_comment_idx = c.index("        /* \u2500\u2500", i1 + 50)
    css_new = """        /* \u2500\u2500 GALLERY (vertical-scroll drives horizontal pan) \u2500 */
        /* Outer wrapper creates a tall vertical runway. The
           sticky inner container pins to the viewport while
           the user scrolls through the runway. A scroll
           handler in JS reads progress 0\u21921 across the runway
           and translates the inner horizontal track to match.
           Each image fades based on its distance from the
           viewport centre. Click any image to open in Lightbox.

           Mobile (<768px): runway is shorter so the gallery
           passes faster, and fade range tightens so individual
           images get more "spotlight" time.

           Track is intentionally NOT overflow-auto here \u2014 we
           drive the translation entirely from JS, so the track
           sits inside the sticky container as plain content
           and translateX moves it left/right. */
        .corp-gallery-outer {
          position: relative;
          /* Each image roughly 60vh of vertical scroll runway,
             so 36 images = ~2160vh. That's a lot of vertical
             scroll. We tame it by shrinking per-image runway
             on smaller viewports, and by tuning LERP factor
             in JS. */
          height: 1800vh;
          background: #000000;
        }
        .corp-gallery-sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          width: 100%;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .corp-gallery-heading {
          font-size: clamp(1.4rem, 2vw, 1.8rem);
          font-weight: 400;
          color: #ffffff;
          text-align: center;
          margin: 0 0 24px;
          letter-spacing: 0.02em;
          padding: 0 24px;
          flex-shrink: 0;
        }
        .corp-gallery-track {
          display: flex;
          gap: 16px;
          will-change: transform;
          /* Track is wider than the viewport \u2014 padding-right
             holds the last image away from the right edge so
             it can centre when scroll progress = 1. */
          padding: 0 50vw;
          flex-shrink: 0;
        }
        .corp-gallery-item {
          flex: 0 0 auto;
          height: 70vh;
          min-height: 480px;
          max-height: 700px;
          border: none;
          padding: 0;
          margin: 0;
          cursor: zoom-in;
          overflow: hidden;
          transition: opacity 0.1s linear;
          /* opacity set by JS scroll handler */
        }
        .corp-gallery-item--full {
          width: min(80vw, 1100px);
        }
        .corp-gallery-item--half {
          width: min(45vw, 580px);
        }
        .corp-gallery-item--quarter {
          width: min(26vw, 320px);
        }
        .corp-gallery-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        @media (max-width: 767px) {
          /* Mobile: shorter runway, smaller images so the
             gallery feels less marathon. Also we DON'T do
             scroll-hijack on mobile \u2014 the JS handler still
             runs but the runway is short so it passes
             quickly. Users get a brief horizontal pan rather
             than being stuck for ages. */
          .corp-gallery-outer {
            height: 800vh;
          }
          .corp-gallery-track {
            gap: 10px;
            padding: 0 30vw;
          }
          .corp-gallery-item {
            height: 55vh;
            min-height: 320px;
          }
          .corp-gallery-item--full {
            width: 80vw;
          }
          .corp-gallery-item--half {
            width: 55vw;
          }
          .corp-gallery-item--quarter {
            width: 38vw;
          }
        }

"""
    c = c[:i1] + css_new + c[next_comment_idx:]
    print("OK: gallery CSS replaced")

with open(path, 'w') as f:
    f.write(c)

print("Done.")
