import React, { useState } from 'react';
import { Menu, X, ShoppingCart, User, Search, Store, LayoutDashboard, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  onToggleSidebar?: () => void;
  showSidebarButton?: boolean;
}

export default function Navbar({ onToggleSidebar, showSidebarButton }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Categories', path: '/categories' },
    { name: 'Wholesale Shops', path: '/shops' },
    { name: 'Products', path: '/products' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-4">
            {showSidebarButton && (
              <button
                onClick={onToggleSidebar}
                className="p-2 rounded-md lg:hidden text-gray-600 hover:bg-gray-100"
              >
                <LayoutDashboard size={20} />
              </button>
            )}
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Store className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                HAM <span className="text-blue-600">Grounds</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  location.pathname === link.path ? 'text-blue-600' : 'text-gray-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <Search size={20} />
            </button>
            <Link to="/cart" className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors relative">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {user ? (
              <Link
                to={user.role === 'wholesaler' ? '/dashboard' : '/profile'}
                className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 overflow-hidden">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" />
                  ) : (
                    <User size={14} />
                  )}
                </div>
                <span className="text-xs font-semibold text-gray-700 hidden sm:inline">
                  {user.role === 'wholesaler' ? 'Dashboard' : 'Profile'}
                </span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-shadow hover:shadow-lg active:scale-95 duration-200"
              >
                Login
              </Link>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  {link.name}
                </Link>
              ))}
              {user && (
                <Link
                  to={user.role === 'wholesaler' ? '/dashboard' : '/profile'}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-3 py-3 text-base font-bold text-blue-600 hover:bg-blue-50 rounded-lg flex items-center gap-3"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 overflow-hidden border border-blue-200">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" />
                    ) : (
                      <User size={18} />
                    )}
                  </div>
                  {user.role === 'wholesaler' ? 'Merchant Dashboard' : 'My Account'}
                </Link>
              )}
              {!user ? (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-3 text-base font-medium text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  Login / Register
                </Link>
              ) : (
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
