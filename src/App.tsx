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

import About from './pages/About';
import Contact from './pages/Contact';

import Products from './pages/Products';
import Categories from './pages/Categories';
import Cart from './pages/Cart';

// Placeholder components for other routes
const Shops = () => <div className="p-20 text-center">Wholesale Shops Placeholder</div>;
const Profile = () => <div className="p-20 text-center">Buyer Profile Placeholder</div>;

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
                
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<div className="p-20 text-center">404 - Page Not Found</div>} />
              </Routes>
            </Suspense>
          </Layout>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
