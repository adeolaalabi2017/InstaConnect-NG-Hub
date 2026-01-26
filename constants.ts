
import { Business, Category, Review, User, Event, EventComment, Badge, Transaction, Promotion, MarketingCampaign, AdPlacement, Role, Permission, CommunityThread } from './types';

// ... (keep previous imports and constants up to MOCK_ADS)

// Keep existing exports...
// [rest of file content omitted for brevity, assume previous content exists until MOCK_ADS]

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
    'create_review' // Vendors also act as consumers on other listings
  ],
  consumer: [
    'create_review'
  ],
  viewer: [
    'create_review' // 'viewer' matches 'consumer' in this context
  ]
};

export const MOCK_BADGES: Badge[] = [
  { id: '1', name: 'Top Reviewer', icon: 'Star', color: 'bg-yellow-100 text-yellow-700', description: 'Posted 50+ helpful reviews' },
  { id: '2', name: 'Early Adopter', icon: 'Zap', color: 'bg-purple-100 text-purple-700', description: 'Joined in the first month' },
  { id: '3', name: 'Local Guide', icon: 'MapPin', color: 'bg-green-100 text-green-700', description: 'Expert on local gems' },
  { id: '4', name: 'Trendsetter', icon: 'TrendingUp', color: 'bg-blue-100 text-blue-700', description: 'First to review 10 new places' },
  { id: '5', name: 'Verified Reviewer', icon: 'BadgeCheck', color: 'bg-blue-100 text-blue-700', description: 'Identity verified' },
];

const now = new Date();
const daysAgo = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString();
};

const daysFromNow = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString();
};


export const MOCK_BUSINESSES: Business[] = [
  {
    id: '1',
    name: 'Divine Hotels',
    category: 'Hotels',
    location: 'Lekki Phase 1, Lagos',
    image: 'https://picsum.photos/id/1040/800/600',
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
    ownerId: '1', // Linked to MOCK_USER
    isPromoted: true,
    credits: 450,
    createdAt: daysAgo(120),
    lastActiveAt: daysAgo(2),
    verificationStatus: 'verified',
    status: 'active'
  },
  {
    id: '2',
    name: 'Mama Nkechi Kitchen',
    category: 'Food',
    location: 'Wuse 2, Abuja',
    image: 'https://picsum.photos/id/493/800/600',
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
    status: 'active'
  },
  {
    id: '3',
    name: 'Eko Atlantic Resort',
    category: 'Hotels',
    location: 'Victoria Island, Lagos',
    image: 'https://picsum.photos/id/1039/800/600',
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
    createdAt: daysAgo(15), // New business
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
  // ... (keep existing reviews)
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
  },
  {
    id: '4',
    businessId: '2',
    userId: '104',
    userName: 'Ahmed Musa',
    userImage: 'https://picsum.photos/id/66/100/100',
    rating: 5,
    date: '2023-10-20',
    text: 'The Jollof rice here is legendary! Must try.',
    helpfulCount: 20,
    status: 'active',
    isRead: false
  },
  {
    id: '5',
    businessId: '2',
    userId: '105',
    userName: 'Sarah Jones',
    userImage: 'https://picsum.photos/id/67/100/100',
    rating: 3,
    date: '2023-09-28',
    text: 'Food was good but service was a bit slow today.',
    helpfulCount: 2,
    status: 'active',
    isRead: false
  },
  {
    id: '6',
    businessId: '2',
    userId: '106',
    userName: 'Spam Bot',
    userImage: 'https://ui-avatars.com/api/?name=SB&background=random',
    rating: 1,
    date: '2023-10-25',
    text: 'CLICK HERE TO WIN FREE IPHONE!!! www.fakelink.com',
    helpfulCount: 0,
    status: 'flagged',
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
    // ... (keep mock users list as provided before)
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
    },
    {
        id: '102',
        name: 'Tunde Bakare',
        email: 'tunde@example.com',
        image: 'https://picsum.photos/id/91/100/100',
        role: 'consumer',
        credits: 0,
        badges: [],
        reputationPoints: 500,
        referralCode: 'TUNDE55',
        referralCount: 2,
        notificationPreferences: { email: true, inApp: true },
        status: 'active',
        createdAt: daysAgo(50),
        lastActiveAt: daysAgo(10)
    },
    {
        id: '105',
        name: 'Zainab Ali',
        email: 'zainab@example.com',
        image: 'https://picsum.photos/id/72/100/100',
        role: 'consumer',
        credits: 0,
        badges: ['2'],
        reputationPoints: 2100,
        referralCode: 'ZAINAB10',
        referralCount: 18,
        notificationPreferences: { email: true, inApp: true },
        status: 'active',
        createdAt: daysAgo(400),
        lastActiveAt: daysAgo(0)
    },
    {
        id: '106',
        name: 'Kingsley Okonkwo',
        email: 'kingsley@example.com',
        image: 'https://picsum.photos/id/73/100/100',
        role: 'vendor',
        credits: 200,
        badges: ['1'],
        reputationPoints: 1600,
        referralCode: 'KING202',
        referralCount: 15,
        notificationPreferences: { email: true, inApp: true },
        status: 'active',
        createdAt: daysAgo(300),
        lastActiveAt: daysAgo(1)
    },
    {
        id: '107',
        name: 'Fatima Ibrahim',
        email: 'fatima@example.com',
        image: 'https://picsum.photos/id/74/100/100',
        role: 'consumer',
        credits: 0,
        badges: ['5'],
        reputationPoints: 950,
        referralCode: 'FATIMA44',
        referralCount: 5,
        notificationPreferences: { email: true, inApp: true },
        status: 'active',
        createdAt: daysAgo(100),
        lastActiveAt: daysAgo(5)
    },
    {
        id: '108',
        name: 'Oluwaseun Adebayo',
        email: 'seun@example.com',
        image: 'https://picsum.photos/id/75/100/100',
        role: 'consumer',
        credits: 0,
        badges: ['3'],
        reputationPoints: 1100,
        referralCode: 'SEUN99',
        referralCount: 9,
        notificationPreferences: { email: true, inApp: true },
        status: 'active',
        createdAt: daysAgo(250),
        lastActiveAt: daysAgo(3)
    },
    {
        id: '109',
        name: 'Ngozi Obi',
        email: 'ngozi@example.com',
        image: 'https://picsum.photos/id/76/100/100',
        role: 'consumer',
        credits: 0,
        badges: [],
        reputationPoints: 450,
        referralCode: 'NGOZI11',
        referralCount: 1,
        notificationPreferences: { email: true, inApp: true },
        status: 'active',
        createdAt: daysAgo(30),
        lastActiveAt: daysAgo(25)
    },
    {
        id: '110',
        name: 'David Etim',
        email: 'david@example.com',
        image: 'https://picsum.photos/id/77/100/100',
        role: 'consumer',
        credits: 0,
        badges: ['4'],
        reputationPoints: 1350,
        referralCode: 'DAVID77',
        referralCount: 11,
        notificationPreferences: { email: true, inApp: true },
        status: 'active',
        createdAt: daysAgo(150),
        lastActiveAt: daysAgo(2)
    },
    {
        id: '111',
        name: 'Yusuf Sani',
        email: 'yusuf@example.com',
        image: 'https://picsum.photos/id/78/100/100',
        role: 'consumer',
        credits: 0,
        badges: [],
        reputationPoints: 750,
        referralCode: 'YUSUF01',
        referralCount: 3,
        notificationPreferences: { email: true, inApp: true },
        status: 'active',
        createdAt: daysAgo(60),
        lastActiveAt: daysAgo(10)
    },
    {
        id: '112',
        name: 'Precious Onuoha',
        email: 'precious@example.com',
        image: 'https://picsum.photos/id/79/100/100',
        role: 'consumer',
        credits: 0,
        badges: ['2'],
        reputationPoints: 1950,
        referralCode: 'PREC100',
        referralCount: 14,
        notificationPreferences: { email: true, inApp: true },
        status: 'active',
        createdAt: daysAgo(300),
        lastActiveAt: daysAgo(1)
    }
];

export const MOCK_EVENTS: Event[] = [
  // ... (keep existing events)
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
  },
  {
    id: '2',
    title: 'Naija Food Carnival',
    description: 'A celebration of Nigerian culinary diversity. Taste dishes from all 36 states!',
    date: '2024-11-20',
    time: '12:00 PM',
    location: 'Muri Okunola Park, Lagos',
    image: 'https://picsum.photos/id/493/800/400',
    organizer: 'EatDrinkLagos',
    organizerId: '106',
    category: 'Food',
    price: '₦2,000',
    attendees: 540,
    tags: ['Food', 'Culture', 'Music']
  },
  {
    id: '3',
    title: 'Fitness & Wellness Expo',
    description: 'Yoga sessions, health checks, and fitness challenges. Come in your kit!',
    date: '2024-11-25',
    time: '07:00 AM',
    location: 'National Stadium, Surulere',
    image: 'https://picsum.photos/id/338/800/400',
    organizer: 'FitFam Nigeria',
    category: 'Health',
    price: 'Free',
    attendees: 300,
    tags: ['Fitness', 'Yoga', 'Health']
  },
  {
    id: '4',
    title: 'Afrobeats Live Concert',
    description: 'Experience the rhythm of Afrobeat with top artists performing live. A night of electrifying music and dance.',
    date: '2024-12-15',
    time: '08:00 PM',
    location: 'Eko Convention Centre, Lagos',
    image: 'https://picsum.photos/id/158/800/400',
    organizer: 'Vibe Nation',
    category: 'Music',
    price: '₦25,000',
    attendees: 5000,
    tags: ['Music', 'Concert', 'Party']
  },
  {
    id: '5',
    title: 'Lagos Fashion Week 2024',
    description: 'Showcasing the best of African fashion design. Runway shows, exhibitions, and pop-up stores.',
    date: '2024-11-28',
    time: '04:00 PM',
    location: 'Federal Palace Hotel, Victoria Island',
    image: 'https://picsum.photos/id/334/800/400',
    organizer: 'LFW Team',
    category: 'Arts',
    price: '₦10,000',
    attendees: 1500,
    tags: ['Fashion', 'Lifestyle', 'Runway']
  },
  {
    id: '6',
    title: 'SME Growth Summit Abuja',
    description: 'Empowering small business owners with strategies for scaling in the Nigerian market. Workshops and expert panels.',
    date: '2024-12-05',
    time: '09:00 AM',
    location: 'International Conference Centre, Abuja',
    image: 'https://picsum.photos/id/4/800/400',
    organizer: 'SME Nigeria',
    category: 'Business',
    price: 'Free',
    attendees: 800,
    tags: ['Business', 'Networking', 'SME']
  },
  {
    id: '7',
    title: 'Laugh Out Loud Comedy Night',
    description: 'A hilarious evening featuring Nigeria\'s funniest comedians. Guaranteed to leave you in stitches!',
    date: '2024-12-01',
    time: '07:00 PM',
    location: 'Muson Centre, Lagos',
    image: 'https://picsum.photos/id/399/800/400',
    organizer: 'Comedy Central NG',
    category: 'Entertainment',
    price: '₦5,000',
    attendees: 600,
    tags: ['Comedy', 'Fun', 'Nightlife']
  },
  {
    id: '8',
    title: 'DevFest Lagos 2024',
    description: 'The largest developer festival in Lagos. Technical sessions, codelabs, and fireside chats for developers of all levels.',
    date: '2024-11-30',
    time: '08:00 AM',
    location: 'Landmark Event Centre, Lagos',
    image: 'https://picsum.photos/id/60/800/400',
    organizer: 'GDG Lagos',
    category: 'Tech',
    price: '₦2,000',
    attendees: 3000,
    tags: ['Developers', 'Google', 'Tech']
  },
  {
    id: '9',
    title: 'Paint & Sip Experience',
    description: 'Unleash your inner artist while enjoying fine wine and good company. No painting experience required!',
    date: '2024-11-18',
    time: '05:00 PM',
    location: 'Lekki Leisure Lake, Lagos',
    image: 'https://picsum.photos/id/450/800/400',
    organizer: 'Art & Chill',
    category: 'Arts',
    price: '₦15,000',
    attendees: 40,
    tags: ['Art', 'Relaxation', 'Social']
  }
];

export const MOCK_EVENT_COMMENTS: EventComment[] = [
  // ... (keep existing comments)
  {
    id: '1',
    eventId: '1',
    userName: 'Sarah Williams',
    userImage: 'https://picsum.photos/id/65/100/100',
    content: 'Is there parking available at the venue?',
    timestamp: '2 hours ago',
    status: 'active'
  },
  {
    id: '2',
    eventId: '1',
    userName: 'David Okeke',
    userImage: 'https://picsum.photos/id/66/100/100',
    content: 'Can\'t wait for this! Who else is coming from the mainland?',
    timestamp: '5 hours ago',
    status: 'active'
  },
  {
    id: '3',
    eventId: '1',
    userName: 'Troll User',
    userImage: 'https://ui-avatars.com/api/?name=Troll',
    content: 'This event is a scam! Do not go! www.scam-link.com',
    timestamp: '1 hour ago',
    status: 'flagged'
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
    },
    {
        id: 'tx_002',
        businessId: '7',
        businessName: 'Gadget World Ikeja',
        type: 'promotion_spend',
        amount: -180,
        description: 'Activated Growth Accelerator',
        date: daysAgo(38),
        status: 'success'
    },
    {
        id: 'tx_003',
        businessId: '3',
        businessName: 'Eko Atlantic Resort',
        type: 'credit_purchase',
        amount: 1000,
        amountNGN: 40000,
        description: 'Purchased Enterprise Pack',
        date: daysAgo(35),
        status: 'success'
    },
    {
        id: 'tx_004',
        businessId: '8',
        businessName: 'Iron House Gym',
        type: 'promotion_spend',
        amount: -300,
        description: 'Activated Ultimate Spotlight',
        date: daysAgo(30),
        status: 'success'
    },
    {
        id: 'tx_005',
        businessId: '2',
        businessName: 'Mama Nkechi Kitchen',
        type: 'credit_purchase',
        amount: 100,
        amountNGN: 5000,
        description: 'Starter Pack',
        date: daysAgo(25),
        status: 'success'
    },
    {
        id: 'tx_006',
        businessId: '1',
        businessName: 'Divine Hotels',
        type: 'promotion_spend',
        amount: -100,
        description: 'Weekly Spark Promotion',
        date: daysAgo(20),
        status: 'success'
    },
    {
        id: 'tx_007',
        businessId: '12',
        businessName: 'The Place Restaurant',
        type: 'credit_purchase',
        amount: 500,
        amountNGN: 22000,
        description: 'Purchased 500 Credits Pack',
        date: daysAgo(15),
        status: 'success'
    },
    {
        id: 'tx_008',
        businessId: '7',
        businessName: 'Gadget World Ikeja',
        type: 'credit_purchase',
        amount: 1000,
        amountNGN: 40000,
        description: 'Enterprise Pack Top-up',
        date: daysAgo(10),
        status: 'success'
    },
    {
        id: 'tx_009',
        businessId: '7',
        businessName: 'Gadget World Ikeja',
        type: 'promotion_spend',
        amount: -300,
        description: 'Ultimate Spotlight Renewal',
        date: daysAgo(8),
        status: 'success'
    },
    {
        id: 'tx_010',
        businessId: '3',
        businessName: 'Eko Atlantic Resort',
        type: 'promotion_spend',
        amount: -180,
        description: 'Growth Accelerator',
        date: daysAgo(5),
        status: 'success'
    },
    {
        id: 'tx_011',
        businessId: '11',
        businessName: 'Glamour Beauty Spa',
        type: 'credit_purchase',
        amount: 300,
        amountNGN: 13500,
        description: 'Standard Pack',
        date: daysAgo(2),
        status: 'success'
    }
];

export const MOCK_PROMOTIONS: Promotion[] = [
    {
        id: 'promo_001',
        businessId: '1',
        businessName: 'Divine Hotels',
        planId: 'basic',
        planName: 'Weekly Spark',
        cost: 100,
        startDate: '2024-11-01',
        endDate: '2024-11-08',
        status: 'active'
    },
    {
        id: 'promo_002',
        businessId: '3',
        businessName: 'Eko Atlantic Resort',
        planId: 'premium',
        planName: 'Ultimate Spotlight',
        cost: 300,
        startDate: '2024-10-25',
        endDate: '2024-11-25',
        status: 'active'
    },
    {
        id: 'promo_003',
        businessId: '7',
        businessName: 'Gadget World Ikeja',
        planId: 'standard',
        planName: 'Growth Accelerator',
        cost: 180,
        startDate: '2024-10-22',
        endDate: '2024-11-05',
        status: 'completed'
    }
];

export const MOCK_CAMPAIGNS: MarketingCampaign[] = [
  {
    id: 'camp_01',
    name: 'Lagos Food Fest Promo',
    status: 'active',
    channel: 'Instagram',
    budget: 50000,
    spent: 35000,
    roi: '+150%',
    startDate: daysAgo(10),
    endDate: '2024-12-20'
  },
  {
    id: 'camp_02',
    name: 'Abuja Hotel Deals',
    status: 'active',
    channel: 'Google Ads',
    budget: 80000,
    spent: 75000,
    roi: '+220%',
    startDate: daysAgo(5),
    endDate: '2024-12-25'
  },
  {
    id: 'camp_03',
    name: 'Holiday Shopping Discount',
    status: 'paused',
    channel: 'Facebook',
    budget: 30000,
    spent: 12000,
    roi: '+80%',
    startDate: daysAgo(15),
    endDate: '2024-12-15'
  },
  {
    id: 'camp_04',
    name: 'New Year Newsletter',
    status: 'completed',
    channel: 'Email',
    budget: 10000,
    spent: 10000,
    roi: '+350%',
    startDate: daysAgo(40),
    endDate: daysAgo(30)
  },
  {
    id: 'camp_05',
    name: 'Valentine Special (Draft)',
    status: 'draft',
    channel: 'Instagram',
    budget: 60000,
    spent: 0,
    roi: 'N/A',
    startDate: '2025-01-10',
    endDate: '2025-02-14'
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
    endDate: daysFromNow(25),
    targeting: {}
  },
  {
    id: 'ad_02',
    name: 'Mama Nkechi Lunch Special',
    status: 'active',
    location: 'Listing Sidebar',
    imageUrl: 'https://picsum.photos/seed/food/300/300',
    destinationUrl: '#/listing/2',
    impressions: 45670,
    clicks: 1230,
    startDate: daysAgo(2),
    endDate: daysFromNow(12),
    targeting: { category: 'Food' }
  },
  {
    id: 'ad_03',
    name: 'Find Hotels in Lagos',
    status: 'paused',
    location: 'Search Results Top',
    imageUrl: 'https://picsum.photos/seed/hotel/1200/150',
    destinationUrl: '#/listings?category=Hotels',
    impressions: 89000,
    clicks: 2100,
    startDate: daysAgo(10),
    endDate: daysFromNow(20),
    targeting: { category: 'Hotels' }
  },
  {
    id: 'ad_04',
    name: 'Old Gadget World Ad',
    status: 'expired',
    location: 'Homepage Banner',
    imageUrl: 'https://picsum.photos/seed/gadget/1200/250',
    destinationUrl: '#/listing/7',
    impressions: 250000,
    clicks: 8900,
    startDate: daysAgo(40),
    endDate: daysAgo(10),
    targeting: { category: 'Shopping' }
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
        comments: [
            {
                id: 'c1',
                author: { name: 'David Etim', image: 'https://picsum.photos/id/77/100/100' },
                content: 'Yes! Gadget World is solid. Bought my M1 there last month.',
                timestamp: '1 hour ago',
                upvotes: 12,
                replies: [
                    {
                        id: 'c1-1',
                        author: { name: 'Chidinma Okafor', image: 'https://picsum.photos/id/64/100/100' },
                        content: 'Thanks David! Did they give you a warranty?',
                        timestamp: '50 mins ago',
                        upvotes: 2,
                        replies: []
                    }
                ]
            },
            {
                id: 'c2',
                author: { name: 'Yusuf Sani', image: 'https://picsum.photos/id/78/100/100' },
                content: 'Be careful with street vendors though, stick to the registered shops.',
                timestamp: '45 mins ago',
                upvotes: 8,
                replies: []
            }
        ]
    },
    {
        id: '2',
        title: 'Hidden gems for date night in Victoria Island',
        content: 'My anniversary is coming up and I want to take my partner somewhere special but quiet. Not the usual loud spots like... well you know. Any recommendations?',
        author: {
            name: 'Tunde Bakare',
            image: 'https://picsum.photos/id/91/100/100',
            role: 'Consumer'
        },
        category: 'Food & Drink',
        upvotes: 128,
        downvotes: 5,
        commentCount: 1,
        timestamp: '5 hours ago',
        userVote: 'up',
        comments: [
            {
                id: 'c3',
                author: { name: 'Zainab Ali', image: 'https://picsum.photos/id/72/100/100' },
                content: 'Try "The Noir". It is very intimate and the jazz music is low volume.',
                timestamp: '3 hours ago',
                upvotes: 25,
                replies: []
            }
        ]
    },
    {
        id: '3',
        title: 'Review: Divine Hotels is overrated',
        content: 'Stayed there last weekend. The pool was great, but the room service took forever. For the price point, I expected faster service. Thoughts?',
        author: {
            name: 'Emeka Ugochukwu',
            image: 'https://picsum.photos/id/1005/100/100',
            role: 'Admin'
        },
        category: 'Reviews',
        upvotes: 12,
        downvotes: 8,
        commentCount: 0,
        timestamp: '1 day ago',
        userVote: null,
        comments: []
    },
    {
        id: '4',
        title: 'Networking event for startups next week!',
        content: 'Hey everyone, just a reminder about the Lagos Tech Fest coming up. Who else is going? Let\'s arrange a meetup for the community members here.',
        author: {
            name: 'Ahmed Musa',
            image: 'https://picsum.photos/id/66/100/100',
            role: 'Consumer'
        },
        category: 'Events',
        upvotes: 89,
        downvotes: 0,
        commentCount: 1,
        timestamp: '2 days ago',
        userVote: null,
        comments: [
             {
                id: 'c4',
                author: { name: 'Oluwaseun Adebayo', image: 'https://picsum.photos/id/75/100/100' },
                content: 'I will be there! Lets create a WhatsApp group.',
                timestamp: '1 day ago',
                upvotes: 5,
                replies: []
            }
        ]
    }
];
