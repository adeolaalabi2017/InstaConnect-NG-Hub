
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Grid, ArrowUpDown, X } from 'lucide-react';
import { NIGERIAN_LOCATIONS } from '../constants';
import { contentService } from '../services/content';
import { HeroConfig } from '../types';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState<HeroConfig>(contentService.getConfig().hero);
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Recommended');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Refs for direct DOM manipulation (Performance Optimization)
  const containerRef = useRef<HTMLElement>(null);
  const bgImageRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const locationWrapperRef = useRef<HTMLDivElement>(null);

  // Listen for config changes
  useEffect(() => {
    const handleConfigUpdate = () => {
        setConfig(contentService.getConfig().hero);
    };
    window.addEventListener('site-config-updated', handleConfigUpdate);
    return () => window.removeEventListener('site-config-updated', handleConfigUpdate);
  }, []);

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

  // Optimized Parallax Effect & Mouse Tracking
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

        // Parallax for Background Image (Subtle)
        if (bgImageRef.current) {
            // Scale up slightly to prevent edges from showing during movement
            bgImageRef.current.style.transform = `scale(1.1) translate3d(${currentX * -10}px, ${currentY * -10}px, 0)`;
        }

        // Parallax for Orbs (More pronounced)
        if (orb1Ref.current) {
            orb1Ref.current.style.transform = `translate3d(${currentX * -30}px, ${currentY * 30}px, 0)`;
        }
        if (orb2Ref.current) {
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

  // Generate static particles for visual effect
  const particles = Array.from({ length: 15 }).map((_, i) => ({
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 15 + 10}s`,
      animationDelay: `${Math.random() * 5}s`,
      opacity: Math.random() * 0.5 + 0.1,
      size: Math.random() * 4 + 2
  }));

  if (!config.isVisible) return null;

  return (
    <section 
        ref={containerRef}
        className="relative pt-28 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[650px] flex flex-col justify-center"
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
        @keyframes rise {
            0% { transform: translateY(100vh) translateX(0); opacity: 0; }
            10% { opacity: var(--opacity); }
            90% { opacity: var(--opacity); }
            100% { transform: translateY(-10vh) translateX(20px); opacity: 0; }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
        .animate-rise { animation: rise linear infinite; }
        
        .hardware-accelerated {
            will-change: transform;
            transform: translateZ(0);
        }
      `}</style>

      {/* Background Image Container with Parallax */}
      <div className="absolute inset-0 -z-30 overflow-hidden">
          <div ref={bgImageRef} className="absolute inset-0 w-full h-full transition-transform duration-75 ease-out hardware-accelerated">
            <img 
            src={config.backgroundImage} 
            alt="Background" 
            className="w-full h-full object-cover scale-110"
            />
            {/* Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-white/85 dark:bg-slate-900/85 backdrop-blur-sm transition-colors duration-300"></div>
          </div>
      </div>

      {/* Particle Effects */}
      <div className="absolute inset-0 -z-20 pointer-events-none overflow-hidden">
          {particles.map((p, i) => (
              <div 
                key={i}
                className="absolute bg-primary rounded-full animate-rise"
                style={{
                    left: p.left,
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                    bottom: '-10px',
                    '--opacity': p.opacity,
                    animationDuration: p.animationDuration,
                    animationDelay: p.animationDelay
                } as React.CSSProperties}
              ></div>
          ))}
      </div>

      {/* Dynamic Background Orbs */}
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
          {config.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary relative">
            {config.highlightText}
            <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary opacity-40" viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.00025 6.99997C18.5038 3.81345 33.285 2.00023 54.5 2.00023C131.002 2.00023 160.502 6.00005 197 7.00005" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>
          </span>
        </h1>
        
        <p className="text-graytext dark:text-gray-200 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-100 font-medium">
          {config.subtitle}
        </p>

        {/* Improved Search Bar */}
        {config.showSearchBar && (
            <div className="glass-card p-2 rounded-3xl shadow-2xl shadow-primary/5 max-w-5xl mx-auto transform transition-all hover:scale-[1.005] animate-fade-in-up delay-200 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/50 dark:border-white/10">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2 lg:gap-0">
                
                {/* Keyword Search */}
                <div className="flex-[1.5] group relative flex items-center px-4 py-3 bg-transparent rounded-2xl focus-within:bg-white dark:focus-within:bg-gray-700/50 transition-all duration-300">
                <div className={`p-2 rounded-xl mr-3 transition-colors ${keyword ? 'bg-primary/10 text-primary' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}>
                    <Search size={20} />
                </div>
                <div className="text-left w-full relative">
                    <label htmlFor="hero-keyword" className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">Search</label>
                    <input 
                    id="hero-keyword"
                    type="text" 
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="e.g. Sushi, Plumber..." 
                    className="w-full bg-transparent text-dark dark:text-white font-semibold focus:outline-none placeholder-gray-400 text-sm sm:text-base pr-6"
                    />
                    {keyword && (
                        <button 
                            onClick={() => setKeyword('')} 
                            className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-dark dark:hover:text-white transition-colors"
                            aria-label="Clear search"
                        >
                            <X size={16} />
                        </button>
                    )}
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
                <div className="text-left w-full relative">
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
                    className="w-full bg-transparent text-dark dark:text-white font-semibold focus:outline-none placeholder-gray-400 text-sm sm:text-base pr-6"
                    />
                    {location && (
                        <button 
                            onClick={() => setLocation('')} 
                            className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-dark dark:hover:text-white transition-colors"
                            aria-label="Clear location"
                        >
                            <X size={16} />
                        </button>
                    )}
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
                    className="w-full lg:w-auto h-full min-h-[60px] bg-dark dark:bg-primary hover:bg-primary dark:hover:bg-red-600 text-white rounded-2xl px-8 font-bold shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 group"
                    >
                    <Search size={20} className="group-hover:scale-110 transition-transform" />
                    <span className="lg:hidden">Search</span>
                    </button>
                </div>
                
            </div>
            </div>
        )}

        {/* Popular Tags */}
        <div className="mt-8 flex flex-wrap justify-center gap-2 text-sm text-graytext dark:text-gray-300 animate-fade-in-up delay-300">
          <span className="font-semibold text-dark dark:text-white">Popular:</span> 
          {config.tags.map((tag, i) => (
              <span key={i} className="cursor-pointer hover:text-primary transition-colors underline decoration-dotted backdrop-blur-sm px-1 rounded">{tag}</span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
