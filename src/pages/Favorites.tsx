import React from 'react';
import { motion } from 'motion/react';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

// Mock data for initial state
const MOCK_FAVORITES = [
  {
    id: '1',
    name: 'Uganda Waragi Premium',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1592318963760-281567339736?q=80&w=2574&auto=format&fit=crop',
    category: 'Liquor',
    minOrder: 12
  },
  {
    id: '2',
    name: 'Movit Jelly Big',
    price: 5000,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=2574&auto=format&fit=crop',
    category: 'Personal Care',
    minOrder: 24
  }
];

export default function Favorites() {
  const { addToCart } = useCart();
  const favorites = MOCK_FAVORITES; // In a real app, this would come from state/context

  return (
    <div className="space-y-10 pb-20">
      <div>
        <h1 className="text-2xl font-black text-gray-900">My Favorites</h1>
        <p className="text-gray-500 tracking-tight">Products you've saved for later or quick access.</p>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {favorites.map((product) => (
            <motion.div
              layout
              key={product.id}
              className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all group"
            >
              <div className="aspect-square relative overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4">
                  <div className="bg-red-500 text-white p-2 rounded-full shadow-lg">
                    <Heart size={18} fill="currentColor" />
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">{product.category}</p>
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Wholesale Price</p>
                    <p className="font-black text-lg text-gray-900">UGX {product.price.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Min Order</p>
                    <p className="font-bold text-sm text-gray-600">{product.minOrder} pcs</p>
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button 
                    onClick={() => addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.image,
                      quantity: product.minOrder
                    })}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-2xl text-xs font-black hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                  >
                    Add to Cart <ShoppingBag size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 p-20 text-center space-y-6">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
            <Heart size={40} />
          </div>
          <div className="max-w-xs mx-auto">
            <h3 className="text-xl font-bold text-gray-900">Your wishlist is empty</h3>
            <p className="text-gray-500 text-sm mt-2">Start adding products you like to find them easily later.</p>
          </div>
          <Link 
            to="/products"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
          >
            Explore Products <ArrowRight size={18} />
          </Link>
        </div>
      )}
    </div>
  );
}
