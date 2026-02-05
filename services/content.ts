
import { SiteConfig } from '../types';

const CONFIG_KEY = 'vendors_hub_site_config';

const DEFAULT_CONFIG: SiteConfig = {
  header: {
    isVisible: true,
    logoText: 'Vendors Hub',
    showAuthButtons: true,
    navLinks: [
      { id: '1', label: 'Home', path: '/' },
      { id: '2', label: 'Listings', path: '/listings' },
      { id: '3', label: 'Reviews', path: '/top-rated' },
      { id: '4', label: 'Events', path: '/events' },
      { id: '5', label: 'Community', path: '/community' },
      { id: '6', label: 'Contact', path: '/contact' }
    ]
  },
  hero: {
    isVisible: true,
    title: 'Explore',
    highlightText: 'Local Favorites',
    subtitle: 'From top-rated restaurants to trusted local services, find everything you need in one modern directory.',
    backgroundImage: 'https://i.ytimg.com/vi/g-Q_2Y_R-X8/maxresdefault.jpg',
    showSearchBar: true,
    tags: ['Hotel', 'Business', 'Wedding', 'Office', 'Healthcare', 'Lifestyle']
  },
  footer: {
    isVisible: true,
    aboutText: 'Discover the best local businesses in your area. Your ultimate guide to dining, shopping, and services.',
    showSocialLinks: true,
    copyrightText: '© 2024 Vendors Hub. All rights reserved.'
  }
};

class ContentService {
  private config: SiteConfig;

  constructor() {
    const stored = localStorage.getItem(CONFIG_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Migration check: if navLinks is object (old format), reset to default or transform
      if (parsed.header && parsed.header.navLinks && !Array.isArray(parsed.header.navLinks)) {
          this.config = DEFAULT_CONFIG;
          this.saveConfig(DEFAULT_CONFIG);
      } else {
          this.config = parsed;
      }
    } else {
      this.config = DEFAULT_CONFIG;
      this.saveConfig(DEFAULT_CONFIG);
    }
  }

  public getConfig(): SiteConfig {
    // Re-fetch to ensure we have latest if multiple tabs open (basic sync)
    const stored = localStorage.getItem(CONFIG_KEY);
    if (!stored) return this.config;
    
    const parsed = JSON.parse(stored);
    // Safety check for old format on read
    if (parsed.header && parsed.header.navLinks && !Array.isArray(parsed.header.navLinks)) {
        return DEFAULT_CONFIG;
    }
    return parsed;
  }

  public saveConfig(newConfig: SiteConfig) {
    this.config = newConfig;
    localStorage.setItem(CONFIG_KEY, JSON.stringify(newConfig));
    // Dispatch event for components that listen
    window.dispatchEvent(new Event('site-config-updated'));
  }

  public resetToDefaults() {
    this.saveConfig(DEFAULT_CONFIG);
  }
}

export const contentService = new ContentService();
