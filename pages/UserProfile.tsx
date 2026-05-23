
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MOCK_BADGES } from '../constants';
import { Shield, Share2, Copy, Trophy, Settings as SettingsIcon, Award, LayoutDashboard, LogOut, Zap, ChevronRight } from 'lucide-react';
import * as Icons from 'lucide-react';

const UserProfile: React.FC = () => {
    const { user, isLoading, logout } = useAuth();
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);

    if (isLoading) return <div className="py-20 text-center dark:text-white">Loading Profile...</div>;
    
    if (!user) {
        // Use a useEffect in a real component, but here we can handle it safely
        setTimeout(() => navigate('/login'), 0);
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleSettings = () => {
        navigate('/settings');
    };

    const copyReferral = () => {
        const link = `https://vendorshub.ng/signup?ref=${user.referralCode}`;
        navigator.clipboard.writeText(link).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        });
    };

    // Leveling Logic (500 XP per level)
    const pointsPerLevel = 500;
    const reputation = user.reputationPoints || 0;
    const level = Math.floor(reputation / pointsPerLevel) + 1;
    const pointsInCurrentLevel = reputation % pointsPerLevel;
    const progress = (pointsInCurrentLevel / pointsPerLevel) * 100;
    const pointsToNextLevel = pointsPerLevel - pointsInCurrentLevel;

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
            {/* Header Profile Section */}
            <div className="glass-card p-8 rounded-[2rem] mb-8 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden border-white/50 shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                
                <div className="relative shrink-0">
                    <div className="relative">
                        <img src={user.image} alt={user.name} className="w-36 h-36 rounded-3xl border-4 border-white dark:border-slate-800 shadow-2xl object-cover" />
                        {/* Level Badge Overlay */}
                        <div className="absolute -bottom-3 -right-3 bg-slate-950 dark:bg-white text-white dark:text-slate-950 w-12 h-12 rounded-2xl flex flex-col items-center justify-center border-4 border-white dark:border-slate-800 shadow-xl z-10">
                            <span className="text-[10px] font-black uppercase leading-none opacity-60">Lvl</span>
                            <span className="text-lg font-black leading-none">{level}</span>
                        </div>
                    </div>
                </div>

                <div className="flex-grow text-center md:text-left z-10 w-full">
                    <h1 className="text-4xl font-black text-slate-950 dark:text-white mb-2 tracking-tight">{user.name}</h1>
                    <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
                        <span className="bg-slate-950 text-white dark:bg-white dark:text-slate-950 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{user.role}</span>
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-4 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 uppercase tracking-wider">
                            <Shield size={12} /> Established {new Date(user.createdAt || Date.now()).getFullYear()}
                        </span>
                    </div>

                    {/* Level Progress Bar Card */}
                    <div className="max-w-lg w-full mx-auto md:mx-0 bg-white/40 dark:bg-slate-900/40 p-5 rounded-2xl border border-white/60 dark:border-white/5 backdrop-blur-md shadow-inner">
                        <div className="flex justify-between items-end mb-3">
                            <div>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-0.5">Reputation Progress</span>
                                <div className="text-lg font-black text-slate-950 dark:text-white leading-none">
                                    {pointsInCurrentLevel} <span className="text-slate-400 text-sm">/ {pointsPerLevel} XP</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-black text-primary uppercase tracking-widest block mb-0.5">Next Rank</span>
                                <div className="text-sm font-bold text-slate-900 dark:text-white">Level {level + 1}</div>
                            </div>
                        </div>
                        
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-2 p-1 shadow-inner">
                            <div 
                                style={{ width: `${progress}%` }} 
                                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full shadow-lg transition-all duration-1000 ease-out relative"
                            >
                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight italic">
                                {pointsToNextLevel} XP remaining to Level {level + 1}
                            </span>
                            <div className="flex items-center gap-1 bg-white/80 dark:bg-slate-800 px-2 py-0.5 rounded-lg shadow-sm">
                                <Zap size={10} className="text-primary fill-current" />
                                <span className="text-[10px] font-black text-slate-900 dark:text-white">{reputation} Total XP</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 min-w-[180px] w-full md:w-auto">
                     {user.role === 'admin' && (
                        <button onClick={() => navigate('/admin')} className="bg-primary hover:bg-red-600 text-white px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl shadow-red-500/20 active:scale-95">
                            <Shield size={16} /> Admin Panel
                        </button>
                     )}
                     
                     {user.role === 'vendor' && (
                        <button onClick={() => navigate('/dashboard')} className="bg-slate-950 dark:bg-white dark:text-slate-950 text-white px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl active:scale-95">
                            <LayoutDashboard size={16} /> Dashboard
                        </button>
                     )}

                     <button onClick={handleSettings} className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-950 dark:text-white border border-slate-200 dark:border-slate-700 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95">
                        <SettingsIcon size={16} /> Settings
                     </button>

                     <button onClick={handleLogout} className="bg-slate-100/50 dark:bg-slate-900/50 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-800 active:scale-95">
                        <LogOut size={16} /> Log Out
                     </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Achievements Content */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-card p-8 rounded-[2rem] border-white/50 shadow-2xl">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="font-black text-slate-950 dark:text-white text-2xl tracking-tight flex items-center gap-3">
                                <Award className="text-primary" size={28} /> Achievements & Badges
                            </h3>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{user.badges.length} Unlocked</span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {user.badges.map(bid => {
                                const badge = MOCK_BADGES.find(b => b.id === bid);
                                if (!badge) return null;
                                const BadgeIcon = (Icons as any)[badge.icon] || Icons.Star;
                                return (
                                    <div key={bid} className="p-6 rounded-[1.5rem] bg-white dark:bg-slate-900/80 border border-slate-100 dark:border-slate-800 flex items-center gap-5 shadow-lg hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1">
                                        <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors border border-slate-100 dark:border-slate-700 shadow-inner">
                                            <BadgeIcon size={28} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-black text-slate-950 dark:text-white text-lg leading-tight mb-1">{badge.name}</h4>
                                            <p className="text-xs text-slate-700 dark:text-slate-400 leading-snug font-medium">{badge.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                            
                            {/* Locked Achievements */}
                            <div className="p-6 rounded-[1.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center gap-5 opacity-40 grayscale">
                                <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-300">
                                    <Trophy size={28} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-950 dark:text-white text-base">Elite Contributor</h4>
                                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-wider">Locked: Reach 2000 XP</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Widgets */}
                <div className="space-y-6">
                    <div className="glass-card p-8 rounded-[2rem] bg-slate-950 dark:bg-white text-white dark:text-slate-950 border-none shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                        <h3 className="font-black text-xl mb-4 flex items-center gap-2 relative z-10">
                            <Share2 size={24} className="text-primary" /> Refer & Earn
                        </h3>
                        <p className="text-sm text-slate-400 dark:text-slate-600 mb-8 relative z-10 font-medium leading-relaxed">
                            Expand our community and receive <strong className="text-white dark:text-slate-950 font-black">50 points</strong> for every verified referral.
                        </p>

                        <div className="bg-white/5 dark:bg-slate-100 border border-white/10 dark:border-slate-200 rounded-2xl p-4 flex items-center justify-between mb-6 relative z-10 shadow-inner">
                            <code className="font-black tracking-widest text-lg">{user.referralCode}</code>
                            <button onClick={copyReferral} className="bg-primary p-2 rounded-xl text-white hover:scale-110 transition-transform shadow-lg shadow-red-500/40">
                                <Copy size={16} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest opacity-80">
                            <span>Network Growth</span>
                            <div className="flex items-center gap-1 bg-white/10 dark:bg-slate-200 px-3 py-1 rounded-full">
                                {user.referralCount} Users
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-8 rounded-[2rem] border-white/50 shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                           <h3 className="font-black text-slate-950 dark:text-white uppercase tracking-widest text-xs">Wallet</h3>
                           <Zap size={16} className="text-primary fill-current" />
                        </div>
                        <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-4xl font-black text-slate-950 dark:text-white">{user.credits}</span>
                            <span className="text-sm font-bold text-slate-400 uppercase">Credits</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-8 leading-relaxed font-medium">Redeem your credits for featured listing spots or exclusive platform perks.</p>
                        <button className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white dark:hover:bg-primary text-slate-950 dark:text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 group">
                            Purchase More <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            {copied && (
                <div className="fixed bottom-6 right-6 z-[9999] bg-slate-900/95 dark:bg-slate-950/95 text-white text-xs font-semibold px-4 py-3 rounded-2xl flex items-center gap-2.5 shadow-2xl border border-white/10 animate-fade-in-up backdrop-blur-md">
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white shrink-0">
                        <Copy size={10} />
                    </div>
                    <span>Referral link copied!</span>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
