import React from 'react';
import { Link } from 'react-router-dom';
import { Store, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Store className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                HAM <span className="text-blue-400">Grounds</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              Uganda's leading wholesale marketplace connecting traders directly with wholesalers. 
              Modernizing trade through digital record keeping and inventory management.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-blue-400 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-blue-400 transition-colors"><Twitter size={20} /></a>
              <a href="#" className="hover:text-blue-400 transition-colors"><Instagram size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-6">Quick Links</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/products" className="hover:text-blue-400">Browse Products</Link></li>
              <li><Link to="/shops" className="hover:text-blue-400">Wholesale Shops</Link></li>
              <li><Link to="/categories" className="hover:text-blue-400">Categories</Link></li>
              <li><Link to="/about" className="hover:text-blue-400">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-blue-400">Contact</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-bold mb-6">Support</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/faq" className="hover:text-blue-400">FAQ</Link></li>
              <li><Link to="/terms" className="hover:text-blue-400">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-blue-400">Privacy Policy</Link></li>
              <li><Link to="/register-seller" className="hover:text-blue-400 font-semibold text-blue-400">Become a Seller</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-6">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="text-blue-400 shrink-0" size={18} />
                <span>Ham Shopping Grounds, Kampala, Uganda</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-blue-400 shrink-0" size={18} />
                <span>+256 750 619 853</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-blue-400 shrink-0" size={18} />
                <span>treasurekasumba47@gmail.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-gray-500 shrink-0" size={18} />
                <span className="text-gray-500 italic">info@hamgrounds.ug</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>&copy; {new Date().getFullYear()} HAM Grounds. All rights reserved.</p>
          <p className="font-bold text-blue-400 tracking-wider uppercase">Made by KASUMBA TREASURE</p>
          <p className="hidden md:block">Designed for Ugandan Wholesalers.</p>
        </div>
      </div>
    </footer>
  );
}
