
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Share2, Zap, ShieldCheck, Layers } from 'lucide-react';
import { Business } from '../types';
import { useComparison } from './ComparisonContext';

interface BusinessCardProps {
  business: Business;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {
  const { addToCompare, selectedBusinesses } = useComparison();
  const isSelectedForCompare = selectedBusinesses.some(b => b.id === business.id);
  const [copied, setCopied] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const shareData = {
        title: business.name,
        text: `Check out ${business.name} on Vendors Hub!`,
        url: `${window.location.origin}/#/listing/${business.id}`,
    };

    if (navigator.share) {
        navigator.share(shareData).catch((err) => console.log('Error sharing', err));
    } else {
        navigator.clipboard.writeText(shareData.url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        });
    }
  };

  return (
    <div className={`group glass-card rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${business.isPromoted ? 'border-2 border-yellow-400' : 'border-transparent'}`}>
      {/* Image Container */}
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <img 
          src={business.image} 
          alt={business.name} 
          loading="lazy"
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Verification Tiers */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
            <span className="bg-white/90 dark:bg-black/80 backdrop-blur-sm text-dark dark:text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg shadow-sm border border-white/20">
                {business.category}
            </span>
            {business.verificationLevel === 'gold' && (
                <div className="flex items-center gap-1 bg-yellow-400 text-dark px-2.5 py-1 rounded-lg shadow-xl border-2 border-white animate-shimmer bg-[length:200%_100%]">
                    <ShieldCheck size={12} className="fill-dark/20" />
                    <span className="text-[9px] font-black uppercase">Verified Gold</span>
                </div>
            )}
            {business.verificationLevel === 'silver' && (
                <div className="flex items-center gap-1 bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg shadow-md border-2 border-white">
                    <ShieldCheck size={12} />
                    <span className="text-[9px] font-black uppercase">Verified Silver</span>
                </div>
            )}
        </div>

        <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button 
                onClick={handleShare}
                className="w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md bg-white/20 hover:bg-primary hover:text-white text-white transition-all shadow-xl"
                title="Share"
            >
                <Share2 size={18} />
            </button>
            <button 
                onClick={(e) => { e.preventDefault(); addToCompare(business); }}
                className={`w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md transition-all shadow-xl ${isSelectedForCompare ? 'bg-primary text-white' : 'bg-white/20 hover:bg-dark text-white'}`}
                title="Compare"
            >
                <Layers size={18} />
            </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-black text-slate-950 dark:text-white mb-1 tracking-tight">
              <Link to={`/listing/${business.id}`}>{business.name}</Link>
            </h3>
            <div className="flex items-center text-slate-500 dark:text-slate-400 text-xs mb-3 font-medium">
              <MapPin size={12} className="mr-1 text-primary" />
              {business.location}
            </div>
          </div>
          <div className="flex flex-col items-end">
             <span className="text-primary font-black text-sm bg-primary/5 dark:bg-primary/20 px-3 py-1 rounded-xl">{business.priceRange}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={14} 
              className={`${i < Math.floor(business.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 dark:text-gray-700'}`} 
            />
          ))}
          <span className="text-xs text-slate-400 font-black ml-1 tracking-wider uppercase">({business.reviewCount} Reviews)</span>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 pt-5 flex items-center justify-between">
           <div className="flex gap-2">
                {business.tags.slice(0, 2).map((tag, i) => (
                    <span key={i} className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded-lg border border-slate-100 dark:border-slate-800">{tag}</span>
                ))}
           </div>
           <Link to={`/listing/${business.id}`} className="p-3 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all shadow-lg active:scale-95">
             <Zap size={16} />
           </Link>
        </div>
      </div>

      {copied && (
        <div className="fixed bottom-6 right-6 z-[9999] bg-slate-900/95 dark:bg-slate-950/95 text-white text-xs font-semibold px-4 py-3 rounded-2xl flex items-center gap-2.5 shadow-2xl border border-white/10 animate-fade-in-up backdrop-blur-md">
          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white shrink-0">
            <Zap size={10} fill="currentColor" />
          </div>
          <span>"{business.name}" link copied!</span>
        </div>
      )}
    </div>
  );
};

export default BusinessCard;
