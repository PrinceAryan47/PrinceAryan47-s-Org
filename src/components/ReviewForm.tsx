import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';

interface ReviewFormProps {
  productId: string;
  onSuccess?: () => void;
}

const getWholesalerIdForProduct = async (productId: string) => {
  try {
    const productDoc = await getDoc(doc(db, 'products', productId));
    return productDoc.exists() ? productDoc.data().sellerId : null;
  } catch (error) {
    console.error('Error getting product owner:', error);
    return null;
  }
};

export default function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        productId,
        wholesalerId: (await getWholesalerIdForProduct(productId)) || '',
        buyerId: user.uid,
        buyerName: user.displayName || 'Anonymous Buyer',
        rating,
        comment,
        createdAt: Date.now()
      });
      
      setComment('');
      setRating(5);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="p-6 bg-gray-50 rounded-2xl text-center">
        <p className="text-sm text-gray-500 font-medium">Please login to leave a review.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="font-black text-gray-900 uppercase tracking-tight text-sm">Leave a Review</h4>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              className="transition-transform active:scale-90"
            >
              <Star
                size={20}
                className={`${
                  star <= (hoverRating || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-200'
                } transition-colors`}
              />
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <textarea
          required
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this wholesaler..."
          className="w-full bg-gray-50 border border-gray-100 rounded-[2rem] p-6 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[120px] resize-none"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="absolute bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </form>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-4 bg-green-50 text-green-600 text-xs font-black rounded-xl text-center uppercase tracking-widest border border-green-100"
          >
            Review submitted successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
