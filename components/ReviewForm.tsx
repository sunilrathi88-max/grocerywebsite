import React, { useState, useRef } from 'react';
import { ToastMessage } from '../types';
import StarRating from './StarRating';

import { XIcon } from './icons/XIcon';

interface ReviewFormProps {
  onSubmit: (review: { author: string; rating: number; comment: string; images: string[] }) => void;
  addToast: (message: string, type: ToastMessage['type'], icon?: React.ReactNode) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, addToast }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [author, setAuthor] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      if (images.length + files.length > 3) {
        addToast('You can only upload up to 3 images.', 'error');
        return;
      }

      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0 && comment.trim() && author.trim()) {
      onSubmit({ author, rating, comment, images });
      // Reset form
      setRating(0);
      setComment('');
      setAuthor('');
      setImages([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } else {
      addToast('Please fill out all fields and provide a rating.', 'error');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200"
    >
      <div>
        <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
          Your Name
        </label>
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
        <StarRating rating={rating} size="lg" interactive onRate={setRating} />
        {rating > 0 && (
          <p className="text-sm text-gray-600 mt-1">
            You rated this {rating} star{rating !== 1 ? 's' : ''}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
          Comment
        </label>
        <textarea
          id="comment"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
          required
          placeholder="Share your experience with this product..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add Photos (Optional)
        </label>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
          >
            Upload Photos
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            multiple
            className="hidden"
          />
          <span className="text-xs text-gray-500">Max 3 images</span>
        </div>

        {images.length > 0 && (
          <div className="flex gap-2 mt-3">
            {images.map((img, idx) => (
              <div key={idx} className="relative w-16 h-16">
                <img
                  src={img}
                  alt={`Preview ${idx + 1}`}
                  className="w-full h-full object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow-md hover:bg-red-600"
                >
                  <XIcon className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-brand-dark text-white font-bold py-3 px-4 rounded-full shadow-md hover:bg-opacity-90 transform hover:scale-[1.02] transition-all duration-300"
      >
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;
