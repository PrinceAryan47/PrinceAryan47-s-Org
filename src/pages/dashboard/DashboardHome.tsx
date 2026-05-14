import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Users, 
  Package, 
  ShoppingCart, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus,
  PackageSearch
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useWholesalerProducts, useWholesalerSales } from '../../hooks/useDashboardData';
import { db } from '../../firebase';
import { collection, query, where, onSnapshot, orderBy, limit, doc, updateDoc } from 'firebase/firestore';
import { Bell, CheckCircle2, Phone, MessageCircle } from 'lucide-react';

export default function DashboardHome() {
  const { user } = useAuth();
  const { products, loading: productsLoading } = useWholesalerProducts(user?.uid);
  const { sales, loading: salesLoading } = useWholesalerSales(user?.uid, 5);
  const [notifications, setNotifications] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'notifications'),
      where('wholesalerId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(10)
    );
    const unsub = onSnapshot(q, (snaps) => {
      setNotifications(snaps.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [user]);

  const markAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'notifications', id), { read: true });
    } catch (e) { console.error(e); }
  };

  const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalProfit = sales.reduce((sum, s) => sum + (s.profit || 0), 0);
  const lowStockCount = products.filter(p => p.stock < 10).length;

  const chartData = sales.slice(0, 7).reverse().map(s => ({
    name: new Date(s.createdAt).toLocaleDateString(undefined, { weekday: 'short' }),
    sales: s.totalAmount,
    profit: s.profit || 0
  }));
  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, Hammer Grounds Wholesaler!</h1>
          <p className="text-gray-500 text-sm">Here's your business performance summary for today.</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20 font-semibold">
          <Plus size={20} />
          <span>Daily Sale Entry</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: `UGX ${totalRevenue.toLocaleString()}`, icon: ShoppingCart, color: 'bg-blue-50 text-blue-600', trend: 'Lifetime', isUp: true },
          { label: 'Est. Profit', value: `UGX ${totalProfit.toLocaleString()}`, icon: TrendingUp, color: 'bg-green-50 text-green-600', trend: 'Lifetime', isUp: true },
          { label: 'Active Products', value: products.length.toString(), icon: Users, color: 'bg-purple-50 text-purple-600', trend: 'Market', isUp: true },
          { label: 'Low Stock Items', value: lowStockCount.toString(), icon: Package, color: 'bg-orange-50 text-orange-600', trend: 'Action Required', isUp: false },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.isUp ? 'text-green-600' : 'text-red-500'}`}>
                {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Notifications and Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Bell className="text-blue-600" size={18} />
              Buyer Inquiries
            </h3>
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse">
                New
              </span>
            )}
          </div>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`p-4 rounded-xl border transition-all ${
                    notif.read ? 'bg-gray-50 border-gray-50 opacity-60' : 'bg-blue-50 border-blue-100 shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-900 leading-relaxed">
                        {notif.message}
                      </p>
                      {(notif.buyerPhone || notif.buyerWhatsapp) && (
                        <div className="flex gap-2 pt-1">
                          {notif.buyerPhone && (
                            <a href={`tel:${notif.buyerPhone}`} className="text-[10px] flex items-center gap-1 text-blue-600 hover:underline font-bold">
                              <Phone size={10} /> {notif.buyerPhone}
                            </a>
                          )}
                          {notif.buyerWhatsapp && (
                            <a href={`https://wa.me/${notif.buyerWhatsapp}`} target="_blank" rel="noreferrer" className="text-[10px] flex items-center gap-1 text-green-600 hover:underline font-bold">
                              <MessageCircle size={10} /> {notif.buyerWhatsapp}
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                    {!notif.read && (
                      <button 
                        onClick={() => markAsRead(notif.id)}
                        className="text-blue-600 hover:text-blue-700 h-5 w-5 flex-shrink-0"
                      >
                        <CheckCircle2 size={16} />
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2">
                    {new Date(notif.createdAt?.seconds * 1000).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-20 text-gray-400 text-sm italic">
                No buyer inquiries yet.
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-gray-900">Revenue Records</h3>
            <select className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-2 py-1 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ stroke: '#2563eb', strokeWidth: 2 }}
                />
                <Area type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6">Recent Sales Ledger</h3>
          <div className="space-y-6">
            {salesLoading ? (
              <div className="animate-pulse space-y-4">
                {[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-gray-50 rounded-lg" />)}
              </div>
            ) : sales.length > 0 ? (
              sales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="font-bold text-sm text-gray-900 line-clamp-1">{sale.productName || 'Sale Record'}</p>
                    <p className="text-xs text-gray-400">{new Date(sale.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="font-bold text-sm text-blue-600">UGX {sale.totalAmount.toLocaleString()}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      sale.type === 'platform' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {sale.type}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-center text-gray-400 text-sm">
                 No sales recorded yet.
              </div>
            )}
            <Link to="/dashboard/ledger" className="block text-center w-full py-2 text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors bg-gray-50 rounded-xl hover:bg-blue-50">
              View Full Ledger
            </Link>
          </div>
        </div>
      </div>

      {/* Inventory Status Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-gray-900">Inventory Status</h3>
            <Link to="/dashboard/inventory" className="text-sm text-blue-600 font-semibold hover:underline">Manage All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-[10px] uppercase tracking-widest font-bold text-gray-400">
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">Stock Level</th>
                <th className="px-6 py-4">Min. Wholesale</th>
                <th className="px-6 py-4">Price (UGX)</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {productsLoading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-4 h-12 bg-gray-50" />
                  </tr>
                ))
              ) : products.length > 0 ? (
                products.slice(0, 5).map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.stock} units</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.minQuantity} units</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{item.wholesalePrice.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] px-2 py-1 rounded-md font-bold ${
                        item.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {item.stock > 10 ? 'In Stock' : 'Low Stock'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <PackageSearch size={32} />
                      <p className="text-sm">No products listed in your inventory.</p>
                      <Link to="/dashboard/inventory" className="text-blue-600 text-xs font-bold hover:underline">Add your first product</Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
