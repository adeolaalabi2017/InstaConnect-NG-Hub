
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Select, Textarea } from '../../components/admin/AdminComponents';
import { Globe, DollarSign, Clock, ShieldCheck, Search, Code, Mail, Sliders, Save, CheckCircle, AlertTriangle } from 'lucide-react';

const AdminSettings: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'general' | 'preferences' | 'cookies' | 'seo' | 'code' | 'email'>('general');
    
    // --- State Management (Simulated) ---
    const [general, setGeneral] = useState({
        siteName: 'Vendors Hub',
        supportEmail: 'support@vendorshub.ng',
        maintenanceMode: false
    });

    const [preferences, setPreferences] = useState({
        language: 'en',
        currency: 'NGN',
        dateFormat: 'DD/MM/YYYY',
        timezone: 'Africa/Lagos'
    });

    const [cookies, setCookies] = useState({
        enabled: true,
        message: 'We use cookies to ensure you get the best experience on our website.',
        buttonText: 'Accept',
        policyLink: '/privacy',
        position: 'bottom'
    });

    const [seo, setSeo] = useState({
        metaTitleSuffix: '| Vendors Hub',
        metaDescription: 'Discover the best local businesses in Nigeria.',
        keywords: 'business directory, nigeria, lagos, abuja, listings, vendors',
        enableSchema: true,
        generateSitemap: true
    });

    const [customCode, setCustomCode] = useState({
        css: '/* Add your custom CSS here */\nbody {\n  \n}',
        js: '// Add your custom JS here\nconsole.log("Custom script loaded");'
    });

    const [emailConfig, setEmailConfig] = useState({
        provider: 'smtp',
        host: 'smtp.example.com',
        port: 587,
        user: '',
        pass: '',
        encryption: 'ssl'
    });

    const handleSave = (section: string) => {
        // Simulate API Save
        const btn = document.getElementById(`save-btn-${section}`) as HTMLButtonElement;
        if(btn) {
            const originalText = btn.innerText;
            btn.innerText = 'Saving...';
            btn.disabled = true;
            setTimeout(() => {
                btn.innerText = 'Saved!';
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.disabled = false;
                }, 2000);
            }, 800);
        }
        console.log(`Saved ${section} settings`);
    };

    return (
        <div className="animate-fade-in pb-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Website Settings</h1>
                    <p className="text-gray-500 dark:text-gray-400">Configure global preferences, compliance, and technical SEO.</p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-200 dark:border-slate-800 pb-1">
                {[
                    { id: 'general', label: 'General', icon: Sliders },
                    { id: 'preferences', label: 'Preferences', icon: Globe },
                    { id: 'cookies', label: 'Cookie Alert', icon: ShieldCheck },
                    { id: 'seo', label: 'SEO Settings', icon: Search },
                    { id: 'code', label: 'Custom Code', icon: Code },
                    { id: 'email', label: 'Email Config', icon: Mail },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-bold rounded-t-lg transition-colors border-b-2 ${
                            activeTab === tab.id 
                            ? 'text-primary border-primary bg-primary/5' 
                            : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="max-w-4xl">
                
                {/* GENERAL SETTINGS */}
                {activeTab === 'general' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Site Identity</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Site Name</label>
                                    <Input 
                                        value={general.siteName} 
                                        onChange={(e) => setGeneral({...general, siteName: e.target.value})} 
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Support Email</label>
                                    <Input 
                                        type="email" 
                                        value={general.supportEmail} 
                                        onChange={(e) => setGeneral({...general, supportEmail: e.target.value})} 
                                    />
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <AlertTriangle className="text-yellow-600 dark:text-yellow-500" />
                                    <div>
                                        <div className="font-bold text-slate-900 dark:text-white text-sm">Maintenance Mode</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400">Put the site offline for maintenance. Only admins can access.</div>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" checked={general.maintenanceMode} onChange={(e) => setGeneral({...general, maintenanceMode: e.target.checked})} />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                                </label>
                            </div>

                            <div className="flex justify-end">
                                <Button id="save-btn-general" onClick={() => handleSave('general')}>
                                    <Save size={16} className="mr-2" /> Save Changes
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* PREFERENCES */}
                {activeTab === 'preferences' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Localization & Formats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Default Language</label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-2.5 text-slate-400" size={16} />
                                        <Select 
                                            className="pl-10" 
                                            value={preferences.language}
                                            onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                                        >
                                            <option value="en">English (US)</option>
                                            <option value="en-gb">English (UK)</option>
                                            <option value="fr">French</option>
                                            <option value="es">Spanish</option>
                                        </Select>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Currency</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-2.5 text-slate-400" size={16} />
                                        <Select 
                                            className="pl-10"
                                            value={preferences.currency}
                                            onChange={(e) => setPreferences({...preferences, currency: e.target.value})}
                                        >
                                            <option value="NGN">Nigerian Naira (₦)</option>
                                            <option value="USD">US Dollar ($)</option>
                                            <option value="EUR">Euro (€)</option>
                                            <option value="GBP">British Pound (£)</option>
                                        </Select>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Date Format</label>
                                    <Select 
                                        value={preferences.dateFormat}
                                        onChange={(e) => setPreferences({...preferences, dateFormat: e.target.value})}
                                    >
                                        <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2023)</option>
                                        <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2023)</option>
                                        <option value="YYYY-MM-DD">YYYY-MM-DD (2023-12-31)</option>
                                        <option value="D MMM, YYYY">D MMM, YYYY (31 Dec, 2023)</option>
                                    </Select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Timezone</label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-2.5 text-slate-400" size={16} />
                                        <Select 
                                            className="pl-10"
                                            value={preferences.timezone}
                                            onChange={(e) => setPreferences({...preferences, timezone: e.target.value})}
                                        >
                                            <option value="Africa/Lagos">Africa/Lagos (GMT+1)</option>
                                            <option value="Europe/London">Europe/London (GMT+0)</option>
                                            <option value="America/New_York">America/New_York (GMT-5)</option>
                                            <option value="UTC">UTC</option>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button id="save-btn-preferences" onClick={() => handleSave('preferences')}>
                                    <Save size={16} className="mr-2" /> Save Preferences
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* COOKIE CONSENT */}
                {activeTab === 'cookies' && (
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>GDPR Compliance & Cookie Consent</CardTitle>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer" 
                                        checked={cookies.enabled} 
                                        onChange={(e) => setCookies({...cookies, enabled: e.target.checked})} 
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                                </label>
                            </div>
                        </CardHeader>
                        <CardContent className={`space-y-6 ${!cookies.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Consent Message</label>
                                <Textarea 
                                    rows={3} 
                                    value={cookies.message}
                                    onChange={(e) => setCookies({...cookies, message: e.target.value})}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Button Text</label>
                                    <Input 
                                        value={cookies.buttonText}
                                        onChange={(e) => setCookies({...cookies, buttonText: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Policy Link</label>
                                    <Input 
                                        value={cookies.policyLink}
                                        onChange={(e) => setCookies({...cookies, policyLink: e.target.value})}
                                        placeholder="/privacy-policy"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Banner Position</label>
                                    <Select 
                                        value={cookies.position}
                                        onChange={(e) => setCookies({...cookies, position: e.target.value})}
                                    >
                                        <option value="bottom">Bottom (Full Width)</option>
                                        <option value="top">Top (Full Width)</option>
                                        <option value="bottom-right">Bottom Right (Floating)</option>
                                        <option value="bottom-left">Bottom Left (Floating)</option>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button id="save-btn-cookies" onClick={() => handleSave('cookies')}>
                                    <Save size={16} className="mr-2" /> Save Cookie Settings
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* SEO SETTINGS */}
                {activeTab === 'seo' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Search Engine Optimization (SEO)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Global Meta Title Suffix</label>
                                    <Input 
                                        value={seo.metaTitleSuffix} 
                                        onChange={(e) => setSeo({...seo, metaTitleSuffix: e.target.value})}
                                        placeholder="| Site Name"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Appended to page titles (e.g., "Home | Vendors Hub")</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Default Meta Description</label>
                                    <Textarea 
                                        rows={2}
                                        value={seo.metaDescription} 
                                        onChange={(e) => setSeo({...seo, metaDescription: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Global Keywords</label>
                                    <Input 
                                        value={seo.keywords} 
                                        onChange={(e) => setSeo({...seo, keywords: e.target.value})}
                                        placeholder="comma, separated, keywords"
                                    />
                                </div>
                            </div>

                            <div className="border-t border-slate-100 dark:border-slate-800 pt-6 space-y-4">
                                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Technical SEO</h4>
                                
                                {/* Schema Markup Toggle */}
                                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Code className="text-blue-500" size={20} />
                                        <div>
                                            <div className="font-medium text-sm">Schema Markup (JSON-LD)</div>
                                            <div className="text-xs text-gray-500">Automatically generate structured data for businesses and events.</div>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={seo.enableSchema} onChange={(e) => setSeo({...seo, enableSchema: e.target.checked})} />
                                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
                                    </label>
                                </div>

                                {/* Sitemap Generation Toggle */}
                                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Search className="text-green-500" size={20} />
                                        <div>
                                            <div className="font-medium text-sm">XML Sitemap Generation</div>
                                            <div className="text-xs text-gray-500">Auto-update sitemap.xml when listings change.</div>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={seo.generateSitemap} onChange={(e) => setSeo({...seo, generateSitemap: e.target.checked})} />
                                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button id="save-btn-seo" onClick={() => handleSave('seo')}>
                                    <Save size={16} className="mr-2" /> Save SEO Settings
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* CUSTOM CODE */}
                {activeTab === 'code' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Custom CSS & JS</CardTitle>
                            <p className="text-sm text-gray-500">Inject custom styles and scripts. <span className="text-red-500">Advanced users only.</span></p>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-blue-500"></span> Custom CSS
                                </label>
                                <Textarea 
                                    value={customCode.css}
                                    onChange={(e) => setCustomCode({...customCode, css: e.target.value})}
                                    className="font-mono text-xs h-40 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                                    placeholder="/* Add custom CSS here */"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-yellow-500"></span> Custom JS
                                </label>
                                <Textarea 
                                    value={customCode.js}
                                    onChange={(e) => setCustomCode({...customCode, js: e.target.value})}
                                    className="font-mono text-xs h-40 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                                    placeholder="// Add custom JavaScript here"
                                />
                            </div>
                            <div className="flex justify-end">
                                <Button id="save-btn-code" onClick={() => handleSave('code')}>
                                    <Save size={16} className="mr-2" /> Save Code
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* EMAIL CONFIG */}
                {activeTab === 'email' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Email Configuration</CardTitle>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Configure how transactional emails and newsletters are sent.</p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Service Provider</label>
                                <Select value={emailConfig.provider} onChange={(e) => setEmailConfig({...emailConfig, provider: e.target.value})}>
                                    <option value="smtp">SMTP</option>
                                    <option value="mailgun">Mailgun</option>
                                    <option value="sendgrid">SendGrid</option>
                                </Select>
                             </div>
                             
                             {/* SMTP Fields */}
                             {emailConfig.provider === 'smtp' && (
                                 <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800 animate-fade-in">
                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                         <div>
                                             <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">SMTP Host</label>
                                             <Input 
                                                value={emailConfig.host} 
                                                onChange={(e) => setEmailConfig({...emailConfig, host: e.target.value})}
                                                placeholder="smtp.example.com" 
                                             />
                                         </div>
                                         <div>
                                             <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">SMTP Port</label>
                                             <Input 
                                                type="number" 
                                                value={emailConfig.port}
                                                onChange={(e) => setEmailConfig({...emailConfig, port: parseInt(e.target.value)})}
                                                placeholder="587" 
                                             />
                                         </div>
                                     </div>
                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                         <div>
                                             <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">SMTP Username</label>
                                             <Input placeholder="your_username" />
                                         </div>
                                         <div>
                                             <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">SMTP Password</label>
                                             <Input type="password" placeholder="••••••••" />
                                         </div>
                                     </div>
                                     <div>
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Encryption</label>
                                        <Select value={emailConfig.encryption} onChange={(e) => setEmailConfig({...emailConfig, encryption: e.target.value})}>
                                            <option value="ssl">SSL / TLS</option>
                                            <option value="none">None</option>
                                        </Select>
                                     </div>
                                 </div>
                             )}

                             {/* Mailgun Fields */}
                             {emailConfig.provider === 'mailgun' && (
                                 <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800 animate-fade-in">
                                     <div>
                                         <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Mailgun API Key</label>
                                         <Input type="password" placeholder="key-••••••••" />
                                     </div>
                                     <div>
                                         <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Mailgun Domain</label>
                                         <Input placeholder="mg.yourdomain.com" />
                                     </div>
                                 </div>
                             )}

                             {/* SendGrid Fields */}
                             {emailConfig.provider === 'sendgrid' && (
                                 <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800 animate-fade-in">
                                     <div>
                                         <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">SendGrid API Key</label>
                                         <Input type="password" placeholder="SG.••••••••" />
                                     </div>
                                 </div>
                             )}
                             <div className="flex justify-between items-center mt-4">
                                <Button variant="outline" size="sm">Test Email</Button>
                                <Button id="save-btn-email" onClick={() => handleSave('email')}>
                                    <Save size={16} className="mr-2" /> Save Config
                                </Button>
                             </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default AdminSettings;
