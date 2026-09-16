import { useEffect, useRef } from "react";
import { FiClock, FiMessageCircle, FiUnlock, FiCheckCircle, FiArrowUpRight } from "react-icons/fi";
import "./styles/StoreShowcase.css";

const FEATURES = [
  { icon: <FiUnlock />, label: "Scratch-to-Reveal" },
  { icon: <FiClock />, label: "Live Countdown" },
  { icon: <FiCheckCircle />, label: "RSVP Forms" },
  { icon: <FiMessageCircle />, label: "WhatsApp Native" },
];

const SCROLL_DURATION = 9000;

const StoreShowcase = () => {
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    let raf: number;
    let lastTs: number | null = null;
    let elapsed = 0;
    let paused = false;

    const step = (ts: number) => {
      if (lastTs === null) lastTs = ts;
      const dt = ts - lastTs;
      lastTs = ts;
      if (!paused) {
        elapsed = (elapsed + dt) % (SCROLL_DURATION * 2);
      }

      const t =
        elapsed < SCROLL_DURATION
          ? elapsed / SCROLL_DURATION
          : 2 - elapsed / SCROLL_DURATION;
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

      el.style.backgroundPosition = `center ${eased * 100}%`;
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);

    const onEnter = () => { paused = true; };
    const onLeave = () => { paused = false; };
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className="store-section section-container" id="store">
      <div className="store-layout">
        <div className="store-text">
          <span className="store-eyebrow">
            <span className="store-eyebrow-dot" />
            Live Product
          </span>

          <h2>
            Amros <span>Store</span>
          </h2>

          <p className="store-desc">
            A self-built commerce platform delivering culturally authentic,
            interactive wedding invitations for all Indian religions and
            communities — from checkout to a live WhatsApp handoff.
            Designed, developed, and shipped end-to-end as an independent
            product.
          </p>

          <div className="store-features">
            {FEATURES.map((f) => (
              <span className="store-chip" key={f.label}>
                {f.icon}
                {f.label}
              </span>
            ))}
          </div>

          <div className="store-stats">
            <div className="store-stat">
              <h3>All</h3>
              <span>Religions &amp; Communities</span>
            </div>
            <div className="store-stat">
              <h3>48h</h3>
              <span>Delivery</span>
            </div>
            <div className="store-stat">
              <h3>₹2,999</h3>
              <span>Starting At</span>
            </div>
          </div>

          <a
            className="store-cta"
            href="https://store-amros.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit AMROS Store
            <FiArrowUpRight />
          </a>
        </div>

        <div className="store-visual">
          <div className="store-browser">
            <div className="store-browser-bar">
              <div className="store-browser-dots">
                <span className="dot dot-red" />
                <span className="dot dot-yellow" />
                <span className="dot dot-green" />
              </div>
              <div className="store-browser-url">store-amros.vercel.app</div>
            </div>

            <div
              className="store-scroll-viewport"
              ref={viewportRef}
              style={{
                backgroundImage: "url(/images/store/store-desktop-full.webp)",
              }}
              role="img"
              aria-label="Scrolling preview of the AMROS Store desktop layout"
            />
          </div>

          <span className="store-float store-float-1">
            <FiUnlock /> Scratch reveal
          </span>
          <span className="store-float store-float-2">
            <FiClock /> 48h delivery
          </span>
        </div>
      </div>
    </div>
  );
};

export default StoreShowcase;
