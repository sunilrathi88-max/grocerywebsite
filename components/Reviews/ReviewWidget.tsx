import React, { useState, useMemo } from 'react';
import { Review } from '../../types';
import { Button } from '../Button';
import { StarIcon } from '../icons/StarIcon';
import { OptimizedImage } from '../OptimizedImage';
import { imageErrorHandlers } from '../../utils/imageHelpers';
import { CheckBadgeIcon } from '../icons/CheckBadgeIcon';

interface ReviewWidgetProps {
  reviews: Review[];
  overallRating: number;
}

export const ReviewWidget: React.FC<ReviewWidgetProps> = ({ reviews, overallRating }) => {
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'helpful'>('newest');

  const filteredReviews = useMemo(() => {
    let result = reviews;
    if (filterRating !== 'all') {
      result = result.filter((r) => Math.round(r.rating) === filterRating);
    }
    return result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.date || '').getTime() - new Date(a.date || '').getTime();
      }
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

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Summary Section */}
      <div className="flex flex-col md:flex-row gap-8 items-start pb-8 border-b border-gray-100">
        <div className="text-center md:text-left min-w-[200px]">
          <div className="text-5xl font-bold text-gray-900 mb-2 font-serif">
            {overallRating.toFixed(1)}
          </div>
          <div className="flex justify-center md:justify-start gap-1 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon
                key={i}
                className={`w-6 h-6 ${i < Math.round(overallRating) ? 'text-yellow-400' : 'text-gray-200'}`}
              />
            ))}
          </div>
          <p className="text-gray-500 font-medium">{reviews.length} Verified Reviews</p>
        </div>

        <div className="flex-grow w-full max-w-sm">
          {[5, 4, 3, 2, 1].map((star) => (
            <button
              key={star}
              onClick={() => setFilterRating(filterRating === star ? 'all' : star)}
              className="flex items-center gap-3 w-full group mb-2 last:mb-0 hover:bg-gray-50 p-1 rounded transition-colors"
            >
              <span className="text-sm font-medium w-3 text-gray-600 group-hover:text-gray-900">
                {star}
              </span>
              <StarIcon className="w-4 h-4 text-gray-400" />
              <div className="flex-grow h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-primary/80 group-hover:bg-brand-primary transition-all duration-500 ease-out"
                  style={{
                    width: `${reviews.length > 0 ? (ratingCounts[star as keyof typeof ratingCounts] / reviews.length) * 100 : 0}%`,
                  }}
                />
              </div>
              <span className="text-sm text-gray-400 min-w-[30px] text-right font-mono">
                {ratingCounts[star as keyof typeof ratingCounts]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50 p-4 rounded-lg">
        <div className="text-sm text-gray-600 font-medium">
          Showing {filteredReviews.length} reviews
          {filterRating !== 'all' && (
            <button
              onClick={() => setFilterRating('all')}
              className="ml-2 text-brand-primary hover:text-brand-dark underline decoration-dotted underline-offset-2"
            >
              Clear Filter
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'helpful')}
            className="text-sm border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary bg-white py-1.5 pl-3 pr-8"
          >
            <option value="newest">Most Recent</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg text-gray-500 border border-dashed border-gray-300">
            <p className="font-medium">No reviews match your filter.</p>
            <button
              onClick={() => setFilterRating('all')}
              className="mt-2 text-brand-primary text-sm hover:underline"
            >
              View all reviews
            </button>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div
              key={review.id}
              className="border-b border-gray-100 pb-8 last:border-0 hover:bg-gray-50/50 p-4 rounded-xl transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-bold text-gray-900 flex items-center gap-2">
                    {review.author}
                    {review.verifiedPurchase && (
                      <span className="text-[10px] uppercase tracking-wider bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border border-green-200">
                        <CheckBadgeIcon className="w-3 h-3" /> Verified Buyer
                      </span>
                    )}
                  </div>
                  <div className="flex gap-0.5 text-yellow-400 text-sm my-1.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-xs text-gray-500 font-medium">
                  {review.date
                    ? new Date(review.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : ''}
                </div>
              </div>

              {review.title && (
                <h4 className="font-bold text-sm text-gray-900 mb-2">{review.title}</h4>
              )}
              <p className="text-gray-700 text-sm leading-relaxed mb-4">{review.comment}</p>

              {review.images && review.images.length > 0 && (
                <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
                  {review.images.map((img, i) => (
                    <div
                      key={i}
                      className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 shadow-sm group cursor-zoom-in"
                    >
                      <OptimizedImage
                        src={img}
                        alt={`Review attachment ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        type="thumbnail"
                        width={80}
                        height={80}
                        onError={imageErrorHandlers.thumb}
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-4 text-xs text-gray-400">
                <button className="hover:text-brand-primary transition-colors flex items-center gap-1 group">
                  <span className="group-hover:scale-110 transition-transform">👍</span> Helpful (
                  {review.helpful || 0})
                </button>
                <button className="hover:text-gray-600 transition-colors">Report</button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="text-center pt-4">
        <Button variant="outline" onClick={() => alert('Load more reviews functionality')}>
          Load More Reviews
        </Button>
      </div>
    </div>
  );
};
