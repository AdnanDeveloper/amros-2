import { PropsWithChildren, useEffect, useState } from "react";
import About from "./About";
import Career from "./Career";
import Contact from "./Contact";
import Cursor from "./Cursor";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import Work from "./Work";
import setSplitText from "./utils/splitText";
import ScrollHero from "./ScrollHero";
import ServiceReveal from "./ServiceReveal";
import FallingText from "./FallingText";
import ProcessSection from "./CardSwap";
import ClientMarquee from "./ClientMarquee";
import HeroTextReveal from "./HeroTextReveal";



const MainContainer = ({ children }: PropsWithChildren) => {
  const [isDesktopView, setIsDesktopView] = useState<boolean>(
    window.innerWidth > 1024
  );

  useEffect(() => {
    const resizeHandler = () => {
      setSplitText();
      setIsDesktopView(window.innerWidth > 1024);
    };
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, [isDesktopView]);

  return (
    <div className="container-main">
      <Cursor />
      <Navbar />
      <SocialIcons />
      {isDesktopView && children}
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <div className="container-main">
            <ScrollHero />
            <HeroTextReveal />
            <Career />
            <About />
            <ServiceReveal />
            <Work />
            <ProcessSection />
            <ClientMarquee />
            <FallingText />
            <Contact />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContainer;
