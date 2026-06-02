import React, { useEffect, useRef } from 'react';
import { Star, Quote, BadgeCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Testimonial } from '../types';
import { OptimizedImage } from './OptimizedImage';
import { generateTestimonialSchema, addStructuredData, removeStructuredData } from '../utils/seo';

interface TestimonialsProps {
  testimonials: Testimonial[];
}

const TestimonialCard: React.FC<{ t: Testimonial }> = ({ t }) => (
  <div
    className="flex-shrink-0 w-[320px] mx-4 rounded-3xl p-7 flex flex-col"
    style={{
      background: '#FAF6F2',
      border: '1px solid #EDE5D8',
    }}
  >
    {/* Quote icon */}
    <Quote size={24} className="text-[#B38B59]/30 mb-5 fill-[#B38B59]/10" />

    {/* Stars */}
    <div className="flex items-center gap-0.5 mb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={13}
          className={
            i < t.rating ? 'fill-amber-400 text-amber-400' : 'fill-stone-200 text-stone-200'
          }
        />
      ))}
    </div>

    {/* Quote */}
    <blockquote className="text-stone-700 text-sm leading-relaxed flex-1 mb-6 italic">
      &ldquo;{t.quote}&rdquo;
    </blockquote>

    {/* Author */}
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full overflow-hidden bg-stone-200 ring-2 ring-[#B38B59]/20 shrink-0">
        <OptimizedImage
          src={
            t.image ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=42210B&color=B38B59&bold=true`
          }
          alt={t.name}
          className="w-full h-full object-cover"
          type="thumbnail"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-[#42210B] text-sm truncate">{t.name}</span>
          {t.verified && <BadgeCheck size={14} className="text-emerald-500 shrink-0" />}
        </div>
        {t.location && (
          <p className="text-[11px] text-stone-400 font-medium truncate">{t.location}</p>
        )}
        {t.productPurchased && (
          <p className="text-[10px] text-[#B38B59] font-bold uppercase tracking-wider mt-0.5 truncate">
            {t.productPurchased}
          </p>
        )}
      </div>
    </div>
  </div>
);

const Testimonials: React.FC<TestimonialsProps> = ({ testimonials }) => {
  const track1Ref = useRef<HTMLDivElement>(null);
  const track2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const schema = generateTestimonialSchema(testimonials);
    addStructuredData(schema, 'testimonial-schema');
    return () => removeStructuredData('testimonial-schema');
  }, [testimonials]);

  if (!testimonials.length) return null;

  // Split into two rows for staggered marquee
  const row1 = testimonials;
  const row2 = [...testimonials].reverse();

  return (
    <section className="bg-white py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-12 mb-16">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[#B38B59] font-black uppercase tracking-[0.3em] text-xs mb-3 block"
            >
              Customer Love
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              className="font-display text-4xl md:text-5xl font-bold text-[#42210B]"
            >
              What Our Customers
              <br />
              <span className="italic font-light text-[#B38B59]">Say About Us</span>
            </motion.h2>
          </div>

          {/* Aggregate rating */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="flex items-center gap-3 bg-[#FAF6F2] px-6 py-4 rounded-2xl border border-stone-100"
          >
            <div className="text-center">
              <div className="font-display text-3xl font-black text-[#42210B]">4.9</div>
              <div className="flex gap-0.5 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={10} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
            <div className="w-px h-full bg-stone-200 self-stretch" />
            <div>
              <div className="font-black text-[#42210B]">10,000+</div>
              <div className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">
                Verified Reviews
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Marquee row 1 — left scroll */}
      <div className="relative mb-6">
        <div
          className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, white 0%, transparent 100%)' }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(270deg, white 0%, transparent 100%)' }}
        />
        <div className="overflow-hidden">
          <div
            ref={track1Ref}
            className="flex py-2"
            style={{ animation: 'marquee-left 40s linear infinite', width: 'max-content' }}
          >
            {[...row1, ...row1].map((t, i) => (
              <TestimonialCard key={`r1-${i}`} t={t} />
            ))}
          </div>
        </div>
      </div>

      {/* Marquee row 2 — right scroll */}
      <div className="relative">
        <div
          className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, white 0%, transparent 100%)' }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(270deg, white 0%, transparent 100%)' }}
        />
        <div className="overflow-hidden">
          <div
            ref={track2Ref}
            className="flex py-2"
            style={{ animation: 'marquee-right 50s linear infinite', width: 'max-content' }}
          >
            {[...row2, ...row2].map((t, i) => (
              <TestimonialCard key={`r2-${i}`} t={t} />
            ))}
          </div>
        </div>
      </div>

      {/* Inline animation keyframes */}
      <style>{`
        @keyframes marquee-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
