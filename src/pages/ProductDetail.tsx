import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ShoppingBag, 
  MessageCircle, 
  Phone, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Truck, 
  Info,
  ChevronRight,
  Loader2,
  Package,
  Store,
  Plus,
  Minus,
  CheckCircle2
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [seller, setSeller] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    async function fetchProductData() {
      if (!id) return;
      setLoading(true);
      try {
        const productRef = doc(db, 'products', id);
        const productSnap = await getDoc(productRef);
        
        if (productSnap.exists()) {
          const pData = { id: productSnap.id, ...productSnap.data() } as Product;
          setProduct(pData);
          setQuantity(pData.minQuantity || 1);
          
          // Fetch Seller Info
          const sellerRef = doc(db, 'users', pData.sellerId);
          const sellerSnap = await getDoc(sellerRef);
          if (sellerSnap.exists()) {
            setSeller({ id: sellerSnap.id, ...sellerSnap.data() });
          }

          // Fetch Related Products
          const q = query(
            collection(db, 'products'), 
            where('category', '==', pData.category),
            where('__name__', '!=', id),
            limit(4)
          );
          const relatedSnap = await getDocs(q);
          setRelatedProducts(relatedSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProductData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-bold font-mono uppercase tracking-widest text-[10px]">Verifying Product Authenticity...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
           <Package size={40} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Product Not Found</h2>
        <p className="text-gray-500 max-w-sm mx-auto">This deal may have expired or the listing has been removed from the marketplace.</p>
        <Link to="/products" className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-blue-500/20">
           Browse All Deals
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      <div className="flex items-center gap-2 text-gray-400 text-sm font-bold">
        <Link to="/products" className="hover:text-blue-600 transition-colors">Marketplace</Link>
        <ChevronRight size={14} />
        <Link to={`/products?category=${product.category}`} className="hover:text-blue-600 transition-colors">{product.category}</Link>
        <ChevronRight size={14} />
        <span className="text-gray-900 truncate max-w-[200px] md:max-w-none">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* Images Column */}
        <div className="space-y-6">
           <div className="aspect-square bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden relative group">
              {(product.images && product.images.length > 0 && product.images[activeImage] && !imgError) ? (
                <img 
                  src={product.images[activeImage]} 
                  alt={product.name} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-200">
                   <Package size={120} />
                   <p className="text-sm font-bold text-gray-400 mt-4 uppercase tracking-widest">No Image available</p>
                </div>
              )}
              <div className="absolute top-6 left-6 bg-blue-600 text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                 Wholesale Only
              </div>
           </div>

           {product.images && product.images.length > 1 && (
             <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
                {product.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-24 h-24 rounded-2xl flex-shrink-0 border-4 transition-all overflow-hidden ${
                      activeImage === idx ? 'border-blue-600 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${product.name} view ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
             </div>
           )}
        </div>

        {/* Content Column */}
        <div className="space-y-8">
           <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <Link to={`/shops/${product.sellerId}`} className="flex items-center gap-2 bg-gray-100 hover:bg-blue-50 px-3 py-1.5 rounded-full transition-all group">
                    <Store size={14} className="text-gray-400 group-hover:text-blue-600" />
                    <span className="text-xs font-black text-gray-600 uppercase tracking-widest group-hover:text-blue-600">{product.sellerName}</span>
                 </Link>
                 <div className="h-1 w-1 bg-gray-300 rounded-full" />
                 <div className="flex items-center gap-1 text-amber-500">
                    <Star size={14} fill="currentColor" />
                    <span className="text-xs font-black tracking-tight">4.9</span>
                 </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-[1.1]">{product.name}</h1>
              <div className="flex items-center gap-6 pt-2">
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Wholesale Price</p>
                    <p className="text-4xl font-black text-gray-900">UGX {product.wholesalePrice.toLocaleString()}</p>
                 </div>
                 <div className="h-14 w-px bg-gray-100" />
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Min. Order</p>
                    <p className="text-2xl font-black text-gray-700">{product.minQuantity} Units</p>
                 </div>
              </div>
           </div>

           <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 space-y-6">
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Select Quantity</span>
                    <span className="text-xs font-bold text-gray-400">Inventory: {product.stock} units</span>
                 </div>
                 <div className="flex items-center bg-white border border-gray-100 rounded-2xl p-2">
                    <button 
                      onClick={() => setQuantity(Math.max(product.minQuantity || 1, quantity - 1))}
                      className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 rounded-xl transition-all"
                    >
                      <Minus size={20} />
                    </button>
                    <input 
                      type="number" 
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(product.minQuantity || 1, parseInt(e.target.value) || 1))}
                      className="flex-grow text-center font-black text-xl bg-transparent outline-none"
                    />
                    <button 
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 rounded-xl transition-all"
                    >
                      <Plus size={20} />
                    </button>
                 </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                 <button 
                   onClick={handleAddToCart}
                   className={`flex-[2] py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-xl ${
                     added 
                     ? 'bg-green-500 text-white shadow-green-500/20' 
                     : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20'
                   }`}
                 >
                   {added ? (
                     <><CheckCircle2 size={24} /> Added to Bag</>
                   ) : (
                     <><ShoppingBag size={24} /> Add to Order</>
                   )}
                 </button>
                 <button 
                    onClick={() => window.open(`https://wa.me/${product.sellerWhatsapp?.replace(/[^0-9]/g, '') || '256750619853'}`, '_blank')}
                    className="flex-1 bg-white border border-gray-100 text-gray-900 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-gray-50 transition-all shadow-lg shadow-gray-200/20"
                 >
                    <MessageCircle size={24} className="text-green-500" /> Inquiry
                 </button>
              </div>
           </div>

           <div className="space-y-6">
              <div className="flex items-center gap-4 text-sm font-bold text-gray-500">
                 <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-gray-300" />
                    Verified Wholesaler
                 </div>
                 <div className="h-1 w-1 bg-gray-300 rounded-full" />
                 <div className="flex items-center gap-2">
                    <Truck size={18} className="text-gray-300" />
                    Ham Grounds Pickup
                 </div>
              </div>

              <div className="space-y-3">
                 <h3 className="font-black text-xs uppercase tracking-widest text-gray-400">Market Description</h3>
                 <p className="text-gray-600 leading-relaxed font-medium">
                    {product.description || "No detailed description provided. This is a high-quality wholesale listing from Ham Shopping Grounds. Contact the wholesaler directly for bulk pricing negotiations and spec sheets."}
                 </p>
              </div>

              {/* Wholesaler Micro-Card */}
              <div className="p-6 bg-white border border-gray-50 rounded-[2rem] shadow-sm flex items-center justify-between group cursor-pointer hover:shadow-md transition-all" onClick={() => navigate(`/shops/${product.sellerId}`)}>
                 <div className="flex items-center gap-4">
                    <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                       <Building2 size={24} />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Wholesaler Presence</p>
                       <p className="font-bold text-gray-900">{product.sellerName}</p>
                    </div>
                 </div>
                 <ArrowLeft className="rotate-180 text-gray-300 group-hover:text-blue-600 transition-colors" size={20} />
              </div>
           </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-8 pt-10 border-t border-gray-100">
           <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-900">Recommended for your Store</h2>
              <Link to={`/products?category=${product.category}`} className="text-blue-600 font-bold text-sm hover:underline">View More →</Link>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
           </div>
        </div>
      )}
    </div>
  );
}

function Building2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  );
}
