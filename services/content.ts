
import { SiteConfig } from '../types';

const CONFIG_KEY = 'insta_site_config';

const DEFAULT_CONFIG: SiteConfig = {
  header: {
    isVisible: true,
    logoText: 'InstaConnect NG',
    showAuthButtons: true,
    navLinks: {
      home: 'Home',
      listings: 'Listings',
      reviews: 'Reviews',
      events: 'Events',
      community: 'Community',
      contact: 'Contact'
    }
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
    copyrightText: '© 2024 InstaConnect NG. All rights reserved.'
  }
};

class ContentService {
  private config: SiteConfig;

  constructor() {
    const stored = localStorage.getItem(CONFIG_KEY);
    if (stored) {
      this.config = JSON.parse(stored);
    } else {
      this.config = DEFAULT_CONFIG;
      this.saveConfig(DEFAULT_CONFIG);
    }
  }

  public getConfig(): SiteConfig {
    // Re-fetch to ensure we have latest if multiple tabs open (basic sync)
    const stored = localStorage.getItem(CONFIG_KEY);
    return stored ? JSON.parse(stored) : this.config;
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
