import React from 'react';
import { StarIcon } from './icons/StarIcon';
import { Review } from '../types';

interface ReviewSummaryProps {
    reviews: Review[];
}

const ReviewSummary: React.FC<ReviewSummaryProps> = ({ reviews }) => {
    const totalReviews = reviews.length;
    const averageRating =
        totalReviews > 0
            ? reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews
            : 0;

    const ratingCounts = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
    };

    reviews.forEach((review) => {
        const rounded = Math.round(review.rating) as keyof typeof ratingCounts;
        if (ratingCounts[rounded] !== undefined) {
            ratingCounts[rounded]++;
        }
    });

    return (
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                {/* Average Rating */}
                <div className="text-center md:text-left">
                    <div className="flex items-baseline justify-center md:justify-start gap-2">
                        <span className="text-5xl font-bold text-gray-900">{averageRating.toFixed(1)}</span>
                        <span className="text-gray-500 text-lg">/ 5</span>
                    </div>
                    <div className="flex justify-center md:justify-start my-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon
                                key={star}
                                className={`h-6 w-6 ${star <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'
                                    }`}
                            />
                        ))}
                    </div>
                    <p className="text-gray-600 font-medium">{totalReviews} verified reviews</p>
                </div>

                {/* Histogram */}
                <div className="md:col-span-2 space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                        const count = ratingCounts[star as keyof typeof ratingCounts];
                        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                        return (
                            <div key={star} className="flex items-center gap-3">
                                <div className="flex items-center gap-1 w-12 flex-shrink-0">
                                    <span className="font-medium text-sm text-gray-700">{star}</span>
                                    <StarIcon className="h-4 w-4 text-gray-400" />
                                </div>
                                <div className="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-brand-primary rounded-full transition-all duration-500"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className="text-sm text-gray-500 w-8 text-right">{count}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ReviewSummary;
