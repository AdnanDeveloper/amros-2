import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useLoading } from "../context/LoadingProvider";
import "./styles/LoadingScreen.css";

const LoadingScreen = ({ percent }: { percent: number }) => {
  const { setIsLoading } = useLoading();
  const overlayRef = useRef<HTMLDivElement>(null);
  const riserRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const lineTopRef = useRef<HTMLDivElement>(null);
  const lineBotRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [ready, setReady] = useState(false);

  /* ── Mark ready once assets are loaded ── */
  useEffect(() => {
    if (percent >= 100 && !ready) {
      setTimeout(() => setReady(true), 400);
    }
  }, [percent, ready]);

  /* ── Intro timeline (keep text/counter intact, simplify decoration) ── */
  useEffect(() => {
    const letters = textRef.current?.querySelectorAll(".ls-char");
    if (!letters?.length) return;
    if (riserRef.current) {
      gsap.set(riserRef.current, { xPercent: -50, yPercent: 100 });
    }

    const tl = gsap.timeline({ paused: true });
    tlRef.current = tl;

    tl.fromTo(
      letters,
      {
        y: 42,
        opacity: 0,
        filter: "blur(8px)",
      },
      {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.06,
      },
      0.2
    );

    tl.to(
      textRef.current,
      {
        textShadow:
          "0 0 34px rgba(254, 139, 41, 0.52), 0 0 80px rgba(254, 139, 41, 0.24)",
        y: -4,
        duration: 0.55,
        ease: "power2.inOut",
        yoyo: true,
        repeat: 1,
      },
      ">-0.1"
    );
    tl.play();

    return () => {
      tl.kill();
    };
  }, []);

  /* ── Exit animation once ready ── */
  useEffect(() => {
    if (!ready) return;

    const exitTl = gsap.timeline({
      onComplete: () => {
        import("./utils/initialFX").then((module) => {
          if (module.initialFX) {
            module.initialFX();
          }
          setIsLoading(false);
        });
      },
    });

    const letters = textRef.current?.querySelectorAll(".ls-char");

    /* 1. Fade out the AMROS text, counter, lines */
    exitTl.to(letters!, {
      y: -30,
      opacity: 0,
      filter: "blur(6px)",
      duration: 0.45,
      ease: "power3.in",
      stagger: 0.03,
    });

    exitTl.to(
      [lineTopRef.current, lineBotRef.current],
      { opacity: 0, duration: 0.22, ease: "power2.out" },
      "<"
    );

    exitTl.to(
      counterRef.current?.parentElement!,
      { opacity: 0, y: -20, duration: 0.3, ease: "power2.in" },
      "<"
    );

    /* 2. Curved dark bg sweeps up from bottom to fill the screen */
    exitTl.to(
      riserRef.current,
      {
        yPercent: 0,
        duration: 1.1,
        ease: "power2.inOut",
      },
      ">-0.15"
    );

    /* 3. Match overlay bg to riser so no white flash on removal */
    exitTl.set(overlayRef.current, { background: "#050810" });

    /* 4. Brief hold on the dark filled screen, then we're done */
    exitTl.to({}, { duration: 0.3 });

    return () => {
      exitTl.kill();
    };
  }, [ready]);

  /* ── Counter animation ── */
  useEffect(() => {
    if (!counterRef.current) return;
    gsap.to(counterRef.current, {
      innerText: percent,
      duration: 0.4,
      snap: { innerText: 1 },
      ease: "none",
    });
  }, [percent]);

  /* ── Split "AMROS" into chars ── */
  const text = "AMROS";

  return (
    <div ref={overlayRef} className="ls-overlay" id="loading-screen">
      <div ref={riserRef} className="ls-riser" />
      {/* Decorative lines */}
      <div ref={lineTopRef} className="ls-line ls-line-top" />
      <div ref={lineBotRef} className="ls-line ls-line-bot" />

      {/* Center content */}
      <div className="ls-center">
        <div ref={textRef} className="ls-text" aria-label={text}>
          {text.split("").map((char, i) => (
            <span className="ls-char" key={i} style={{ display: "inline-block" }}>
              {char}
            </span>
          ))}
        </div>

        <div className="ls-counter">
          <span ref={counterRef} className="ls-counter-num">0</span>
          <span className="ls-counter-pct">%</span>
        </div>
      </div>

      {/* Corner accents */}
      <div className="ls-corner ls-corner-tl" />
      <div className="ls-corner ls-corner-tr" />
      <div className="ls-corner ls-corner-bl" />
      <div className="ls-corner ls-corner-br" />
    </div>
  );
};

export default LoadingScreen;
