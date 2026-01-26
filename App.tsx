
import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import BusinessDetail from './pages/BusinessDetail';
import AddListing from './pages/AddListing';
import Listings from './pages/Listings';
import TopRated from './pages/TopRated';
import Login from './pages/Login';
import Signup from './pages/Signup';
import BusinessDashboard from './pages/BusinessDashboard';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import AddEvent from './pages/AddEvent';
import Community from './pages/Community';
import ThreadDetail from './pages/ThreadDetail';
import UserProfile from './pages/UserProfile';
import Contact from './pages/Contact';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { cronService } from './services/cron';

// Admin Imports
import AdminLayout from './components/admin/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminAnalyticsTraffic from './pages/admin/AdminAnalyticsTraffic';
import AdminAnalyticsInsights from './pages/admin/AdminAnalyticsInsights';
import AdminAnalyticsRealtime from './pages/admin/AdminAnalyticsRealtime';
import AdminAnalyticsCustom from './pages/admin/AdminAnalyticsCustom';
import AdminMarketing from './pages/admin/AdminMarketing';
import AdminOrders from './pages/admin/AdminOrders';
import AdminListings from './pages/admin/AdminListings';
import AdminCMS from './pages/admin/AdminCMS';
import AdminSettings from './pages/admin/AdminSettings';

// A wrapper for public routes to apply the main layout
const PublicLayoutWrapper = () => (
  <Layout>
    <Outlet />
  </Layout>
);

const App: React.FC = () => {
  useEffect(() => {
    cronService.init();
    return () => cronService.stop();
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            {/* Admin ERP Routes with its own dedicated layout */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminOverview />} />
              {/* Analytics Module */}
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="analytics/traffic" element={<AdminAnalyticsTraffic />} />
              <Route path="analytics/insights" element={<AdminAnalyticsInsights />} />
              <Route path="analytics/realtime" element={<AdminAnalyticsRealtime />} />
              <Route path="analytics/custom" element={<AdminAnalyticsCustom />} />
              
              <Route path="marketing" element={<AdminMarketing />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="listings" element={<AdminListings />} />
              
              {/* Content Management Module */}
              <Route path="content" element={<AdminCMS />}>
                <Route path=":section" element={<AdminCMS />} />
              </Route>

              <Route path="cms" element={<AdminCMS />} /> {/* Legacy/Fallback */}
              <Route path="settings" element={<AdminSettings />} />
              {/* Fallback for any other /admin/* route */}
              <Route path="*" element={<AdminOverview />} />
            </Route>

            {/* Public-facing routes with the main layout */}
            <Route element={<PublicLayoutWrapper />}>
              <Route path="/" element={<Home />} />
              <Route path="/listing/:id" element={<BusinessDetail />} />
              <Route path="/listings" element={<Listings />} />
              <Route path="/top-rated" element={<TopRated />} />
              <Route path="/add-listing" element={<AddListing />} />
              <Route path="/dashboard" element={<BusinessDashboard />} />
              <Route path="/community" element={<Community />} />
              <Route path="/community/:id" element={<ThreadDetail />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/events" element={<Events />} />
              <Route path="/event/:id" element={<EventDetail />} />
              <Route path="/add-event" element={<AddEvent />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<div className="py-20 text-center">Page Not Found</div>} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
