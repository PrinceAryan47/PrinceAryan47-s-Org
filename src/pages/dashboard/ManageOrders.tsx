import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  Search, 
  Filter, 
  ExternalLink,
  CheckCircle2,
  Clock,
  Truck,
  AlertCircle,
  X,
  Edit2,
  Save,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWholesalerOrders } from '../../hooks/useDashboardData';
import { db } from '../../firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'New': return 'bg-blue-50 text-blue-600 border-blue-100';
    case 'Processing': return 'bg-amber-50 text-amber-600 border-amber-100';
    case 'Ready': return 'bg-purple-50 text-purple-600 border-purple-100';
    case 'Shipped': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
    case 'Completed': return 'bg-green-50 text-green-600 border-green-100';
    case 'Cancelled': return 'bg-red-50 text-red-600 border-red-100';
    default: return 'bg-gray-50 text-gray-600 border-gray-100';
  }
};

export default function ManageOrders() {
  const { user } = useAuth();
  const { orders, loading } = useWholesalerOrders(user?.uid);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    pending: orders.filter(o => o.status === 'New').length,
    active: orders.filter(o => ['Processing', 'Ready', 'Shipped'].includes(o.status)).length,
    done: orders.filter(o => o.status === 'Completed').length,
    alerts: orders.filter(o => o.status === 'Cancelled').length
  };

  const handleUpdateStatus = async () => {
    if (!editingOrder || !newStatus) return;
    setIsUpdating(true);
    try {
      await updateDoc(doc(db, 'orders', editingOrder.id), {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
      setEditingOrder(null);
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order status.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Manage Orders</h1>
          <p className="text-gray-500 tracking-tight">Process incoming requests and manage fulfilling shipments.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative">
              <input 
                type="text" 
                placeholder="Search orders..." 
                className="pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
           </div>
           <button className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-blue-600 hover:border-blue-100 transition-all">
              <Filter size={20} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: 'Pending', count: stats.pending, icon: Clock, color: 'text-amber-500' },
           { label: 'Active', count: stats.active, icon: Truck, color: 'text-blue-500' },
           { label: 'Done', count: stats.done, icon: CheckCircle2, color: 'text-green-500' },
           { label: 'Alerts', count: stats.alerts, icon: AlertCircle, color: 'text-red-500' },
         ].map((stat, i) => (
           <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-gray-50 ${stat.color}`}>
                 <stat.icon size={20} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                 <p className="text-xl font-black text-gray-900">{stat.count}</p>
              </div>
           </div>
         ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-gray-50/50">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Items</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {loading ? (
                 <tr>
                    <td colSpan={6} className="px-8 py-20 text-center">
                       <div className="flex flex-col items-center gap-2">
                          <Loader2 size={32} className="animate-spin text-blue-600" />
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading orders...</p>
                       </div>
                    </td>
                 </tr>
               ) : filteredOrders.length > 0 ? (
                 filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-blue-50/30 transition-colors group">
                     <td className="px-8 py-6 text-sm font-black text-gray-900">
                        {order.id.slice(-8).toUpperCase()}
                     </td>
                     <td className="px-8 py-6">
                        <div className="space-y-0.5">
                           <p className="font-bold text-gray-900">{order.customerName || 'Anonymous'}</p>
                           <p className="text-[10px] font-bold text-gray-400 italic">
                             {order.createdAt?.toDate?.() ? order.createdAt.toDate().toLocaleDateString() : 'Just now'}
                           </p>
                        </div>
                     </td>
                     <td className="px-8 py-6">
                        <div className="text-xs font-medium text-gray-600 max-w-xs line-clamp-1">
                           {order.items?.map((item: any) => `${item.quantity}x ${item.name}`).join(', ')}
                        </div>
                     </td>
                     <td className="px-8 py-6 text-sm font-black text-gray-900">UGX {order.total?.toLocaleString()}</td>
                     <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                           {order.status}
                        </span>
                     </td>
                     <td className="px-8 py-6">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => {
                              setEditingOrder(order);
                              setNewStatus(order.status);
                            }}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all"
                            title="Edit Status"
                          >
                             <Edit2 size={18} />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-white rounded-lg transition-all" title="View Details">
                             <ExternalLink size={18} />
                          </button>
                        </div>
                     </td>
                  </tr>
                 ))
               ) : (
                 <tr>
                    <td colSpan={6} className="px-8 py-20 text-center">
                       <p className="text-gray-500 font-medium">No orders found.</p>
                    </td>
                 </tr>
               )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Status Modal */}
      <AnimatePresence>
        {editingOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
              onClick={() => setEditingOrder(null)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 relative shadow-2xl space-y-6"
            >
               <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">Update Order Status</h3>
                  <button onClick={() => setEditingOrder(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                    <X size={20} />
                  </button>
               </div>

               <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-2xl space-y-1">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</p>
                     <p className="font-bold text-gray-900">#{editingOrder.id.slice(-8).toUpperCase()}</p>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">New Status</label>
                     <select 
                       className="w-full px-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-gray-700 appearance-none"
                       value={newStatus}
                       onChange={(e) => setNewStatus(e.target.value)}
                     >
                        <option value="New">New</option>
                        <option value="Processing">Processing</option>
                        <option value="Ready">Ready</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                     </select>
                  </div>

                  <button 
                    onClick={handleUpdateStatus}
                    disabled={isUpdating || newStatus === editingOrder.status}
                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-600/20 hover:bg-blue-700 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2 transition-all mt-4"
                  >
                    {isUpdating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Update Status
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

