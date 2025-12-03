import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { imageErrorHandlers } from '../utils/imageHelpers';

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  image: string;
  gradient: string;
}

const Hero: React.FC = () => {
  const slides: HeroSlide[] = [
    {
      id: 1,
      title: 'The Essence of India',
      subtitle: 'Premium Organic Spices',
      description:
        'Experience authentic flavors from the Himalayan valleys to the Malabar coast. Hand-picked, ethically sourced.',
      buttonText: 'Explore Collection',
      image: '/images/hero/slide-essence.svg',
      gradient: 'from-amber-600/90 via-orange-700/90 to-red-800/90',
    },
    {
      id: 2,
      title: 'Himalayan Saffron',
      subtitle: "World's Finest Grade A",
      description:
        'Pure Kashmiri Mongra saffron. Hand-harvested at dawn for maximum potency and aroma.',
      buttonText: 'Shop Saffron',
      image: '/images/hero/slide-saffron.svg',
      gradient: 'from-purple-600/90 via-pink-700/90 to-red-700/90',
    },
    {
      id: 3,
      title: 'Artisan Collections',
      subtitle: 'Rare Indian Ingredients',
      description:
        'Discover heritage spices and ingredients passed down through generations of Indian artisans.',
      buttonText: 'Browse Recipes',
      image: '/images/hero/slide-spices.svg',
      gradient: 'from-green-600/90 via-teal-700/90 to-cyan-800/90',
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    pauseOnHover: true,
    cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)',
    arrows: true,
  };

  const scrollToProducts = () => {
    const element = document.getElementById('products-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="hero-section relative overflow-hidden bg-gray-900 h-[600px]">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={slide.id}>
            <div className="relative h-[500px] md:h-[600px] lg:h-[650px]">
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  onError={imageErrorHandlers.hero}
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`}></div>
              </div>

              {/* Content */}
              <div className="relative h-full flex items-center">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="max-w-3xl text-white animate-slide-up">
                    {/* Subtitle */}
                    <div className="inline-block mb-4 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                      <p className="text-sm md:text-base font-semibold tracking-wide uppercase">
                        {slide.subtitle}
                      </p>
                    </div>

                    {/* Title */}
                    <h1
                      className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight drop-shadow-2xl"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {slide.title}
                    </h1>

                    {/* Description */}
                    <p className="text-lg md:text-xl lg:text-2xl mb-8 leading-relaxed drop-shadow-lg text-white/95 max-w-2xl">
                      {slide.description}
                    </p>

                    {/* CTA Button */}
                    <button
                      onClick={scrollToProducts}
                      className="group relative inline-flex items-center gap-2 bg-white text-gray-900 font-bold text-base md:text-lg py-4 px-8 md:px-10 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 ease-out overflow-hidden"
                    >
                      <span className="relative z-10">{slide.buttonText}</span>
                      <svg
                        className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      <div className="absolute inset-0 bg-gradient-to-r from-brand-primary to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
            </div>
          </div>
        ))}
      </Slider>

      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }

        /* Slider Navigation Arrows */
        .slick-prev,
        .slick-next {
          z-index: 10;
          width: 50px;
          height: 50px;
        }
        
        .slick-prev {
          left: 25px;
        }
        
        .slick-next {
          right: 25px;
        }
        
        .slick-prev:before,
        .slick-next:before {
          font-size: 50px;
          opacity: 0.7;
          text-shadow: 0 2px 10px rgba(0,0,0,0.5);
        }
        
        .slick-prev:hover:before,
        .slick-next:hover:before {
          opacity: 1;
        }

        /* Slider Dots */
        .slick-dots {
          bottom: 30px;
        }
        
        .slick-dots li {
          margin: 0 5px;
        }
        
        .slick-dots li button:before {
          font-size: 12px;
          color: white;
          opacity: 0.5;
          text-shadow: 0 2px 5px rgba(0,0,0,0.5);
        }
        
        .slick-dots li.slick-active button:before {
          opacity: 1;
          color: white;
        }

        /* Mobile Adjustments */
        @media (max-width: 640px) {
          .slick-prev,
          .slick-next {
            width: 40px;
            height: 40px;
          }
          
          .slick-prev {
            left: 10px;
          }
          
          .slick-next {
            right: 10px;
          }
          
          .slick-prev:before,
          .slick-next:before {
            font-size: 40px;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
