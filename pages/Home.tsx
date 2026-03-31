
import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import BusinessCard from '../components/BusinessCard';
import StoryTray from '../components/StoryTray';
import AiConcierge from '../components/AiConcierge';
import ComparisonDrawer from '../components/ComparisonDrawer';
import { MOCK_BUSINESSES, CATEGORIES } from '../constants';
import * as Icons from 'lucide-react';
import { TrendingUp, Zap, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const SponsoredCarousel: React.FC<{ businesses: any[] }> = ({ businesses }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerPage(1);
      else if (window.innerWidth < 1024) setItemsPerPage(2);
      else setItemsPerPage(3);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = Math.ceil(businesses.length / itemsPerPage);

  if (businesses.length === 0) return null;

  return (
    <section className="py-12 bg-gradient-to-r from-yellow-50/50 to-white dark:from-yellow-900/10 dark:to-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="bg-yellow-400 rounded-full p-1.5 text-white shadow-lg">
              <Zap size={16} fill="currentColor" />
            </div>
            <h2 className="text-2xl font-bold text-dark dark:text-white tracking-tight">Sponsored Gems</h2>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveIndex((prev) => (prev - 1 + totalPages) % totalPages)}
              className="p-2 rounded-full glass border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-primary transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => setActiveIndex((prev) => (prev + 1) % totalPages)}
              className="p-2 rounded-full glass border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-primary transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        
        <div className="relative">
          <div 
            className="flex transition-transform duration-700 ease-in-out gap-6"
            style={{ 
              transform: `translateX(-${activeIndex * (100 + (6 * 100 / (itemsPerPage * 100)))}%)`,
              width: `${(businesses.length / itemsPerPage) * 100}%` 
            }}
          >
            {businesses.map((business) => (
              <div 
                key={business.id} 
                className="px-1"
                style={{ width: `${100 / businesses.length}%` }}
              >
                <BusinessCard business={business} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Home: React.FC = () => {
  const trendingBusinesses = [...MOCK_BUSINESSES]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 3);
  
  const promotedBusinesses = MOCK_BUSINESSES.filter(b => b.isPromoted);
  const featuredListings = MOCK_BUSINESSES.filter(b => b.rating >= 4.5).slice(0, 6);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
        const { current } = scrollContainerRef;
        const scrollAmount = 350;
        if (direction === 'left') {
            current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else {
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    }
  };

  return (
    <>
      <StoryTray />
      <Hero />
      <SponsoredCarousel businesses={promotedBusinesses} />

      <section className="py-12 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-6">
                <div>
                     <div className="flex items-center gap-2 mb-1">
                        <div className="bg-primary/10 p-1.5 rounded-lg text-primary">
                            <Star size={16} fill="currentColor" />
                        </div>
                        <span className="text-xs font-bold text-primary tracking-wider uppercase">Editor's Pick</span>
                     </div>
                     <h2 className="text-3xl font-bold text-dark dark:text-white">Featured Listings</h2>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => scroll('left')} className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-black/30 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md flex items-center justify-center text-dark dark:text-white transition-all backdrop-blur-sm"><ChevronLeft size={20} /></button>
                    <button onClick={() => scroll('right')} className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-black/30 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md flex items-center justify-center text-dark dark:text-white transition-all backdrop-blur-sm"><ChevronRight size={20} /></button>
                </div>
            </div>

            <div ref={scrollContainerRef} className="flex gap-6 overflow-x-auto pb-8 pt-2 no-scrollbar snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth">
                {featuredListings.map(business => (
                    <div key={business.id} className="min-w-[85vw] sm:min-w-[340px] md:min-w-[380px] snap-center">
                        <BusinessCard business={business} />
                    </div>
                ))}
            </div>
        </div>
      </section>
      
      <section className="py-16 bg-white/50 dark:bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dark dark:text-white mb-4 uppercase tracking-widest font-black">Categories</h2>
            <p className="text-graytext dark:text-gray-400 font-medium">What's on your mind today?</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {CATEGORIES.map((cat) => {
              const IconComponent = (Icons as any)[cat.icon] || Icons.HelpCircle;
              return (
                <div key={cat.id} className="group cursor-pointer">
                  <div className="glass-card rounded-[2rem] p-8 shadow-xl shadow-gray-200/60 dark:shadow-none border border-gray-100 dark:border-white/5 flex flex-col items-center justify-center hover:shadow-2xl hover:border-primary transition-all duration-300">
                    <div className="w-14 h-14 bg-red-50 dark:bg-red-900/20 text-primary rounded-2xl flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-colors">
                      <IconComponent size={28} />
                    </div>
                    <h4 className="font-bold text-dark dark:text-white text-sm mb-1 uppercase tracking-tight">{cat.name}</h4>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{cat.count} Listings</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-black text-dark dark:text-white mb-2 flex items-center gap-3 uppercase tracking-tighter">
                 Trending Now <TrendingUp className="text-primary" size={32} />
              </h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-xl font-medium">
                The hottest spots in Nigeria, ranked by real user engagement.
              </p>
            </div>
            <Link to="/listings" className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-black px-6 py-3 rounded-2xl text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-md">
              View All Listings
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trendingBusinesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        </div>
      </section>

      <CTASection />
      <AiConcierge />
      <ComparisonDrawer />
    </>
  );
};

const CTASection = () => (
    <section className="py-20 bg-dark dark:bg-black relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 rounded-l-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
             <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">Elevate your business visibility.</h2>
             <p className="text-slate-400 mb-10 text-lg font-medium">Join thousands of verified vendors and connect with local customers in real-time.</p>
             <div className="flex gap-4 max-w-md">
               <input type="email" placeholder="Email address" className="flex-1 bg-white/10 backdrop-blur border border-white/20 rounded-2xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-all" />
               <button className="bg-primary text-white font-black rounded-2xl px-8 py-4 hover:bg-red-600 transition-all shadow-xl shadow-red-500/20 active:scale-95 uppercase text-xs tracking-widest">Join</button>
             </div>
          </div>
          <div className="md:w-1/3 flex justify-center relative">
             <div className="w-64 h-64 bg-primary/20 rounded-full blur-[100px] absolute"></div>
             <div className="relative glass-card p-10 rounded-[3rem] border-white/10 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700">
                <Icons.Store size={80} className="text-primary mb-4" />
                <h3 className="text-white font-black text-xl uppercase tracking-tighter">Become a Gold Vendor</h3>
             </div>
          </div>
        </div>
      </section>
);

export default Home;
