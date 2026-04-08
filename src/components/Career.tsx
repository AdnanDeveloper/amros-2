import { useEffect } from "react";
import { setAllTimeline } from "./utils/GsapScroll";
import "./styles/Career.css";

const Career = () => {
  useEffect(() => {
    if (window.innerWidth <= 1024) {
      setAllTimeline();
    }
  }, []);

  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          The Growth    <span>of</span>
          <br /> Amros
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>The Beginning</h4>
                <h5>Laying the foundation for brands to go digital.</h5>
              </div>
              <h3>2023</h3>
            </div>
            <p>
              Amros was founded with a vision to help small businesses and emerging brands build their online presence. Starting with website development, the focus was on creating simple, effective, and accessible digital solutions for those stepping into the online world.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Growth & Expansion</h4>
                <h5>Expanding services to build complete digital presence.</h5>
              </div>
              <h3>2024</h3>
            </div>
            <p>
              Expanded services beyond websites into eCommerce development, social media handling, and creative design for both web and social platforms. This phase focused on helping brands grow digitally with a complete and consistent online presence.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Intelligent & Scalable Solutions</h4>
                <h5>Driving growth through AI, automation, and collaboration.</h5>
              </div>
              <h3>NOW</h3>
            </div>
            <p>
              Collaborating with digital agencies and creative professionals to deliver advanced solutions. Building AI-powered workflows and chatbots that drive efficiency and enable up to 3x business growth. Expanding into digital marketing, graphic design, website and app development, and AI automation systems.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
