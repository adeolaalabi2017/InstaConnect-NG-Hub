
import React, { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, Camera, MessageCircle, CornerDownRight, Flag, Award, Send, X } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Review, User } from '../types';
import { MOCK_BADGES, MOCK_USERS_LIST } from '../constants';
import { useNavigate } from 'react-router-dom';

// --- Rating Breakdown Component ---
export const RatingBreakdown: React.FC<{ reviews: Review[] }> = ({ reviews }) => {
    const total = reviews.length;
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    
    reviews.forEach(r => {
        const rating = Math.round(r.rating) as 1|2|3|4|5;
        if (counts[rating] !== undefined) counts[rating]++;
    });

    return (
        <div className="glass-card p-6 rounded-2xl mb-8">
            <h4 className="font-bold text-dark dark:text-white mb-4 text-lg">Rating Breakdown</h4>
            <div className="space-y-3">
                {[5, 4, 3, 2, 1].map(star => {
                    const count = counts[star as keyof typeof counts];
                    const percentage = total > 0 ? (count / total) * 100 : 0;
                    return (
                        <div key={star} className="flex items-center gap-3">
                            <div className="flex items-center w-12 gap-1 text-sm font-medium text-gray-600 dark:text-gray-300">
                                {star} <Star size={12} className="fill-gray-400 text-gray-400" />
                            </div>
                            <div className="flex-1 h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                            <div className="w-10 text-xs text-gray-400 text-right">{Math.round(percentage)}%</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// --- Review Form Component ---
interface ReviewFormProps {
    onSubmit: (rating: number, text: string, photos: File[]) => void;
    user: User;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, user }) => {
    const [rating, setRating] = useState(0);
    const [text, setText] = useState('');
    const [hoveredRating, setHoveredRating] = useState(0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) return alert('Please select a rating');
        onSubmit(rating, text, []);
        setRating(0);
        setText('');
    };

    return (
        <div className="glass-card p-6 rounded-2xl mb-8 border border-primary/10 bg-primary/5 dark:bg-primary/10">
            <h4 className="font-bold text-dark dark:text-white mb-4">Write a Review</h4>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Rating</label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                type="button"
                                key={star}
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(0)}
                                onClick={() => setRating(star)}
                                className="focus:outline-none transition-transform hover:scale-110"
                            >
                                <Star 
                                    size={28} 
                                    className={`${star <= (hoveredRating || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} 
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Review</label>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={4}
                        placeholder="Share your experience with others..."
                        className="w-full bg-white dark:bg-slate-900 rounded-xl p-4 text-sm border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-primary transition-colors text-dark dark:text-white placeholder-gray-400"
                        required
                    />
                </div>

                <div className="flex justify-between items-center">
                    <button type="button" className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-dark dark:hover:text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors">
                        <Camera size={18} /> Add Photos
                    </button>

                    <button 
                        type="submit" 
                        disabled={!text || rating === 0}
                        className="bg-primary text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-red-500/30 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        Post Review
                    </button>
                </div>
            </form>
        </div>
    );
};

// --- Review Card Component ---
interface ReviewCardProps {
    review: Review;
    currentUser: User | null;
    isOwner: boolean;
    onReply?: (reviewId: string, text: string) => void;
    onReport?: (reviewId: string) => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, currentUser, isOwner, onReply, onReport }) => {
    const navigate = useNavigate();
    const [vote, setVote] = useState<'yes' | 'no' | null>(null);
    const [likeCount, setLikeCount] = useState(review.helpfulCount);
    const [isReported, setIsReported] = useState(false);
    
    // Reply State
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState('');

    const reviewUser = MOCK_USERS_LIST.find(u => u.id === review.userId) || { badges: [], reputationPoints: 0 };
    const isReviewAuthor = currentUser?.id === review.userId;

    const handleVote = (type: 'yes' | 'no') => {
        if (!currentUser) {
            if (window.confirm("Please log in to vote on reviews. Go to login?")) {
                navigate('/login');
            }
            return;
        }

        if (isReviewAuthor) return;

        if (vote === type) {
            setVote(null);
            if (type === 'yes') setLikeCount(prev => prev - 1);
        } else {
            if (vote === 'yes') setLikeCount(prev => prev - 1);
            setVote(type);
            if (type === 'yes') setLikeCount(prev => prev + 1);
        }
    };

    const handleReport = () => {
        if (!currentUser) {
             if (window.confirm("Please log in to report content. Go to login?")) {
                navigate('/login');
            }
            return;
        }

        if (window.confirm("Report this review as inappropriate?")) {
            setIsReported(true);
            if (onReport) onReport(review.id);
            alert("Review flagged for moderation.");
        }
    };

    const submitReply = () => {
        if (!replyText.trim()) return;
        if (onReply) {
            onReply(review.id, replyText);
            setIsReplying(false);
            setReplyText('');
        } else {
            alert("Reply submitted! (Demo mode)");
            setIsReplying(false);
        }
    }

    if (review.status === 'hidden' && currentUser?.role !== 'admin') return null;

    return (
        <div className={`glass-card p-6 rounded-2xl mb-6 relative transition-all hover:shadow-lg ${review.status === 'flagged' && currentUser?.role === 'admin' ? 'border-2 border-red-200 bg-red-50 dark:bg-red-900/10' : ''}`}>
            {currentUser?.role === 'admin' && review.status !== 'active' && (
                 <div className="absolute top-2 right-2 px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded uppercase">
                     {review.status}
                 </div>
            )}

            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <img 
                      src={review.userImage} 
                      alt={review.userName} 
                      className="w-10 h-10 rounded-full object-cover border border-gray-100 dark:border-gray-700" 
                    />
                    <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <h5 className="font-bold text-dark dark:text-white text-sm">{review.userName}</h5>
                            <div className="flex items-center gap-1">
                                {reviewUser.reputationPoints > 1500 && (
                                    <div className="flex items-center gap-0.5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-1.5 py-0.5 rounded-[4px] text-[9px] font-black uppercase tracking-tighter" title="Top Contributor">
                                        <Award size={10} /> Pro
                                    </div>
                                )}
                                {reviewUser.badges && reviewUser.badges.length > 0 && (
                                    reviewUser.badges.map(bid => {
                                        const badge = MOCK_BADGES.find(b => b.id === bid);
                                        if (!badge) return null;
                                        const BadgeIcon = (Icons as any)[badge.icon] || Icons.Shield;
                                        return (
                                            <div key={bid} title={badge.name} className="w-4 h-4 rounded-md flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                                                <BadgeIcon size={10} />
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                        <span className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString()}</span>
                    </div>
                </div>
                <div className="flex bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded text-yellow-600 dark:text-yellow-400 font-bold text-xs">
                    <Star size={12} className="fill-yellow-600 dark:fill-yellow-400 mr-1" /> {review.rating}.0
                </div>
            </div>

            <p className="text-graytext dark:text-gray-300 text-sm mb-4 leading-relaxed">{review.text}</p>
            
            {review.photos && review.photos.length > 0 && (
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                    {review.photos.map((photo, i) => (
                        <img key={i} src={photo} alt="Review attachment" className="h-20 w-20 object-cover rounded-lg border border-gray-100 dark:border-gray-700" />
                    ))}
                </div>
            )}

            <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400 font-medium hidden sm:inline">Was this review helpful?</span>
                        <button 
                            onClick={() => handleVote('yes')}
                            disabled={isReviewAuthor}
                            className={`flex items-center gap-1 text-xs font-bold transition-colors ${vote === 'yes' ? 'text-green-600' : 'text-gray-400 hover:text-green-600'} ${isReviewAuthor ? 'cursor-not-allowed opacity-50' : ''}`}
                            title="Yes"
                        >
                            <ThumbsUp size={14} className={vote === 'yes' ? 'fill-green-600' : ''} /> {likeCount > 0 ? likeCount : ''}
                        </button>
                        <button 
                            onClick={() => handleVote('no')}
                            disabled={isReviewAuthor}
                            className={`flex items-center gap-1 text-xs font-bold transition-colors ${vote === 'no' ? 'text-red-500' : 'text-gray-400 hover:text-red-500'} ${isReviewAuthor ? 'cursor-not-allowed opacity-50' : ''}`}
                             title="No"
                        >
                            <ThumbsDown size={14} className={vote === 'no' ? 'fill-red-500' : ''} />
                        </button>
                    </div>
                    
                    {isOwner && !review.reply && !isReplying && (
                        <button 
                            onClick={() => setIsReplying(true)}
                            className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-red-700 transition-colors bg-primary/5 px-2 py-1 rounded-md"
                        >
                            <MessageCircle size={14} /> Reply
                        </button>
                    )}
                </div>

                {!isReported ? (
                    <button onClick={handleReport} className="text-gray-300 hover:text-red-500 transition-colors" title="Report">
                        <Flag size={14} />
                    </button>
                ) : (
                    <span className="text-xs text-red-500 font-medium">Reported</span>
                )}
            </div>
            
            {/* Vendor Reply Input Area */}
            {isReplying && (
                <div className="mt-4 bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 ml-2 sm:ml-6 border border-gray-200 dark:border-gray-700 animate-fade-in-up shadow-inner relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                    <div className="flex justify-between items-center mb-3">
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reply as Business Owner</label>
                        <button onClick={() => setIsReplying(false)} className="text-gray-400 hover:text-dark dark:hover:text-white transition-colors">
                            <X size={16} />
                        </button>
                    </div>
                    <textarea 
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Thank the customer or address their concerns..."
                        rows={3}
                        className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-600 rounded-xl p-4 text-sm focus:outline-none focus:border-primary mb-4 text-dark dark:text-white placeholder-gray-400 shadow-sm"
                        autoFocus
                    ></textarea>
                    <div className="flex justify-end gap-3">
                        <button 
                            onClick={() => setIsReplying(false)}
                            className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-white dark:hover:bg-gray-700 rounded-xl transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={submitReply}
                            disabled={!replyText.trim()}
                            className="bg-primary text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                           <Send size={14} /> Post Reply
                        </button>
                    </div>
                </div>
            )}

            {/* Vendor Reply Display */}
            {review.reply && (
                <div className="mt-4 bg-primary/5 dark:bg-white/5 rounded-2xl p-5 ml-2 sm:ml-6 border-l-4 border-primary relative">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary rounded-full p-1 text-white">
                                <CornerDownRight size={10} />
                            </div>
                            <span className="text-xs font-bold text-dark dark:text-white uppercase tracking-tight">Response from Owner</span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium">{new Date(review.reply.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">"{review.reply.text}"</p>
                </div>
            )}
        </div>
    );
};
