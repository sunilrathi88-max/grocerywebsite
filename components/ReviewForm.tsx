import React, { useState } from 'react';
import { ToastMessage } from '../types';
import StarRating from './StarRating';

interface ReviewFormProps {
  onSubmit: (review: { author: string; rating: number; comment: string; }) => void;
  addToast: (message: string, type: ToastMessage['type'], icon?: React.ReactNode) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, addToast }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [author, setAuthor] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0 && comment.trim() && author.trim()) {
      onSubmit({ author, rating, comment });
      // Reset form
      setRating(0);
      setComment('');
      setAuthor('');
    } else {
        addToast('Please fill out all fields and provide a rating.', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
            <input
                type="text"
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all"
                placeholder="Enter your name"
                required
            />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
            <StarRating 
              rating={rating} 
              size="lg" 
              interactive 
              onRate={setRating}
            />
            {rating > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                You rated this {rating} star{rating !== 1 ? 's' : ''}
              </p>
            )}
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