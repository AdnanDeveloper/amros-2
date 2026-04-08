import React, {
    Children,
    cloneElement,
    forwardRef,
    isValidElement,
    useEffect,
    useMemo,
    useRef,
} from "react";
import gsap from "gsap";
import "./styles/CardSwap.css";

/* ─── Card ─── */

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
    customClass?: string;
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ customClass, ...rest }, ref) => (
        <div
            ref={ref}
            {...rest}
            className={`card-swap-card ${customClass ?? ""} ${rest.className ?? ""}`.trim()}
        />
    )
);
Card.displayName = "Card";

/* ─── CardSwap internals ─── */

const makeSlot = (i: number, distX: number, distY: number, total: number) => ({
    x: i * distX,
    y: -i * distY,
    z: -i * distX * 1.5,
    zIndex: total - i,
});

const placeNow = (el: HTMLElement, slot: ReturnType<typeof makeSlot>, skew: number) =>
    gsap.set(el, {
        x: slot.x,
        y: slot.y,
        z: slot.z,
        xPercent: -50,
        yPercent: -50,
        skewY: skew,
        transformOrigin: "center center",
        zIndex: slot.zIndex,
        force3D: true,
    });

/* ─── CardSwap component ─── */

type CardSwapProps = {
    children: React.ReactNode;
    width?: number;
    height?: number;
    cardDistance?: number;
    verticalDistance?: number;
    delay?: number;
    pauseOnHover?: boolean;
    onCardClick?: (index: number) => void;
    skewAmount?: number;
    easing?: "elastic" | "smooth";
};

const CardSwap = ({
    width = 400,
    height = 340,
    cardDistance = 50,
    verticalDistance = 60,
    delay = 4000,
    pauseOnHover = true,
    onCardClick,
    skewAmount = 6,
    easing = "elastic",
    children,
}: CardSwapProps) => {
    const config =
        easing === "elastic"
            ? {
                ease: "elastic.out(0.6,0.9)",
                durDrop: 2,
                durMove: 2,
                durReturn: 2,
                promoteOverlap: 0.9,
                returnDelay: 0.05,
            }
            : {
                ease: "power1.inOut",
                durDrop: 0.8,
                durMove: 0.8,
                durReturn: 0.8,
                promoteOverlap: 0.45,
                returnDelay: 0.2,
            };

    const childArr = useMemo(() => Children.toArray(children), [children]);
    const refs = useMemo(
        () => childArr.map(() => React.createRef<HTMLDivElement>()),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [childArr.length]
    );

    const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));
    const tlRef = useRef<gsap.core.Timeline | null>(null);
    const intervalRef = useRef<number>();
    const container = useRef<HTMLDivElement | null>(null);
    const swapFnRef = useRef<() => void>(() => { });

    useEffect(() => {
        const total = refs.length;
        refs.forEach((r, i) =>
            placeNow(r.current!, makeSlot(i, cardDistance, verticalDistance, total), skewAmount)
        );

        const swap = () => {
            if (order.current.length < 2) return;

            const [front, ...rest] = order.current;
            const elFront = refs[front].current!;
            const tl = gsap.timeline();
            tlRef.current = tl;

            tl.to(elFront, {
                y: "+=500",
                duration: config.durDrop,
                ease: config.ease,
            });

            tl.addLabel("promote", `-=${config.durDrop * config.promoteOverlap}`);
            rest.forEach((idx, i) => {
                const el = refs[idx].current!;
                const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
                tl.set(el, { zIndex: slot.zIndex }, "promote");
                tl.to(
                    el,
                    {
                        x: slot.x,
                        y: slot.y,
                        z: slot.z,
                        duration: config.durMove,
                        ease: config.ease,
                    },
                    `promote+=${i * 0.15}`
                );
            });

            const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
            tl.addLabel("return", `promote+=${config.durMove * config.returnDelay}`);
            tl.call(
                () => {
                    gsap.set(elFront, { zIndex: backSlot.zIndex });
                },
                undefined,
                "return"
            );
            tl.to(
                elFront,
                {
                    x: backSlot.x,
                    y: backSlot.y,
                    z: backSlot.z,
                    duration: config.durReturn,
                    ease: config.ease,
                },
                "return"
            );

            tl.call(() => {
                order.current = [...rest, front];
            });
        };

        swapFnRef.current = swap;

        const startInterval = () => {
            clearInterval(intervalRef.current);
            intervalRef.current = window.setInterval(swap, delay);
        };

        swap();
        startInterval();

        if (pauseOnHover) {
            const node = container.current!;
            const pause = () => {
                tlRef.current?.pause();
                clearInterval(intervalRef.current);
            };
            const resume = () => {
                tlRef.current?.play();
                startInterval();
            };
            node.addEventListener("mouseenter", pause);
            node.addEventListener("mouseleave", resume);
            return () => {
                node.removeEventListener("mouseenter", pause);
                node.removeEventListener("mouseleave", resume);
                clearInterval(intervalRef.current);
            };
        }
        return () => clearInterval(intervalRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing]);

    const handleManualSwap = () => {
        clearInterval(intervalRef.current);
        swapFnRef.current();
        intervalRef.current = window.setInterval(swapFnRef.current, delay);
    };

    // Drag / swipe detection
    const dragStartX = useRef<number | null>(null);

    const onPointerDown = (e: React.PointerEvent) => {
        dragStartX.current = e.clientX;
    };

    const onPointerUp = (e: React.PointerEvent) => {
        if (dragStartX.current === null) return;
        const diff = dragStartX.current - e.clientX;
        if (Math.abs(diff) > 50) {
            handleManualSwap();
        }
        dragStartX.current = null;
    };

    const rendered = childArr.map((child, i) =>
        isValidElement(child)
            ? cloneElement(child as React.ReactElement<any>, {
                key: i,
                ref: refs[i],
                style: { width, height, ...(child.props.style ?? {}) },
                onClick: (e: React.MouseEvent) => {
                    (child.props as any).onClick?.(e);
                    onCardClick?.(i);
                },
            })
            : child
    );

    return (
        <div
            ref={container}
            className="card-swap-container"
            style={{ width, height, touchAction: "pan-y" }}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
        >
            {rendered}
        </div>
    );
};

/* ─── Process Section ─── */

export default function ProcessSection() {
    return (
        <section className="card-swap-section">
            <div className="card-swap-layout">
                <div className="card-swap-text">
                    <h2>My Process</h2>
                    <p>
                        Every project follows a clear path — from initial discussion through
                        development to final delivery. Here's how I turn ideas into
                        production-ready solutions.
                    </p>
                </div>

                <div className="card-swap-wrapper">
                    <CardSwap
                        width={650}
                        height={500}
                        cardDistance={60}
                        verticalDistance={70}
                        delay={4000}
                        pauseOnHover={true}
                        easing="elastic"
                    >
                        <Card>
                            <div className="card-swap-header">
                                <span className="card-swap-icon">💬</span>
                                <span>1. Discuss</span>
                            </div>
                            <img src="/card-discuss.png" alt="Discuss" />
                            <div className="card-swap-overlay">
                                At Amros, the journey begins with a thorough discussion to understand your unique vision and project requirements.We believe that a strong foundation is key to success, and through detailed consultations, we ensure a clear understanding of your business and help you reach more customers. This sets the stage for a partnership built and going on to groundwork for the development process.


                            </div>
                        </Card>

                        <Card>
                            <div className="card-swap-header">
                                <span className="card-swap-icon">⚙️</span>
                                <span>2. Develop</span>
                            </div>
                            <img src="/card-develop.png" alt="Develop" />
                            <div className="card-swap-overlay">
                                Once the discussion phase is complete, we seamlessly transition to the development stage. Drawing upon the insights gathered during discussions, our skilled development team leverages cutting-edge technologies to bring your vision to life. With a focus on clean and efficient coding, we work diligently to create a robust and scalable solution tailored to your specific needs.
                            </div>
                        </Card>

                        <Card>
                            <div className="card-swap-header">
                                <span className="card-swap-icon">🚀</span>
                                <span>3. Deliver</span>
                            </div>
                            <img src="/card-deliver.png" alt="Deliver" />
                            <div className="card-swap-overlay">
                                At Amros, our commitment to timely project delivery is our priority. The Deliver phase marks the standards of our collaborative efforts, where we present you with a fully realized website. We understand the importance of meeting deadlines in the challenging industry. Our goal is not just to meet but to exceed your expectations, delivering a website that stands out in design and functionality.
                            </div>
                        </Card>
                    </CardSwap>
                </div>
            </div>
        </section>
    );
}
