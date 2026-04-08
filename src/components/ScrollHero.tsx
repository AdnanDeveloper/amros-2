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

                const img = images[frameIndex];
                if (!img) return;

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
            ----------------------------- */

            for (let i = 1; i < frameCount; i++) {
                const img = new Image();
                img.src = framePath(i);
                images.push(img);
            }

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
                        Adnan Moriswala, a dedicated freelance web developer in Mumbai, is the creative force behind the esteemed brand Amros. As a freelance web developer in Mumbai, I have expertise to create dynamic and visually appealing websites, ensuring that businesses establish a strong online presence.
                        Operating under the brand name Amros, I build every project with enthusiasm and my focus on delivering projects on time speaks volumes about my professionalism and reliability.


                    </p>
                </div>
            </div>

        </section>
    );
};

export default ScrollHero;
