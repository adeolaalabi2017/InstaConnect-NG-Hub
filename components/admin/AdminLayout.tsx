
import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  LayoutDashboard, BarChart3, Megaphone, ShoppingCart, List, Settings, 
  FileText, Menu, X, Sun, Moon, LogOut, ChevronDown, Bell, Search, Globe, 
  Wallet, MessageSquare, Users
} from 'lucide-react';
import { Button } from './AdminComponents';
import { Permission } from '../../types';

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, logout, checkPermission } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect if not authorized
  React.useEffect(() => {
    if (user && !checkPermission('view_admin_dashboard')) {
      navigate('/');
    }
  }, [user, navigate, checkPermission]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  interface NavItem {
    name: string;
    path: string;
    icon: React.ElementType;
    permission?: Permission;
  }

  const navItems: NavItem[] = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Wallet', path: '/admin/orders', icon: Wallet, permission: 'manage_orders' },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Messages', path: '/admin/cms', icon: MessageSquare, permission: 'manage_content' }, // CMS/Messages
    { name: 'Listings', path: '/admin/listings', icon: List, permission: 'manage_listings' },
    { name: 'Customers', path: '/admin/marketing', icon: Users, permission: 'manage_users' },
    { name: 'Settings', path: '/admin/settings', icon: Settings, permission: 'manage_settings' },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F3F4F8] dark:bg-[#0B0E14] flex font-sans text-slate-900 dark:text-slate-50 transition-colors duration-300">
      
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#151923] border-r border-transparent dark:border-slate-800 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0 flex flex-col justify-between`}
      >
        <div>
            {/* Logo */}
            <div className="h-24 flex items-center px-8">
                <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-600/30">
                    I
                </div>
                <span className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">InstaAdmin</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="px-4 space-y-2">
                {navItems.map((item) => {
                    if (item.permission && !checkPermission(item.permission)) return null;
                    const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                    return (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                        isActive 
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-white'
                        }`}
                    >
                        <item.icon size={20} className={isActive ? 'text-white' : 'text-current'} />
                        {item.name}
                    </Link>
                    );
                })}
            </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-6 space-y-4">
            {/* Theme Toggle Switch */}
            <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded-full p-1.5 cursor-pointer" onClick={toggleTheme}>
                <div className={`p-2 rounded-full transition-all duration-300 ${theme === 'light' ? 'bg-white shadow-sm text-yellow-500' : 'text-gray-400'}`}>
                    <Sun size={16} />
                </div>
                <div className={`p-2 rounded-full transition-all duration-300 ${theme === 'dark' ? 'bg-slate-700 shadow-sm text-indigo-400' : 'text-gray-400'}`}>
                    <Moon size={16} />
                </div>
            </div>

            <button 
                onClick={logout}
                className="flex items-center gap-3 px-4 py-3 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 text-sm font-semibold transition-colors w-full"
            >
                <LogOut size={20} />
                Sign out
            </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-screen">
        
        {/* Header */}
        <header className="h-24 bg-[#F3F4F8] dark:bg-[#0B0E14] flex items-center justify-between px-8 pt-4">
            <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Hello, {user.name.split(' ')[0]}</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Welcome back to your dashboard</p>
            </div>

            <div className="flex items-center gap-6">
                <div className="hidden md:flex relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="pl-12 pr-4 py-3 rounded-2xl border-none bg-white dark:bg-[#151923] text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                    />
                </div>

                <button className="relative p-3 bg-white dark:bg-[#151923] rounded-xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <Bell size={20} className="text-gray-600 dark:text-gray-300" />
                    <span className="absolute top-2.5 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#151923]"></span>
                </button>

                <div className="flex items-center gap-3">
                    <img src={user.image} alt="" className="w-12 h-12 rounded-xl object-cover shadow-sm cursor-pointer" onClick={() => navigate('/profile')} />
                    <div className="hidden sm:block">
                        <p className="text-sm font-bold text-slate-900 dark:text-white leading-none mb-1">{user.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                </div>
            </div>
        </header>

        {/* Content Scroll Area */}
        <main className="flex-1 px-8 pb-8 overflow-y-auto custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
