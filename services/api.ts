import { MOCK_BUSINESSES, MOCK_REVIEWS, MOCK_EVENTS, MOCK_EVENT_COMMENTS, MOCK_USERS_LIST, MOCK_COMMUNITY_THREADS, MOCK_CAMPAIGNS, MOCK_ADS } from '../constants';
import { Business, Review, Event, MarketingCampaign, AdPlacement } from '../types';
import { analyticsService } from './analytics';

export const fetchMarketingCampaigns = async (): Promise<MarketingCampaign[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_CAMPAIGNS);
    }, 600);
  });
};

export const fetchAds = async (): Promise<AdPlacement[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_ADS);
    }, 600);
  });
};

export const fetchBusinesses = async (): Promise<Business[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_BUSINESSES);
    }, 800); // Simulate network latency
  });
};

export const fetchEvents = async (): Promise<Event[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_EVENTS);
    }, 800);
  });
};

export const fetchEventById = async (id: string): Promise<Event | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_EVENTS.find(e => e.id === id));
    }, 600);
  });
};

export const fetchEventComments = async (eventId: string): Promise<any[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_EVENT_COMMENTS.filter(c => c.eventId === eventId));
    }, 500);
  });
};

export const fetchLeaderboardUsers = async (): Promise<any[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_USERS_LIST);
    }, 700);
  });
};

export const fetchCommunityThreads = async (): Promise<any[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_COMMUNITY_THREADS);
    }, 600);
  });
};

export const fetchCommunityThreadById = async (id: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const thread = MOCK_COMMUNITY_THREADS.find(t => t.id === id);
      if (thread) {
        resolve(thread);
      } else {
        reject(new Error("Thread not found"));
      }
    }, 600);
  });
};

export const fetchBusinessById = async (id: string): Promise<Business | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_BUSINESSES.find(b => b.id === id));
    }, 600); // Simulate network latency
  });
};

export const fetchBusinessByOwnerId = async (ownerId: string): Promise<Business | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_BUSINESSES.find(b => b.ownerId === ownerId));
    }, 600);
  });
};

export const fetchAdminOverview = async (userRole: string) => {
  return new Promise<any>((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(analyticsService.getAdminOverview(userRole));
      } catch (e) {
        reject(e);
      }
    }, 800);
  });
};

export const fetchAdminTimeSeries = async (userRole: string) => {
  return new Promise<any[]>((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(analyticsService.getNewUsersTimeSeries(userRole));
      } catch (e) {
        reject(e);
      }
    }, 800);
  });
};

export const fetchAdminCategories = async (userRole: string) => {
  return new Promise<any[]>((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(analyticsService.getBusinessCategoryDistribution(userRole));
      } catch (e) {
        reject(e);
      }
    }, 800);
  });
};

export const fetchReviewsByBusinessId = async (businessId: string): Promise<Review[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_REVIEWS.filter(r => r.businessId === businessId));
    }, 500);
  });
};

export const fetchPages = async (): Promise<any[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, title: 'Home', slug: '/', status: 'published', lastUpdated: '2 days ago' },
        { id: 2, title: 'About Us', slug: '/about', status: 'published', lastUpdated: '1 month ago' },
        { id: 3, title: 'Contact', slug: '/contact', status: 'published', lastUpdated: '1 week ago' },
        { id: 4, title: 'Terms of Service', slug: '/terms', status: 'draft', lastUpdated: 'Just now' },
      ]);
    }, 600);
  });
};

export const fetchBlogPosts = async (): Promise<any[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, title: 'Top 10 Restaurants in Lagos', category: 'Food', author: 'Editor', status: 'published', date: '2023-10-24' },
        { id: 2, title: 'How to Grow Your Business', category: 'Business', author: 'Admin', status: 'published', date: '2023-10-15' },
        { id: 3, title: 'Weekend Getaways in Abuja', category: 'Travel', author: 'Editor', status: 'draft', date: '2023-11-01' },
      ]);
    }, 600);
  });
};

export const fetchFAQs = async (): Promise<any[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, question: 'How do I list my business?', category: 'General' },
        { id: 2, question: 'What payment methods are accepted?', category: 'Billing' },
        { id: 3, question: 'Can I edit my review?', category: 'Account' },
      ]);
    }, 600);
  });
};

export const fetchTestimonials = async (): Promise<any[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: 'Chinedu O.', role: 'Business Owner', text: 'InstaConnect helped me double my customers!', rating: 5, status: 'approved' },
        { id: 2, name: 'Sarah J.', role: 'User', text: 'Best directory for finding local gems.', rating: 5, status: 'pending' },
        { id: 3, name: 'Anonymous', role: 'User', text: 'Okay service but could be faster.', rating: 3, status: 'rejected' },
      ]);
    }, 600);
  });
};

export const fetchSubscribers = async (): Promise<any[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, email: 'john.doe@example.com', joined: '2023-09-12', status: 'active' },
        { id: 2, email: 'jane.smith@test.com', joined: '2023-10-05', status: 'active' },
        { id: 3, email: 'spam@bot.net', joined: '2023-11-01', status: 'unsubscribed' },
      ]);
    }, 600);
  });
};
