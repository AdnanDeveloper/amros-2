import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/ServiceReveal.css";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    number: "001",
    title: "Website & App Development",
    description:
      "Custom websites, eCommerce platforms, web apps, and mobile-ready solutions using modern tech like React and scalable backend systems.",
  },
  {
    number: "002",
    title: "AI Automation & Workflows",
    description:
      "AI workflows, task automation, integrations, and custom AI agents that reduce manual work and improve efficiency.",
  },
  {
    number: "003",
    title: "AI Chatbots & Smart Assistants",
    description:
      "Custom AI chatbots for websites, lead generation, customer support automation, and personalized user interactions.",
  },
  {
    number: "004",
    title: "Digital Marketing & SEO",
    description:
      "SEO optimization, performance marketing, and strategies that help businesses rank, reach, and convert better.",
  },
  {
    number: "005",
    title: "Branding & Creative Design",
    description:
      "UI/UX design, social media creatives, brand identity, and design systems that align with business goals.",
  },
];

const ServiceReveal = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textWrapperRef = useRef<HTMLDivElement>(null);
  const servicesListRef = useRef<HTMLDivElement>(null);
  const grayWordsRef = useRef<HTMLSpanElement[]>([]);



  // ScrollTrigger animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current!;
      const textWrapper = textWrapperRef.current!;
      const servicesList = servicesListRef.current!;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=2500",
          scrub: 1.5,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
        },
      });

      const allWords = [
        ...Array.from(section.querySelectorAll(".sr-dark")),
        ...grayWordsRef.current,
      ];
      allWords.forEach((word, i) => {
        tl.to(word, { color: "#ff8d1d", duration: 0.1 }, i * 0.03);
      });

      tl.to(
        textWrapper,
        { scale: 15, opacity: 0, duration: 0.4, ease: "power2.in" },
        0.2
      );

      tl.fromTo(
        servicesList,
        { opacity: 0 },
        { opacity: 1, duration: 0.2, ease: "power2.out" },
        0.5
      );

      const serviceItems = servicesList.querySelectorAll(".sr-service-item");
      tl.fromTo(
        serviceItems,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.06, ease: "power2.out" },
        0.55
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const setGrayRef = (el: HTMLSpanElement | null, index: number) => {
    if (el) grayWordsRef.current[index] = el;
  };

  return (
    <div ref={sectionRef} className="sr-section">
      <div ref={textWrapperRef} className="sr-text-wrapper">
        <h2 className="sr-heading">
          <span className="sr-dark">What services</span>
          <br />
          <span className="sr-dark">Amros </span>
          <span ref={(el) => setGrayRef(el, 0)} className="sr-gray">
            provide you
          </span>
          <br />
          <span ref={(el) => setGrayRef(el, 1)} className="sr-gray">
            actually
          </span>
        </h2>
      </div>

      <div ref={servicesListRef} className="sr-services-list">
        {services.map((service, index) => (
          <div
            key={service.number}
            className="sr-service-item"
            data-service-index={index}
          >
            <div className="sr-service-left">
              <span className="sr-service-number">{service.number}</span>
              <h3 className="sr-service-title">
                <a href="https://wa.me/919082816570" target="_blank" rel="noopener noreferrer">
                  {service.title}
                </a>
              </h3>
            </div>
            <div className="sr-service-right">
              <p className="sr-service-desc">{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceReveal;
