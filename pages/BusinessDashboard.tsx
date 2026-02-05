import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MOCK_BUSINESSES, MOCK_REVIEWS, MOCK_EVENTS, CATEGORIES } from '../constants';
import { Business, DailyMetric, Review, Notification, Event, AdPlacement, Product } from '../types';
import { 
  TrendingUp, Users, Star, CreditCard, Zap, Plus, X, Check, MapPin, 
  ExternalLink, Calendar, BarChart2, Edit, MessageSquare, Settings, ArrowRight,
  AlertTriangle, CheckCircle, Search, Info, MousePointer, Bell, Filter, ToggleLeft, ToggleRight, Mail, Ticket, Megaphone, UploadCloud, Play, Pause, Trash2, Layout, Package, Image as ImageIcon
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
  
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'reviews' | 'marketing' | 'settings'>('overview');
  const [businessReviews, setBusinessReviews] = useState<Review[]>([]);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'unread' | 'unreplied'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [myEvents, setMyEvents] = useState<Event[]>([]);

  // Product Management State
  const [products, setProducts] = useState<Product[]>([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productFormData, setProductFormData] = useState({ name: '', price: '', quantity: '', image: '' });

  const [vendorAds, setVendorAds] = useState<AdPlacement[]>([
      {
        id: 'vad_1',
        name: 'Holiday Special Banner',
        status: 'active',
        location: 'Homepage Banner',
        imageUrl: 'https://picsum.photos/seed/holiday/800/400',
        destinationUrl: 'https://instaconnect.ng/listing/1',
        impressions: 12050,
        clicks: 450,
        startDate: '2024-11-01',
        endDate: '2024-11-30',
        targeting: { category: 'Hotels' }
      }
  ]);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [currentAd, setCurrentAd] = useState<Partial<AdPlacement>>({});

  const [returnToPromote, setReturnToPromote] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate('/login');
      } else if (user.role !== 'vendor') {
        navigate('/');
      } else {
        const business = MOCK_BUSINESSES.find(b => b.ownerId === user.id);
        setMyBusiness(business);
        
        if (business) {
            const stats = analyticsService.getBusinessMetrics(business.id, 7);
            setMetrics(stats);
            const lifetime = analyticsService.getBusinessLifetimeStats(business.id);
            setLifetimeMetrics(lifetime);
            const reviews = MOCK_REVIEWS.filter(r => r.businessId === business.id);
            setBusinessReviews(reviews);
            const hostedEvents = MOCK_EVENTS.filter(e => e.organizerId === user.id);
            setMyEvents(hostedEvents);
            setProducts(business.products || []);

            const userNotifs = notificationService.getNotifications(user.id);
            const unreadCount = reviews.filter(r => !r.isRead).length;
            let displayNotifs = [...userNotifs];
            if (unreadCount > 0 && !displayNotifs.some(n => n.type === 'review' && !n.isRead)) {
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
    setTimeout(() => {
        setIsProcessing(false);
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
        setMyBusiness({ ...myBusiness, credits: myBusiness.credits - pkg.cost });
        setShowPromoteModal(false);
        alert(`Success! Your business is now promoted with the ${pkg.name} package.`);
    }
  };
  
  const handleVendorReply = (reviewId: string, text: string) => {
      const updatedReviews = businessReviews.map(r => {
          if (r.id === reviewId) {
              return { ...r, reply: { text: text, date: new Date().toISOString() }, isRead: true };
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

  const toggleNotificationPref = (type: 'email' | 'inApp') => {
      if (!user) return;
      const currentPrefs = user.notificationPreferences || { email: true, inApp: true };
      const newPrefs = { ...currentPrefs, [type]: !currentPrefs[type] };
      updateUser({ notificationPreferences: newPrefs });
  };

  const handleSaveAd = (e: React.FormEvent) => {
      e.preventDefault();
      const newAd: AdPlacement = {
          id: currentAd.id || Date.now().toString(),
          name: currentAd.name || 'New Campaign',
          status: currentAd.status || 'paused',
          location: currentAd.location || 'Listing Sidebar',
          imageUrl: currentAd.imageUrl || 'https://picsum.photos/seed/new/800/400',
          destinationUrl: currentAd.destinationUrl || '',
          startDate: currentAd.startDate || new Date().toISOString(),
          endDate: currentAd.endDate || new Date(Date.now() + 86400000 * 7).toISOString(),
          targeting: currentAd.targeting || {},
          impressions: currentAd.impressions || 0,
          clicks: currentAd.clicks || 0
      };
      if (currentAd.id) {
          setVendorAds(vendorAds.map(ad => ad.id === currentAd.id ? newAd : ad));
      } else {
          setVendorAds([newAd, ...vendorAds]);
      }
      setIsAdModalOpen(false);
      setCurrentAd({});
  };

  const handleDeleteAd = (id: string) => {
      if(window.confirm('Are you sure you want to delete this campaign?')) {
          setVendorAds(vendorAds.filter(ad => ad.id !== id));
      }
  };

  const openAdModal = (ad?: AdPlacement) => {
      if (ad) setCurrentAd(ad);
      else setCurrentAd({ status: 'active', location: 'Homepage Banner', startDate: new Date().toISOString().split('T')[0], endDate: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0] });
      setIsAdModalOpen(true);
  };

  // Product Handlers
  const handleOpenProductModal = (product?: Product) => {
      if (product) {
          setEditingProduct(product);
          setProductFormData({ name: product.name, price: product.price.toString(), quantity: product.quantity.toString(), image: product.image });
      } else {
          if (products.length >= 5) {
              alert("You can only have up to 5 featured products. Please remove one to add more.");
              return;
          }
          setEditingProduct(null);
          setProductFormData({ name: '', price: '', quantity: '', image: '' });
      }
      setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
      e.preventDefault();
      const productData: Product = {
          id: editingProduct?.id || Date.now().toString(),
          name: productFormData.name,
          price: parseInt(productFormData.price),
          quantity: parseInt(productFormData.quantity),
          image: productFormData.image || 'https://picsum.photos/seed/prod/400/300'
      };

      if (editingProduct) {
          setProducts(products.map(p => p.id === productData.id ? productData : p));
      } else {
          setProducts([...products, productData]);
      }
      setIsProductModalOpen(false);
  };

  const handleDeleteProduct = (id: string) => {
      if(window.confirm('Remove this product from your featured carousel?')) {
          setProducts(products.filter(p => p.id !== id));
      }
  };

  const unreadReviews = businessReviews.filter(r => !r.isRead);
  const filteredReviews = reviewFilter === 'unread' ? businessReviews.filter(r => !r.isRead) : reviewFilter === 'unreplied' ? businessReviews.filter(r => !r.reply) : businessReviews;

  // Added missing activePackage and missingCredits to fix build errors
  const activePackage = PROMOTION_PACKAGES.find(p => p.id === selectedPlan);
  const missingCredits = (activePackage && myBusiness) ? Math.max(0, activePackage.cost - myBusiness.credits) : 0;

  const quickActions = [
    { label: 'Edit Listing', icon: Edit, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20', description: 'Update info & photos', action: () => alert('Edit functionality coming soon!') },
    { label: 'Featured Products', icon: Package, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/20', description: 'Manage 5 items', action: () => setActiveTab('products') },
    { label: 'Promote', icon: Zap, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20', description: 'Boost visibility', action: () => setShowPromoteModal(true) },
    { label: 'Reviews', icon: MessageSquare, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20', description: 'Manage feedback', action: () => setActiveTab('reviews') },
  ];

  if (isLoading || !user) return <div className="py-20 text-center">Loading Dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
        <div>
           <h1 className="text-4xl font-extrabold text-dark dark:text-white tracking-tight mb-2">Dashboard</h1>
           <p className="text-graytext dark:text-gray-400 text-lg">Manage <span className="font-bold text-dark dark:text-white">{myBusiness?.name || 'your business'}</span>.</p>
        </div>
        {myBusiness && (
            <div className="flex items-center gap-4">
                 <div className="relative">
                    <button onClick={() => { setShowNotifications(!showNotifications); if (!showNotifications) markNotificationsRead(); }} className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors relative">
                        <Bell size={20} className="text-gray-600 dark:text-gray-300" />
                        {notifications.filter(n => !n.isRead).length > 0 && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900"></span>}
                    </button>
                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-2 animate-fade-in-up z-30">
                            <div className="flex justify-between items-center px-3 py-2 border-b border-gray-100 dark:border-gray-700 mb-1"><span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Notifications</span><button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-dark"><X size={14} /></button></div>
                            <div className="max-h-64 overflow-y-auto">{notifications.length > 0 ? notifications.map((n, i) => (
                                <div key={i} className={`p-3 rounded-lg text-sm mb-1 ${!n.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}><div className="font-bold text-dark dark:text-white mb-0.5">{n.title}</div><p className="text-gray-600 dark:text-gray-400 text-xs mb-1">{n.message}</p><div className="text-[10px] text-gray-400">{new Date(n.date).toLocaleDateString()}</div></div>
                            )) : <div className="p-4 text-center text-sm text-gray-400">No new notifications</div>}</div>
                        </div>
                    )}
                 </div>
                 <div className="glass-card px-4 py-2 rounded-xl flex items-center gap-3 border-none bg-gradient-to-r from-primary/10 to-primary/5">
                     <div className="flex flex-col items-end"><span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Credits</span><span className="text-xl font-black text-primary leading-none">{myBusiness.credits}</span></div>
                     <button onClick={() => openTopUp()} className="bg-primary hover:bg-red-600 text-white p-2 rounded-lg shadow-sm transition-colors" title="Top Up Credits"><Plus size={16} /></button>
                 </div>
            </div>
        )}
      </div>

      {myBusiness ? (
        <>
           <div className="flex gap-2 mb-8 border-b border-gray-200 dark:border-gray-700 overflow-x-auto pb-1">
               <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors whitespace-nowrap ${activeTab === 'overview' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-gray-500 hover:text-dark dark:hover:text-white'}`}>Overview</button>
               <button onClick={() => setActiveTab('products')} className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'products' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-gray-500 hover:text-dark dark:hover:text-white'}`}><Package size={16} /> Products Carousel</button>
               <button onClick={() => setActiveTab('marketing')} className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'marketing' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-gray-500 hover:text-dark dark:hover:text-white'}`}>Marketing</button>
               <button onClick={() => setActiveTab('reviews')} className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'reviews' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-gray-500 hover:text-dark dark:hover:text-white'}`}>Reviews {unreadReviews.length > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{unreadReviews.length}</span>}</button>
               <button onClick={() => setActiveTab('settings')} className={`px-4 py-2 text-sm font-bold rounded-t-lg transition-colors whitespace-nowrap ${activeTab === 'settings' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-gray-500 hover:text-dark dark:hover:text-white'}`}>Settings</button>
           </div>

           {activeTab === 'overview' && (
               <div className="animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <KpiCard title="Total Views" value={lifetimeMetrics.views} icon={Users} trend={{ value: 12, isPositive: true }} subValue={`${metrics[0]?.views || 0} views today`} />
                        <KpiCard title="Search Clicks" value={lifetimeMetrics.clicks} icon={MousePointer} trend={{ value: 5, isPositive: true }} subValue={`${metrics[0]?.clicks || 0} clicks today`} />
                        <KpiCard title="Total Reviews" value={myBusiness.reviewCount} icon={Star} trend={{ value: 2, isPositive: true }} subValue={`${myBusiness.rating} Avg Rating`} />
                        <KpiCard title="Shares" value={lifetimeMetrics.shares} icon={ExternalLink} subValue="Social shares" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="space-y-6">
                            <div className="glass-card p-6 rounded-2xl"><h3 className="font-bold text-dark dark:text-white mb-4">Quick Actions</h3><div className="grid grid-cols-2 gap-4">{quickActions.map((action, i) => (
                                <button key={i} onClick={action.action} className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all group bg-white dark:bg-slate-800"><div className={`p-3 rounded-full ${action.bg} ${action.color} mb-2 group-hover:scale-110 transition-transform`}><action.icon size={20} /></div><span className="font-bold text-sm text-dark dark:text-white">{action.label}</span><span className="text-[10px] text-gray-400 mt-1 text-center">{action.description}</span></button>
                            ))}</div></div>
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden"><div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div><h3 className="font-bold text-lg mb-2 flex items-center gap-2"><Info size={20} /> Pro Tip</h3><p className="text-blue-100 text-sm mb-4">Businesses with more than 5 photos get 40% more leads. Update your gallery today!</p><button className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors">Upload Photos</button></div>
                        </div>
                        <div className="lg:col-span-2 glass-card p-6 rounded-2xl"><div className="flex justify-between items-center mb-6"><h3 className="font-bold text-dark dark:text-white text-lg">Recent Reviews</h3><button onClick={() => setActiveTab('reviews')} className="text-primary text-sm font-bold hover:underline flex items-center gap-1">View All <ArrowRight size={16} /></button></div><div className="space-y-4">{businessReviews.slice(0, 3).map(review => (
                            <div key={review.id} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700"><div className="flex justify-between items-start mb-2"><div className="flex items-center gap-2"><img src={review.userImage} alt="" className="w-8 h-8 rounded-full" /><div><div className="font-bold text-dark dark:text-white text-sm">{review.userName}</div><div className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString()}</div></div></div><div className="flex items-center gap-1 text-xs font-bold text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400 px-2 py-1 rounded"><Star size={12} className="fill-current" /> {review.rating}</div></div><p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{review.text}</p> {!review.reply && <button onClick={() => setActiveTab('reviews')} className="mt-2 text-xs font-bold text-primary flex items-center gap-1"><MessageSquare size={12} /> Reply Now</button>}</div>
                        ))} {businessReviews.length === 0 && <div className="text-center py-8 text-gray-400 text-sm">No reviews yet.</div>}</div></div>
                    </div>
               </div>
           )}

           {activeTab === 'products' && (
               <div className="animate-fade-in space-y-8">
                   <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                       <div>
                           <h3 className="font-bold text-dark dark:text-white text-lg flex items-center gap-2">
                               <Package className="text-primary" size={20} /> Featured Products (Max 5)
                           </h3>
                           <p className="text-sm text-gray-500 dark:text-gray-400">These will appear in a carousel on your business detail page.</p>
                       </div>
                       <button 
                         onClick={() => handleOpenProductModal()} 
                         disabled={products.length >= 5}
                         className="bg-primary hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                       >
                           <Plus size={16} /> Add Product
                       </button>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {products.map(product => (
                           <div key={product.id} className="glass-card rounded-2xl overflow-hidden group">
                               <div className="h-40 bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
                                   <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                   <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-white text-[10px] font-bold">
                                       Qty: {product.quantity}
                                   </div>
                               </div>
                               <div className="p-5">
                                   <h4 className="font-bold text-dark dark:text-white mb-1 truncate">{product.name}</h4>
                                   <p className="text-lg font-black text-primary mb-4">₦{product.price.toLocaleString()}</p>
                                   <div className="flex gap-2">
                                       <button onClick={() => handleOpenProductModal(product)} className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-dark dark:text-white py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1">
                                           <Edit size={14} /> Edit
                                       </button>
                                       <button onClick={() => handleDeleteProduct(product.id)} className="p-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 rounded-lg transition-colors">
                                           <Trash2 size={16} />
                                       </button>
                                   </div>
                               </div>
                           </div>
                       ))}
                       {products.length === 0 && (
                           <div className="col-span-full text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-dashed border-2 border-gray-200 dark:border-gray-700 text-gray-400">
                               No featured products yet. Add your best items to showcase them!
                           </div>
                       )}
                   </div>
               </div>
           )}

           {activeTab === 'marketing' && (
               <div className="animate-fade-in space-y-8">
                   <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"><div><h3 className="font-bold text-dark dark:text-white text-lg flex items-center gap-2"><Megaphone className="text-primary" size={20} /> Ad Placements</h3><p className="text-sm text-gray-500 dark:text-gray-400">Manage your banner advertisements across the platform.</p></div><button onClick={() => openAdModal()} className="bg-primary hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md transition-colors flex items-center gap-2"><Plus size={16} /> Create Campaign</button></div>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{vendorAds.length > 0 ? vendorAds.map(ad => (
                       <div key={ad.id} className="glass-card rounded-2xl overflow-hidden group"><div className="h-32 bg-gray-100 dark:bg-gray-700 relative"><img src={ad.imageUrl} alt={ad.name} className="w-full h-full object-cover" /><div className="absolute top-2 right-2 flex gap-1"><span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase shadow-sm ${ad.status === 'active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>{ad.status}</span></div></div><div className="p-5"><h4 className="font-bold text-dark dark:text-white mb-1 truncate">{ad.name}</h4><p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{ad.location}</p><div className="grid grid-cols-3 gap-2 mb-4 text-center"><div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg"><div className="text-xs text-gray-400 uppercase font-bold">Views</div><div className="font-bold text-dark dark:text-white">{ad.impressions.toLocaleString()}</div></div><div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg"><div className="text-xs text-gray-400 uppercase font-bold">Clicks</div><div className="font-bold text-dark dark:text-white">{ad.clicks.toLocaleString()}</div></div><div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg"><div className="text-xs text-gray-400 uppercase font-bold">CTR</div><div className="font-bold text-dark dark:text-white">{(ad.impressions > 0 ? (ad.clicks / ad.impressions * 100) : 0).toFixed(1)}%</div></div></div><div className="flex gap-2"><button onClick={() => openAdModal(ad)} className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-dark dark:text-white py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1"><Edit size={14} /> Edit</button><button onClick={() => handleDeleteAd(ad.id)} className="p-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 rounded-lg transition-colors"><Trash2 size={16} /></button></div></div></div>
                   )) : <div className="col-span-full text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-dashed border-2 border-gray-200 dark:border-gray-700 text-gray-400">No ad campaigns created yet. Start promoting your business today!</div>}</div>
               </div>
           )}

           {activeTab === 'reviews' && (
               <div className="animate-fade-in space-y-6"><div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"><h3 className="font-bold text-dark dark:text-white text-lg">Manage Reviews</h3><div className="flex items-center gap-2"><span className="text-sm text-gray-500 dark:text-gray-400">Filter:</span><div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-lg"><button onClick={() => setReviewFilter('all')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${reviewFilter === 'all' ? 'bg-white dark:bg-gray-600 shadow text-dark dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>All</button><button onClick={() => setReviewFilter('unread')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${reviewFilter === 'unread' ? 'bg-white dark:bg-gray-600 shadow text-dark dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>Unread</button><button onClick={() => setReviewFilter('unreplied')} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${reviewFilter === 'unreplied' ? 'bg-white dark:bg-gray-600 shadow text-dark dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>Unreplied</button></div></div></div><div className="space-y-4">{filteredReviews.length > 0 ? filteredReviews.map(review => (
                   <ReviewCard key={review.id} review={review} currentUser={user} isOwner={true} onReply={handleVendorReply} />
               )) : <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-dashed border-2 border-gray-200 dark:border-gray-700 text-gray-400">No reviews found matching this filter.</div>}</div></div>
           )}

           {activeTab === 'settings' && (
               <div className="animate-fade-in max-w-2xl mx-auto space-y-6"><div className="glass-card p-6 rounded-2xl"><h3 className="font-bold text-dark dark:text-white text-lg mb-6 border-b border-gray-100 dark:border-gray-700 pb-2">Notification Preferences</h3><div className="space-y-4"><div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"><div className="flex items-center gap-3"><div className="bg-white dark:bg-gray-700 p-2 rounded-lg text-gray-600 dark:text-gray-300 shadow-sm"><Mail size={20} /></div><div><div className="font-bold text-dark dark:text-white text-sm">Email Notifications</div><div className="text-xs text-gray-500 dark:text-gray-400">Receive updates via email</div></div></div><button onClick={() => toggleNotificationPref('email')} className={`transition-colors ${user.notificationPreferences?.email ? 'text-primary' : 'text-gray-300'}`}>{user.notificationPreferences?.email ? <ToggleRight size={40} className="fill-current" /> : <ToggleLeft size={40} />}</button></div><div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"><div className="flex items-center gap-3"><div className="bg-white dark:bg-gray-700 p-2 rounded-lg text-gray-600 dark:text-gray-300 shadow-sm"><Bell size={20} /></div><div><div className="font-bold text-dark dark:text-white text-sm">In-App Notifications</div><div className="text-xs text-gray-500 dark:text-gray-400">Receive alerts in the dashboard</div></div></div><button onClick={() => toggleNotificationPref('inApp')} className={`transition-colors ${user.notificationPreferences?.inApp ? 'text-primary' : 'text-gray-300'}`}>{user.notificationPreferences?.inApp ? <ToggleRight size={40} className="fill-current" /> : <ToggleLeft size={40} />}</button></div></div></div><div className="glass-card p-6 rounded-2xl"><h3 className="font-bold text-dark dark:text-white text-lg mb-4">Account Status</h3><div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900 rounded-xl"><div className="flex items-center gap-3"><CheckCircle className="text-green-600 dark:text-green-400" /><span className="font-bold text-green-800 dark:text-green-300">Verified Business</span></div><span className="text-xs text-green-600 dark:text-green-400 font-medium">Active since {new Date(myBusiness.createdAt || '').toLocaleDateString()}</span></div></div></div>
           )}
        </>
      ) : (
        <div className="text-center py-20 glass-card rounded-2xl"><AlertTriangle size={48} className="mx-auto text-yellow-500 mb-4" /><h2 className="text-2xl font-bold text-dark dark:text-white mb-2">No Business Found</h2><p className="text-graytext dark:text-gray-400 mb-6">You haven't listed a business yet.</p><button onClick={() => navigate('/add-listing')} className="bg-primary hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg">Create Listing</button></div>
      )}

      {/* Product Upload/Edit Modal */}
      {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm animate-fade-in">
              <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
                  <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-slate-800/50">
                      <h3 className="font-bold text-lg text-dark dark:text-white">{editingProduct ? 'Edit Product' : 'Add Featured Product'}</h3>
                      <button onClick={() => setIsProductModalOpen(false)} className="text-gray-400 hover:text-dark dark:hover:text-white">
                          <X size={20} />
                      </button>
                  </div>
                  <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
                      <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Product Name</label>
                          <input 
                            value={productFormData.name} 
                            onChange={(e) => setProductFormData({...productFormData, name: e.target.value})} 
                            required 
                            className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:outline-none dark:text-white" 
                            placeholder="e.g. Deluxe Room or Chef's Special Burger" 
                          />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Price (₦)</label>
                              <input 
                                type="number" 
                                value={productFormData.price} 
                                onChange={(e) => setProductFormData({...productFormData, price: e.target.value})} 
                                required 
                                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:outline-none dark:text-white" 
                                placeholder="0" 
                              />
                          </div>
                          <div>
                              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Quantity Available</label>
                              <input 
                                type="number" 
                                value={productFormData.quantity} 
                                onChange={(e) => setProductFormData({...productFormData, quantity: e.target.value})} 
                                required 
                                className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:outline-none dark:text-white" 
                                placeholder="1" 
                              />
                          </div>
                      </div>

                      <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Product Image</label>
                          <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center hover:border-primary transition-colors bg-gray-50 dark:bg-slate-800/50 cursor-pointer">
                              {productFormData.image ? (
                                  <img src={productFormData.image} className="h-32 mx-auto object-cover rounded-lg" alt="Preview" />
                              ) : (
                                  <>
                                      <ImageIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                      <p className="text-xs text-gray-500">Click to upload product image</p>
                                  </>
                              )}
                          </div>
                      </div>

                      <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                          <button type="button" onClick={() => setIsProductModalOpen(false)} className="px-4 py-2 rounded-lg font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                          <button type="submit" className="bg-primary hover:bg-red-600 text-white px-6 py-2 rounded-lg font-bold shadow-md transition-colors">Save Product</button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {showPromoteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm animate-fade-in"><div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"><div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50"><div><h3 className="font-bold text-xl text-dark dark:text-white flex items-center gap-2"><Zap className="text-yellow-500" fill="currentColor" /> Promote Your Business</h3><p className="text-sm text-gray-500 dark:text-gray-400">Choose a package to boost your visibility</p></div><button onClick={() => setShowPromoteModal(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500 dark:text-gray-400"><X size={20} /></button></div><div className="p-6 overflow-y-auto custom-scrollbar bg-gray-50/30 dark:bg-slate-900"><div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">{PROMOTION_PACKAGES.map(pkg => { const isSelected = selectedPlan === pkg.id; return ( <div key={pkg.id} onClick={() => setSelectedPlan(pkg.id)} className={`relative rounded-2xl p-6 cursor-pointer transition-all duration-300 border-2 flex flex-col h-full ${isSelected ? `bg-white dark:bg-slate-800 border-primary shadow-xl scale-105 z-10` : `bg-white dark:bg-slate-800 ${pkg.borderColor} dark:border-gray-700 ${pkg.hoverBorder} hover:shadow-lg opacity-80 hover:opacity-100`}`}> {pkg.recommended && ( <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm"> Recommended </div> )} <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${pkg.bg} dark:bg-gray-700/50 ${pkg.color}`}> <pkg.icon size={24} /> </div> <h4 className="font-bold text-lg text-dark dark:text-white mb-1">{pkg.name}</h4> <div className="flex items-baseline gap-1 mb-4"> <span className="text-2xl font-black text-dark dark:text-white">{pkg.cost}</span> <span className="text-xs text-gray-500 font-bold uppercase">credits</span> </div> <ul className="space-y-3 mb-6 flex-grow"> {pkg.features.map((feat, i) => ( <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2"> <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" /> <span className="leading-tight">{feat}</span> </li> ))} </ul> <div className="pt-4 border-t border-gray-100 dark:border-gray-700"> <span className="text-xs text-gray-400 block text-center mb-2">{pkg.duration} Duration</span> <button className={`w-full py-2 rounded-lg font-bold text-sm transition-colors ${isSelected ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300'}`}> {isSelected ? 'Selected' : 'Select Plan'} </button> </div> </div> ); })}</div>{selectedPlan && ( <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4 animate-fade-in-up"> <div> <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Cost</div> <div className="flex items-center gap-2"> <span className="text-2xl font-black text-dark dark:text-white">{activePackage?.cost}</span> <span className="text-sm font-bold text-gray-500 uppercase">credits</span> </div> {missingCredits > 0 ? ( <div className="text-red-500 text-xs font-bold mt-1 flex items-center gap-1"> <AlertTriangle size={12} /> You need {missingCredits} more credits </div> ) : ( <div className="text-green-500 text-xs font-bold mt-1 flex items-center gap-1"> <CheckCircle size={12} /> Sufficient balance </div> )} </div> {missingCredits > 0 ? ( <button onClick={() => openTopUp(true)} className="bg-primary hover:bg-red-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-transform hover:scale-105 flex items-center gap-2"> <Plus size={18} /> Top Up Credits </button> ) : ( <button onClick={handlePromote} className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-transform hover:scale-105 flex items-center gap-2"> <Zap size={18} fill="currentColor" /> Activate Now </button> )} </div> )}</div></div></div>
      )}

      {showTopUpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm animate-fade-in"><div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl p-6 relative"><button onClick={() => setShowTopUpModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-dark dark:hover:text-white"><X size={20} /></button><div className="text-center mb-6"><div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500"><CreditCard size={32} /></div><h3 className="font-bold text-xl text-dark dark:text-white">Top Up Credits</h3><p className="text-sm text-gray-500 dark:text-gray-400">Purchase credits to promote your business.</p></div><div className="space-y-3 mb-6">{[{ amount: 100, cost: 5000, label: 'Starter' }, { amount: 500, cost: 22000, label: 'Value', popular: true }, { amount: 1000, cost: 40000, label: 'Pro' }].map((opt, i) => ( <button key={i} onClick={() => handleTopUp(opt.amount, opt.cost)} disabled={isProcessing} className="w-full flex justify-between items-center p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-800 transition-all group"> <div className="flex items-center gap-3"> <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center font-bold text-dark dark:text-white text-xs group-hover:bg-primary group-hover:text-white transition-colors"> {opt.amount} </div> <div className="text-left"> <div className="font-bold text-dark dark:text-white text-sm">{opt.label} Pack</div> {opt.popular && <span className="text-[10px] text-green-500 font-bold uppercase">Best Value</span>} </div> </div> <div className="font-bold text-dark dark:text-white">₦{opt.cost.toLocaleString()}</div> </button> ))}</div><p className="text-xs text-center text-gray-400">Secured by Paystack. Credits are non-refundable.</p>{isProcessing && ( <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-2xl z-10"> <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3"></div> <span className="font-bold text-dark dark:text-white">Processing Payment...</span> </div> )}</div></div>
      )}

      {isAdModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm animate-fade-in"><div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"><div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-slate-800/50"><h3 className="font-bold text-lg text-dark dark:text-white">{currentAd.id ? 'Edit Campaign' : 'New Ad Campaign'}</h3><button onClick={() => setIsAdModalOpen(false)} className="text-gray-400 hover:text-dark dark:hover:text-white"><X size={20} /></button></div><form onSubmit={handleSaveAd} className="p-6 space-y-4"><div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Placement Name</label><input name="name" defaultValue={currentAd.name} required className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:outline-none dark:text-white" placeholder="e.g. Summer Sale Banner" /></div><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Status</label><select name="status" defaultValue={currentAd.status} className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:outline-none dark:text-white"><option value="active">Active</option><option value="paused">Paused</option></select></div><div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Location</label><select name="location" defaultValue={currentAd.location} className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:outline-none dark:text-white"><option>Homepage Banner</option><option>Listing Sidebar</option><option>Search Results Top</option></select></div></div><div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Ad Image</label><div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center hover:border-primary transition-colors bg-gray-50 dark:bg-slate-800/50 cursor-pointer"><UploadCloud className="mx-auto h-8 w-8 text-gray-400 mb-2" /><p className="text-xs text-gray-500">Click to upload banner image</p></div></div><div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Destination URL</label><input name="destinationUrl" defaultValue={currentAd.destinationUrl} required className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:outline-none dark:text-white" placeholder="https://..." /></div><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Start Date</label><input type="date" name="startDate" defaultValue={currentAd.startDate?.split('T')[0]} required className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:outline-none dark:text-white" /></div><div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">End Date</label><input type="date" name="endDate" defaultValue={currentAd.endDate?.split('T')[0]} required className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:outline-none dark:text-white" /></div></div><div><label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Target Category</label><select name="category" defaultValue={currentAd.targeting?.category} className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:outline-none dark:text-white"><option value="">All Categories</option>{CATEGORIES.map(cat => ( <option key={cat.id} value={cat.name}>{cat.name}</option> ))}</select></div><div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800"><button type="button" onClick={() => setIsAdModalOpen(false)} className="px-4 py-2 rounded-lg font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Cancel</button><button type="submit" className="bg-primary hover:bg-red-600 text-white px-6 py-2 rounded-lg font-bold shadow-md transition-colors">Save Campaign</button></div></form></div></div>
      )}

    </div>
  );
};

export default BusinessDashboard;
