
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Shield, Bell, ArrowLeft, Save, Mail, Lock, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings: React.FC = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState(user?.name || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        // Simulate save
        setTimeout(() => {
            updateUser({ name });
            setIsSaving(false);
            alert("Settings updated successfully!");
        }, 1000);
    };

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
            <button 
                onClick={() => navigate(-1)} 
                className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors mb-8 font-bold"
            >
                <ArrowLeft size={18} /> Back
            </button>

            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-8">Account Settings</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sidebar Navigation */}
                <div className="space-y-2">
                    <button className="w-full text-left px-4 py-3 rounded-xl bg-primary text-white font-bold flex items-center gap-3">
                        <User size={18} /> Profile Info
                    </button>
                    <button className="w-full text-left px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 font-bold flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800">
                        <Bell size={18} /> Notifications
                    </button>
                    <button className="w-full text-left px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 font-bold flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800">
                        <Shield size={18} /> Security
                    </button>
                </div>

                {/* Main content */}
                <div className="lg:col-span-2 space-y-8">
                    <Card title="Public Profile">
                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="flex items-center gap-6 mb-6">
                                <div className="relative group">
                                    <img src={user.image} alt="" className="w-20 h-20 rounded-2xl object-cover ring-4 ring-slate-50 dark:ring-slate-800" />
                                    <button className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                                        <Camera size={20} />
                                    </button>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white">Profile Photo</h4>
                                    <p className="text-xs text-slate-500">JPG or PNG. Max size 2MB.</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                                    <div className="relative">
                                        <User size={16} className="absolute left-4 top-3.5 text-slate-400" />
                                        <input 
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-primary focus:outline-none dark:text-white"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
                                    <div className="relative opacity-60">
                                        <Mail size={16} className="absolute left-4 top-3.5 text-slate-400" />
                                        <input 
                                            value={user.email}
                                            disabled
                                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-not-allowed dark:text-white"
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-1.5 ml-1">Contact support to change your email.</p>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button 
                                    type="submit" 
                                    disabled={isSaving}
                                    className="bg-primary hover:bg-red-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-red-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isSaving ? 'Saving Changes...' : <><Save size={18} /> Save Settings</>}
                                </button>
                            </div>
                        </form>
                    </Card>

                    <Card title="Change Password">
                        <div className="space-y-4">
                             <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Current Password</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-4 top-3.5 text-slate-400" />
                                    <input type="password" placeholder="••••••••" className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-primary focus:outline-none dark:text-white" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">New Password</label>
                                    <input type="password" placeholder="New" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-primary focus:outline-none dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Confirm New</label>
                                    <input type="password" placeholder="Confirm" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-primary focus:outline-none dark:text-white" />
                                </div>
                            </div>
                            <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all hover:opacity-90">
                                Update Password
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const Card: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="glass-card p-6 rounded-3xl border-white/50 shadow-xl">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">{title}</h3>
        {children}
    </div>
);

export default Settings;
