export interface ShortenedURL {
  id: string;              // Unique identifier
  originalURL: string;     // Original long URL
  shortCode: string;       // Short code/alias
  shortURL: string;        // Complete shortened URL
  createdAt: string;       // ISO date string
  expiresAt?: string;      // Optional expiration date
  password?: string;       // Optional password protection
  customAlias?: string;    // Optional custom alias
  utmParameters?: UTMParams; // Optional UTM parameters
  clicks: number;          // Number of clicks
  isSuspicious?: boolean;  // Flag for potentially suspicious URLs
  analytics?: URLAnalytics; // Optional analytics data
}

export interface URLClickData {
  id: string;              // Click identifier
  urlId: string;           // Reference to shortened URL
  timestamp: string;       // When the click occurred
  referrer?: string;       // Where the click came from
  device?: string;         // Device information
  browser?: string;        // Browser information
  location?: GeoLocation;  // Geographic location
  utmParameters?: UTMParams; // UTM parameters
  isConversion?: boolean;  // Whether this click resulted in a conversion
  conversionType?: string; // Type of conversion (e.g., "signup", "purchase")
  conversionValue?: number; // Value of the conversion (if applicable)
  sessionDuration?: number; // Duration of the session in seconds
  exitPage?: string;       // Last page visited before leaving
}

export interface GeoLocation {
  country?: string;
  city?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
}

export interface UTMParams {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  custom?: Record<string, string>;
  [key: string]: string | Record<string, string> | undefined;
}

export interface CampaignTemplate {
  id: string;
  name: string;
  description?: string;
  category: string;
  utmParameters: UTMParams;
  createdAt: string;
  updatedAt: string;
}

export interface URLOptions {
  customAlias?: string;
  expiresAt?: string;
  password?: string;
  utmParameters?: UTMParams;
}

export interface URLAnalytics {
  urlId: string;
  totalClicks: number;
  clicksByDate: Record<string, number>;
  clicksByReferrer: Record<string, number>;
  clicksByDevice: Record<string, number>;
  clicksByBrowser: Record<string, number>;
  clicksByCountry: Record<string, number>;
  clicksByRegion?: Record<string, number>;
  clicksByCity?: Record<string, number>;
  clicksByHour?: Record<string, number>;
  clicksByDayOfWeek?: Record<string, number>;
  clicksByUtmSource?: Record<string, number>;
  clicksByUtmMedium?: Record<string, number>;
  clicksByUtmCampaign?: Record<string, number>;
  clicksByUtmTerm?: Record<string, number>;
  clicksByUtmContent?: Record<string, number>;
  clicksByCustomUtm?: Record<string, Record<string, number>>;
  clicksTimeline: {
    date: string;
    clicks: number;
  }[];
  // Conversion metrics
  totalConversions?: number;
  conversionRate?: number;
  conversionsByType?: Record<string, number>;
  conversionsByDate?: Record<string, number>;
  conversionsByUtmSource?: Record<string, number>;
  conversionsByUtmMedium?: Record<string, number>;
  conversionsByUtmCampaign?: Record<string, number>;
  conversionValue?: number;
}

export interface ConversionGoal {
  id: string;
  urlId: string;
  name: string;
  type: 'pageview' | 'event' | 'purchase' | 'signup' | 'custom';
  targetValue?: number;
  currentValue?: number;
  createdAt: string;
  updatedAt: string;
  isCompleted?: boolean;
}
