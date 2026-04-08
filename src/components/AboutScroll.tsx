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
                    Adnan Moriswala, a dedicated freelance web developer in Mumbai, is the creative force behind the esteemed brand Amros. As a freelance web developer in Mumbai, I have expertise to create dynamic and visually appealing websites, ensuring that businesses establish a strong online presence.
                    Operating under the brand name Amros, I build every project with enthusiasm and my focus on delivering projects on time speaks volumes about my professionalism and reliability.


                </p>
            </div>
        </section>
    );
};

export default AboutScroll;