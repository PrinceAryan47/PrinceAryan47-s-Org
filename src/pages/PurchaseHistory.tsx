import React from 'react';
import { motion } from 'motion/react';
import { History, Download, ShoppingBag } from 'lucide-react';

const MOCK_HISTORY = [
  { id: '1', item: 'White Sugar 50Kg', qty: 10, total: 1850000, date: '2024-04-12' },
  { id: '2', item: 'Cooking Oil 20L', qty: 5, total: 650000, date: '2024-04-20' },
  { id: '3', item: 'Salt Pack 1kg x 40', qty: 20, total: 400000, date: '2024-05-02' },
];

export default function PurchaseHistory() {
  return (
    <div className="space-y-10 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Purchase History</h1>
          <p className="text-gray-500 tracking-tight">Your lifetime shopping behavior at HAM Grounds.</p>
        </div>
        <button className="bg-gray-100 text-gray-600 px-6 py-3 rounded-2xl text-xs font-black hover:bg-gray-200 transition-all flex items-center gap-2">
          Export data <Download size={16} />
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-gray-50/50">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Item Description</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Batch Qty</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Total Spent</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Action</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {MOCK_HISTORY.map((record) => (
                 <tr key={record.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-8 py-6 text-sm font-bold text-gray-500">{record.date}</td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                             <ShoppingBag size={14} />
                          </div>
                          <span className="font-bold text-gray-900">{record.item}</span>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-sm text-center font-black text-gray-900">{record.qty}</td>
                    <td className="px-8 py-6 text-sm text-right font-black text-blue-600">UGX {record.total.toLocaleString()}</td>
                    <td className="px-8 py-6 text-center">
                       <button className="text-gray-400 hover:text-blue-600 transition-colors">
                          <Download size={18} />
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
