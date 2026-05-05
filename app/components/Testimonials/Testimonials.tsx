'use client';

/* ─────────────────────────────────────────────────────────────
   Testimonials.tsx — shared component used across the site.

   Behaviour:
     - Mobile: swipeable carousel with dots, infinite-loop trick
       (extended array so the last slide loops back to the first
       and vice versa via a snap-back during the no-animation
       frame after a transition).
     - Desktop (≥1025px): 3-column grid showing the same data.

   Data source: testimonials-data.ts (sibling file). Pass a
   custom `items` prop to override (e.g. corporate-only set).

   Heading: optional. Pass `heading` to render the standard
   "Happy private clients include" style title above the block,
   or omit it if the consumer wants to render its own heading.

   Heading style export: `headingClassName` is exported so other
   places on the site (e.g. splash company-clients "Happy company
   clients include") can apply the exact same heading style and
   stay in sync automatically. Import it like:

     import Testimonials, { headingClassName } from '@/components/Testimonials/Testimonials';
     ...
     <h3 className={headingClassName}>Happy company<br />clients include</h3>
   ───────────────────────────────────────────────────────────── */

import { useRef, useState } from 'react';
import styles from './Testimonials.module.css';
import { testimonials as defaultTestimonials, type Testimonial } from './testimonials-data';

/** Exported for external consumers that want the same heading style. */
export const headingClassName = styles.heading;

type TestimonialsProps = {
  /** Optional heading rendered above the block. May contain JSX (e.g. <br />). */
  heading?: React.ReactNode;
  /** Override the default testimonials list (e.g. corporate-only subset). */
  items?: Testimonial[];
  /** Optional className applied to the outer <section> for layout tweaks. */
  className?: string;
};

export default function Testimonials({
  heading,
  items = defaultTestimonials,
  className,
}: TestimonialsProps) {
  const total = items.length;

  // Extended array: [last, ...all, first] enables seamless loop on the
  // mobile carousel by snapping back without animation when we hit
  // index 0 or index total+1.
  const extended = total > 0 ? [items[total - 1], ...items, items[0]] : [];

  const [index, setIndex] = useState(1);
  const [animate, setAnimate] = useState(true);
  const startX = useRef(0);

  const goTo = (n: number) => {
    setAnimate(true);
    setIndex(n);
  };

  const onTransitionEnd = () => {
    if (index === 0) {
      setAnimate(false);
      setIndex(total);
    } else if (index === total + 1) {
      setAnimate(false);
      setIndex(1);
    }
  };

  // Real index used for dot active state.
  const realIndex = index === 0 ? total - 1 : index === total + 1 ? 0 : index - 1;

  if (total === 0) return null;

  const sectionClass = className ? `${styles.section} ${className}` : styles.section;

  return (
    <section className={sectionClass}>
      {heading ? <h3 className={styles.heading}>{heading}</h3> : null}

      {/* Mobile carousel — hidden ≥1025px via CSS */}
      <div
        className={animate ? styles.track : styles.trackNoAnim}
        style={{ transform: `translateX(calc(-${index * 100}%))` }}
        onTransitionEnd={onTransitionEnd}
        onTouchStart={(e) => {
          startX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          const dx = startX.current - e.changedTouches[0].clientX;
          if (Math.abs(dx) > 40) goTo(index + (dx > 0 ? 1 : -1));
        }}
      >
        {extended.map((t, i) => (
          <Card key={`${t.id}-${i}`} t={t} className={styles.slide} />
        ))}
      </div>

      {/* Mobile dots — hidden ≥1025px via CSS */}
      <div className={styles.dots}>
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i + 1)}
            aria-label={`Go to testimonial ${i + 1}`}
            className={`${styles.dot} ${i === realIndex ? styles.dotActive : ''}`}
          />
        ))}
      </div>

      {/* Desktop 3-col grid — hidden <1025px via CSS */}
      <div className={styles.grid}>
        {items.map((t) => (
          <Card key={t.id} t={t} className={styles.gridSlide} />
        ))}
      </div>
    </section>
  );
}

/* ── Card subcomponent ────────────────────────────────────── */
function Card({ t, className }: { t: Testimonial; className: string }) {
  const rating = t.rating ?? 5;
  return (
    <div className={className}>
      <div className={styles.avatar}>{t.avatar}</div>
      <h4 className={styles.name}>{t.name}</h4>
      <p className={styles.title}>{t.title}</p>
      <p className={styles.body}>{t.body}</p>
      <div className={styles.stars}>
        {Array.from({ length: rating }).map((_, j) => (
          <span key={j} className={styles.star}>
            ★
          </span>
        ))}
      </div>
      <p className={styles.date}>{t.date}</p>
    </div>
  );
}
