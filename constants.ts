import { Business, Category, Review, User, Event, EventComment, Badge, Transaction, Promotion, MarketingCampaign, AdPlacement, Role, Permission, CommunityThread } from './types';

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
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.',
    isOpen: true,
    tags: ['WiFi', 'Pool', 'Parking'],
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
    status: 'active',
    products: [
      { id: 'p1', name: 'Deluxe Suite', image: 'https://picsum.photos/id/164/400/300', price: 35000, quantity: 5 },
      { id: 'p2', name: 'Executive Suite', image: 'https://picsum.photos/id/165/400/300', price: 55000, quantity: 2 },
      { id: 'p3', name: 'Standard Room', image: 'https://picsum.photos/id/166/400/300', price: 25000, quantity: 10 },
      { id: 'p4', name: 'Poolside Access', image: 'https://picsum.photos/id/167/400/300', price: 5000, quantity: 20 },
      { id: 'p5', name: 'Breakfast Buffet', image: 'https://picsum.photos/id/168/400/300', price: 7500, quantity: 50 },
    ]
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
    status: 'active',
    products: [
      { id: 'p6', name: 'Party Jollof Rice', image: 'https://picsum.photos/id/312/400/300', price: 3500, quantity: 30 },
      { id: 'p7', name: 'Egusi Soup & Pounded Yam', image: 'https://picsum.photos/id/313/400/300', price: 4500, quantity: 25 },
      { id: 'p8', name: 'Spiced Fried Fish', image: 'https://picsum.photos/id/314/400/300', price: 2000, quantity: 15 },
    ]
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
    status: 'active'
  },
  {
    id: '4',
    name: 'Hub 43 Co-working',
    category: 'Office',
    location: 'Yaba, Lagos',
    image: 'https://picsum.photos/id/1/800/600',
    logo: 'https://ui-avatars.com/api/?name=Hub+43&background=6366f1&color=fff&size=128',
    rating: 4.2,
    reviewCount: 45,
    priceRange: '₦3,000/day',
    description: 'Co-working space for digital nomads and startups in the tech hub of Lagos.',
    isOpen: false,
    tags: ['High-speed Net', 'Coffee', 'Meeting Rooms'],
    phone: '+234 703 456 7890',
    email: 'hello@hub43.ng',
    instagramHandle: 'hub43_ng',
    whatsapp: '+2347034567890',
    viewCount: 800,
    credits: 0,
    createdAt: daysAgo(45),
    lastActiveAt: daysAgo(30),
    verificationStatus: 'verified',
    status: 'active'
  },
  {
    id: '5',
    name: 'Royal Events Planner',
    category: 'Services',
    location: 'GRA, Port Harcourt',
    image: 'https://picsum.photos/id/250/800/600',
    logo: 'https://ui-avatars.com/api/?name=Royal+Events&background=ec4899&color=fff&size=128',
    rating: 5.0,
    reviewCount: 32,
    priceRange: 'Variable',
    description: 'Making your special day unforgettable with bespoke planning.',
    isOpen: true,
    tags: ['Weddings', 'Events', 'Decor'],
    phone: '+234 805 678 9012',
    email: 'plan@royalevents.ng',
    instagramHandle: 'royalevents_ph',
    whatsapp: '+2348056789012',
    viewCount: 1200,
    credits: 20,
    createdAt: daysAgo(15),
    lastActiveAt: daysAgo(1),
    verificationStatus: 'pending',
    status: 'inactive'
  },
  {
    id: '6',
    name: 'Lagoon Diagnostics',
    category: 'Health',
    location: 'Ikoyi, Lagos',
    image: 'https://picsum.photos/id/10/800/600',
    logo: 'https://ui-avatars.com/api/?name=Lagoon+Diag&background=10b981&color=fff&size=128',
    rating: 4.0,
    reviewCount: 15,
    priceRange: 'Insurance',
    description: 'Full service diagnostic center with state-of-the-art equipment.',
    isOpen: true,
    tags: ['X-Ray', 'MRI', 'Blood Work'],
    phone: '+234 812 345 6789',
    email: 'support@lagoondiagnostics.ng',
    instagramHandle: 'lagoondiagnostics',
    whatsapp: '+2348123456789',
    viewCount: 950,
    credits: 100,
    createdAt: daysAgo(365),
    lastActiveAt: daysAgo(10),
    verificationStatus: 'verified',
    status: 'active'
  },
  {
    id: '7',
    name: 'Gadget World Ikeja',
    category: 'Shopping',
    location: 'Computer Village, Ikeja',
    image: 'https://picsum.photos/id/3/800/600',
    logo: 'https://ui-avatars.com/api/?name=Gadget+World&background=3b82f6&color=fff&size=128',
    rating: 4.6,
    reviewCount: 210,
    priceRange: 'Variable',
    description: 'Your one-stop shop for the latest phones, laptops, and accessories.',
    isOpen: true,
    tags: ['Electronics', 'Gadgets', 'Repairs'],
    phone: '+234 809 111 2222',
    email: 'sales@gadgetworld.ng',
    instagramHandle: 'gadgetworld_ng',
    whatsapp: '+2348091112222',
    viewCount: 3200,
    isPromoted: true,
    credits: 800,
    createdAt: daysAgo(60),
    lastActiveAt: daysAgo(0),
    verificationStatus: 'verified',
    status: 'active'
  },
  {
    id: '8',
    name: 'Iron House Gym',
    category: 'Fitness',
    location: 'Victoria Island, Lagos',
    image: 'https://picsum.photos/id/98/800/600',
    logo: 'https://ui-avatars.com/api/?name=Iron+House&background=f59e0b&color=fff&size=128',
    rating: 4.9,
    reviewCount: 150,
    priceRange: '₦15,000/month',
    description: 'State of the art equipment and personal trainers to help you reach your fitness goals.',
    isOpen: true,
    tags: ['Gym', 'Yoga', 'Crossfit'],
    phone: '+234 701 222 3333',
    email: 'fit@ironhouse.ng',
    instagramHandle: 'ironhouse_gym',
    whatsapp: '+2347012223333',
    viewCount: 2800,
    isPromoted: true,
    credits: 300,
    createdAt: daysAgo(90),
    lastActiveAt: daysAgo(1),
    verificationStatus: 'verified',
    status: 'active'
  },
  {
    id: '9',
    name: 'Naija Suya Spot',
    category: 'Food',
    location: 'Surulere, Lagos',
    image: 'https://picsum.photos/id/292/800/600',
    logo: 'https://ui-avatars.com/api/?name=Suya+Spot&background=EE1C47&color=fff&size=128',
    rating: 4.7,
    reviewCount: 340,
    priceRange: '₦1,500/stick',
    description: 'The best spicy suya in the mainland. Beef, Chicken, and Kidney available.',
    isOpen: true,
    tags: ['Suya', 'Grill', 'Nightlife'],
    phone: '+234 810 555 6666',
    email: 'hello@naijasuya.ng',
    viewCount: 1500,
    isPromoted: false,
    credits: 10,
    createdAt: daysAgo(400),
    lastActiveAt: daysAgo(60),
    verificationStatus: 'verified',
    status: 'active'
  },
  {
    id: '10',
    name: 'Lekki Arts & Crafts',
    category: 'Shopping',
    location: 'Lekki, Lagos',
    image: 'https://picsum.photos/id/106/800/600',
    logo: 'https://ui-avatars.com/api/?name=Lekki+Arts&background=8b5cf6&color=fff&size=128',
    rating: 4.3,
    reviewCount: 65,
    priceRange: 'Negotiable',
    description: 'Authentic Nigerian arts, paintings, and handmade crafts.',
    isOpen: true,
    tags: ['Art', 'Souvenirs', 'Culture'],
    phone: '+234 902 888 7777',
    email: 'info@lekkiarts.ng',
    viewCount: 900,
    isPromoted: false,
    credits: 0,
    createdAt: daysAgo(20),
    lastActiveAt: daysAgo(18),
    verificationStatus: 'pending',
    status: 'active'
  },
  {
    id: '11',
    name: 'Glamour Beauty Spa',
    category: 'Health',
    location: 'Wuse, Abuja',
    image: 'https://picsum.photos/id/65/800/600',
    logo: 'https://ui-avatars.com/api/?name=Glamour&background=ec4899&color=fff&size=128',
    rating: 4.1,
    reviewCount: 42,
    priceRange: '₦10,000/session',
    description: 'Relax and rejuvenate with our massage and skincare treatments.',
    isOpen: true,
    tags: ['Spa', 'Massage', 'Skincare'],
    phone: '+234 803 444 9999',
    email: 'book@glamourspa.ng',
    instagramHandle: 'glamour_spa',
    whatsapp: '+2348034449999',
    viewCount: 1100,
    isPromoted: false,
    credits: 75,
    createdAt: daysAgo(200),
    lastActiveAt: daysAgo(20),
    verificationStatus: 'verified',
    status: 'active'
  },
  {
    id: '12',
    name: 'The Place Restaurant',
    category: 'Food',
    location: 'Maryland, Lagos',
    image: 'https://picsum.photos/id/225/800/600',
    logo: 'https://ui-avatars.com/api/?name=The+Place&background=FF823A&color=fff&size=128',
    rating: 4.0,
    reviewCount: 512,
    priceRange: '₦3,000/meal',
    description: 'Affordable and delicious meals. Great for lunch breaks.',
    isOpen: true,
    tags: ['Fast Food', 'Nigerian', 'Takeout'],
    phone: '+234 800 111 1111',
    email: 'feedback@theplace.ng',
    viewCount: 2100,
    isPromoted: false,
    credits: 200,
    createdAt: daysAgo(500),
    lastActiveAt: daysAgo(5),
    verificationStatus: 'verified',
    status: 'active'
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
  },
  {
    id: '2',
    businessId: '1',
    userId: '102',
    userName: 'Tunde Bakare',
    userImage: 'https://picsum.photos/id/91/100/100',
    rating: 4,
    date: '2023-10-15',
    text: 'Great place, but parking was a bit of a hassle. Otherwise, highly recommended.',
    reply: {
        text: 'Thanks for the feedback Tunde! We are working on expanding our parking lot next month.',
        date: '2023-10-16'
    },
    helpfulCount: 5,
    status: 'active',
    isRead: true
  },
  {
    id: '3',
    businessId: '1',
    userId: '103',
    userName: 'Grace Effiong',
    userImage: 'https://picsum.photos/id/65/100/100',
    rating: 5,
    date: '2023-10-10',
    text: 'Best hotel in Lekki by far. The pool is amazing.',
    helpfulCount: 8,
    status: 'active',
    isRead: true
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

export const MOCK_USERS_LIST: User[] = [
    MOCK_USER,
    {
        id: '101',
        name: 'Chidinma Okafor',
        email: 'chidi@example.com',
        image: 'https://picsum.photos/id/64/100/100',
        role: 'consumer',
        credits: 0,
        badges: ['1', '3', '5'],
        reputationPoints: 2400,
        referralCode: 'CHIDI99',
        referralCount: 25,
        notificationPreferences: { email: true, inApp: true },
        status: 'active',
        createdAt: daysAgo(365),
        lastActiveAt: daysAgo(1)
    },
    {
        id: '104',
        name: 'Ahmed Musa',
        email: 'ahmed@example.com',
        image: 'https://picsum.photos/id/66/100/100',
        role: 'consumer',
        credits: 0,
        badges: ['4', '5'],
        reputationPoints: 1850,
        referralCode: 'AHMED01',
        referralCount: 8,
        notificationPreferences: { email: true, inApp: true },
        status: 'active',
        createdAt: daysAgo(200),
        lastActiveAt: daysAgo(2)
    }
];

export const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Lagos Tech Fest 2024',
    description: 'Join the biggest gathering of tech enthusiasts, startups, and investors in Lagos. Networking, panels, and food.',
    date: '2024-11-15',
    time: '09:00 AM',
    location: 'Landmark Centre, Victoria Island',
    image: 'https://picsum.photos/id/1/800/400',
    organizer: 'Techpoint Africa',
    organizerId: '1',
    category: 'Tech',
    price: 'Free',
    attendees: 1250,
    tags: ['Networking', 'Startup', 'Tech']
  }
];

export const MOCK_COMMUNITY_THREADS: CommunityThread[] = [
    {
        id: '1',
        title: 'Best place for affordable tech gear in Ikeja?',
        content: 'I am looking for a reliable shop in Computer Village that sells genuine MacBooks at reasonable prices. Has anyone had good experiences with "Gadget World"?',
        author: {
            name: 'Chidinma Okafor',
            image: 'https://picsum.photos/id/64/100/100',
            role: 'Consumer'
        },
        category: 'Shopping',
        upvotes: 45,
        downvotes: 2,
        commentCount: 3,
        timestamp: '2 hours ago',
        userVote: null,
        comments: []
    }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
    {
        id: 'tx_001',
        businessId: '1',
        businessName: 'Divine Hotels',
        type: 'credit_purchase',
        amount: 500,
        amountNGN: 22000,
        description: 'Purchased 500 Credits Pack',
        date: daysAgo(40),
        status: 'success'
    }
];

export const MOCK_ADS: AdPlacement[] = [
  {
    id: 'ad_01',
    name: 'Jumia Black Friday',
    status: 'active',
    location: 'Homepage Banner',
    imageUrl: 'https://picsum.photos/seed/jumia/1200/250',
    destinationUrl: 'https://jumia.com.ng',
    impressions: 125430,
    clicks: 4580,
    startDate: daysAgo(5),
    endDate: '2024-11-30',
    targeting: {}
  }
];

// Added missing mock members to fix build errors
export const MOCK_EVENT_COMMENTS: EventComment[] = [
  {
    id: '1',
    eventId: '1',
    userName: 'Tunde Bakare',
    userImage: 'https://picsum.photos/id/91/100/100',
    content: 'Can\'t wait for this! See you guys there.',
    timestamp: '1 day ago',
    status: 'active'
  }
];

export const MOCK_CAMPAIGNS: MarketingCampaign[] = [
  {
    id: '1',
    name: 'Holiday Special',
    status: 'active',
    channel: 'Email',
    budget: 50000,
    spent: 12000,
    roi: '+15%',
    startDate: '2023-11-01',
    endDate: '2023-12-31'
  }
];
