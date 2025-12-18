
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Badge, Button, Input, Modal, Select, Textarea } from '../../components/admin/AdminComponents';
import { Megaphone, Plus, Percent, Mail, Edit, Trash2, Play, Pause, BarChart, ExternalLink, UploadCloud, Send, CheckCircle } from 'lucide-react';
import { MOCK_CAMPAIGNS, MOCK_ADS, CATEGORIES } from '../../constants';
import { MarketingCampaign, AdPlacement, AdStatus } from '../../types';

// --- Ads Manager Component ---
const AdsManager: React.FC = () => {
    const [ads, setAds] = useState<AdPlacement[]>(MOCK_ADS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAd, setEditingAd] = useState<AdPlacement | null>(null);

    const handleOpenModal = (ad: AdPlacement | null = null) => {
        setEditingAd(ad);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingAd(null);
    };

    const handleSaveAd = (adData: AdPlacement) => {
        if (editingAd) {
            setAds(ads.map(ad => ad.id === adData.id ? adData : ad));
        } else {
            setAds([...ads, { ...adData, id: `ad_${Date.now()}` }]);
        }
        handleCloseModal();
    };
    
    const handleDeleteAd = (adId: string) => {
        if (window.confirm("Are you sure you want to delete this ad?")) {
            setAds(ads.filter(ad => ad.id !== adId));
        }
    };

    const handleToggleStatus = (adId: string) => {
        setAds(ads.map(ad => {
            if (ad.id === adId) {
                return { ...ad, status: ad.status === 'active' ? 'paused' : 'active' };
            }
            return ad;
        }));
    };

    const getStatusBadge = (status: AdStatus) => {
        switch (status) {
            case 'active': return <Badge variant="success">Active</Badge>;
            case 'paused': return <Badge variant="warning">Paused</Badge>;
            case 'expired': return <Badge variant="secondary">Expired</Badge>;
        }
    };
    
    // Calculate KPIs
    const totalImpressions = ads.reduce((sum, ad) => sum + ad.impressions, 0);
    const totalClicks = ads.reduce((sum, ad) => sum + ad.clicks, 0);
    const averageCTR = totalImpressions > 0 ? (totalClicks / totalImpressions * 100).toFixed(2) : '0.00';
    const activeAdsCount = ads.filter(ad => ad.status === 'active').length;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader><CardTitle className="text-sm font-medium">Total Impressions</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold">{totalImpressions.toLocaleString()}</div></CardContent>
                </Card>
                 <Card>
                    <CardHeader><CardTitle className="text-sm font-medium">Total Clicks</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div></CardContent>
                </Card>
                 <Card>
                    <CardHeader><CardTitle className="text-sm font-medium">Average CTR</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold">{averageCTR}%</div></CardContent>
                </Card>
                 <Card>
                    <CardHeader><CardTitle className="text-sm font-medium">Active Ads</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold">{activeAdsCount}</div></CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Ad Placements</CardTitle>
                    <Button size="sm" onClick={() => handleOpenModal()}>
                        <Plus size={16} className="mr-2" /> Create New Ad
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Creative</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Placement</TableHead>
                                <TableHead>Impressions</TableHead>
                                <TableHead>Clicks</TableHead>
                                <TableHead>CTR</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {ads.map(ad => (
                                <TableRow key={ad.id}>
                                    <TableCell className="font-medium flex items-center gap-3">
                                        <img src={ad.imageUrl} alt={ad.name} className="w-20 h-10 object-cover rounded-md bg-slate-100 dark:bg-slate-800" />
                                        {ad.name}
                                    </TableCell>
                                    <TableCell>{getStatusBadge(ad.status)}</TableCell>
                                    <TableCell>{ad.location}</TableCell>
                                    <TableCell>{ad.impressions.toLocaleString()}</TableCell>
                                    <TableCell>{ad.clicks.toLocaleString()}</TableCell>
                                    <TableCell>{(ad.impressions > 0 ? (ad.clicks / ad.impressions * 100) : 0).toFixed(2)}%</TableCell>
                                    <TableCell className="flex gap-1">
                                        <Button variant="ghost" size="icon" onClick={() => handleToggleStatus(ad.id)} title={ad.status === 'active' ? 'Pause' : 'Activate'}>
                                            {ad.status === 'active' ? <Pause size={14} /> : <Play size={14} />}
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleOpenModal(ad)} title="Edit">
                                            <Edit size={14} />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDeleteAd(ad.id)} className="text-red-500" title="Delete">
                                            <Trash2 size={14} />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {isModalOpen && (
                <AdFormModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSaveAd}
                    ad={editingAd}
                />
            )}
        </div>
    );
};

// --- Ad Form Modal ---
const AdFormModal: React.FC<{isOpen: boolean, onClose: () => void, onSave: (ad: AdPlacement) => void, ad: AdPlacement | null}> = ({ isOpen, onClose, onSave, ad }) => {
    const [formData, setFormData] = useState<Omit<AdPlacement, 'id' | 'impressions' | 'clicks'>>(ad || {
        name: '', status: 'active', location: 'Homepage Banner', imageUrl: '', destinationUrl: '',
        startDate: new Date().toISOString().split('T')[0], endDate: '', targeting: {}
    });
    const [imagePreview, setImagePreview] = useState<string | null>(ad?.imageUrl || null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      // Cleanup object URL to prevent memory leaks
      return () => {
        if (imagePreview && imagePreview.startsWith('blob:')) {
          URL.revokeObjectURL(imagePreview);
        }
      };
    }, [imagePreview]);

    const handleFileSelect = (file: File | null) => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
      if (file && file.type.startsWith('image/')) {
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
        setFormData(prev => ({ ...prev, imageUrl: previewUrl }));
      } else {
        setImagePreview(null);
        setFormData(prev => ({ ...prev, imageUrl: '' }));
      }
    };
    
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileSelect(e.dataTransfer.files[0]);
      }
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: ad?.id || '', impressions: ad?.impressions || 0, clicks: ad?.clicks || 0 });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={ad ? "Edit Ad Placement" : "Create Ad Placement"}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-sm font-medium">Ad Name</label>
                    <Input name="name" value={formData.name} onChange={handleChange} required />
                </div>
                
                <div>
                    <label className="text-sm font-medium">Banner Upload</label>
                    {imagePreview ? (
                      <div className="relative group mt-1">
                          <img src={imagePreview} alt="Ad preview" className="w-full h-auto max-h-48 object-contain rounded-lg bg-slate-100 dark:bg-slate-800" />
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button type="button" variant="destructive" size="sm" onClick={() => handleFileSelect(null)}>Remove Image</Button>
                          </div>
                      </div>
                    ) : (
                      <div
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                          className={`mt-1 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                            isDragging ? 'border-primary bg-primary/10' : 'border-slate-300 dark:border-slate-600 hover:border-primary'
                          }`}
                      >
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={(e) => handleFileSelect(e.target.files ? e.target.files[0] : null)}
                            className="hidden"
                            accept="image/png, image/jpeg, image/gif"
                          />
                          <UploadCloud className="mx-auto h-10 w-10 text-slate-400" />
                          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium">Placement</label>
                        <Select name="location" value={formData.location} onChange={handleChange}>
                            <option>Homepage Banner</option>
                            <option>Listing Sidebar</option>
                            <option>Search Results Top</option>
                        </Select>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Status</label>
                        <Select name="status" value={formData.status} onChange={handleChange}>
                            <option value="active">Active</option>
                            <option value="paused">Paused</option>
                        </Select>
                    </div>
                </div>

                <div>
                    <label className="text-sm font-medium">Destination URL</label>
                    <Input name="destinationUrl" value={formData.destinationUrl} onChange={handleChange} placeholder="https://..." required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium">Start Date</label>
                        <Input type="date" name="startDate" value={formData.startDate.split('T')[0]} onChange={handleChange} required />
                    </div>
                    <div>
                        <label className="text-sm font-medium">End Date</label>
                        <Input type="date" name="endDate" value={formData.endDate.split('T')[0]} onChange={handleChange} required />
                    </div>
                </div>
                 <div>
                    <label className="text-sm font-medium">Target Category (Optional)</label>
                    <Select name="targeting.category" value={formData.targeting.category} onChange={handleChange}>
                         <option value="">All Categories</option>
                         {CATEGORIES.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                    </Select>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                    <Button type="submit" disabled={!formData.imageUrl}>Save Ad</Button>
                </div>
            </form>
        </Modal>
    );
};

// --- Email Marketing Component ---
const EmailMarketing: React.FC = () => {
    const [subject, setSubject] = useState('');
    const [audience, setAudience] = useState('all');
    const [content, setContent] = useState('');
    const [sendStatus, setSendStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        setSendStatus('sending');
        // Simulate API call
        setTimeout(() => {
            console.log({ subject, audience, content });
            setSendStatus('sent');
            setSubject('');
            setAudience('all');
            setContent('');
            setTimeout(() => setSendStatus('idle'), 3000); // Reset after 3 seconds
        }, 1500);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Mail size={18} /> Compose Newsletter</CardTitle>
            </CardHeader>
            <CardContent>
                {sendStatus === 'sent' ? (
                    <div className="text-center py-12 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 animate-fade-in">
                        <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-2" />
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">Newsletter Sent!</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Your email has been queued for delivery.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSend} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Subject Line</label>
                                <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Our Weekly Updates" required />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Audience</label>
                                <Select value={audience} onChange={(e) => setAudience(e.target.value)}>
                                    <option value="all">All Subscribers</option>
                                    <option value="vendors">Vendors Only</option>
                                    <option value="consumers">Consumers Only</option>
                                </Select>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Email Content</label>
                            <Textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Write your newsletter here... Supports Markdown."
                                rows={8}
                                required
                            />
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" disabled={sendStatus === 'sending'}>
                                {sendStatus === 'sending' ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send size={16} className="mr-2" />
                                        Send Newsletter
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                )}
            </CardContent>
        </Card>
    );
};


const AdminMarketing: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'campaigns' | 'ads' | 'coupons' | 'email'>('campaigns');

    const getCampaignStatusBadge = (status: MarketingCampaign['status']) => {
        switch (status) {
            case 'active': return <Badge variant="success">Active</Badge>;
            case 'paused': return <Badge variant="warning">Paused</Badge>;
            case 'completed': return <Badge variant="secondary">Completed</Badge>;
            case 'draft': return <Badge variant="outline">Draft</Badge>;
            default: return <Badge>{status}</Badge>;
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Marketing</h1>
                 {activeTab === 'campaigns' && <Button size="sm"><Plus size={16} className="mr-2" /> New Campaign</Button>}
                 {activeTab === 'ads' && <Button size="sm"><Plus size={16} className="mr-2" /> New Ad</Button>}
                 {activeTab === 'coupons' && <Button size="sm"><Plus size={16} className="mr-2" /> New Coupon</Button>}
                 {activeTab === 'email' && <Button size="sm"><Plus size={16} className="mr-2" /> New Email</Button>}
            </div>

            <div className="flex gap-1 sm:gap-2 mb-6 border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
                <button 
                    onClick={() => setActiveTab('campaigns')}
                    className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-t-lg transition-colors whitespace-nowrap ${activeTab === 'campaigns' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                    Campaigns
                </button>
                 <button 
                    onClick={() => setActiveTab('ads')}
                    className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-t-lg transition-colors whitespace-nowrap ${activeTab === 'ads' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                    Ads Manager
                </button>
                 <button 
                    onClick={() => setActiveTab('coupons')}
                    className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-t-lg transition-colors whitespace-nowrap ${activeTab === 'coupons' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                    Coupons & Discounts
                </button>
                 <button 
                    onClick={() => setActiveTab('email')}
                    className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-t-lg transition-colors whitespace-nowrap ${activeTab === 'email' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                    Email Marketing
                </button>
            </div>
            
            {activeTab === 'campaigns' && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Megaphone size={18} /> Active Campaigns</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Campaign</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Channel</TableHead>
                                    <TableHead>Budget</TableHead>
                                    <TableHead>Spent</TableHead>
                                    <TableHead>ROI</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {MOCK_CAMPAIGNS.map(c => (
                                    <TableRow key={c.id}>
                                        <TableCell className="font-medium">{c.name}</TableCell>
                                        <TableCell>{getCampaignStatusBadge(c.status)}</TableCell>
                                        <TableCell>{c.channel}</TableCell>
                                        <TableCell>₦{c.budget.toLocaleString()}</TableCell>
                                        <TableCell>₦{c.spent.toLocaleString()}</TableCell>
                                        <TableCell className={c.roi.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-slate-500'}>{c.roi}</TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="sm">Details</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
            
            {activeTab === 'ads' && <AdsManager />}

            {activeTab === 'coupons' && (
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Percent size={18} /> Create Coupon</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 max-w-md">
                        <div>
                           <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Coupon Code</label>
                           <Input placeholder="e.g. SUMMER20" />
                        </div>
                        <div>
                           <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Discount Percentage</label>
                           <Input type="number" placeholder="20" />
                        </div>
                        <Button>Generate Coupon</Button>
                    </CardContent>
                </Card>
            )}

             {activeTab === 'email' && <EmailMarketing />}
        </div>
    );
};

export default AdminMarketing;
