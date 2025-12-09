import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_BUSINESSES } from '../constants';
import BusinessCard from '../components/BusinessCard';
import { Star, Edit, X, Search, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Business } from '../types';

const WriteReviewModal = ({ onClose }: { onClose: () => void }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [hoveredRating, setHoveredRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const filteredBusinesses = searchTerm 
        ? MOCK_BUSINESSES.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase()))
        : [];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            alert(`Review submitted for ${selectedBusiness?.name}! Thank you for your feedback.`);
            onClose();
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-lg text-dark">Write a Review</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-dark">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {!selectedBusiness ? (
                        <div className="space-y-4">
                            <label className="block text-sm font-bold text-gray-700">Select a Business</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                <input 
                                    type="text"
                                    placeholder="Search for a business..."
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-colors text-dark"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            
                            <div className="space-y-2 mt-2">
                                {searchTerm && filteredBusinesses.length === 0 && (
                                    <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        <p className="text-gray-500 text-sm">No businesses found.</p>
                                    </div>
                                )}
                                {filteredBusinesses.map(b => (
                                    <button 
                                        key={b.id}
                                        onClick={() => setSelectedBusiness(b)}
                                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100 text-left group"
                                    >
                                        <img src={b.image} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-200" />
                                        <div className="flex-1 min-w-0">
                                            <div className="font-bold text-dark text-sm truncate group-hover:text-primary transition-colors">{b.name}</div>
                                            <div className="text-xs text-gray-400 truncate">{b.location}</div>
                                        </div>
                                        <ChevronRight size={16} className="ml-auto text-gray-300 group-hover:text-primary" />
                                    </button>
                                ))}
                                {!searchTerm && (
                                    <div className="text-center text-gray-400 text-sm py-8 bg-gray-50/50 rounded-xl border border-dashed border-gray-100">
                                        Start typing to find the business you want to review.
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                                <img src={selectedBusiness.image} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-200" />
                                <div>
                                    <div className="font-bold text-dark text-sm">{selectedBusiness.name}</div>
                                    <div className="text-xs text-gray-500">{selectedBusiness.category}</div>
                                </div>
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setSelectedBusiness(null);
                                        setRating(0);
                                        setReviewText('');
                                    }}
                                    className="ml-auto text-xs font-bold text-primary hover:underline"
                                >
                                    Change
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-3">Rate your experience</label>
                                <div className="flex gap-2 justify-center py-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            type="button"
                                            key={star}
                                            onMouseEnter={() => setHoveredRating(star)}
                                            onMouseLeave={() => setHoveredRating(0)}
                                            onClick={() => setRating(star)}
                                            className="focus:outline-none transition-transform hover:scale-110 p-1"
                                        >
                                            <Star 
                                                size={36} 
                                                className={`${star <= (hoveredRating || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} 
                                            />
                                        </button>
                                    ))}
                                </div>
                                <p className="text-center text-xs text-gray-400 mt-2 font-medium">
                                    {rating === 1 ? "Terrible" : rating === 2 ? "Bad" : rating === 3 ? "Okay" : rating === 4 ? "Good" : rating === 5 ? "Excellent" : "Select a rating"}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Your Review</label>
                                <textarea 
                                    rows={4}
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    placeholder="Tell us about your experience..."
                                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-primary resize-none transition-colors text-sm text-dark"
                                    required
                                ></textarea>
                            </div>

                            <button 
                                type="submit" 
                                disabled={!rating || !reviewText || isSubmitting}
                                className="w-full bg-primary hover:bg-red-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit Review'
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

const TopRated: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [showReviewModal, setShowReviewModal] = useState(false);

    // Sort businesses by rating (descending), then by review count
    const topBusinesses = [...MOCK_BUSINESSES]
        .filter(b => b.rating >= 4.0) // Only show 4.0+
        .sort((a, b) => {
            if (b.rating !== a.rating) return b.rating - a.rating;
            return b.reviewCount - a.reviewCount;
        });

    const handleWriteReview = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setShowReviewModal(true);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-600 px-4 py-1.5 rounded-full font-bold text-sm mb-4">
                    <Star size={16} className="fill-current" /> Community Favorites
                </div>
                <h1 className="text-4xl font-extrabold text-dark mb-4">Top Rated Businesses</h1>
                <p className="text-graytext text-lg max-w-2xl mx-auto mb-8">
                    Discover the most loved spots in Nigeria, ranked by the people who know them best.
                </p>
                
                <button 
                    onClick={handleWriteReview}
                    className="inline-flex items-center gap-2 bg-primary hover:bg-red-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-red-500/30 transition-all transform hover:-translate-y-1"
                >
                    <Edit size={20} /> Write a Review
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {topBusinesses.map((business, index) => (
                    <div key={business.id} className="relative">
                        {/* Rank Badge */}
                        <div className="absolute -top-4 -left-4 w-12 h-12 bg-dark text-white rounded-full flex items-center justify-center font-black text-xl shadow-xl z-10 border-4 border-white">
                            #{index + 1}
                        </div>
                        <BusinessCard business={business} />
                    </div>
                ))}
            </div>

            {topBusinesses.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-gray-400">No top rated businesses found yet.</p>
                </div>
            )}

            {showReviewModal && <WriteReviewModal onClose={() => setShowReviewModal(false)} />}
        </div>
    );
};

export default TopRated;