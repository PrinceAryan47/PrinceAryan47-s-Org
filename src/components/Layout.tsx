import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  // Check if we are in a dashboard route
  const isDashboard = location.pathname.startsWith('/dashboard') || location.pathname === '/profile';

  if (isDashboard && user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} showSidebarButton />
        <div className="flex-1 flex overflow-hidden">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <Sidebar role={user.role} />
          </aside>

          {/* Mobile Sidebar Overlay */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 z-40 lg:hidden bg-gray-900/50 backdrop-blur-sm"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Mobile Sidebar */}
          <aside className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out lg:hidden
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}>
            <Sidebar role={user.role} />
          </aside>

          <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
