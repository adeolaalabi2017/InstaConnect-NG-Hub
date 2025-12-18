
import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  LayoutDashboard, BarChart3, Megaphone, ShoppingCart, List, Settings, 
  FileText, Menu, X, Sun, Moon, LogOut, ChevronDown, Bell, Search, Globe 
} from 'lucide-react';
import { Button } from './AdminComponents';

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect if not admin (Safety check)
  React.useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Marketing', path: '/admin/marketing', icon: Megaphone },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Listings', path: '/admin/listings', icon: List },
    { name: 'CMS', path: '/admin/cms', icon: FileText },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300 font-sans text-slate-900 dark:text-slate-50">
      
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">
                I
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">InstaAdmin</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            <div className="mb-4">
              <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Overview</p>
              {navItems.slice(0, 2).map((item) => {
                const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <item.icon size={18} />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            <div className="mb-4">
              <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Management</p>
              {navItems.slice(2, 6).map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <item.icon size={18} />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            <div>
              <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Configuration</p>
              {navItems.slice(6).map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <item.icon size={18} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
                    <Menu size={20} />
                </Button>
                
                <div className="hidden md:flex relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search anything..." 
                        className="pl-9 pr-4 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm w-64 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
                <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2" onClick={() => navigate('/')}>
                    <Globe size={14} /> View Site
                </Button>

                <Button variant="ghost" size="icon" onClick={toggleTheme}>
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </Button>

                <Button variant="ghost" size="icon" className="relative">
                    <Bell size={18} />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full"></span>
                </Button>

                <div className="relative">
                    <button 
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <img src={user.image} alt="" className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700" />
                        <ChevronDown size={14} className="text-slate-500 hidden sm:block" />
                    </button>
                    
                    {isUserMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-md shadow-lg border border-slate-200 dark:border-slate-800 py-1 z-50">
                            <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800">
                                <p className="text-sm font-medium text-slate-900 dark:text-white">Administrator</p>
                            </div>
                            <Link to="/profile" className="block px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">Profile</Link>
                            <Link to="/admin/settings" className="block px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">Settings</Link>
                            <div className="border-t border-slate-200 dark:border-slate-800 my-1"></div>
                            <button 
                                onClick={logout}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                            >
                                Sign out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
