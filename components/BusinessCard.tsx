
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Phone, Share2, Zap } from 'lucide-react';
import { Business } from '../types';

interface BusinessCardProps {
  business: Business;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {
  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const shareData = {
        title: business.name,
        text: `Check out ${business.name} on InstaConnect NG!`,
        url: `${window.location.origin}/#/listing/${business.id}`,
    };

    if (navigator.share) {
        navigator.share(shareData).catch((err) => console.log('Error sharing', err));
    } else {
        navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard!');
    }
  };

  return (
    <div className={`group glass-card rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${business.isPromoted ? 'border-2 border-yellow-400 shadow-yellow-100 dark:shadow-yellow-900/20' : ''}`}>
      {/* Image Container */}
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <img 
          src={business.image} 
          alt={business.name} 
          loading="lazy"
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
            <span className="bg-white/90 dark:bg-black/80 backdrop-blur-sm text-dark dark:text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                {business.category}
            </span>
            {business.isPromoted && (
                <span className="bg-yellow-400 text-dark text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <Zap size={10} fill="currentColor" /> Promoted
                </span>
            )}
        </div>

        <div className="absolute top-4 right-4 flex gap-2">
            <button 
                onClick={handleShare}
                className="w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm bg-white/20 hover:bg-white/40 text-white transition-colors shadow-sm"
                title="Share"
            >
                <Share2 size={16} />
            </button>
            <button className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm shadow-sm transition-colors ${business.isOpen ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-bold text-dark dark:text-white mb-1 group-hover:text-primary transition-colors">
              <Link to={`/listing/${business.id}`}>{business.name}</Link>
            </h3>
            <div className="flex items-center text-graytext dark:text-gray-400 text-xs mb-3">
              <MapPin size={12} className="mr-1 text-primary" />
              {business.location}
            </div>
          </div>
          <div className="flex flex-col items-end">
             <span className="text-primary font-bold text-sm bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-lg">{business.priceRange}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={14} 
              className={`${i < Math.floor(business.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} 
            />
          ))}
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium ml-1">({business.reviewCount} reviews)</span>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 pt-4 flex items-center justify-between">
           <div className="flex gap-2">
                {business.tags.slice(0, 2).map((tag, i) => (
                    <span key={i} className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600 px-2 py-1 rounded-md">{tag}</span>
                ))}
           </div>
           <Link to={`/listing/${business.id}`} className="text-sm font-semibold text-dark dark:text-white hover:text-primary transition-colors">
             View Details &rarr;
           </Link>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
