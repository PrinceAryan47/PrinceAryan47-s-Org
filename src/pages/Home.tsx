import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ShoppingBag, ShieldCheck, Truck, BarChart3, ChevronRight, Star, PackageSearch } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';

const CATEGORIES = [
  { name: 'Fashion Clothing', icon: '👗', color: 'bg-indigo-50 text-indigo-600' },
  { name: 'Footwear & Leather', icon: '👞', color: 'bg-amber-50 text-amber-600' },
  { name: 'Home Textiles', icon: '🛌', color: 'bg-blue-50 text-blue-600' },
  { name: 'Cosmetics', icon: '💄', color: 'bg-pink-50 text-pink-600' },
  { name: 'Electronics', icon: '💻', color: 'bg-cyan-50 text-cyan-600' },
  { name: 'Stationery', icon: '📝', color: 'bg-gray-50 text-gray-600' },
];

export default function Home() {
  const { products, loading } = useProducts(8);

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[650px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2070"
            alt="Fashion Wholesale"
            className="w-full h-full object-cover brightness-[0.4]"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-white w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto space-y-8"
          >
            <div className="inline-flex items-center gap-2 bg-blue-600/30 backdrop-blur-md border border-white/20 px-5 py-2.5 rounded-full text-sm font-bold tracking-wide">
              <ShoppingBag size={18} />
              <span>Fashion, Electronics & Home Wholesales</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black leading-[1.1] tracking-tight">
              Grow Your <br />
              <span className="text-blue-400">Trading Empire.</span>
            </h1>
            <p className="text-xl text-gray-200 max-w-xl mx-auto font-medium">
              Source fashion, textiles, and electronics directly from verified wholesalers at Ham Grounds. 
              Manage your stock and records digitally.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-6">
              <Link to="/products" className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl font-black text-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-blue-500/40">
                Browse Products <ArrowRight size={22} />
              </Link>
              <Link to="/register" className="bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/30 text-white px-10 py-5 rounded-2xl font-black text-lg transition-all hover:scale-105 active:scale-95">
                Join as Wholesaler
              </Link>
            </div>
          </motion.div>
        </div>
      </section>


      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Explore Categories</h2>
            <p className="text-gray-500 mt-2">Find what you need from our verified wholesalers</p>
          </div>
          <Link to="/categories" className="text-blue-600 font-semibold flex items-center gap-1 hover:underline">
            View All <ChevronRight size={20} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <Link
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className={`p-6 rounded-3xl ${cat.color} flex flex-col items-center justify-center gap-4 cursor-pointer hover:shadow-lg transition-all h-full block`}
              >
                <span className="text-4xl">{cat.icon}</span>
                <span className="font-bold text-center">{cat.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Trending Wholesales</h2>
              <p className="text-gray-500 mt-2">Bulk deals currently moving fast in Kampala</p>
            </div>
            <Link to="/products" className="text-blue-600 font-semibold flex items-center gap-1 hover:underline">
              View All Deals <ChevronRight size={20} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded-3xl animate-pulse" />
              ))
            ) : products.length > 0 ? (
              products.map((product) => (
                <div key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
                  <PackageSearch size={32} />
                </div>
                <p className="text-gray-500 font-medium">No wholesale deals available yet.</p>
                <Link to="/register" className="inline-block text-blue-600 font-bold hover:underline">
                  Be the first to list products →
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Digitizing Trade in Uganda</h2>
        <p className="text-xl text-gray-500 mb-16">
          Ham Grounds isn't just a marketplace; it's a tool for business growth.
        </p>
        <div className="grid md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-xl font-bold">Trusted Sellers</h3>
            <p className="text-gray-500 text-sm">Every wholesaler is verified before listing. No more fraud.</p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto">
              <Truck size={32} />
            </div>
            <h3 className="text-xl font-bold">Bulk Logistics</h3>
            <p className="text-gray-500 text-sm">Integrated delivery options for large volume orders.</p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto">
              <BarChart3 size={32} />
            </div>
            <h3 className="text-xl font-bold">Smart Inventory</h3>
            <p className="text-gray-500 text-sm">Sellers get a digital ledger to track every sale automatically.</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          <div className="space-y-2">
            <div className="text-4xl font-black">500+</div>
            <div className="text-blue-100 text-sm font-medium uppercase tracking-wider">Wholesalers</div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-black">10K+</div>
            <div className="text-blue-100 text-sm font-medium uppercase tracking-wider">Products</div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-black">50K+</div>
            <div className="text-blue-100 text-sm font-medium uppercase tracking-wider">Monthly Orders</div>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-black">1B+</div>
            <div className="text-blue-100 text-sm font-medium uppercase tracking-wider">UGX Traded</div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-16">What Our Traders Say</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              name: "Nakamya Hajarah",
              role: "Retailer, Kalerwe Market",
              text: "Since I started using Ham Grounds, I don't have to spend hours in traffic going to downtown. I compare prices on my phone and order."
            },
            {
              name: "Musinguzi David",
              role: "Wholesaler, Gadget Master",
              text: "The digital ledger is a lifesaver. I can see my daily sales and profit without touching a calculator. My inventory is finally organized."
            }
          ].map((t, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex text-yellow-400 gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="text-gray-600 italic">"{t.text}"</p>
              <div>
                <p className="font-bold text-gray-900">{t.name}</p>
                <p className="text-sm text-gray-500">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
