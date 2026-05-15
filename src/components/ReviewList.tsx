import React from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { Review } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface ReviewListProps {
  reviews: Review[];
  loading: boolean;
}

export default function ReviewList({ reviews, loading }: ReviewListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-50 rounded-3xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200">
          <MessageSquare size={32} />
        </div>
        <p className="text-gray-400 font-black uppercase text-xs tracking-widest">No reviews yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white p-6 rounded-[2rem] border border-gray-50 shadow-sm space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <h5 className="font-black text-gray-900 text-sm">{review.buyerName}</h5>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 inline-block">
                {formatDistanceToNow(review.createdAt)} ago
              </span>
            </div>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={14}
                  className={`${
                    star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-100'
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-gray-600 text-sm font-medium leading-relaxed italic">
            "{review.comment}"
          </p>
        </div>
      ))}
    </div>
  );
}
