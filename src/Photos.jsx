import React, { useEffect, useState, useRef } from "react";
import "./Photos.css";

const API_KEY = "SLkZZaTu5YfWkdeuNX_QBuP1GAELFIvmB7ycAII-8Xs";
const IMAGE_BATCH = 15;

const Photos = () => {
  const [gallery, setGallery] = useState([]);
  const [fetching, setFetching] = useState(false);
  const galleryContainer = useRef(null);

  const loadImages = async () => {
    setFetching(true);
    try {
      const response = await fetch(
        `https://api.unsplash.com/photos/random?count=${IMAGE_BATCH}&client_id=${API_KEY}`
      );
      const pictures = await response.json();
      setGallery((prevImages) => [...prevImages, ...pictures]);
    } catch (err) {
      console.error("Image loading error:", err);
      if (galleryContainer.current) {
        galleryContainer.current.innerText = "Error loading images.";
        galleryContainer.current.style.color = "crimson";
      }
    }
    setFetching(false);
  };

  useEffect(() => {
    loadImages();
    const infiniteScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 5 && !fetching) {
        loadImages();
      }
    };
    window.addEventListener("scroll", infiniteScroll);
    return () => window.removeEventListener("scroll", infiniteScroll);
  }, []);

  const jumpToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="stream-wrapper">
      <h1 className="stream-title">Photo Stream</h1>
      <div className="stream-grid" ref={galleryContainer}>
        {gallery.map((item) => (
          <a
            key={item.id}
            href={item.links.html}
            target="_blank"
            rel="noopener noreferrer"
            className="image-link"
          >
            <img
              src={item.urls.regular}
              alt={item.alt_description || "Gallery Image"}
            />
          </a>
        ))}
      </div>

      {fetching && (
        <div className="dots-loader">
          <span className="dot-piece"></span>
          <span className="dot-piece"></span>
          <span className="dot-piece"></span>
        </div>
      )}

      <button className="scroll-button" onClick={jumpToTop}>
        ⬆
      </button>
    </div>
  );
};

export default Photos;
