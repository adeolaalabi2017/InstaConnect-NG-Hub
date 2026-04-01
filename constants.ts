
import { Business, Category, Review, User, Event, EventComment, Badge, Transaction, Promotion, MarketingCampaign, AdPlacement, Role, Permission, CommunityThread, Story } from './types';

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Hotels', icon: 'Hotel', count: 12 },
  { id: '2', name: 'Food', icon: 'Utensils', count: 57 },
  { id: '3', name: 'Shopping', icon: 'ShoppingBag', count: 34 },
  { id: '4', name: 'Fitness', icon: 'Dumbbell', count: 21 },
  { id: '5', name: 'Events', icon: 'Calendar', count: 8 },
  { id: '6', name: 'Health', icon: 'HeartPulse', count: 45 },
];

export const NIGERIAN_LOCATIONS = [
  "Lagos", "Abuja", "Port Harcourt", "Ibadan", "Kano", "Enugu", "Benin City", "Calabar", "Jos", 
  "Ilorin", "Kaduna", "Uyo", "Warri", "Abeokuta", "Akure", "Owerri", "Osogbo", "Minna", "Makurdi", 
  "Sokoto", "Onitsha", "Aba", "Bauchi", "Maiduguri", "Zaria", "Ikeja", "Lekki", "Victoria Island", "Asaba"
].sort();

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    'view_admin_dashboard',
    'manage_users', 
    'manage_listings', 
    'manage_content', 
    'manage_settings', 
    'manage_marketing',
    'manage_orders'
  ],
  editor: [
    'view_admin_dashboard',
    'manage_listings', 
    'manage_content', 
    'manage_marketing'
  ],
  vendor: [
    'create_review'
  ],
  consumer: [
    'create_review'
  ],
  viewer: [
    'create_review'
  ]
};

export const MOCK_BADGES: Badge[] = [
  { id: '1', name: 'Top Reviewer', icon: 'Star', color: 'bg-yellow-100 text-yellow-700', description: 'Posted 50+ helpful reviews' },
  { id: '2', name: 'Early Adopter', icon: 'Zap', color: 'bg-purple-100 text-purple-700', description: 'Joined in the first month' },
  { id: '3', name: 'Local Guide', icon: 'MapPin', color: 'bg-green-100 text-green-700', description: 'Expert on local gems' },
  { id: '4', name: 'Trendsetter', icon: 'TrendingUp', color: 'bg-blue-100 text-blue-700', description: 'First to review 10 new places' },
  { id: '5', name: 'Verified Reviewer', icon: 'BadgeCheck', color: 'bg-blue-100 text-blue-700', description: 'Identity verified' },
];

const daysAgo = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString();
};

export const MOCK_BUSINESSES: Business[] = [
  {
    id: '1',
    name: 'Divine Hotels',
    category: 'Hotels',
    location: 'Lekki Phase 1, Lagos',
    image: 'https://picsum.photos/id/1040/800/600',
    logo: 'https://ui-avatars.com/api/?name=Divine+Hotels&background=EE1C47&color=fff&size=128',
    rating: 4.8,
    reviewCount: 124,
    priceRange: '₦35,000/night',
    description: 'Luxury hotel in the heart of Lekki. Perfect for business travelers and tourists seeking comfort.',
    isOpen: true,
    tags: ['WiFi', 'Pool', 'Parking'],
    amenities: ['Pool', 'WiFi', 'Gym', 'Bar', 'Spa'],
    phone: '+234 801 234 5678',
    email: 'info@divinehotels.ng',
    instagramHandle: 'divinehotels_ng',
    whatsapp: '+2348012345678',
    viewCount: 1540,
    ownerId: '1',
    isPromoted: true,
    credits: 450,
    createdAt: daysAgo(120),
    lastActiveAt: daysAgo(2),
    verificationStatus: 'verified',
    verificationLevel: 'gold',
    status: 'active'
  },
  {
    id: '2',
    name: 'Mama Nkechi Kitchen',
    category: 'Food',
    location: 'Wuse 2, Abuja',
    image: 'https://picsum.photos/id/493/800/600',
    logo: 'https://ui-avatars.com/api/?name=Mama+Nkechi&background=FF823A&color=fff&size=128',
    rating: 4.5,
    reviewCount: 89,
    priceRange: '₦2,500/meal',
    description: 'Fresh local delicacies and healthy grains in a modern atmosphere.',
    isOpen: true,
    tags: ['Local Dishes', 'Delivery'],
    amenities: ['Delivery', 'AC', 'Parking'],
    phone: '+234 909 876 5432',
    email: 'contact@mamankechi.ng',
    instagramHandle: 'mamankechi_kitchen',
    whatsapp: '+2349098765432',
    viewCount: 2300,
    isPromoted: false,
    credits: 50,
    createdAt: daysAgo(200),
    lastActiveAt: daysAgo(5),
    verificationStatus: 'verified',
    verificationLevel: 'silver',
    status: 'active'
  },
  {
    id: '3',
    name: 'Eko Atlantic Resort',
    category: 'Hotels',
    location: 'Victoria Island, Lagos',
    image: 'https://picsum.photos/id/1039/800/600',
    logo: 'https://ui-avatars.com/api/?name=Eko+Atlantic&background=09153D&color=fff&size=128',
    rating: 4.9,
    reviewCount: 256,
    priceRange: '₦150,000/night',
    description: 'Luxury resort with ocean views and premium amenities.',
    isOpen: true,
    tags: ['Beachfront', 'Spa', 'Bar'],
    amenities: ['Beach Access', 'Spa', 'Private Butler', 'WiFi'],
    phone: '+234 802 345 6789',
    email: 'reservations@ekoatlantic.ng',
    instagramHandle: 'ekoatlantic_resort',
    whatsapp: '+2348023456789',
    viewCount: 1800,
    isPromoted: true,
    credits: 1200,
    createdAt: daysAgo(300),
    lastActiveAt: daysAgo(1),
    verificationStatus: 'verified',
    verificationLevel: 'gold',
    status: 'active'
  }
];

export const MOCK_STORIES: Story[] = [
    {
        id: 's1',
        businessId: '1',
        businessName: 'Divine Hotels',
        businessLogo: 'https://ui-avatars.com/api/?name=Divine+Hotels&background=EE1C47&color=fff',
        image: 'https://picsum.photos/seed/promo1/600/1000',
        caption: '50% off all Deluxe Suites this weekend only! 🥂',
        timestamp: '1h ago'
    },
    {
        id: 's2',
        businessId: '2',
        businessName: 'Mama Nkechi',
        businessLogo: 'https://ui-avatars.com/api/?name=Mama+Nkechi&background=FF823A&color=fff',
        image: 'https://picsum.photos/seed/promo2/600/1000',
        caption: 'New Jollof Recipe just dropped! Come taste the magic. 🔥',
        timestamp: '3h ago'
    },
    {
        id: 's3',
        businessId: '3',
        businessName: 'Eko Resort',
        businessLogo: 'https://ui-avatars.com/api/?name=Eko+Atlantic&background=09153D&color=fff',
        image: 'https://picsum.photos/seed/promo3/600/1000',
        caption: 'Sunset yoga starts at 6 PM. Join us on the beach! 🧘‍♀️',
        timestamp: '5h ago'
    }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    businessId: '1',
    userId: '101',
    userName: 'Chidinma Okafor',
    userImage: 'https://picsum.photos/id/64/100/100',
    rating: 5,
    date: '2023-10-24',
    text: 'Absolutely loved the experience! The service was impeccable and the ambiance was perfect.',
    helpfulCount: 12,
    photos: ['https://picsum.photos/id/42/200/200', 'https://picsum.photos/id/43/200/200'],
    status: 'active',
    isRead: false
  }
];

export const MOCK_USER: User = {
  id: '1',
  name: 'Emeka Ugochukwu',
  email: 'emeka@example.com',
  image: 'https://picsum.photos/id/1005/100/100',
  role: 'admin',
  credits: 50,
  badges: ['1', '2'],
  reputationPoints: 1250,
  referralCode: 'EMEKA23',
  referralCount: 12,
  notificationPreferences: { email: true, inApp: true },
  status: 'active',
  createdAt: daysAgo(500),
  lastActiveAt: daysAgo(0)
};

export const MOCK_USERS_LIST: User[] = [MOCK_USER];
export const MOCK_EVENTS: Event[] = [];
export const MOCK_COMMUNITY_THREADS: CommunityThread[] = [];
export const MOCK_TRANSACTIONS: Transaction[] = [];
export const MOCK_ADS: AdPlacement[] = [
  {
    id: 'ad_1',
    name: 'Summer Sale Banner',
    status: 'active',
    location: 'Homepage Banner',
    imageUrl: 'https://picsum.photos/seed/ad1/800/400',
    destinationUrl: 'https://example.com/sale',
    startDate: '2026-06-01',
    endDate: '2026-08-31',
    impressions: 15420,
    clicks: 320,
    targeting: { category: 'Shopping' }
  },
  {
    id: 'ad_2',
    name: 'Tech Conference Promo',
    status: 'paused',
    location: 'Listing Sidebar',
    imageUrl: 'https://picsum.photos/seed/ad2/300/600',
    destinationUrl: 'https://example.com/tech',
    startDate: '2026-03-15',
    endDate: '2026-04-15',
    impressions: 8900,
    clicks: 145,
    targeting: {}
  }
];
export const MOCK_EVENT_COMMENTS: EventComment[] = [];
export const MOCK_CAMPAIGNS: MarketingCampaign[] = [
  {
    id: 'camp_1',
    name: 'New Year Boost',
    status: 'completed',
    channel: 'Email',
    budget: 50000,
    spent: 48500,
    roi: '+12.5%',
    startDate: '2026-01-01',
    endDate: '2026-01-31'
  },
  {
    id: 'camp_2',
    name: 'Spring Festival',
    status: 'active',
    channel: 'Social Media',
    budget: 120000,
    spent: 45000,
    roi: '+8.2%',
    startDate: '2026-03-01',
    endDate: '2026-05-31'
  }
];
