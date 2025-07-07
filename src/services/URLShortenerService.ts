/**
 * Optimized URLShortenerService using well-established libraries
 * Enhanced with additional optimization packages for better performance
 */
import { nanoid, customAlphabet } from 'nanoid';
import { get, set, del, clear, keys } from 'idb-keyval';
import { SHA256, PBKDF2 } from 'crypto-js';
import validator from 'validator';
import { LRUCache } from 'lru-cache';
import { UAParser } from 'ua-parser-js';
import { groupBy, countBy, sortBy, take, orderBy } from 'lodash-es';
import { format, parseISO, isValid } from 'date-fns';
import { ShortenedURL, URLClickData, URLOptions, URLAnalytics, GeoLocation } from '@/types/shorten.ts';
import { RateLimiterService } from './RateLimiterService.ts';

// Optimized constants
const DEFAULT_CODE_LENGTH = 6;
const BASE_URL = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8080';
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes
const DEFAULT_EXPIRATION_DAYS = 365;
const MAX_EXPIRATION_DAYS = 3650;

// Storage keys
const STORAGE_KEYS = {
  URLS: 'shortened_urls',
  CLICKS: 'url_clicks', 
  ANALYTICS: 'url_analytics_cache',
  SETTINGS: 'url_storage_settings',
  PERMANENT: 'permanent_urls'
} as const;

// Optimized ID generation using nanoid
const generateId = (): string => nanoid();
const generateShortCode = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', DEFAULT_CODE_LENGTH);

// Storage settings interface
interface StorageSettings {
  defaultExpirationDays: number;
  autoCleanup: boolean;
  enableBackup: boolean;
  maxStorageSize: number;
  compressionEnabled: boolean;
}

const DEFAULT_SETTINGS: StorageSettings = {
  defaultExpirationDays: DEFAULT_EXPIRATION_DAYS,
  autoCleanup: true,
  enableBackup: true,
  maxStorageSize: 50,
  compressionEnabled: true
};

/**
 * Optimized URLShortenerService using established libraries
 */
export class URLShortenerService {
  private static isInitialized = false;
  
  // Use LRU cache for better memory management and automatic cleanup
  private static cache = new LRUCache<string, any>({
    max: 200, // Maximum number of cached items
    ttl: CACHE_EXPIRY, // Auto-expire after 5 minutes
    updateAgeOnGet: true, // Reset TTL when accessed
    updateAgeOnHas: false // Don't reset TTL on existence check
  });
  
  private static cacheCleanupInterval: NodeJS.Timeout | null = null;
  
  // Initialize UAParser for device/browser detection
  private static uaParser = new UAParser();

  // Optimized password hashing using crypto-js
  static async hashPassword(password: string): Promise<string> {
    try {
      const salt = nanoid(16);
      const hash = PBKDF2(password, salt, { 
        keySize: 256/32, 
        iterations: 100000 
      }).toString();
      return `${salt}:${hash}`;
    } catch (error) {
      console.error('Error hashing password:', error);
      throw new Error('Failed to hash password');
    }
  }

  static async verifyPassword(password: string, storedHash: string): Promise<boolean> {
    try {
      const [salt, hash] = storedHash.split(':');
      const testHash = PBKDF2(password, salt, { 
        keySize: 256/32, 
        iterations: 100000 
      }).toString();
      return hash === testHash;
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    }
  }

  // Optimized URL validation using validator library
  static isValidURL(url: string): { valid: boolean; reason?: string; suspicious?: boolean } {
    if (!url) return { valid: false, reason: 'URL is required' };

    try {
      // Use validator for robust validation
      if (!validator.isURL(url, {
        protocols: ['http', 'https'],
        require_protocol: true,
        require_valid_protocol: true,
        allow_underscores: false,
        allow_trailing_dot: false,
        allow_protocol_relative_urls: false
      })) {
        return { valid: false, reason: 'Invalid URL format' };
      }

      const urlObj = new URL(url);
      
      // Security checks
      const suspicious = this.checkSuspiciousURL(urlObj);
      if (suspicious.isSuspicious) {
        return { valid: false, reason: suspicious.reason, suspicious: true };
      }

      return { valid: true };
    } catch (error) {
      return { valid: false, reason: 'Invalid URL' };
    }
  }

  private static checkSuspiciousURL(urlObj: URL): { isSuspicious: boolean; reason?: string } {
    const suspiciousTLDs = ['tk', 'ml', 'ga', 'cf'];
    const suspiciousPatterns = ['bit.ly', 'tinyurl.com', 'shorturl.at'];
    
    if (suspiciousTLDs.some(tld => urlObj.hostname.endsWith(`.${tld}`))) {
      return { isSuspicious: true, reason: 'Suspicious domain' };
    }
    
    if (suspiciousPatterns.some(pattern => urlObj.hostname.includes(pattern))) {
      return { isSuspicious: true, reason: 'URL shortener detected' };
    }
    
    return { isSuspicious: false };
  }

  // Optimized storage operations using idb-keyval
  static async getFromStorage<T>(key: string): Promise<T | null> {
    try {
      const result = await get(key);

      if (result === undefined || result === null) {
        return null;
      }

      return result;
    } catch (error) {
      console.error(`Error getting ${key} from storage:`, error);
      return null;
    }
  }

  private static async setToStorage<T>(key: string, value: T): Promise<void> {
    try {
      await set(key, value);
    } catch (error) {
      console.error(`Error setting ${key} to storage:`, error);
    }
  }

  private static async removeFromStorage(key: string): Promise<void> {
    try {
      await del(key);
    } catch (error) {
      console.error(`Error removing ${key} from storage:`, error);
    }
  }

  // Core functionality
  static async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Ensure storage is properly initialized
      await this.ensureStorageIntegrity();

      // Initialize storage and cleanup
      await this.performCleanup();
      this.startCacheCleanup();
      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing URLShortenerService:', error);
    }
  }

  // Ensure storage integrity
  private static async ensureStorageIntegrity(): Promise<void> {
    try {
      // Check if URLs storage exists and is valid
      const urls = await this.getFromStorage<any>(STORAGE_KEYS.URLS);
      if (urls !== null && !Array.isArray(urls)) {
        console.warn('URLs storage is corrupted, resetting to empty array');
        await this.setToStorage(STORAGE_KEYS.URLS, []);
      } else if (urls === null) {
        await this.setToStorage(STORAGE_KEYS.URLS, []);
      }

      // Check if clicks storage exists and is valid
      const clicks = await this.getFromStorage<any>(STORAGE_KEYS.CLICKS);
      if (clicks !== null && !Array.isArray(clicks)) {
        console.warn('Clicks storage is corrupted, resetting to empty array');
        await this.setToStorage(STORAGE_KEYS.CLICKS, []);
      } else if (clicks === null) {
        await this.setToStorage(STORAGE_KEYS.CLICKS, []);
      }

      // Check if permanent storage exists and is valid
      const permanent = await this.getFromStorage<any>(STORAGE_KEYS.PERMANENT);
      if (permanent !== null && !Array.isArray(permanent)) {
        console.warn('Permanent storage is corrupted, resetting to empty array');
        await this.setToStorage(STORAGE_KEYS.PERMANENT, []);
      } else if (permanent === null) {
        await this.setToStorage(STORAGE_KEYS.PERMANENT, []);
      }
    } catch (error) {
      console.error('Error ensuring storage integrity:', error);
      // If there's an error, clear all storage and start fresh
      await this.clearAllData();
      await this.setToStorage(STORAGE_KEYS.URLS, []);
      await this.setToStorage(STORAGE_KEYS.CLICKS, []);
      await this.setToStorage(STORAGE_KEYS.PERMANENT, []);
    }
  }

  // Enhanced cache management using LRU cache
  private static startCacheCleanup(): void {
    // Periodic cleanup every 10 minutes (LRU cache handles most cleanup automatically)
    this.cacheCleanupInterval = setInterval(() => {
      this.performCacheCleanup();
    }, 10 * 60 * 1000);
  }

  private static performCacheCleanup(): void {
    // LRU cache automatically handles size limits and TTL
    // This method can be used for additional cleanup logic if needed
    console.debug('Cache statistics:', {
      size: this.cache.size,
      maxSize: this.cache.max
    });
    
    // Force garbage collection of expired items
    this.cache.purgeStale();
  }

  private static getFromCache<T>(key: string): T | null {
    return this.cache.get(key) || null;
  }

  private static addToCache<T>(key: string, data: T): void {
    this.cache.set(key, data);
  }

  private static removeFromCache(key: string): void {
    this.cache.delete(key);
  }

  private static clearCache(): void {
    this.cache.clear();
  }

  static cleanup(): void {
    // Clear cache cleanup interval
    if (this.cacheCleanupInterval) {
      clearInterval(this.cacheCleanupInterval);
      this.cacheCleanupInterval = null;
    }
    
    // Clear cache
    this.cache.clear();
    this.isInitialized = false;
  }

  static async getURLs(): Promise<ShortenedURL[]> {
    try {
      const urls = await this.getFromStorage<ShortenedURL[]>(STORAGE_KEYS.URLS);

      // Ensure we always return an array
      if (!urls || !Array.isArray(urls)) {
        return [];
      }

      // Filter out expired URLs and invalid entries
      const filteredUrls = urls.filter(url => {
        try {
          return url &&
                 typeof url === 'object' &&
                 typeof url.id === 'string' &&
                 !this.isExpired(url);
        } catch (error) {
          console.warn('Error checking URL validity:', error, url);
          return false;
        }
      });

      return filteredUrls;
    } catch (error) {
      console.error('Error getting URLs:', error);
      return [];
    }
  }

  static async shortenURL(originalURL: string, options: URLOptions = {}): Promise<ShortenedURL> {
    // Rate limiting for URL shortening
    const rateLimitResult = await RateLimiterService.checkLimit(
      'url_shortening',
      async () => {
        try {
          // Input validation
          if (!originalURL || typeof originalURL !== 'string') {
            throw new Error('URL is required and must be a string');
          }
          
          return await this.performURLShortening(originalURL, options);
        } catch (error) {
          throw error;
        }
      },
      { maxAttempts: 10, windowMs: 60 * 1000, showToast: true } // 10 URLs per minute
    );

    if (!rateLimitResult.allowed) {
      throw new Error(rateLimitResult.error || 'Rate limit exceeded');
    }

    return rateLimitResult.result;
  }

  private static async performURLShortening(originalURL: string, options: URLOptions = {}): Promise<ShortenedURL> {
    try {

      const validation = this.isValidURL(originalURL);
      if (!validation.valid) {
        throw new Error(validation.reason || 'Invalid URL');
      }

      // Check custom alias availability
      let shortCode: string;
      if (options.customAlias) {
        if (typeof options.customAlias !== 'string' || options.customAlias.length < 3) {
          throw new Error('Custom alias must be at least 3 characters long');
        }
        
        const aliasAvailable = await this.isAliasAvailable(options.customAlias);
        if (!aliasAvailable) {
          throw new Error('Custom alias is already in use');
        }
        shortCode = options.customAlias;
      } else {
        shortCode = generateShortCode();
        
        // Ensure generated code is unique
        let attempts = 0;
        while (!(await this.isAliasAvailable(shortCode)) && attempts < 10) {
          shortCode = generateShortCode();
          attempts++;
        }
        
        if (attempts >= 10) {
          throw new Error('Unable to generate unique short code. Please try again.');
        }
      }

      // Validate expiration date
      let expiresAt: string | undefined;
      if (options.expiresAt) {
        const expDate = new Date(options.expiresAt);
        const now = new Date();
        const maxDate = new Date(now.getTime() + MAX_EXPIRATION_DAYS * 24 * 60 * 60 * 1000);
        
        if (expDate <= now) {
          throw new Error('Expiration date must be in the future');
        }
        if (expDate > maxDate) {
          throw new Error(`Expiration date cannot be more than ${MAX_EXPIRATION_DAYS} days in the future`);
        }
        expiresAt = expDate.toISOString();
      } else {
        expiresAt = new Date(Date.now() + DEFAULT_EXPIRATION_DAYS * 24 * 60 * 60 * 1000).toISOString();
      }

      const url: ShortenedURL = {
        id: generateId(),
        originalURL,
        shortCode,
        shortURL: `${BASE_URL}/${shortCode}`,
        createdAt: new Date().toISOString(),
        expiresAt,
        clicks: 0,
        password: options.password ? await this.hashPassword(options.password) : undefined,
        utmParameters: options.utmParameters,
        isSuspicious: validation.suspicious
      };

      // Save to storage
      const urls = await this.getURLs();
      urls.push(url);
      await this.setToStorage(STORAGE_KEYS.URLS, urls);

             return url;
     } catch (error) {
       console.error('Error in performURLShortening:', error);
       throw error instanceof Error ? error : new Error('Failed to shorten URL');
     }
  }

  static async getURLByShortCode(shortCode: string): Promise<ShortenedURL | null> {
    const urls = await this.getURLs();
    return urls.find(url => url.shortCode === shortCode) || null;
  }

  static async recordClick(shortCode: string, clickData: Partial<URLClickData> = {}): Promise<void> {
    try {
      // Input validation
      if (!shortCode || typeof shortCode !== 'string') {
        throw new Error('Short code is required and must be a string');
      }

      // Get the URL to get its ID
      const url = await this.getURLByShortCode(shortCode);
      if (!url) {
        throw new Error(`URL not found for short code: ${shortCode}`);
      }

      // Check if URL is expired
      if (this.isExpired(url)) {
        throw new Error('URL has expired');
      }

      // Validate click data
      if (clickData.conversionValue && (typeof clickData.conversionValue !== 'number' || clickData.conversionValue < 0)) {
        throw new Error('Conversion value must be a non-negative number');
      }

      if (clickData.sessionDuration && (typeof clickData.sessionDuration !== 'number' || clickData.sessionDuration < 0)) {
        throw new Error('Session duration must be a non-negative number');
      }

      const click: URLClickData = {
        id: generateId(),
        urlId: url.id,
        timestamp: new Date().toISOString(),
        referrer: clickData.referrer || document.referrer || undefined,
        device: clickData.device || this.detectDevice(),
        browser: clickData.browser || this.detectBrowser(),
        location: clickData.location || undefined,
        utmParameters: clickData.utmParameters,
        isConversion: clickData.isConversion || false,
        conversionType: clickData.conversionType,
        conversionValue: clickData.conversionValue,
        sessionDuration: clickData.sessionDuration,
        exitPage: clickData.exitPage
      };

      // Save click data
      const clicks = await this.getFromStorage<URLClickData[]>(STORAGE_KEYS.CLICKS) || [];
      clicks.push(click);
      await this.setToStorage(STORAGE_KEYS.CLICKS, clicks);

      // Update URL click count
      const urls = await this.getURLs();
      const urlIndex = urls.findIndex(url => url.shortCode === shortCode);
      if (urlIndex !== -1) {
        urls[urlIndex].clicks++;
        await this.setToStorage(STORAGE_KEYS.URLS, urls);
      }
    } catch (error) {
      console.error('Error recording click:', error);
      // Don't re-throw to avoid breaking user experience, but log the error
      if (error instanceof Error && error.message.includes('expired')) {
        console.warn(`Attempted to record click on expired URL: ${shortCode}`);
      }
    }
  }

  static async getURLAnalytics(urlId: string): Promise<URLAnalytics> {
    const cacheKey = `analytics_${urlId}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < CACHE_EXPIRY) {
      return cached.data;
    }

    try {
      const clicks = await this.getFromStorage<URLClickData[]>(STORAGE_KEYS.CLICKS) || [];
      const url = (await this.getURLs()).find(u => u.id === urlId);
      
      if (!url) {
        throw new Error('URL not found');
      }

      const urlClicks = clicks.filter(click => click.urlId === urlId);
      
      const analytics: URLAnalytics = {
        urlId,
        totalClicks: urlClicks.length,
        clicksByDate: this.groupByDate(urlClicks),
        clicksByReferrer: this.groupByField(urlClicks, 'referrer'),
        clicksByDevice: this.groupByField(urlClicks, 'device'),
        clicksByBrowser: this.groupByField(urlClicks, 'browser'),
        clicksByCountry: this.groupByLocationField(urlClicks, 'country'),
        clicksByRegion: this.groupByLocationField(urlClicks, 'region'),
        clicksByCity: this.groupByLocationField(urlClicks, 'city'),
        clicksByHour: this.groupByHour(urlClicks),
        clicksByDayOfWeek: this.groupByDayOfWeek(urlClicks),
        clicksByUtmSource: this.groupByUtmField(urlClicks, 'source'),
        clicksByUtmMedium: this.groupByUtmField(urlClicks, 'medium'),
        clicksByUtmCampaign: this.groupByUtmField(urlClicks, 'campaign'),
        clicksByUtmTerm: this.groupByUtmField(urlClicks, 'term'),
        clicksByUtmContent: this.groupByUtmField(urlClicks, 'content'),
        clicksTimeline: this.getClicksTimeline(urlClicks),
        totalConversions: urlClicks.filter(c => c.isConversion).length,
        conversionRate: urlClicks.length > 0 ? (urlClicks.filter(c => c.isConversion).length / urlClicks.length) * 100 : 0,
        conversionsByType: this.groupByField(urlClicks.filter(c => c.isConversion), 'conversionType'),
        conversionsByDate: this.groupByDate(urlClicks.filter(c => c.isConversion)),
        conversionValue: urlClicks.reduce((sum, click) => sum + (click.conversionValue || 0), 0)
      };

      this.addToCache(cacheKey, analytics);
      return analytics;
    } catch (error) {
      console.error('Error getting analytics:', error);
      throw error;
    }
  }

  // Utility methods
  private static isExpired(url: ShortenedURL): boolean {
    return url.expiresAt ? new Date(url.expiresAt) < new Date() : false;
  }

  private static async isAliasAvailable(alias: string): Promise<boolean> {
    const urls = await this.getURLs();
    return !urls.some(url => url.shortCode === alias);
  }

  // Enhanced device/browser detection using UAParser
  private static detectDevice(): string {
    try {
      this.uaParser.setUA(navigator.userAgent);
      const result = this.uaParser.getResult();
      
      const deviceType = result.device.type;
      if (deviceType === 'mobile') return 'Mobile';
      if (deviceType === 'tablet') return 'Tablet';
      if (deviceType === 'smarttv') return 'Smart TV';
      if (deviceType === 'wearable') return 'Wearable';
      if (deviceType === 'console') return 'Console';
      
      return 'Desktop';
    } catch (error) {
      console.warn('Error detecting device:', error);
      return 'Unknown';
    }
  }

  private static detectBrowser(): string {
    try {
      this.uaParser.setUA(navigator.userAgent);
      const result = this.uaParser.getResult();
      
      const browserName = result.browser.name;
      if (browserName) {
        return browserName;
      }
      
      return 'Unknown';
    } catch (error) {
      console.warn('Error detecting browser:', error);
      return 'Unknown';
    }
  }

  private static getDetailedUserAgent(): {
    browser: { name?: string; version?: string };
    os: { name?: string; version?: string };
    device: { vendor?: string; model?: string; type?: string };
  } {
    try {
      this.uaParser.setUA(navigator.userAgent);
      const result = this.uaParser.getResult();
      
      return {
        browser: {
          name: result.browser.name,
          version: result.browser.version
        },
        os: {
          name: result.os.name,
          version: result.os.version
        },
        device: {
          vendor: result.device.vendor,
          model: result.device.model,
          type: result.device.type
        }
      };
    } catch (error) {
      console.warn('Error getting detailed user agent:', error);
      return {
        browser: {},
        os: {},
        device: {}
      };
    }
  }

  // Enhanced grouping functions using lodash-es for better performance
  private static groupByField(clicks: URLClickData[], field: keyof URLClickData): Record<string, number> {
    return countBy(clicks, click => String(click[field] || 'Unknown'));
  }

  private static groupByLocationField(clicks: URLClickData[], field: keyof GeoLocation): Record<string, number> {
    return countBy(clicks, click => String(click.location?.[field] || 'Unknown'));
  }

  private static groupByUtmField(clicks: URLClickData[], field: string): Record<string, number> {
    return countBy(clicks, click => String(click.utmParameters?.[field] || 'Unknown'));
  }

  private static groupByDate(clicks: URLClickData[]): Record<string, number> {
    return countBy(clicks, click => {
      try {
        return format(parseISO(click.timestamp), 'yyyy-MM-dd');
      } catch (error) {
        return 'Invalid Date';
      }
    });
  }

  private static groupByHour(clicks: URLClickData[]): Record<string, number> {
    return countBy(clicks, click => {
      try {
        return format(parseISO(click.timestamp), 'HH');
      } catch (error) {
        return 'Unknown';
      }
    });
  }

  private static groupByDayOfWeek(clicks: URLClickData[]): Record<string, number> {
    return countBy(clicks, click => {
      try {
        return format(parseISO(click.timestamp), 'EEEE');
      } catch (error) {
        return 'Unknown';
      }
    });
  }

  private static getClicksTimeline(clicks: URLClickData[]): Array<{date: string, clicks: number}> {
    const timeline = this.groupByDate(clicks);
    return orderBy(
      Object.entries(timeline).map(([date, clicks]) => ({ date, clicks })),
      ['date'],
      ['asc']
    );
  }

  private static async performCleanup(): Promise<void> {
    try {
      const urls = await this.getFromStorage<ShortenedURL[]>(STORAGE_KEYS.URLS) || [];
      const activeUrls = urls.filter(url => !this.isExpired(url));
      
      if (activeUrls.length !== urls.length) {
        await this.setToStorage(STORAGE_KEYS.URLS, activeUrls);
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }

  // Additional utility methods
  static async deleteURL(id: string): Promise<boolean> {
    try {
      const urls = await this.getURLs();
      const filteredUrls = urls.filter(url => url.id !== id);
      
      if (filteredUrls.length !== urls.length) {
        await this.setToStorage(STORAGE_KEYS.URLS, filteredUrls);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting URL:', error);
      return false;
    }
  }

  static async updateURL(id: string, updates: Partial<ShortenedURL>): Promise<ShortenedURL | null> {
    try {
      const urls = await this.getURLs();
      const urlIndex = urls.findIndex(url => url.id === id);
      
      if (urlIndex !== -1) {
        urls[urlIndex] = { ...urls[urlIndex], ...updates };
        await this.setToStorage(STORAGE_KEYS.URLS, urls);
        return urls[urlIndex];
      }
      return null;
    } catch (error) {
      console.error('Error updating URL:', error);
      return null;
    }
  }

  static async clearAllData(): Promise<void> {
    try {
      await clear();
      this.cleanup(); // Use the new cleanup method
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }

  static async getStorageStats(): Promise<{
    totalUrls: number;
    totalClicks: number;
    activeUrls: number;
    expiredUrls: number;
  }> {
    try {
      const allUrls = await this.getFromStorage<ShortenedURL[]>(STORAGE_KEYS.URLS) || [];
      const clicks = await this.getFromStorage<URLClickData[]>(STORAGE_KEYS.CLICKS) || [];
      const activeUrls = allUrls.filter(url => !this.isExpired(url));

      return {
        totalUrls: allUrls.length,
        totalClicks: clicks.length,
        activeUrls: activeUrls.length,
        expiredUrls: allUrls.length - activeUrls.length
      };
    } catch (error) {
      console.error('Error getting storage stats:', error);
      return { totalUrls: 0, totalClicks: 0, activeUrls: 0, expiredUrls: 0 };
    }
  }

  // Permanent storage methods
  static async addToPermanentStorage(urlId: string): Promise<boolean> {
    try {
      const permanentUrls = await this.getFromStorage<string[]>(STORAGE_KEYS.PERMANENT) || [];
      if (!permanentUrls.includes(urlId)) {
        permanentUrls.push(urlId);
        await this.setToStorage(STORAGE_KEYS.PERMANENT, permanentUrls);
      }
      return true;
    } catch (error) {
      console.error('Error adding to permanent storage:', error);
      return false;
    }
  }

  static async removeFromPermanentStorage(urlId: string): Promise<boolean> {
    try {
      const permanentUrls = await this.getFromStorage<string[]>(STORAGE_KEYS.PERMANENT) || [];
      const filteredUrls = permanentUrls.filter(id => id !== urlId);
      await this.setToStorage(STORAGE_KEYS.PERMANENT, filteredUrls);
      return true;
    } catch (error) {
      console.error('Error removing from permanent storage:', error);
      return false;
    }
  }

  static isInPermanentStorage(urlId: string): boolean {
    // This is a synchronous check, so we'll need to cache the permanent storage data
    // For now, return false as a safe default
    return false;
  }

  static async isInPermanentStorageAsync(urlId: string): Promise<boolean> {
    try {
      const permanentUrls = await this.getFromStorage<string[]>(STORAGE_KEYS.PERMANENT) || [];
      return permanentUrls.includes(urlId);
    } catch (error) {
      console.error('Error checking permanent storage:', error);
      return false;
    }
  }
}
