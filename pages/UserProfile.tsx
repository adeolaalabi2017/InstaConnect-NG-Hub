import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MOCK_BADGES } from '../constants';
import { User as UserIcon, Shield, Share2, Copy, Trophy, Settings, Award, LayoutDashboard } from 'lucide-react';
import * as Icons from 'lucide-react';

const UserProfile: React.FC = () => {
    const { user, isLoading, logout } = useAuth();
    const navigate = useNavigate();

    if (isLoading) return <div className="py-20 text-center">Loading Profile...</div>;
    if (!user) {
        navigate('/login');
        return null;
    }

    const copyReferral = () => {
        navigator.clipboard.writeText(`https://instaconnect.ng/signup?ref=${user.referralCode}`);
        alert("Referral link copied!");
    };

    // Calculate level based on points (simple logic)
    const level = Math.floor(user.reputationPoints / 500) + 1;
    const nextLevelPoints = level * 500;
    const progress = (user.reputationPoints % 500) / 500 * 100;

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header Profile Card */}
            <div className="glass-card p-8 rounded-3xl mb-8 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                
                <div className="relative">
                    <img src={user.image} alt={user.name} className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover" />
                    <div className="absolute bottom-1 right-1 bg-dark text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-white">
                        Lvl {level}
                    </div>
                </div>

                <div className="flex-grow text-center md:text-left z-10">
                    <h1 className="text-3xl font-bold text-dark mb-2">{user.name}</h1>
                    <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{user.role}</span>
                        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            <Shield size={12} /> Member since 2023
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="max-w-md">
                        <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                            <span>Reputation Progress</span>
                            <span>{user.reputationPoints} / {nextLevelPoints} pts</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div style={{ width: `${progress}%` }} className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"></div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 min-w-[140px]">
                     {user.role === 'admin' && (
                        <button 
                            onClick={() => navigate('/admin')} 
                            className="bg-primary hover:bg-red-600 text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                        >
                            <Shield size={16} /> Admin Panel
                        </button>
                     )}
                     
                     {user.role === 'vendor' && (
                        <button 
                            onClick={() => navigate('/dashboard')} 
                            className="bg-primary hover:bg-red-600 text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                        >
                            <LayoutDashboard size={16} /> Dashboard
                        </button>
                     )}

                     <button onClick={logout} className="border border-gray-200 hover:bg-gray-50 text-gray-600 px-4 py-2 rounded-xl font-bold text-sm transition-colors">
                        Log Out
                     </button>
                     <button className="bg-dark hover:bg-gray-800 text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2">
                        <Settings size={16} /> Settings
                     </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Badges Column */}
                <div className="md:col-span-2 space-y-8">
                    <div className="glass-card p-6 rounded-2xl">
                        <h3 className="font-bold text-dark text-xl mb-6 flex items-center gap-2">
                            <Award className="text-primary" /> Achievements & Badges
                        </h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Earned Badges */}
                            {user.badges.map(bid => {
                                const badge = MOCK_BADGES.find(b => b.id === bid);
                                if (!badge) return null;
                                const BadgeIcon = (Icons as any)[badge.icon] || Icons.Star;
                                return (
                                    <div key={bid} className={`p-4 rounded-xl border flex items-center gap-4 ${badge.color.replace('text-', 'bg-').replace('100', '50')} border-transparent`}>
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${badge.color}`}>
                                            <BadgeIcon size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-dark text-sm">{badge.name}</h4>
                                            <p className="text-xs text-gray-500">{badge.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                            
                            {/* Placeholder for unearned */}
                            <div className="p-4 rounded-xl border border-dashed border-gray-200 flex items-center gap-4 opacity-60 grayscale">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-100 text-gray-400">
                                    <Trophy size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-dark text-sm">Super Star</h4>
                                    <p className="text-xs text-gray-500">Locked: Reach 5000 pts</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar - Referral */}
                <div className="space-y-6">
                    <div className="glass-card p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-white border-purple-100">
                        <h3 className="font-bold text-dark text-lg mb-2 flex items-center gap-2">
                            <Share2 size={20} className="text-purple-600" /> Refer & Earn
                        </h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Invite friends to InstaConnect. Earn <strong>50 points</strong> for every friend who joins!
                        </p>

                        <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-center justify-between mb-4">
                            <code className="text-primary font-bold tracking-wide">{user.referralCode}</code>
                            <button onClick={copyReferral} className="text-gray-400 hover:text-dark transition-colors">
                                <Copy size={16} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Total Referrals:</span>
                            <span className="font-bold text-dark bg-purple-100 text-purple-700 px-2 py-0.5 rounded-md">{user.referralCount}</span>
                        </div>
                    </div>

                    <div className="glass-card p-6 rounded-2xl">
                        <div className="flex justify-between items-center mb-4">
                           <h3 className="font-bold text-dark">Credits</h3>
                           <span className="text-2xl font-black text-dark">{user.credits}</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-4">Credits are used for promoting businesses.</p>
                        <button className="w-full bg-gray-50 hover:bg-gray-100 text-dark font-bold py-2 rounded-lg text-sm transition-colors border border-gray-200">
                            Buy More
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;