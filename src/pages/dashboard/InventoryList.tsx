import React, { useState } from 'react';
import { Search, Filter, Plus, Edit2, Trash2, Package, AlertTriangle, PackageSearch } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { useWholesalerProducts } from '../../hooks/useDashboardData';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';

export default function InventoryList() {
  const { user } = useAuth();
  const { products, loading } = useWholesalerProducts(user?.uid);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    wholesalePrice: '',
    costPrice: '',
    stock: '',
    minQuantity: '',
    category: 'Fashion Clothing'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await addDoc(collection(db, 'products'), {
        ...newProduct,
        wholesalePrice: Number(newProduct.wholesalePrice),
        costPrice: Number(newProduct.costPrice),
        stock: Number(newProduct.stock),
        minQuantity: Number(newProduct.minQuantity),
        price: Number(newProduct.wholesalePrice) * 1.2, // Rough retail estimate
        sellerId: user.uid,
        sellerName: user.displayName || user.email,
        sellerPhone: (user as any).phoneNumber || null,
        sellerWhatsapp: (user as any).whatsappNumber || null,
        sellerShopNo: (user as any).shopNo || null,
        sellerBlock: (user as any).block || null,
        images: [],
        createdAt: serverTimestamp(),
      });
      setIsAdding(false);
      setNewProduct({
        name: '',
        wholesalePrice: '',
        costPrice: '',
        stock: '',
        minQuantity: '',
        category: 'Fashion Clothing'
      });
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteDoc(doc(db, 'products', id));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Digital Inventory</h1>
          <p className="text-gray-500 text-sm">Monitor stock levels and manage wholesale pricing.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 font-semibold"
        >
          <Plus size={20} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search inventory..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-100 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
          <Filter size={18} />
          Filter
        </button>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {loading ? (
           [...Array(4)].map((_, i) => (
             <div key={i} className="aspect-square bg-gray-100 rounded-3xl animate-pulse" />
           ))
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((item) => (
            <motion.div
              key={item.id}
              layout
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="text-3xl">📦</div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={16} /></button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="space-y-1">
                <h3 className="font-bold text-gray-900 line-clamp-1">{item.name}</h3>
                <p className="text-xs text-blue-600 font-semibold uppercase">{item.category}</p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider text-center">Wholesale</p>
                  <p className="font-bold text-gray-900 text-xs text-center">UGX {item.wholesalePrice.toLocaleString()}</p>
                </div>
                <div className={`p-3 rounded-xl text-center ${item.stock <= 10 ? 'bg-red-50 border border-red-100' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-center gap-1">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">In Stock</p>
                    {item.stock <= 10 && <AlertTriangle size={10} className="text-red-500" />}
                  </div>
                  <p className={`font-bold ${item.stock <= 10 ? 'text-red-600' : 'text-gray-900'}`}>{item.stock}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center text-[10px] uppercase font-bold tracking-wider text-gray-400">
                 <span>MOQ: {item.minQuantity}</span>
                 <span className="text-gray-900">Profit/Unit: UGX {(item.wholesalePrice - (item.costPrice || 0)).toLocaleString()}</span>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
              <PackageSearch size={32} />
            </div>
            <p className="text-gray-500 font-medium">No products found in your inventory.</p>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm shadow-2xl"
              onClick={() => setIsAdding(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-lg rounded-3xl p-8 relative shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold">Add to Inventory</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Product Name</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="e.g. Bulk School Supplies" 
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Cost Price (UGX)</label>
                    <input 
                      required
                      type="number" 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                      placeholder="Your cost" 
                      value={newProduct.costPrice}
                      onChange={(e) => setNewProduct({...newProduct, costPrice: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Wholesale Price (UGX)</label>
                    <input 
                      required
                      type="number" 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                      placeholder="To buyers" 
                      value={newProduct.wholesalePrice}
                      onChange={(e) => setNewProduct({...newProduct, wholesalePrice: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Stock</label>
                    <input 
                      required
                      type="number" 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                      placeholder="Current" 
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Min Order</label>
                    <input 
                      required
                      type="number" 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                      placeholder="MOQ" 
                      value={newProduct.minQuantity}
                      onChange={(e) => setNewProduct({...newProduct, minQuantity: e.target.value})}
                    />
                  </div>
                   <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                    <select 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    >
                        <option>Fashion Clothing</option>
                        <option>Footwear & Leather</option>
                        <option>Home Textiles</option>
                        <option>Cosmetics</option>
                        <option>Electronics</option>
                        <option>Stationery</option>
                    </select>
                  </div>
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsAdding(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
                  <button type="submit" className="flex-[2] px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20">Save Product</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
