
import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  LayoutDashboard, BarChart3, Megaphone, ShoppingCart, List, Settings, 
  FileText, Menu, X, Sun, Moon, LogOut, ChevronDown, Bell, Search, Globe, 
  Wallet, MessageSquare, Users, TrendingUp, Activity, File, BookOpen, Mail, HelpCircle, MessageSquareQuote, Layout
} from 'lucide-react';
import { Button } from './AdminComponents';
import { Permission } from '../../types';

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
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
  
  const toggleMenu = (name: string) => {
    setOpenMenus(prev => ({ ...prev, [name]: !prev[name] }));
  };

  interface NavItem {
    name: string;
    path: string;
    icon: React.ElementType;
    permission?: Permission;
    children?: NavItem[];
  }

  const navItems: NavItem[] = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Wallet', path: '/admin/orders', icon: Wallet, permission: 'manage_orders' },
    { 
      name: 'Analytics', 
      path: '/admin/analytics', 
      icon: BarChart3,
      children: [
        { name: 'Overview', path: '/admin/analytics', icon: LayoutDashboard },
        { name: 'Traffic Reports', path: '/admin/analytics/traffic', icon: TrendingUp },
        { name: 'User Insights', path: '/admin/analytics/insights', icon: Users },
        { name: 'Real-time', path: '/admin/analytics/realtime', icon: Activity },
        { name: 'Custom Reports', path: '/admin/analytics/custom', icon: FileText },
      ]
    },
    { 
      name: 'Content', 
      path: '/admin/content', 
      icon: FileText, 
      permission: 'manage_content',
      children: [
        { name: 'Site Config', path: '/admin/content/config', icon: Layout },
        { name: 'CMS Pages', path: '/admin/content/pages', icon: File },
        { name: 'Blog', path: '/admin/content/blog', icon: BookOpen },
        { name: 'Newsletters', path: '/admin/content/newsletters', icon: Mail },
        { name: 'FAQ', path: '/admin/content/faq', icon: HelpCircle },
        { name: 'Testimonials', path: '/admin/content/testimonials', icon: MessageSquareQuote },
      ]
    }, 
    { name: 'Listings', path: '/admin/listings', icon: List, permission: 'manage_listings' },
    { name: 'Customers', path: '/admin/marketing', icon: Users, permission: 'manage_users' },
    { name: 'Settings', path: '/admin/settings', icon: Settings, permission: 'manage_settings' },
  ];

  // Auto-expand menu if child is active
  useEffect(() => {
    const activeParent = navItems.find(item => item.children?.some(child => location.pathname === child.path));
    if (activeParent && !openMenus[activeParent.name]) {
        setOpenMenus(prev => ({ ...prev, [activeParent.name]: true }));
    }
  }, [location.pathname]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F3F4F8] dark:bg-[#0B0E14] flex font-sans text-slate-900 dark:text-slate-50 transition-colors duration-300">
      
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#151923] border-r border-transparent dark:border-slate-800 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0 flex flex-col justify-between`}
      >
        <div className="overflow-y-auto custom-scrollbar flex-1">
            {/* Logo */}
            <div className="h-24 flex items-center px-8 sticky top-0 bg-white dark:bg-[#151923] z-10">
                <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-600/30">
                    I
                </div>
                <span className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">InstaAdmin</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="px-4 space-y-2 mb-6">
                {navItems.map((item) => {
                    if (item.permission && !checkPermission(item.permission)) return null;
                    
                    const hasChildren = item.children && item.children.length > 0;
                    const isChildActive = item.children?.some(child => location.pathname === child.path);
                    const isActive = location.pathname === item.path || isChildActive;
                    const isOpen = openMenus[item.name];

                    return (
                    <div key={item.name}>
                        <div
                            onClick={() => hasChildren ? toggleMenu(item.name) : navigate(item.path)}
                            className={`flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                            isActive && !hasChildren
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-white'
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <item.icon size={20} className={isActive && !hasChildren ? 'text-white' : 'text-current'} />
                                {item.name}
                            </div>
                            {hasChildren && (
                                <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                            )}
                        </div>

                        {/* Dropdown Items */}
                        {hasChildren && isOpen && (
                            <div className="mt-1 ml-4 space-y-1 border-l-2 border-indigo-100 dark:border-gray-800 pl-3">
                                {item.children?.map(child => {
                                    const isChildLinkActive = location.pathname === child.path;
                                    return (
                                        <Link
                                            key={child.path}
                                            to={child.path}
                                            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                                                isChildLinkActive 
                                                ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300' 
                                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                                            }`}
                                        >
                                            {/* Optional: Add icon for sub-items too if needed, here keeping it simple */}
                                            {child.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    );
                })}
            </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-6 space-y-4 bg-white dark:bg-[#151923]">
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
