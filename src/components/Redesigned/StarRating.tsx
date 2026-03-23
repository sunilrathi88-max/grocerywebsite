import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  reviews?: number;
  size?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, reviews, size = 14 }) => {
  return (
    <div className="flex items-center gap-1.5 mt-1">
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={size}
            className={i < Math.floor(rating) 
              ? "fill-[#B38B59] text-[#B38B59]" 
              : "fill-[#E5E7EB] text-[#E5E7EB]"}
          />
        ))}
      </div>
      {reviews !== undefined && (
        <span className="text-xs text-stone-500 font-medium">({reviews})</span>
      )}
    </div>
  );
};

export default StarRating;
