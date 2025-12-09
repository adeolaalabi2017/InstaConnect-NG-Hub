import React, { useEffect } from 'react';
import { Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AddEvent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
        if (!user) {
            navigate('/login');
        }
    }
  }, [user, isLoading, navigate]);

  if (isLoading) return <div className="py-20 text-center">Loading...</div>;
  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-dark mb-2">Host an Event</h1>
            <p className="text-graytext">Create a new event, workshop, or meetup.</p>
        </div>

        <div className="glass-card p-8 rounded-2xl shadow-xl">
            <form className="space-y-6">
                
                <div>
                    <label className="block text-sm font-medium text-dark mb-2">Event Title</label>
                    <input type="text" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-primary focus:ring-0 focus:outline-none transition-colors text-dark" placeholder="e.g. Summer Networking Party" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-dark mb-2">Date</label>
                        <input type="date" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-primary focus:ring-0 focus:outline-none transition-colors text-dark" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-dark mb-2">Time</label>
                        <input type="time" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-primary focus:ring-0 focus:outline-none transition-colors text-dark" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-dark mb-2">Location</label>
                    <input type="text" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-primary focus:ring-0 focus:outline-none transition-colors text-dark" placeholder="Venue Address or Online Link" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-dark mb-2">Category</label>
                        <select className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-primary focus:ring-0 focus:outline-none transition-colors text-dark">
                            <option>Tech</option>
                            <option>Food</option>
                            <option>Music</option>
                            <option>Business</option>
                            <option>Health</option>
                            <option>Arts</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-dark mb-2">Price</label>
                        <input type="text" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-primary focus:ring-0 focus:outline-none transition-colors text-dark" placeholder="e.g. Free or ₦5000" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-dark mb-2">Description</label>
                    <textarea rows={4} className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-primary focus:ring-0 focus:outline-none transition-colors text-dark" placeholder="Describe your event..."></textarea>
                </div>

                <div>
                    <label className="block text-sm font-medium text-dark mb-2">Event Image</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer bg-gray-50/50">
                        <div className="mx-auto w-12 h-12 text-gray-400 mb-2">
                            <Upload size={48} />
                        </div>
                        <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                        <input type="file" className="hidden" />
                    </div>
                </div>

                <div className="pt-4">
                    <button type="submit" className="w-full bg-primary hover:bg-red-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-500/30 transition-all text-lg">
                        Publish Event
                    </button>
                </div>

            </form>
        </div>
    </div>
  );
};

export default AddEvent;