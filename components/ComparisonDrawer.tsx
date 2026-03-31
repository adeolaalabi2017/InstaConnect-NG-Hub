
import React from 'react';
import { useComparison } from './ComparisonContext';
import { X, Layers, ArrowRight, Star, MapPin, Zap, CheckCircle } from 'lucide-react';
// Import Link from react-router-dom to fix 'Cannot find name Link'
import { Link } from 'react-router-dom';
// Import Business from types to fix 'Cannot find name Business'
import { Business } from '../types';

const ComparisonDrawer: React.FC = () => {
    const { selectedBusinesses, removeFromCompare, clearCompare, isComparisonOpen, setIsComparisonOpen } = useComparison();

    if (selectedBusinesses.length === 0) return null;

    return (
        <>
            {/* Minimal Sticky Bar */}
            {!isComparisonOpen && (
                <div className="fixed bottom-6 left-6 z-[55] animate-fade-in-up">
                    <button 
                        onClick={() => setIsComparisonOpen(true)}
                        className="bg-dark dark:bg-white text-white dark:text-dark px-6 py-4 rounded-3xl shadow-2xl flex items-center gap-3 font-black text-sm uppercase tracking-widest active:scale-95 transition-transform"
                    >
                        <Layers size={20} className="text-primary" />
                        Compare ({selectedBusinesses.length})
                    </button>
                </div>
            )}

            {/* Full Screen Comparison View */}
            {isComparisonOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-dark/95 backdrop-blur-md animate-fade-in">
                    <div className="w-full max-w-6xl glass-card rounded-[2.5rem] flex flex-col max-h-[90vh] overflow-hidden border-white/20 shadow-2xl">
                        <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <div>
                                <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                                    <Layers className="text-primary" size={32} /> Compare Choices
                                </h2>
                                <p className="text-white/60 text-sm font-medium mt-1">Make informed decisions between top local vendors.</p>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={clearCompare} className="text-white/40 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors">Clear All</button>
                                <button onClick={() => setIsComparisonOpen(false)} className="bg-white/10 hover:bg-white/20 p-4 rounded-2xl text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-x-auto p-8 custom-scrollbar">
                            <table className="w-full text-left border-collapse min-w-[800px]">
                                <thead>
                                    <tr>
                                        <th className="p-4 w-48"></th>
                                        {selectedBusinesses.map(b => (
                                            <th key={b.id} className="p-4 min-w-[200px]">
                                                <div className="relative group">
                                                    <img src={b.image} className="w-full h-32 rounded-2xl object-cover mb-4 shadow-lg" alt="" />
                                                    <button onClick={() => removeFromCompare(b.id)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg">
                                                        <X size={14} />
                                                    </button>
                                                    <h4 className="text-white font-black text-lg truncate">{b.name}</h4>
                                                    <span className="text-primary text-xs font-bold uppercase">{b.category}</span>
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="text-white/80">
                                    <Row label="Overall Rating" businesses={selectedBusinesses} render={(b) => (
                                        <div className="flex items-center gap-1 text-yellow-400 font-black">
                                            <Star size={16} fill="currentColor" /> {b.rating}
                                            <span className="text-white/40 text-[10px]">({b.reviewCount})</span>
                                        </div>
                                    )} />
                                    <Row label="Price Tier" businesses={selectedBusinesses} render={(b) => <span className="font-bold">{b.priceRange}</span>} />
                                    <Row label="Verification" businesses={selectedBusinesses} render={(b) => (
                                        <div className="flex items-center gap-1">
                                            <CheckCircle size={14} className={b.verificationLevel === 'gold' ? 'text-yellow-400' : 'text-slate-400'} />
                                            <span className="text-[10px] font-black uppercase">{b.verificationLevel || 'Unverified'}</span>
                                        </div>
                                    )} />
                                    <Row label="Amenities" businesses={selectedBusinesses} render={(b) => (
                                        <div className="flex flex-wrap gap-1">
                                            {b.amenities?.slice(0, 3).map(a => <span key={a} className="text-[9px] bg-white/10 px-2 py-0.5 rounded-lg">{a}</span>)}
                                        </div>
                                    )} />
                                    <tr>
                                        <td className="p-4"></td>
                                        {selectedBusinesses.map(b => (
                                            <td key={b.id} className="p-4">
                                                <Link to={`/listing/${b.id}`} onClick={() => setIsComparisonOpen(false)} className="w-full block text-center bg-white text-dark font-black py-3 rounded-xl text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                                                    View Listing
                                                </Link>
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

// Add explicit typing for Business parameter in render function
const Row = ({ label, businesses, render }: { label: string, businesses: Business[], render: (b: Business) => React.ReactNode }) => (
    <tr className="border-t border-white/5">
        <td className="p-6 font-black text-xs uppercase tracking-widest text-white/40">{label}</td>
        {businesses.map(b => (
            <td key={b.id} className="p-6">{render(b)}</td>
        ))}
    </tr>
);

export default ComparisonDrawer;
