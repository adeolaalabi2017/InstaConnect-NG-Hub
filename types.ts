
export type Role = 'consumer' | 'vendor' | 'admin' | 'editor' | 'viewer';

export type Permission = 
  | 'view_admin_dashboard'
  | 'manage_users' 
  | 'manage_listings' 
  | 'manage_content' 
  | 'manage_settings' 
  | 'manage_marketing'
  | 'manage_orders'
  | 'create_review';

export interface Business {
  id: string;
  name: string;
  category: string;
  location: string;
  image: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  description: string;
  isOpen: boolean;
  tags: string[];
  phone: string;
  email: string;
  instagramHandle?: string;
  whatsapp?: string;
  viewCount: number;
  ownerId?: string;
  isPromoted?: boolean;
  credits: number; // Added credit field specific to the business profile
  createdAt?: string;
  lastActiveAt?: string;
  verificationStatus?: 'pending' | 'verified' | 'rejected';
  status: 'active' | 'inactive'; // Active/Inactive status
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface Review {
  id: string;
  businessId: string;
  userId: string;
  userName: string;
  userImage: string;
  rating: number; // 1-5
  date: string;
  text: string;
  helpfulCount: number;
  photos?: string[];
  reply?: {
    text: string;
    date: string;
  };
  status: 'active' | 'flagged' | 'hidden';
  isRead?: boolean; // New field for vendor dashboard
}

export interface NotificationPreferences {
  email: boolean;
  inApp: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  role: Role;
  credits: number; // User wallet (optional, or used for non-business transactions)
  badges: string[];
  reputationPoints: number;
  referralCode: string;
  referralCount: number;
  notificationPreferences: NotificationPreferences;
  status?: 'active' | 'banned';
  createdAt?: string;
  lastActiveAt?: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export interface Promotion {
  id: string;
  businessId: string;
  businessName: string;
  planId: string;
  planName: string;
  cost: number; // Cost in credits
  startDate: string; // ISO String
  endDate: string; // ISO String
  status: 'active' | 'completed' | 'scheduled';
}

export interface Transaction {
  id: string;
  businessId: string;
  businessName: string;
  type: 'credit_purchase' | 'promotion_spend';
  amount: number; // Credits
  amountNGN?: number; // Real currency cost (only for purchases)
  description: string;
  date: string;
  status: 'success' | 'failed' | 'pending';
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string; // ISO string YYYY-MM-DD
  time: string;
  location: string;
  image: string;
  organizer: string;
  organizerId?: string;
  category: string;
  price: string;
  attendees: number;
  tags: string[];
}

export interface EventComment {
  id: string;
  eventId: string;
  userName: string;
  userImage: string;
  content: string;
  timestamp: string;
  status?: 'active' | 'flagged' | 'hidden';
}

// Table: PageView / EventLog
export interface AnalyticsEvent {
  id: string;
  businessId: string;
  type: 'view' | 'website_click' | 'call_click' | 'email_click' | 'whatsapp_click' | 'share';
  timestamp: number;
  userId?: string;
}

// Table: DailyAnalytics
export interface DailyMetric {
  date: string; // Primary Key Part 1 (YYYY-MM-DD)
  businessId: string; // Primary Key Part 2
  views: number;
  clicks: number;
  shares: number;
  uniqueVisitors: number; // Count of distinct userIds
}

export interface Notification {
  id: string;
  userId: string;
  type: 'review' | 'system' | 'promotion';
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  link?: string;
}

export interface MarketingCampaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed' | 'draft';
  channel: 'Google Ads' | 'Facebook' | 'Email' | 'Instagram';
  budget: number;
  spent: number;
  roi: string;
  startDate: string;
  endDate: string;
}

export type AdStatus = 'active' | 'paused' | 'expired';
export type AdLocation = 'Homepage Banner' | 'Listing Sidebar' | 'Search Results Top';

export interface AdPlacement {
  id: string;
  name: string;
  status: AdStatus;
  location: AdLocation;
  imageUrl: string;
  destinationUrl: string;
  impressions: number;
  clicks: number;
  startDate: string;
  endDate: string;
  targeting: {
    category?: string; // e.g., 'Food', 'Hotels'
  };
}

// --- CMS Configuration Types ---

export interface HeaderConfig {
  isVisible: boolean;
  logoText: string;
  showAuthButtons: boolean;
  navLinks: {
    home: string;
    listings: string;
    reviews: string;
    events: string;
    community: string;
    contact: string;
  };
}

export interface HeroConfig {
  isVisible: boolean;
  title: string;
  highlightText: string;
  subtitle: string;
  backgroundImage: string;
  showSearchBar: boolean;
  tags: string[];
}

export interface FooterConfig {
  isVisible: boolean;
  aboutText: string;
  showSocialLinks: boolean;
  copyrightText: string;
}

export interface SiteConfig {
  header: HeaderConfig;
  hero: HeroConfig;
  footer: FooterConfig;
}

// --- Email Settings ---
export interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  encryption: 'none' | 'ssl';
}

export interface MailgunConfig {
  apiKey: string;
  domain: string;
}

export interface SendGridConfig {
  apiKey: string;
}

export type EmailConfig = {
  provider: 'smtp';
  settings: SmtpConfig;
} | {
  provider: 'mailgun';
  settings: MailgunConfig;
} | {
  provider: 'sendgrid';
  settings: SendGridConfig;
};

// --- Community Types ---

export interface CommunityComment {
  id: string;
  author: {
      name: string;
      image: string;
  };
  content: string;
  timestamp: string;
  upvotes: number;
  replies: CommunityComment[];
}

export interface CommunityThread {
  id: string;
  title: string;
  content: string; // HTML content
  author: {
      name: string;
      image: string;
      role: string;
  };
  category: string;
  upvotes: number;
  downvotes: number;
  commentCount: number;
  timestamp: string;
  userVote?: 'up' | 'down' | null;
  comments: CommunityComment[];
}
