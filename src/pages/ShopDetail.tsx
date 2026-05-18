import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { motion } from 'motion/react';
import { MapPin, Phone, Star, ShoppingBag, ArrowLeft, Loader2, MessageCircle, Building2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';

export default function ShopDetail() {
  const { id } = useParams<{ id: string }>();
  const [shop, setShop] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    async function fetchShopData() {
      if (!id) return;
      try {
        // Fetch Shop Info
        const shopDoc = await getDoc(doc(db, 'users', id));
        if (shopDoc.exists()) {
          setShop({ id: shopDoc.id, ...shopDoc.data() });
        }

        // Fetch Shop Products
        const q = query(collection(db, 'products'), where('sellerId', '==', id));
        const querySnapshot = await getDocs(q);
        const productList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        setProducts(productList);
      } catch (error) {
        console.error("Error fetching shop data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchShopData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-medium font-mono uppercase tracking-widest text-xs">Loading Shop Portfolio...</p>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold">Shop not found</h2>
        <Link to="/shops" className="text-blue-600 font-bold hover:underline">Back to Shops</Link>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Shop Header */}
      <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-10 items-start">
        <div className="w-32 h-32 md:w-48 md:h-48 bg-blue-50 rounded-[2.5rem] flex items-center justify-center overflow-hidden border-4 border-white shadow-xl flex-shrink-0">
          {(shop.photoURL && !logoError) ? (
            <img 
              src={shop.photoURL} 
              alt={shop.businessName} 
              className="w-full h-full object-cover" 
              onError={() => setLogoError(true)}
            />
          ) : (
            <Building2 size={64} className="text-blue-200" />
          )}
        </div>

        <div className="flex-grow space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Link to="/shops" className="p-2 hover:bg-gray-50 rounded-full transition-all text-gray-400 hover:text-blue-600">
                <ArrowLeft size={20} />
              </Link>
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{shop.category || 'Wholesaler'}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">{shop.businessName || shop.displayName}</h1>
          </div>

          <div className="flex flex-wrap gap-6 text-gray-500 font-medium">
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-gray-400" />
              <span>{shop.block}, Stall {shop.shopNo}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star size={18} className="text-amber-400 fill-amber-400" />
              <span className="font-bold text-gray-900">4.8</span>
              <span className="text-xs">(Verified)</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
              <Phone size={18} /> Call Sales
            </button>
            <button className="bg-green-500 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-green-600 transition-all shadow-lg shadow-green-500/20">
              <MessageCircle size={18} /> WhatsApp
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-gray-900">Wholesale Collection</h2>
          <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{products.length} Products Available</span>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
             <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                <ShoppingBag size={32} />
             </div>
             <h3 className="text-lg font-bold text-gray-900">No products listed yet</h3>
             <p className="text-gray-500">This wholesaler hasn't added products to their digital portfolio.</p>
          </div>
        )}
      </div>
    </div>
  );
}
