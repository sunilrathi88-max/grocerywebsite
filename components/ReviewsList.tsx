import React, { useState, useMemo } from 'react';
import { Review } from '../types';
import { Button } from './Button';
import { StarIcon } from '@heroicons/react/24/solid';

interface ReviewsListProps {
  reviews: Review[];
  overallRating: number;
}

const ReviewsList: React.FC<ReviewsListProps> = ({ reviews, overallRating }) => {
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'helpful'>('newest');

  const filteredReviews = useMemo(() => {
    let result = reviews;
    if (filterRating !== 'all') {
      result = result.filter((r) => r.rating === filterRating);
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
    <div className="space-y-8">
      {/* Summary Section */}
      <div className="flex flex-col md:flex-row gap-8 items-start pb-8 border-b">
        <div className="text-center md:text-left min-w-[200px]">
          <div className="text-5xl font-bold text-gray-900 mb-2">{overallRating.toFixed(1)}</div>
          <div className="flex justify-center md:justify-start gap-1 text-yellow-400 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon
                key={i}
                className={`w-6 h-6 ${i < Math.round(overallRating) ? 'text-yellow-400' : 'text-gray-200'}`}
              />
            ))}
          </div>
          <p className="text-gray-500 font-medium">{reviews.length} Reviews</p>
        </div>

        <div className="flex-grow w-full max-w-sm">
          {[5, 4, 3, 2, 1].map((star) => (
            <button
              key={star}
              onClick={() => setFilterRating(filterRating === star ? 'all' : star)}
              className="flex items-center gap-3 w-full group mb-2 last:mb-0"
            >
              <span className="text-sm font-medium w-3 text-gray-600 group-hover:text-gray-900">
                {star}★
              </span>
              <div className="flex-grow h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 transition-all duration-300"
                  style={{
                    width: `${(ratingCounts[star as keyof typeof ratingCounts] / reviews.length) * 100}%`,
                  }}
                />
              </div>
              <span className="text-sm text-gray-400 min-w-[30px] text-right">
                {ratingCounts[star as keyof typeof ratingCounts]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Showing {filteredReviews.length} reviews
          {filterRating !== 'all' && (
            <button
              onClick={() => setFilterRating('all')}
              className="ml-2 text-brand-primary underline"
            >
              Clear Filter
            </button>
          )}
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'newest' | 'helpful')}
          className="text-sm border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary"
        >
          <option value="newest">Most Recent</option>
          <option value="helpful">Most Helpful</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg text-gray-500">
            No reviews match your filter.
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div key={review.id} className="border-b pb-6 last:border-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-bold text-gray-900 flex items-center gap-2">
                    {review.author}
                    {review.verifiedPurchase && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                        <span className="w-1 h-1 bg-green-500 rounded-full" /> Verified Buyer
                      </span>
                    )}
                  </div>
                  <div className="flex gap-0.5 text-yellow-400 text-sm my-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {review.date ? new Date(review.date).toLocaleDateString() : ''}
                </div>
              </div>

              <h4 className="font-bold text-sm text-gray-800 mb-2">Great Quality!</h4>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{review.comment}</p>

              {review.images && review.images.length > 0 && (
                <div className="flex gap-2 mb-4">
                  {review.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt="Review attachment"
                      className="w-16 h-16 object-cover rounded-lg border border-gray-100"
                    />
                  ))}
                </div>
              )}

              <div className="flex items-center gap-4 text-xs text-gray-400">
                <button className="hover:text-brand-primary transition-colors flex items-center gap-1">
                  Helpful ({review.helpful || 0})
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="text-center pt-4">
        <Button variant="outline">Load More Reviews</Button>
      </div>
    </div>
  );
};

export default ReviewsList;
