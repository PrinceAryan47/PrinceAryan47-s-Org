import React from 'react';
import { Star, Eye, Heart, Phone, MessageCircle, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = async () => {
    addToCart(product);
    
    // Notify Wholesaler (Simulated via Firestore notification collection as per user request)
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
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.images[0] || `https://picsum.photos/seed/${product.id}/400/400`}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-2 right-2 flex flex-col gap-2 transform translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
          <button className="p-2 bg-white rounded-full shadow-md text-gray-600 hover:text-red-500 hover:bg-red-50 transition-colors">
            <Heart size={18} />
          </button>
          <button className="p-2 bg-white rounded-full shadow-md text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
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
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <span>4.5</span>
          </div>
        </div>
        
        <h3 className="font-bold text-gray-900 line-clamp-1 hover:text-blue-600 transition-colors cursor-pointer">
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
  );
}
