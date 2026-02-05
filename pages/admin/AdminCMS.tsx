
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Textarea, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Badge } from '../../components/admin/AdminComponents';
import { contentService } from '../../services/content';
import { SiteConfig, HeaderConfig, HeroConfig, FooterConfig, NavLink } from '../../types';
import { Save, RefreshCw, Layout, Type, Image as ImageIcon, Link as LinkIcon, ToggleLeft, ToggleRight, X, Plus, File, BookOpen, Mail, HelpCircle, MessageSquareQuote, Edit, Trash2, CheckCircle, Send, Layers, ArrowUp, ArrowDown } from 'lucide-react';

// --- MOCK DATA ---
const MOCK_PAGES = [
    { id: 1, title: 'Home', slug: '/', status: 'published', lastUpdated: '2 days ago' },
    { id: 2, title: 'About Us', slug: '/about', status: 'published', lastUpdated: '1 month ago' },
    { id: 3, title: 'Contact', slug: '/contact', status: 'published', lastUpdated: '1 week ago' },
    { id: 4, title: 'Terms of Service', slug: '/terms', status: 'draft', lastUpdated: 'Just now' },
];

const MOCK_BLOG_POSTS = [
    { id: 1, title: 'Top 10 Restaurants in Lagos', category: 'Food', author: 'Editor', status: 'published', date: '2023-10-24' },
    { id: 2, title: 'How to Grow Your Business', category: 'Business', author: 'Admin', status: 'published', date: '2023-10-15' },
    { id: 3, title: 'Weekend Getaways in Abuja', category: 'Travel', author: 'Editor', status: 'draft', date: '2023-11-01' },
];

const MOCK_FAQS = [
    { id: 1, question: 'How do I list my business?', category: 'General' },
    { id: 2, question: 'What payment methods are accepted?', category: 'Billing' },
    { id: 3, question: 'Can I edit my review?', category: 'Account' },
];

const MOCK_TESTIMONIALS = [
    { id: 1, name: 'Chinedu O.', role: 'Business Owner', text: 'InstaConnect helped me double my customers!', rating: 5, status: 'approved' },
    { id: 2, name: 'Sarah J.', role: 'User', text: 'Best directory for finding local gems.', rating: 5, status: 'pending' },
    { id: 3, name: 'Anonymous', role: 'User', text: 'Okay service but could be faster.', rating: 3, status: 'rejected' },
];

const MOCK_SUBSCRIBERS = [
    { id: 1, email: 'john.doe@example.com', joined: '2023-09-12', status: 'active' },
    { id: 2, email: 'jane.smith@test.com', joined: '2023-10-05', status: 'active' },
    { id: 3, email: 'spam@bot.net', joined: '2023-11-01', status: 'unsubscribed' },
];

// --- PRESETS CONFIGURATION ---
const HEADER_PRESETS = {
    standard: {
        logoText: 'InstaConnect NG',
        showAuthButtons: true,
        navLinks: [
            { id: 'p1', label: 'Home', path: '/' },
            { id: 'p2', label: 'Listings', path: '/listings' },
            { id: 'p3', label: 'Reviews', path: '/top-rated' },
            { id: 'p4', label: 'Events', path: '/events' },
            { id: 'p5', label: 'Community', path: '/community' },
            { id: 'p6', label: 'Contact', path: '/contact' }
        ]
    },
    minimal: {
        logoText: 'ICNG',
        showAuthButtons: false,
        navLinks: [
            { id: 'm1', label: 'Home', path: '/' },
            { id: 'm2', label: 'Search', path: '/listings' },
            { id: 'm3', label: 'Reviews', path: '/top-rated' },
            { id: 'm4', label: 'Help', path: '/contact' }
        ]
    }
};

const HERO_PRESETS = {
    modern: {
        title: 'Explore',
        highlightText: 'Local Favorites',
        subtitle: 'From top-rated restaurants to trusted local services, find everything you need in one modern directory.',
        backgroundImage: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=2000',
        showSearchBar: true,
        tags: ['Hotel', 'Business', 'Wedding', 'Office', 'Healthcare', 'Lifestyle']
    },
    minimal: {
        title: 'Search',
        highlightText: '',
        subtitle: 'Find businesses near you.',
        backgroundImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000',
        showSearchBar: true,
        tags: []
    },
    cityscape: {
        title: 'Lagos',
        highlightText: 'Uncovered',
        subtitle: 'The ultimate guide to the city that never sleeps.',
        backgroundImage: 'https://images.unsplash.com/photo-1555412619-fa928a3f65e3?auto=format&fit=crop&q=80&w=2000',
        showSearchBar: true,
        tags: ['Nightlife', 'Food', 'Culture']
    }
};

const FOOTER_PRESETS = {
    standard: {
        aboutText: 'Discover the best local businesses in your area. Your ultimate guide to dining, shopping, and services.',
        showSocialLinks: true,
        copyrightText: '© 2024 InstaConnect NG. All rights reserved.'
    },
    simple: {
        aboutText: '',
        showSocialLinks: false,
        copyrightText: '© 2024 InstaConnect NG.'
    }
};

// --- Sub-Components ---

const ConfigSection: React.FC = () => {
    const [config, setConfig] = useState<SiteConfig>(contentService.getConfig());
    const [activeTab, setActiveTab] = useState<'header' | 'hero' | 'footer'>('header');
    const [tagInput, setTagInput] = useState('');

    const handleSave = () => {
        contentService.saveConfig(config);
        alert('Site configuration saved! The page will reload to reflect changes.');
        window.location.reload();
    };

    const handleReset = () => {
        if(window.confirm('Are you sure you want to reset all content to defaults? This cannot be undone.')) {
            contentService.resetToDefaults();
            window.location.reload();
        }
    };

    const deleteSection = (section: 'header' | 'hero' | 'footer') => {
        if(window.confirm(`Are you sure you want to delete the ${section} section? It will be hidden from the website.`)) {
            setConfig(prev => ({ ...prev, [section]: { ...prev[section], isVisible: false } }));
        }
    };

    const applyPreset = (section: 'header' | 'hero' | 'footer', presetName: string) => {
        if (section === 'hero') {
            const p = HERO_PRESETS[presetName as keyof typeof HERO_PRESETS];
            setConfig(prev => ({ ...prev, hero: { ...prev.hero, ...p, isVisible: true } }));
        } else if (section === 'header') {
            const p = HEADER_PRESETS[presetName as keyof typeof HEADER_PRESETS];
            setConfig(prev => ({ ...prev, header: { ...prev.header, ...p, isVisible: true } }));
        } else if (section === 'footer') {
            const p = FOOTER_PRESETS[presetName as keyof typeof FOOTER_PRESETS];
            setConfig(prev => ({ ...prev, footer: { ...prev.footer, ...p, isVisible: true } }));
        }
    };

    // Header Functions
    const updateHeader = (key: keyof HeaderConfig, value: any) => {
        setConfig(prev => ({ ...prev, header: { ...prev.header, [key]: value } }));
    };

    const updateNavLink = (id: string, field: 'label' | 'path', value: string) => {
        const newLinks = config.header.navLinks.map(link => 
            link.id === id ? { ...link, [field]: value } : link
        );
        updateHeader('navLinks', newLinks);
    };

    const addNavLink = () => {
        const newLink: NavLink = { id: Date.now().toString(), label: 'New Link', path: '/' };
        updateHeader('navLinks', [...config.header.navLinks, newLink]);
    };

    const deleteNavLink = (id: string) => {
        const newLinks = config.header.navLinks.filter(link => link.id !== id);
        updateHeader('navLinks', newLinks);
    };

    const moveNavLink = (index: number, direction: 'up' | 'down') => {
        const newLinks = [...config.header.navLinks];
        if (direction === 'up' && index > 0) {
            [newLinks[index], newLinks[index - 1]] = [newLinks[index - 1], newLinks[index]];
        } else if (direction === 'down' && index < newLinks.length - 1) {
            [newLinks[index], newLinks[index + 1]] = [newLinks[index + 1], newLinks[index]];
        }
        updateHeader('navLinks', newLinks);
    };

    const updateHero = (key: keyof HeroConfig, value: any) => {
        setConfig(prev => ({ ...prev, hero: { ...prev.hero, [key]: value } }));
    };

    const updateFooter = (key: keyof FooterConfig, value: any) => {
        setConfig(prev => ({ ...prev, footer: { ...prev.footer, [key]: value } }));
    };

    const addTag = () => {
        if (tagInput.trim() && !config.hero.tags.includes(tagInput.trim())) {
            updateHero('tags', [...config.hero.tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        updateHero('tags', config.hero.tags.filter(t => t !== tagToRemove));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end gap-2 mb-4">
                <Button variant="outline" onClick={handleReset} className="text-red-500 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-900/20">
                    <RefreshCw size={16} className="mr-2" /> Reset Defaults
                </Button>
                <Button onClick={handleSave} className="bg-primary hover:bg-red-600 text-white">
                    <Save size={16} className="mr-2" /> Save Changes
                </Button>
            </div>

            <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
                {['header', 'hero', 'footer'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-4 py-3 text-sm font-bold rounded-t-lg transition-colors whitespace-nowrap capitalize flex items-center gap-2 ${activeTab === tab ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                    >
                        <Layout size={16} /> {tab}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
                <div className="lg:col-span-2 space-y-6">
                    {activeTab === 'header' && (
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle>Header Configuration</CardTitle>
                                    <div className="flex gap-2">
                                        <button onClick={() => deleteSection('header')} className="text-red-500 hover:bg-red-50 p-2 rounded-full" title="Delete Section">
                                            <Trash2 size={18} />
                                        </button>
                                        <button onClick={() => updateHeader('isVisible', !config.header.isVisible)} className={`${config.header.isVisible ? 'text-green-600' : 'text-slate-400'} flex items-center gap-1 text-sm font-medium`}>
                                            {config.header.isVisible ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                                        </button>
                                    </div>
                                </div>
                                {/* Preset Controls */}
                                <div className="flex gap-2 mt-2">
                                    <span className="text-xs font-bold text-slate-400 uppercase self-center mr-2">Replace with:</span>
                                    {Object.keys(HEADER_PRESETS).map(preset => (
                                        <Button key={preset} size="sm" variant="outline" onClick={() => applyPreset('header', preset)} className="capitalize text-xs">
                                            {preset}
                                        </Button>
                                    ))}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className={`space-y-4 ${!config.header.isVisible ? 'opacity-50 pointer-events-none' : ''}`}>
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Logo Text</label>
                                        <Input value={config.header.logoText} onChange={(e) => updateHeader('logoText', e.target.value)} placeholder="Site Name" />
                                    </div>
                                    
                                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                                        <div className="flex justify-between items-center mb-3">
                                            <h4 className="font-bold text-sm flex items-center gap-2"><LinkIcon size={14}/> Navigation Links</h4>
                                            <Button size="sm" variant="outline" onClick={addNavLink} className="text-xs h-7">
                                                <Plus size={12} className="mr-1" /> Add Link
                                            </Button>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            {config.header.navLinks.map((link, index) => (
                                                <div key={link.id} className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                                                    <div className="flex flex-col gap-1">
                                                        <button 
                                                            disabled={index === 0}
                                                            onClick={() => moveNavLink(index, 'up')}
                                                            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed"
                                                        >
                                                            <ArrowUp size={12} />
                                                        </button>
                                                        <button 
                                                            disabled={index === config.header.navLinks.length - 1}
                                                            onClick={() => moveNavLink(index, 'down')}
                                                            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed"
                                                        >
                                                            <ArrowDown size={12} />
                                                        </button>
                                                    </div>
                                                    <div className="flex-1 grid grid-cols-2 gap-2">
                                                        <Input 
                                                            value={link.label} 
                                                            onChange={(e) => updateNavLink(link.id, 'label', e.target.value)} 
                                                            placeholder="Label"
                                                            className="h-8 text-xs"
                                                        />
                                                        <Input 
                                                            value={link.path} 
                                                            onChange={(e) => updateNavLink(link.id, 'path', e.target.value)} 
                                                            placeholder="Path"
                                                            className="h-8 text-xs font-mono"
                                                        />
                                                    </div>
                                                    <button 
                                                        onClick={() => deleteNavLink(link.id)}
                                                        className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                            {config.header.navLinks.length === 0 && (
                                                <div className="text-center text-xs text-slate-400 italic py-2">No links added</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                                        <span className="text-sm font-medium">Show Login/Signup Buttons</span>
                                        <button onClick={() => updateHeader('showAuthButtons', !config.header.showAuthButtons)} className={`${config.header.showAuthButtons ? 'text-primary' : 'text-slate-400'} transition-colors`}>
                                            {config.header.showAuthButtons ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                                        </button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === 'hero' && (
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle>Hero Section Configuration</CardTitle>
                                    <div className="flex gap-2">
                                        <button onClick={() => deleteSection('hero')} className="text-red-500 hover:bg-red-50 p-2 rounded-full" title="Delete Section">
                                            <Trash2 size={18} />
                                        </button>
                                        <button onClick={() => updateHero('isVisible', !config.hero.isVisible)} className={`${config.hero.isVisible ? 'text-green-600' : 'text-slate-400'} flex items-center gap-1 text-sm font-medium`}>
                                            {config.hero.isVisible ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                                        </button>
                                    </div>
                                </div>
                                {/* Preset Controls */}
                                <div className="flex gap-2 mt-2">
                                    <span className="text-xs font-bold text-slate-400 uppercase self-center mr-2">Replace with:</span>
                                    {Object.keys(HERO_PRESETS).map(preset => (
                                        <Button key={preset} size="sm" variant="outline" onClick={() => applyPreset('hero', preset)} className="capitalize text-xs">
                                            {preset}
                                        </Button>
                                    ))}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className={`space-y-4 ${!config.hero.isVisible ? 'opacity-50 pointer-events-none' : ''}`}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Main Title</label>
                                            <Input value={config.hero.title} onChange={(e) => updateHero('title', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Highlight Text (Gradient)</label>
                                            <Input value={config.hero.highlightText} onChange={(e) => updateHero('highlightText', e.target.value)} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Subtitle</label>
                                        <Textarea value={config.hero.subtitle} onChange={(e) => updateHero('subtitle', e.target.value)} rows={2} />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block flex items-center gap-2"><ImageIcon size={14}/> Background Image URL</label>
                                        <div className="flex gap-2">
                                            <Input value={config.hero.backgroundImage} onChange={(e) => updateHero('backgroundImage', e.target.value)} placeholder="https://..." />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                                        <span className="text-sm font-medium">Show Search Bar</span>
                                        <button onClick={() => updateHero('showSearchBar', !config.hero.showSearchBar)} className={`${config.hero.showSearchBar ? 'text-primary' : 'text-slate-400'} transition-colors`}>
                                            {config.hero.showSearchBar ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                                        </button>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Popular Tags</label>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {config.hero.tags.map((tag, i) => (
                                                <span key={i} className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                                                    {tag}
                                                    <button onClick={() => removeTag(tag)} className="hover:text-red-500"><X size={12} /></button>
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTag()} placeholder="Add a tag..." className="max-w-xs" />
                                            <Button size="sm" onClick={addTag}><Plus size={16} /></Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === 'footer' && (
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle>Footer Configuration</CardTitle>
                                    <div className="flex gap-2">
                                        <button onClick={() => deleteSection('footer')} className="text-red-500 hover:bg-red-50 p-2 rounded-full" title="Delete Section">
                                            <Trash2 size={18} />
                                        </button>
                                        <button onClick={() => updateFooter('isVisible', !config.footer.isVisible)} className={`${config.footer.isVisible ? 'text-green-600' : 'text-slate-400'} flex items-center gap-1 text-sm font-medium`}>
                                            {config.footer.isVisible ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                                        </button>
                                    </div>
                                </div>
                                {/* Preset Controls */}
                                <div className="flex gap-2 mt-2">
                                    <span className="text-xs font-bold text-slate-400 uppercase self-center mr-2">Replace with:</span>
                                    {Object.keys(FOOTER_PRESETS).map(preset => (
                                        <Button key={preset} size="sm" variant="outline" onClick={() => applyPreset('footer', preset)} className="capitalize text-xs">
                                            {preset}
                                        </Button>
                                    ))}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className={`space-y-4 ${!config.footer.isVisible ? 'opacity-50 pointer-events-none' : ''}`}>
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">About Text</label>
                                        <Textarea value={config.footer.aboutText} onChange={(e) => updateFooter('aboutText', e.target.value)} rows={3} />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Copyright Notice</label>
                                        <Input value={config.footer.copyrightText} onChange={(e) => updateFooter('copyrightText', e.target.value)} />
                                    </div>
                                    <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
                                        <span className="text-sm font-medium">Show Social Links</span>
                                        <button onClick={() => updateFooter('showSocialLinks', !config.footer.showSocialLinks)} className={`${config.footer.showSocialLinks ? 'text-primary' : 'text-slate-400'} transition-colors`}>
                                            {config.footer.showSocialLinks ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                                        </button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="space-y-6">
                    {activeTab === 'hero' && (
                        <Card>
                            <CardHeader><CardTitle className="text-base">Hero Preview</CardTitle></CardHeader>
                            <CardContent>
                                <div className="relative h-40 rounded-xl overflow-hidden text-center flex flex-col items-center justify-center p-4 text-white">
                                    <img src={config.hero.backgroundImage} className="absolute inset-0 w-full h-full object-cover -z-10 brightness-50" alt="" />
                                    <div className="font-bold text-lg">{config.hero.title}</div>
                                    <div className="text-xs opacity-90">{config.hero.subtitle.substring(0, 50)}...</div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

const AdminCMS: React.FC = () => {
    const { section } = useParams<{ section?: string }>();
    const [activeTab, setActiveTab] = useState(section || 'config');

    useEffect(() => {
        setActiveTab(section || 'config');
    }, [section]);

    return (
        <div className="animate-fade-in pb-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Content Management</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage your website content, blog posts, and pages.</p>
                </div>
            </div>

            {activeTab === 'config' && <ConfigSection />}
            
            {activeTab === 'pages' && (
                <Card>
                    <CardHeader><CardTitle>Pages Management</CardTitle></CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Slug</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Last Updated</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {MOCK_PAGES.map(page => (
                                    <TableRow key={page.id}>
                                        <TableCell className="font-medium">{page.title}</TableCell>
                                        <TableCell>{page.slug}</TableCell>
                                        <TableCell><Badge variant={page.status === 'published' ? 'success' : 'warning'}>{page.status}</Badge></TableCell>
                                        <TableCell>{page.lastUpdated}</TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="sm"><Edit size={14}/></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            {activeTab === 'blog' && (
                <Card>
                    <CardHeader className="flex flex-row justify-between items-center">
                        <CardTitle>Blog Posts</CardTitle>
                        <Button size="sm"><Plus size={16} className="mr-2"/> New Post</Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Author</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {MOCK_BLOG_POSTS.map(post => (
                                    <TableRow key={post.id}>
                                        <TableCell className="font-medium">{post.title}</TableCell>
                                        <TableCell>{post.category}</TableCell>
                                        <TableCell>{post.author}</TableCell>
                                        <TableCell><Badge variant={post.status === 'published' ? 'success' : 'outline'}>{post.status}</Badge></TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="sm"><Edit size={14}/></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            {activeTab === 'faq' && (
                 <Card>
                    <CardHeader><CardTitle>FAQs</CardTitle></CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {MOCK_FAQS.map(faq => (
                                <div key={faq.id} className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg flex justify-between items-center">
                                    <div>
                                        <div className="font-bold text-sm mb-1">{faq.question}</div>
                                        <div className="text-xs text-gray-500">{faq.category}</div>
                                    </div>
                                    <Button variant="ghost" size="sm"><Edit size={14}/></Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
            
            {activeTab === 'testimonials' && (
                 <Card>
                    <CardHeader><CardTitle>Testimonials</CardTitle></CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {MOCK_TESTIMONIALS.map(t => (
                                <div key={t.id} className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg flex justify-between items-center">
                                    <div>
                                        <div className="font-bold text-sm">{t.name}</div>
                                        <div className="text-xs text-gray-500 mb-1">{t.role}</div>
                                        <div className="text-sm italic">"{t.text}"</div>
                                    </div>
                                    <Badge variant={t.status === 'approved' ? 'success' : t.status === 'rejected' ? 'danger' : 'warning'}>{t.status}</Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {activeTab === 'newsletters' && (
                 <Card>
                    <CardHeader><CardTitle>Subscribers</CardTitle></CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {MOCK_SUBSCRIBERS.map(s => (
                                    <TableRow key={s.id}>
                                        <TableCell>{s.email}</TableCell>
                                        <TableCell>{s.joined}</TableCell>
                                        <TableCell><Badge variant={s.status === 'active' ? 'success' : 'secondary'}>{s.status}</Badge></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default AdminCMS;
