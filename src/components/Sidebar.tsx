import React from 'react';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings, 
  LogOut, 
  HelpCircle,
  TrendingUp,
  History,
  BookOpen
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  role: 'buyer' | 'wholesaler';
}

export default function Sidebar({ role }: SidebarProps) {
  const buyerLinks = [
    { name: 'My Profile', icon: Users, path: '/profile' },
    { name: 'My Orders', icon: ShoppingCart, path: '/orders' },
    { name: 'My Favorites', icon: Package, path: '/favorites' },
    { name: 'Inquiries', icon: HelpCircle, path: '/inquiries' },
    { name: 'Purchase History', icon: History, path: '/history' },
  ];

  const wholesalerLinks = [
    { name: 'Dashboard', icon: BarChart3, path: '/dashboard' },
    { name: 'Inventory', icon: Package, path: '/dashboard/inventory' },
    { name: 'Manage Orders', icon: ShoppingCart, path: '/dashboard/orders' },
    { name: 'Sales Ledger', icon: BookOpen, path: '/dashboard/ledger' },
    { name: 'Growth Analytics', icon: TrendingUp, path: '/dashboard/analytics' },
    { name: 'Business Profile', icon: Settings, path: '/dashboard/settings' },
  ];

  const links = role === 'wholesaler' ? wholesalerLinks : buyerLinks;

  return (
    <div className="h-full bg-white border-r border-gray-100 flex flex-col pt-6">
      <div className="px-6 mb-8">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
          {role === 'wholesaler' ? 'Seller Panel' : 'Buyer Hub'}
        </h2>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={link.path === '/dashboard' || link.path === '/profile'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <link.icon size={18} />
            {link.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all w-full">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}
