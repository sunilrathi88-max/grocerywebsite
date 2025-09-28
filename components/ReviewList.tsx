
import React from 'react';
import { Review } from '../types';
import { StarIcon } from './icons/StarIcon';
import { TrashIcon } from './icons/TrashIcon';

interface ReviewListProps {
  reviews: Review[];
  productId: number;
  onDelete: (productId: number, reviewId: number) => void;
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, productId, onDelete }) => {
  if (reviews.length === 0) {
    return <p className="text-gray-500 text-sm">No reviews yet. Be the first to share your thoughts!</p>;
  }

  return (
    <div className="space-y-6">
      {reviews.map(review => (
        <div key={review.id} className="border-b pb-4 last:border-0 last:pb-0">
          <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <p className="font-bold text-brand-dark mr-3">{review.author}</p>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <StarIcon key={index} className={`w-5 h-5 ${index < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
              </div>
              <button 
                onClick={() => onDelete(productId, review.id)} 
                className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-100 transition-colors"
                aria-label="Delete review"
              >
                  <TrashIcon />
              </button>
          </div>
          <p className="text-gray-700">{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
