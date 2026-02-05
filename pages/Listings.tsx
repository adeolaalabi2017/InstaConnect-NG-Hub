
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import BusinessCard from '../components/BusinessCard';
import { MOCK_BUSINESSES, CATEGORIES, NIGERIAN_LOCATIONS } from '../constants';
import { Search, Filter, MapPin, ArrowUpDown, Clock, Zap, X } from 'lucide-react';

const Listings: React.FC = () => {
  const [searchParams] = useSearchParams();
  
  // State initialization from URL params or defaults
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [locationFilter, setLocationFilter] = useState(searchParams.get('location') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'Recommended');
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  
  const locationWrapperRef = useRef<HTMLDivElement>(null);

  // Update state when URL params change (e.g. navigation from Hero)
  useEffect(() => {
    const q = searchParams.get('q');
    const cat = searchParams.get('category');
    const loc = searchParams.get('location');
    const sort = searchParams.get('sort');

    if (q) setSearchTerm(q);
    if (cat) setSelectedCategory(cat);
    if (loc) setLocationFilter(loc);
    if (sort) setSortBy(sort);
  }, [searchParams]);

  // Click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (locationWrapperRef.current && !locationWrapperRef.current.contains(event.target as Node)) {
        setShowLocationSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [locationWrapperRef]);

  // Filtering Logic
  const filteredBusinesses = MOCK_BUSINESSES.filter(business => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = business.name.toLowerCase().includes(term) || 
                          business.description.toLowerCase().includes(term) ||
                          business.tags.some(tag => tag.toLowerCase().includes(term));
                          
    const matchesCategory = selectedCategory === 'All' || business.category === selectedCategory;
    const matchesLocation = locationFilter === '' || business.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesOpen = showOpenOnly ? business.isOpen : true;
    
    return matchesSearch && matchesCategory && matchesLocation && matchesOpen;
  }).sort((a, b) => {
    if (sortBy === 'Highest Rated') {
      return b.rating - a.rating;
    } else if (sortBy === 'Most Reviewed') {
      return b.reviewCount - a.reviewCount;
    }
    return 0; // Recommended (original order)
  });

  const promotedBusinesses = MOCK_BUSINESSES.filter(b => b.isPromoted);

  const locationSuggestions = NIGERIAN_LOCATIONS.filter(loc => 
    loc.toLowerCase().includes(locationFilter.toLowerCase())
  );

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setLocationFilter('');
    setSortBy('Recommended');
    setShowOpenOnly(false);
  };

  const hasActiveFilters = searchTerm !== '' || selectedCategory !== 'All' || locationFilter !== '' || sortBy !== 'Recommended' || showOpenOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Sponsored Section */}
      {promotedBusinesses.length > 0 && (
          <div className="mb-12 bg-gradient-to-r from-yellow-50/60 to-transparent dark:from-yellow-900/20 p-6 rounded-3xl border border-yellow-100/50 dark:border-yellow-900/20 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-100/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
             
             <div className="flex items-center gap-2 mb-6 relative z-10">
                 <div className="bg-yellow-400 rounded-full p-1.5 text-white shadow-sm">
                     <Zap size={16} fill="currentColor" />
                 </div>
                 <h2 className="text-xl font-bold text-dark dark:text-white">Sponsored Businesses</h2>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                 {promotedBusinesses.map((business) => (
                     <BusinessCard key={business.id} business={business} />
                 ))}
             </div>
          </div>
      )}

      {/* Header & Filters */}
      <div className="flex flex-col gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark dark:text-white mb-2">All Listings</h1>
          <p className="text-graytext dark:text-gray-400">Browse all available businesses in our directory.</p>
        </div>
        
        {/* Filter Bar */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col xl:flex-row gap-4 items-center transition-all">
            
             {/* Search */}
            <div className="relative flex-grow w-full xl:w-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                </div>
                <label htmlFor="listing-search" className="sr-only">Search listings</label>
                <input 
                    id="listing-search"
                    type="text" 
                    placeholder="Search by name, keyword or tag..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-primary w-full transition-all text-dark dark:text-white placeholder-gray-400" 
                />
            </div>

            <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto items-center">
                {/* Location Filter with Suggestions */}
                <div ref={locationWrapperRef} className="relative w-full md:w-48 lg:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin size={18} className="text-gray-400" />
                    </div>
                    <label htmlFor="listing-location" className="sr-only">Filter by location</label>
                    <input 
                        id="listing-location"
                        type="text" 
                        placeholder="Location..." 
                        value={locationFilter}
                        onChange={(e) => {
                            setLocationFilter(e.target.value);
                            setShowLocationSuggestions(true);
                        }}
                        onFocus={() => setShowLocationSuggestions(true)}
                        className="pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-primary w-full transition-all text-dark dark:text-white placeholder-gray-400" 
                    />
                    
                    {/* Suggestions Dropdown */}
                    {showLocationSuggestions && (
                        <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 max-h-60 overflow-y-auto z-50 animate-fade-in-up">
                            {locationSuggestions.length > 0 ? (
                                locationSuggestions.map((loc, index) => (
                                    <div 
                                        key={index}
                                        onClick={() => {
                                            setLocationFilter(loc);
                                            setShowLocationSuggestions(false);
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

                {/* Category Filter */}
                <div className="relative w-full md:w-48">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Filter size={18} className="text-gray-400" />
                    </div>
                    <label htmlFor="listing-category" className="sr-only">Filter by category</label>
                    <select 
                        id="listing-category"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="pl-10 pr-8 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-primary appearance-none w-full cursor-pointer text-dark dark:text-white font-medium"
                    >
                        <option value="All">All Categories</option>
                        {CATEGORIES.map(cat => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                {/* Sort Filter */}
                <div className="relative w-full md:w-48">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <ArrowUpDown size={18} className="text-gray-400" />
                    </div>
                    <label htmlFor="listing-sort" className="sr-only">Sort listings</label>
                    <select 
                        id="listing-sort"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="pl-10 pr-8 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-primary appearance-none w-full cursor-pointer text-dark dark:text-white font-medium"
                    >
                        <option value="Recommended">Recommended</option>
                        <option value="Highest Rated">Highest Rated</option>
                        <option value="Most Reviewed">Most Reviewed</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                {/* Open Now Checkbox */}
                <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-gray-700 whitespace-nowrap h-full">
                    <input 
                        id="listing-open"
                        type="checkbox"
                        checked={showOpenOnly}
                        onChange={(e) => setShowOpenOnly(e.target.checked)}
                        className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary cursor-pointer accent-primary ml-1"
                    />
                    <label htmlFor="listing-open" className="text-sm font-medium text-dark dark:text-white cursor-pointer select-none flex items-center gap-1.5">
                        <Clock size={16} className={showOpenOnly ? "text-primary" : "text-gray-400"} />
                        Open Now
                    </label>
                </div>

                {/* Clear All Filters */}
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-1 text-sm font-semibold text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 whitespace-nowrap px-2 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors animate-fade-in"
                    >
                        <X size={16} />
                        Clear All
                    </button>
                )}
            </div>

        </div>
      </div>

      {/* Grid */}
      {filteredBusinesses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBusinesses.map((business) => (
            <BusinessCard key={business.id} business={business} />
            ))}
        </div>
      ) : (
          <div className="text-center py-20 bg-gray-50 dark:bg-slate-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 text-lg">No listings found matching your criteria.</p>
              <button 
                onClick={clearFilters}
                className="mt-4 text-primary font-medium hover:underline"
              >
                  Clear all filters
              </button>
          </div>
      )}
    </div>
  );
};

export default Listings;
