import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLoading } from "../context/LoadingProvider";

gsap.registerPlugin(ScrollTrigger);

const ScrollHero = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const aboutRef = useRef<HTMLDivElement>(null);

    const { setLoading } = useLoading(); // 👈 added

    useEffect(() => {
        const ctx = gsap.context(() => {
            const isMobile = window.innerWidth < 768;

            const frameCount = 60;
            const canvas = canvasRef.current!;
            const context = canvas.getContext("2d")!;

            const images: HTMLImageElement[] = [];

            const framePath = (i: number) =>
                `/frames/frame_${i.toString().padStart(2, "0")}_delay-0.066s.webp`;

            const frame = { value: 0 };
            let currentFrame = -1;

            /* -----------------------------
               Canvas size
            ----------------------------- */

            const setCanvasSize = () => {
                const dpr = window.devicePixelRatio || 1;

                const height = isMobile
                    ? window.innerWidth   // square canvas
                    : window.innerHeight;

                canvas.width = window.innerWidth * dpr;
                canvas.height = height * dpr;

                canvas.style.width = window.innerWidth + "px";
                canvas.style.height = height + "px";

                context.setTransform(dpr, 0, 0, dpr, 0, 0);
            };

            setCanvasSize();
            window.addEventListener("resize", setCanvasSize);

            /* -----------------------------
               Render frame
            ----------------------------- */

            const render = () => {
                const frameIndex = Math.round(frame.value);
                if (frameIndex === currentFrame) return;

                currentFrame = frameIndex;

                let img = images[frameIndex];
                if (!img) {
                    // Not downloaded yet — draw the nearest frame that is
                    // loaded instead of freezing, so scrubbing stays smooth
                    // while the rest of the sequence finishes loading.
                    for (let offset = 1; offset < frameCount && !img; offset++) {
                        img = images[frameIndex - offset] || images[frameIndex + offset];
                    }
                    if (!img) return;
                }

                const height =
                    window.innerWidth < 768
                        ? window.innerWidth   // square render area
                        : window.innerHeight;

                context.clearRect(0, 0, window.innerWidth, height);

                const imgAspect = img.width / img.height;

                let drawWidth, drawHeight, offsetX = 0, offsetY = 0;

                if (isMobile) {

                    // MOBILE → show full horizontal frame (contain)
                    drawWidth = window.innerWidth;
                    drawHeight = window.innerWidth / imgAspect;

                    offsetY = (height - drawHeight) / 2;

                } else {

                    // DESKTOP → keep current cover behavior
                    const canvasAspect = window.innerWidth / height;

                    if (imgAspect > canvasAspect) {
                        drawHeight = height;
                        drawWidth = height * imgAspect;
                        offsetX = -(drawWidth - window.innerWidth) / 2;
                    } else {
                        drawWidth = window.innerWidth;
                        drawHeight = window.innerWidth / imgAspect;
                        offsetY = -(drawHeight - height) / 2;
                    }

                }

                context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
            };

            /** Re-runs render() for the current scroll position — used to
             * redraw the instant a still-loading frame finally arrives. */
            const forceRedraw = () => {
                currentFrame = -1;
                render();
            };

            /* -----------------------------
               Load first frame immediately
            ----------------------------- */

            const firstImage = new Image();
            firstImage.src = framePath(0);

            firstImage.onload = () => {
                images[0] = firstImage;
                frame.value = 0;

                render();
                requestAnimationFrame(() => render());

                /* 👇 Finish loader once hero image is ready */
                setTimeout(() => {
                    setLoading(100);
                }, 200);
            };

            images.push(firstImage);

            /* -----------------------------
               Load remaining frames
               (throttled so this doesn't compete for bandwidth
               with the JS bundle, fonts and character model on
               first load — big source of "page never finishes
               loading" on slower connections)
            ----------------------------- */

            const CONCURRENCY = 6;
            let nextToQueue = 1;
            let loadedCount = 0;
            const remaining = frameCount - 1;

            const queueNext = () => {
                if (nextToQueue >= frameCount) return;
                const i = nextToQueue++;
                const img = new Image();
                img.fetchPriority = "low";
                img.onload = img.onerror = () => {
                    loadedCount++;
                    forceRedraw();
                    if (loadedCount < remaining) queueNext();
                };
                img.src = framePath(i);
                images[i] = img;
            };

            for (let c = 0; c < CONCURRENCY; c++) queueNext();

            /* -----------------------------
               Scroll timeline
            ----------------------------- */

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: isMobile ? "+=400" : "+=2500",
                    scrub: 3,
                    pin: !isMobile
                }
            });

            tl.to(frame, {
                value: frameCount - 1,
                ease: "none",
                onUpdate: render
            }, 0);

            if (!isMobile) {
                tl.to(heroRef.current, {
                    opacity: 0,
                    duration: 0.4
                }, 0.35);

                tl.to(aboutRef.current, {
                    opacity: 1,
                    duration: 0.4
                }, 0.45);
            }

            /* -----------------------------
               Safety render
            ----------------------------- */

            setTimeout(() => {
                frame.value = 0;
                render();
            }, 50);

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="scroll-hero">

            <div className="scroll-hero-canvas">
                <canvas ref={canvasRef} />
            </div>

            <div ref={heroRef} className="hero-content">
                <div className="scroll-hero-left">
                    <p>Hello! I'm</p>
                    <h1>
                        ADNAN <br /> MORISWALA
                    </h1>
                </div>

                <div className="landing-info">
                    <h3>Specialized in</h3>

                    <h2 className="landing-info-h2">
                        <div className="landing-h2-1">Web & App</div>
                        <div className="landing-h2-2">Automation</div>
                    </h2>

                    <h2>
                        <div className="landing-h2-info">Development</div>
                        <div className="landing-h2-info-1">Workflow</div>
                    </h2>
                </div>
            </div>

            <div ref={aboutRef} className="hero-content about-content">
                <div className="about-me">
                    <h3 className="title">About Me</h3>

                    <p className="para">
                        AMROS is a Mumbai-based digital solutions brand founded by Adnan Moriswala, built to help businesses establish, grow, and scale their digital presence. From websites and eCommerce platforms to AI automation, intelligent chatbots, digital marketing, and creative design, we combine technology and creativity to build solutions that move businesses forward.
                        <br />
                        <br />
                        With a strong foundation as a freelance website developer in Mumbai, AMROS has evolved beyond traditional web development into building smarter digital systems. Every solution is designed with a focus on performance, functionality, user experience, and meaningful business growth.
                        <br />
                        <br />
                        We don't just build a digital presence. We build systems that help businesses grow.
                    </p>
                </div>
            </div>

        </section>
    );
};

export default ScrollHero;
