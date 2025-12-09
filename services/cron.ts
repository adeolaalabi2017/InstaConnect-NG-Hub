import { analyticsService } from './analytics';

class CronService {
  private intervalId: any = null;
  // Run every 60 seconds to check if jobs need to run
  // In a real app, this might rely on Service Workers or Backend triggers
  private CHECK_INTERVAL = 60 * 1000; 

  public init() {
    if (this.intervalId) return;
    
    console.log('[Cron Service] Scheduler started.');
    
    // Run immediately on startup
    this.runJobs();

    this.intervalId = setInterval(() => {
      this.runJobs();
    }, this.CHECK_INTERVAL);
  }

  public stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private runJobs() {
    const now = new Date();
    
    // Job 1: Analytics Aggregation
    // In a real scenario, this might check if it's 00:00 UTC. 
    // Here we just call the aggregate method which handles its own logic (e.g. clean up old events).
    try {
        analyticsService.aggregateEvents();
    } catch (e) {
        console.error('[Cron Service] Analytics job failed:', e);
    }

    // Job 2: Check for expired promotions (Simulation)
    // const expiredPromos = checkExpiredPromotions();
    // if(expiredPromos.length > 0) notifyUsers(expiredPromos);
    
    console.log(`[Cron Service] Jobs executed at ${now.toISOString()}`);
  }
}

export const cronService = new CronService();