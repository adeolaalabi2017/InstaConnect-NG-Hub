
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Plus, User as UserIcon, LogOut, Settings, LayoutDashboard, Shield, Trophy, Moon, Sun, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path: string) => location.pathname === path ? 'text-primary font-semibold' : 'text-graytext dark:text-gray-300 hover:text-dark dark:hover:text-white';

  return (
    <div className="min-h-screen flex flex-col">
      {/* Glassmorphic Header */}
      <header className="fixed w-full top-0 z-50 glass border-b border-white/40 dark:border-white/10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
                  I
                </div>
                <span className="text-xl sm:text-2xl font-bold text-dark dark:text-white transition-colors">InstaConnect NG</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6">
              <Link to="/" className={isActive('/')}>Home</Link>
              <Link to="/listings" className={isActive('/listings')}>Listings</Link>
              <Link to="/top-rated" className={isActive('/top-rated')}>Reviews</Link>
              <Link to="/events" className={isActive('/events')}>Events</Link>
              <Link to="/community" className={isActive('/community')}>Community</Link>
              <Link to="/contact" className={isActive('/contact')}>Contact</Link>
            </nav>

            {/* User Profile & Actions */}
            <div className="hidden md:flex items-center space-x-4">
              
              {/* Theme Toggle Desktop */}
              <button 
                onClick={toggleTheme} 
                className="p-2 rounded-full text-graytext hover:text-dark dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
                title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {user ? (
                <>
                  <div className="relative">
                    <button 
                      onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                      className="flex items-center space-x-2 focus:outline-none"
                    >
                      <img 
                        src={user.image} 
                        alt={user.name} 
                        className="h-10 w-10 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-sm"
                      />
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium text-dark dark:text-white leading-tight">{user.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${user.role === 'vendor' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300' : user.role === 'admin' ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
                          {user.role}
                        </span>
                      </div>
                      <ChevronDown size={16} className="text-graytext dark:text-gray-400" />
                    </button>

                    {/* Dropdown */}
                    {isProfileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in-down origin-top-right border border-gray-100 dark:border-gray-700">
                        
                        <div className="flex justify-between items-center px-4 py-2 border-b border-gray-100 dark:border-gray-700 mb-1">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Menu</span>
                            <button 
                                onClick={() => setIsProfileDropdownOpen(false)}
                                className="text-gray-400 hover:text-dark dark:hover:text-white transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <X size={14} />
                            </button>
                        </div>

                        {user.role === 'admin' && (
                            <Link 
                              to="/admin" 
                              onClick={() => setIsProfileDropdownOpen(false)}
                              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                            >
                                <Shield size={16} /> Admin Panel
                            </Link>
                        )}

                        {user.role === 'vendor' && (
                            <Link 
                              to="/dashboard" 
                              onClick={() => setIsProfileDropdownOpen(false)}
                              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                            >
                                <LayoutDashboard size={16} /> Business Dashboard
                            </Link>
                        )}
                        
                        <Link 
                          to="/profile" 
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                        >
                          <UserIcon size={16} /> Profile & Rewards
                        </Link>
                        <Link 
                          to="/settings" 
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                        >
                          <Settings size={16} /> Settings
                        </Link>
                        <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                        <button 
                          onClick={() => {
                            logout();
                            setIsProfileDropdownOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                        >
                          <LogOut size={16} /> Sign out
                        </button>
                      </div>
                    )}
                  </div>

                  {user.role === 'vendor' && (
                    <Link 
                      to="/add-listing"
                      className="flex items-center gap-1 bg-primary hover:bg-red-600 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors shadow-lg shadow-red-500/30"
                    >
                      <Plus size={16} />
                      <span>Add Listing</span>
                    </Link>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login" className="text-graytext hover:text-dark dark:text-gray-300 dark:hover:text-white font-medium px-3 py-2">Log in</Link>
                  <Link to="/signup" className="bg-dark dark:bg-white dark:text-dark hover:bg-gray-800 dark:hover:bg-gray-200 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors">Sign up</Link>
                </div>
              )}
            </div>

            {/* Mobile menu button & Theme toggle */}
            <div className="flex items-center gap-3 md:hidden">
              <button 
                  onClick={toggleTheme} 
                  className="p-2 rounded-full text-graytext dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10"
                >
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-graytext hover:text-dark dark:text-gray-300 dark:hover:text-white focus:outline-none"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden glass border-t border-white/20 dark:border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-dark dark:text-white hover:bg-gray-50 dark:hover:bg-white/10">Home</Link>
              <Link to="/listings" className="block px-3 py-2 rounded-md text-base font-medium text-dark dark:text-white hover:bg-gray-50 dark:hover:bg-white/10">Listings</Link>
              <Link to="/top-rated" className="block px-3 py-2 rounded-md text-base font-medium text-dark dark:text-white hover:bg-gray-50 dark:hover:bg-white/10">Reviews</Link>
              <Link to="/events" className="block px-3 py-2 rounded-md text-base font-medium text-dark dark:text-white hover:bg-gray-50 dark:hover:bg-white/10">Events</Link>
              <Link to="/community" className="block px-3 py-2 rounded-md text-base font-medium text-dark dark:text-white hover:bg-gray-50 dark:hover:bg-white/10">Community</Link>
              <Link to="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-dark dark:text-white hover:bg-gray-50 dark:hover:bg-white/10">Contact</Link>
            </div>
            <div className="pt-4 pb-4 border-t border-gray-200 dark:border-gray-700">
              {user ? (
                <>
                  <div className="flex items-center px-5 mb-2">
                    <div className="flex-shrink-0">
                      <img className="h-10 w-10 rounded-full object-cover" src={user.image} alt="" />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium leading-none text-dark dark:text-white flex items-center gap-2">
                        {user.name}
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${user.role === 'vendor' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300' : user.role === 'admin' ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
                          {user.role}
                        </span>
                      </div>
                      <div className="text-sm font-medium leading-none text-gray-500 dark:text-gray-400 mt-1">{user.email}</div>
                    </div>
                  </div>
                  <div className="mt-3 px-2 space-y-1">
                    {user.role === 'admin' && (
                        <Link to="/admin" className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10">Admin Panel</Link>
                    )}
                    {user.role === 'vendor' && (
                       <>
                           <Link to="/dashboard" className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10">Business Dashboard</Link>
                           <Link to="/add-listing" className="block w-full text-center px-3 py-3 rounded-md text-base font-medium bg-primary text-white shadow-md mb-2">Add Listing</Link>
                       </>
                    )}
                    <Link to="/profile" className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10">My Profile</Link>
                    <button 
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                    >
                      Sign out
                    </button>
                  </div>
                </>
              ) : (
                 <div className="mt-3 px-4 space-y-3">
                    <Link to="/login" className="block w-full text-center px-3 py-2 rounded-md text-base font-medium border border-gray-300 dark:border-gray-600 text-dark dark:text-white hover:bg-gray-50 dark:hover:bg-white/10">Log in</Link>
                    <Link to="/signup" className="block w-full text-center px-3 py-2 rounded-md text-base font-medium bg-primary text-white hover:bg-red-600">Sign up</Link>
                 </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-dark dark:bg-black text-white pt-12 pb-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">I</div>
                <span className="text-xl font-bold">InstaConnect NG</span>
              </div>
              <p className="text-gray-400 text-sm">
                Discover the best local businesses in your area. Your ultimate guide to dining, shopping, and services.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Press</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Safety Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Community Guidelines</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Newsletter</h3>
              <div className="flex">
                <input type="email" placeholder="Email address" className="px-4 py-2 rounded-l-lg w-full text-dark focus:outline-none" />
                <button className="bg-primary px-4 py-2 rounded-r-lg hover:bg-red-600 transition-colors">Sub</button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-6 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} InstaConnect NG. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
