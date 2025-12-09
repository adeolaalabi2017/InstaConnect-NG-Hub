import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
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
import AdminDashboard from './pages/AdminDashboard';
import Leaderboard from './pages/Leaderboard';
import UserProfile from './pages/UserProfile';
import Contact from './pages/Contact';
import { AuthProvider } from './context/AuthContext';
import { cronService } from './services/cron';

const App: React.FC = () => {
  useEffect(() => {
    // Start the cron scheduler when the app mounts
    cronService.init();

    // Cleanup on unmount
    return () => {
      cronService.stop();
    };
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/listing/:id" element={<BusinessDetail />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/top-rated" element={<TopRated />} />
            <Route path="/add-listing" element={<AddListing />} />
            <Route path="/dashboard" element={<BusinessDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/events" element={<Events />} />
            <Route path="/event/:id" element={<EventDetail />} />
            <Route path="/add-event" element={<AddEvent />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<div className="py-20 text-center">Page Not Found</div>} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;