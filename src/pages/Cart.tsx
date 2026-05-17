import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, MessageCircle, Phone, ArrowLeft, ShoppingBag, Loader2, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, writeBatch, doc } from 'firebase/firestore';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, totalAmount, cartCount, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const handleCheckout = async (type: 'whatsapp' | 'call') => {
    if (!user) {
      alert('Please log in to place an order.');
      return;
    }

    setLoading(true);
    try {
      // Group items by sellerId
      const groupedBySeller: { [key: string]: any[] } = {};
      items.forEach(item => {
        if (!groupedBySeller[item.sellerId]) {
          groupedBySeller[item.sellerId] = [];
        }
        groupedBySeller[item.sellerId].push(item);
      });

      // Create an order for each seller
      const orderIds: string[] = [];
      for (const sellerId in groupedBySeller) {
        const sellerItems = groupedBySeller[sellerId];
        const sellerTotal = sellerItems.reduce((acc, curr) => acc + (curr.wholesalePrice * curr.quantity), 0);
        
        const orderData = {
          buyerId: user.uid,
          buyerName: user.displayName || user.email,
          buyerPhone: (user as any).phoneNumber || '',
          sellerId: sellerId,
          sellerName: sellerItems[0].sellerName || 'Verified Wholesaler',
          items: sellerItems.map(i => ({
            productId: i.id,
            name: i.name,
            quantity: i.quantity,
            price: i.wholesalePrice,
            image: i.images?.[0] || null
          })),
          total: sellerTotal,
          status: 'New',
          createdAt: serverTimestamp(),
          contactMethod: type
        };

        const docRef = await addDoc(collection(db, 'orders'), orderData);
        orderIds.push(docRef.id);
      }

      setOrderComplete(true);
      clearCart();

      // Open WhatsApp if chosen
      if (type === 'whatsapp') {
        const message = encodeURIComponent(`Hello! I would like to confirm my order from Ham Grounds. Order Hash: ${orderIds[0].slice(-6).toUpperCase()}`);
        const phone = items[0].sellerWhatsapp?.replace(/[^0-9]/g, '') || '256750619853';
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
      }

    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to process order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-6">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto"
        >
          <CheckCircle2 size={48} />
        </motion.div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tighter">ORDER CONFIRMED!</h1>
        <p className="text-gray-500 max-w-sm mx-auto font-medium">
          Your wholesale order has been recorded. The wholesaler has been notified and expects your follow-up contact.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Link 
            to="/orders" 
            className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 shadow-xl shadow-blue-500/20"
          >
            Track Orders
          </Link>
          <Link 
            to="/products" 
            className="bg-gray-100 text-gray-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-200"
          >
            Continue Sourcing
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
          <ShoppingBag size={48} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Your bag is empty</h1>
        <p className="text-gray-500 max-w-sm mx-auto">
          Seems like you haven't added any wholesale deals yet. Start sourcing the best products for your business.
        </p>
        <Link 
          to="/products" 
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-4 mb-10">
        <Link to="/products" className="p-2 hover:bg-gray-100 rounded-full transition-all">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Your Wholesale Bag ({cartCount})</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <motion.div 
              key={item.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-6 relative"
            >
              <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0">
                <img 
                  src={item.images[0] || `https://picsum.photos/seed/${item.id}/200/200`} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-grow space-y-2">
                <div className="flex justify-between items-start">
                   <div>
                      <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500 font-medium">{item.sellerName || 'Verified Wholesaler'}</p>
                   </div>
                   <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                   >
                     <Trash2 size={20} />
                   </button>
                </div>
                <div className="flex flex-wrap items-baseline gap-4 pt-2">
                   <span className="text-lg font-black text-blue-600">UGX {item.wholesalePrice.toLocaleString()}</span>
                   <span className="text-xs text-gray-400">Min Order: {item.minQuantity} units</span>
                </div>
                <div className="flex items-center gap-4 pt-4">
                   <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 px-3 hover:bg-white rounded-lg transition-all"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-4 font-bold text-gray-800">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 px-3 hover:bg-white rounded-lg transition-all"
                      >
                        <Plus size={16} />
                      </button>
                   </div>
                   <div className="text-sm font-bold text-gray-400 underline decoration-gray-200 underline-offset-4">
                      Subtotal: UGX {(item.wholesalePrice * item.quantity).toLocaleString()}
                   </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="space-y-6">
           <div className="bg-gray-900 text-white p-8 rounded-[2.5rem] space-y-8 shadow-xl shadow-gray-200">
              <h2 className="text-2xl font-bold tracking-tight">Order Summary</h2>
              <div className="space-y-4 text-gray-400 text-sm">
                 <div className="flex justify-between">
                    <span>Selected items</span>
                    <span className="text-white font-medium">{cartCount} units</span>
                 </div>
                 <div className="flex justify-between border-t border-white/10 pt-4 text-lg">
                    <span className="text-white font-bold">Total (Est.)</span>
                    <span className="text-blue-400 font-black">UGX {totalAmount.toLocaleString()}</span>
                 </div>
              </div>

              <div className="space-y-4 pt-4">
                 <p className="text-xs text-gray-500 text-center">
                    Payment is handled directly via WhatsApp or Call with the wholesaler.
                 </p>
                 <button 
                    onClick={() => handleCheckout('whatsapp')}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 bg-green-600 text-white py-4 rounded-2xl font-bold hover:bg-green-700 transition-all text-lg shadow-lg shadow-green-600/20 disabled:opacity-50"
                 >
                    {loading ? <Loader2 className="animate-spin" size={24} /> : <MessageCircle size={24} />}
                    Confirm on WhatsApp
                 </button>
                 <button 
                    onClick={() => handleCheckout('call')}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all text-lg border border-gray-100 disabled:opacity-50"
                 >
                    {loading ? <Loader2 className="animate-spin" size={24} /> : <Phone size={24} />}
                    Connect via Direct Call
                 </button>
              </div>
           </div>

           <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl space-y-3">
              <h4 className="font-bold text-blue-900 flex items-center gap-2">
                 <ArrowLeft size={16} className="rotate-180" />
                 Safe Trading Tip
              </h4>
              <p className="text-xs text-blue-700 leading-relaxed">
                 Always verify the wholesaler at Ham Grounds before making significant bank transfers. For your first order, we recommend meeting at the physical stall for exchange.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}

