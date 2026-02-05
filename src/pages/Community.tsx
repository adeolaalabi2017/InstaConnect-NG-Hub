
import React, { useState, useRef, useMemo } from 'react';
import { MessageSquare, ArrowBigUp, ArrowBigDown, Share2, MoreHorizontal, PenSquare, X, Bold, Italic, Underline, List, Image as ImageIcon, Heading1, Heading2, Quote, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { MOCK_COMMUNITY_THREADS } from '../constants';
import { CommunityThread } from '../types';

// --- Rich Text Editor Components ---

const ToolbarButton = ({ onClick, icon: Icon, title }: { onClick: () => void, icon: React.ElementType, title?: string }) => (
    <button 
        type="button"
        onClick={(e) => { e.preventDefault(); onClick(); }}
        onMouseDown={(e) => e.preventDefault()} // Prevents loss of focus from editor
        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-dark dark:hover:text-white transition-colors"
        title={title}
    >
        <Icon size={18} />
    </button>
);

const CreateThreadModal = ({ onClose, onSubmit }: { onClose: () => void, onSubmit: (data: { title: string, category: string, content: string }) => void }) => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('General');
    const editorRef = useRef<HTMLDivElement>(null);

    const handleFormat = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        if (editorRef.current) editorRef.current.focus();
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            handleFormat('insertImage', url);
        }
    };

    const handleSubmit = () => {
        if (!title.trim()) {
            alert("Please enter a title");
            return;
        }
        const content = editorRef.current?.innerHTML || '';
        if (!content.trim() || content === '<br>') {
            alert("Please enter some content");
            return;
        }
        
        onSubmit({
            title,
            category,
            content
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-in">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
                    <h3 className="font-bold text-lg text-dark dark:text-white">Start a Discussion</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500 dark:text-gray-400">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Title</label>
                        <input 
                            type="text" 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="What's on your mind?" 
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-primary transition-colors text-dark dark:text-white placeholder-gray-400 font-bold"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Category</label>
                        <select 
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-primary transition-colors text-dark dark:text-white cursor-pointer appearance-none"
                        >
                            <option>General</option>
                            <option>Shopping</option>
                            <option>Food & Drink</option>
                            <option>Reviews</option>
                            <option>Events</option>
                            <option>Advice</option>
                            <option>Business</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Content</label>
                        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-slate-950 focus-within:border-primary transition-colors shadow-sm">
                            <div className="flex items-center flex-wrap gap-1 p-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-slate-900">
                                <ToolbarButton onClick={() => handleFormat('formatBlock', 'H3')} icon={Heading1} title="Heading 1" />
                                <ToolbarButton onClick={() => handleFormat('formatBlock', 'H4')} icon={Heading2} title="Heading 2" />
                                <div className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1"></div>
                                <ToolbarButton onClick={() => handleFormat('bold')} icon={Bold} title="Bold" />
                                <ToolbarButton onClick={() => handleFormat('italic')} icon={Italic} title="Italic" />
                                <ToolbarButton onClick={() => handleFormat('underline')} icon={Underline} title="Underline" />
                                <div className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1"></div>
                                <ToolbarButton onClick={() => handleFormat('insertUnorderedList')} icon={List} title="Bullet List" />
                                <ToolbarButton onClick={() => handleFormat('formatBlock', 'BLOCKQUOTE')} icon={Quote} title="Quote" />
                                <div className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1"></div>
                                <label className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-pointer transition-colors flex items-center justify-center" title="Insert Image">
                                    <ImageIcon size={18} />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                </label>
                            </div>
                            
                            <div 
                                ref={editorRef}
                                contentEditable
                                className="min-h-[250px] p-4 focus:outline-none text-dark dark:text-white prose dark:prose-invert max-w-none text-sm [&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-gray-400 [&:empty]:before:pointer-events-none"
                                data-placeholder="Share your thoughts, experiences, or questions here..."
                            />
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 bg-gray-50/50 dark:bg-slate-800/50">
                    <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        Cancel
                    </button>
                    <button 
                        onClick={handleSubmit}
                        className="bg-primary hover:bg-red-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-red-500/30 transition-all transform hover:-translate-y-0.5"
                    >
                        Post Discussion
                    </button>
                </div>
            </div>
        </div>
    );
};

const Community: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [threads, setThreads] = useState<CommunityThread[]>(MOCK_COMMUNITY_THREADS);
    const [sortBy, setSortBy] = useState('All');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Get unique categories from mock data
    const categories = useMemo(() => {
        const cats = new Set(MOCK_COMMUNITY_THREADS.map(t => t.category));
        return ['All', ...Array.from(cats)].sort();
    }, []);

    const handleVote = (id: string, type: 'up' | 'down') => {
        if (!user) {
            navigate('/login');
            return;
        }

        setThreads(threads.map(thread => {
            if (thread.id !== id) return thread;

            if (thread.userVote === type) {
                return {
                    ...thread,
                    userVote: null,
                    upvotes: type === 'up' ? thread.upvotes - 1 : thread.upvotes,
                    downvotes: type === 'down' ? thread.downvotes - 1 : thread.downvotes
                };
            }

            const newThread = { ...thread };
            if (thread.userVote === 'up') newThread.upvotes--;
            if (thread.userVote === 'down') newThread.downvotes--;

            if (type === 'up') newThread.upvotes++;
            if (type === 'down') newThread.downvotes++;
            
            newThread.userVote = type;
            return newThread;
        }));
    };

    const handleCreateThread = (data: { title: string, category: string, content: string }) => {
        if (!user) return;

        const newThread: CommunityThread = {
            id: Date.now().toString(),
            title: data.title,
            content: data.content,
            author: {
                name: user.name,
                image: user.image,
                role: user.role === 'admin' ? 'Admin' : 'Consumer'
            },
            category: data.category,
            upvotes: 0,
            downvotes: 0,
            commentCount: 0,
            timestamp: 'Just now',
            userVote: null,
            comments: []
        };

        setThreads([newThread, ...threads]);
        setIsCreateModalOpen(false);
    };

    const stripHtml = (html: string) => {
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    };

    const filteredAndSortedThreads = useMemo(() => {
        let result = [...threads];
        
        // Category Filter
        if (selectedCategory !== 'All') {
            result = result.filter(t => t.category === selectedCategory);
        }

        // Sorting Filter
        if (sortBy === 'Hot') {
            result = result.sort((a, b) => (b.upvotes + b.commentCount) - (a.upvotes + a.commentCount));
        } else if (sortBy === 'New') {
            // In a real app we'd use actual dates, here we assume current order is mostly New
        } else if (sortBy === 'Top') {
            result = result.sort((a, b) => b.upvotes - a.upvotes);
        }

        return result;
    }, [threads, sortBy, selectedCategory]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-dark dark:text-white mb-2">Community Forum</h1>
                    <p className="text-graytext dark:text-gray-400">Discuss local businesses, ask for recommendations, and connect.</p>
                </div>
                <button 
                    onClick={() => user ? setIsCreateModalOpen(true) : navigate('/login')}
                    className="bg-primary hover:bg-red-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-red-500/30 flex items-center gap-2 transition-all transform hover:-translate-y-1"
                >
                    <PenSquare size={18} /> Start Discussion
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Feed */}
                <div className="lg:col-span-3 space-y-6">
                    
                    {/* Filter Bar */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
                            <div className="flex items-center gap-2 mr-2 shrink-0">
                                <Filter size={16} className="text-gray-400" />
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sort:</span>
                            </div>
                            {['All', 'Hot', 'New', 'Top'].map((f) => (
                                <button 
                                    key={f}
                                    onClick={() => setSortBy(f)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${sortBy === f ? 'bg-dark dark:bg-white text-white dark:text-dark shadow-md' : 'bg-white dark:bg-gray-800 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-700'}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
                            <div className="flex items-center gap-2 mr-2 shrink-0">
                                <ImageIcon size={16} className="text-gray-400" />
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Topics:</span>
                            </div>
                            {categories.map((cat) => (
                                <button 
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-1.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-primary text-white shadow-lg shadow-red-500/20' : 'bg-white dark:bg-gray-800 text-gray-500 hover:text-dark dark:hover:text-white border border-gray-100 dark:border-gray-700'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        {filteredAndSortedThreads.length > 0 ? (
                            filteredAndSortedThreads.map(thread => (
                                <div key={thread.id} className="glass-card rounded-xl overflow-hidden hover:border-primary/30 transition-colors border border-transparent dark:border-gray-800 animate-fade-in-up">
                                    <div className="flex">
                                        <div className="w-12 bg-gray-50/50 dark:bg-gray-800/30 flex flex-col items-center py-4 gap-1 border-r border-gray-100 dark:border-gray-700/50">
                                            <button 
                                                onClick={() => handleVote(thread.id, 'up')}
                                                className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${thread.userVote === 'up' ? 'text-primary' : 'text-gray-400'}`}
                                            >
                                                <ArrowBigUp size={24} className={thread.userVote === 'up' ? 'fill-current' : ''} />
                                            </button>
                                            <span className={`text-sm font-bold ${thread.userVote === 'up' ? 'text-primary' : thread.userVote === 'down' ? 'text-blue-500' : 'text-dark dark:text-white'}`}>
                                                {thread.upvotes - thread.downvotes}
                                            </span>
                                            <button 
                                                onClick={() => handleVote(thread.id, 'down')}
                                                className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${thread.userVote === 'down' ? 'text-blue-500' : 'text-gray-400'}`}
                                            >
                                                <ArrowBigDown size={24} className={thread.userVote === 'down' ? 'fill-current' : ''} />
                                            </button>
                                        </div>

                                        <div className="flex-1 p-4">
                                            <div className="flex items-center gap-2 mb-2 text-xs text-gray-500 dark:text-gray-400">
                                                <img src={thread.author.image} alt={thread.author.name} className="w-5 h-5 rounded-full object-cover" />
                                                <span className="font-bold text-dark dark:text-gray-200 hover:underline cursor-pointer">{thread.author.name}</span>
                                                <span>•</span>
                                                <span>{thread.timestamp}</span>
                                                <span>•</span>
                                                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-wide">{thread.category}</span>
                                            </div>

                                            <Link to={`/community/${thread.id}`} className="block group">
                                                <h3 className="text-lg font-bold text-dark dark:text-white mb-2 leading-tight group-hover:text-primary transition-colors">
                                                    {thread.title}
                                                </h3>
                                                <p className="text-sm text-graytext dark:text-gray-300 line-clamp-2 mb-4">
                                                    {stripHtml(thread.content)}
                                                </p>
                                            </Link>

                                            <div className="flex items-center gap-4">
                                                <Link 
                                                    to={`/community/${thread.id}`}
                                                    className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1.5 rounded-lg transition-colors"
                                                >
                                                    <MessageSquare size={16} /> {thread.commentCount} Comments
                                                </Link>
                                                <button className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1.5 rounded-lg transition-colors">
                                                    <Share2 size={16} /> Share
                                                </button>
                                                <button className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 px-2 py-1.5 rounded-lg transition-colors ml-auto">
                                                    <MoreHorizontal size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 bg-gray-50 dark:bg-slate-800/30 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                                <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
                                <h3 className="text-xl font-bold text-dark dark:text-white mb-2">No threads found</h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">Try selecting a different category or search term.</p>
                                <button 
                                    onClick={() => { setSelectedCategory('All'); setSortBy('All'); }}
                                    className="text-primary font-bold hover:underline"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="hidden lg:block space-y-6">
                    <div className="glass-card p-6 rounded-2xl">
                        <h3 className="font-bold text-dark dark:text-white mb-4">About Community</h3>
                        <p className="text-sm text-graytext dark:text-gray-400 mb-4">
                            Welcome to the Vendors Hub Community! A place to share experiences, ask questions, and discover the best of Nigeria together.
                        </p>
                        <div className="flex gap-4 text-center">
                            <div className="flex-1">
                                <div className="font-bold text-xl text-dark dark:text-white">{threads.length}</div>
                                <div className="text-xs text-gray-500">Posts</div>
                            </div>
                            <div className="flex-1">
                                <div className="font-bold text-xl text-dark dark:text-white">1.2k</div>
                                <div className="text-xs text-gray-500">Members</div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-6 rounded-2xl">
                        <h3 className="font-bold text-dark dark:text-white mb-4 text-sm uppercase tracking-wide">Top Categories</h3>
                        <div className="space-y-3">
                            {categories.filter(c => c !== 'All').slice(0, 5).map(cat => (
                                <button 
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className="flex items-center justify-between w-full text-sm group"
                                >
                                    <span className={`transition-colors font-medium ${selectedCategory === cat ? 'text-primary font-bold' : 'text-gray-500 group-hover:text-dark dark:group-hover:text-white'}`}>
                                        r/{cat}
                                    </span>
                                    <span className="text-[10px] bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-400">
                                        {threads.filter(t => t.category === cat).length}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card p-6 rounded-2xl">
                        <h3 className="font-bold text-dark dark:text-white mb-4 text-sm uppercase tracking-wide">Community Rules</h3>
                        <ol className="space-y-3 text-sm text-graytext dark:text-gray-400 list-decimal list-inside">
                            <li>Be respectful to others.</li>
                            <li>No spam or self-promotion.</li>
                            <li>Keep discussions relevant.</li>
                            <li>Report inappropriate content.</li>
                        </ol>
                    </div>
                </div>
            </div>

            {isCreateModalOpen && (
                <CreateThreadModal onClose={() => setIsCreateModalOpen(false)} onSubmit={handleCreateThread} />
            )}
        </div>
    );
};

export default Community;
