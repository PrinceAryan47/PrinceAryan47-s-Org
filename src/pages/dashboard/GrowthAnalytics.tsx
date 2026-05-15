import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Zap, 
  Target,
  ArrowUpRight,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWholesalerSales, useWholesalerProducts, useWholesalerExpenses } from '../../hooks/useDashboardData';

const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];

export default function GrowthAnalytics() {
  const { user } = useAuth();
  const { sales } = useWholesalerSales(user?.uid);
  const { products } = useWholesalerProducts(user?.uid);
  const { expenses } = useWholesalerExpenses(user?.uid);

  const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalGrossProfit = sales.reduce((sum, s) => sum + (s.profit || 0), 0);
  const totalExpenditure = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalGrossProfit - totalExpenditure;
  const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : '0';

  const categoryData = products.reduce((acc: any[], p) => {
    const existing = acc.find(a => a.name === p.category);
    if (existing) existing.value++;
    else acc.push({ name: p.category, value: 1 });
    return acc;
  }, []);

  const weeklyData = sales.slice(0, 10).reverse().map(s => ({
    name: new Date(s.createdAt).toLocaleDateString(undefined, { weekday: 'short' }),
    revenue: s.totalAmount,
    profit: s.profit || 0
  }));

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Growth Analytics</h1>
        <p className="text-gray-500">Deep dive into your business performance and market trends.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
           <div className="flex justify-between items-center">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                 <Zap size={20} />
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg flex items-center gap-1">
                 <ArrowUpRight size={14} /> +12%
              </span>
           </div>
           <div>
              <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
              <h3 className="text-3xl font-black text-gray-900">4.2%</h3>
           </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
           <div className="flex justify-between items-center">
              <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
                 <Target size={20} />
              </div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg flex items-center gap-1">
                 Live
              </span>
           </div>
           <div>
              <p className="text-sm font-medium text-gray-500">Profit Margin</p>
              <h3 className="text-3xl font-black text-gray-900">{profitMargin}%</h3>
           </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
           <div className="flex justify-between items-center">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                 <Users size={20} />
              </div>
              <span className="text-xs font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-lg flex items-center gap-1">
                 New
              </span>
           </div>
           <div>
              <p className="text-sm font-medium text-gray-500">Net Profit (Total)</p>
              <h3 className="text-3xl font-black text-gray-900">UGX {netProfit.toLocaleString()}</h3>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-8 flex justify-between items-center">
               Revenue vs Profit
               <button className="text-xs text-blue-600 font-bold hover:underline">Full Report</button>
            </h3>
            <div className="h-72">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyData}>
                    <defs>
                      <linearGradient id="growthRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#growthRev)" />
                    <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={4} fill="none" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-8">Inventory Distribution</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
               <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie
                           data={categoryData}
                           cx="50%"
                           cy="50%"
                           innerRadius={60}
                           outerRadius={80}
                           paddingAngle={5}
                           dataKey="value"
                        >
                           {categoryData.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                           ))}
                        </Pie>
                        <Tooltip />
                     </PieChart>
                  </ResponsiveContainer>
               </div>
               <div className="space-y-4">
                  {categoryData.map((cat, idx) => (
                     <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                           <span className="text-sm font-medium text-gray-600">{cat.name}</span>
                        </div>
                        <span className="text-sm font-bold text-gray-900">{cat.value} items</span>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>

      <div className="bg-blue-600 p-10 rounded-[3rem] shadow-2xl shadow-blue-500/20 text-white relative overflow-hidden">
         <div className="relative z-10 space-y-6 max-w-xl">
            <h2 className="text-3xl font-black">Ready to scale faster?</h2>
            <p className="text-blue-100 font-medium">Join our Premium Wholesaler Program to unlock higher visibility, advanced supply chain tools, and direct connections to regional distributors.</p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-2xl font-black text-sm hover:bg-blue-50 transition-all flex items-center gap-2">
               Learn More <ChevronRight size={18} />
            </button>
         </div>
         <TrendingUp size={300} className="absolute -right-20 -bottom-20 text-blue-500/20 rotate-12" />
      </div>
    </div>
  );
}
