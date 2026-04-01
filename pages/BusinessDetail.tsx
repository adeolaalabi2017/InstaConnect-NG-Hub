
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_BUSINESSES, MOCK_REVIEWS } from '../constants';
import { Star, MapPin, Phone, Mail, Globe, Share2, Heart, Clock, CheckCircle, Instagram, MessageCircle, Facebook, Twitter, Link as LinkIcon, Check, Filter, ArrowUpDown, ShieldCheck, ToggleLeft, ToggleRight, ChevronLeft, ChevronRight, Package, ShoppingCart, Plus, Edit3, Trash2, X, UploadCloud, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BusinessCard from '../components/BusinessCard';
import { ReviewForm, RatingBreakdown, ReviewCard } from '../components/ReviewSystem';
import { Business, Review, Product } from '../types';
import { analyticsService } from '../services/analytics';
import { notificationService } from '../services/notification';
import { fetchBusinessById, fetchReviewsByBusinessId } from '../services/api';

const BusinessDetailSkeleton = () => (
  <div className="pb-20 animate-pulse">
    <div className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4 md:gap-6 w-full">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0"></div>
            <div className="w-full max-w-md">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div className="rounded-2xl bg-gray-200 dark:bg-gray-700 h-64 sm:h-96 w-full"></div>
        <div className="glass-card p-6 rounded-2xl h-48 bg-gray-200 dark:bg-gray-700"></div>
      </div>
      <div className="space-y-6">
        <div className="glass-card p-6 rounded-2xl h-64 bg-gray-200 dark:bg-gray-700"></div>
      </div>
    </div>
  </div>
);

const ProductCarousel: React.FC<{ 
    products: Product[], 
    isOwner: boolean, 
    onEdit: (p: Product) => void, 
    onAdd: () => void 
}> = ({ products, isOwner, onEdit, onAdd }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 300;
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    return (
        <div className="glass-card p-6 rounded-2xl mb-8 relative border-white/40 dark:border-white/5 shadow-xl">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <div className="bg-primary/10 p-2 rounded-lg text-primary">
                        <Package size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-dark dark:text-white">
                        Featured Selection
                    </h3>
                </div>
                <div className="flex gap-2">
                    {isOwner && products.length < 5 && (
                        <button 
                            onClick={onAdd}
                            className="mr-2 flex items-center gap-1.5 text-xs font-bold bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition-all shadow-md shadow-red-500/20"
                        >
                            <Plus size={14} /> Add Product
                        </button>
                    )}
                    <button onClick={() => scroll('left')} className="p-2 rounded-full border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <ChevronLeft size={20} className="text-gray-400" />
                    </button>
                    <button onClick={() => scroll('right')} className="p-2 rounded-full border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <ChevronRight size={20} className="text-gray-400" />
                    </button>
                </div>
            </div>

            {products.length > 0 ? (
                <div 
                    ref={scrollRef}
                    className="flex gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2"
                >
                    {products.map((product) => (
                        <div key={product.id} className="min-w-[260px] max-w-[260px] glass-card rounded-2xl overflow-hidden border-white/50 dark:border-white/5 snap-center shadow-lg hover:shadow-2xl transition-all duration-300 group relative">
                            <div className="h-44 relative overflow-hidden">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                                    <div className="bg-white/90 dark:bg-black/80 backdrop-blur px-2.5 py-1 rounded-lg text-[11px] font-black text-dark dark:text-white shadow-sm border border-white/20">
                                        ₦{product.price.toLocaleString()}
                                    </div>
                                    {product.quantity <= 3 && (
                                        <div className="bg-orange-500/90 backdrop-blur px-2.5 py-1 rounded-lg text-[9px] font-black text-white uppercase tracking-wider animate-pulse">
                                            Only {product.quantity} Left
                                        </div>
                                    )}
                                </div>
                                {isOwner && (
                                    <button 
                                        onClick={() => onEdit(product)}
                                        className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-slate-800/90 rounded-full text-primary opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                    >
                                        <Edit3 size={14} />
                                    </button>
                                )}
                            </div>
                            <div className="p-4 bg-white/50 dark:bg-transparent">
                                <h4 className="font-bold text-dark dark:text-white text-sm mb-3 truncate">{product.name}</h4>
                                <button className="w-full bg-dark dark:bg-white dark:text-dark text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-primary dark:hover:bg-primary dark:hover:text-white transition-all transform active:scale-95">
                                    <ShoppingCart size={14} /> Contact to Buy
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-12 text-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl">
                    <Package className="mx-auto text-gray-200 dark:text-gray-700 mb-2" size={48} />
                    <p className="text-gray-400 text-sm font-medium">No products showcased yet.</p>
                    {isOwner && (
                        <button onClick={onAdd} className="mt-4 text-primary font-bold hover:underline flex items-center gap-1 mx-auto">
                            <Plus size={16} /> Click here to add your first product
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

const BusinessDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'lowest' | 'helpful'>('recent');
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  
  const [business, setBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActiveListing, setIsActiveListing] = useState(false);

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productFormData, setProductFormData] = useState({ name: '', price: '', quantity: '', image: '' });
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
      const loadData = async () => {
          if (!id) return;
          setIsLoading(true);
          try {
              const [businessData, reviewsData] = await Promise.all([
                  fetchBusinessById(id),
                  fetchReviewsByBusinessId(id)
              ]);
              if (businessData) {
                  setBusiness(businessData);
                  setIsActiveListing(businessData.status === 'active');
                  setLocalProducts(businessData.products || []);
                  analyticsService.trackEvent('view', businessData.id, user?.id);
              }
              setReviews(reviewsData);
          } catch (error) {
              console.error("Failed to fetch business details", error);
          } finally {
              setIsLoading(false);
          }
      };
      loadData();
  }, [id, user]);

  if (isLoading) {
      return <BusinessDetailSkeleton />;
  }

  if (!business) {
    return <div className="text-center py-20 text-dark dark:text-white font-bold">Business not found</div>;
  }

  const handleOpenProductModal = (product?: Product) => {
      if (product) {
          setEditingProduct(product);
          setProductFormData({ 
              name: product.name, 
              price: product.price.toString(), 
              quantity: product.quantity.toString(), 
              image: product.image 
          });
      } else {
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
          setLocalProducts(localProducts.map(p => p.id === productData.id ? productData : p));
      } else {
          setLocalProducts([...localProducts, productData]);
      }
      setIsProductModalOpen(false);
  };

  const handleDeleteProduct = () => {
      if (editingProduct && window.confirm('Permanently delete this product?')) {
          setLocalProducts(localProducts.filter(p => p.id !== editingProduct.id));
          setIsProductModalOpen(false);
      }
  };

  const getProcessedReviews = () => {
      let filtered = reviews;
      if (filterRating !== 'all') {
          filtered = filtered.filter(r => Math.floor(r.rating) === filterRating);
      }
      return filtered.sort((a, b) => {
          if (sortBy === 'highest') return b.rating - a.rating;
          if (sortBy === 'lowest') return a.rating - b.rating;
          if (sortBy === 'helpful') return b.helpfulCount - a.helpfulCount;
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
          photos: [],
          status: 'active'
      };
      setReviews([newReview, ...reviews]);
      if (business.ownerId) {
          notificationService.notifyReview(business.ownerId, business.name, newReview.userName);
      }
  };

  const handleVendorReply = (reviewId: string, text: string) => {
      setReviews(prevReviews => prevReviews.map(r => 
          r.id === reviewId ? { ...r, reply: { text, date: new Date().toISOString() }, isRead: true } : r
      ));
  };

  const handleReportReview = (reviewId: string) => {
      setReviews(prevReviews => prevReviews.map(r => 
          r.id === reviewId ? { ...r, status: 'flagged' } : r
      ));
  };

  const isOwner = user?.id === business.ownerId || user?.role === 'admin';

  return (
    <div className="pb-20" onClick={() => showShareMenu && setShowShareMenu(false)}>
      {/* Header Profile Section */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
             <div className="flex items-center gap-4 md:gap-6">
                {business.logo && (
                    <img 
                        src={business.logo} 
                        alt={`${business.name} logo`} 
                        className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white dark:border-gray-800 shadow-lg object-cover bg-white dark:bg-gray-800 flex-shrink-0" 
                    />
                )}
                <div>
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h1 className="text-2xl md:text-3xl font-bold text-dark dark:text-white">{business.name}</h1>
                        <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md">{business.rating}</span>
                        {!isActiveListing && isOwner && (
                            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-md border border-red-200">Inactive</span>
                        )}
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
             </div>
             <div className="flex gap-3 relative z-20 w-full md:w-auto mt-4 md:mt-0 flex-wrap">
                {isOwner && (
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-red-600 font-medium transition-colors shadow-lg shadow-red-500/20">
                        <Edit3 size={18} /> Manage Business
                    </button>
                )}
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-dark dark:text-white font-medium transition-colors">
                    <Heart size={18} /> Save
                </button>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            {/* Cover Image */}
            <div className="rounded-2xl overflow-hidden shadow-lg h-64 sm:h-96 relative group">
                <img src={business.image} alt={business.name} loading="lazy" className={`w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* About Section */}
            <div className="glass-card p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-dark dark:text-white mb-4">About Business</h3>
                <p className="text-graytext dark:text-gray-300 leading-relaxed mb-6 text-sm sm:text-base">
                    {business.description}
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

            {/* PRODUCT CAROUSEL INTEGRATION */}
            <ProductCarousel 
                products={localProducts} 
                isOwner={isOwner} 
                onEdit={handleOpenProductModal}
                onAdd={() => handleOpenProductModal()}
            />

            {/* Reviews Section */}
            <div id="reviews">
                <h3 className="text-2xl font-bold text-dark dark:text-white mb-6 flex items-center gap-2">
                    Reviews <span className="text-gray-400 text-lg font-medium">({reviews.length})</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center text-center">
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
                {processedReviews.map(review => (
                    <ReviewCard key={review.id} review={review} currentUser={user} isOwner={isOwner} onReport={handleReportReview} onReply={handleVendorReply} />
                ))}
            </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
            <div className="glass-card p-6 rounded-2xl sticky top-24">
                <h3 className="text-lg font-bold text-dark dark:text-white mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">Contact Info</h3>
                <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3 text-graytext dark:text-gray-300"><MapPin className="mt-1 text-primary shrink-0" size={18} /><span className="text-sm">{business.location}</span></div>
                    <div className="flex items-center gap-3 text-graytext dark:text-gray-300"><Phone className="text-primary shrink-0" size={18} /><a href={`tel:${business.phone}`} className="text-sm hover:text-primary transition-colors">{business.phone}</a></div>
                    <div className="flex items-center gap-3 text-graytext dark:text-gray-300"><Mail className="text-primary shrink-0" size={18} /><a href={`mailto:${business.email}`} className="text-sm hover:text-primary transition-colors">{business.email}</a></div>
                </div>
                {business.whatsapp && (
                   <a href={`https://wa.me/${business.whatsapp.replace(/\+/g, '')}`} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-500/30 transition-all mb-3 flex items-center justify-center gap-2"><MessageCircle size={20} /> WhatsApp Us</a>
                )}
                {business.instagramHandle && (
                   <a href={`https://instagram.com/${business.instagramHandle.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] hover:opacity-90 text-white font-bold py-3 rounded-xl shadow-lg shadow-pink-500/20 transition-all mb-3 flex items-center justify-center gap-2">
                       <Instagram size={20} /> Follow on Instagram
                   </a>
                )}
                <a href={`tel:${business.phone}`} className="block w-full text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-dark dark:text-white font-bold py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">Call Now</a>
            </div>
        </div>
      </div>

      {/* PRODUCT MANAGEMENT MODAL (Only for Owners) */}
      {isProductModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark/80 backdrop-blur-md animate-fade-in">
              <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-white/20">
                  <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
                      <h3 className="font-bold text-xl text-dark dark:text-white flex items-center gap-2">
                          <Package className="text-primary" /> {editingProduct ? 'Update Item' : 'New Showcase Item'}
                      </h3>
                      <button onClick={() => setIsProductModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-400">
                          <X size={20} />
                      </button>
                  </div>
                  <form onSubmit={handleSaveProduct} className="p-6 space-y-5">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl flex items-start gap-2 mb-2">
                          <AlertCircle size={16} className="text-blue-500 shrink-0 mt-0.5" />
                          <p className="text-[11px] text-blue-700 dark:text-blue-300 font-medium">Showcase items are the first thing customers see. You can add up to 5 items to your digital storefront.</p>
                      </div>

                      <div>
                          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Product Name</label>
                          <input 
                            value={productFormData.name} 
                            onChange={(e) => setProductFormData({...productFormData, name: e.target.value})} 
                            required 
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-0 focus:outline-none dark:text-white" 
                            placeholder="e.g. Luxury Penthouse Suite" 
                          />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Price (₦)</label>
                              <input 
                                type="number" 
                                value={productFormData.price} 
                                onChange={(e) => setProductFormData({...productFormData, price: e.target.value})} 
                                required 
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-0 focus:outline-none dark:text-white" 
                                placeholder="0" 
                              />
                          </div>
                          <div>
                              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Stock Level</label>
                              <input 
                                type="number" 
                                value={productFormData.quantity} 
                                onChange={(e) => setProductFormData({...productFormData, quantity: e.target.value})} 
                                required 
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-0 focus:outline-none dark:text-white" 
                                placeholder="1" 
                              />
                          </div>
                      </div>

                      <div>
                          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Item Image URL</label>
                          <div className="flex gap-2">
                             <input 
                                type="url"
                                value={productFormData.image} 
                                onChange={(e) => setProductFormData({...productFormData, image: e.target.value})} 
                                className="flex-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:outline-none dark:text-white text-sm" 
                                placeholder="Paste image link here..." 
                             />
                             <button type="button" className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-500 hover:text-primary transition-colors">
                                 <UploadCloud size={20} />
                             </button>
                          </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-800">
                          {editingProduct ? (
                             <button type="button" onClick={handleDeleteProduct} className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1">
                                 <Trash2 size={14} /> Remove Item
                             </button>
                          ) : <div></div>}
                          <div className="flex gap-3">
                              <button type="button" onClick={() => setIsProductModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">Cancel</button>
                              <button type="submit" className="bg-primary hover:bg-red-600 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-red-500/30 transition-all transform active:scale-95">Save Product</button>
                          </div>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default BusinessDetail;
