import React from 'react';
import { motion } from 'motion/react';
import { Store, MapPin, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_SHOPS = [
  {
    id: '1',
    name: 'Kikuubo General Wholesalers',
    location: 'Block A, Ham Grounds',
    rating: 4.8,
    category: 'Groceries',
    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=2574&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'Ham Enterprise',
    location: 'Block C, Ham Grounds',
    rating: 4.9,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574&auto=format&fit=crop'
  },
  {
    id: '3',
    name: 'Nakivubo Liquors',
    location: 'Basement, Ham Grounds',
    rating: 4.7,
    category: 'Liquor',
    image: 'https://images.unsplash.com/photo-1473187983305-f615310e7daa?q=80&w=2574&auto=format&fit=crop'
  }
];

export default function Shops() {
  return (
    <div className="space-y-10 pb-20">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Wholesale Shops</h1>
        <p className="text-gray-500 tracking-tight">Browse verified wholesalers operating at Ham Shopping Grounds.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MOCK_SHOPS.map((shop) => (
          <motion.div
            key={shop.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all"
          >
            <div className="aspect-[16/9] relative overflow-hidden">
               <img 
                src={shop.image} 
                alt={shop.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
               <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1.5 text-xs font-black text-amber-500">
                  <Star size={14} fill="currentColor" /> {shop.rating}
               </div>
            </div>

            <div className="p-8 space-y-4">
              <div>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">{shop.category}</p>
                <h3 className="text-xl font-bold text-gray-900">{shop.name}</h3>
              </div>

              <div className="flex items-center gap-2 text-gray-500">
                <MapPin size={16} />
                <span className="text-sm font-medium">{shop.location}</span>
              </div>

              <div className="pt-4">
                <button className="w-full bg-gray-50 text-gray-900 py-4 rounded-2xl font-black flex items-center justify-center gap-2 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  Visit Shop <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
