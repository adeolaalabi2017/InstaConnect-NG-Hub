
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Grid, ArrowUpDown } from 'lucide-react';
import { NIGERIAN_LOCATIONS } from '../constants';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Recommended');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const locationWrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (locationWrapperRef.current && !locationWrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [locationWrapperRef]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePos({ x, y });
    }
  };

  const filteredLocations = NIGERIAN_LOCATIONS.filter(loc => 
    loc.toLowerCase().includes(location.toLowerCase())
  );

  const handleExplore = () => {
    const params = new URLSearchParams();
    if (keyword) params.append('q', keyword);
    if (category && category !== 'All' && category !== 'Choose Category') params.append('category', category);
    if (location) params.append('location', location);
    if (sortBy && sortBy !== 'Recommended') params.append('sort', sortBy);
    
    navigate(`/listings?${params.toString()}`);
  };

  return (
    <section 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative pt-20 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[600px] flex flex-col justify-center"
    >
      <style>{`
        @keyframes float {
          0% { transform: translate(0px, 0px); }
          50% { transform: translate(20px, -20px); }
          100% { transform: translate(0px, 0px); }
        }
        @keyframes float-reverse {
          0% { transform: translate(0px, 0px); }
          50% { transform: translate(-20px, 20px); }
          100% { transform: translate(0px, 0px); }
        }
        .animate-float { animation: float 8s ease-in-out infinite; }
        .animate-float-reverse { animation: float-reverse 10s ease-in-out infinite; }
      `}</style>

      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Top Right Orb */}
        <div 
            className="absolute -top-[10%] -right-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-3xl animate-float opacity-60 dark:opacity-30"
            style={{ transform: `translate(${mousePos.x * -20}px, ${mousePos.y * 20}px)` }}
        ></div>
        
        {/* Bottom Left Orb */}
        <div 
            className="absolute -bottom-[10%] -left-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-blue-400/20 to-purple-500/20 blur-3xl animate-float-reverse opacity-60 dark:opacity-30"
            style={{ transform: `translate(${mousePos.x * 20}px, ${mousePos.y * -20}px)` }}
        ></div>

        {/* Center Accent */}
        <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-white/40 dark:bg-white/5 blur-[100px] pointer-events-none"
        ></div>
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/50 dark:bg-white/10 border border-white/20 backdrop-blur-sm text-sm font-medium text-primary dark:text-primary animate-fade-in-down">
            ✨ Discover Nigeria's Best Gems
        </div>
        
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-dark dark:text-white tracking-tight mb-6 leading-tight animate-fade-in-up">
          Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary relative">
            Local Favorites
            <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary opacity-40" viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.00025 6.99997C18.5038 3.81345 33.285 2.00023 54.5 2.00023C131.002 2.00023 160.502 6.00005 197 7.00005" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>
          </span>
        </h1>
        
        <p className="text-graytext dark:text-gray-300 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-100">
          From top-rated restaurants to trusted local services, find everything you need in one modern directory.
        </p>

        {/* Improved Search Bar */}
        <div className="glass-card p-2 rounded-3xl shadow-2xl shadow-primary/5 max-w-5xl mx-auto transform transition-all hover:scale-[1.005] animate-fade-in-up delay-200 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/50 dark:border-white/10">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2 lg:gap-0">
            
             {/* Keyword Search */}
             <div className="flex-[1.5] group relative flex items-center px-4 py-3 bg-transparent rounded-2xl focus-within:bg-white dark:focus-within:bg-gray-700/50 transition-all duration-300">
              <div className={`p-2 rounded-xl mr-3 transition-colors ${keyword ? 'bg-primary/10 text-primary' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}>
                  <Search size={20} />
              </div>
              <div className="text-left w-full">
                <label htmlFor="hero-keyword" className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">Search</label>
                <input 
                  id="hero-keyword"
                  type="text" 
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g. Sushi, Plumber..." 
                  className="w-full bg-transparent text-dark dark:text-white font-semibold focus:outline-none placeholder-gray-400 text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="hidden lg:block w-px h-10 bg-gray-200 dark:bg-gray-700 mx-2"></div>

            {/* Category */}
            <div className="flex-1 group relative flex items-center px-4 py-3 bg-transparent rounded-2xl focus-within:bg-white dark:focus-within:bg-gray-700/50 transition-all duration-300">
              <div className={`p-2 rounded-xl mr-3 transition-colors ${category !== 'All' ? 'bg-primary/10 text-primary' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}>
                  <Grid size={20} />
              </div>
              <div className="text-left w-full">
                <label htmlFor="hero-category" className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">Category</label>
                <select 
                  id="hero-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-transparent text-dark dark:text-white font-semibold focus:outline-none cursor-pointer appearance-none -ml-1 [&>option]:text-dark text-sm sm:text-base"
                >
                  <option value="All">All Categories</option>
                  <option value="Hotels">Hotels</option>
                  <option value="Food">Food</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Events">Events</option>
                  <option value="Health">Health</option>
                </select>
              </div>
            </div>

            <div className="hidden lg:block w-px h-10 bg-gray-200 dark:bg-gray-700 mx-2"></div>

            {/* Location (Autocomplete) */}
            <div 
              ref={locationWrapperRef}
              className="relative flex-1 group flex items-center px-4 py-3 bg-transparent rounded-2xl focus-within:bg-white dark:focus-within:bg-gray-700/50 transition-all duration-300"
            >
              <div className={`p-2 rounded-xl mr-3 transition-colors ${location ? 'bg-primary/10 text-primary' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}>
                  <MapPin size={20} />
              </div>
              <div className="text-left w-full">
                <label htmlFor="hero-location" className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">Where</label>
                <input 
                  id="hero-location"
                  type="text" 
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Lagos, Abuja..." 
                  className="w-full bg-transparent text-dark dark:text-white font-semibold focus:outline-none placeholder-gray-400 text-sm sm:text-base"
                />
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && location.length > 0 && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 max-h-60 overflow-y-auto z-50 overflow-hidden text-left animate-fade-in-up">
                  {filteredLocations.length > 0 ? (
                    filteredLocations.map((loc, index) => (
                      <div 
                        key={index}
                        onClick={() => {
                          setLocation(loc);
                          setShowSuggestions(false);
                        }}
                        className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer text-sm text-dark dark:text-gray-200 flex items-center gap-2 transition-colors border-b border-gray-50 dark:border-gray-700 last:border-0"
                      >
                        <MapPin size={14} className="text-gray-400" />
                        {loc}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-400 italic">No locations found</div>
                  )}
                </div>
              )}
            </div>

            <div className="hidden lg:block w-px h-10 bg-gray-200 dark:bg-gray-700 mx-2"></div>

            {/* Sort Filter */}
            <div className="flex-1 group relative flex items-center px-4 py-3 bg-transparent rounded-2xl focus-within:bg-white dark:focus-within:bg-gray-700/50 transition-all duration-300">
              <div className={`p-2 rounded-xl mr-3 transition-colors ${sortBy !== 'Recommended' ? 'bg-primary/10 text-primary' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}>
                  <ArrowUpDown size={20} />
              </div>
              <div className="text-left w-full">
                <label htmlFor="hero-sort" className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">Sort</label>
                <select 
                  id="hero-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-transparent text-dark dark:text-white font-semibold focus:outline-none cursor-pointer appearance-none -ml-1 [&>option]:text-dark text-sm sm:text-base"
                >
                  <option value="Recommended">Recommended</option>
                  <option value="Highest Rated">Highest Rated</option>
                  <option value="Most Reviewed">Most Reviewed</option>
                </select>
              </div>
            </div>

            {/* Search Button */}
            <div className="p-1">
                <button 
                onClick={handleExplore}
                className="w-full lg:w-auto h-full min-h-[60px] bg-dark dark:bg-primary hover:bg-primary dark:hover:bg-red-600 text-white rounded-2xl px-8 font-bold shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                <Search size={20} />
                <span className="lg:hidden">Search</span>
                </button>
            </div>
            
          </div>
        </div>

        {/* Popular Tags */}
        <div className="mt-8 flex flex-wrap justify-center gap-2 text-sm text-graytext dark:text-gray-400 animate-fade-in-up delay-300">
          <span className="font-semibold text-dark dark:text-white">Popular:</span> 
          {['Hotel', 'Business', 'Wedding', 'Office', 'Healthcare', 'Lifestyle'].map((tag, i) => (
              <span key={i} className="cursor-pointer hover:text-primary transition-colors underline decoration-dotted">{tag}</span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
