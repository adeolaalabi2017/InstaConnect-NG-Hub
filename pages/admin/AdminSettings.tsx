
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Select } from '../../components/admin/AdminComponents';

const AdminSettings: React.FC = () => {
    const [provider, setProvider] = useState('smtp');

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Settings saved successfully! (Simulated)');
    };

    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-6">General Settings</h1>
            <div className="grid gap-8 max-w-3xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Site Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div>
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Site Name</label>
                            <Input defaultValue="InstaConnect NG" />
                         </div>
                         <div>
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Support Email</label>
                            <Input type="email" defaultValue="support@instaconnect.ng" />
                         </div>
                         <Button onClick={handleSave}>Save Changes</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Email Configuration</CardTitle>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Configure how transactional emails and newsletters are sent.</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div>
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">Service Provider</label>
                            <Select value={provider} onChange={(e) => setProvider(e.target.value)}>
                                <option value="smtp">SMTP</option>
                                <option value="mailgun">Mailgun</option>
                                <option value="sendgrid">SendGrid</option>
                            </Select>
                         </div>
                         
                         {/* SMTP Fields */}
                         {provider === 'smtp' && (
                             <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800 animate-fade-in">
                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                     <div>
                                         <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">SMTP Host</label>
                                         <Input placeholder="smtp.example.com" />
                                     </div>
                                     <div>
                                         <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">SMTP Port</label>
                                         <Input type="number" placeholder="587" />
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
                                    <Select>
                                        <option value="ssl">SSL / TLS</option>
                                        <option value="none">None</option>
                                    </Select>
                                 </div>
                             </div>
                         )}

                         {/* Mailgun Fields */}
                         {provider === 'mailgun' && (
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
                         {provider === 'sendgrid' && (
                             <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800 animate-fade-in">
                                 <div>
                                     <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 block">SendGrid API Key</label>
                                     <Input type="password" placeholder="SG.••••••••" />
                                 </div>
                             </div>
                         )}
                         <Button onClick={handleSave}>Save Email Settings</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminSettings;
