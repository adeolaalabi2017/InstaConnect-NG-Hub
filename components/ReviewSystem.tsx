import React, { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, Camera, MessageCircle, CornerDownRight, Flag, Award, Send } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Review, User } from '../types';
import { MOCK_BADGES, MOCK_USERS_LIST } from '../constants';
import { useNavigate } from 'react-router-dom';

// --- Rating Breakdown Component (Phase 2 Feature 5) ---
export const RatingBreakdown: React.FC<{ reviews: Review[] }> = ({ reviews }) => {
    const total = reviews.length;
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    
    reviews.forEach(r => {
        const rating = Math.round(r.rating) as 1|2|3|4|5;
        if (counts[rating] !== undefined) counts[rating]++;
    });

    return (
        <div className="glass-card p-6 rounded-2xl mb-8">
            <h4 className="font-bold text-dark mb-4 text-lg">Rating Breakdown</h4>
            <div className="space-y-3">
                {[5, 4, 3, 2, 1].map(star => {
                    const count = counts[star as keyof typeof counts];
                    const percentage = total > 0 ? (count / total) * 100 : 0;
                    return (
                        <div key={star} className="flex items-center gap-3">
                            <div className="flex items-center w-12 gap-1 text-sm font-medium text-gray-600">
                                {star} <Star size={12} className="fill-gray-400 text-gray-400" />
                            </div>
                            <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
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

// --- Review Form Component (Phase 1 Feature 2) ---
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
        onSubmit(rating, text, []); // Mocking photo upload as empty array for now
        setRating(0);
        setText('');
    };

    return (
        <div className="glass-card p-6 rounded-2xl mb-8 border border-primary/10 bg-primary/5">
            <h4 className="font-bold text-dark mb-4">Write a Review</h4>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Rating</label>
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
                                    className={`${star <= (hoveredRating || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Review</label>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={4}
                        placeholder="Share your experience with others..."
                        className="w-full bg-white rounded-xl p-4 text-sm border border-gray-200 focus:outline-none focus:border-primary transition-colors text-dark"
                        required
                    />
                </div>

                <div className="flex justify-between items-center">
                     {/* Photo Upload Trigger (Phase 2 Feature 6) */}
                    <button type="button" className="flex items-center gap-2 text-gray-500 hover:text-dark text-sm font-medium px-3 py-2 rounded-lg hover:bg-white transition-colors">
                        <Camera size={18} /> Add Photos
                    </button>

                    <button 
                        type="submit" 
                        disabled={!text || rating === 0}
                        className="bg-primary text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-red-500/20 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        Post Review
                    </button>
                </div>
            </form>
        </div>
    );
};

// --- Review Card Component (Phase 1, 3, 4) ---
interface ReviewCardProps {
    review: Review;
    currentUser: User | null;
    isOwner: boolean;
    onReply?: (reviewId: string, text: string) => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, currentUser, isOwner, onReply }) => {
    const navigate = useNavigate();
    const [vote, setVote] = useState<'yes' | 'no' | null>(null);
    const [likeCount, setLikeCount] = useState(review.helpfulCount);
    const [isReported, setIsReported] = useState(false);
    
    // Reply State
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState('');

    // Mock finding user to get badges
    const reviewUser = MOCK_USERS_LIST.find(u => u.id === review.userId) || { badges: [], reputationPoints: 0 };
    const isReviewAuthor = currentUser?.id === review.userId;

    const handleVote = (type: 'yes' | 'no') => {
        if (!currentUser) {
            if (window.confirm("Please log in to vote on reviews. Go to login?")) {
                navigate('/login');
            }
            return;
        }

        if (isReviewAuthor) {
             return;
        }

        if (vote === type) {
            // Toggle off
            setVote(null);
            if (type === 'yes') setLikeCount(prev => prev - 1);
        } else {
            // Switch vote or new vote
            if (vote === 'yes') setLikeCount(prev => prev - 1); // remove previous yes
            setVote(type);
            if (type === 'yes') setLikeCount(prev => prev + 1); // add new yes
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
            // Fallback for demo if no callback provided
            alert("Reply submitted! (Demo)");
            setIsReplying(false);
        }
    }

    if (review.status === 'hidden' && currentUser?.role !== 'admin') return null;

    return (
        <div className={`glass-card p-6 rounded-2xl mb-6 relative ${review.status === 'flagged' && currentUser?.role === 'admin' ? 'border-2 border-red-200 bg-red-50' : ''}`}>
            {/* Admin Status Indicator */}
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
                      className="w-10 h-10 rounded-full object-cover border border-gray-100" 
                    />
                    <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <h5 className="font-bold text-dark text-sm">{review.userName}</h5>
                            
                            {/* Reviewer Badges */}
                            <div className="flex items-center gap-1">
                                {reviewUser.reputationPoints > 1500 && (
                                    <div className="flex items-center gap-0.5 bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded text-[10px] font-bold border border-purple-100" title="Top Contributor">
                                        <Award size={10} /> Top Contributor
                                    </div>
                                )}
                                {reviewUser.badges && reviewUser.badges.length > 0 && (
                                    reviewUser.badges.map(bid => {
                                        const badge = MOCK_BADGES.find(b => b.id === bid);
                                        if (!badge) return null;
                                        // Dynamic Icon Rendering
                                        const BadgeIcon = (Icons as any)[badge.icon] || Icons.Shield;
                                        
                                        return (
                                            <div key={bid} title={badge.name} className={`w-4 h-4 rounded-full flex items-center justify-center ${badge.color.replace('text-', 'bg-').replace('100', '200')} text-white`}>
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
                <div className="flex bg-yellow-50 px-2 py-1 rounded text-yellow-600 font-bold text-xs">
                    <Star size={12} className="fill-yellow-600 mr-1" /> {review.rating}.0
                </div>
            </div>

            <p className="text-graytext text-sm mb-4 leading-relaxed">{review.text}</p>
            
            {/* Review Photos (Phase 2) */}
            {review.photos && review.photos.length > 0 && (
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                    {review.photos.map((photo, i) => (
                        <img key={i} src={photo} alt="Review attachment" className="h-20 w-20 object-cover rounded-lg border border-gray-100" />
                    ))}
                </div>
            )}

            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <div className="flex items-center gap-4">
                    {/* Yes/No Voting */}
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400 font-medium">Was this review helpful?</span>
                        
                        <button 
                            onClick={() => handleVote('yes')}
                            disabled={isReviewAuthor}
                            className={`flex items-center gap-1 text-xs font-bold transition-colors ${
                                vote === 'yes' ? 'text-green-600' : 'text-gray-400 hover:text-green-600'
                            } ${isReviewAuthor ? 'cursor-not-allowed opacity-50' : ''}`}
                            title="Yes, it was helpful"
                        >
                            <ThumbsUp size={14} className={vote === 'yes' ? 'fill-green-600' : ''} /> {likeCount > 0 ? likeCount : ''}
                        </button>

                        <button 
                            onClick={() => handleVote('no')}
                            disabled={isReviewAuthor}
                            className={`flex items-center gap-1 text-xs font-bold transition-colors ${
                                vote === 'no' ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                            } ${isReviewAuthor ? 'cursor-not-allowed opacity-50' : ''}`}
                             title="No, it wasn't helpful"
                        >
                            <ThumbsDown size={14} className={vote === 'no' ? 'fill-red-500' : ''} />
                        </button>
                    </div>
                    
                    {/* Vendor Reply Trigger */}
                    {isOwner && !review.reply && !isReplying && (
                        <button 
                            onClick={() => setIsReplying(true)}
                            className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-primary transition-colors ml-2"
                        >
                            <MessageCircle size={14} /> Reply
                        </button>
                    )}
                </div>

                {/* Report Button */}
                {!isReported ? (
                    <button 
                        onClick={handleReport} 
                        className="text-gray-300 hover:text-red-500 transition-colors"
                        title="Report abuse"
                    >
                        <Flag size={14} />
                    </button>
                ) : (
                    <span className="text-xs text-red-500 font-medium">Reported</span>
                )}
            </div>
            
            {/* Vendor Reply Input Area */}
            {isReplying && (
                <div className="mt-4 bg-gray-50 rounded-xl p-4 ml-4 border border-gray-200 animate-fade-in-up">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Reply as Business Owner</label>
                    <textarea 
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your response here..."
                        rows={3}
                        className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-primary mb-3"
                    ></textarea>
                    <div className="flex justify-end gap-2">
                        <button 
                            onClick={() => setIsReplying(false)}
                            className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-dark transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={submitReply}
                            className="bg-primary text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:bg-red-600 transition-colors flex items-center gap-1"
                        >
                           <Send size={12} /> Post Reply
                        </button>
                    </div>
                </div>
            )}

            {/* Vendor Reply Display (Phase 3) */}
            {review.reply && (
                <div className="mt-4 bg-gray-50 rounded-xl p-4 ml-4 border-l-2 border-primary">
                    <div className="flex items-center gap-2 mb-1">
                        <CornerDownRight size={14} className="text-gray-400" />
                        <span className="text-xs font-bold text-dark">Response from Owner</span>
                        <span className="text-[10px] text-gray-400">• {new Date(review.reply.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-gray-600">{review.reply.text}</p>
                </div>
            )}
        </div>
    );
};