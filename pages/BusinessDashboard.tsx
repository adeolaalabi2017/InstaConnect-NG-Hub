
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MOCK_BUSINESSES, MOCK_REVIEWS } from '../constants';
import { Business, DailyMetric, Review, Notification } from '../types';
import { 
  TrendingUp, Users, Star, CreditCard, Zap, Plus, X, Check, MapPin, 
  ExternalLink, Calendar, BarChart2, Edit, MessageSquare, Settings, ArrowRight,
  AlertTriangle, CheckCircle, Search, Info, MousePointer, Bell, Filter, ToggleLeft, ToggleRight, Mail
} from 'lucide-react';
import { analyticsService } from '../services/analytics';
import { notificationService } from '../services/notification';
import { ReviewCard } from '../components/ReviewSystem';
import KpiCard from '../components/KpiCard';

const PROMOTION_PACKAGES = [
    {
        id: 'basic',
        name: 'Weekly Spark',
        duration: '7 Days',
        cost: 100,
        dailyCost: '14.3',
        description: 'Get noticed quickly. Ideal for limited-time offers or events.',
        features: [
            'Sponsored "Promoted" Tag',
            'Standard Search Visibility',
            'Basic Analytics Report'
        ],
        icon: Calendar,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        borderColor: 'border-blue-100',
        hoverBorder: 'hover:border-blue-300'
    },
    {
        id: 'standard',
        name: 'Growth Accelerator',
        duration: '14 Days',
        cost: 180,
        dailyCost: '12.8',
        description: 'Sustained visibility to drive consistent traffic and new customers.',
        features: [
            'Priority Category Placement',
            '2x Search Result Boost',
            'Verified Business Badge',
            'Email Support'
        ],
        icon: TrendingUp,
        color: 'text-purple-600',
        bg: 'bg-purple-50',
        borderColor: 'border-purple-100',
        hoverBorder: 'hover:border-purple-300',
        recommended: true
    },
    {
        id: 'premium',
        name: 'Ultimate Spotlight',
        duration: '30 Days',
        cost: 300,
        dailyCost: '10.0',
        description: 'Dominate your niche. Maximum brand exposure and prestige.',
        features: [
            'Homepage Hero Feature',
            'Top of Search Results',
            'Gold "Premium" Badge',
            'Social Media Mention',
            'Dedicated Account Manager'
        ],
        icon: Star,
        color: 'text-yellow-600',
        bg: 'bg-yellow-50',
        borderColor: 'border-yellow-100',
        hoverBorder: 'hover:border-yellow-300'
    }
];

const BusinessDashboard: React.FC = () => {
  const { user, isLoading, updateUser } = useAuth();
  const navigate = useNavigate();
  const [myBusiness, setMyBusiness] = useState<Business | undefined>(undefined);
  const [metrics, setMetrics] = useState<DailyMetric[]>([]);
  const [lifetimeMetrics, setLifetimeMetrics] = useState({ views: 0, clicks: 0, shares: 0 });
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // New States for Review Management
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'settings'>('overview');
  const [businessReviews, setBusinessReviews] = useState<Review[]>([]);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'unread' | 'unreplied'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // To restore promote modal after topup
  const [returnToPromote, setReturnToPromote] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate('/login');
      } else if (user.role !== 'vendor') {
        navigate('/');
      } else {
        // Find business owned by user
        const business = MOCK_BUSINESSES.find(b => b.ownerId === user.id);
        setMyBusiness(business);
        
        if (business) {
            // Load daily stats
            const stats = analyticsService.getBusinessMetrics(business.id, 7);
            setMetrics(stats);
            // Load lifetime stats
            const lifetime = analyticsService.getBusinessLifetimeStats(business.id);
            setLifetimeMetrics(lifetime);

            // Load Reviews
            const reviews = MOCK_REVIEWS.filter(r => r.businessId === business.id);
            setBusinessReviews(reviews);

            // Load Notifications from Service
            const userNotifs = notificationService.getNotifications(user.id);
            // Combine with dynamic unread count from existing mock (for demo consistency)
            const unreadCount = reviews.filter(r => !r.isRead).length;
            
            // Just merging mock logic with new service logic for the bell icon
            let displayNotifs = [...userNotifs];
            if (unreadCount > 0 && !displayNotifs.some(n => n.type === 'review' && !n.isRead)) {
                 // only push if not already covered by service (simplified)
                 displayNotifs.push({
                    id: 'sys-1',
                    userId: user.id,
                    type: 'review',
                    title: 'Unread Reviews',
                    message: `You have ${unreadCount} reviews waiting for your response.`,
                    date: new Date().toISOString(),
                    isRead: false
                });
            }
            
            setNotifications(displayNotifs);
        }
      }
    }
  }, [user, isLoading, navigate]);

  const handleTopUp = (amount: number, cost: number) => {
    if (!myBusiness) return;
    setIsProcessing(true);
    // Simulate Paystack Payment
    setTimeout(() => {
        setIsProcessing(false);
        // Update local business state to reflect new credits
        setMyBusiness({ ...myBusiness, credits: myBusiness.credits + amount });
        setShowTopUpModal(false);
        alert(`Payment of ₦${cost} successful! ${amount} credits added to your business profile.`);
        
        if (returnToPromote) {
            setShowPromoteModal(true);
            setReturnToPromote(false);
        }
    }, 2000);
  };

  const openTopUp = (fromPromote = false) => {
      if (fromPromote) setReturnToPromote(true);
      setShowPromoteModal(false);
      setShowTopUpModal(true);
  }

  const handlePromote = () => {
    const pkg = PROMOTION_PACKAGES.find(p => p.id === selectedPlan);
    if (!pkg || !myBusiness) return;
    
    if (myBusiness.credits < pkg.cost) {
         openTopUp(true);
         return;
    }

    if (window.confirm(`Activate ${pkg.name} for ${pkg.cost} credits?`)) {
        // Deduct credits from business
        setMyBusiness({ ...myBusiness, credits: myBusiness.credits - pkg.cost });
        setShowPromoteModal(false);
        alert(`Success! Your business is now promoted with the ${pkg.name} package.`);
    }
  };
  
  const handleVendorReply = (reviewId: string, text: string) => {
      // Mock API call to save reply
      const updatedReviews = businessReviews.map(r => {
          if (r.id === reviewId) {
              return {
                  ...r,
                  reply: {
                      text: text,
                      date: new Date().toISOString()
                  },
                  isRead: true
              };
          }
          return r;
      });
      setBusinessReviews(updatedReviews);
      alert("Reply posted successfully.");
  };

  const markNotificationsRead = () => {
      if (user) notificationService.markAllAsRead(user.id);
      setNotifications(prev => prev.map(n => ({...n, isRead: true})));
  };

  // Toggle notification preferences
  const toggleNotificationPref = (type: 'email' | 'inApp') => {
      if (!user) return;
      const currentPrefs = user.notificationPreferences || { email: true, inApp: true };
      const newPrefs = { ...currentPrefs, [type]: !currentPrefs[type] };
      updateUser({ notificationPreferences: newPrefs });
  };

  // Calculate trend from last 7 days
  const today = metrics[0]?.views || 0;
  const yesterday = metrics[1]?.views || 0;
  const trend = yesterday > 0 ? Math.round(((today - yesterday) / yesterday) * 100) : 0;

  // Filter logic for reviews tab
  const getFilteredReviews = () => {
      if (reviewFilter === 'unread') return businessReviews.filter(r => !r.isRead);
      if (reviewFilter === 'unreplied') return businessReviews.filter(r => !r.reply);
      return businessReviews;
  };
  const filteredReviews = getFilteredReviews();
  const unreadReviews = businessReviews.filter(r => !r.isRead);

  const quickActions = [
    { 
      label: 'Edit Listing', 
      icon: Edit, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50', 
      description: 'Update info & photos',
      action: () => alert('Edit functionality coming soon!') 
    },
    { 
      label: 'Promote', 
      icon: Zap, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50', 
      description: 'Boost visibility',
      action: () => setShowPromoteModal(true) 
    },
    { 
      label: 'Reviews', 
      icon: MessageSquare, 
      color: 'text-green-600', 
      bg: 'bg-green-50', 
      description: 'Manage feedback',
      action: () => setActiveTab('reviews') 
    },
    { 
      label: 'Analytics', 
      icon: BarChart2, 
      color: 'text-orange-600', 
      bg: 'bg-orange-50', 
      description: 'View full report',
      action: () => alert('Full report functionality coming soon!') 
    }
  ];

  const activePackage = PROMOTION_PACKAGES.find(p => p.id === selectedPlan);
  const missingCredits = activePackage && myBusiness ? Math.max(0, activePackage.cost - myBusiness.credits) : 0;

  if (isLoading || !user) return <div className="py-20 text-center">Loading Dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
        <div>
           <h1 className="text-4xl font-extrabold text-dark tracking-tight mb-2">Dashboard</h1>
           <p className="text-graytext text-lg">
             Manage <span className="font-bold text-dark">{myBusiness?.name || 'your business'}</span>.
           </p>
        </div>

        {/* Action Bar: Notifications & Credits */}
        {myBusiness && (
            <div className="flex items-center gap-4">
                 {/* Notifications */}
                 <div className="relative">
                    <button 
                        onClick={() => {
                            setShowNotifications(!showNotifications);
                            if (!showNotifications) markNotificationsRead();
                        }}
                        className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-dark hover:shadow-md transition-all relative"
                    >
                        <Bell size={20} />
                        {notifications.some(n => !n.isRead) && (
                            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                        )}
                    </button>
                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 p-2 animate-fade-in-up origin-top-right z-30">
                            <div className="text-xs font-bold text-gray-400 px-3 py-2 uppercase tracking-wider">Notifications</div>
                            {notifications.length > 0 ? (
                                <div className="space-y-1">
                                    {notifications.map((n, i) => (
                                        <div key={n.id || i} className={`p-3 hover:bg-gray-50 rounded-lg cursor-pointer ${!n.isRead ? 'bg-blue-50/50' : ''}`}>
                                            <div className="font-bold text-sm text-dark mb-1">{n.title}</div>
                                            <p className="text-xs text-gray-500">{n.message}</p>
                                            <span className="text-[10px] text-gray-400 mt-1 block">{new Date(n.date).toLocaleDateString()}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 text-center text-sm text-gray-400">No new notifications</div>
                            )}
                        </div>
                    )}
                 </div>

                 {/* Credits Widget */}
                <div className="glass-card px-4 sm:px-6 py-3 rounded-2xl flex flex-col sm:flex-row items-center gap-4 sm:gap-6 border-white/60 shadow-lg bg-white/80">
                   <div className="flex flex-col items-center sm:items-start">
                       <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Credits</span>
                       <div className="flex items-baseline gap-1">
                         <span className="text-2xl font-black text-dark">{myBusiness.credits}</span>
                         <span className="text-sm font-medium text-gray-500">cr</span>
                       </div>
                   </div>
                   <div className="hidden sm:block h-10 w-px bg-gray-200"></div>
                   <div className="flex gap-2 w-full sm:w-auto">
                       <button 
                         onClick={() => openTopUp(false)}
                         className="flex-1 sm:flex-none bg-white border border-gray-200 hover:bg-gray-50 text-dark px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                       >
                         <CreditCard size={16} /> Top Up
                       </button>
                       <button 
                         onClick={() => setShowPromoteModal(true)}
                         className="flex-1 sm:flex-none bg-primary hover:bg-red-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
                       >
                         <Zap size={16} fill="currentColor" /> Promote
                       </button>
                   </div>
                </div>
            </div>
        )}
      </div>

      {myBusiness ? (
        <div className="space-y-8">
            
            {/* Tabs Navigation */}
            <div className="flex gap-4 border-b border-gray-200 pb-1 mb-6 overflow-x-auto">
                <button 
                    onClick={() => setActiveTab('overview')}
                    className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'overview' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-dark'}`}
                >
                    Overview
                </button>
                <button 
                    onClick={() => setActiveTab('reviews')}
                    className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'reviews' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-dark'}`}
                >
                    Review Management
                    {businessReviews.filter(r => !r.reply).length > 0 && (
                        <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{businessReviews.filter(r => !r.reply).length}</span>
                    )}
                </button>
                <button 
                    onClick={() => setActiveTab('settings')}
                    className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'settings' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-dark'}`}
                >
                    Settings
                </button>
            </div>
            
            {/* OVERVIEW TAB CONTENT */}
            {activeTab === 'overview' && (
                <>
                    {/* 1. Key Metrics Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <KpiCard 
                            title="Total Views" 
                            value={lifetimeMetrics.views.toLocaleString()} 
                            icon={TrendingUp}
                            trend={{ value: Math.abs(trend), isPositive: trend >= 0 }}
                            subValue="Lifetime views"
                            className="border-t-4 border-t-blue-500"
                        />
                        <KpiCard 
                            title="Total Clicks" 
                            value={lifetimeMetrics.clicks.toLocaleString()} 
                            icon={MousePointer}
                            subValue="Website & Contact clicks"
                            className="border-t-4 border-t-indigo-500"
                        />
                        <div onClick={() => setActiveTab('reviews')} className="cursor-pointer transition-transform hover:scale-[1.02]">
                            <KpiCard 
                                title="Total Reviews" 
                                value={myBusiness.reviewCount.toLocaleString()} 
                                icon={MessageSquare}
                                subValue="Customer feedback"
                                className="border-t-4 border-t-green-500 h-full"
                            />
                        </div>
                        <KpiCard 
                            title="Average Rating" 
                            value={myBusiness.rating} 
                            icon={Star}
                            subValue="/ 5.0"
                            className="border-t-4 border-t-yellow-400"
                        />
                    </div>

                    {/* NEW SECTION: Unread Reviews */}
                    {unreadReviews.length > 0 && (
                        <div className="mt-8 animate-fade-in-up">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-dark text-lg flex items-center gap-2">
                                    <span className="flex h-3 w-3 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                    </span>
                                    New Reviews Pending Reply
                                </h3>
                                <button 
                                    onClick={() => {
                                        setActiveTab('reviews');
                                        setReviewFilter('unread');
                                    }}
                                    className="text-sm font-bold text-primary hover:underline flex items-center gap-1"
                                >
                                    View All ({unreadReviews.length}) <ArrowRight size={16} />
                                </button>
                            </div>
                            <div className="grid gap-6">
                                {unreadReviews.slice(0, 2).map(review => (
                                    <div key={review.id} className="border-l-4 border-primary bg-white rounded-r-xl shadow-sm">
                                        <ReviewCard 
                                            review={review} 
                                            currentUser={user} 
                                            isOwner={true} 
                                            onReply={handleVendorReply}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                        
                        {/* 2. Business Listing Preview (Left Column) */}
                        <div className="lg:col-span-1">
                            <div className="glass-card rounded-2xl overflow-hidden h-full flex flex-col shadow-lg">
                                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                    <h3 className="font-bold text-dark text-sm uppercase tracking-wide">My Listing</h3>
                                    <button 
                                        onClick={() => navigate(`/listing/${myBusiness.id}`)}
                                        className="text-xs font-bold text-primary hover:bg-primary/5 px-2 py-1 rounded transition-colors flex items-center gap-1"
                                    >
                                        Preview <ExternalLink size={12} />
                                    </button>
                                </div>
                                
                                <div className="relative h-48 group cursor-pointer" onClick={() => navigate(`/listing/${myBusiness.id}`)}>
                                    <img src={myBusiness.image} alt={myBusiness.name} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-5">
                                        <div>
                                            <h4 className="text-white font-bold text-lg leading-tight mb-1">{myBusiness.name}</h4>
                                            <p className="text-white/80 text-xs flex items-center gap-1"><MapPin size={10} /> {myBusiness.location}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 flex-grow flex flex-col gap-4">
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="text-sm text-gray-500">Status</span>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${myBusiness.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {myBusiness.isOpen ? 'Open Now' : 'Closed'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="text-sm text-gray-500">Category</span>
                                        <span className="text-sm font-bold text-dark">{myBusiness.category}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-sm text-gray-500">Price Range</span>
                                        <span className="text-sm font-bold text-dark">{myBusiness.priceRange}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Actions & Growth (Right Column) */}
                        <div className="lg:col-span-2 space-y-6">
                            
                            {/* Quick Actions Grid */}
                            <div className="glass-card p-6 rounded-2xl">
                                <h3 className="font-bold text-dark mb-4 text-lg flex items-center gap-2">
                                    <Settings size={20} className="text-gray-400" /> Quick Actions
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                                    {quickActions.map((action, idx) => (
                                        <button 
                                            key={idx} 
                                            onClick={action.action} 
                                            className="flex flex-col items-start p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all bg-white group text-left"
                                        >
                                            <div className={`w-10 h-10 rounded-lg ${action.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                                                <action.icon size={20} className={action.color} />
                                            </div>
                                            <span className="font-bold text-dark text-sm mb-1">{action.label}</span>
                                            <span className="text-xs text-gray-400">{action.description}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Traffic Chart (Visual using metrics) */}
                            <div className="glass-card p-6 rounded-2xl">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold text-dark text-lg">Traffic Overview (7 Days)</h3>
                                </div>
                                {/* Dynamic Bar Chart */}
                                <div className="h-40 flex items-end justify-between gap-2">
                                    {/* Reverse metrics so earliest day is left */}
                                    {[...metrics].reverse().map((m, i) => {
                                        // Simple normalization for chart height
                                        const maxVal = Math.max(...metrics.map(x => x.views)) || 1;
                                        const height = Math.max(10, (m.views / maxVal) * 100);
                                        const dayName = new Date(m.date).toLocaleDateString('en-US', { weekday: 'short' });
                                        
                                        return (
                                            <div key={i} className="w-full bg-gray-50 rounded-t-lg relative group flex flex-col justify-end">
                                                <div 
                                                style={{ height: `${height}%` }} 
                                                className="w-full bg-gradient-to-t from-primary/80 to-secondary/80 rounded-t-lg transition-all duration-500 hover:opacity-90 relative"
                                                >
                                                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-dark text-white text-xs px-2 py-1 rounded transition-opacity whitespace-nowrap z-10">
                                                        {m.views} views
                                                    </div>
                                                </div>
                                                <div className="w-full text-center text-xs text-gray-400 font-medium mt-2">
                                                    {dayName}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* REVIEWS TAB CONTENT */}
            {activeTab === 'reviews' && (
                <div className="animate-fade-in-up space-y-8">
                     {/* Reviews Stats Header */}
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <div className="glass-card p-6 rounded-2xl flex items-center gap-4 border-l-4 border-yellow-400">
                             <div className="bg-yellow-50 p-3 rounded-full text-yellow-500"><Star size={24} /></div>
                             <div>
                                 <div className="text-2xl font-black text-dark">{myBusiness.rating}</div>
                                 <div className="text-xs text-gray-500 uppercase font-bold">Overall Rating</div>
                             </div>
                         </div>
                         <div className="glass-card p-6 rounded-2xl flex items-center gap-4 border-l-4 border-blue-400">
                             <div className="bg-blue-50 p-3 rounded-full text-blue-500"><MessageSquare size={24} /></div>
                             <div>
                                 <div className="text-2xl font-black text-dark">{businessReviews.length}</div>
                                 <div className="text-xs text-gray-500 uppercase font-bold">Total Reviews</div>
                             </div>
                         </div>
                         <div className="glass-card p-6 rounded-2xl flex items-center gap-4 border-l-4 border-red-400">
                             <div className="bg-red-50 p-3 rounded-full text-red-500"><AlertTriangle size={24} /></div>
                             <div>
                                 <div className="text-2xl font-black text-dark">{businessReviews.filter(r => !r.reply).length}</div>
                                 <div className="text-xs text-gray-500 uppercase font-bold">Needs Reply</div>
                             </div>
                         </div>
                     </div>

                     {/* Filters and List */}
                     <div className="glass-card rounded-2xl p-6">
                         <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                             <h3 className="text-lg font-bold text-dark">Customer Reviews</h3>
                             <div className="flex bg-gray-100 p-1 rounded-xl">
                                 <button 
                                   onClick={() => setReviewFilter('all')}
                                   className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${reviewFilter === 'all' ? 'bg-white shadow text-dark' : 'text-gray-500 hover:text-dark'}`}
                                 >
                                     All
                                 </button>
                                 <button 
                                   onClick={() => setReviewFilter('unread')}
                                   className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${reviewFilter === 'unread' ? 'bg-white shadow text-dark' : 'text-gray-500 hover:text-dark'}`}
                                 >
                                     Unread
                                 </button>
                                 <button 
                                   onClick={() => setReviewFilter('unreplied')}
                                   className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${reviewFilter === 'unreplied' ? 'bg-white shadow text-dark' : 'text-gray-500 hover:text-dark'}`}
                                 >
                                     Unreplied
                                 </button>
                             </div>
                         </div>

                         <div className="space-y-4">
                             {filteredReviews.length > 0 ? (
                                 filteredReviews.map(review => (
                                     <div key={review.id} className={`${!review.isRead ? 'border-l-4 border-primary bg-primary/5 pl-4 -ml-4 rounded-l' : ''}`}>
                                        <ReviewCard 
                                            review={review} 
                                            currentUser={user} 
                                            isOwner={true} 
                                            onReply={handleVendorReply}
                                        />
                                     </div>
                                 ))
                             ) : (
                                 <div className="text-center py-12 text-gray-400 italic">
                                     No reviews found matching this filter.
                                 </div>
                             )}
                         </div>
                     </div>
                </div>
            )}

            {/* SETTINGS TAB CONTENT */}
            {activeTab === 'settings' && (
                <div className="animate-fade-in-up">
                    <div className="glass-card p-8 rounded-2xl max-w-3xl">
                        <h3 className="text-xl font-bold text-dark mb-6 flex items-center gap-2">
                            <Settings size={22} className="text-gray-400" /> Vendor Configuration
                        </h3>

                        <div className="space-y-6">
                            {/* Notification Settings */}
                            <div>
                                <h4 className="font-bold text-dark text-sm mb-4 border-b border-gray-100 pb-2">Notifications</h4>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-white p-2 rounded-lg shadow-sm text-primary">
                                                <Mail size={20} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-dark text-sm">Email Notifications</div>
                                                <div className="text-xs text-gray-500">Receive an email when you get a new review</div>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => toggleNotificationPref('email')}
                                            className={`text-3xl transition-colors ${user.notificationPreferences?.email ? 'text-green-500' : 'text-gray-300'}`}
                                        >
                                            {user.notificationPreferences?.email ? <ToggleRight size={40} fill="currentColor" className="bg-white rounded-full" /> : <ToggleLeft size={40} />}
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-white p-2 rounded-lg shadow-sm text-blue-500">
                                                <Bell size={20} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-dark text-sm">In-App Notifications</div>
                                                <div className="text-xs text-gray-500">Show alerts in the dashboard for new activity</div>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => toggleNotificationPref('inApp')}
                                            className={`text-3xl transition-colors ${user.notificationPreferences?.inApp ? 'text-green-500' : 'text-gray-300'}`}
                                        >
                                            {user.notificationPreferences?.inApp ? <ToggleRight size={40} fill="currentColor" className="bg-white rounded-full" /> : <ToggleLeft size={40} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Placeholder for future settings */}
                            <div className="pt-4">
                                <h4 className="font-bold text-dark text-sm mb-4 border-b border-gray-100 pb-2">Business Profile</h4>
                                <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-center">
                                    <p className="text-xs text-gray-400">Additional business settings like operating hours and contact info editing will be available here.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
      ) : (
        <div className="glass-card p-12 rounded-3xl text-center border-dashed border-2 border-gray-300">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Plus size={32} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-dark mb-2">No Business Listed</h2>
            <p className="text-graytext mb-8 max-w-md mx-auto">Get started by listing your business today. Reach thousands of local customers.</p>
            <button 
               onClick={() => navigate('/add-listing')}
               className="bg-primary text-white font-bold px-8 py-3.5 rounded-xl shadow-lg hover:bg-red-600 transition-colors"
            >
               Create Listing
            </button>
        </div>
      )}

      {/* Promote Modal */}
      {showPromoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-white/20">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h3 className="font-bold text-xl text-dark">Promote My Business</h3>
                        <p className="text-sm text-gray-500">Choose a package to boost your visibility and reach more customers.</p>
                    </div>
                    <button onClick={() => setShowPromoteModal(false)} className="bg-gray-100 p-2 rounded-full text-gray-500 hover:bg-gray-200 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-gray-50/30">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {PROMOTION_PACKAGES.map((pkg) => {
                            const isSelected = selectedPlan === pkg.id;
                            return (
                                <div 
                                    key={pkg.id}
                                    onClick={() => setSelectedPlan(pkg.id)}
                                    className={`relative border-2 rounded-2xl p-5 cursor-pointer transition-all flex flex-col bg-white ${isSelected ? `border-primary ring-4 ring-primary/10 shadow-xl scale-[1.02] z-10` : `${pkg.borderColor} ${pkg.hoverBorder} hover:shadow-lg opacity-90 hover:opacity-100`}`}
                                >
                                    {(pkg as any).recommended && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                            Most Popular
                                        </div>
                                    )}
                                    {isSelected && <div className="absolute top-4 right-4 text-primary"><CheckCircle size={22} fill="currentColor" className="text-white" /></div>}
                                    
                                    <div className={`w-14 h-14 rounded-2xl ${pkg.bg} ${pkg.color} flex items-center justify-center mb-4 shadow-sm`}>
                                        <pkg.icon size={26} />
                                    </div>
                                    
                                    <h4 className="font-bold text-dark text-lg mb-1">{pkg.name}</h4>
                                    <p className="text-xs text-gray-500 mb-4 h-8 leading-snug">{pkg.description}</p>
                                    
                                    <div className="flex items-baseline gap-1 mb-1">
                                        <span className="text-3xl font-black text-dark">{pkg.cost}</span>
                                        <span className="text-sm font-medium text-gray-500">credits</span>
                                    </div>
                                    <div className="text-xs text-gray-400 mb-4 font-medium">
                                        ≈ {pkg.dailyCost} credits / day
                                    </div>

                                    <div className="border-t border-dashed border-gray-100 my-2"></div>
                                    
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 mt-2">Features</div>
                                    <ul className="space-y-3 mt-auto">
                                        {pkg.features.map((feat, i) => (
                                            <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                                                <div className="mt-0.5 bg-green-100 text-green-600 rounded-full p-0.5 shrink-0"><Check size={10} strokeWidth={3} /></div>
                                                <span className="leading-tight">{feat}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 bg-white shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-20">
                     {activePackage && myBusiness ? (
                        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                            <div className="flex-grow space-y-1 w-full md:w-auto">
                                <h4 className="font-bold text-dark text-sm flex items-center gap-2">
                                    Cost Breakdown <Info size={14} className="text-gray-400"/>
                                </h4>
                                <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
                                    <span className="text-gray-600">Selected Package:</span>
                                    <span className="font-bold text-dark text-right">{activePackage.name}</span>
                                    
                                    <span className="text-gray-600">Cost:</span>
                                    <span className="font-bold text-dark text-right">{activePackage.cost} credits</span>
                                    
                                    <div className="col-span-2 border-t border-gray-200 my-1"></div>
                                    
                                    <span className="text-gray-600">Business Balance:</span>
                                    <span className={`font-bold text-right ${missingCredits > 0 ? 'text-red-500' : 'text-green-600'}`}>{myBusiness.credits} credits</span>
                                </div>
                            </div>
                            
                            <div className="w-full md:w-auto flex-shrink-0 min-w-[280px]">
                                {missingCredits > 0 ? (
                                    <div className="flex flex-col gap-3 animate-fade-in">
                                        <div className="flex items-center justify-between bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm border border-red-100">
                                            <span className="font-bold flex items-center gap-2"><AlertTriangle size={14}/> Insufficient Balance</span>
                                            <span className="font-bold">Missing {missingCredits} cr</span>
                                        </div>
                                        <button 
                                           onClick={() => openTopUp(true)}
                                           className="w-full bg-dark text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-gray-900/10"
                                        >
                                            <CreditCard size={18} /> Top Up & Continue
                                        </button>
                                    </div>
                                ) : (
                                     <button 
                                        onClick={handlePromote}
                                        className="w-full bg-primary hover:bg-red-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1"
                                     >
                                         <Zap size={20} fill="currentColor" /> Activate Promotion
                                     </button>
                                )}
                            </div>
                        </div>
                     ) : (
                         <div className="flex items-center justify-center py-2 text-gray-400 italic">
                             Select a package above to view details and proceed.
                         </div>
                     )}
                </div>
            </div>
        </div>
      )}

      {/* Top Up Modal (Mock Paystack) */}
      {showTopUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-white/20">
                 <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-xl text-dark">Buy Business Credits</h3>
                    <button onClick={() => setShowTopUpModal(false)} className="bg-gray-100 p-2 rounded-full text-gray-500 hover:bg-gray-200 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6">
                    <div className="flex items-center gap-4 mb-6 bg-green-50 p-4 rounded-xl text-green-800 text-sm">
                        <div className="bg-white p-2 rounded-full shadow-sm">
                            <Check size={16} />
                        </div>
                        Secure payment powered by Paystack
                    </div>
                    
                    <div className="space-y-3">
                         <button 
                           onClick={() => handleTopUp(100, 5000)}
                           disabled={isProcessing}
                           className="w-full flex justify-between items-center p-5 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors group"
                         >
                             <span className="font-bold text-dark flex items-center gap-3"><CreditCard size={20} className="text-gray-300 group-hover:text-dark transition-colors"/> 100 Credits</span>
                             <span className="font-bold text-dark">₦5,000</span>
                         </button>
                         <button 
                           onClick={() => handleTopUp(300, 13500)}
                           disabled={isProcessing}
                           className="w-full flex justify-between items-center p-5 border-2 border-primary/10 bg-primary/5 rounded-2xl hover:bg-primary/10 transition-colors relative overflow-hidden"
                         >
                             <div className="flex flex-col items-start relative z-10">
                                <span className="font-bold text-primary flex items-center gap-3"><CreditCard size={20} /> 300 Credits</span>
                                <span className="text-[10px] text-white font-bold bg-red-500 px-1.5 py-0.5 rounded ml-8 mt-1">BEST VALUE</span>
                             </div>
                             <span className="font-bold text-dark text-lg relative z-10">₦13,500</span>
                         </button>
                         <button 
                           onClick={() => handleTopUp(500, 22000)}
                           disabled={isProcessing}
                           className="w-full flex justify-between items-center p-5 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors group"
                         >
                             <span className="font-bold text-dark flex items-center gap-3"><CreditCard size={20} className="text-gray-300 group-hover:text-dark transition-colors"/> 500 Credits</span>
                             <span className="font-bold text-dark">₦22,000</span>
                         </button>
                    </div>

                    {isProcessing && (
                        <div className="mt-6 text-center text-sm text-gray-500 flex flex-col items-center">
                            <div className="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin mb-2"></div>
                            Processing secure payment...
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default BusinessDashboard;
