
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_BUSINESSES, MOCK_REVIEWS } from '../constants';
import { Star, MapPin, Phone, Mail, Globe, Share2, Heart, Clock, CheckCircle, Instagram, MessageCircle, Facebook, Twitter, Link as LinkIcon, Check, Filter, ArrowUpDown, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BusinessCard from '../components/BusinessCard';
import { ReviewForm, RatingBreakdown, ReviewCard } from '../components/ReviewSystem';
import { Review } from '../types';
import { analyticsService } from '../services/analytics';
import { notificationService } from '../services/notification';

const BusinessDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Review System State
  const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'lowest' | 'helpful'>('recent');
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  
  const business = MOCK_BUSINESSES.find(b => b.id === id);

  // Analytics: Track View on Mount
  useEffect(() => {
      if (business) {
          analyticsService.trackEvent('view', business.id, user?.id);
      }
  }, [business, user]);

  // Mock Reviews - Fetch reviews for this business
  const [reviews, setReviews] = useState<Review[]>(
      MOCK_REVIEWS.filter(r => r.businessId === id)
  );

  if (!business) {
    return <div className="text-center py-20 text-dark dark:text-white">Business not found</div>;
  }

  // Filter and Sort Reviews
  const getProcessedReviews = () => {
      let filtered = reviews;
      
      if (filterRating !== 'all') {
          filtered = filtered.filter(r => Math.floor(r.rating) === filterRating);
      }

      return filtered.sort((a, b) => {
          if (sortBy === 'highest') return b.rating - a.rating;
          if (sortBy === 'lowest') return a.rating - b.rating;
          if (sortBy === 'helpful') return b.helpfulCount - a.helpfulCount;
          // default recent
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  };

  const processedReviews = getProcessedReviews();

  const handleReviewSubmit = (rating: number, text: string, photos: File[]) => {
      const newReview: Review = {
          id: Math.random().toString(),
          businessId: business.id,
          userId: user?.id || 'guest',
          userName: user?.name || 'Guest User',
          userImage: user?.image || 'https://ui-avatars.com/api/?name=Guest',
          rating: rating,
          date: new Date().toISOString(),
          text: text,
          helpfulCount: 0,
          photos: [], // In a real app, we'd handle file uploads here
          status: 'active'
      };
      setReviews([newReview, ...reviews]);

      // Trigger Notification to Business Owner
      if (business.ownerId) {
          notificationService.notifyReview(business.ownerId, business.name, newReview.userName);
      }
  };

  const handleContactClick = (type: 'call_click' | 'email_click' | 'whatsapp_click' | 'website_click') => {
      analyticsService.trackEvent(type, business.id, user?.id);
  };

  const handleShare = () => {
      analyticsService.trackEvent('share', business.id, user?.id);
  };

  const handleClaimListing = () => {
      if (window.confirm(`Are you the owner of ${business.name}? Click OK to request verification.`)) {
          alert("Verification request submitted! Our team will contact you shortly.");
      }
  };

  // Find related businesses in the same category, excluding current one
  const relatedBusinesses = MOCK_BUSINESSES
    .filter(b => b.category === business.category && b.id !== business.id)
    .slice(0, 4);

  const shareUrl = window.location.href;
  const shareText = `Check out ${business.name} on InstaConnect NG!`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    handleShare();
    setTimeout(() => {
        setCopied(false);
        setShowShareMenu(false);
    }, 2000);
  };

  return (
    <div className="pb-20" onClick={() => showShareMenu && setShowShareMenu(false)}>
      {/* Header Info */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
             <div>
                <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-dark dark:text-white">{business.name}</h1>
                    <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md">{business.rating}</span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-graytext dark:text-gray-400">
                   <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={`${i < Math.floor(business.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
                      ))}
                      <span className="ml-1">({business.reviewCount} reviews)</span>
                   </div>
                   <div className="flex items-center gap-1">
                      <MapPin size={14} className="text-primary" />
                      {business.location}
                   </div>
                   <div className="flex items-center gap-1">
                      <span className="text-primary font-semibold">{business.priceRange}</span>
                   </div>
                </div>
             </div>
             <div className="flex gap-3 relative z-20">
                <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-dark dark:text-white font-medium transition-colors">
                    <Heart size={18} /> Save
                </button>
                
                <div className="relative">
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowShareMenu(!showShareMenu);
                        }}
                        className={`flex items-center gap-2 px-4 py-2 border rounded-lg font-medium transition-colors ${showShareMenu ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-dark dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    >
                        <Share2 size={18} /> Share
                    </button>

                    {showShareMenu && (
                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-2 animate-fade-in-up origin-top-right">
                            <div className="text-xs font-semibold text-gray-400 px-3 py-2 uppercase tracking-wider">Share via</div>
                            
                            <a 
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                onClick={handleShare}
                                className="flex items-center gap-3 px-3 py-2 text-dark dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors text-sm font-medium"
                            >
                                <Facebook size={18} className="text-blue-600" /> Facebook
                            </a>
                            
                            <a 
                                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                onClick={handleShare}
                                className="flex items-center gap-3 px-3 py-2 text-dark dark:text-gray-200 hover:bg-sky-50 dark:hover:bg-sky-900/30 rounded-lg transition-colors text-sm font-medium"
                            >
                                <Twitter size={18} className="text-sky-500" /> Twitter
                            </a>
                            
                            <a 
                                href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                onClick={handleShare}
                                className="flex items-center gap-3 px-3 py-2 text-dark dark:text-gray-200 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors text-sm font-medium"
                            >
                                <MessageCircle size={18} className="text-green-500" /> WhatsApp
                            </a>
                            
                            <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                            
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopy();
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2 text-dark dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-left text-sm font-medium"
                            >
                                {copied ? <Check size={18} className="text-green-600" /> : <LinkIcon size={18} className="text-gray-400" />}
                                {copied ? 'Copied!' : 'Copy Link'}
                            </button>
                        </div>
                    )}
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Main) */}
        <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <div className="rounded-2xl overflow-hidden shadow-lg h-96 relative">
                <img 
                  src={business.image} 
                  alt={business.name} 
                  loading="lazy"
                  className="w-full h-full object-cover" 
                />
                <div className="absolute bottom-4 right-4">
                    <button className="bg-white/90 dark:bg-black/80 backdrop-blur px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white dark:hover:bg-black text-dark dark:text-white">View All Photos</button>
                </div>
            </div>

            {/* About */}
            <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-dark dark:text-white mb-4">About Business</h3>
                <p className="text-graytext dark:text-gray-300 leading-relaxed mb-6">
                    {business.description}
                    <br/><br/>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>

                <h4 className="font-semibold text-dark dark:text-white mb-3">Amenities</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {business.tags.map((tag, i) => (
                        <div key={i} className="flex items-center gap-2 text-graytext dark:text-gray-300 text-sm">
                            <CheckCircle size={16} className="text-primary" />
                            {tag}
                        </div>
                    ))}
                </div>
            </div>

            {/* Reviews Section */}
            <div id="reviews">
                <h3 className="text-2xl font-bold text-dark dark:text-white mb-6 flex items-center gap-2">
                    Reviews <span className="text-gray-400 text-lg font-medium">({reviews.length})</span>
                </h3>

                {/* Rating Breakdown & Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center">
                        <div className="text-5xl font-black text-dark dark:text-white mb-2">{business.rating}</div>
                        <div className="flex gap-1 mb-2">
                             {[...Array(5)].map((_, i) => (
                                <Star key={i} size={20} className={`${i < Math.floor(business.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
                             ))}
                        </div>
                        <p className="text-gray-500 text-sm">Overall Rating</p>
                    </div>
                    <RatingBreakdown reviews={reviews} />
                </div>

                {/* Review Form */}
                {user ? (
                    <ReviewForm user={user} onSubmit={handleReviewSubmit} />
                ) : (
                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl text-center mb-8 border border-gray-100 dark:border-gray-700">
                        <p className="text-dark dark:text-white font-medium mb-3">Share your experience with this business</p>
                        <Link to="/login" className="inline-block bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 px-6 py-2.5 rounded-xl text-primary font-bold shadow-sm hover:shadow-md transition-all">
                            Log in to write a review
                        </Link>
                    </div>
                )}

                {/* Sorting and Filtering */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                         <div className="relative">
                            <select 
                                value={sortBy} 
                                onChange={(e) => setSortBy(e.target.value as any)}
                                className="appearance-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-dark dark:text-white text-sm font-medium rounded-lg pl-9 pr-8 py-2 focus:outline-none focus:border-primary cursor-pointer"
                            >
                                <option value="recent">Most Recent</option>
                                <option value="helpful">Most Helpful</option>
                                <option value="highest">Highest Rated</option>
                                <option value="lowest">Lowest Rated</option>
                            </select>
                            <ArrowUpDown size={14} className="absolute left-3 top-2.5 text-gray-400" />
                         </div>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
                        <span className="text-sm text-gray-400 font-medium whitespace-nowrap">Filter by:</span>
                        <button 
                            onClick={() => setFilterRating('all')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${filterRating === 'all' ? 'bg-dark dark:bg-white text-white dark:text-dark' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                        >
                            All
                        </button>
                        {[5, 4, 3, 2, 1].map(star => (
                            <button
                                key={star}
                                onClick={() => setFilterRating(star)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors flex items-center gap-1 ${filterRating === star ? 'bg-yellow-400 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                            >
                                {star} <Star size={10} className="fill-current" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Review List */}
                {processedReviews.length > 0 ? (
                    processedReviews.map(review => (
                        <ReviewCard 
                            key={review.id} 
                            review={review} 
                            currentUser={user}
                            isOwner={user?.role === 'vendor' && user?.id === business.ownerId}
                        />
                    ))
                ) : (
                    <div className="text-center py-10 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-dashed border-2 border-gray-200 dark:border-gray-700 text-gray-400">
                        No reviews found matching your criteria.
                    </div>
                )}
            </div>
        </div>

        {/* Right Column (Sidebar) */}
        <div className="space-y-6">
            {/* Contact Card */}
            <div className="glass-card p-6 rounded-2xl sticky top-24">
                <h3 className="text-lg font-bold text-dark dark:text-white mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">Contact Info</h3>
                
                <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3 text-graytext dark:text-gray-300">
                        <MapPin className="mt-1 text-primary shrink-0" size={18} />
                        <span className="text-sm">{business.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-graytext dark:text-gray-300">
                        <Phone className="text-primary shrink-0" size={18} />
                        <a 
                           href={`tel:${business.phone}`} 
                           onClick={() => handleContactClick('call_click')} 
                           className="text-sm hover:text-primary"
                        >
                           {business.phone}
                        </a>
                    </div>
                    <div className="flex items-center gap-3 text-graytext dark:text-gray-300">
                        <Mail className="text-primary shrink-0" size={18} />
                        <a 
                           href={`mailto:${business.email}`} 
                           onClick={() => handleContactClick('email_click')}
                           className="text-sm hover:text-primary"
                        >
                           {business.email}
                        </a>
                    </div>
                    
                    {business.instagramHandle && (
                      <div className="flex items-center gap-3 text-graytext dark:text-gray-300">
                          <Instagram className="text-primary shrink-0" size={18} />
                          <a href={`https://instagram.com/${business.instagramHandle}`} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-primary">
                            @{business.instagramHandle}
                          </a>
                      </div>
                    )}

                    {business.whatsapp && (
                      <div className="flex items-center gap-3 text-graytext dark:text-gray-300">
                          <MessageCircle className="text-primary shrink-0" size={18} />
                          <a 
                             href={`https://wa.me/${business.whatsapp.replace(/\+/g, '')}`} 
                             onClick={() => handleContactClick('whatsapp_click')}
                             target="_blank" 
                             rel="noopener noreferrer" 
                             className="text-sm hover:text-primary"
                          >
                            Chat on WhatsApp
                          </a>
                      </div>
                    )}

                     <div className="flex items-center gap-3 text-graytext dark:text-gray-300">
                        <Globe className="text-primary shrink-0" size={18} />
                        <a 
                           href="#" 
                           onClick={() => handleContactClick('website_click')}
                           className="text-sm hover:text-primary"
                        >
                           www.website.com
                        </a>
                    </div>
                </div>

                <div className="mb-6">
                    <h4 className="font-semibold text-dark dark:text-white mb-2 text-sm flex items-center gap-2">
                        <Clock size={16} /> Opening Hours
                    </h4>
                    <div className="flex justify-between text-sm text-graytext dark:text-gray-400 mb-1">
                        <span>Monday - Friday</span>
                        <span>09:00 - 20:00</span>
                    </div>
                    <div className="flex justify-between text-sm text-graytext dark:text-gray-400">
                        <span>Saturday - Sunday</span>
                        <span>10:00 - 22:00</span>
                    </div>
                </div>

                {business.whatsapp ? (
                   <a 
                      href={`https://wa.me/${business.whatsapp.replace(/\+/g, '')}`} 
                      onClick={() => handleContactClick('whatsapp_click')}
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="block w-full text-center bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-500/30 transition-all mb-3 flex items-center justify-center gap-2"
                   >
                      <MessageCircle size={20} /> WhatsApp Us
                   </a>
                ) : (
                  <button className="w-full bg-primary hover:bg-red-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-red-500/30 transition-all mb-3">
                      Send Message
                  </button>
                )}
                
                 <a 
                    href={`tel:${business.phone}`} 
                    onClick={() => handleContactClick('call_click')}
                    className="block w-full text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-dark dark:text-white font-bold py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                 >
                    Call Now
                </a>

                {user?.role === 'vendor' && user?.id !== business.ownerId && (
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-center">
                        <button 
                            onClick={handleClaimListing}
                            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-dark dark:hover:text-white font-medium transition-colors"
                        >
                            <ShieldCheck size={16} /> Claim this listing
                        </button>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Related Businesses / You Might Also Like */}
      {relatedBusinesses.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 border-t border-gray-100 dark:border-gray-800 pt-12">
           <h3 className="text-2xl font-bold text-dark dark:text-white mb-6">You Might Also Like</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {relatedBusinesses.map(b => (
                   <BusinessCard key={b.id} business={b} />
               ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default BusinessDetail;
