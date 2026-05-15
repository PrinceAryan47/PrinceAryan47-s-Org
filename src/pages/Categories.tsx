import React from 'react';
import { motion } from 'motion/react';
import { 
  Smartphone, 
  Sparkles, 
  Shirt, 
  Home as HomeIcon, 
  Hammer, 
  Soup,
  BookOpen,
  Briefcase,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  { name: 'Fashion Clothing', count: '1,240+', icon: Shirt, color: 'bg-indigo-50 text-indigo-600', border: 'border-indigo-100' },
  { name: 'Footwear & Leather', count: '850+', icon: Sparkles, color: 'bg-amber-50 text-amber-600', border: 'border-amber-100' },
  { name: 'Home Textiles', count: '3,100+', icon: HomeIcon, color: 'bg-blue-50 text-blue-600', border: 'border-blue-100' },
  { name: 'Cosmetics', count: '2,400+', icon: Sparkles, color: 'bg-pink-50 text-pink-600', border: 'border-pink-100' },
  { name: 'Electronics', count: '1,100+', icon: Smartphone, color: 'bg-cyan-50 text-cyan-600', border: 'border-cyan-100' },
  { name: 'Stationery', count: '900+', icon: BookOpen, color: 'bg-gray-50 text-gray-600', border: 'border-gray-100' },
];

export default function Categories() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Shop by Category</h1>
        <p className="mt-4 text-gray-500 text-lg">
          Browse through our extensive wholesale catalog organized for your convenience. 
          Everything you need for your retail business in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {CATEGORIES.map((cat, idx) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Link 
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className={`group block p-8 rounded-[2.5rem] border ${cat.border} ${cat.color} hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer relative overflow-hidden`}
            >
              <div className="relative z-10 space-y-6">
                 <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                    <cat.icon size={32} />
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold text-gray-900">{cat.name}</h3>
                    <p className="text-sm font-medium opacity-70 mt-1">{cat.count} listings available</p>
                 </div>
                 <div className="flex items-center gap-2 font-bold text-sm">
                    <span>Explore All</span>
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                 </div>
              </div>
              {/* Decorative background shape */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            </Link>
          </motion.div>
        ))}
      </div>

      <section className="bg-gray-900 rounded-[3rem] p-12 text-center text-white space-y-8 relative overflow-hidden mt-12">
         <h2 className="text-3xl font-bold relative z-10">Can't find a specific wholesaler?</h2>
         <p className="text-gray-400 max-w-xl mx-auto relative z-10">
            Tell us what you are looking for and we will connect you with a verified wholesaler from the Ham Grounds network.
         </p>
         <button className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all relative z-10">
            Send Supply Request
         </button>
      </section>
    </div>
  );
}
