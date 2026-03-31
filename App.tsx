
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
import Settings from './pages/Settings';
import Contact from './pages/Contact';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ComparisonProvider } from './components/ComparisonContext';
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
        <ComparisonProvider>
          <Router>
            <Routes>
              {/* Admin ERP Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminOverview />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="analytics/traffic" element={<AdminAnalyticsTraffic />} />
                <Route path="analytics/insights" element={<AdminAnalyticsInsights />} />
                <Route path="analytics/realtime" element={<AdminAnalyticsRealtime />} />
                <Route path="analytics/custom" element={<AdminAnalyticsCustom />} />
                <Route path="marketing" element={<AdminMarketing />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="listings" element={<AdminListings />} />
                <Route path="content" element={<AdminCMS />}>
                  <Route path=":section" element={<AdminCMS />} />
                </Route>
                <Route path="cms" element={<AdminCMS />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="*" element={<AdminOverview />} />
              </Route>

              {/* Public-facing routes */}
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
                <Route path="/settings" element={<Settings />} />
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
        </ComparisonProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
