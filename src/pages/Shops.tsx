import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Store, MapPin, Star, ArrowRight, Search, SlidersHorizontal, Loader2, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useShops } from '../hooks/useShops';

export default function Shops() {
  const { t } = useTranslation();
  const { shops, loading } = useShops();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(shops.map(shop => shop.category))];
    return cats;
  }, [shops]);

  const filteredShops = useMemo(() => {
    return shops.filter(shop => {
      const matchesSearch = shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          shop.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || shop.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [shops, searchQuery, selectedCategory]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-medium font-mono uppercase tracking-widest text-xs">Loading Wholesale Network...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Wholesale Shops</h1>
          <p className="text-gray-500 tracking-tight">Browse verified wholesalers operating at Ham Shopping Grounds.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative group flex-1 sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Search shops or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm font-medium"
            />
          </div>
          <div className="relative">
            <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none pl-12 pr-10 py-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm font-bold text-gray-700 cursor-pointer min-w-[140px]"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredShops.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredShops.map((shop) => (
            <motion.div
              key={shop.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all"
            >
              <div className="aspect-[16/9] relative overflow-hidden bg-blue-50 flex items-center justify-center">
                <img 
                  src={shop.image} 
                  alt={shop.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      const icon = document.createElement('div');
                      icon.className = 'text-blue-200 flex flex-col items-center gap-2';
                      icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-building-2"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>';
                      parent.appendChild(icon);
                    }
                  }}
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
                  <Link 
                    to={`/shops/${shop.id}`}
                    className="w-full bg-gray-50 text-gray-900 py-4 rounded-2xl font-black flex items-center justify-center gap-2 group-hover:bg-blue-600 group-hover:text-white transition-all transform active:scale-95"
                  >
                    Visit Shop <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-50 text-gray-300">
            <Search size={40} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">No shops found</h3>
          <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
          <button 
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
            className="text-blue-600 font-bold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
