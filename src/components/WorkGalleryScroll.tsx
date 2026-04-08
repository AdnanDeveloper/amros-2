import {
  useLayoutEffect,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { smoother } from "./Navbar";
import "./styles/WorkGalleryScroll.css";

gsap.registerPlugin(ScrollTrigger);

export type WorkGalleryTabId = "websites" | "brand" | "creatives";

const TABS: { id: WorkGalleryTabId; label: string }[] = [
  { id: "websites", label: "Websites & App" },
  { id: "brand", label: "Brand Building" },
  { id: "creatives", label: "Web Creatives" },
];

/** Swap paths per category when you have dedicated assets; reuses project shots for now. */
const GALLERIES: Record<WorkGalleryTabId, { src: string; alt: string }[]> = {
  websites: [
    { src: "/images/Solidx.png", alt: "Solid Starters — platform" },
    { src: "/images/radix.png", alt: "Radix — e-commerce" },
    { src: "/images/bond.png", alt: "Bond Cancellation — automation" },
    { src: "/images/sapphire.png", alt: "Sapphire — CRM" },
    { src: "/images/Maxlife.png", alt: "Mpro — insurance" },
  ],
  brand: [
    { src: "/images/sapphire.png", alt: "Sapphire — brand system" },
    { src: "/images/radix.png", alt: "Radix — retail identity" },
    { src: "/images/Solidx.png", alt: "Solid Starters — product UI" },
    { src: "/images/Maxlife.png", alt: "Mpro — campaign visuals" },
  ],
  creatives: [
    { src: "/images/bond.png", alt: "Bond — creative landing" },
    { src: "/images/Solidx.png", alt: "Solid Starters — marketing site" },
    { src: "/images/radix.png", alt: "Radix — seasonal creative" },
    { src: "/images/sapphire.png", alt: "Sapphire — social & web" },
    { src: "/images/Maxlife.png", alt: "Mpro — digital creatives" },
  ],
};

const WorkGalleryScroll = () => {
  const [activeTab, setActiveTab] = useState<WorkGalleryTabId>("websites");
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const skipScrollOnMount = useRef(true);
  const items = GALLERIES[activeTab];

  const selectTab = useCallback((id: WorkGalleryTabId) => {
    setActiveTab(id);
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!section || !track || !viewport) return;

    gsap.set(track, { x: 0 });

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1025px)", () => {
      const scrollDistance = () =>
        Math.max(0, track.scrollWidth - viewport.clientWidth);

      let refreshRaf: number | null = null;
      const scheduleRefresh = () => {
        if (refreshRaf != null) cancelAnimationFrame(refreshRaf);
        refreshRaf = requestAnimationFrame(() => {
          refreshRaf = null;
          ScrollTrigger.refresh();
        });
      };

      const tween = gsap.to(track, {
        x: () => -scrollDistance(),
        ease: "none",
        force3D: true,
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${scrollDistance()}`,
          pin: true,
          scrub: true,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
        },
      });

      const onImgLoad = () => scheduleRefresh();
      section.querySelectorAll(".wgs-viewport img").forEach((img) => {
        const el = img as HTMLImageElement;
        if (el.complete) return;
        el.addEventListener("load", onImgLoad);
      });

      return () => {
        if (refreshRaf != null) cancelAnimationFrame(refreshRaf);
        section.querySelectorAll(".wgs-viewport img").forEach((img) => {
          (img as HTMLImageElement).removeEventListener("load", onImgLoad);
        });
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, [activeTab]);

  useEffect(() => {
    if (skipScrollOnMount.current) {
      skipScrollOnMount.current = false;
      return;
    }
    const run = () => {
      ScrollTrigger.refresh();
      if (window.innerWidth > 1024 && smoother) {
        smoother.scrollTo("#gallery-scroll", true, "top top");
      }
    };
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(run);
    });
    return () => cancelAnimationFrame(id);
  }, [activeTab]);

  return (
    <section
      className="wgs-section"
      id="gallery-scroll"
      ref={sectionRef}
      aria-label="Project gallery"
    >
      <div className="wgs-inner">
        <p className="wgs-heading">
          Scroll down for the <span>Gallery</span>
        </p>

        <div
          className="wgs-tabs"
          role="tablist"
          aria-label="Gallery categories"
        >
          {TABS.map((tab) => {
            const selected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`wgs-tab-${tab.id}`}
                aria-selected={selected}
                aria-controls="wgs-gallery-panel"
                className={`wgs-tab${selected ? " wgs-tab--active" : ""}`}
                onClick={() => selectTab(tab.id)}
                data-cursor="disable"
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        className="wgs-viewport"
        ref={viewportRef}
        id="wgs-gallery-panel"
        role="tabpanel"
        aria-labelledby={`wgs-tab-${activeTab}`}
      >
        <div className="wgs-track" ref={trackRef}>
          {items.map((item, index) => (
            <figure
              className="wgs-card"
              key={`${activeTab}-${index}-${item.src}`}
            >
              <img
                src={item.src}
                alt={item.alt}
                loading={index < 2 ? "eager" : "lazy"}
                decoding="async"
              />
              <figcaption>{item.alt}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkGalleryScroll;
