
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Textarea, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Badge } from '../../components/admin/AdminComponents';
import { contentService } from '../../services/content';
import { SiteConfig, HeaderConfig, HeroConfig, FooterConfig } from '../../types';
import { Save, RefreshCw, Layout, Type, Image as ImageIcon, Link as LinkIcon, ToggleLeft, ToggleRight, X, Plus, File, BookOpen, Mail, HelpCircle, MessageSquareQuote, Edit, Trash2, CheckCircle, Send } from 'lucide-react';

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

    const updateHeader = (key: keyof HeaderConfig, value: any) => {
        setConfig(prev => ({ ...prev, header: { ...prev.header, [key]: value } }));
    };

    const updateNavLink = (key: string, value: string) => {
        setConfig(prev => ({
            ...prev,
            header: { ...prev.header, navLinks: { ...prev.header.navLinks, [key]: value } }
        }));
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
                                <CardTitle className="flex justify-between items-center">
                                    Header Configuration
                                    <button onClick={() => updateHeader('isVisible', !config.header.isVisible)} className={`${config.header.isVisible ? 'text-green-600' : 'text-slate-400'} flex items-center gap-1 text-sm font-medium`}>
                                        {config.header.isVisible ? <ToggleRight size={32} /> : <ToggleLeft size={32} />} {config.header.isVisible ? 'Visible' : 'Hidden'}
                                    </button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className={`space-y-4 ${!config.header.isVisible ? 'opacity-50 pointer-events-none' : ''}`}>
                                    <div>
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Logo Text</label>
                                        <Input value={config.header.logoText} onChange={(e) => updateHeader('logoText', e.target.value)} placeholder="Site Name" />
                                    </div>
                                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                                        <h4 className="font-bold text-sm mb-3 flex items-center gap-2"><LinkIcon size={14}/> Navigation Labels</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {Object.entries(config.header.navLinks).map(([key, val]) => (
                                                <div key={key}>
                                                    <label className="text-xs uppercase font-bold text-slate-400 mb-1 block">{key}</label>
                                                    <Input value={val} onChange={(e) => updateNavLink(key, e.target.value)} />
                                                </div>
                                            ))}
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
                                <CardTitle className="flex justify-between items-center">
                                    Hero Section Configuration
                                    <button onClick={() => updateHero('isVisible', !config.hero.isVisible)} className={`${config.hero.isVisible ? 'text-green-600' : 'text-slate-400'} flex items-center gap-1 text-sm font-medium`}>
                                        {config.hero.isVisible ? <ToggleRight size={32} /> : <ToggleLeft size={32} />} {config.hero.isVisible ? 'Visible' : 'Hidden'}
                                    </button>
                                </CardTitle>
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
                                <CardTitle className="flex justify-between items-center">
                                    Footer Configuration
                                    <button onClick={() => updateFooter('isVisible', !config.footer.isVisible)} className={`${config.footer.isVisible ? 'text-green-600' : 'text-slate-400'} flex items-center gap-1 text-sm font-medium`}>
                                        {config.footer.isVisible ? <ToggleRight size={32} /> : <ToggleLeft size={32} />} {config.footer.isVisible ? 'Visible' : 'Hidden'}
                                    </button>
                                </CardTitle>
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

const PagesSection: React.FC = () => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Static Pages</CardTitle>
            <Button size="sm"><Plus size={16} className="mr-2" /> Add Page</Button>
        </CardHeader>
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
                            <TableCell className="text-gray-500">{page.slug}</TableCell>
                            <TableCell>
                                <Badge variant={page.status === 'published' ? 'success' : 'secondary'}>{page.status}</Badge>
                            </TableCell>
                            <TableCell>{page.lastUpdated}</TableCell>
                            <TableCell className="flex gap-2">
                                <Button variant="ghost" size="icon"><Edit size={14} /></Button>
                                <Button variant="ghost" size="icon" className="text-red-500"><Trash2 size={14} /></Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
);

const BlogSection: React.FC = () => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Blog Posts</CardTitle>
            <Button size="sm"><Plus size={16} className="mr-2" /> New Post</Button>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Date</TableHead>
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
                            <TableCell>{post.date}</TableCell>
                            <TableCell>
                                <Badge variant={post.status === 'published' ? 'success' : 'warning'}>{post.status}</Badge>
                            </TableCell>
                            <TableCell className="flex gap-2">
                                <Button variant="ghost" size="icon"><Edit size={14} /></Button>
                                <Button variant="ghost" size="icon" className="text-red-500"><Trash2 size={14} /></Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
);

const FAQSection: React.FC = () => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Frequently Asked Questions</CardTitle>
            <Button size="sm"><Plus size={16} className="mr-2" /> Add FAQ</Button>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                {MOCK_FAQS.map(faq => (
                    <div key={faq.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                        <div>
                            <p className="font-medium text-slate-900 dark:text-white">{faq.question}</p>
                            <span className="text-xs text-slate-500 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-full mt-1 inline-block">{faq.category}</span>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon"><Edit size={14} /></Button>
                            <Button variant="ghost" size="icon" className="text-red-500"><Trash2 size={14} /></Button>
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
);

const TestimonialsSection: React.FC = () => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Customer Testimonials</CardTitle>
            <Button size="sm"><Plus size={16} className="mr-2" /> Add Manual</Button>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Content</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {MOCK_TESTIMONIALS.map(t => (
                        <TableRow key={t.id}>
                            <TableCell className="font-medium">{t.name}</TableCell>
                            <TableCell>{t.role}</TableCell>
                            <TableCell>{t.rating}/5</TableCell>
                            <TableCell className="max-w-xs truncate">{t.text}</TableCell>
                            <TableCell>
                                <Badge variant={t.status === 'approved' ? 'success' : t.status === 'rejected' ? 'danger' : 'warning'}>{t.status}</Badge>
                            </TableCell>
                            <TableCell className="flex gap-2">
                                <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-700" title="Approve"><CheckCircle size={14} /></Button>
                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" title="Reject"><X size={14} /></Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
);

const NewsletterSection: React.FC = () => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Subscribers List</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Email</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {MOCK_SUBSCRIBERS.map(sub => (
                                <TableRow key={sub.id}>
                                    <TableCell className="font-medium">{sub.email}</TableCell>
                                    <TableCell>{sub.joined}</TableCell>
                                    <TableCell>
                                        <Badge variant={sub.status === 'active' ? 'success' : 'secondary'}>{sub.status}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" className="text-red-500"><Trash2 size={14} /></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Quick Campaign</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="text-sm font-medium mb-1 block">Subject</label>
                        <Input placeholder="Newsletter Subject" />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">Message</label>
                        <Textarea placeholder="Type your message..." rows={5} />
                    </div>
                    <Button className="w-full"><Send size={14} className="mr-2" /> Send to All Active</Button>
                </CardContent>
            </Card>
        </div>
    </div>
);

// --- Main Content Module ---

const AdminCMS: React.FC = () => {
    const { section } = useParams<{ section?: string }>();
    
    // Map URL param to render content
    const renderContent = () => {
        switch(section) {
            case 'pages': return <PagesSection />;
            case 'blog': return <BlogSection />;
            case 'faq': return <FAQSection />;
            case 'testimonials': return <TestimonialsSection />;
            case 'newsletters': return <NewsletterSection />;
            case 'config': 
            default: return <ConfigSection />;
        }
    };

    const getTitle = () => {
        switch(section) {
            case 'pages': return 'CMS Pages Management';
            case 'blog': return 'Blog Management';
            case 'faq': return 'FAQ Management';
            case 'testimonials': return 'Testimonials';
            case 'newsletters': return 'Newsletter Management';
            default: return 'Site Configuration';
        }
    };

    return (
        <div className="animate-fade-in space-y-6 pb-20">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">{getTitle()}</h1>
                <p className="text-gray-500 dark:text-gray-400">Manage your website content and settings.</p>
            </div>
            
            {renderContent()}
        </div>
    );
};

export default AdminCMS;
