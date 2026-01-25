
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_EVENTS, MOCK_EVENT_COMMENTS } from '../constants';
import { Calendar, Clock, MapPin, Share2, Users, MessageSquare, CheckCircle, Send, Flag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [isAttending, setIsAttending] = useState(false);
  const [comments, setComments] = useState(MOCK_EVENT_COMMENTS.filter(c => c.eventId === id));
  const [newComment, setNewComment] = useState('');

  const event = MOCK_EVENTS.find(e => e.id === id);

  if (!event) {
    return <div className="text-center py-20">Event not found</div>;
  }

  const handleRSVP = () => {
      if (!user) {
          alert("Please login to RSVP");
          return;
      }
      setIsAttending(!isAttending);
  };

  const handlePostComment = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newComment.trim() || !user) return;

      const comment = {
          id: Math.random().toString(),
          eventId: event.id,
          userName: user.name,
          userImage: user.image,
          content: newComment,
          timestamp: 'Just now',
          status: 'active' as const
      };

      setComments([comment, ...comments]);
      setNewComment('');
  };

  const handleReportComment = (commentId: string) => {
      if (window.confirm("Are you sure you want to report this comment as abusive?")) {
          setComments(comments.map(c => 
              c.id === commentId ? { ...c, status: 'flagged' } : c
          ));
          alert("Comment has been flagged for moderation.");
      }
  };

  return (
    <div className="pb-20">
       {/* Hero Image */}
       <div className="relative h-64 md:h-96 w-full">
           <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
           <div className="absolute bottom-0 left-0 w-full p-4 sm:p-8">
               <div className="max-w-7xl mx-auto">
                   <div className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-lg inline-block mb-3">
                       {event.category}
                   </div>
                   <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{event.title}</h1>
                   <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm font-medium">
                       <span className="flex items-center gap-1"><Calendar size={16} /> {new Date(event.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                       <span className="flex items-center gap-1"><Clock size={16} /> {event.time}</span>
                   </div>
               </div>
           </div>
       </div>

       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* Left Column */}
           <div className="lg:col-span-2 space-y-8">
               
               {/* Actions Bar (Mobile friendly) */}
               <div className="glass-card p-4 rounded-xl flex items-center justify-between gap-4">
                   <div className="flex items-center gap-2 text-sm font-bold text-graytext">
                       <div className="bg-gray-100 p-2 rounded-full"><Users size={18} /></div>
                       <span>{event.attendees + (isAttending ? 1 : 0)} Attending</span>
                   </div>
                   <div className="flex gap-2">
                       <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                           <Share2 size={20} className="text-gray-500" />
                       </button>
                       <button 
                           onClick={handleRSVP}
                           className={`px-6 py-2 rounded-lg font-bold transition-all shadow-lg ${isAttending ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-primary text-white hover:bg-red-600 shadow-red-500/30'}`}
                       >
                           {isAttending ? 'You are going!' : 'RSVP Now'}
                       </button>
                   </div>
               </div>

               {/* Description */}
               <div className="glass-card p-6 rounded-2xl">
                   <h3 className="text-xl font-bold text-dark mb-4">Event Details</h3>
                   <p className="text-graytext leading-relaxed whitespace-pre-line">
                       {event.description}
                   </p>
                   
                   <div className="mt-6">
                       <h4 className="font-semibold text-dark mb-3">Tags</h4>
                       <div className="flex gap-2">
                           {event.tags.map((tag, i) => (
                               <span key={i} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">#{tag}</span>
                           ))}
                       </div>
                   </div>
               </div>

               {/* Discussion Board */}
               <div className="glass-card p-6 rounded-2xl">
                   <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                       <MessageSquare className="text-primary" size={24} />
                       <h3 className="text-xl font-bold text-dark">Discussion Board</h3>
                   </div>

                   {/* Comments List */}
                   <div className="space-y-6 mb-8">
                       {comments.map(comment => (
                           <div key={comment.id} className="flex gap-4">
                               <img src={comment.userImage} alt={comment.userName} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                               <div className={`rounded-2xl rounded-tl-none p-4 flex-grow transition-colors ${comment.status === 'flagged' ? 'bg-red-50 border border-red-100' : 'bg-gray-50'}`}>
                                   <div className="flex justify-between items-center mb-1">
                                       <h5 className="font-bold text-dark text-sm">{comment.userName}</h5>
                                       <div className="flex items-center gap-2">
                                           <span className="text-xs text-gray-400">{comment.timestamp}</span>
                                           {comment.status !== 'flagged' ? (
                                               <button 
                                                   onClick={() => handleReportComment(comment.id)}
                                                   className="text-gray-300 hover:text-red-500 transition-colors p-1"
                                                   title="Report Abuse"
                                               >
                                                   <Flag size={12} />
                                               </button>
                                           ) : (
                                               <span className="text-[10px] text-red-500 font-bold border border-red-200 bg-white px-2 py-0.5 rounded-full">Reported</span>
                                           )}
                                       </div>
                                   </div>
                                   <p className={`text-sm ${comment.status === 'flagged' ? 'text-gray-400 italic' : 'text-graytext'}`}>
                                       {comment.status === 'flagged' ? 'This comment has been flagged for moderation.' : comment.content}
                                   </p>
                               </div>
                           </div>
                       ))}
                   </div>

                   {/* Post Comment */}
                   {user ? (
                       <form onSubmit={handlePostComment} className="flex gap-3 items-start">
                           <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                           <div className="flex-grow relative">
                               <textarea 
                                   value={newComment}
                                   onChange={(e) => setNewComment(e.target.value)}
                                   placeholder="Join the discussion..."
                                   rows={2}
                                   className="w-full bg-white border border-gray-200 rounded-xl p-3 pr-12 focus:outline-none focus:border-primary text-sm text-dark"
                               ></textarea>
                               <button 
                                   type="submit"
                                   disabled={!newComment.trim()}
                                   className="absolute bottom-3 right-3 text-primary hover:text-red-700 disabled:opacity-50"
                               >
                                   <Send size={18} />
                               </button>
                           </div>
                       </form>
                   ) : (
                       <div className="bg-gray-50 p-4 rounded-xl text-center">
                           <p className="text-sm text-gray-500 mb-2">Login to join the discussion</p>
                           <Link to="/login" className="text-primary font-bold text-sm hover:underline">Sign In</Link>
                       </div>
                   )}
               </div>

           </div>

           {/* Right Sidebar */}
           <div className="space-y-6">
               <div className="glass-card p-6 rounded-2xl sticky top-24">
                   <h3 className="font-bold text-dark mb-4">Location</h3>
                   <div className="flex items-start gap-3 mb-4 text-graytext">
                       <MapPin className="text-primary mt-1 flex-shrink-0" size={18} />
                       <span>{event.location}</span>
                   </div>
                   {/* Placeholder Map */}
                   <div className="w-full h-40 bg-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-sm font-medium">
                       Map View Unavailable
                   </div>

                   <div className="mt-6 pt-6 border-t border-gray-100">
                       <h3 className="font-bold text-dark mb-2">Organizer</h3>
                       <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                               {event.organizer.charAt(0)}
                           </div>
                           <div>
                               <p className="font-bold text-sm text-dark">{event.organizer}</p>
                               <Link to="#" className="text-xs text-primary hover:underline">View Profile</Link>
                           </div>
                       </div>
                   </div>
               </div>
           </div>

       </div>
    </div>
  );
};

export default EventDetail;
