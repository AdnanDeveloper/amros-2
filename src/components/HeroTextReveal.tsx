import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/HeroTextReveal.css";

gsap.registerPlugin(ScrollTrigger);

const HeroTextReveal = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!textRef.current) return;

      const letters = textRef.current.querySelectorAll(".hero-letter");
      const isMobile = window.innerWidth <= 768;

      gsap.fromTo(
        letters,
        {
          color: "rgba(255, 255, 255, 0.15)",
        },
        {
          color: (_index, target) => {
            return target.dataset.highlight === "true" ? "#fe8b27" : "#ffffff";
          },
          stagger: 0.1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: isMobile ? "top 80%" : "top top",
            end: isMobile ? "bottom 60%" : "+=150%",
            scrub: true,
            pin: !isMobile,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const lines = [
    { text: "DON’T JUST BUILD WEBSITES.", marginClass: "margin-1" },
    { text: "BUILD SYSTEMS THAT GROW.", marginClass: "margin-2" },
    { text: "KEEP GROWING.", marginClass: "margin-3" }
  ];

  const highlightWords = ["GROWING."];

  return (
    <section className="hero-text-reveal" ref={containerRef}>
      <div className="hero-text-reveal-content">
        <h2 ref={textRef}>
          {lines.map((line, lineIndex) => (
            <div key={lineIndex} className={`hero-line ${line.marginClass}`}>
              {line.text.split(" ").map((word, wordIndex) => {
                const isHighlight = highlightWords.includes(word);
                return (
                  <span key={wordIndex} className="hero-word">
                    {word.split("").map((char, charIndex) => (
                      <span
                        key={charIndex}
                        className="hero-letter"
                        data-highlight={isHighlight}
                      >
                        {char}
                      </span>
                    ))}
                    <span className="hero-letter" data-highlight={false}>&nbsp;</span>
                  </span>
                );
              })}
            </div>
          ))}
        </h2>
      </div>
    </section>
  );
};

export default HeroTextReveal;
