import React, { useState, useRef } from 'react';
import { Search, Filter, Plus, Edit2, Trash2, Package, AlertTriangle, PackageSearch, Image as ImageIcon, Camera, Upload, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { useWholesalerProducts } from '../../hooks/useDashboardData';
import { db, storage } from '../../firebase';
import { collection, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { useTranslation } from 'react-i18next';

import imageCompression from 'browser-image-compression';

export default function InventoryList() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { products, loading } = useWholesalerProducts(user?.uid);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
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

  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      await processFiles(files);
    }
  };

  const processFiles = async (files: FileList) => {
    if (!user) return;
    setIsUploading(true);
    setUploadError(null);
    
    try {
      const fileArray = Array.from(files).filter(f => {
        const type = f.type.toLowerCase();
        const name = f.name.toLowerCase();
        return type.startsWith('image/') || 
               /\.(jpg|jpeg|png|gif|webp|heic|heif|bmp|tiff|svg)$/i.test(name);
      });
      
      if (fileArray.length === 0) {
        setIsUploading(false);
        return;
      }
      
      // Temporary local previews
      const localPreviews = fileArray.map(f => URL.createObjectURL(f));
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...localPreviews]
      }));

      const compressionOptions = {
        maxSizeMB: 2.0, // Increased size for better quality
        maxWidthOrHeight: 1920, // Allow for HD resolution
        useWebWorker: false
      };
      
      const uploadPromises = fileArray.map(async (file, index) => {
        try {
          // Temporarily disable compression to isolate the issue
          const fileToUpload: File = file;

          const timestamp = Date.now() + Math.random().toString(36).substring(7);
          const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
          const storageRef = ref(storage, `products/${user.uid}/${timestamp}_${sanitizedName}`);
          
          console.log(`InventoryList: Uploading ${file.name} to ${storageRef.fullPath}...`);
          
          // Use simple uploadBytes first to see if it's more reliable in this env
          const snapshot = await uploadBytes(storageRef, fileToUpload, { 
            contentType: file.type,
            cacheControl: 'public,max-age=3600',
            customMetadata: { uploadedBy: user.uid, originalName: file.name }
          });
          
          console.log(`InventoryList: Get URL for ${file.name}`);
          const url = await getDownloadURL(snapshot.ref);
          
          setFormData(prev => {
            const newImages = [...prev.images];
            const localPreviewUrl = localPreviews[index];
            const localIdx = newImages.indexOf(localPreviewUrl);
            if (localIdx !== -1) {
              newImages[localIdx] = url;
            } else {
              newImages.push(url);
            }
            return { ...prev, images: newImages };
          });
          
          return url;
        } catch (uploadErr) {
          console.error(`InventoryList: Failed to upload ${file.name}:`, uploadErr);
          setUploadError(`Failed to upload ${file.name}: ${uploadErr instanceof Error ? uploadErr.message : 'Storage error'}`);
          return null;
        }
      });

      await Promise.all(uploadPromises);
    } catch (error: any) {
      console.error('InventoryList: Error processing files:', error);
      alert('Failed to upload images.');
    } finally {
      setIsUploading(false);
      setUploadProgress({});
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const clearImages = () => {
    if (confirm('Are you sure you want to remove all images?')) {
      setFormData({ ...formData, images: [] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (isUploading) {
      alert('Please wait for the image upload to complete.');
      return;
    }

    if (formData.images.length === 0) {
      if (!window.confirm("You haven't uploaded any images for this product. Do you want to continue anyway?")) {
        return;
      }
    }

    setIsSaving(true);
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
      alert('Error saving to database. Check your connection.');
    } finally {
      setIsSaving(false);
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
          <h1 className="text-2xl font-bold text-gray-900">{t('inventory.title')}</h1>
          <p className="text-gray-500 text-sm">{t('inventory.subtitle')}</p>
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
          <span>{t('inventory.add_product')}</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder={t('inventory.search_placeholder')}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-100 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
          <Filter size={18} />
          {t('products.filters')}
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
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                      (e.currentTarget.parentElement as HTMLElement).innerHTML = '<div class="flex flex-col items-center justify-center text-gray-200"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-package"><path d="M16.5 9.4 7.5 4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" x2="12" y1="22" y2="12"/></svg></div>';
                    }}
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
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider text-center">{t('inventory.wholesale')}</p>
                  <p className="font-bold text-gray-900 text-xs text-center">UGX {item.wholesalePrice.toLocaleString()}</p>
                </div>
                <div className={`p-3 rounded-xl text-center ${item.stock <= 10 ? 'bg-red-50 border border-red-100' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-center gap-1">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{t('inventory.in_stock')}</p>
                    {item.stock <= 10 && <AlertTriangle size={10} className="text-red-500" />}
                  </div>
                  <p className={`font-bold ${item.stock <= 10 ? 'text-red-600' : 'text-gray-900'}`}>{item.stock}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center text-[10px] uppercase font-bold tracking-wider text-gray-400">
                 <span>{t('inventory.moq')}: {item.minQuantity}</span>
                 <span className="text-gray-900">{t('inventory.profit')}: UGX {(item.wholesalePrice - (item.costPrice || 0)).toLocaleString()}</span>
              </div>
            </div>
          </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
              <PackageSearch size={32} />
            </div>
            <p className="text-gray-500 font-medium">{t('products.no_found_title')}</p>
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
              <h2 className="text-2xl font-bold">{isEditing ? t('inventory.edit_product') : t('inventory.add_to_inv')}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                   <div className="flex items-center justify-between mb-2">
                     <label className="block text-sm font-bold text-gray-700">Product Images</label>
                     {formData.images.length > 0 && (
                       <button 
                        type="button" 
                        onClick={clearImages}
                        className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline"
                       >
                        {t('inventory.clear_all')}
                       </button>
                     )}
                   </div>
                   <div className="space-y-4">
                     {formData.images.length > 0 && (
                       <div className="grid grid-cols-3 gap-2">
                         {formData.images.map((url, idx) => (
                           <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 group">
                             <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                             {uploadProgress[url] !== undefined && uploadProgress[url] < 100 && (
                               <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                 <p className="text-[10px] font-black text-white">{Math.round(uploadProgress[url])}%</p>
                               </div>
                             )}
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
                     
                     {uploadError && (
                       <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex flex-col gap-2">
                          <div className="flex items-center gap-3">
                            <AlertTriangle size={16} className="text-red-600" />
                            <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Upload Failed</p>
                          </div>
                          <p className="text-[10px] text-red-500 font-medium">{uploadError}</p>
                       </div>
                     )}
                     
                     {isUploading && (
                       <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-3">
                          <Loader2 size={16} className="animate-spin text-blue-600" />
                          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{t('inventory.uploading_wait')}</p>
                       </div>
                     )}
                     
                     <div className="grid grid-cols-2 gap-3">
                        <div 
                          className={`relative border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all p-4 ${
                            dragActive ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-400"
                          } ${isUploading ? 'opacity-50 cursor-wait' : ''}`}
                          onDragEnter={handleDrag}
                          onDragLeave={handleDrag}
                          onDragOver={handleDrag}
                          onDrop={handleDrop}
                          onClick={() => !isUploading && fileInputRef.current?.click()}
                        >
                          <Upload size={20} className={dragActive ? "text-blue-500" : ""} />
                          <span className="text-[10px] font-black uppercase tracking-widest text-center">
                            {isUploading ? t('common.loading') : dragActive ? t('inventory.drop_here') : t('inventory.drop_click_upload')}
                          </span>
                        </div>

                        <div className="flex flex-col gap-2">
                           <div className="relative">
                              <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                              <input 
                                type="text" 
                                placeholder={t('inventory.paste_url_placeholder')} 
                                className="w-full pl-9 pr-4 py-3 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-xs bg-gray-50"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const val = (e.currentTarget as HTMLInputElement).value.trim();
                                    if (val) {
                                      if (val.startsWith('http')) {
                                        setFormData(prev => ({...prev, images: [...prev.images, val]}));
                                        e.currentTarget.value = '';
                                      } else {
                                        alert('Please enter a valid URL starting with http:// or https://');
                                      }
                                    }
                                  }
                                }}
                              />
                           </div>
                           <p className="text-[9px] text-gray-400 italic px-2">{t('inventory.press_enter_hint')}</p>
                        </div>
                     </div>
                     
                     <input 
                       type="file" 
                       ref={fileInputRef}
                       className="hidden" 
                       accept="image/*,.heic,.heif,.webp,.svg,.bmp"
                       multiple
                       onChange={handleFileChange}
                     />
                   </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">{t('inventory.prod_name')}</label>
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
                  <label className="block text-sm font-bold text-gray-700 mb-1">{t('inventory.description')}</label>
                  <textarea 
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]" 
                    placeholder="Describe your product features, quality, etc." 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">{t('inventory.cost_price')}</label>
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
                    <label className="block text-sm font-bold text-gray-700 mb-1">{t('inventory.wholesale_price')}</label>
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
                    <label className="block text-sm font-bold text-gray-700 mb-1">{t('inventory.stock')}</label>
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
                    <label className="block text-sm font-bold text-gray-700 mb-1">{t('inventory.min_order')}</label>
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
                    <label className="block text-sm font-bold text-gray-700 mb-1">{t('inventory.category')}</label>
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
                  }} className="flex-1 px-4 py-2 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50">{t('inventory.cancel')}</button>
                  <button 
                    type="submit" 
                    disabled={isSaving || isUploading}
                    className="flex-[2] px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        {t('common.loading')}
                      </>
                    ) : (
                      isEditing ? t('inventory.update') : t('inventory.save')
                    )}
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
