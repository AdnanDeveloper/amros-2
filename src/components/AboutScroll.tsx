import { useEffect, useRef } from "react";

const AboutScroll = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const startFrame = 30;
        const endFrame = 59;
        const frameCount = endFrame - startFrame;

        const canvas = canvasRef.current!;
        const context = canvas.getContext("2d")!;

        const images: HTMLImageElement[] = [];

        const currentFrame = (index: number) =>
            `/frames/frame_${(index + startFrame)
                .toString()
                .padStart(2, "0")}_delay-0.066s.webp`;

        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.src = currentFrame(i);
            images.push(img);
        }

        const render = (index: number) => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(images[index], 0, 0, canvas.width, canvas.height);
        };

        images[0].onload = () => render(0);

        const onScroll = () => {
            const section = sectionRef.current;
            if (!section) return;

            const rect = section.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            const progress = Math.min(
                Math.max((windowHeight - rect.top) / (rect.height + windowHeight), 0),
                1
            );

            const frameIndex = Math.floor(progress * (frameCount - 1));

            render(frameIndex);
        };

        window.addEventListener("scroll", onScroll);

        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <section ref={sectionRef} className="scroll-section">
            <canvas ref={canvasRef} width={1920} height={1080} />

            <div className="about-content">
                <h2>About Me</h2>
                <p>
                    AMROS is a Mumbai-based digital solutions brand founded by Adnan Moriswala, built to help businesses establish, grow, and scale their digital presence. From websites and eCommerce platforms to AI automation, intelligent chatbots, digital marketing, and creative design, we combine technology and creativity to build solutions that move businesses forward.
                    <br />
                    <br />
                    With a strong foundation as a freelance website developer in Mumbai, AMROS has evolved beyond traditional web development into building smarter digital systems. Every solution is designed with a focus on performance, functionality, user experience, and meaningful business growth.
                    <br />
                    <br />
                    We don't just build a digital presence. We build systems that help businesses grow.
                </p>
            </div>
        </section>
    );
};

export default AboutScroll;