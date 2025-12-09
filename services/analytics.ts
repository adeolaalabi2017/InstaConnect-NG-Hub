
import { AnalyticsEvent, DailyMetric } from '../types';
import { MOCK_BUSINESSES, MOCK_REVIEWS, MOCK_USERS_LIST, MOCK_TRANSACTIONS } from '../constants';

// Simulating Database Tables via LocalStorage
const DB_TABLE_PAGE_VIEWS = 'db_table_page_views';
const DB_TABLE_DAILY_ANALYTICS = 'db_table_daily_analytics';

class AnalyticsService {
  private pageViewsTable: AnalyticsEvent[] = [];
  private dailyAnalyticsTable: DailyMetric[] = [];

  constructor() {
    this.connectToDatabase();
    this.seedDataIfEmpty();
  }

  private connectToDatabase() {
    const storedEvents = localStorage.getItem(DB_TABLE_PAGE_VIEWS);
    const storedMetrics = localStorage.getItem(DB_TABLE_DAILY_ANALYTICS);

    if (storedEvents) this.pageViewsTable = JSON.parse(storedEvents);
    if (storedMetrics) this.dailyAnalyticsTable = JSON.parse(storedMetrics);
  }

  private commit() {
    localStorage.setItem(DB_TABLE_PAGE_VIEWS, JSON.stringify(this.pageViewsTable));
    localStorage.setItem(DB_TABLE_DAILY_ANALYTICS, JSON.stringify(this.dailyAnalyticsTable));
  }

  // --- API Endpoints ---

  /**
   * POST /api/analytics/track
   * Receives a tracking event and writes it to the PageViews table.
   */
  public async submitTrackingEvent(payload: Omit<AnalyticsEvent, 'id' | 'timestamp'>) {
    const newEvent: AnalyticsEvent = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      ...payload
    };

    // Insert into Table: PageView
    this.pageViewsTable.push(newEvent);
    this.commit();

    // Optimization: For UI responsiveness in this demo, we optimistically update the aggregation
    // In a real system, this might wait for the cron job or a stream processor.
    this.incrementRealtimeCache(newEvent);
    
    return { success: true, eventId: newEvent.id };
  }

  /**
   * Legacy wrapper for frontend components to call the API
   */
  public trackEvent(
    type: AnalyticsEvent['type'],
    businessId: string,
    userId?: string
  ) {
    this.submitTrackingEvent({ type, businessId, userId });
  }

  // --- Cron Job / Background Workers ---

  /**
   * CRON JOB: Daily Aggregation
   * Runs periodically to process raw PageViews and populate the DailyAnalytics table.
   * Performs an ETL (Extract, Transform, Load) process.
   */
  public runDailyAggregation() {
    console.log('[Cron Job] Starting Daily Analytics Aggregation...');
    
    const aggregationMap = new Map<string, {
      date: string;
      businessId: string;
      views: number;
      clicks: number;
      shares: number;
      userIds: Set<string>;
    }>();

    // 1. EXTRACT & TRANSFORM: Iterate through all raw events
    this.pageViewsTable.forEach(event => {
      const date = new Date(event.timestamp).toISOString().split('T')[0];
      const key = `${date}_${event.businessId}`;

      if (!aggregationMap.has(key)) {
        aggregationMap.set(key, {
          date,
          businessId: event.businessId,
          views: 0,
          clicks: 0,
          shares: 0,
          userIds: new Set()
        });
      }

      const entry = aggregationMap.get(key)!;

      if (event.type === 'view') {
        entry.views++;
      } else if (event.type === 'share') {
        entry.shares++;
      } else {
        entry.clicks++;
      }

      if (event.userId) {
        entry.userIds.add(event.userId);
      }
    });

    // 2. LOAD: Upsert into DailyAnalytics Table
    let updatedCount = 0;
    
    aggregationMap.forEach((data, key) => {
      // Find existing record in DailyAnalytics table (Composite Key: date + businessId)
      const existingIndex = this.dailyAnalyticsTable.findIndex(
        m => m.date === data.date && m.businessId === data.businessId
      );

      const metricRow: DailyMetric = {
        date: data.date,
        businessId: data.businessId,
        views: data.views,
        clicks: data.clicks,
        shares: data.shares,
        uniqueVisitors: data.userIds.size // Calculate cardinality
      };

      if (existingIndex > -1) {
        // Update existing row
        this.dailyAnalyticsTable[existingIndex] = metricRow;
      } else {
        // Insert new row
        this.dailyAnalyticsTable.push(metricRow);
      }
      updatedCount++;
    });

    // 3. CLEANUP: (Optional) Archive old raw events to keep storage light
    // Real DBs would move partitions. Here we keep last 7 days of raw data.
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const initialRawCount = this.pageViewsTable.length;
    this.pageViewsTable = this.pageViewsTable.filter(e => e.timestamp > sevenDaysAgo);
    
    this.commit();
    console.log(`[Cron Job] Aggregation Complete. Updated/Inserted ${updatedCount} daily records. Archived ${initialRawCount - this.pageViewsTable.length} raw events.`);
  }

  // --- Helper for Realtime UI (Write-through cache simulation) ---
  private incrementRealtimeCache(event: AnalyticsEvent) {
    const today = new Date().toISOString().split('T')[0];
    const index = this.dailyAnalyticsTable.findIndex(m => m.date === today && m.businessId === event.businessId);

    if (index === -1) {
      this.dailyAnalyticsTable.push({
        date: today,
        businessId: event.businessId,
        views: event.type === 'view' ? 1 : 0,
        clicks: ['view', 'share'].includes(event.type) ? 0 : 1,
        shares: event.type === 'share' ? 1 : 0,
        uniqueVisitors: event.userId ? 1 : 0
      });
    } else {
      const m = this.dailyAnalyticsTable[index];
      if (event.type === 'view') m.views++;
      else if (event.type === 'share') m.shares++;
      else m.clicks++;
      
      // Note: Accurately updating uniqueVisitors in realtime without the Set is hard, 
      // so we rely on the Cron Job for exact unique counts.
    }
    this.commit();
  }

  // Legacy Alias for CronService
  public aggregateEvents() {
      this.runDailyAggregation();
  }

  // --- Reporting / Read APIs ---

  public getBusinessMetrics(businessId: string, days: number = 7) {
    const result = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      const metric = this.dailyAnalyticsTable.find(m => m.date === dateStr && m.businessId === businessId) || {
        date: dateStr,
        businessId,
        views: 0,
        clicks: 0,
        shares: 0,
        uniqueVisitors: 0
      };
      result.push(metric);
    }
    return result;
  }

  public getBusinessLifetimeStats(businessId: string) {
    return this.dailyAnalyticsTable
        .filter(m => m.businessId === businessId)
        .reduce((acc, curr) => ({
            views: acc.views + curr.views,
            clicks: acc.clicks + curr.clicks,
            shares: acc.shares + curr.shares
        }), { views: 0, clicks: 0, shares: 0 });
  }

  public getGlobalMetrics(days: number = 7) {
    const result = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      const dayMetrics = this.dailyAnalyticsTable.filter(m => m.date === dateStr);
      
      result.push({
          date: dateStr,
          views: dayMetrics.reduce((sum, m) => sum + m.views, 0),
          clicks: dayMetrics.reduce((sum, m) => sum + m.clicks, 0)
      });
    }
    return result;
  }

  // --- Admin API Implementations ---

  public getAdminOverview(userRole: string) {
    if (userRole !== 'admin') throw new Error('Forbidden');

    const totalViews = this.dailyAnalyticsTable.reduce((acc, m) => acc + m.views, 0);
    
    // Revenue Calc (Same as before)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const monthlyRevenue = MOCK_TRANSACTIONS
        .filter(t => t.type === 'credit_purchase' && t.status === 'success' && new Date(t.date) >= thirtyDaysAgo)
        .reduce((sum, t) => sum + (t.amountNGN || 0), 0);

    const totalRevenue = MOCK_TRANSACTIONS
        .filter(t => t.type === 'credit_purchase' && t.status === 'success')
        .reduce((sum, t) => sum + (t.amountNGN || 0), 0);

    return {
      totalUsers: MOCK_USERS_LIST.length,
      activeUsersNow: Math.floor(Math.random() * 50) + 120, // Simulated Real-time
      activeBusinesses: MOCK_BUSINESSES.filter(b => b.isOpen).length,
      totalBusinesses: MOCK_BUSINESSES.length,
      totalReviews: MOCK_REVIEWS.length,
      pendingReports: MOCK_REVIEWS.filter(r => r.status === 'flagged').length,
      monthlyRevenue,
      totalRevenue,
      totalViews,
      trends: {
          business: { value: 3.4, isPositive: true },
          users: { value: 12.5, isPositive: true },
          reviews: { value: 5.2, isPositive: true },
          revenue: { value: 8.1, isPositive: true }
      }
    };
  }

  public getNewUsersTimeSeries(userRole: string, period: string = '30d') {
    if (userRole !== 'admin') throw new Error('Forbidden');
    const days = parseInt(period.replace('d', ''), 10) || 30;
    const data = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const seed = d.getDate() + d.getMonth();
        data.push({ date: dateStr, count: Math.floor((Math.sin(seed) + 1) * 5) + 2 });
    }
    return data;
  }

  public getBusinessCategoryDistribution(userRole: string = 'admin') {
      const distribution: Record<string, number> = {};
      MOCK_BUSINESSES.forEach(b => {
          distribution[b.category] = (distribution[b.category] || 0) + 1;
      });
      return Object.entries(distribution).map(([category, count]) => ({ 
          name: category, category, count, value: count 
      }));
  }

  // --- Dashboard Legacy Helpers ---

  public getDashboardTrends(days: number = 30) {
    const data = [];
    const today = new Date();
    let currentBusinesses = 45;
    
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        
        // Aggregate actual data from our table if available, else mock
        const dayMetrics = this.dailyAnalyticsTable.filter(m => m.date === dateStr);
        const actualViews = dayMetrics.reduce((sum, m) => sum + m.views, 0); // Used for visitor proxy

        const newUsers = Math.floor(Math.random() * 15) + 5;
        const newReviews = Math.floor(Math.random() * 25) + 10;
        if (Math.random() > 0.7) currentBusinesses++; 
        
        data.push({
            date: dateStr,
            newUsers,
            activeBusinesses: currentBusinesses,
            newReviews,
            visitorOnline: actualViews > 0 ? actualViews : Math.floor(Math.random() * 100) + 50
        });
    }
    return data;
  }

  public getCategoryDistribution() { return this.getBusinessCategoryDistribution('admin'); }
  
  public getRevenueAnalytics() {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({ name: day, revenue: Math.floor(Math.random() * 50000) + 10000 }));
  }

  public getRetentionStats() { return { rate: 72, trend: 2.1 }; }

  // --- Seeding ---

  private seedDataIfEmpty() {
    if (this.dailyAnalyticsTable.length > 0) return;
    console.log('[Analytics DB] Seeding initial data...');

    const today = new Date();
    
    MOCK_BUSINESSES.forEach(biz => {
        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            const isWeekend = date.getDay() === 5 || date.getDay() === 6;
            const baseViews = Math.floor(Math.random() * 20) + 10;
            const multiplier = isWeekend ? 1.5 : 1;
            const views = Math.floor(baseViews * multiplier);

            this.dailyAnalyticsTable.push({
                date: dateStr,
                businessId: biz.id,
                views: views,
                clicks: Math.floor(views * 0.2),
                shares: Math.floor(views * 0.05),
                uniqueVisitors: Math.floor(views * 0.8)
            });
        }
    });
    this.commit();
  }
}

export const analyticsService = new AnalyticsService();
