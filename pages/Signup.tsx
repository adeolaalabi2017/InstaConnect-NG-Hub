
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, AlertCircle, ShoppingBag, Store } from 'lucide-react';
import { Player } from '@lottiefiles/react-lottie-player';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'consumer' | 'vendor'>('consumer');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      await register(name, email, password, role);
      navigate('/');
    } catch (e) {
      setError('Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      
      {/* Subtle Background Animation */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[900px] md:h-[900px] opacity-[0.03] dark:opacity-[0.05] pointer-events-none z-0">
          <Player
            autoplay
            loop
            src="https://assets8.lottiefiles.com/packages/lf20_47pyyfcf.json"
            style={{ height: '100%', width: '100%' }}
          />
      </div>

      <div className="glass-card w-full max-w-md p-8 rounded-2xl shadow-xl animate-fade-in-up relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-dark dark:text-white">Create Account</h2>
          <p className="text-graytext dark:text-gray-400 mt-2">Join our community today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 text-sm p-3 rounded-lg flex items-center justify-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div 
              onClick={() => setRole('consumer')}
              className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center justify-center transition-all ${role === 'consumer' ? 'border-primary bg-primary/5 dark:bg-primary/20 text-primary' : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
              <ShoppingBag size={24} className="mb-2" />
              <span className="text-sm font-semibold">Consumer</span>
            </div>
            <div 
              onClick={() => setRole('vendor')}
              className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center justify-center transition-all ${role === 'vendor' ? 'border-primary bg-primary/5 dark:bg-primary/20 text-primary' : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
              <Store size={24} className="mb-2" />
              <span className="text-sm font-semibold">Business</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark dark:text-white mb-2">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-gray-400" />
              </div>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-0 focus:outline-none transition-colors text-dark dark:text-white placeholder-gray-400"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark dark:text-white mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-400" />
              </div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-0 focus:outline-none transition-colors text-dark dark:text-white placeholder-gray-400"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark dark:text-white mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-0 focus:outline-none transition-colors text-dark dark:text-white placeholder-gray-400"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark dark:text-white mb-2">Confirm Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-0 focus:outline-none transition-colors text-dark dark:text-white placeholder-gray-400"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-red-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-red-500/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-graytext dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
