import React from 'react';
import { Review } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import StarRating from './StarRating';
import VerifiedBadge from './VerifiedBadge';

interface ReviewListProps {
  reviews: Review[];
  productId: number;
  onDelete: (productId: number, reviewId: number) => void;
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, productId, onDelete }) => {
  if (reviews.length === 0) {
    return (
      <p className="text-gray-500 text-sm">No reviews yet. Be the first to share your thoughts!</p>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="border-b pb-4 last:border-0 last:pb-0 hover:bg-gray-50 p-3 rounded-lg transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <p className="font-bold text-brand-dark">{review.author}</p>
              {review.verifiedPurchase && <VerifiedBadge size="sm" />}
            </div>
            <button
              onClick={() => onDelete(productId, review.id)}
              className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-100 transition-colors"
              aria-label="Delete review"
            >
              <TrashIcon />
            </button>
          </div>
          <div className="mb-2">
            <StarRating rating={review.rating} size="sm" />
          </div>
          <p className="text-gray-700 leading-relaxed">{review.comment}</p>
          <p className="text-xs text-gray-400 mt-2">
            {new Date(review.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
