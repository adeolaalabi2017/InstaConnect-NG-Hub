
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import BusinessCard from '../components/BusinessCard';
import { MOCK_BUSINESSES, CATEGORIES } from '../constants';
import * as Icons from 'lucide-react';
import { TrendingUp, Zap, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const Home: React.FC = () => {
  // Sort businesses by viewCount descending to determine trending
  const trendingBusinesses = [...MOCK_BUSINESSES]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 3);
  
  // Filter for promoted businesses
  const promotedBusinesses = MOCK_BUSINESSES.filter(b => b.isPromoted);

  // Featured Listings (High rated)
  const featuredListings = MOCK_BUSINESSES.filter(b => b.rating >= 4.5).slice(0, 6);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
        const { current } = scrollContainerRef;
        const scrollAmount = 350; // Approx card width
        if (direction === 'left') {
            current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else {
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    }
  };

  return (
    <>
      <Hero />
      
      {/* Sponsored Section */}
      {promotedBusinesses.length > 0 && (
          <section className="py-12 bg-gradient-to-r from-yellow-50/50 to-white dark:from-yellow-900/10 dark:to-transparent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="flex items-center gap-2 mb-6">
                   <div className="bg-yellow-400 rounded-full p-1.5 text-white">
                       <Zap size={16} fill="currentColor" />
                   </div>
                   <h2 className="text-xl font-bold text-dark dark:text-white">Sponsored Businesses</h2>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                   {promotedBusinesses.map((business) => (
                       <BusinessCard key={business.id} business={business} />
                   ))}
               </div>
            </div>
          </section>
      )}

      {/* Featured Listings Carousel */}
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
                    <button 
                        onClick={() => scroll('left')} 
                        className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-black/30 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md flex items-center justify-center text-dark dark:text-white transition-all backdrop-blur-sm"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button 
                        onClick={() => scroll('right')} 
                        className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-black/30 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md flex items-center justify-center text-dark dark:text-white transition-all backdrop-blur-sm"
                        aria-label="Scroll right"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div 
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto pb-8 pt-2 no-scrollbar snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth"
            >
                {featuredListings.map(business => (
                    <div key={business.id} className="min-w-[85vw] sm:min-w-[340px] md:min-w-[380px] snap-center">
                        <BusinessCard business={business} />
                    </div>
                ))}
            </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-16 bg-white/50 dark:bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dark dark:text-white mb-4">Browse by Category</h2>
            <p className="text-graytext dark:text-gray-400">Find exactly what you are looking for</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {CATEGORIES.map((cat) => {
              // Dynamically resolve icon component
              const IconComponent = (Icons as any)[cat.icon] || Icons.HelpCircle;
              
              return (
                <div key={cat.id} className="group cursor-pointer">
                  <div className="glass-card rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5 flex flex-col items-center justify-center hover:shadow-lg hover:border-primary/30 transition-all duration-300">
                    <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 text-primary rounded-full flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-colors">
                      <IconComponent size={24} />
                    </div>
                    <h4 className="font-semibold text-dark dark:text-white text-sm mb-1">{cat.name}</h4>
                    <span className="text-xs text-gray-400">{cat.count} listings</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trending Businesses Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-dark dark:text-white mb-2 flex items-center gap-3">
                 Trending Businesses <TrendingUp className="text-primary" size={28} />
              </h2>
              <p className="text-graytext dark:text-gray-400 max-w-xl">
                Check out the most viewed and engaging businesses on InstaConnect NG this week.
              </p>
            </div>
            <Link to="/listings" className="text-primary font-semibold hover:text-red-700 mt-4 md:mt-0 flex items-center gap-1">
              View All Listings &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trendingBusinesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-dark dark:bg-black relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 rounded-l-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
             <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Get Our Monthly Newsletter</h2>
             <p className="text-gray-400 mb-8">Select a category that best suits your interest. Use filters to customize your search and to find exactly what you want.</p>
             <div className="flex gap-2 max-w-md">
               <input type="email" placeholder="Your email address" className="flex-1 bg-white/10 backdrop-blur border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-primary" />
               <button className="bg-white text-dark font-bold rounded-lg px-6 py-3 hover:bg-gray-100 transition-colors">Subscribe</button>
             </div>
          </div>
          <div className="md:w-1/3">
             {/* Abstract Graphic Placeholder */}
             <div className="w-full aspect-square bg-gradient-to-tr from-primary to-secondary rounded-2xl opacity-20 rotate-6 transform translate-y-4"></div>
             <div className="w-full aspect-square bg-gradient-to-tr from-primary to-secondary rounded-2xl opacity-40 -rotate-6 transform -translate-y-full border-4 border-white/10"></div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
