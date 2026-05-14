import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Download,
  Filter,
  DollarSign,
  PackageSearch
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { useWholesalerProducts, useWholesalerSales } from '../../hooks/useDashboardData';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp, doc, runTransaction } from 'firebase/firestore';

export default function SalesLedger() {
  const { user } = useAuth();
  const { products } = useWholesalerProducts(user?.uid);
  const { sales, loading } = useWholesalerSales(user?.uid);
  const [isEntryOpen, setIsEntryOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [saleEntry, setSaleEntry] = useState({
    productId: '',
    quantity: '',
    totalAmount: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !saleEntry.productId) return;

    const product = products.find(p => p.id === saleEntry.productId);
    if (!product) return;

    const qty = Number(saleEntry.quantity);
    const amount = Number(saleEntry.totalAmount);
    const cost = (product.costPrice || 0) * qty;
    const profit = amount - cost;

    try {
      await runTransaction(db, async (transaction) => {
        const productRef = doc(db, 'products', product.id);
        const productDoc = await transaction.get(productRef);
        
        if (!productDoc.exists()) throw "Product does not exist!";
        
        const newStock = productDoc.data().stock - qty;
        if (newStock < 0) throw "Insufficient stock!";

        // Add sale entry
        const saleRef = collection(db, 'sales');
        transaction.set(doc(saleRef), {
          sellerId: user.uid,
          productId: product.id,
          productName: product.name,
          quantity: qty,
          totalAmount: amount,
          profit: profit,
          type: 'Manual Entry',
          createdAt: Date.now(), // serverTimestamp() doesn't work inside transactions directly for some versions, using Date.now() for simplicity or handle separately
        });

        // Update product stock
        transaction.update(productRef, { stock: newStock });
      });

      setIsEntryOpen(false);
      setSaleEntry({ productId: '', quantity: '', totalAmount: '' });
      alert('Sale recorded successfully!');
    } catch (error) {
      console.error('Error recording sale:', error);
      alert('Error: ' + error);
    }
  };

  const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalProfit = sales.reduce((sum, s) => sum + (s.profit || 0), 0);
  const totalCosts = totalRevenue - totalProfit;
  const remainingStock = products.reduce((sum, p) => sum + p.stock, 0);

  const filteredSales = sales.filter(s => 
    s.productName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Ledger & Inventory Tracking</h1>
          <p className="text-gray-500 text-sm">Real-time tracking of cost, revenue, and product remainder.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex bg-gray-100 p-1 rounded-xl">
            {['daily', 'weekly', 'monthly'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all capitalize ${
                  viewMode === mode ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl flex items-center gap-2 hover:bg-gray-50 transition-all font-semibold text-sm">
            <Download size={18} />
             Reports
          </button>
          <button 
            onClick={() => setIsEntryOpen(!isEntryOpen)}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 font-semibold"
          >
            <Plus size={20} />
            Record Goods Sold
          </button>
        </div>
      </div>

      {/* Summary Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{viewMode} Revenue</p>
          <h3 className="text-2xl font-black mt-2 text-blue-600">UGX {totalRevenue.toLocaleString()}</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{viewMode} Profit</p>
          <h3 className="text-2xl font-black mt-2 text-green-600">UGX {totalProfit.toLocaleString()}</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{viewMode} Costs</p>
          <h3 className="text-2xl font-black mt-2 text-red-500">UGX {totalCosts.toLocaleString()}</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Remaining Stock</p>
          <h3 className="text-2xl font-black mt-2 text-gray-900">{remainingStock} Units</h3>
        </div>
      </div>


      {/* Manual Entry Form */}
      {isEntryOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="bg-blue-50 border border-blue-100 p-6 rounded-3xl space-y-6 overflow-hidden"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-blue-900 flex items-center gap-2">
              <DollarSign className="text-blue-600" size={20} />
              New Daily Sale Input
            </h3>
            <button onClick={() => setIsEntryOpen(false)} className="text-xs font-bold text-blue-600 hover:underline">Close Form</button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1">
               <label className="text-xs font-bold text-blue-700">Select Product</label>
               <select 
                required
                className="w-full bg-white border border-blue-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                value={saleEntry.productId}
                onChange={(e) => setSaleEntry({...saleEntry, productId: e.target.value})}
               >
                 <option value="">Choose...</option>
                 {products.map(p => (
                   <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</option>
                 ))}
               </select>
            </div>
            <div className="space-y-1">
               <label className="text-xs font-bold text-blue-700">Quantity Sold</label>
               <input 
                required
                type="number" 
                className="w-full bg-white border border-blue-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm" 
                placeholder="Units..." 
                value={saleEntry.quantity}
                onChange={(e) => setSaleEntry({...saleEntry, quantity: e.target.value})}
               />
            </div>
            <div className="space-y-1">
               <label className="text-xs font-bold text-blue-700">Sale Price (UGX)</label>
               <input 
                required
                type="number" 
                className="w-full bg-white border border-blue-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm" 
                placeholder="Total selling price..." 
                value={saleEntry.totalAmount}
                onChange={(e) => setSaleEntry({...saleEntry, totalAmount: e.target.value})}
               />
            </div>
            <div className="flex items-end">
               <button type="submit" className="w-full h-[41px] bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all">Record Sale</button>
            </div>
          </form>
          <p className="text-[10px] text-blue-600/60">* Inventory will automatically deduct after recording this sale.</p>
        </motion.div>
      )}

      {/* Ledger Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-wrap gap-4 items-center justify-between">
          <h3 className="font-bold text-gray-900">Growth Ledger History</h3>
          <div className="flex gap-2">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input 
                  className="pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="Search entries..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <button className="p-2 border border-gray-100 rounded-lg text-gray-400 hover:bg-gray-50">
               <Filter size={16} />
             </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-[10px] uppercase tracking-widest font-bold text-gray-400">
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Product Details</th>
                <th className="px-6 py-4">Qty</th>
                <th className="px-6 py-4">Sale Amount</th>
                <th className="px-6 py-4">Gross Profit</th>
                <th className="px-6 py-4">Channel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">Loading ledger...</td>
                </tr>
              ) : filteredSales.length > 0 ? (
                filteredSales.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{entry.productName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-bold">{entry.quantity}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">UGX {entry.totalAmount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-bold text-green-600">UGX {(entry.profit || 0).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] px-2 py-1 rounded-md font-bold ${
                        entry.type === 'Manual Entry' ? 'bg-gray-100 text-gray-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {entry.type}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center space-y-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
                      <PackageSearch size={32} />
                    </div>
                    <p className="text-gray-500 font-medium">No sales recorded yet.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-gray-50 text-center">
            <button className="text-xs font-bold text-blue-600 hover:underline">View Older Records</button>
        </div>
      </div>
    </div>
  );
}
