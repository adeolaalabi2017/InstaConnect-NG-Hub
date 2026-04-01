
import React, { useEffect, useState } from 'react';
import { Upload, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AddEvent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isLoading) {
        if (!user) {
            navigate('/login');
        }
    }
  }, [user, isLoading, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
          navigate('/events');
      }, 2000);
    }, 1500);
  };

  if (isLoading) return <div className="py-20 text-center dark:text-white">Loading...</div>;
  if (!user) return null;

  if (submitted) {
      return (
          <div className="max-w-3xl mx-auto px-4 py-20 text-center animate-fade-in">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={40} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Event Published!</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8">Your event has been successfully created and is now live.</p>
              <p className="text-sm text-slate-400">Redirecting to events page...</p>
          </div>
      );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-fade-in">
        <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-dark dark:text-white mb-2">Host an Event</h1>
            <p className="text-graytext dark:text-gray-400">Create a new event, workshop, or meetup.</p>
        </div>

        <div className="glass-card p-8 rounded-2xl shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
                
                <div>
                    <label className="block text-sm font-medium text-dark dark:text-white mb-2">Event Title</label>
                    <input required type="text" className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-0 focus:outline-none transition-colors text-dark dark:text-white placeholder-gray-400" placeholder="e.g. Summer Networking Party" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-dark dark:text-white mb-2">Date</label>
                        <input required type="date" className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-0 focus:outline-none transition-colors text-dark dark:text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-dark dark:text-white mb-2">Time</label>
                        <input required type="time" className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-0 focus:outline-none transition-colors text-dark dark:text-white" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-dark dark:text-white mb-2">Location</label>
                    <input required type="text" className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-0 focus:outline-none transition-colors text-dark dark:text-white placeholder-gray-400" placeholder="Venue Address or Online Link" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-dark dark:text-white mb-2">Category</label>
                        <select className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-0 focus:outline-none transition-colors text-dark dark:text-white">
                            <option>Tech</option>
                            <option>Food</option>
                            <option>Music</option>
                            <option>Business</option>
                            <option>Health</option>
                            <option>Arts</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-dark dark:text-white mb-2">Price</label>
                        <input required type="text" className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-0 focus:outline-none transition-colors text-dark dark:text-white placeholder-gray-400" placeholder="e.g. Free or ₦5000" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-dark dark:text-white mb-2">Description</label>
                    <textarea required rows={4} className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-0 focus:outline-none transition-colors text-dark dark:text-white placeholder-gray-400" placeholder="Describe your event..."></textarea>
                </div>

                <div>
                    <label className="block text-sm font-medium text-dark dark:text-white mb-2">Event Image</label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center hover:border-primary dark:hover:border-primary transition-colors cursor-pointer bg-gray-50/50 dark:bg-slate-800/50">
                        <div className="mx-auto w-12 h-12 text-gray-400 mb-2">
                            <Upload size={48} />
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                        <input type="file" className="hidden" />
                    </div>
                </div>

                <div className="pt-4">
                    <button disabled={isSubmitting} type="submit" className="w-full bg-primary hover:bg-red-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-500/30 transition-all text-lg disabled:opacity-50">
                        {isSubmitting ? 'Publishing...' : 'Publish Event'}
                    </button>
                </div>

            </form>
        </div>
    </div>
  );
};

export default AddEvent;
