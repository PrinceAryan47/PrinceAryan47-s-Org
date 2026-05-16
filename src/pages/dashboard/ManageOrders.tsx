import React from 'react';
import { motion } from 'motion/react';
import { 
  Package, 
  Search, 
  Filter, 
  ExternalLink,
  CheckCircle2,
  Clock,
  Truck,
  AlertCircle
} from 'lucide-react';

const ORDERS = [
  { id: 'ORD-101', customer: 'Sarah Kato', items: '2x Soda, 1x Sugar', total: 150000, status: 'New', time: '2 mins ago' },
  { id: 'ORD-102', customer: 'John Musoke', items: '5x Cooking Oil', total: 600000, status: 'Processing', time: '1 hour ago' },
  { id: 'ORD-103', customer: 'Grace Nakato', items: '10x Soap Pack', total: 85000, status: 'Ready', time: '3 hours ago' },
  { id: 'ORD-104', customer: 'Peter Okello', items: '1x Rice 50kg', total: 190000, status: 'Completed', time: '5 hours ago' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'New': return 'bg-blue-50 text-blue-600 border-blue-100';
    case 'Processing': return 'bg-amber-50 text-amber-600 border-amber-100';
    case 'Ready': return 'bg-purple-50 text-purple-600 border-purple-100';
    case 'Completed': return 'bg-green-50 text-green-600 border-green-100';
    default: return 'bg-gray-50 text-gray-600 border-gray-100';
  }
};

export default function ManageOrders() {
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
           { label: 'Pending', count: 12, icon: Clock, color: 'text-amber-500' },
           { label: 'Active', count: 5, icon: Truck, color: 'text-blue-500' },
           { label: 'Done', count: 148, icon: CheckCircle2, color: 'text-green-500' },
           { label: 'Alerts', count: 2, icon: AlertCircle, color: 'text-red-500' },
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
               {ORDERS.map((order) => (
                 <tr key={order.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-8 py-6 text-sm font-black text-gray-900">{order.id}</td>
                    <td className="px-8 py-6">
                       <div className="space-y-0.5">
                          <p className="font-bold text-gray-900">{order.customer}</p>
                          <p className="text-[10px] font-bold text-gray-400 italic">{order.time}</p>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-sm font-medium text-gray-600">{order.items}</td>
                    <td className="px-8 py-6 text-sm font-black text-gray-900">UGX {order.total.toLocaleString()}</td>
                    <td className="px-8 py-6">
                       <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                          {order.status}
                       </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                       <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all">
                          <ExternalLink size={18} />
                       </button>
                    </td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
