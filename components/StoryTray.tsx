
import React, { useState } from 'react';
import { MOCK_STORIES } from '../constants';
import { X, ChevronLeft, ChevronRight, Volume2, Info } from 'lucide-react';
import { Story } from '../types';

const StoryTray: React.FC = () => {
    const [activeStory, setActiveStory] = useState<Story | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const openStory = (story: Story, index: number) => {
        setActiveStory(story);
        setCurrentIndex(index);
    };

    const nextStory = () => {
        if (currentIndex < MOCK_STORIES.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setActiveStory(MOCK_STORIES[currentIndex + 1]);
        } else {
            setActiveStory(null);
        }
    };

    const prevStory = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setActiveStory(MOCK_STORIES[currentIndex - 1]);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 overflow-hidden">
            <div className="flex gap-5 overflow-x-auto no-scrollbar pb-4 pt-2">
                {MOCK_STORIES.map((story, i) => (
                    <button 
                        key={story.id} 
                        onClick={() => openStory(story, i)}
                        className="flex flex-col items-center gap-2 group shrink-0"
                    >
                        <div className="relative p-1 rounded-full bg-gradient-to-tr from-primary via-secondary to-purple-600 group-hover:rotate-12 transition-transform duration-500 shadow-lg">
                            <div className="p-0.5 bg-white dark:bg-slate-900 rounded-full">
                                <img src={story.businessLogo} className="w-16 h-16 rounded-full object-cover" alt={story.businessName} />
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                                <span className="text-[10px] font-black">+</span>
                            </div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tighter truncate w-20 text-center">
                            {story.businessName}
                        </span>
                    </button>
                ))}
            </div>

            {/* Story Viewer Modal */}
            {activeStory && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-fade-in">
                    <button onClick={() => setActiveStory(null)} className="absolute top-8 right-8 text-white/60 hover:text-white z-10">
                        <X size={32} />
                    </button>

                    <div className="relative w-full max-w-[450px] aspect-[9/16] rounded-[2rem] overflow-hidden shadow-2xl bg-slate-900">
                        {/* Progress Bar */}
                        <div className="absolute top-4 left-4 right-4 flex gap-1 z-20">
                            {MOCK_STORIES.map((_, i) => (
                                <div key={i} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                                    <div className={`h-full bg-white transition-all duration-[5000ms] ease-linear ${i < currentIndex ? 'w-full' : i === currentIndex ? 'w-full' : 'w-0'}`}></div>
                                </div>
                            ))}
                        </div>

                        {/* Story Header */}
                        <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-20">
                            <div className="flex items-center gap-3">
                                <img src={activeStory.businessLogo} className="w-10 h-10 rounded-full border border-white/20" alt="" />
                                <div>
                                    <h4 className="text-white font-black text-sm shadow-sm">{activeStory.businessName}</h4>
                                    <span className="text-white/60 text-xs font-bold">{activeStory.timestamp}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 bg-white/10 rounded-full text-white backdrop-blur-md"><Volume2 size={18}/></button>
                                <button className="p-2 bg-white/10 rounded-full text-white backdrop-blur-md"><Info size={18}/></button>
                            </div>
                        </div>

                        <img src={activeStory.image} className="w-full h-full object-cover" alt="" />

                        {/* Caption Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                            <p className="text-white text-lg font-bold leading-tight mb-6">
                                {activeStory.caption}
                            </p>
                            <button className="w-full bg-white text-dark font-black py-4 rounded-2xl uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-all">
                                View Full Profile
                            </button>
                        </div>

                        {/* Navigation Areas */}
                        <div className="absolute inset-y-0 left-0 w-1/4 z-10 cursor-pointer" onClick={prevStory}></div>
                        <div className="absolute inset-y-0 right-0 w-3/4 z-10 cursor-pointer" onClick={nextStory}></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StoryTray;
