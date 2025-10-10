import React, { useState } from 'react';
import { StarIcon } from './icons/StarIcon';
import { ToastMessage } from '../types';

interface ReviewFormProps {
  onSubmit: (review: { author: string; rating: number; comment: string; }) => void;
  addToast: (message: string, type: ToastMessage['type'], icon?: React.ReactNode) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, addToast }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [author, setAuthor] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0 && comment.trim() && author.trim()) {
      onSubmit({ author, rating, comment });
      // Reset form
      setRating(0);
      setComment('');
      setAuthor('');
      setHoverRating(0);
    } else {
        addToast('Please fill out all fields and provide a rating.', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700">Your Name</label>
            <input
                type="text"
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                required
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Rating</label>
            <div className="flex items-center mt-1">
                {[1, 2, 3, 4, 5].map(star => (
                    <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="text-gray-300"
                        aria-label={`Rate ${star} stars`}
                    >
                        <StarIcon className={`w-7 h-7 transition-colors ${(hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-300'}`} />
                    </button>
                ))}
            </div>
        </div>
        <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Comment</label>
            <textarea
                id="comment"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                required
            />
        </div>
        <button 
            type="submit"
            className="w-full bg-brand-dark text-white font-bold py-2 px-4 rounded-full shadow-md hover:bg-opacity-90 transform hover:scale-105 transition-all duration-300"
        >
            Submit Review
        </button>
    </form>
  );
};

export default ReviewForm;