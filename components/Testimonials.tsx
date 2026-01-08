import React, { useEffect } from 'react';
import Slider from 'react-slick';
import { StarIcon } from './icons/StarIcon';
import { Testimonial } from '../types';
import { generateTestimonialSchema, addStructuredData, removeStructuredData } from '../utils/seo';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { OptimizedImage } from './OptimizedImage';

interface TestimonialsProps {
  testimonials: Testimonial[];
}

const Testimonials: React.FC<TestimonialsProps> = ({ testimonials }) => {
  useEffect(() => {
    const schema = generateTestimonialSchema(testimonials);
    addStructuredData(schema, 'testimonial-schema');

    return () => {
      removeStructuredData('testimonial-schema');
    };
  }, [testimonials]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section className="bg-white py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-16">
        <div className="text-center mb-16 space-y-4">
          <span className="text-brand-primary font-bold tracking-wider uppercase text-sm">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-neutral-900">
            What Our Customers Say
          </h2>

          {/* Stats Block */}
          <div className="flex justify-center items-center gap-8 mt-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-brand-dark">4.8/5</p>
              <div className="flex text-yellow-400 text-sm justify-center mt-1">★★★★★</div>
              <p className="text-sm text-gray-500">Average Rating</p>
            </div>
            <div className="h-12 w-px bg-gray-200"></div>
            <div className="text-center">
              <p className="text-3xl font-bold text-brand-dark">1200+</p>
              <p className="text-sm text-gray-500 mt-1">Verified Reviews</p>
            </div>
          </div>
        </div>

        <div className="slider-container px-4">
          <Slider {...settings}>
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="px-4 py-4">
                <div className="bg-neutral-50 p-8 rounded-2xl border border-neutral-100 h-full min-h-[320px] flex flex-col items-center text-center relative hover:shadow-card-hover transition-shadow duration-300">
                  {/* Quote Icon */}
                  <div className="absolute top-4 left-6 text-6xl text-brand-primary/10 font-serif leading-none">
                    &ldquo;
                  </div>

                  {/* Verified Badge */}
                  {testimonial.verified && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Verified
                    </div>
                  )}

                  <div className="flex gap-1 mb-4 text-warning-yellow">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <StarIcon
                        key={index}
                        className={`w-5 h-5 ${index < testimonial.rating ? 'fill-warning-yellow' : 'text-gray-200'}`}
                      />
                    ))}
                  </div>

                  <blockquote className="text-base text-neutral-600 mb-6 italic flex-grow leading-relaxed">
                    &quot;{testimonial.quote}&quot;
                  </blockquote>

                  <div className="mt-auto">
                    <div className="w-14 h-14 bg-neutral-200 rounded-full mx-auto mb-3 overflow-hidden ring-2 ring-brand-primary/20">
                      <OptimizedImage
                        src={
                          testimonial.image ||
                          `https://ui-avatars.com/api/?name=${testimonial.name.replace(' ', '+')}&background=random`
                        }
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                        type="thumbnail"
                      />
                    </div>
                    <cite className="not-italic font-bold text-neutral-900 block">
                      {testimonial.name}
                    </cite>
                    {testimonial.location && (
                      <p className="text-sm text-neutral-500">{testimonial.location}</p>
                    )}
                    {testimonial.productPurchased && (
                      <p className="text-xs text-brand-primary mt-1 font-medium">
                        Bought: {testimonial.productPurchased}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>

        <div className="text-center mt-12">
          <button className="text-brand-primary font-bold border-b-2 border-brand-primary hover:text-brand-dark hover:border-brand-dark transition-all">
            Read All Reviews
          </button>
        </div>
      </div>
      <style>{`
        .slick-dots li button:before {
          font-size: 12px;
          color: #CBD5E1;
          opacity: 1;
        }
        .slick-dots li.slick-active button:before {
          color: #8B5CF6;
        }
        .slick-track {
          display: flex !important;
        }
        .slick-slide {
          height: inherit !important;
        }
        .slick-slide > div {
          height: 100%;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
