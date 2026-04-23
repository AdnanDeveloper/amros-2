import { useState, useCallback } from "react";
import "./styles/Work.css";
import WorkImage from "./WorkImage";
import { MdArrowBack, MdArrowForward } from "react-icons/md";

const TABS = [
  "Websites / App",
  "Brand Creation",
  "Web & SM Creatives"
];

const projectsData: Record<string, any[]> = {
  "Websites / App": [
    {
      title: "White Camel",
      category: "Ecommerce Website",
      tools: "Wordpress, Woocommerce, Google Analytics, Mobile-first design, SEO Optimized",
      fullPageImage: "/images/work/whitecamel.webp",
    },
    {
      title: "BDazzle",
      category: "Fashion Ecommerce",
      tools: "Wordpress, Product Enquiry, Custom Design, Responsive",
      fullPageImage: "/images/work/bdazzle.webp",
    },
    {
      title: "Nova Rugs",
      category: "Bespoke Rugs & Carpets",
      tools: "Wordpress, Custom Design, Catalog, SEO Optimized",
      fullPageImage: "/images/work/novarugs.webp",
    },
    {
      title: "BRIXS Media",
      category: "Digital Marketing Agency",
      tools: "Custom Design, Lead Generation, SEO, Performance Marketing",
      fullPageImage: "/images/work/brixsmedia.webp",
    },
    {
      title: "21 Alloys",
      category: "Industrial B2B Website",
      tools: "Wordpress, Custom Theme, SEO, Keyword Research, Rank 1 in Google for Multiple Keywords",
      fullPageImage: "/images/work/21alloys.webp",
    },
    {
      title: "Burhani Decor",
      category: "Interior & Wallpaper Store",
      tools: "Wordpress, Woocommerce, Custom UI, Product Catalog",
      fullPageImage: "/images/work/burhanidecor.webp",
    },

    {
      title: "SM Dry Fruits",
      category: "Organic Food Ecommerce",
      tools: "Wordpress, Woocommerce, Product Filtering, Mobile-first",
      fullPageImage: "/images/work/smdry.webp",
    },
  ],
  "Brand Creation": [
    {
      title: "Brand Project 1",
      category: "Branding",
      tools: "Illustrator, Photoshop",
      image: "/images/placeholder.png",
    },
    {
      title: "Brand Project 2",
      category: "Identity",
      tools: "Figma, Illustrator",
      image: "/images/placeholder.png",
    }
  ],
  "Web & SM Creatives": [
    {
      title: "Creative Project 1",
      category: "Social Media",
      tools: "After Effects, Photoshop",
      image: "/images/placeholder.png",
    },
    {
      title: "Creative Project 2",
      category: "Marketing",
      tools: "Premiere Pro, Figma",
      image: "/images/placeholder.png",
    }
  ]
};

const Work = () => {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentProjects = projectsData[activeTab] || [];

  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrentIndex(index);
      setTimeout(() => setIsAnimating(false), 500);
    },
    [isAnimating]
  );

  const goToPrev = useCallback(() => {
    const newIndex =
      currentIndex === 0 ? currentProjects.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  }, [currentIndex, currentProjects.length, goToSlide]);

  const goToNext = useCallback(() => {
    const newIndex =
      currentIndex === currentProjects.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  }, [currentIndex, currentProjects.length, goToSlide]);

  const handleTabChange = (tab: string) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
      setCurrentIndex(0);
    }
  };

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My Work
        </h2>

        <div className="work-tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`work-tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => handleTabChange(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="carousel-wrapper">
          {/* Navigation Arrows */}
          <button
            className="carousel-arrow carousel-arrow-left"
            onClick={goToPrev}
            aria-label="Previous project"
            data-cursor="disable"
          >
            <MdArrowBack />
          </button>
          <button
            className="carousel-arrow carousel-arrow-right"
            onClick={goToNext}
            aria-label="Next project"
            data-cursor="disable"
          >
            <MdArrowForward />
          </button>

          {/* Slides */}
          <div className="carousel-track-container">
            <div
              className="carousel-track"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {currentProjects.map((project, index) => (
                <div className="carousel-slide" key={index}>
                  <div className="carousel-content">
                    <div className="carousel-info">
                      <div className="carousel-number">
                        <h3>0{index + 1}</h3>
                      </div>
                      <div className="carousel-details">
                        <h4>{project.title}</h4>
                        <p className="carousel-category">
                          {project.category}
                        </p>
                        <div className="carousel-tools">
                          <span className="tools-label">Tools & Features</span>
                          <p>{project.tools}</p>
                        </div>
                      </div>
                    </div>
                    <div className="carousel-image-wrapper">
                      <WorkImage image={project.image} alt={project.title} fullPageImage={project.fullPageImage} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dot Indicators */}
          <div className="carousel-dots">
            {currentProjects.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === currentIndex ? "carousel-dot-active" : ""
                  }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to project ${index + 1}`}
                data-cursor="disable"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;
