import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/all";
import "./styles/ClientMarquee.css";

// Register Draggable
gsap.registerPlugin(Draggable);

const CLIENTS = [
  { id: 1, src: "/public/images/client/1.png", alt: "Client 1 Logo" },
  { id: 2, src: "/public/images/client/2.png", alt: "Client 2 Logo" },
  { id: 3, src: "/public/images/client/3.png", alt: "Client 3 Logo" },
  { id: 4, src: "/public/images/client/4.png", alt: "Client 4 Logo" },
  { id: 5, src: "/public/images/client/5.png", alt: "Client 5 Logo" },
  { id: 6, src: "/public/images/client/6.png", alt: "Client 6 Logo" },
  { id: 7, src: "/public/images/client/7.png", alt: "Client 7 Logo" },
  { id: 8, src: "/public/images/client/8.png", alt: "Client 7 Logo" },
];

export default function ClientMarquee() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Double the tracking array to create an organic infinite loop feeling 
  const displayClients = [...CLIENTS, ...CLIENTS];

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let halfWidth = track.scrollWidth / 2;

    // Auto scroll timeline from 0 to -halfWidth
    const tl = gsap.timeline({ repeat: -1, paused: false });

    const initTimeline = () => {
      halfWidth = track.scrollWidth / 2;
      tl.clear();
      gsap.set(track, { x: 0 }); // reset
      tl.to(track, {
        x: -halfWidth,
        ease: "none",
        duration: 20,
        modifiers: {
          x: gsap.utils.unitize(gsap.utils.wrap(-halfWidth, 0))
        }
      });
    };

    initTimeline();

    // Create invisible proxy element for dragging coordinate accumulation
    const proxy = document.createElement("div");

    let isDragging = false;

    // Draggable instance on proxy logic bridging with the timeline progress
    const draggable = Draggable.create(proxy, {
      type: "x",
      trigger: track,
      inertia: false,
      onPress() {
        isDragging = true;
        tl.pause();
        // sync proxy with current track position
        const currentX = gsap.getProperty(track, "x") as number;
        gsap.set(proxy, { x: currentX });
        this.update();
      },
      onDrag() {
        const xPos = this.x;
        // Wrap mathematically back into [-halfWidth, 0] bounds smoothly
        const wrappedX = gsap.utils.wrap(-halfWidth, 0, xPos);
        gsap.set(track, { x: wrappedX });

        // Sync the timeline mathematically so that when we resume, it starts from exactly here
        const progress = Math.abs(wrappedX) / halfWidth;
        tl.progress(progress);
      },
      onRelease() {
        isDragging = false;
        // Only resume if dragging released. Hover mechanics are distinct.
        tl.play();
      }
    })[0];

    // Optional: Pause on Hover if Not dragging
    const onEnter = () => { if (!isDragging) tl.pause(); };
    const onLeave = () => { if (!isDragging) tl.play(); };

    track.addEventListener("mouseenter", onEnter);
    track.addEventListener("mouseleave", onLeave);

    const onResize = () => {
      initTimeline();
    };

    window.addEventListener("resize", onResize);

    return () => {
      tl.kill();
      draggable.kill();
      window.removeEventListener("resize", onResize);
      track.removeEventListener("mouseenter", onEnter);
      track.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className="client-marquee-section">
      <div className="client-marquee-container" ref={containerRef}>
        <div className="client-marquee-track" ref={trackRef}>
          {displayClients.map((client, idx) => (
            <div className="client-logo-wrapper" key={idx}>
              <img src={client.src} alt={client.alt} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
