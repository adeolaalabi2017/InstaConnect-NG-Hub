import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Grid, ArrowUpDown, Type } from 'lucide-react';
import { NIGERIAN_LOCATIONS } from '../constants';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Recommended');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const locationWrapperRef = useRef<HTMLDivElement>(null);

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
    <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-3/4 bg-gradient-to-b from-red-100/50 to-transparent blur-3xl -z-10 rounded-full opacity-60"></div>

      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-dark tracking-tight mb-4">
          Explore All <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Available Listings</span>
        </h1>
        <p className="text-graytext text-lg mb-10 max-w-2xl mx-auto">
          Find the best-rated Instagram vendors, restaurants, businesses, and services in Nigeria with our comprehensive directory.
        </p>

        {/* Filter/Search Bar */}
        <div className="glass-card p-3 rounded-2xl shadow-xl max-w-6xl mx-auto transform transition-all hover:scale-[1.01]">
          <div className="flex flex-col lg:flex-row gap-4">
            
             {/* Keyword Search */}
             <div className="flex-[1.5] flex items-center px-4 py-3 bg-gray-50/50 rounded-xl hover:bg-white transition-colors border border-transparent hover:border-gray-200">
              <Search className="text-primary mr-3" size={20} />
              <div className="text-left w-full">
                <label htmlFor="hero-keyword" className="block text-xs text-gray-400 font-medium">What are you looking for?</label>
                <input 
                  id="hero-keyword"
                  type="text" 
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g. cakes, web design..." 
                  className="w-full bg-transparent text-dark font-medium focus:outline-none placeholder-gray-400"
                />
              </div>
            </div>

            <div className="hidden lg:block w-px bg-gray-200 my-2"></div>

            {/* Category */}
            <div className="flex-1 flex items-center px-4 py-3 bg-gray-50/50 rounded-xl hover:bg-white transition-colors border border-transparent hover:border-gray-200">
              <Grid className="text-primary mr-3" size={20} />
              <div className="text-left w-full">
                <label htmlFor="hero-category" className="block text-xs text-gray-400 font-medium">Categories</label>
                <select 
                  id="hero-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-transparent text-dark font-medium focus:outline-none cursor-pointer appearance-none -ml-1"
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

            <div className="hidden lg:block w-px bg-gray-200 my-2"></div>

            {/* Location (Autocomplete) */}
            <div 
              ref={locationWrapperRef}
              className="relative flex-1 flex items-center px-4 py-3 bg-gray-50/50 rounded-xl hover:bg-white transition-colors border border-transparent hover:border-gray-200"
            >
              <MapPin className="text-primary mr-3" size={20} />
              <div className="text-left w-full">
                <label htmlFor="hero-location" className="block text-xs text-gray-400 font-medium">Location</label>
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
                  className="w-full bg-transparent text-dark font-medium focus:outline-none placeholder-gray-400"
                />
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && location.length > 0 && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-60 overflow-y-auto z-50 overflow-hidden text-left">
                  {filteredLocations.length > 0 ? (
                    filteredLocations.map((loc, index) => (
                      <div 
                        key={index}
                        onClick={() => {
                          setLocation(loc);
                          setShowSuggestions(false);
                        }}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm text-dark flex items-center gap-2 transition-colors border-b border-gray-50 last:border-0"
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

            <div className="hidden lg:block w-px bg-gray-200 my-2"></div>

            {/* Sort Filter */}
            <div className="flex-1 flex items-center px-4 py-3 bg-gray-50/50 rounded-xl hover:bg-white transition-colors border border-transparent hover:border-gray-200">
              <ArrowUpDown className="text-primary mr-3" size={20} />
              <div className="text-left w-full">
                <label htmlFor="hero-sort" className="block text-xs text-gray-400 font-medium">Sort By</label>
                <select 
                  id="hero-sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-transparent text-dark font-medium focus:outline-none cursor-pointer appearance-none -ml-1"
                >
                  <option value="Recommended">Recommended</option>
                  <option value="Highest Rated">Highest Rated</option>
                  <option value="Most Reviewed">Most Reviewed</option>
                </select>
              </div>
            </div>

            {/* Search Button */}
            <button 
              onClick={handleExplore}
              className="bg-primary hover:bg-red-600 text-white rounded-xl px-8 py-4 font-semibold shadow-lg shadow-red-500/30 transition-all flex items-center justify-center gap-2 min-w-[140px]"
            >
              <Search size={20} />
              <span>Explore</span>
            </button>
            
          </div>
        </div>

        {/* Popular Tags */}
        <div className="mt-8 text-sm text-graytext">
          <span className="font-semibold text-dark">Popular:</span> Hotel, Business, Wedding, Office, Healthcare, Lifestyle
        </div>
      </div>
    </section>
  );
};

export default Hero;