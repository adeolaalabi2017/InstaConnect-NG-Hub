
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Grid, List, Clock, Search, Plus, Users, LayoutGrid } from 'lucide-react';
import { MOCK_EVENTS } from '../constants';
import { useAuth } from '../context/AuthContext';

const Events: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'calendar'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  const filteredEvents = MOCK_EVENTS.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const CalendarView = () => {
    // Simplified Calendar View for demo
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return (
        <div className="glass-card p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-dark dark:text-white">November 2024</h2>
                <div className="text-sm text-gray-400">Mock Calendar View</div>
            </div>
            <div className="grid grid-cols-7 gap-4 text-center mb-4">
                {days.map(day => <div key={day} className="font-bold text-gray-400 text-sm uppercase">{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-4">
                {/* Empty slots for days before 1st */}
                {[...Array(5)].map((_, i) => <div key={`empty-${i}`} className="h-24 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl"></div>)}
                
                {/* Days 1-30 */}
                {[...Array(30)].map((_, i) => {
                    const day = i + 1;
                    const dateStr = `2024-11-${day.toString().padStart(2, '0')}`;
                    const daysEvents = filteredEvents.filter(e => e.date === dateStr);
                    
                    return (
                        <div key={day} className={`h-24 p-2 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col items-start justify-between hover:border-primary/30 transition-colors ${daysEvents.length > 0 ? 'bg-white dark:bg-gray-800 shadow-sm' : 'bg-white/50 dark:bg-gray-800/30'}`}>
                            <span className={`text-sm font-semibold ${daysEvents.length > 0 ? 'text-primary' : 'text-gray-400'}`}>{day}</span>
                            <div className="w-full space-y-1">
                                {daysEvents.map(event => (
                                    <Link to={`/event/${event.id}`} key={event.id} className="block w-full">
                                        <div className="text-[10px] bg-primary/10 text-primary px-1 py-0.5 rounded truncate font-medium">
                                            {event.time.split(' ')[0]} {event.title}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
  };

  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredEvents.map(event => (
        <Link key={event.id} to={`/event/${event.id}`} className="group glass-card rounded-2xl overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
          <div className="relative h-48">
            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
            <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold text-dark dark:text-white shadow-sm">
              {event.category}
            </div>
            <div className="absolute bottom-4 left-4 bg-primary text-white px-3 py-1 rounded-lg text-xs font-bold shadow-sm">
                {event.price}
            </div>
          </div>
          <div className="p-5">
            <div className="flex text-xs font-bold text-primary mb-2 uppercase tracking-wide">
               {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} • {event.time}
            </div>
            <h3 className="text-lg font-bold text-dark dark:text-white mb-2 group-hover:text-primary transition-colors line-clamp-1">{event.title}</h3>
            <div className="flex items-center text-graytext dark:text-gray-400 text-sm mb-4">
              <MapPin size={14} className="mr-1 text-gray-400" />
              <span className="truncate">{event.location}</span>
            </div>
            <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-3">
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 font-medium">
                    <Users size={14} className="mr-1" /> {event.attendees} going
                </div>
                <span className="text-sm font-bold text-dark dark:text-white group-hover:text-primary">View Details &rarr;</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );

  const ListView = () => (
    <div className="space-y-4">
      {filteredEvents.map(event => (
        <Link key={event.id} to={`/event/${event.id}`} className="glass-card p-4 rounded-2xl flex flex-col md:flex-row gap-6 hover:shadow-lg transition-all group items-center">
           <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
             <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
           </div>
           <div className="flex-grow">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                 <div>
                    <div className="text-xs font-bold text-primary mb-1 uppercase tracking-wide">
                        {new Date(event.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long' })}
                    </div>
                    <h3 className="text-xl font-bold text-dark dark:text-white mb-2 group-hover:text-primary transition-colors">{event.title}</h3>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-graytext dark:text-gray-400">
                        <div className="flex items-center gap-1"><Clock size={14} /> {event.time}</div>
                        <div className="flex items-center gap-1"><MapPin size={14} /> {event.location}</div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">{event.description}</p>
                 </div>
                 <div className="flex flex-row md:flex-col items-center md:items-end gap-2 mt-2 md:mt-0">
                    <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">{event.category}</span>
                    <span className="font-bold text-dark dark:text-white">{event.price}</span>
                 </div>
              </div>
           </div>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
         <div>
            <h1 className="text-3xl font-bold text-dark dark:text-white mb-2">Discover Events</h1>
            <p className="text-graytext dark:text-gray-400">Upcoming workshops, parties, and networking events.</p>
         </div>
         <Link to="/add-event" className="bg-primary hover:bg-red-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-red-500/30 flex items-center gap-2 transition-colors">
             <Plus size={18} /> Host Event
         </Link>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
              </div>
              <input 
                  type="text"
                  placeholder="Search events by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-primary w-full transition-all text-dark dark:text-white placeholder-gray-400" 
              />
          </div>

          <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-800 p-1 rounded-xl border border-gray-100 dark:border-gray-700">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow text-primary' : 'text-gray-400 hover:text-dark dark:hover:text-white'}`}
                title="Grid View"
              >
                  <Grid size={20} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow text-primary' : 'text-gray-400 hover:text-dark dark:hover:text-white'}`}
                title="List View"
              >
                  <List size={20} />
              </button>
              <button 
                onClick={() => setViewMode('calendar')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'calendar' ? 'bg-white dark:bg-gray-700 shadow text-primary' : 'text-gray-400 hover:text-dark dark:hover:text-white'}`}
                title="Calendar View"
              >
                  <Calendar size={20} />
              </button>
          </div>
      </div>

      {/* Content */}
      {viewMode === 'grid' && <GridView />}
      {viewMode === 'list' && <ListView />}
      {viewMode === 'calendar' && <CalendarView />}

      {filteredEvents.length === 0 && (
          <div className="text-center py-20 bg-gray-50 dark:bg-slate-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400">No events found matching your search.</p>
          </div>
      )}
    </div>
  );
};

export default Events;
