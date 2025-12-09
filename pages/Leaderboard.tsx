import React from 'react';
import { MOCK_USERS_LIST, MOCK_BADGES } from '../constants';
import { Trophy, Medal, Star, ShieldCheck } from 'lucide-react';

const Leaderboard: React.FC = () => {
    // 1. Sort users by reputation points desc
    // 2. Take only Top 10
    const topUsers = [...MOCK_USERS_LIST]
        .sort((a, b) => b.reputationPoints - a.reputationPoints)
        .slice(0, 10);

    const podiumUsers = topUsers.slice(0, 3);
    const listUsers = topUsers.slice(3);

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            
            {/* Inject Animation Styles */}
            <style>
                {`
                    @keyframes vertical-scroll {
                        0% { transform: translateY(0); }
                        100% { transform: translateY(-50%); }
                    }
                    .animate-vertical-scroll {
                        animation: vertical-scroll 15s linear infinite;
                    }
                    .animate-vertical-scroll:hover {
                        animation-play-state: paused;
                    }
                `}
            </style>

            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-600 px-4 py-1.5 rounded-full font-bold text-sm mb-4">
                    <Trophy size={16} className="fill-current" /> Community Champions
                </div>
                <h1 className="text-4xl font-extrabold text-dark mb-4">Top 10 Leaderboard</h1>
                <p className="text-graytext text-lg max-w-2xl mx-auto">
                    Recognizing the most helpful and active members of our community.
                </p>
            </div>

            <div className="glass-card rounded-3xl overflow-hidden shadow-xl">
                {/* Top 3 Podium (Visual) */}
                <div className="bg-gradient-to-b from-primary/5 to-transparent p-8 pb-12 relative">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                    <div className="flex justify-center items-end gap-4 sm:gap-8 relative z-10">
                        {/* 2nd Place */}
                        {podiumUsers[1] && (
                            <div className="flex flex-col items-center transform translate-y-4">
                                <div className="w-20 h-20 rounded-full border-4 border-gray-300 p-1 mb-3 relative shadow-lg">
                                    <img src={podiumUsers[1].image} alt="" className="w-full h-full rounded-full object-cover" />
                                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gray-300 text-white font-black text-xs w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">2</div>
                                </div>
                                <div className="font-bold text-dark text-sm mb-1">{podiumUsers[1].name}</div>
                                <div className="text-primary font-black text-sm">{podiumUsers[1].reputationPoints}</div>
                            </div>
                        )}

                        {/* 1st Place */}
                        {podiumUsers[0] && (
                            <div className="flex flex-col items-center mb-6">
                                <div className="relative">
                                    <Trophy size={32} className="text-yellow-400 absolute -top-10 left-1/2 -translate-x-1/2 drop-shadow-md animate-bounce" fill="currentColor" />
                                    <div className="w-28 h-28 rounded-full border-4 border-yellow-400 p-1 mb-3 relative bg-white shadow-xl">
                                        <img src={podiumUsers[0].image} alt="" className="w-full h-full rounded-full object-cover" />
                                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-white font-black text-sm w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-md">1</div>
                                    </div>
                                </div>
                                <div className="font-bold text-dark text-lg mb-1">{podiumUsers[0].name}</div>
                                <div className="text-primary font-black text-xl">{podiumUsers[0].reputationPoints} pts</div>
                            </div>
                        )}

                        {/* 3rd Place */}
                        {podiumUsers[2] && (
                            <div className="flex flex-col items-center transform translate-y-8">
                                <div className="w-20 h-20 rounded-full border-4 border-orange-300 p-1 mb-3 relative shadow-lg">
                                    <img src={podiumUsers[2].image} alt="" className="w-full h-full rounded-full object-cover" />
                                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-orange-300 text-white font-black text-xs w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">3</div>
                                </div>
                                <div className="font-bold text-dark text-sm mb-1">{podiumUsers[2].name}</div>
                                <div className="text-primary font-black text-sm">{podiumUsers[2].reputationPoints}</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Scrolling List for Ranks 4-10 */}
                {listUsers.length > 0 && (
                    <div className="relative h-[320px] overflow-hidden bg-white border-t border-gray-100">
                         {/* Gradient overlays for smooth fade effect */}
                        <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none"></div>

                        <div className="animate-vertical-scroll hover:cursor-pointer">
                            {/* Original List */}
                            <div className="divide-y divide-gray-50">
                                {listUsers.map((u, index) => (
                                    <div key={`original-${u.id}`} className="p-4 sm:p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                                        <div className="font-bold text-gray-300 text-lg w-8 text-center">{index + 4}</div>
                                        <img src={u.image} alt="" className="w-10 h-10 rounded-full object-cover border border-gray-100" />
                                        <div className="flex-grow">
                                            <div className="font-bold text-dark text-sm flex items-center gap-2">
                                                {u.name}
                                                <div className="flex gap-0.5">
                                                    {u.badges.map(bid => {
                                                        const badge = MOCK_BADGES.find(b => b.id === bid);
                                                        return badge ? <div key={bid} title={badge.name} className="w-3 h-3 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center"><ShieldCheck size={8} /></div> : null;
                                                    })}
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-500">{u.referralCount} referrals</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-primary text-sm">{u.reputationPoints.toLocaleString()}</div>
                                            <div className="text-[10px] text-gray-400">points</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Duplicate List for Seamless Loop */}
                            <div className="divide-y divide-gray-50">
                                {listUsers.map((u, index) => (
                                    <div key={`duplicate-${u.id}`} className="p-4 sm:p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                                        <div className="font-bold text-gray-300 text-lg w-8 text-center">{index + 4}</div>
                                        <img src={u.image} alt="" className="w-10 h-10 rounded-full object-cover border border-gray-100" />
                                        <div className="flex-grow">
                                            <div className="font-bold text-dark text-sm flex items-center gap-2">
                                                {u.name}
                                                <div className="flex gap-0.5">
                                                    {u.badges.map(bid => {
                                                        const badge = MOCK_BADGES.find(b => b.id === bid);
                                                        return badge ? <div key={bid} title={badge.name} className="w-3 h-3 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center"><ShieldCheck size={8} /></div> : null;
                                                    })}
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-500">{u.referralCount} referrals</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-primary text-sm">{u.reputationPoints.toLocaleString()}</div>
                                            <div className="text-[10px] text-gray-400">points</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;