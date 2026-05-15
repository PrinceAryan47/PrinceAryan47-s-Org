import React from 'react';
import { Star, Eye, Heart, Phone, MessageCircle, ShoppingBag, Package, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useProductReviews } from '../hooks/useDashboardData';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { reviews, loading: reviewsLoading } = useProductReviews(product.id);
  const [showDetails, setShowDetails] = React.useState(false);

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 'New';

  const handleAddToCart = async () => {
    addToCart(product);
    
    // Notify Wholesaler
    try {
      await addDoc(collection(db, 'notifications'), {
        wholesalerId: product.sellerId,
        buyerId: user?.uid || 'anonymous',
        buyerName: user?.displayName || 'A potential buyer',
        buyerPhone: user?.phoneNumber || null,
        buyerWhatsapp: user?.whatsappNumber || null,
        productId: product.id,
        productName: product.name,
        type: 'interest',
        message: `${user?.displayName || 'Someone'} added ${product.name} to their cart.`,
        createdAt: serverTimestamp(),
        read: false
      });
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -5 }}
        className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group"
      >
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
              referrerPolicy="no-referrer"
              onClick={() => setShowDetails(true)}
            />
          ) : (
            <div 
              className="w-full h-full flex flex-col items-center justify-center text-gray-200 cursor-pointer"
              onClick={() => setShowDetails(true)}
            >
               <Package size={48} />
               <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-widest">No Image available</p>
            </div>
          )}
          <div className="absolute top-2 right-2 flex flex-col gap-2 transform translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
            <button className="p-2 bg-white rounded-full shadow-md text-gray-600 hover:text-red-500 hover:bg-red-50 transition-colors">
              <Heart size={18} />
            </button>
            <button 
              onClick={() => setShowDetails(true)}
              className="p-2 bg-white rounded-full shadow-md text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <Eye size={18} />
            </button>
          </div>
          {product.stock < 10 && (
            <div className="absolute bottom-2 left-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded">
              Low Stock: {product.stock}
            </div>
          )}
        </div>
        
        <div className="p-4 space-y-2">
          <div className="flex justify-between items-start">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">{product.category}</p>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Star size={12} className={averageRating !== 'New' ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
              <span className="font-bold">{averageRating}</span>
              <span className="text-[10px]">({reviews.length})</span>
            </div>
          </div>
          
          <h3 
            onClick={() => setShowDetails(true)}
            className="font-bold text-gray-900 line-clamp-1 hover:text-blue-600 transition-colors cursor-pointer"
          >
            {product.name}
          </h3>
          
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900">UGX {product.wholesalePrice.toLocaleString()}</span>
            <span className="text-xs text-gray-400 line-through">UGX {product.price.toLocaleString()}</span>
          </div>
          
          <div className="pt-2 border-t border-gray-50 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="text-[10px] text-gray-500">
                MOQ: <span className="font-semibold">{product.minQuantity} units</span>
              </div>
              <div className="text-[10px] text-gray-500">
                Stock: <span className="font-semibold">{product.stock} left</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <button 
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-2.5 rounded-xl hover:bg-gray-800 transition-all text-xs font-bold"
              >
                <ShoppingBag size={14} />
                Add to Bag
              </button>
              <div className="grid grid-cols-2 gap-2">
                <a 
                  href={`https://wa.me/${product.sellerWhatsapp?.replace(/\D/g, '') || ''}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition-all text-[10px] font-bold"
                >
                  <MessageCircle size={14} />
                  WhatsApp
                </a>
                <a 
                  href={`tel:${product.sellerPhone || ''}`}
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition-all text-[10px] font-bold"
                >
                  <Phone size={14} />
                  Call
                </a>
              </div>
              {(product.sellerPhone || product.sellerWhatsapp) && (
                <div className="flex flex-col gap-1 pt-1">
                  <div className="flex justify-between items-center text-[8px] text-gray-400 font-bold uppercase tracking-tight px-1">
                    <span className="flex items-center gap-1"><Phone size={8} /> {product.sellerPhone || 'N/A'}</span>
                    <span className="flex items-center gap-1"><MessageCircle size={8} /> {product.sellerWhatsapp || 'N/A'}</span>
                  </div>
                  {(product.sellerShopNo || product.sellerBlock) && (
                    <div className="text-[8px] text-blue-600 font-black uppercase tracking-widest px-1 text-center bg-blue-50 py-1 rounded-lg">
                      Ham Grounds: {product.sellerShopNo ? `Shop ${product.sellerShopNo}` : ''} {product.sellerBlock ? `, ${product.sellerBlock}` : ''}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Product Details Modal */}
      <AnimatePresence>
        {showDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetails(false)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row"
            >
              <button 
                onClick={() => setShowDetails(false)}
                className="absolute top-6 right-6 z-10 p-2 bg-white rounded-full shadow-lg text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex-1 bg-gray-50 flex items-center justify-center p-8">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain rounded-2xl shadow-xl shadow-gray-200"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <Package size={100} className="text-gray-200" />
                )}
              </div>

              <div className="flex-1 p-8 md:p-12 overflow-y-auto space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-black text-blue-600 uppercase tracking-widest">{product.category}</p>
                    <div className="flex items-center gap-1 text-sm font-black text-gray-900">
                      <Star size={16} className="text-yellow-400 fill-yellow-400" />
                      {averageRating} <span className="text-gray-400 text-xs font-medium">({reviews.length} reviews)</span>
                    </div>
                  </div>
                  <h2 className="text-3xl font-black text-gray-900 leading-tight">{product.name}</h2>
                  <div className="flex items-baseline gap-4">
                    <span className="text-3xl font-black text-blue-600">UGX {product.wholesalePrice.toLocaleString()}</span>
                    <span className="text-sm font-bold text-gray-400 line-through decoration-red-400">UGX {product.price.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-4">
                   <h4 className="font-black text-gray-900 uppercase tracking-tight text-sm">Product Description</h4>
                   <p className="text-gray-500 font-medium leading-relaxed">{product.description || 'No description available for this item.'}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Stock</p>
                    <p className="font-black text-gray-900">{product.stock} Units</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Min. Order</p>
                    <p className="font-black text-gray-900">{product.minQuantity} Units</p>
                  </div>
                </div>

                <div className="pt-8 border-t border-gray-100">
                   <ReviewForm productId={product.id} />
                </div>

                <div className="space-y-6">
                   <h4 className="font-black text-gray-900 uppercase tracking-tight text-sm">Buyer Feedback</h4>
                   <ReviewList reviews={reviews} loading={reviewsLoading} />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
