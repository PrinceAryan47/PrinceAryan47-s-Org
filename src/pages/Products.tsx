import React, { useState } from 'react';
import { Search, SlidersHorizontal, ChevronDown, Grid, List as ListIcon, PackageSearch } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { motion } from 'motion/react';
import { useProducts } from '../hooks/useProducts';

export default function Products() {
  const { products, loading } = useProducts();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900">Wholesale Marketplace</h1>
          <p className="text-gray-500">Discover direct bulk deals from HAM GROUNDS wholesalers.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center bg-gray-100 p-1 rounded-xl">
             <button 
               onClick={() => setViewMode('grid')}
               className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}
             >
               <Grid size={20} />
             </button>
             <button 
               onClick={() => setViewMode('list')}
               className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}
             >
               <ListIcon size={20} />
             </button>
          </div>
          <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl font-bold text-sm text-gray-700 hover:bg-gray-50">
            <SlidersHorizontal size={18} />
            Filters
            <ChevronDown size={14} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Global Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
        <input 
          type="text" 
          placeholder="Search for products, categories, or wholesalers..."
          className="w-full pl-14 pr-6 py-5 bg-white border border-gray-200 rounded-[2rem] text-lg outline-none focus:ring-4 focus:ring-blue-100 shadow-sm transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {loading ? (
           [...Array(8)].map((_, i) => (
             <div key={i} className="aspect-square bg-gray-100 rounded-3xl animate-pulse" />
           ))
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id}>
              <ProductCard product={product} />
            </div>
          ))
        ) : (
          <div className="col-span-full py-32 text-center space-y-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
               <PackageSearch size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        )}
      </div>

      <div className="pt-10 flex justify-center">
         <button className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all">
           Load More Products
         </button>
      </div>
    </div>
  );
}
