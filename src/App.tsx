/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardHome from './pages/dashboard/DashboardHome';
import InventoryList from './pages/dashboard/InventoryList';
import SalesLedger from './pages/dashboard/SalesLedger';
import GrowthAnalytics from './pages/dashboard/GrowthAnalytics';
import BusinessProfile from './pages/dashboard/BusinessProfile';
import ManageOrders from './pages/dashboard/ManageOrders';

import About from './pages/About';
import Contact from './pages/Contact';
import Products from './pages/Products';
import Categories from './pages/Categories';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Shops from './pages/Shops';
import ShopDetail from './pages/ShopDetail';
import Profile from './pages/Profile';
import BuyerOrders from './pages/BuyerOrders';
import Favorites from './pages/Favorites';
import Inquiries from './pages/Inquiries';
import PurchaseHistory from './pages/PurchaseHistory';

// Simple text pages for legal & FAQ
const FAQ = () => <div className="max-w-3xl mx-auto py-20 px-4 space-y-8">
  <h1 className="text-4xl font-black text-gray-900 mb-10">Frequently Asked Questions</h1>
  <div className="space-y-6">
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
      <h3 className="font-bold text-lg text-blue-600 mb-2">How do I register as a wholesaler?</h3>
      <p className="text-gray-600">Choose the "Wholesaler" option during registration. You will need to provide your shop number and block at HAM Grounds.</p>
    </div>
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
      <h3 className="font-bold text-lg text-blue-600 mb-2">Is there a minimum order quantity?</h3>
      <p className="text-gray-600">Yes, each wholesaler sets their own MOQ for products. This is clearly displayed on the product cards.</p>
    </div>
  </div>
</div>;

const Terms = () => <div className="max-w-3xl mx-auto py-20 px-4">
  <h1 className="text-4xl font-black text-gray-900 mb-10">Terms of Service</h1>
  <div className="prose prose-blue text-gray-600">
    <p className="mb-4">Welcome to HAM Grounds. By using our platform, you agree to comply with our trading standards and policies.</p>
    <p>We facilitate connections between traders and wholesalers but are not responsible for individual trade disputes.</p>
  </div>
</div>;

const Privacy = () => <div className="max-w-3xl mx-auto py-20 px-4">
  <h1 className="text-4xl font-black text-gray-900 mb-10">Privacy Policy</h1>
  <p className="text-gray-600">We respect your privacy and only use your data to facilitate trading and analytics within the HAM Grounds ecosystem.</p>
</div>;

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Layout>
            <Suspense fallback={<div className="h-screen w-full flex items-center justify-center font-bold text-blue-600">Loading...</div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/register-seller" element={<Register />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/shops" element={<Shops />} />
                <Route path="/shops/:id" element={<ShopDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                
                {/* Legal & Help */}
                <Route path="/faq" element={<FAQ />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                
                {/* Dashboard Subroutes */}
                <Route path="/dashboard" element={<DashboardHome />} />
                <Route path="/dashboard/inventory" element={<InventoryList />} />
                <Route path="/dashboard/ledger" element={<SalesLedger />} />
                <Route path="/dashboard/orders" element={<ManageOrders />} />
                <Route path="/dashboard/analytics" element={<GrowthAnalytics />} />
                <Route path="/dashboard/settings" element={<BusinessProfile />} />
                
                {/* Buyer Hub Routes */}
                <Route path="/profile" element={<Profile />} />
                <Route path="/orders" element={<BuyerOrders />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/inquiries" element={<Inquiries />} />
                <Route path="/history" element={<PurchaseHistory />} />
                
                <Route path="*" element={<div className="p-20 text-center flex flex-col items-center gap-6">
                  <span className="text-6xl font-black text-gray-200 uppercase tracking-widest">404</span>
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold text-gray-900">Oops! Page not found</h2>
                    <p className="text-gray-500">The link you followed may be broken or the page has been removed.</p>
                  </div>
                  <Link to="/" className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-blue-500/20">Back Home</Link>
                </div>} />
              </Routes>
            </Suspense>
          </Layout>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
