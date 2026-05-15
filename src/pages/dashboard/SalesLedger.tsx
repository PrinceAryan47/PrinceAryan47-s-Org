import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Download,
  Filter,
  DollarSign,
  PackageSearch,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { useWholesalerProducts, useWholesalerSales, useWholesalerExpenses } from '../../hooks/useDashboardData';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp, doc, runTransaction } from 'firebase/firestore';

export default function SalesLedger() {
  const { user } = useAuth();
  const { products } = useWholesalerProducts(user?.uid);
  const { sales, loading: salesLoading } = useWholesalerSales(user?.uid);
  const { expenses, loading: expensesLoading } = useWholesalerExpenses(user?.uid);
  
  const [activeTab, setActiveTab] = useState<'sales' | 'expenses'>('sales');
  const [isEntryOpen, setIsEntryOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [searchTerm, setSearchTerm] = useState('');

  // Form State - Sales
  const [saleEntry, setSaleEntry] = useState({
    productId: '',
    quantity: '1',
    pricePerUnit: '',
    totalAmount: ''
  });

  // Form State - Expenses
  const [expenseEntry, setExpenseEntry] = useState({
    description: '',
    amount: '',
    category: 'Operational'
  });

  const loading = salesLoading || expensesLoading;

  // Handle Product Selection - Autofill Price
  const handleProductSelect = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      const qty = Number(saleEntry.quantity) || 1;
      const price = product.wholesalePrice;
      setSaleEntry({
        ...saleEntry,
        productId,
        pricePerUnit: price.toString(),
        totalAmount: (price * qty).toString()
      });
    } else {
      setSaleEntry({ ...saleEntry, productId: '' });
    }
  };

  // Handle Quantity Change - Update Total
  const handleQuantityChange = (qtyStr: string) => {
    const qty = Number(qtyStr);
    const price = Number(saleEntry.pricePerUnit);
    setSaleEntry({
      ...saleEntry,
      quantity: qtyStr,
      totalAmount: (qty * price).toString()
    });
  };

  const handleSubmitSale = async (e: React.FormEvent) => {
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
          salePrice: Number(saleEntry.pricePerUnit),
          totalAmount: amount,
          costPrice: product.costPrice || 0,
          profit: profit,
          type: 'Manual Entry',
          createdAt: Date.now(),
        });

        // Update product stock
        transaction.update(productRef, { stock: newStock });
      });

      setIsEntryOpen(false);
      setSaleEntry({ productId: '', quantity: '1', pricePerUnit: '', totalAmount: '' });
    } catch (error) {
      console.error('Error recording sale:', error);
      alert('Error: ' + error);
    }
  };

  const handleSubmitExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await addDoc(collection(db, 'expenses'), {
        sellerId: user.uid,
        description: expenseEntry.description,
        amount: Number(expenseEntry.amount),
        category: expenseEntry.category,
        createdAt: Date.now()
      });

      setIsEntryOpen(false);
      setExpenseEntry({ description: '', amount: '', category: 'Operational' });
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Error adding expense');
    }
  };

  const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const grossProfit = sales.reduce((sum, s) => sum + (s.profit || 0), 0);
  const totalExpenditure = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = grossProfit - totalExpenditure;
  const remainingStock = products.reduce((sum, p) => sum + p.stock, 0);

  const getFilteredData = (data: any[]) => {
    const now = new Date();
    return data.filter(item => {
      const itemDate = new Date(item.createdAt);
      if (viewMode === 'daily') {
        return itemDate.toDateString() === now.toDateString();
      }
      if (viewMode === 'weekly') {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return itemDate >= weekAgo;
      }
      if (viewMode === 'monthly') {
        return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  };

  const periodSales = getFilteredData(sales);
  const periodExpenses = getFilteredData(expenses);

  const periodRevenue = periodSales.reduce((sum, s) => sum + s.totalAmount, 0);
  const periodGrossProfit = periodSales.reduce((sum, s) => sum + (s.profit || 0), 0);
  const periodExpenditure = periodExpenses.reduce((sum, e) => sum + e.amount, 0);
  const periodNetProfit = periodGrossProfit - periodExpenditure;

  const filteredSales = (searchTerm ? sales : periodSales).filter(s => 
    s.productName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredExpenses = (searchTerm ? expenses : periodExpenses).filter(e => 
    e.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">HAM GROUNDS Digital Ledger</h1>
          <p className="text-gray-500 text-sm font-medium">Track your daily sales, inventory, and business expenses.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex bg-gray-100 p-1 rounded-2xl">
            {['daily', 'weekly', 'monthly'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={`px-4 py-2 text-xs font-black rounded-xl transition-all capitalize ${
                  viewMode === mode ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
          <button 
            onClick={() => {
              setIsEntryOpen(!isEntryOpen);
              if (!isEntryOpen) setActiveTab('sales');
            }}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-2xl flex items-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 font-black text-sm"
          >
            <Plus size={20} />
            Record Transaction
          </button>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{viewMode} Revenue</p>
            <h3 className="text-2xl font-black mt-2 text-gray-900">UGX {periodRevenue.toLocaleString()}</h3>
            <div className="mt-4 flex items-center gap-1 text-green-500 font-bold text-xs">
              <ArrowUpRight size={14} /> Gross inflow
            </div>
          </div>
          <DollarSign className="absolute -right-4 -bottom-4 text-gray-50 opacity-10 group-hover:opacity-20 transition-opacity" size={120} />
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{viewMode} Expenses</p>
            <h3 className="text-2xl font-black mt-2 text-red-500">UGX {periodExpenditure.toLocaleString()}</h3>
            <div className="mt-4 flex items-center gap-1 text-red-400 font-bold text-xs">
              <ArrowDownLeft size={14} /> Business spending
            </div>
          </div>
          <Wallet className="absolute -right-4 -bottom-4 text-gray-50 opacity-10 group-hover:opacity-20 transition-opacity" size={120} />
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{viewMode} Net Profit</p>
            <h3 className={`text-2xl font-black mt-2 ${periodNetProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              UGX {periodNetProfit.toLocaleString()}
            </h3>
            <p className="mt-4 text-[10px] text-gray-400 font-bold uppercase">After all deductions</p>
          </div>
          <ArrowUpRight className="absolute -right-4 -bottom-4 text-gray-50 opacity-10 group-hover:opacity-20 transition-opacity" size={120} />
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Stock Health</p>
            <h3 className="text-2xl font-black mt-2 text-gray-900">{remainingStock} Units</h3>
            <div className="mt-4 flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '65%' }} />
              </div>
            </div>
          </div>
          <PackageSearch className="absolute -right-4 -bottom-4 text-gray-50 opacity-10 group-hover:opacity-20 transition-opacity" size={120} />
        </div>
      </div>

      {/* Transaction Entry Form */}
      <AnimatePresence>
        {isEntryOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white border border-gray-100 rounded-[2.5rem] shadow-xl overflow-hidden p-1"
          >
            <div className="flex p-2 bg-gray-50/50 rounded-[2.2rem]">
              <button 
                onClick={() => setActiveTab('sales')}
                className={`flex-1 py-4 rounded-3xl font-black text-sm transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'sales' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <ArrowUpRight size={18} /> Record Sale
              </button>
              <button 
                onClick={() => setActiveTab('expenses')}
                className={`flex-1 py-4 rounded-3xl font-black text-sm transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'expenses' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <ArrowDownLeft size={18} /> Record Expenditure
              </button>
            </div>

            <div className="p-10">
              {activeTab === 'sales' ? (
                <form onSubmit={handleSubmitSale} className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Product</label>
                    <select 
                      required
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm"
                      value={saleEntry.productId}
                      onChange={(e) => handleProductSelect(e.target.value)}
                    >
                      <option value="">Choose item...</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} (Stk: {p.stock})</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Quantity</label>
                    <input 
                      required
                      type="number" 
                      min="1"
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm" 
                      placeholder="Units" 
                      value={saleEntry.quantity}
                      onChange={(e) => handleQuantityChange(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Price per Unit</label>
                    <input 
                      required
                      type="number" 
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm" 
                      placeholder="UGX" 
                      value={saleEntry.pricePerUnit}
                      onChange={(e) => {
                        const price = e.target.value;
                        const qty = Number(saleEntry.quantity) || 1;
                        setSaleEntry({...saleEntry, pricePerUnit: price, totalAmount: (Number(price) * qty).toString()});
                      }}
                    />
                  </div>
                  <div className="flex flex-col justify-end">
                    <button type="submit" className="w-full py-3.5 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
                      Save Sale Record
                    </button>
                    <p className="text-[8px] text-gray-400 font-black uppercase text-center mt-2 tracking-tighter">Total: UGX {(Number(saleEntry.totalAmount) || 0).toLocaleString()}</p>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleSubmitExpense} className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-red-500 font-bold text-sm" 
                      placeholder="e.g. Transport, Rent, Lunch" 
                      value={expenseEntry.description}
                      onChange={(e) => setExpenseEntry({...expenseEntry, description: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Amount (UGX)</label>
                    <input 
                      required
                      type="number" 
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-red-500 font-bold text-sm" 
                      placeholder="Cost in UGX" 
                      value={expenseEntry.amount}
                      onChange={(e) => setExpenseEntry({...expenseEntry, amount: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                    <select 
                      required
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-red-500 font-bold text-sm"
                      value={expenseEntry.category}
                      onChange={(e) => setExpenseEntry({...expenseEntry, category: e.target.value})}
                    >
                      <option>Operational</option>
                      <option>Marketing</option>
                      <option>Utilities</option>
                      <option>Labor</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button type="submit" className="w-full py-3.5 bg-red-500 text-white rounded-2xl font-black text-sm hover:bg-red-600 transition-all shadow-lg shadow-red-500/20">
                      Record Expenditure
                    </button>
                  </div>
                </form>
              )}
            </div>
            <div className="bg-gray-50 px-10 py-3 text-[9px] font-black text-gray-400 uppercase tracking-widest border-t border-gray-100 flex justify-between">
              <span>* Daily financial integrity protected</span>
              <button onClick={() => setIsEntryOpen(false)} className="text-blue-600 hover:underline">Cancel Entry</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Combined Ledger Table */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex flex-wrap gap-6 items-center justify-between">
          <div className="flex items-center gap-6">
             <button 
              onClick={() => setActiveTab('sales')}
              className={`text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'sales' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-gray-400 hover:text-gray-600'}`}
             >
               Sales Ledger
             </button>
             <button 
              onClick={() => setActiveTab('expenses')}
              className={`text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'expenses' ? 'text-red-500 border-b-2 border-red-500 pb-1' : 'text-gray-400 hover:text-gray-600'}`}
             >
               Business Expenses
             </button>
          </div>
          <div className="flex gap-3">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input 
                  className="pl-9 pr-6 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-[10px] outline-none focus:ring-2 focus:ring-blue-500 font-bold" 
                  placeholder="Search records..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <button className="p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition-colors">
               <Filter size={18} />
             </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {activeTab === 'sales' ? (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-[10px] uppercase tracking-widest font-black text-gray-400 border-b border-gray-50">
                  <th className="px-8 py-5">Time/Date</th>
                  <th className="px-8 py-5">Product Details</th>
                  <th className="px-8 py-5">Qty</th>
                  <th className="px-8 py-5">Unit Price</th>
                  <th className="px-8 py-5">Total Sale</th>
                  <th className="px-8 py-5">Gross Profit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center text-sm font-bold text-gray-400">Loading ledger data...</td>
                  </tr>
                ) : filteredSales.length > 0 ? (
                  filteredSales.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                           <span className="text-xs font-black text-gray-900">{new Date(entry.createdAt).toLocaleDateString()}</span>
                           <span className="text-[10px] text-gray-400 font-bold">{new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-black">
                              {entry.productName?.charAt(0)}
                           </div>
                           <span className="text-sm font-black text-gray-900">{entry.productName}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm text-gray-600 font-black">{entry.quantity}</td>
                      <td className="px-8 py-6 text-sm text-gray-900 font-black">UGX {(entry.salePrice || (entry.totalAmount / entry.quantity)).toLocaleString()}</td>
                      <td className="px-8 py-6 text-sm font-black text-gray-900">UGX {entry.totalAmount.toLocaleString()}</td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col items-start">
                           <span className="text-sm font-black text-green-600">UGX {(entry.profit || 0).toLocaleString()}</span>
                           <span className="text-[9px] font-black text-gray-300 uppercase tracking-tighter">Margin: {(((entry.profit || 0) / entry.totalAmount) * 100).toFixed(0)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-8 py-24 text-center space-y-4">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200">
                        <PackageSearch size={40} />
                      </div>
                      <p className="text-gray-400 font-black uppercase text-xs tracking-widest">No sales records found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-[10px] uppercase tracking-widest font-black text-gray-400 border-b border-gray-50">
                  <th className="px-8 py-5">Time/Date</th>
                  <th className="px-8 py-5">Expenditure Description</th>
                  <th className="px-8 py-5">Category</th>
                  <th className="px-8 py-5 text-right">Amount (UGX)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-sm font-bold text-gray-400">Loading expenses...</td>
                  </tr>
                ) : filteredExpenses.length > 0 ? (
                  filteredExpenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                           <span className="text-xs font-black text-gray-900">{new Date(expense.createdAt).toLocaleDateString()}</span>
                           <span className="text-[10px] text-gray-400 font-bold">{new Date(expense.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm font-black text-gray-900">{expense.description}</td>
                      <td className="px-8 py-6">
                        <span className="text-[10px] px-3 py-1 bg-gray-100 rounded-lg font-black uppercase tracking-widest text-gray-500">
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-sm font-black text-red-600 text-right">
                        - UGX {expense.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-8 py-24 text-center space-y-4">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200">
                        <Wallet size={40} />
                      </div>
                      <p className="text-gray-400 font-black uppercase text-xs tracking-widest">No expenditure records</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
