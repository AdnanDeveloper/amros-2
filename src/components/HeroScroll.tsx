import { useEffect, useRef } from "react";

const HeroScroll = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const frameCount = 30;

        const canvas = canvasRef.current!;
        const context = canvas.getContext("2d")!;

        const images: HTMLImageElement[] = [];

        const currentFrame = (index: number) =>
            `/frames/frame_${index.toString().padStart(2, "0")}_delay-0.066s.webp`;

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

            <div className="hero-content">
                <div className="hero-left">
                    <p>Hello I'm</p>
                    <h1>ADNAN MORISWALA</h1>
                </div>

                <div className="hero-right">
                    <p>Specialized in</p>
                    <h1>Web & App Development</h1>
                </div>
            </div>
        </section>
    );
};

export default HeroScroll;