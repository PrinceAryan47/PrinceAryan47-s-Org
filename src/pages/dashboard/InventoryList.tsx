import React, { useState, useRef } from 'react';
import { Search, Filter, Plus, Edit2, Trash2, Package, AlertTriangle, PackageSearch, Image as ImageIcon, Camera, Upload, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { useWholesalerProducts } from '../../hooks/useDashboardData';
import { db, storage } from '../../firebase';
import { collection, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function InventoryList() {
  const { user } = useAuth();
  const { products, loading } = useWholesalerProducts(user?.uid);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    wholesalePrice: '',
    costPrice: '',
    stock: '',
    minQuantity: '',
    category: 'Fashion Clothing',
    images: [] as string[],
    description: ''
  });

  const handleEdit = (product: any) => {
    setCurrentId(product.id);
    setFormData({
      name: product.name,
      wholesalePrice: product.wholesalePrice.toString(),
      costPrice: (product.costPrice || 0).toString(),
      stock: product.stock.toString(),
      minQuantity: product.minQuantity.toString(),
      category: product.category,
      images: product.images || [],
      description: product.description || ''
    });
    setIsEditing(true);
    setIsAdding(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !user) return;

    setIsUploading(true);
    const newImages = [...formData.images];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Storage path: products/{userId}/{timestamp}_{filename}
        const storageRef = ref(storage, `products/${user.uid}/${Date.now()}_${file.name}`);
        
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        
        newImages.push(downloadURL);
      }

      setFormData({ ...formData, images: newImages });
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload one or more images. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (isUploading) {
      alert('Please wait for the image upload to complete.');
      return;
    }

    if (formData.images.length === 0) {
      if (!window.confirm('You haven\'t uploaded any images for this product. Do you want to continue anyway?')) {
        return;
      }
    }

    try {
      const productData = {
        ...formData,
        wholesalePrice: Number(formData.wholesalePrice),
        costPrice: Number(formData.costPrice),
        stock: Number(formData.stock),
        minQuantity: Number(formData.minQuantity),
        price: Number(formData.wholesalePrice) * 1.2, // Rough retail estimate
        images: formData.images,
        updatedAt: serverTimestamp(),
      };

      if (isEditing && currentId) {
        await updateDoc(doc(db, 'products', currentId), productData);
      } else {
        await addDoc(collection(db, 'products'), {
          ...productData,
          sellerId: user.uid,
          sellerName: user.displayName || user.email,
          sellerPhone: (user as any).phoneNumber || null,
          sellerWhatsapp: (user as any).whatsappNumber || null,
          sellerShopNo: (user as any).shopNo || null,
          sellerBlock: (user as any).block || null,
          createdAt: serverTimestamp(),
        });
      }

      setIsAdding(false);
      setIsEditing(false);
      setCurrentId(null);
      setFormData({
        name: '',
        wholesalePrice: '',
        costPrice: '',
        stock: '',
        minQuantity: '',
        category: 'Fashion Clothing',
        images: [],
        description: ''
      });
    } catch (error) {
      console.error('Error saving product:', error);
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
          onClick={() => {
            setIsEditing(false);
            setFormData({
              name: '',
              wholesalePrice: '',
              costPrice: '',
              stock: '',
              minQuantity: '',
              category: 'Fashion Clothing',
              images: [],
              description: ''
            });
            setIsAdding(true);
          }}
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
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative group overflow-hidden"
            >
              <div className="relative aspect-video bg-gray-50 flex items-center justify-center overflow-hidden">
                {item.images && item.images[0] ? (
                  <img 
                    src={item.images[0]} 
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <Package size={32} className="text-gray-200" />
                )}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleEdit(item)}
                    className="p-1.5 bg-white/90 backdrop-blur-sm text-gray-400 hover:text-blue-600 hover:bg-white rounded-lg shadow-sm"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 bg-white/90 backdrop-blur-sm text-gray-400 hover:text-red-500 hover:bg-white rounded-lg shadow-sm"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <div className="p-6 pt-4">
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
              <h2 className="text-2xl font-bold">{isEditing ? 'Edit Product' : 'Add to Inventory'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Product Images</label>
                  <div className="space-y-4">
                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-3 gap-2">
                        {formData.images.map((url, idx) => (
                          <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 group">
                            <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                            <button 
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div 
                      onClick={() => !isUploading && fileInputRef.current?.click()}
                      className={`w-full border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all text-gray-400 p-6 ${isUploading ? 'opacity-50 cursor-wait' : ''}`}
                    >
                      <div className="p-3 bg-gray-50 rounded-full">
                        {isUploading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          >
                            <Upload size={24} />
                          </motion.div>
                        ) : (
                          <Upload size={24} />
                        )}
                      </div>
                      <p className="text-xs font-bold">
                        {isUploading ? 'Uploading...' : 'Click to upload images or drag & drop'}
                      </p>
                      <p className="text-[10px]">Select multiple images if needed.</p>
                    </div>
                    
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      className="hidden" 
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                    />

                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <ImageIcon size={16} />
                      </div>
                      <input 
                        type="text" 
                        placeholder="Add image by URL..." 
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const val = (e.target as HTMLInputElement).value;
                            if (val) {
                              setFormData({...formData, images: [...formData.images, val]});
                              (e.target as HTMLInputElement).value = '';
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Product Name</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="e.g. Bulk School Supplies" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                  <textarea 
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]" 
                    placeholder="Describe your product features, quality, etc." 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
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
                      value={formData.costPrice}
                      onChange={(e) => setFormData({...formData, costPrice: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Wholesale Price (UGX)</label>
                    <input 
                      required
                      type="number" 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                      placeholder="To buyers" 
                      value={formData.wholesalePrice}
                      onChange={(e) => setFormData({...formData, wholesalePrice: e.target.value})}
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
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Min Order</label>
                    <input 
                      required
                      type="number" 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                      placeholder="MOQ" 
                      value={formData.minQuantity}
                      onChange={(e) => setFormData({...formData, minQuantity: e.target.value})}
                    />
                  </div>
                   <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                    <select 
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
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
                  <button type="button" onClick={() => {
                    setIsAdding(false);
                    setIsEditing(false);
                    setCurrentId(null);
                  }} className="flex-1 px-4 py-2 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
                  <button type="submit" className="flex-[2] px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20">
                    {isEditing ? 'Update Product' : 'Save Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
