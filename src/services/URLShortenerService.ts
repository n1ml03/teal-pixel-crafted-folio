import { ShortenedURL, URLClickData, URLOptions, URLAnalytics } from '@/types/shorten.ts';

// Constants
const URL_STORAGE_KEY = 'shortened_urls';
const CLICK_STORAGE_KEY = 'url_clicks';
const DEFAULT_CODE_LENGTH = 6;
const BASE_URL = window.location.origin;

// Helper to generate a unique ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
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
  // Validate URL
  static isValidURL(url: string): { valid: boolean; reason?: string } {
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

      return { valid: true };
    } catch (e) {
      return {
        valid: false,
        reason: 'Invalid URL format'
      };
    }
  }

  // Get all shortened URLs
  static getURLs(): ShortenedURL[] {
    try {
      const urlsJson = localStorage.getItem(URL_STORAGE_KEY);
      return urlsJson ? JSON.parse(urlsJson) : [];
    } catch (error) {
      console.error('Error getting URLs from localStorage:', error);
      return [];
    }
  }

  // Save URLs to localStorage
  private static saveURLs(urls: ShortenedURL[]): void {
    localStorage.setItem(URL_STORAGE_KEY, JSON.stringify(urls));
  }

  // Get URL by ID
  static getURLById(id: string): ShortenedURL | null {
    const urls = this.getURLs();
    return urls.find(url => url.id === id) || null;
  }

  // Get URL by short code
  static getURLByShortCode(shortCode: string): ShortenedURL | null {
    const urls = this.getURLs();
    return urls.find(url => url.shortCode === shortCode) || null;
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
    // Validate URL
    const validation = this.isValidURL(originalURL);
    if (!validation.valid) {
      throw new Error(validation.reason || 'Invalid URL. Please enter a valid URL.');
    }

    // Generate a unique ID
    const id = generateId();

    // Handle custom alias if provided
    let shortCode = generateShortCode();
    if (options?.customAlias) {
      const aliasValidation = this.validateAlias(options.customAlias);
      if (!aliasValidation.valid) {
        throw new Error(`Invalid custom alias: ${aliasValidation.reason}`);
      }
      shortCode = options.customAlias;
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
      originalURL,
      shortCode,
      shortURL,
      createdAt: new Date().toISOString(),
      expiresAt: options?.expiresAt,
      password: hashedPassword,
      customAlias: options?.customAlias,
      utmParameters: options?.utmParameters,
      clicks: 0
    };

    // Save to localStorage
    const urls = this.getURLs();
    this.saveURLs([...urls, shortenedURL]);

    return shortenedURL;
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
      const clicksJson = localStorage.getItem(CLICK_STORAGE_KEY);
      const clicks: URLClickData[] = clicksJson ? JSON.parse(clicksJson) : [];
      localStorage.setItem(CLICK_STORAGE_KEY, JSON.stringify([...clicks, click]));
    } catch (error) {
      console.error('Error saving click data to localStorage:', error);
    }
  }

  // Get analytics for a URL
  static getURLAnalytics(urlId: string): URLAnalytics {
    // Get all clicks for this URL
    const clicksJson = localStorage.getItem(CLICK_STORAGE_KEY);
    const allClicks: URLClickData[] = clicksJson ? JSON.parse(clicksJson) : [];
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
      conversionValue: 0,
      geoData: [],
      timeHeatmap: []
    };

    // Process clicks
    urlClicks.forEach(click => {
      // Process by date
      const date = click.timestamp.split('T')[0];
      analytics.clicksByDate[date] = (analytics.clicksByDate[date] || 0) + 1;

      // Process by hour
      const clickDate = new Date(click.timestamp);
      const hour = clickDate.getHours();
      analytics.clicksByHour![hour.toString()] = (analytics.clicksByHour![hour.toString()] || 0) + 1;

      // Process by day of week (0 = Sunday, 6 = Saturday)
      const dayOfWeek = clickDate.getDay();
      analytics.clicksByDayOfWeek![dayOfWeek.toString()] = (analytics.clicksByDayOfWeek![dayOfWeek.toString()] || 0) + 1;

      // Add to time heatmap
      analytics.timeHeatmap!.push({
        day: dayOfWeek,
        hour: hour,
        count: 1
      });

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

      // Process by location
      if (click.location) {
        // Process by country
        if (click.location.country) {
          analytics.clicksByCountry[click.location.country] = (analytics.clicksByCountry[click.location.country] || 0) + 1;

          // Add to geo data for map visualization
          const existingCountry = analytics.geoData!.find(item => item.country === click.location!.country);
          if (existingCountry) {
            existingCountry.count++;
          } else {
            analytics.geoData!.push({
              country: click.location.country,
              code: this.getCountryCode(click.location.country),
              count: 1,
              latitude: click.location.latitude,
              longitude: click.location.longitude
            });
          }
        }

        // Process by region
        if (click.location.region) {
          analytics.clicksByRegion![click.location.region] = (analytics.clicksByRegion![click.location.region] || 0) + 1;
        }

        // Process by city
        if (click.location.city) {
          analytics.clicksByCity![click.location.city] = (analytics.clicksByCity![click.location.city] || 0) + 1;
        }
      }

      // Process UTM parameters
      if (click.utmParameters) {
        // Process standard UTM parameters
        if (click.utmParameters.source && typeof click.utmParameters.source === 'string') {
          analytics.clicksByUtmSource![click.utmParameters.source] =
            (analytics.clicksByUtmSource![click.utmParameters.source] || 0) + 1;
        }

        if (click.utmParameters.medium && typeof click.utmParameters.medium === 'string') {
          analytics.clicksByUtmMedium![click.utmParameters.medium] =
            (analytics.clicksByUtmMedium![click.utmParameters.medium] || 0) + 1;
        }

        if (click.utmParameters.campaign && typeof click.utmParameters.campaign === 'string') {
          analytics.clicksByUtmCampaign![click.utmParameters.campaign] =
            (analytics.clicksByUtmCampaign![click.utmParameters.campaign] || 0) + 1;
        }

        if (click.utmParameters.term && typeof click.utmParameters.term === 'string') {
          analytics.clicksByUtmTerm![click.utmParameters.term] =
            (analytics.clicksByUtmTerm![click.utmParameters.term] || 0) + 1;
        }

        if (click.utmParameters.content && typeof click.utmParameters.content === 'string') {
          analytics.clicksByUtmContent![click.utmParameters.content] =
            (analytics.clicksByUtmContent![click.utmParameters.content] || 0) + 1;
        }

        // Process custom UTM parameters
        if (click.utmParameters.custom && typeof click.utmParameters.custom === 'object') {
          Object.entries(click.utmParameters.custom).forEach(([key, value]) => {
            if (!analytics.clicksByCustomUtm![key]) {
              analytics.clicksByCustomUtm![key] = {};
            }

            analytics.clicksByCustomUtm![key][value] = (analytics.clicksByCustomUtm![key][value] || 0) + 1;
          });
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
          if (click.utmParameters.source && typeof click.utmParameters.source === 'string') {
            analytics.conversionsByUtmSource![click.utmParameters.source] =
              (analytics.conversionsByUtmSource![click.utmParameters.source] || 0) + 1;
          }

          if (click.utmParameters.medium && typeof click.utmParameters.medium === 'string') {
            analytics.conversionsByUtmMedium![click.utmParameters.medium] =
              (analytics.conversionsByUtmMedium![click.utmParameters.medium] || 0) + 1;
          }

          if (click.utmParameters.campaign && typeof click.utmParameters.campaign === 'string') {
            analytics.conversionsByUtmCampaign![click.utmParameters.campaign] =
              (analytics.conversionsByUtmCampaign![click.utmParameters.campaign] || 0) + 1;
          }
        }
      }
    });

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

    return analytics;
  }

  // Helper to get country code from country name (simplified version)
  private static getCountryCode(countryName: string): string {
    const countryCodes: Record<string, string> = {
      'United States': 'US',
      'United Kingdom': 'GB',
      'Canada': 'CA',
      'Australia': 'AU',
      'Germany': 'DE',
      'France': 'FR',
      'Japan': 'JP',
      'China': 'CN',
      'India': 'IN',
      'Brazil': 'BR',
      'Mexico': 'MX',
      'Spain': 'ES',
      'Italy': 'IT',
      'Russia': 'RU',
      'Unknown': 'XX'
    };

    return countryCodes[countryName] || 'XX';
  }
}
