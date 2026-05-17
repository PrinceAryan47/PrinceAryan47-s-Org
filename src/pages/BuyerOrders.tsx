import React from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Package, ChevronRight, Clock, CheckCircle2, Truck, Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBuyerOrders } from '../hooks/useDashboardData';

const getStatusStyles = (status: string) => {
  switch (status) {
    case 'Completed': return 'bg-green-50 text-green-600 border-green-100';
    case 'Shipped': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
    case 'Ready': return 'bg-purple-50 text-purple-600 border-purple-100';
    case 'Processing': return 'bg-amber-50 text-amber-600 border-amber-100';
    case 'New': return 'bg-blue-50 text-blue-600 border-blue-100';
    case 'Cancelled': return 'bg-red-50 text-red-600 border-red-100';
    default: return 'bg-gray-50 text-gray-600 border-gray-100';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Completed': return <CheckCircle2 size={14} />;
    case 'Shipped': 
    case 'Ready': return <Truck size={14} />;
    case 'Processing': 
    case 'New': return <Clock size={14} />;
    case 'Cancelled': return <AlertCircle size={14} />;
    default: return null;
  }
};

export default function BuyerOrders() {
  const { user } = useAuth();
  const { orders, loading } = useBuyerOrders(user?.uid);

  return (
    <div className="space-y-10 pb-20">
      <div>
        <h1 className="text-2xl font-black text-gray-900">My Orders</h1>
        <p className="text-gray-500 tracking-tight">Track your recent purchases and delivery status.</p>
      </div>

      <div className="space-y-4">
        {loading ? (
           <div className="py-20 text-center">
              <Loader2 className="animate-spin mx-auto text-blue-600 mb-4" size={40} />
              <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Loading your orders...</p>
           </div>
        ) : orders.map((order) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group bg-white rounded-[2.5rem] border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-6">
              <div className="h-14 w-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                <ShoppingCart size={24} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-gray-900">Order #{order.id.slice(-6).toUpperCase()}</h3>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border flex items-center gap-1.5 ${getStatusStyles(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </div>
                <p className="text-xs font-semibold text-gray-500">{order.sellerName} • {order.items?.length || 0} Items</p>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-10">
              <div className="text-right">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Order Amount</p>
                <p className="font-black text-gray-900">UGX {order.total?.toLocaleString()}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <ChevronRight size={20} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {!loading && orders.length === 0 && (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 p-20 text-center space-y-6">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
            <Package size={40} />
          </div>
          <div className="max-w-xs mx-auto">
            <h3 className="text-xl font-bold text-gray-900">No orders yet</h3>
            <p className="text-gray-500 text-sm mt-2">When you place orders, they will appear here for tracking.</p>
          </div>
          <Link 
            to="/products"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
          >
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
}

