
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
  
  // Refs for direct DOM manipulation (Performance Optimization)
  const containerRef = useRef<HTMLElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const locationWrapperRef = useRef<HTMLDivElement>(null);

  // Close suggestions on click outside
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

  // Optimized Parallax Effect
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        // Calculate normalized position (-1 to 1) relative to center
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        
        targetX = x;
        targetY = y;
    };

    const animate = () => {
        // Linear interpolation (Lerp) for smooth movement
        currentX += (targetX - currentX) * 0.05; // 0.05 factor for laggy/smooth follow
        currentY += (targetY - currentY) * 0.05;

        if (orb1Ref.current) {
            // Orb 1 moves opposite to mouse
            orb1Ref.current.style.transform = `translate3d(${currentX * -30}px, ${currentY * 30}px, 0)`;
        }
        if (orb2Ref.current) {
            // Orb 2 moves with mouse
            orb2Ref.current.style.transform = `translate3d(${currentX * 30}px, ${currentY * -30}px, 0)`;
        }

        animationFrameId = requestAnimationFrame(animate);
    };

    // Attach event listener
    container.addEventListener('mousemove', handleMouseMove);
    // Start animation loop
    animationFrameId = requestAnimationFrame(animate);

    return () => {
        container.removeEventListener('mousemove', handleMouseMove);
        cancelAnimationFrame(animationFrameId);
    };
  }, []);

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
        className="relative pt-20 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[600px] flex flex-col justify-center"
    >
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(20px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
        
        .hardware-accelerated {
            will-change: transform;
            transform: translateZ(0);
        }
      `}</style>

      {/* Background Image with Blur */}
      <div className="absolute inset-0 -z-30">
        <img 
          src="https://i.ytimg.com/vi/g-Q_2Y_R-X8/maxresdefault.jpg" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
        {/* Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-white/85 dark:bg-slate-900/85 backdrop-blur-sm transition-colors duration-300"></div>
      </div>

      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 -z-20 overflow-hidden pointer-events-none select-none">
        {/* Top Right Orb Wrapper (Parallax) */}
        <div ref={orb1Ref} className="absolute -top-[10%] -right-[10%] hardware-accelerated">
            {/* Inner Orb (Floating Animation) */}
            <div className="w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-3xl animate-float opacity-70"></div>
        </div>
        
        {/* Bottom Left Orb Wrapper (Parallax) */}
        <div ref={orb2Ref} className="absolute -bottom-[10%] -left-[10%] hardware-accelerated">
            {/* Inner Orb (Floating Animation) */}
            <div className="w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-blue-400/20 to-purple-500/20 blur-3xl animate-float-delayed opacity-70"></div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/50 dark:bg-white/10 border border-white/20 backdrop-blur-md text-sm font-medium text-primary dark:text-primary animate-fade-in-down shadow-sm">
            ✨ Discover Nigeria's Best Gems
        </div>
        
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-dark dark:text-white tracking-tight mb-6 leading-tight animate-fade-in-up drop-shadow-sm">
          Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary relative">
            Local Favorites
            <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary opacity-40" viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.00025 6.99997C18.5038 3.81345 33.285 2.00023 54.5 2.00023C131.002 2.00023 160.502 6.00005 197 7.00005" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>
          </span>
        </h1>
        
        <p className="text-graytext dark:text-gray-200 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-100 font-medium">
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
        <div className="mt-8 flex flex-wrap justify-center gap-2 text-sm text-graytext dark:text-gray-300 animate-fade-in-up delay-300">
          <span className="font-semibold text-dark dark:text-white">Popular:</span> 
          {['Hotel', 'Business', 'Wedding', 'Office', 'Healthcare', 'Lifestyle'].map((tag, i) => (
              <span key={i} className="cursor-pointer hover:text-primary transition-colors underline decoration-dotted backdrop-blur-sm px-1 rounded">{tag}</span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
