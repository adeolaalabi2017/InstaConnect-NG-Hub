
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Bot, User, ChevronRight, MapPin } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { MOCK_BUSINESSES } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const AiConcierge: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', text: string }[]>([
        { role: 'assistant', text: "Hello! I'm your Vendors Hub AI Assistant. I can help you find the perfect business, hotel, or service in Nigeria. What are you looking for today?" }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim() || isTyping) return;

        const userText = inputValue;
        setMessages(prev => [...prev, { role: 'user', text: userText }]);
        setInputValue('');
        setIsTyping(true);

        try {
            const context = `You are a professional business concierge for Vendors Hub, Nigeria's premier business directory. 
            Here is our current listing data: ${JSON.stringify(MOCK_BUSINESSES.map(b => ({ name: b.name, category: b.category, location: b.location, rating: b.rating, price: b.priceRange })))}.
            Help the user find a business based on their request. If multiple match, give options. If none match, suggest the closest category. 
            Be friendly, helpful, and concise. Keep responses under 100 words.`;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: userText,
                config: { systemInstruction: context }
            });

            setMessages(prev => [...prev, { role: 'assistant', text: response.text || "I'm sorry, I couldn't process that. Please try again." }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', text: "I'm having trouble connecting to my brain right now. Please try again later!" }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[60]">
            {/* Pulsing Orb Toggle */}
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="w-16 h-16 bg-primary rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-all relative group overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/20 animate-ping rounded-full"></div>
                    <Sparkles size={28} className="group-hover:rotate-12 transition-transform" />
                </button>
            )}

            {/* Chat Interface */}
            {isOpen && (
                <div className="w-[380px] h-[550px] glass-card rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-scale-in border-white/50">
                    <div className="p-4 bg-primary text-white flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                                <Bot size={24} />
                            </div>
                            <div>
                                <h3 className="font-black text-sm uppercase tracking-widest">AI Concierge</h3>
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    <span className="text-[10px] opacity-80">Online & Ready</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 no-scrollbar bg-slate-50/50 dark:bg-slate-900/50">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm font-medium shadow-sm ${
                                    msg.role === 'user' 
                                    ? 'bg-primary text-white rounded-tr-none' 
                                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-700'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-700">
                                    <div className="flex gap-1">
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                        <div className="relative">
                            <input 
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Type your request..."
                                className="w-full pl-4 pr-12 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/20 dark:text-white text-sm"
                            />
                            <button 
                                type="submit"
                                disabled={!inputValue.trim()}
                                className="absolute right-2 top-1.5 p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-30"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                        <p className="text-[9px] text-slate-400 mt-2 text-center uppercase tracking-widest font-bold">Powered by Gemini 3 Flash</p>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AiConcierge;
