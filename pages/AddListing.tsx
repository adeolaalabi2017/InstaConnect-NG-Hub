
import React, { useEffect, useState } from 'react';
import { Upload, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AddListing: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
        navigate('/login');
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
          navigate('/dashboard');
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
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Listing Submitted!</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8">Your business listing has been submitted for review. You will be notified once it's approved.</p>
              <p className="text-sm text-slate-400">Redirecting to dashboard...</p>
          </div>
      );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-fade-in">
        <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-dark dark:text-white mb-2">Add New Listing</h1>
            <p className="text-graytext dark:text-gray-400">Fill in the details below to list your business.</p>
        </div>

        <div className="glass-card p-8 rounded-2xl shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-dark dark:text-white mb-2">Business Name</label>
                        <input required type="text" className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-0 focus:outline-none transition-colors text-dark dark:text-white placeholder-gray-400" placeholder="e.g. Divine Hotels" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-dark dark:text-white mb-2">Category</label>
                        <select className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-0 focus:outline-none transition-colors text-dark dark:text-white">
                            <option>Hotels</option>
                            <option>Food</option>
                            <option>Shopping</option>
                            <option>Fitness</option>
                            <option>Events</option>
                            <option>Health</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-dark dark:text-white mb-2">Description</label>
                    <textarea required rows={4} className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-0 focus:outline-none transition-colors text-dark dark:text-white placeholder-gray-400" placeholder="Tell us about your business..."></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-dark dark:text-white mb-2">Email Address</label>
                        <input required type="email" className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-0 focus:outline-none transition-colors text-dark dark:text-white placeholder-gray-400" placeholder="email@example.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-dark dark:text-white mb-2">Phone Number</label>
                        <input required type="tel" className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-0 focus:outline-none transition-colors text-dark dark:text-white placeholder-gray-400" placeholder="+234 800 000 0000" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-dark dark:text-white mb-2">Instagram Handle <span className="text-gray-400 font-normal text-xs ml-1">(Optional)</span></label>
                        <div className="relative">
                            <span className="absolute left-4 top-3.5 text-gray-400">@</span>
                            <input type="text" className="w-full pl-8 pr-4 py-3 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-0 focus:outline-none transition-colors text-dark dark:text-white placeholder-gray-400" placeholder="business_handle" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-dark dark:text-white mb-2">WhatsApp Number <span className="text-gray-400 font-normal text-xs ml-1">(Optional)</span></label>
                        <input type="tel" className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-0 focus:outline-none transition-colors text-dark dark:text-white placeholder-gray-400" placeholder="+234 800 000 0000" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-dark dark:text-white mb-2">Address</label>
                    <input required type="text" className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-0 focus:outline-none transition-colors text-dark dark:text-white placeholder-gray-400" placeholder="Street Address, City, State" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-dark dark:text-white mb-2">Business Logo</label>
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-4 text-center hover:border-primary dark:hover:border-primary transition-colors cursor-pointer bg-gray-50/50 dark:bg-slate-800/50 aspect-square flex flex-col items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-2">
                                <Upload size={20} className="text-gray-400" />
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Upload Logo</p>
                            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">Square format</p>
                            <input type="file" className="hidden" accept="image/*" />
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-dark dark:text-white mb-2">Cover Image</label>
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center hover:border-primary dark:hover:border-primary transition-colors cursor-pointer bg-gray-50/50 dark:bg-slate-800/50 h-full flex flex-col items-center justify-center min-h-[160px]">
                            <div className="mx-auto w-12 h-12 text-gray-400 mb-2">
                                <Upload size={48} />
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Click to upload cover image (16:9)</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                            <input type="file" className="hidden" accept="image/*" />
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <button disabled={isSubmitting} type="submit" className="w-full bg-primary hover:bg-red-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-500/30 transition-all text-lg disabled:opacity-50">
                        {isSubmitting ? 'Submitting...' : 'Submit Listing'}
                    </button>
                </div>

            </form>
        </div>
    </div>
  );
};

export default AddListing;
