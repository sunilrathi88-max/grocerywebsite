import React, { useState, useMemo } from 'react';
import { Review } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import StarRating from './StarRating';
import VerifiedBadge from './VerifiedBadge';
import { OptimizedImage } from './OptimizedImage';
import { imageErrorHandlers } from '../utils/imageHelpers';

interface ReviewListProps {
  reviews: Review[];
  productId: number;
  onDelete: (productId: number, reviewId: number) => void;
}

type SortOption = 'newest' | 'highest' | 'lowest';
type FilterOption = 'all' | '5' | '4' | '3' | '2' | '1' | 'with_photos';

const ReviewList: React.FC<ReviewListProps> = ({ reviews, productId, onDelete }) => {
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [visibleCount, setVisibleCount] = useState(5);
  const [helpfulVotes, setHelpfulVotes] = useState<Record<number, number>>({});

  const handleHelpful = (reviewId: number) => {
    setHelpfulVotes(prev => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + 1
    }));
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 5);
  };

  const filteredAndSortedReviews = useMemo(() => {
    let result = [...reviews];

    // Filter
    if (filterBy !== 'all') {
      if (filterBy === 'with_photos') {
        result = result.filter((r) => r.images && r.images.length > 0);
      } else {
        const rating = parseInt(filterBy);
        result = result.filter((r) => Math.round(r.rating) === rating);
      }
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        default:
          return 0;
      }
    });

    return result;
  }, [reviews, sortBy, filterBy]);

  if (reviews.length === 0) {
    return (
      <p className="text-gray-500 text-sm italic">
        No reviews yet. Be the first to share your thoughts!
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="text-sm border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary"
          >
            <option value="newest">Newest First</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Filter:</span>
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value as FilterOption)}
            className="text-sm border-gray-300 rounded-md focus:ring-brand-primary focus:border-brand-primary"
          >
            <option value="all">All Reviews</option>
            <option value="with_photos">With Photos</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {filteredAndSortedReviews.length > 0 ? (
          <>
            {filteredAndSortedReviews.slice(0, visibleCount).map((review) => (
              <div
                key={review.id}
                className="border-b pb-6 last:border-0 last:pb-0 bg-white p-4 rounded-lg hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-brand-dark">{review.author}</p>
                      {review.verifiedPurchase && <VerifiedBadge size="sm" />}
                    </div>
                    <div className="flex items-center gap-2">
                      <StarRating rating={review.rating} size="sm" />
                      <span className="text-xs text-gray-400">
                        {review.date
                          ? new Date(review.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                          : 'Unknown Date'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => onDelete(productId, review.id)}
                    className="p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    aria-label="Delete review"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>

                <p className="text-gray-700 leading-relaxed mt-3">{review.comment}</p>

                {/* Review Images */}
                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                    {review.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200"
                      >
                        <OptimizedImage
                          src={img}
                          alt={`Review image ${idx + 1}`}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          type="thumbnail"
                          width={80}
                          height={80}
                          onError={imageErrorHandlers.thumb}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Helpful Count */}
                <div className="mt-3 flex items-center gap-4">
                  <button
                    onClick={() => handleHelpful(review.id)}
                    className="text-xs text-gray-500 hover:text-brand-primary flex items-center gap-1 transition-colors"
                  >
                    <span>👍 Helpful ({review.helpful ? review.helpful + (helpfulVotes[review.id] || 0) : (helpfulVotes[review.id] || 0)})</span>
                  </button>
                </div>
              </div>
            ))}

            {visibleCount < filteredAndSortedReviews.length && (
              <div className="text-center pt-4">
                <button
                  onClick={handleLoadMore}
                  className="px-6 py-2 border border-brand-primary text-brand-primary font-bold rounded-full hover:bg-brand-primary hover:text-white transition-all"
                >
                  Load More Reviews
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No reviews match your selected filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewList;
