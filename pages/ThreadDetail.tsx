
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowBigUp, ArrowBigDown, MessageSquare, Share2, MoreHorizontal, Send, CornerDownRight } from 'lucide-react';
import { MOCK_COMMUNITY_THREADS } from '../constants';
import { useAuth } from '../context/AuthContext';
import { CommunityComment } from '../types';

// --- Recursive Comment Component ---
interface CommentNodeProps {
    comment: CommunityComment;
    depth?: number;
    onReply: (parentId: string, text: string) => void;
}

const CommentNode: React.FC<CommentNodeProps> = ({ 
    comment, 
    depth = 0, 
    onReply 
}) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [collapsed, setCollapsed] = useState(false);

    const handleSubmitReply = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            navigate('/login');
            return;
        }
        if (replyText.trim()) {
            onReply(comment.id, replyText);
            setReplyText('');
            setIsReplying(false);
        }
    };

    if (collapsed) {
        return (
            <div className={`mt-4 ${depth > 0 ? 'ml-2 pl-4 border-l-2 border-gray-200 dark:border-gray-700' : ''}`}>
                <div className="flex items-center gap-2">
                    <button onClick={() => setCollapsed(false)} className="text-gray-400 hover:text-primary">
                        <MoreHorizontal size={14} />
                    </button>
                    <span className="text-xs text-gray-500 italic">Comment hidden ({comment.author.name})</span>
                </div>
            </div>
        );
    }

    return (
        <div className={`mt-4 ${depth > 0 ? 'ml-2 sm:ml-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700' : ''}`}>
            <div className="flex gap-3">
                <img 
                    src={comment.author.image} 
                    alt={comment.author.name} 
                    className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700 flex-shrink-0" 
                />
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-dark dark:text-white text-xs">{comment.author.name}</span>
                        <span className="text-[10px] text-gray-400">• {comment.timestamp}</span>
                    </div>
                    
                    <div className="text-sm text-graytext dark:text-gray-300 leading-relaxed mb-2">
                        {comment.content}
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <button className="text-gray-400 hover:text-primary transition-colors p-1"><ArrowBigUp size={16} /></button>
                            <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{comment.upvotes}</span>
                            <button className="text-gray-400 hover:text-blue-500 transition-colors p-1"><ArrowBigDown size={16} /></button>
                        </div>
                        
                        <button 
                            onClick={() => setIsReplying(!isReplying)}
                            className="text-xs font-bold text-gray-500 hover:text-dark dark:hover:text-white transition-colors flex items-center gap-1"
                        >
                            <MessageSquare size={12} /> Reply
                        </button>

                        <button 
                            onClick={() => setCollapsed(true)}
                            className="text-xs text-gray-400 hover:text-dark dark:hover:text-white ml-auto"
                        >
                            Collapse
                        </button>
                    </div>

                    {isReplying && (
                        <div className="mt-3 animate-fade-in">
                            <form onSubmit={handleSubmitReply} className="flex gap-2 items-start">
                                <div className="h-6 w-6 border-l-2 border-b-2 border-gray-300 dark:border-gray-600 rounded-bl-lg"></div>
                                <div className="flex-1">
                                    <textarea 
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder={`Replying to ${comment.author.name}...`}
                                        className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm focus:outline-none focus:border-primary text-dark dark:text-white"
                                        rows={2}
                                        autoFocus
                                    />
                                    <div className="flex justify-end gap-2 mt-2">
                                        <button 
                                            type="button" 
                                            onClick={() => setIsReplying(false)}
                                            className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit"
                                            disabled={!replyText.trim()}
                                            className="bg-primary text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:bg-red-600 transition-colors disabled:opacity-50"
                                        >
                                            Reply
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Recursion for Nested Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-2">
                            {comment.replies.map(reply => (
                                <CommentNode key={reply.id} comment={reply} depth={depth + 1} onReply={onReply} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ThreadDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();
    
    // Find thread from shared constants
    const initialThread = MOCK_COMMUNITY_THREADS.find(t => t.id === id);
    const [thread, setThread] = useState(initialThread);
    const [mainComment, setMainComment] = useState('');

    if (!thread) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold text-dark dark:text-white mb-4">Thread Not Found</h2>
                <Link to="/community" className="text-primary hover:underline">Back to Community</Link>
            </div>
        );
    }

    // Helper to find and update a comment in the tree
    const addReplyToTree = (comments: CommunityComment[], parentId: string, newReply: CommunityComment): CommunityComment[] => {
        return comments.map(c => {
            if (c.id === parentId) {
                return { ...c, replies: [...(c.replies || []), newReply] };
            } else if (c.replies && c.replies.length > 0) {
                return { ...c, replies: addReplyToTree(c.replies, parentId, newReply) };
            }
            return c;
        });
    };

    const handleReply = (parentId: string | null, text: string) => {
        if (!user) {
            navigate('/login');
            return;
        }

        const newComment: CommunityComment = {
            id: Date.now().toString(),
            author: {
                name: user.name,
                image: user.image
            },
            content: text,
            timestamp: 'Just now',
            upvotes: 0,
            replies: []
        };

        if (parentId === null) {
            // Root level comment
            setThread(prev => prev ? ({
                ...prev,
                comments: [...prev.comments, newComment],
                commentCount: prev.commentCount + 1
            }) : null);
            setMainComment('');
        } else {
            // Nested reply
            setThread(prev => prev ? ({
                ...prev,
                comments: addReplyToTree(prev.comments, parentId, newComment),
                commentCount: prev.commentCount + 1
            }) : null);
        }
    };

    const handleVote = (type: 'up' | 'down') => {
        if (!user) return navigate('/login');
        // Simple visual update for demo
        setThread(prev => {
            if (!prev) return null;
            let newUp = prev.upvotes;
            let newDown = prev.downvotes;
            let newVote = type;

            if (prev.userVote === type) {
                // Toggle off
                if (type === 'up') newUp--; else newDown--;
                newVote = null as any;
            } else {
                // Switch
                if (prev.userVote === 'up') newUp--;
                if (prev.userVote === 'down') newDown--;
                if (type === 'up') newUp++; else newDown++;
            }

            return { ...prev, upvotes: newUp, downvotes: newDown, userVote: newVote };
        });
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <Link to="/community" className="inline-flex items-center gap-2 text-gray-500 hover:text-dark dark:hover:text-white mb-6 transition-colors font-medium">
                <ArrowLeft size={18} /> Back to Community
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-3">
                    
                    {/* Original Post */}
                    <div className="glass-card rounded-2xl overflow-hidden mb-8 border border-transparent dark:border-gray-800">
                        <div className="flex">
                            {/* Vote Column */}
                            <div className="w-12 bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center py-4 gap-1 border-r border-gray-100 dark:border-gray-700/50">
                                <button onClick={() => handleVote('up')} className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${thread.userVote === 'up' ? 'text-primary' : 'text-gray-400'}`}>
                                    <ArrowBigUp size={28} className={thread.userVote === 'up' ? 'fill-current' : ''} />
                                </button>
                                <span className={`text-lg font-bold ${thread.userVote === 'up' ? 'text-primary' : thread.userVote === 'down' ? 'text-blue-500' : 'text-dark dark:text-white'}`}>
                                    {thread.upvotes - thread.downvotes}
                                </span>
                                <button onClick={() => handleVote('down')} className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${thread.userVote === 'down' ? 'text-blue-500' : 'text-gray-400'}`}>
                                    <ArrowBigDown size={28} className={thread.userVote === 'down' ? 'fill-current' : ''} />
                                </button>
                            </div>

                            {/* Thread Content */}
                            <div className="flex-1 p-6">
                                <div className="flex items-center gap-2 mb-4 text-xs text-gray-500 dark:text-gray-400">
                                    <img src={thread.author.image} alt={thread.author.name} className="w-6 h-6 rounded-full object-cover" />
                                    <span className="font-bold text-dark dark:text-gray-200">{thread.author.name}</span>
                                    <span>•</span>
                                    <span>{thread.timestamp}</span>
                                    <span>•</span>
                                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-md font-medium uppercase tracking-wide">{thread.category}</span>
                                </div>

                                <h1 className="text-2xl font-bold text-dark dark:text-white mb-4 leading-tight">
                                    {thread.title}
                                </h1>
                                
                                <div 
                                    className="prose dark:prose-invert max-w-none text-graytext dark:text-gray-300 mb-6"
                                    dangerouslySetInnerHTML={{ __html: thread.content }}
                                />

                                <div className="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <div className="flex items-center gap-1.5 text-sm font-bold text-gray-500">
                                        <MessageSquare size={18} /> {thread.commentCount} Comments
                                    </div>
                                    <button className="flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-dark dark:hover:text-white transition-colors">
                                        <Share2 size={18} /> Share
                                    </button>
                                    <button className="flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-dark dark:hover:text-white transition-colors ml-auto">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Comment Input */}
                    {user ? (
                        <div className="glass-card p-4 rounded-2xl mb-8 flex gap-3 items-start">
                            <img src={user.image} alt="You" className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700" />
                            <div className="flex-1 relative">
                                <textarea 
                                    value={mainComment}
                                    onChange={(e) => setMainComment(e.target.value)}
                                    placeholder="What are your thoughts?"
                                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 min-h-[100px] text-sm focus:outline-none focus:border-primary text-dark dark:text-white transition-colors"
                                />
                                <div className="flex justify-end mt-2">
                                    <button 
                                        onClick={() => handleReply(null, mainComment)}
                                        disabled={!mainComment.trim()}
                                        className="bg-primary hover:bg-red-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Comment
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-100 dark:bg-slate-800 p-6 rounded-2xl text-center mb-8">
                            <p className="text-gray-500 dark:text-gray-400 mb-4">Log in or sign up to leave a comment</p>
                            <div className="flex justify-center gap-4">
                                <Link to="/login" className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-full font-bold text-dark dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Log In</Link>
                                <Link to="/signup" className="px-6 py-2 bg-primary text-white rounded-full font-bold hover:bg-red-600 transition-colors">Sign Up</Link>
                            </div>
                        </div>
                    )}

                    {/* Comments Tree */}
                    <div className="space-y-6">
                        {thread.comments.length > 0 ? (
                            thread.comments.map(comment => (
                                <CommentNode key={comment.id} comment={comment} onReply={handleReply} />
                            ))
                        ) : (
                            <div className="text-center py-12 opacity-50">
                                <MessageSquare size={48} className="mx-auto mb-2 text-gray-300" />
                                <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="hidden lg:block space-y-6">
                    <div className="glass-card p-6 rounded-2xl">
                        <h3 className="font-bold text-dark dark:text-white mb-2">About r/{thread.category}</h3>
                        <p className="text-sm text-graytext dark:text-gray-400 mb-4">
                            Discussions related to {thread.category.toLowerCase()} in Nigeria.
                        </p>
                        <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div> 120 Online
                            </div>
                            <button className="w-full py-2 rounded-full border border-dark dark:border-gray-500 font-bold text-sm hover:bg-dark hover:text-white dark:text-white dark:hover:bg-gray-700 transition-colors">
                                Join Community
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThreadDetail;
