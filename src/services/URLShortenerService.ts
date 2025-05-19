import { ShortenedURL, URLClickData, URLOptions, URLAnalytics } from '@/types/shorten.ts';

// Constants
const URL_STORAGE_KEY = 'shortened_urls';
const CLICK_STORAGE_KEY = 'url_clicks';
const ANALYTICS_CACHE_KEY = 'url_analytics_cache';
const DEFAULT_CODE_LENGTH = 6;
const BASE_URL = window.location.origin;
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes in milliseconds

// Helper to generate a unique ID (using a more efficient method)
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};

// Helper to generate a random short code
const generateShortCode = (length: number = DEFAULT_CODE_LENGTH): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

// Helper to hash a password (simple client-side hashing)
// In a real application, this would be done server-side with a proper hashing algorithm
const hashPassword = (password: string): string => {
  // Simple hash function for demonstration purposes
  // DO NOT use this in production - use a proper hashing library
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  // Add salt and convert to hex string
  const salt = 'url-shortener-salt';
  const saltedHash = hash + salt.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return saltedHash.toString(16);
};

// URLShortenerService class
export class URLShortenerService {
  // Static initialization flag
  private static isInitialized = false;

  // List of potentially malicious TLDs and patterns
  private static suspiciousTLDs = [
    'xyz', 'top', 'club', 'gq', 'ml', 'cf', 'tk', 'ga'
  ];

  private static suspiciousDomainPatterns = [
    'login', 'signin', 'account', 'secure', 'banking', 'verify', 'wallet',
    'auth', 'confirm', 'update', 'payment', 'pay', 'billing', 'security'
  ];

  // Known phishing domains (this would be more extensive in a real application)
  private static knownMaliciousDomains = [
    'evil-site.com', 'phishing-example.com', 'malware-site.net'
  ];

  // Initialize the service
  static initialize(): void {
    if (this.isInitialized) return;

    // Load caches from localStorage
    this.getURLs(); // This will initialize URL cache
    this.loadAnalyticsCache();

    // Set initialization flag
    this.isInitialized = true;

    // Clean up expired URLs
    this.cleanupExpiredURLs();
  }

  // Clean up expired URLs to free up storage
  private static cleanupExpiredURLs(): void {
    const now = new Date();
    const urls = this.getURLs();

    const validURLs = urls.filter(url => {
      // Keep URLs without expiration or with future expiration
      return !url.expiresAt || new Date(url.expiresAt) > now;
    });

    // Only update if we removed some URLs
    if (validURLs.length < urls.length) {
      this.saveURLs(validURLs);
    }
  }

  // Validate URL
  static isValidURL(url: string): { valid: boolean; reason?: string; suspicious?: boolean } {
    try {
      // Try to parse the URL
      const parsedUrl = new URL(url);

      // Check protocol
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        return {
          valid: false,
          reason: 'URL must use http:// or https:// protocol'
        };
      }

      // Check if hostname is valid (not empty and has at least one dot)
      if (!parsedUrl.hostname || !parsedUrl.hostname.includes('.')) {
        return {
          valid: false,
          reason: 'URL must contain a valid domain name'
        };
      }

      // Check for common URL patterns that might be invalid
      if (parsedUrl.hostname === 'localhost' ||
          parsedUrl.hostname.startsWith('127.0.0.') ||
          parsedUrl.hostname === '0.0.0.0') {
        return {
          valid: false,
          reason: 'Local URLs cannot be shortened'
        };
      }

      // Check for extremely long URLs (over 2000 chars is problematic for some browsers)
      if (url.length > 2000) {
        return {
          valid: false,
          reason: 'URL is too long (maximum 2000 characters)'
        };
      }

      // Check for extremely long hostnames (potential IDN homograph attack)
      if (parsedUrl.hostname.length > 100) {
        return {
          valid: false,
          reason: 'Domain name is too long (maximum 100 characters)'
        };
      }

      // Check for too many subdomains (potential for confusion)
      const subdomainCount = parsedUrl.hostname.split('.').length - 1;
      if (subdomainCount > 5) {
        return {
          valid: false,
          reason: 'URL contains too many subdomains'
        };
      }

      // Check for known malicious domains
      if (this.knownMaliciousDomains.some(domain =>
          parsedUrl.hostname === domain || parsedUrl.hostname.endsWith(`.${domain}`))) {
        return {
          valid: false,
          reason: 'This URL has been identified as potentially malicious'
        };
      }

      // Check for suspicious TLDs
      const tld = parsedUrl.hostname.split('.').pop()?.toLowerCase();
      const hasSuspiciousTLD = tld ? this.suspiciousTLDs.includes(tld) : false;

      // Check for suspicious domain patterns
      const hasSuspiciousDomainPattern = this.suspiciousDomainPatterns.some(pattern =>
        parsedUrl.hostname.toLowerCase().includes(pattern));

      // Check for IP address in hostname (often suspicious)
      const isIPAddress = /^(\d{1,3}\.){3}\d{1,3}$/.test(parsedUrl.hostname);

      // Check for encoded characters in hostname (potential IDN homograph attack)
      const hasEncodedChars = parsedUrl.hostname.includes('%');

      // Check for excessive number of query parameters (potential for abuse)
      const queryParamCount = parsedUrl.searchParams.size;
      const hasExcessiveParams = queryParamCount > 15;

      // Check for suspicious URL patterns
      const hasSuspiciousURLPattern = /\.(exe|dll|bat|sh|cmd|msi|vbs|ps1)$/i.test(parsedUrl.pathname);

      // Flag as suspicious if any of the above checks are true
      const isSuspicious = hasSuspiciousTLD ||
                          hasSuspiciousDomainPattern ||
                          isIPAddress ||
                          hasEncodedChars ||
                          hasExcessiveParams ||
                          hasSuspiciousURLPattern;

      return {
        valid: true,
        suspicious: isSuspicious
      };
    } catch (e) {
      return {
        valid: false,
        reason: 'Invalid URL format'
      };
    }
  }

  // Cache for URLs to avoid repeated localStorage access
  private static urlCache: ShortenedURL[] | null = null;
  private static urlCacheTimestamp: number = 0;
  private static urlCacheByIdMap: Map<string, ShortenedURL> = new Map();
  private static urlCacheByShortCodeMap: Map<string, ShortenedURL> = new Map();

  // Get all shortened URLs with caching
  static getURLs(): ShortenedURL[] {
    const now = Date.now();

    // If cache is valid and not expired, use it
    if (this.urlCache !== null && (now - this.urlCacheTimestamp) < CACHE_EXPIRY) {
      return [...this.urlCache]; // Return a copy to prevent mutation
    }

    try {
      const urlsJson = localStorage.getItem(URL_STORAGE_KEY);
      const urls = urlsJson ? JSON.parse(urlsJson) : [];

      // Update cache
      this.urlCache = urls;
      this.urlCacheTimestamp = now;

      // Update lookup maps for faster access
      this.updateUrlLookupMaps(urls);

      return [...urls]; // Return a copy to prevent mutation
    } catch (error) {
      console.error('Error getting URLs from localStorage:', error);
      return [];
    }
  }

  // Update lookup maps for faster URL retrieval
  private static updateUrlLookupMaps(urls: ShortenedURL[]): void {
    this.urlCacheByIdMap.clear();
    this.urlCacheByShortCodeMap.clear();

    for (const url of urls) {
      this.urlCacheByIdMap.set(url.id, url);
      this.urlCacheByShortCodeMap.set(url.shortCode, url);
    }
  }

  // Save URLs to localStorage and update cache
  private static saveURLs(urls: ShortenedURL[]): void {
    localStorage.setItem(URL_STORAGE_KEY, JSON.stringify(urls));

    // Update cache
    this.urlCache = [...urls];
    this.urlCacheTimestamp = Date.now();

    // Update lookup maps
    this.updateUrlLookupMaps(urls);
  }

  // Get URL by ID (optimized with Map lookup)
  static getURLById(id: string): ShortenedURL | null {
    // Try to get from cache first
    if (this.urlCacheByIdMap.has(id)) {
      return this.urlCacheByIdMap.get(id) || null;
    }

    // If not in cache or cache expired, refresh cache and try again
    const urls = this.getURLs();
    return this.urlCacheByIdMap.get(id) || null;
  }

  // Get URL by short code (optimized with Map lookup)
  static getURLByShortCode(shortCode: string): ShortenedURL | null {
    // Try to get from cache first
    if (this.urlCacheByShortCodeMap.has(shortCode)) {
      return this.urlCacheByShortCodeMap.get(shortCode) || null;
    }

    // If not in cache or cache expired, refresh cache and try again
    const urls = this.getURLs();
    return this.urlCacheByShortCodeMap.get(shortCode) || null;
  }

  // Check if a custom alias is available
  static isAliasAvailable(alias: string): boolean {
    const urls = this.getURLs();
    return !urls.some(url => url.shortCode === alias);
  }

  // Validate a custom alias
  static validateAlias(alias: string): { valid: boolean; reason?: string } {
    // Check if alias is empty
    if (!alias || alias.trim() === '') {
      return { valid: false, reason: 'Custom alias cannot be empty' };
    }

    // Check if alias contains only allowed characters (alphanumeric, hyphens, and underscores)
    if (!/^[a-zA-Z0-9_-]+$/.test(alias)) {
      return { valid: false, reason: 'Custom alias can only contain letters, numbers, hyphens, and underscores' };
    }

    // Check if alias is too long (max 50 characters)
    if (alias.length > 50) {
      return { valid: false, reason: 'Custom alias is too long (maximum 50 characters)' };
    }

    // Check if alias is too short (min 3 characters)
    if (alias.length < 3) {
      return { valid: false, reason: 'Custom alias is too short (minimum 3 characters)' };
    }

    // Check if alias is available
    if (!this.isAliasAvailable(alias)) {
      return { valid: false, reason: 'This custom alias is already in use' };
    }

    return { valid: true };
  }

  // Validate a password
  static validatePassword(password: string): { valid: boolean; reason?: string } {
    // Check if password is empty
    if (!password || password.trim() === '') {
      return { valid: false, reason: 'Password cannot be empty' };
    }

    // Check if password is too short (min 6 characters)
    if (password.length < 6) {
      return { valid: false, reason: 'Password must be at least 6 characters long' };
    }

    return { valid: true };
  }

  // Verify a password against a stored hash
  static verifyPassword(password: string, hash: string): boolean {
    return hashPassword(password) === hash;
  }

  // Helper to append UTM parameters to a URL
  static appendUtmParameters(url: string, utmParams?: Record<string, string | Record<string, string>>): string {
    if (!utmParams || Object.keys(utmParams).length === 0) {
      return url;
    }

    try {
      const parsedUrl = new URL(url);

      // Add standard UTM parameters
      if (utmParams.source && typeof utmParams.source === 'string')
        parsedUrl.searchParams.set('utm_source', utmParams.source);

      if (utmParams.medium && typeof utmParams.medium === 'string')
        parsedUrl.searchParams.set('utm_medium', utmParams.medium);

      if (utmParams.campaign && typeof utmParams.campaign === 'string')
        parsedUrl.searchParams.set('utm_campaign', utmParams.campaign);

      if (utmParams.term && typeof utmParams.term === 'string')
        parsedUrl.searchParams.set('utm_term', utmParams.term);

      if (utmParams.content && typeof utmParams.content === 'string')
        parsedUrl.searchParams.set('utm_content', utmParams.content);

      // Add custom UTM parameters
      if (utmParams.custom && typeof utmParams.custom === 'object') {
        Object.entries(utmParams.custom).forEach(([key, value]) => {
          if (value) {
            parsedUrl.searchParams.set(`utm_${key}`, value);
          }
        });
      }

      // Add any other UTM parameters (legacy support)
      Object.entries(utmParams).forEach(([key, value]) => {
        if (
          !['source', 'medium', 'campaign', 'term', 'content', 'custom'].includes(key) &&
          typeof value === 'string' &&
          value
        ) {
          parsedUrl.searchParams.set(`utm_${key}`, value);
        }
      });

      return parsedUrl.toString();
    } catch (error) {
      console.error('Error appending UTM parameters:', error);
      return url;
    }
  }

  // Validate UTM parameters
  static validateUtmParameters(utmParams: Record<string, string | Record<string, string>>): { valid: boolean; reason?: string } {
    // Check if source is provided (required for UTM tracking)
    if (!utmParams.source || (typeof utmParams.source === 'string' && utmParams.source.trim() === '')) {
      return { valid: false, reason: 'UTM Source is required for campaign tracking' };
    }

    // Check for invalid characters in standard UTM parameters
    const invalidCharsRegex = /[^\w\s\-_.]/;
    const standardParams = ['source', 'medium', 'campaign', 'term', 'content'];

    for (const key of standardParams) {
      const value = utmParams[key];
      if (value && typeof value === 'string' && invalidCharsRegex.test(value)) {
        return {
          valid: false,
          reason: `UTM ${key} contains invalid characters. Use only letters, numbers, underscores, hyphens, and periods.`
        };
      }
    }

    // Check custom UTM parameters
    if (utmParams.custom && typeof utmParams.custom === 'object') {
      // Validate custom parameter names
      for (const [key, value] of Object.entries(utmParams.custom)) {
        // Check parameter name
        if (invalidCharsRegex.test(key)) {
          return {
            valid: false,
            reason: `Custom UTM parameter name "${key}" contains invalid characters. Use only letters, numbers, underscores, hyphens, and periods.`
          };
        }

        // Check parameter value
        if (value && invalidCharsRegex.test(value)) {
          return {
            valid: false,
            reason: `Custom UTM parameter "${key}" contains invalid characters. Use only letters, numbers, underscores, hyphens, and periods.`
          };
        }

        // Check for reserved parameter names
        if (standardParams.includes(key)) {
          return {
            valid: false,
            reason: `"${key}" is a standard UTM parameter and cannot be used as a custom parameter name.`
          };
        }
      }
    }

    return { valid: true };
  }

  // Create a shortened URL
  static shortenURL(originalURL: string, options?: URLOptions): ShortenedURL {
    try {
      // Sanitize the URL
      const sanitizedURL = originalURL.trim();

      // Validate URL
      const validation = this.isValidURL(sanitizedURL);
      if (!validation.valid) {
        throw new Error(validation.reason || 'Invalid URL. Please enter a valid URL.');
      }

      // Check if URL is suspicious
      if (validation.suspicious) {
        // We'll still allow it but log a warning
        console.warn('Potentially suspicious URL detected:', sanitizedURL);
      }

      // Generate a unique ID
      const id = generateId();

      // Handle custom alias if provided
      let shortCode = generateShortCode();
      if (options?.customAlias) {
        // Sanitize the custom alias
        const sanitizedAlias = options.customAlias.trim();

        const aliasValidation = this.validateAlias(sanitizedAlias);
        if (!aliasValidation.valid) {
          throw new Error(`Invalid custom alias: ${aliasValidation.reason}`);
        }
        shortCode = sanitizedAlias;
      }

      // Create the short URL
      const shortURL = `${BASE_URL}/s/${shortCode}`;

      // Hash password if provided
      let hashedPassword: string | undefined;
      if (options?.password) {
        const passwordValidation = this.validatePassword(options.password);
        if (!passwordValidation.valid) {
          throw new Error(`Invalid password: ${passwordValidation.reason}`);
        }
        hashedPassword = hashPassword(options.password);
      }

      // Validate UTM parameters if provided
      if (options?.utmParameters && Object.keys(options.utmParameters).length > 0) {
        const utmValidation = this.validateUtmParameters(options.utmParameters);
        if (!utmValidation.valid) {
          throw new Error(`Invalid UTM parameters: ${utmValidation.reason}`);
        }
      }

      // Create the shortened URL object
      const shortenedURL: ShortenedURL = {
        id,
        originalURL: sanitizedURL,
        shortCode,
        shortURL,
        createdAt: new Date().toISOString(),
        expiresAt: options?.expiresAt,
        password: hashedPassword,
        customAlias: options?.customAlias,
        utmParameters: options?.utmParameters,
        clicks: 0,
        isSuspicious: validation.suspicious || false
      };

      // Save to localStorage
      const urls = this.getURLs();
      this.saveURLs([...urls, shortenedURL]);

      return shortenedURL;
    } catch (error) {
      // Generic error handling to avoid exposing sensitive information
      if (error instanceof Error) {
        throw error; // Re-throw the original error with its message
      } else {
        // For unknown errors, provide a generic message
        throw new Error('An error occurred while shortening the URL. Please try again.');
      }
    }
  }

  // Update a shortened URL
  static updateURL(id: string, updates: Partial<ShortenedURL>): ShortenedURL | null {
    const urls = this.getURLs();
    const urlIndex = urls.findIndex(url => url.id === id);

    if (urlIndex === -1) {
      return null;
    }

    // Create updated URL object
    const updatedURL = {
      ...urls[urlIndex],
      ...updates
    };

    // Update in array
    urls[urlIndex] = updatedURL;

    // Save to localStorage
    this.saveURLs(urls);

    // Clear analytics cache for this URL
    this.clearAnalyticsCache(id);

    return updatedURL;
  }

  // Delete a shortened URL
  static deleteURL(id: string): boolean {
    const urls = this.getURLs();
    const filteredURLs = urls.filter(url => url.id !== id);

    if (filteredURLs.length === urls.length) {
      return false; // URL not found
    }

    // Save to localStorage
    this.saveURLs(filteredURLs);

    // Clear analytics cache for this URL
    this.clearAnalyticsCache(id);

    // Also remove click data for this URL to free up storage
    try {
      const clicksJson = localStorage.getItem(CLICK_STORAGE_KEY);
      if (clicksJson) {
        const clicks: URLClickData[] = JSON.parse(clicksJson);
        const filteredClicks = clicks.filter(click => click.urlId !== id);

        // Only update if we actually removed something
        if (filteredClicks.length < clicks.length) {
          localStorage.setItem(CLICK_STORAGE_KEY, JSON.stringify(filteredClicks));

          // Update clicks cache
          this.clicksCache = filteredClicks;
          this.clicksCacheTimestamp = Date.now();
        }
      }
    } catch (error) {
      console.error('Error removing click data from localStorage:', error);
    }

    return true;
  }

  // Record a click on a shortened URL
  static recordClick(shortCode: string, clickData: Partial<URLClickData> = {}): void {
    // Find the URL
    const url = this.getURLByShortCode(shortCode);

    if (!url) {
      return;
    }

    // Update click count
    this.updateURL(url.id, { clicks: url.clicks + 1 });

    // Create click data
    const click: URLClickData = {
      id: generateId(),
      urlId: url.id,
      timestamp: new Date().toISOString(),
      ...clickData
    };

    // Save click data
    try {
      // Batch update to reduce localStorage operations
      const clicksJson = localStorage.getItem(CLICK_STORAGE_KEY);
      const clicks: URLClickData[] = clicksJson ? JSON.parse(clicksJson) : [];

      // Add new click
      clicks.push(click);

      // Save back to localStorage
      localStorage.setItem(CLICK_STORAGE_KEY, JSON.stringify(clicks));

      // Update clicks cache
      this.clicksCache = clicks;
      this.clicksCacheTimestamp = Date.now();

      // Clear analytics cache for this URL to ensure fresh data
      this.clearAnalyticsCache(url.id);
    } catch (error) {
      console.error('Error saving click data to localStorage:', error);
    }
  }

  // Cache for analytics data
  private static analyticsCache: Map<string, { data: URLAnalytics, timestamp: number }> = new Map();
  private static clicksCache: URLClickData[] | null = null;
  private static clicksCacheTimestamp: number = 0;

  // Get all clicks with caching
  private static getAllClicks(): URLClickData[] {
    const now = Date.now();

    // If cache is valid and not expired, use it
    if (this.clicksCache !== null && (now - this.clicksCacheTimestamp) < CACHE_EXPIRY) {
      return [...this.clicksCache]; // Return a copy to prevent mutation
    }

    try {
      const clicksJson = localStorage.getItem(CLICK_STORAGE_KEY);
      const clicks = clicksJson ? JSON.parse(clicksJson) : [];

      // Update cache
      this.clicksCache = clicks;
      this.clicksCacheTimestamp = now;

      return [...clicks]; // Return a copy to prevent mutation
    } catch (error) {
      console.error('Error getting clicks from localStorage:', error);
      return [];
    }
  }

  // Get analytics for a URL with caching
  static getURLAnalytics(urlId: string): URLAnalytics {
    const now = Date.now();

    // Check if we have a valid cached version
    const cachedAnalytics = this.analyticsCache.get(urlId);
    if (cachedAnalytics && (now - cachedAnalytics.timestamp) < CACHE_EXPIRY) {
      return { ...cachedAnalytics.data }; // Return a copy to prevent mutation
    }

    // Get all clicks for this URL
    const allClicks = this.getAllClicks();
    const urlClicks = allClicks.filter(click => click.urlId === urlId);

    // Initialize analytics object
    const analytics: URLAnalytics = {
      urlId,
      totalClicks: urlClicks.length,
      clicksByDate: {},
      clicksByReferrer: {},
      clicksByDevice: {},
      clicksByBrowser: {},
      clicksByCountry: {},
      clicksByRegion: {},
      clicksByCity: {},
      clicksByHour: {},
      clicksByDayOfWeek: {},
      clicksByUtmSource: {},
      clicksByUtmMedium: {},
      clicksByUtmCampaign: {},
      clicksByUtmTerm: {},
      clicksByUtmContent: {},
      clicksByCustomUtm: {},
      clicksTimeline: [],
      totalConversions: 0,
      conversionRate: 0,
      conversionsByType: {},
      conversionsByDate: {},
      conversionsByUtmSource: {},
      conversionsByUtmMedium: {},
      conversionsByUtmCampaign: {},
      conversionValue: 0
    };

    // Process clicks more efficiently
    for (const click of urlClicks) {
      // Process by date
      const date = click.timestamp.split('T')[0];
      analytics.clicksByDate[date] = (analytics.clicksByDate[date] || 0) + 1;

      // Process by hour and day of week more efficiently
      const clickDate = new Date(click.timestamp);
      const hour = clickDate.getHours();
      const hourStr = hour.toString();
      analytics.clicksByHour![hourStr] = (analytics.clicksByHour![hourStr] || 0) + 1;

      const dayOfWeek = clickDate.getDay();
      const dayStr = dayOfWeek.toString();
      analytics.clicksByDayOfWeek![dayStr] = (analytics.clicksByDayOfWeek![dayStr] || 0) + 1;

      // Process by referrer
      if (click.referrer) {
        analytics.clicksByReferrer[click.referrer] = (analytics.clicksByReferrer[click.referrer] || 0) + 1;
      }

      // Process by device
      if (click.device) {
        analytics.clicksByDevice[click.device] = (analytics.clicksByDevice[click.device] || 0) + 1;
      }

      // Process by browser
      if (click.browser) {
        analytics.clicksByBrowser[click.browser] = (analytics.clicksByBrowser[click.browser] || 0) + 1;
      }

      // Process by location more efficiently
      if (click.location?.country) {
        const country = click.location.country;
        analytics.clicksByCountry[country] = (analytics.clicksByCountry[country] || 0) + 1;

        // Process by region
        if (click.location.region) {
          const region = click.location.region;
          analytics.clicksByRegion![region] = (analytics.clicksByRegion![region] || 0) + 1;
        }

        // Process by city
        if (click.location.city) {
          const city = click.location.city;
          analytics.clicksByCity![city] = (analytics.clicksByCity![city] || 0) + 1;
        }
      }

      // Process UTM parameters more efficiently
      if (click.utmParameters) {
        const utm = click.utmParameters;

        // Process standard UTM parameters
        if (utm.source && typeof utm.source === 'string') {
          analytics.clicksByUtmSource![utm.source] = (analytics.clicksByUtmSource![utm.source] || 0) + 1;
        }

        if (utm.medium && typeof utm.medium === 'string') {
          analytics.clicksByUtmMedium![utm.medium] = (analytics.clicksByUtmMedium![utm.medium] || 0) + 1;
        }

        if (utm.campaign && typeof utm.campaign === 'string') {
          analytics.clicksByUtmCampaign![utm.campaign] = (analytics.clicksByUtmCampaign![utm.campaign] || 0) + 1;
        }

        if (utm.term && typeof utm.term === 'string') {
          analytics.clicksByUtmTerm![utm.term] = (analytics.clicksByUtmTerm![utm.term] || 0) + 1;
        }

        if (utm.content && typeof utm.content === 'string') {
          analytics.clicksByUtmContent![utm.content] = (analytics.clicksByUtmContent![utm.content] || 0) + 1;
        }

        // Process custom UTM parameters
        if (utm.custom && typeof utm.custom === 'object') {
          for (const [key, value] of Object.entries(utm.custom)) {
            if (!analytics.clicksByCustomUtm![key]) {
              analytics.clicksByCustomUtm![key] = {};
            }
            analytics.clicksByCustomUtm![key][value] = (analytics.clicksByCustomUtm![key][value] || 0) + 1;
          }
        }
      }

      // Process conversion data
      if (click.isConversion) {
        analytics.totalConversions!++;

        // Add conversion value
        if (click.conversionValue) {
          analytics.conversionValue! += click.conversionValue;
        }

        // Process by conversion type
        if (click.conversionType) {
          analytics.conversionsByType![click.conversionType] =
            (analytics.conversionsByType![click.conversionType] || 0) + 1;
        }

        // Process by date
        analytics.conversionsByDate![date] = (analytics.conversionsByDate![date] || 0) + 1;

        // Process by UTM parameters
        if (click.utmParameters) {
          const utm = click.utmParameters;

          if (utm.source && typeof utm.source === 'string') {
            analytics.conversionsByUtmSource![utm.source] =
              (analytics.conversionsByUtmSource![utm.source] || 0) + 1;
          }

          if (utm.medium && typeof utm.medium === 'string') {
            analytics.conversionsByUtmMedium![utm.medium] =
              (analytics.conversionsByUtmMedium![utm.medium] || 0) + 1;
          }

          if (utm.campaign && typeof utm.campaign === 'string') {
            analytics.conversionsByUtmCampaign![utm.campaign] =
              (analytics.conversionsByUtmCampaign![utm.campaign] || 0) + 1;
          }
        }
      }
    }

    // No time heatmap or geo data processing needed

    // Calculate conversion rate
    analytics.conversionRate = urlClicks.length > 0
      ? (analytics.totalConversions! / urlClicks.length) * 100
      : 0;

    // Create timeline data
    const dates = Object.keys(analytics.clicksByDate).sort();
    analytics.clicksTimeline = dates.map(date => ({
      date,
      clicks: analytics.clicksByDate[date]
    }));

    // Cache the result
    this.analyticsCache.set(urlId, { data: analytics, timestamp: now });

    // Also save to localStorage for persistence across sessions
    try {
      const analyticsCache = JSON.parse(localStorage.getItem(ANALYTICS_CACHE_KEY) || '{}');
      analyticsCache[urlId] = { data: analytics, timestamp: now };
      localStorage.setItem(ANALYTICS_CACHE_KEY, JSON.stringify(analyticsCache));
    } catch (error) {
      console.error('Error saving analytics cache to localStorage:', error);
    }

    return analytics;
  }

  // Clear analytics cache for a specific URL
  static clearAnalyticsCache(urlId: string): void {
    this.analyticsCache.delete(urlId);

    try {
      const analyticsCache = JSON.parse(localStorage.getItem(ANALYTICS_CACHE_KEY) || '{}');
      delete analyticsCache[urlId];
      localStorage.setItem(ANALYTICS_CACHE_KEY, JSON.stringify(analyticsCache));
    } catch (error) {
      console.error('Error updating analytics cache in localStorage:', error);
    }
  }

  // Load analytics cache from localStorage
  static loadAnalyticsCache(): void {
    try {
      const analyticsCache = JSON.parse(localStorage.getItem(ANALYTICS_CACHE_KEY) || '{}');

      for (const [urlId, cacheEntry] of Object.entries(analyticsCache)) {
        // Type assertion to help TypeScript understand the structure
        const entry = cacheEntry as { data: URLAnalytics, timestamp: number };
        this.analyticsCache.set(urlId, entry);
      }
    } catch (error) {
      console.error('Error loading analytics cache from localStorage:', error);
    }
  }

  // No longer need the getCountryCode method
}
