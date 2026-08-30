import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useLoading } from "../context/LoadingProvider";
import "./styles/LoadingScreen.css";

const LETTERS = [
  { char: "A", color: "blue" },
  { char: "M", color: "blue" },
  { char: "R", color: "blue" },
  { char: "O", color: "orange" },
  { char: "S", color: "blue" },
];

const LoadingScreen = () => {
  const { setIsLoading } = useLoading();
  const overlayRef = useRef<HTMLDivElement>(null);
  const riserRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [filled, setFilled] = useState(false);

  /* ── Position the riser offscreen initially ── */
  useEffect(() => {
    if (riserRef.current) {
      gsap.set(riserRef.current, { xPercent: -50, yPercent: 100 });
    }
  }, []);

  /* ── Fill timer: 1.8s allows the AMROS letter fill animation to complete gracefully ── */
  useEffect(() => {
    const fillTimer = setTimeout(() => {
      setFilled(true);
    }, 1800);

    return () => clearTimeout(fillTimer);
  }, []);

  /* ── Exit animation once filled ── */
  useEffect(() => {
    if (!filled) return;

    // Trigger initialFX immediately so main page content is ready under riser
    import("./utils/initialFX").then((module) => {
      if (module.initialFX) {
        module.initialFX();
      }
    });

    const exitTl = gsap.timeline({
      onComplete: () => {
        setIsLoading(false);
      },
    });

    /* 1. Fade out the AMROS loader text */
    exitTl.to(loaderRef.current, {
      opacity: 0,
      y: -25,
      filter: "blur(4px)",
      duration: 0.4,
      ease: "power3.in",
    });

    /* 2. Curved dark bg sweeps up smoothly to reveal screen */
    exitTl.to(
      riserRef.current,
      {
        yPercent: 0,
        duration: 0.8,
        ease: "power2.inOut",
      },
      ">-0.1"
    );

    /* 3. Match overlay bg to riser so no flash on removal */
    exitTl.set(overlayRef.current, { background: "#050810" });

    return () => {
      exitTl.kill();
    };
  }, [filled]);

  return (
    <div ref={overlayRef} className="ls-overlay" id="loading-screen">
      <div ref={riserRef} className="ls-riser" />

      {/* Center content */}
      <div className="ls-center">
        <div ref={loaderRef} className="ls-loader">
          {LETTERS.map((l, i) => (
            <span
              key={i}
              className={`ls-char ls-char--${l.color}${filled ? " ls-filled" : ""}`}
            >
              {l.char}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
