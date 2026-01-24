import React, { useState, useEffect } from 'react';
import OptimizedImage from './OptimizedImage';
import '../src/styles/hero-carousel.css';

const HeroCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 3;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(timer);
  }, [totalSlides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="hero-carousel-section">
      <div className="carousel-container">
        {/* Slide 1: Original Masalas */}
        <div className={`hero-slide ${currentSlide === 0 ? 'active' : ''}`} data-slide="1">
          <div className="slide-content">
            {/* Left Content */}
            <div className="slide-text">
              <h1 className="main-heading">
                Original Masalas,
                <br />
                Delivered With A Story
              </h1>
              <p className="slide-description">
                Handpicked, freshly ground blends from Rathi Naturals.
              </p>
              <button className="cta-button">Explore Daily Masalas</button>

              {/* Decorative spice illustrations */}
              <div className="spice-decorations">
                <img src="/images/star-anise.svg" alt="" className="deco-1" />
                <img src="/images/chili.svg" alt="" className="deco-2" />
                <img src="/images/cinnamon.svg" alt="" className="deco-3" />
              </div>
            </div>

            {/* Right Product Image */}
            <div className="slide-image">
              <OptimizedImage
                src="/images/masala-trio-chai-chilli-garam.png"
                alt="Chai Masala, Red Chilli Powder, Garam Masala"
                className="product-image object-contain"
                type="hero"
                priority="high"
                width={600}
                height={600}
              />
            </div>
          </div>

          {/* Background */}
          <div className="slide-background bg-beige-pattern"></div>
        </div>

        {/* Slide 2: Brighten Every Dish */}
        <div className={`hero-slide ${currentSlide === 1 ? 'active' : ''}`} data-slide="2">
          <div className="slide-content">
            {/* Left Content */}
            <div className="slide-text">
              <h1 className="main-heading">
                Brighten Every Dish
                <br />
                With Pure Spices
              </h1>
              <p className="slide-description">
                Bulk packs for serious home cooks and small businesses.
              </p>
              <button className="cta-button cta-yellow">Shop Haldi Mirch Dhaniya</button>
            </div>

            {/* Right Product Image */}
            <div className="slide-image">
              <OptimizedImage
                src="/images/spice-trio-coriander-chilli-turmeric.png"
                alt="Coriander Powder, Red Chilli Powder, Turmeric Powder"
                className="product-image object-contain"
                type="hero"
                priority="low"
                width={600}
                height={600}
              />
            </div>
          </div>

          {/* Background */}
          <div className="slide-background bg-cream"></div>
        </div>

        {/* Slide 3: Bring Authentic Masalas Home */}
        <div className={`hero-slide ${currentSlide === 2 ? 'active' : ''}`} data-slide="3">
          <div className="slide-content">
            {/* Left Content */}
            <div className="slide-text">
              <h1 className="main-heading">
                Fresh Spices,
                <br />
                Delivered Daily
              </h1>
              <p className="slide-description">Explore our complete range of premium masalas.</p>
              <button className="cta-button cta-yellow">Shop Masala Combos</button>
            </div>

            {/* Right Product Range Image */}
            <div className="slide-image full-range">
              <OptimizedImage
                src="/images/full-product-range.png"
                alt="Complete Rathi Naturals Spice Collection"
                className="product-image object-contain"
                type="hero"
                priority="low"
                width={800}
                height={600}
              />
            </div>
          </div>

          {/* Background */}
          <div className="slide-background bg-light-gray"></div>
        </div>

        {/* Carousel Controls */}
        <div className="carousel-controls">
          {/* Navigation Arrows */}
          <button
            className="carousel-arrow prev-arrow"
            aria-label="Previous slide"
            onClick={prevSlide}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <button className="carousel-arrow next-arrow" aria-label="Next slide" onClick={nextSlide}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 6L15 12L9 18"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {/* Pagination Dots */}
          <div className="carousel-pagination">
            <button
              className={`dot ${currentSlide === 0 ? 'active' : ''}`}
              onClick={() => goToSlide(0)}
              aria-label="Go to slide 1"
            ></button>
            <button
              className={`dot ${currentSlide === 1 ? 'active' : ''}`}
              onClick={() => goToSlide(1)}
              aria-label="Go to slide 2"
            ></button>
            <button
              className={`dot ${currentSlide === 2 ? 'active' : ''}`}
              onClick={() => goToSlide(2)}
              aria-label="Go to slide 3"
            ></button>
          </div>
        </div>

        {/* Progress Bar - Reset animation on slide change */}
        <div className="carousel-progress">
          <div key={currentSlide} className="progress-bar"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;
