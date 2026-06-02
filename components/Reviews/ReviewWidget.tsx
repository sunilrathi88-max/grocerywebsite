import React, { useState, useMemo } from 'react';
import { Review } from '../../types';
import { OptimizedImage } from '../OptimizedImage';
import { imageErrorHandlers } from '../../utils/imageHelpers';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, CheckCircle, ThumbsUp, Flag, ChevronDown, BarChart2 } from 'lucide-react';

interface ReviewWidgetProps {
  reviews: Review[];
  overallRating: number;
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Most Recent' },
  { value: 'helpful', label: 'Most Helpful' },
];

export const ReviewWidget: React.FC<ReviewWidgetProps> = ({ reviews, overallRating }) => {
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'helpful'>('newest');
  const [isSortOpen, setIsSortOpen] = useState(false);

  const filteredReviews = useMemo(() => {
    let result = reviews;
    if (filterRating !== 'all') {
      result = result.filter((r) => Math.round(r.rating) === filterRating);
    }
    return result.sort((a, b) => {
      if (sortBy === 'newest')
        return new Date(b.date || '').getTime() - new Date(a.date || '').getTime();
      return (b.helpful || 0) - (a.helpful || 0);
    });
  }, [reviews, filterRating, sortBy]);

  const ratingCounts = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const rate = Math.round(r.rating) as keyof typeof counts;
      if (counts[rate] !== undefined) counts[rate]++;
    });
    return counts;
  }, [reviews]);

  const renderStars = (rating: number, size = 14) =>
    Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={size}
        className={
          i < Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-stone-200 fill-stone-200'
        }
      />
    ));

  return (
    <div className="space-y-10">
      {/* ─── Summary ─── */}
      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-10 pb-10 border-b border-stone-100">
        {/* Score bubble */}
        <div className="flex flex-col items-center justify-center bg-[#42210B] text-white rounded-3xl p-8 min-w-[160px]">
          <div className="font-display text-6xl font-black leading-none mb-2">
            {overallRating.toFixed(1)}
          </div>
          <div className="flex gap-0.5 mb-3">{renderStars(overallRating, 16)}</div>
          <div className="text-[11px] font-bold uppercase tracking-widest text-stone-400">
            {reviews.length} Reviews
          </div>
        </div>

        {/* Rating bars */}
        <div className="flex flex-col justify-center space-y-2.5">
          <div className="flex items-center gap-2 mb-1">
            <BarChart2 size={14} className="text-[#B38B59]" />
            <span className="text-[11px] font-black uppercase tracking-widest text-[#B38B59]">
              Rating Breakdown
            </span>
          </div>
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingCounts[star as keyof typeof ratingCounts];
            const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            const isActive = filterRating === star;
            return (
              <button
                key={star}
                onClick={() => setFilterRating(isActive ? 'all' : star)}
                className="flex items-center gap-3 w-full group transition-all py-1 px-2 rounded-xl hover:bg-stone-50"
                style={{ outline: isActive ? '2px solid #B38B59' : 'none', outlineOffset: '0px' }}
              >
                <span className="text-sm font-black text-stone-600 w-3">{star}</span>
                <Star size={12} className="fill-amber-400 text-amber-400 shrink-0" />
                <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #B38B59, #8C6D45)' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
                <span className="text-[11px] font-bold text-stone-400 w-6 text-right tabular-nums">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Controls ─── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-sm text-stone-500 font-medium">
          Showing <span className="font-black text-[#42210B]">{filteredReviews.length}</span>{' '}
          {filteredReviews.length === 1 ? 'review' : 'reviews'}
          {filterRating !== 'all' && (
            <button
              onClick={() => setFilterRating('all')}
              className="ml-2 text-[#B38B59] font-bold hover:text-[#42210B] transition-colors text-xs uppercase tracking-widest border-b border-[#B38B59]/40"
            >
              Clear
            </button>
          )}
        </p>

        {/* Custom sort */}
        <div className="relative">
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-stone-200 text-[11px] font-bold uppercase tracking-widest text-stone-600 hover:border-[#B38B59] transition-all"
          >
            Sort: {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
            <ChevronDown
              size={12}
              className={`transition-transform ${isSortOpen ? 'rotate-180' : ''}`}
            />
          </button>
          <AnimatePresence>
            {isSortOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-stone-100 overflow-hidden z-20"
              >
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setSortBy(opt.value as 'newest' | 'helpful');
                      setIsSortOpen(false);
                    }}
                    className="w-full text-left px-5 py-3 text-[12px] font-bold uppercase tracking-widest transition-colors"
                    style={{
                      color: sortBy === opt.value ? '#B38B59' : '#57534e',
                      background: sortBy === opt.value ? '#FDF8F3' : 'transparent',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ─── Reviews List ─── */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredReviews.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-stone-50 rounded-3xl border-2 border-dashed border-stone-200"
            >
              <Star size={32} className="text-stone-200 mx-auto mb-4" />
              <p className="font-bold text-stone-500">No reviews match this filter.</p>
              <button
                onClick={() => setFilterRating('all')}
                className="mt-3 text-[#B38B59] text-sm font-bold border-b border-[#B38B59]/40"
              >
                View all reviews
              </button>
            </motion.div>
          ) : (
            filteredReviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.35 }}
                className="group bg-white rounded-3xl border border-stone-100 p-7 hover:border-stone-200 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-bold text-[#42210B]">{review.author}</span>
                      {review.verifiedPurchase && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                          <CheckCircle size={10} />
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="flex gap-0.5">{renderStars(review.rating, 13)}</div>
                  </div>
                  {review.date && (
                    <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest shrink-0">
                      {new Date(review.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  )}
                </div>

                {review.title && <h4 className="font-bold text-[#42210B] mb-2">{review.title}</h4>}
                <p className="text-stone-600 text-sm leading-relaxed mb-5">{review.comment}</p>

                {/* Review images */}
                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2 mb-5 flex-wrap">
                    {review.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="w-16 h-16 rounded-xl overflow-hidden border border-stone-100 shadow-sm cursor-zoom-in hover:scale-105 transition-transform"
                      >
                        <OptimizedImage
                          src={img}
                          alt={`Review image ${idx + 1}`}
                          className="w-full h-full object-cover"
                          type="thumbnail"
                          width={64}
                          height={64}
                          onError={imageErrorHandlers.thumb}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Helpful / Report */}
                <div className="flex items-center gap-4 pt-4 border-t border-stone-50">
                  <button className="flex items-center gap-1.5 text-[11px] font-bold text-stone-400 uppercase tracking-widest hover:text-[#B38B59] transition-colors group/btn">
                    <ThumbsUp
                      size={12}
                      className="group-hover/btn:scale-110 transition-transform"
                    />
                    Helpful ({review.helpful || 0})
                  </button>
                  <button className="flex items-center gap-1.5 text-[11px] font-bold text-stone-300 uppercase tracking-widest hover:text-stone-500 transition-colors">
                    <Flag size={11} />
                    Report
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Load more */}
      {filteredReviews.length > 0 && (
        <div className="text-center pt-4">
          <button
            onClick={() => alert('Load more reviews')}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl border-2 border-stone-200 text-[12px] font-black uppercase tracking-widest text-stone-500 hover:border-[#B38B59] hover:text-[#B38B59] transition-all"
          >
            Load More Reviews
          </button>
        </div>
      )}
    </div>
  );
};
