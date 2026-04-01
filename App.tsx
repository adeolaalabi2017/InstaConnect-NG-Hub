
import React, { useEffect, Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import Layout from './components/Layout';
import PageTransition from './components/PageTransition';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ComparisonProvider } from './components/ComparisonContext';
import { cronService } from './services/cron';

import ErrorBoundary from './components/ErrorBoundary';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const BusinessDetail = lazy(() => import('./pages/BusinessDetail'));
const AddListing = lazy(() => import('./pages/AddListing'));
const Listings = lazy(() => import('./pages/Listings'));
const TopRated = lazy(() => import('./pages/TopRated'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const BusinessDashboard = lazy(() => import('./pages/BusinessDashboard'));
const Events = lazy(() => import('./pages/Events'));
const EventDetail = lazy(() => import('./pages/EventDetail'));
const AddEvent = lazy(() => import('./pages/AddEvent'));
const Community = lazy(() => import('./pages/Community'));
const ThreadDetail = lazy(() => import('./pages/ThreadDetail'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const Settings = lazy(() => import('./pages/Settings'));
const Contact = lazy(() => import('./pages/Contact'));

// Admin Imports
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const AdminOverview = lazy(() => import('./pages/admin/AdminOverview'));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'));
const AdminAnalyticsTraffic = lazy(() => import('./pages/admin/AdminAnalyticsTraffic'));
const AdminAnalyticsInsights = lazy(() => import('./pages/admin/AdminAnalyticsInsights'));
const AdminAnalyticsRealtime = lazy(() => import('./pages/admin/AdminAnalyticsRealtime'));
const AdminAnalyticsCustom = lazy(() => import('./pages/admin/AdminAnalyticsCustom'));
const AdminMarketing = lazy(() => import('./pages/admin/AdminMarketing'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminListings = lazy(() => import('./pages/admin/AdminListings'));
const AdminCMS = lazy(() => import('./pages/admin/AdminCMS'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const PublicLayoutWrapper = () => (
  <Layout>
    <Outlet />
  </Layout>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Admin ERP Routes */}
        <Route path="/admin" element={<ErrorBoundary><Suspense fallback={<PageLoader />}><AdminLayout /></Suspense></ErrorBoundary>}>
          <Route index element={<PageTransition><ErrorBoundary><Suspense fallback={<PageLoader />}><AdminOverview /></Suspense></ErrorBoundary></PageTransition>} />
          <Route path="analytics" element={<PageTransition><ErrorBoundary><Suspense fallback={<PageLoader />}><AdminAnalytics /></Suspense></ErrorBoundary></PageTransition>} />
          <Route path="analytics/traffic" element={<PageTransition><ErrorBoundary><Suspense fallback={<PageLoader />}><AdminAnalyticsTraffic /></Suspense></ErrorBoundary></PageTransition>} />
          <Route path="analytics/insights" element={<PageTransition><ErrorBoundary><Suspense fallback={<PageLoader />}><AdminAnalyticsInsights /></Suspense></ErrorBoundary></PageTransition>} />
          <Route path="analytics/realtime" element={<PageTransition><ErrorBoundary><Suspense fallback={<PageLoader />}><AdminAnalyticsRealtime /></Suspense></ErrorBoundary></PageTransition>} />
          <Route path="analytics/custom" element={<PageTransition><ErrorBoundary><Suspense fallback={<PageLoader />}><AdminAnalyticsCustom /></Suspense></ErrorBoundary></PageTransition>} />
          <Route path="marketing" element={<PageTransition><ErrorBoundary><Suspense fallback={<PageLoader />}><AdminMarketing /></Suspense></ErrorBoundary></PageTransition>} />
          <Route path="orders" element={<PageTransition><ErrorBoundary><Suspense fallback={<PageLoader />}><AdminOrders /></Suspense></ErrorBoundary></PageTransition>} />
          <Route path="listings" element={<PageTransition><ErrorBoundary><Suspense fallback={<PageLoader />}><AdminListings /></Suspense></ErrorBoundary></PageTransition>} />
          <Route path="users" element={<PageTransition><ErrorBoundary><Suspense fallback={<PageLoader />}><AdminUsers /></Suspense></ErrorBoundary></PageTransition>} />
          <Route path="content" element={<PageTransition><ErrorBoundary><Suspense fallback={<PageLoader />}><AdminCMS /></Suspense></ErrorBoundary></PageTransition>}>
            <Route path=":section" element={<AdminCMS />} />
          </Route>
          <Route path="cms" element={<PageTransition><ErrorBoundary><Suspense fallback={<PageLoader />}><AdminCMS /></Suspense></ErrorBoundary></PageTransition>} />
          <Route path="settings" element={<PageTransition><ErrorBoundary><Suspense fallback={<PageLoader />}><AdminSettings /></Suspense></ErrorBoundary></PageTransition>} />
          <Route path="*" element={<PageTransition><ErrorBoundary><Suspense fallback={<PageLoader />}><AdminOverview /></Suspense></ErrorBoundary></PageTransition>} />
        </Route>

        {/* Public-facing routes */}
        <Route element={<PublicLayoutWrapper />}>
          <Route path="/" element={<PageTransition><ErrorBoundary><Suspense fallback={<PageLoader />}><Home /></Suspense></ErrorBoundary></PageTransition>} />
          <Route path="/listing/:id" element={<PageTransition><ErrorBoundary><Suspense fallback={<PageLoader />}><BusinessDetail /></Suspense></ErrorBoundary></PageTransition>} />
          <Route path="/listings" element={<PageTransition><ErrorBoundary><Suspense fallback={<PageLoader />}><Listings /></Suspense></ErrorBoundary></PageTransition>} />
          <Route path="/top-rated" element={<PageTransition><ErrorBoundary><Suspense fallback={<PageLoader />}><TopRated /></Suspense></ErrorBoundary></PageTransition>} />
          <Route path="/add-listing" element={<PageTransition><ErrorBoundary><Suspense fallback={<PageLoader />}><AddListing /></Suspense></ErrorBoundary></PageTransition>} />
          <Route path="/dashboard" element={<PageTransition><ErrorBoundary><Suspense fallback={<PageLoader />}><BusinessDashboard /></Suspense></ErrorBoundary></PageTransition>} />
          <Route path="/community" element={<PageTransition><ErrorBoundary><Suspense fallback={<PageLoader />}><Community /></Suspense></ErrorBoundary></PageTransition>} />
          <Route path="/community/:id" element={<PageTransition><ErrorBoundary><Suspense fallback={<PageLoader />}><ThreadDetail /></Suspense></ErrorBoundary></PageTransition>} />
          <Route path="/profile" element={<PageTransition><ErrorBoundary><Suspense fallback={<PageLoader />}><UserProfile /></Suspense></ErrorBoundary></PageTransition>} />
          <Route path="/settings" element={<PageTransition><ErrorBoundary><Suspense fallback={<PageLoader />}><Settings /></Suspense></ErrorBoundary></PageTransition>} />
          <Route path="/events" element={<PageTransition><ErrorBoundary><Suspense fallback={<PageLoader />}><Events /></Suspense></ErrorBoundary></PageTransition>} />
          <Route path="/event/:id" element={<PageTransition><ErrorBoundary><Suspense fallback={<PageLoader />}><EventDetail /></Suspense></ErrorBoundary></PageTransition>} />
          <Route path="/add-event" element={<PageTransition><ErrorBoundary><Suspense fallback={<PageLoader />}><AddEvent /></Suspense></ErrorBoundary></PageTransition>} />
          <Route path="/login" element={<PageTransition><ErrorBoundary><Suspense fallback={<PageLoader />}><Login /></Suspense></ErrorBoundary></PageTransition>} />
          <Route path="/signup" element={<PageTransition><ErrorBoundary><Suspense fallback={<PageLoader />}><Signup /></Suspense></ErrorBoundary></PageTransition>} />
          <Route path="/contact" element={<PageTransition><ErrorBoundary><Suspense fallback={<PageLoader />}><Contact /></Suspense></ErrorBoundary></PageTransition>} />
          <Route path="*" element={<PageTransition><div className="py-20 text-center">Page Not Found</div></PageTransition>} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  useEffect(() => {
    cronService.init();
    return () => cronService.stop();
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider>
        <ComparisonProvider>
          <Router>
            <AnimatedRoutes />
          </Router>
        </ComparisonProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
