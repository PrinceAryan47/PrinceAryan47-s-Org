/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

import About from './pages/About';
import Contact from './pages/Contact';

import Products from './pages/Products';
import Categories from './pages/Categories';
import Cart from './pages/Cart';

// Placeholder components for other routes
const Shops = () => <div className="p-20 text-center">Wholesale Shops Placeholder</div>;
const Profile = () => <div className="p-20 text-center text-gray-500 italic">User Profile Section - Coming Soon</div>;
const ManageOrders = () => <div className="p-20 text-center text-gray-500 italic">Order Management System - Coming Soon</div>;
const BuyerOrders = () => <div className="p-20 text-center text-gray-500 italic">My Orders - Coming Soon</div>;
const Favorites = () => <div className="p-20 text-center text-gray-500 italic">My Favorite Products - Coming Soon</div>;
const Inquiries = () => <div className="p-20 text-center text-gray-500 italic">My Inquiries - Coming Soon</div>;
const PurchaseHistory = () => <div className="p-20 text-center text-gray-500 italic">Purchase History - Coming Soon</div>;

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
                <Route path="/products" element={<Products />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/shops" element={<Shops />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                
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
                
                <Route path="*" element={<div className="p-20 text-center">404 - Page Not Found</div>} />
              </Routes>
            </Suspense>
          </Layout>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
