
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold text-dark dark:text-white mb-4">Get in Touch</h1>
        <p className="text-graytext dark:text-gray-300 text-lg max-w-2xl mx-auto">
          Have questions about our directory? Want to feature your business? 
          We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Info Side */}
        <div className="space-y-8">
          <div className="glass-card p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-dark dark:text-white mb-6">Contact Information</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-dark dark:text-white text-lg">Our Office</h4>
                  <p className="text-graytext dark:text-gray-400">123 Innovation Drive, Lekki Phase 1<br />Lagos, Nigeria</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-dark dark:text-white text-lg">Email Us</h4>
                  <p className="text-graytext dark:text-gray-400">support@vendorshub.ng</p>
                  <p className="text-graytext dark:text-gray-400">partnerships@vendorshub.ng</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-dark dark:text-white text-lg">Call Us</h4>
                  <p className="text-graytext dark:text-gray-400">+234 800 123 4567</p>
                  <p className="text-graytext dark:text-gray-400">Mon-Fri from 8am to 5pm</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 rounded-2xl bg-gradient-to-br from-dark to-gray-900 text-white border-none">
             <h3 className="text-xl font-bold mb-4">Frequently Asked Questions</h3>
             <p className="text-gray-400 mb-4">Find quick answers to common questions about listing your business or using our platform.</p>
             <button className="text-white font-bold underline hover:text-primary transition-colors">Visit Help Center &rarr;</button>
          </div>
        </div>

        {/* Form Side */}
        <div className="glass-card p-8 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3 mb-8">
             <MessageSquare className="text-primary" size={28} />
             <h3 className="text-2xl font-bold text-dark dark:text-white">Send a Message</h3>
          </div>

          {submitted ? (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-8 text-center animate-fade-in">
               <div className="w-16 h-16 bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300 rounded-full flex items-center justify-center mx-auto mb-4">
                 <CheckCircle size={32} />
               </div>
               <h4 className="text-xl font-bold text-dark dark:text-white mb-2">Message Sent!</h4>
               <p className="text-gray-600 dark:text-gray-400">Thank you for reaching out. We will get back to you within 24 hours.</p>
               <button 
                 onClick={() => setSubmitted(false)}
                 className="mt-6 text-primary font-bold hover:underline"
               >
                 Send another message
               </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-bold text-dark dark:text-white mb-2">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-0 focus:outline-none transition-colors text-dark dark:text-white placeholder-gray-400"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-dark dark:text-white mb-2">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-0 focus:outline-none transition-colors text-dark dark:text-white placeholder-gray-400"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-bold text-dark dark:text-white mb-2">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-0 focus:outline-none transition-colors text-dark dark:text-white placeholder-gray-400"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-bold text-dark dark:text-white mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-0 focus:outline-none transition-colors resize-none text-dark dark:text-white placeholder-gray-400"
                  placeholder="Tell us more details..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-red-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-1"
              >
                {isSubmitting ? (
                  <>Sending...</>
                ) : (
                  <>
                    <Send size={18} /> Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
