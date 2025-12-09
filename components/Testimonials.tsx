import React, { useEffect } from 'react';
import Slider from 'react-slick';
import { StarIcon } from './icons/StarIcon';
import { Testimonial } from '../types';
import { generateTestimonialSchema, addStructuredData, removeStructuredData } from '../utils/seo';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

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
        </div>

        <div className="slider-container px-4">
          <Slider {...settings}>
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="px-4 py-4">
                <div className="bg-neutral-50 p-8 rounded-2xl border border-neutral-100 h-full min-h-[300px] flex flex-col items-center text-center relative hover:shadow-card-hover transition-shadow duration-300">
                  {/* Quote Icon */}
                  <div className="absolute top-4 left-6 text-6xl text-brand-primary/10 font-serif leading-none">
                    &ldquo;
                  </div>

                  <div className="flex gap-1 mb-6 text-warning-yellow">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <StarIcon
                        key={index}
                        className={`w-5 h-5 ${index < testimonial.rating ? 'fill-warning-yellow' : 'text-gray-200'}`}
                      />
                    ))}
                  </div>

                  <blockquote className="text-lg text-neutral-600 mb-8 italic flex-grow">
                    &quot;{testimonial.quote}&quot;
                  </blockquote>

                  <div className="mt-auto">
                    <div className="w-12 h-12 bg-neutral-200 rounded-full mx-auto mb-3 overflow-hidden">
                      <img
                        src={`https://ui-avatars.com/api/?name=${testimonial.name.replace(' ', '+')}&background=random`}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <cite className="not-italic font-bold text-neutral-900 block">
                      {testimonial.name}
                    </cite>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
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
