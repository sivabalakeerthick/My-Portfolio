import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface WorkModes {
  remote: boolean;
  hybrid: boolean;
  onsite: boolean;
}

export interface PortfolioStats {
  resumeDownloads: number;
  lastResumeDownloadAt: string | null;
  projectClicks: { [key: string]: number };
  totalVisits: number;
}

export interface PortfolioConfig {
  openToWork: boolean;
  availabilityStatus: string;
  availabilityBadgeText: string;
  targetRole: string;
  noticePeriod: string;
  primaryLocation: string;
  workModes: WorkModes;
  projectVisibility: { [id: string]: boolean };
  projectFeatured: { [id: string]: boolean };
  freelanceStatus: 'Completed' | 'In Progress' | 'Active';
  freelanceLiveUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class PortfolioConfigService {
  private readonly CONFIG_KEY = 'sbk_portfolio_admin_config';
  private readonly STATS_KEY = 'sbk_portfolio_admin_stats';

  private defaultConfig: PortfolioConfig = {
    openToWork: true,
    availabilityStatus: 'Actively Seeking Opportunities',
    availabilityBadgeText: '✦ OPEN TO WORK • FULL STACK & AI',
    targetRole: 'Full Stack Engineer • Angular & Spring Boot',
    noticePeriod: 'Immediate to 30 Days',
    primaryLocation: 'Bengaluru, India',
    workModes: {
      remote: true,
      hybrid: true,
      onsite: true
    },
    projectVisibility: {
      'cognidoc': true,
      'inventory-system': true,
      'portfolio': true
    },
    projectFeatured: {
      'cognidoc': true,
      'inventory-system': true,
      'portfolio': true
    },
    freelanceStatus: 'Completed',
    freelanceLiveUrl: 'https://thivagar.vercel.app/'
  };

  private defaultStats: PortfolioStats = {
    resumeDownloads: 14,
    lastResumeDownloadAt: 'Today',
    projectClicks: {
      'cognidoc': 38,
      'inventory-system': 24,
      'portfolio': 19,
      'freelance-thivagar': 42
    },
    totalVisits: 186
  };

  private configSubject = new BehaviorSubject<PortfolioConfig>(this.loadConfig());
  public config$: Observable<PortfolioConfig> = this.configSubject.asObservable();

  private statsSubject = new BehaviorSubject<PortfolioStats>(this.loadStats());
  public stats$: Observable<PortfolioStats> = this.statsSubject.asObservable();

  constructor() {
    this.trackVisit();
  }

  // Current Values
  public get currentConfig(): PortfolioConfig {
    return this.configSubject.value;
  }

  public get currentStats(): PortfolioStats {
    return this.statsSubject.value;
  }

  // --- Configuration Management ---
  private loadConfig(): PortfolioConfig {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const raw = localStorage.getItem(this.CONFIG_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return {
            ...this.defaultConfig,
            ...parsed,
            workModes: { ...this.defaultConfig.workModes, ...(parsed.workModes || {}) },
            projectVisibility: { ...this.defaultConfig.projectVisibility, ...(parsed.projectVisibility || {}) },
            projectFeatured: { ...this.defaultConfig.projectFeatured, ...(parsed.projectFeatured || {}) }
          };
        }
      } catch (e) {
        console.warn('Failed to load portfolio config from localStorage', e);
      }
    }
    return { ...this.defaultConfig };
  }

  public updateConfig(partial: Partial<PortfolioConfig>): void {
    const updated: PortfolioConfig = {
      ...this.currentConfig,
      ...partial,
      workModes: {
        ...this.currentConfig.workModes,
        ...(partial.workModes || {})
      },
      projectVisibility: {
        ...this.currentConfig.projectVisibility,
        ...(partial.projectVisibility || {})
      },
      projectFeatured: {
        ...this.currentConfig.projectFeatured,
        ...(partial.projectFeatured || {})
      }
    };

    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(this.CONFIG_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Error saving portfolio config', e);
      }
    }

    this.configSubject.next(updated);
  }

  public resetConfig(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.removeItem(this.CONFIG_KEY);
      } catch (e) {
        console.warn('Error clearing config from localStorage', e);
      }
    }
    this.configSubject.next({ ...this.defaultConfig });
  }

  // --- Analytics & Tracking ---
  private loadStats(): PortfolioStats {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const raw = localStorage.getItem(this.STATS_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return {
            ...this.defaultStats,
            ...parsed,
            projectClicks: { ...this.defaultStats.projectClicks, ...(parsed.projectClicks || {}) }
          };
        }
      } catch (e) {
        console.warn('Failed to load portfolio stats from localStorage', e);
      }
    }
    return { ...this.defaultStats };
  }

  private saveStats(stats: PortfolioStats): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(this.STATS_KEY, JSON.stringify(stats));
      } catch (e) {
        console.warn('Error saving portfolio stats', e);
      }
    }
    this.statsSubject.next(stats);
  }

  public trackVisit(): void {
    if (typeof window === 'undefined') return;
    const stats = { ...this.currentStats };
    stats.totalVisits = (stats.totalVisits || 0) + 1;
    this.saveStats(stats);
  }

  public trackResumeDownload(): void {
    const stats = { ...this.currentStats };
    stats.resumeDownloads = (stats.resumeDownloads || 0) + 1;
    stats.lastResumeDownloadAt = new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
    this.saveStats(stats);
  }

  public trackProjectClick(projectId: string): void {
    const stats = { ...this.currentStats };
    stats.projectClicks = { ...stats.projectClicks };
    stats.projectClicks[projectId] = (stats.projectClicks[projectId] || 0) + 1;
    this.saveStats(stats);
  }

  public resetStats(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.removeItem(this.STATS_KEY);
      } catch (e) {
        console.warn('Error clearing stats from localStorage', e);
      }
    }
    this.statsSubject.next({
      resumeDownloads: 0,
      lastResumeDownloadAt: null,
      projectClicks: {},
      totalVisits: 1
    });
  }
}
