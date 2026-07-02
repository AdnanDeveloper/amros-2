import { useState } from "react";
import "./styles/GoogleReviewBadge.css";

// Update these by hand whenever you check your Google Business Profile —
// this listing is a service-area business with no public address, so it
// isn't reachable through Google's Places API.
const RATING = 4.7;
const TOTAL_REVIEWS = 3;
const REVIEW_URL = "https://g.page/r/CWrLrhSlKBR1EAI/review";

/** Returns "full" | "half" | "empty" for star index 0-4 given a 0-5 rating. */
const starFill = (rating: number, index: number) => {
  const diff = rating - index;
  if (diff >= 1) return "full";
  if (diff >= 0.5) return "half";
  return "empty";
};

const GoogleReviewBadge = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const rating = RATING;
  const totalReviews: number | null = TOTAL_REVIEWS;

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  const handleReviewClick = () => {
    window.open(REVIEW_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className={`google-review-badge ${isExpanded ? "expanded" : ""}`}
      data-cursor="disable"
    >
      {/* Collapsed: small floating pill */}
      <button
        className="grb-toggle"
        onClick={toggleExpand}
        aria-label="Toggle Google Reviews"
      >
        <svg
          className="grb-google-icon"
          viewBox="0 0 24 24"
          width="18"
          height="18"
        >
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        <span className="grb-toggle-rating">{rating.toFixed(1)}</span>
        <span className="grb-toggle-stars">★★★★★</span>
      </button>

      {/* Expanded: full review card */}
      <div className="grb-card">
        <button
          className="grb-close"
          onClick={toggleExpand}
          aria-label="Close review badge"
        >
          ✕
        </button>

        {/* Rating Row */}
        <div className="grb-rating-row">
          <span className="grb-score">{rating.toFixed(1)}</span>
          <div className="grb-stars">
            {[0, 1, 2, 3, 4].map((i) => {
              const fill = starFill(rating, i);
              if (fill === "full") {
                return (
                  <svg key={i} className="grb-star grb-star-full" viewBox="0 0 24 24" width="22" height="22">
                    <path
                      d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"
                      fill="#F5A623"
                    />
                  </svg>
                );
              }
              if (fill === "half") {
                return (
                  <svg key={i} className="grb-star grb-star-half" viewBox="0 0 24 24" width="22" height="22">
                    <defs>
                      <linearGradient id={`halfStarGrad-${i}`}>
                        <stop offset="60%" stopColor="#F5A623" />
                        <stop offset="60%" stopColor="#D8D8D8" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"
                      fill={`url(#halfStarGrad-${i})`}
                    />
                  </svg>
                );
              }
              return (
                <svg key={i} className="grb-star grb-star-empty" viewBox="0 0 24 24" width="22" height="22">
                  <path
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"
                    fill="#D8D8D8"
                  />
                </svg>
              );
            })}
          </div>
        </div>

        {totalReviews !== null && (
          <div className="grb-total">{totalReviews.toLocaleString()} reviews</div>
        )}

        {/* Powered by Google */}
        <div className="grb-powered">
          powered by{" "}
          <span className="grb-google-text">
            <span style={{ color: "#4285F4" }}>G</span>
            <span style={{ color: "#EA4335" }}>o</span>
            <span style={{ color: "#FBBC05" }}>o</span>
            <span style={{ color: "#4285F4" }}>g</span>
            <span style={{ color: "#34A853" }}>l</span>
            <span style={{ color: "#EA4335" }}>e</span>
          </span>
        </div>

        {/* Review CTA Button */}
        <button className="grb-review-btn" onClick={handleReviewClick}>
          review us on
          <svg
            className="grb-btn-google-icon"
            viewBox="0 0 24 24"
            width="16"
            height="16"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default GoogleReviewBadge;
