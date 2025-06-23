import { ShortenedURL, URLAnalytics } from '@/types/shorten.ts';
import { URLShortenerService } from './URLShortenerService.ts';

// Export formats
export type ExportFormat = 'csv' | 'json' | 'pdf';

// Export options
export interface ExportOptions {
  format: ExportFormat;
  includeAnalytics?: boolean;
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  fields?: string[];
}

// ExportService class
export class ExportService {
  // Export a single URL
  static exportURL(url: ShortenedURL, options: ExportOptions): string | Blob {
    switch (options.format) {
      case 'csv':
        return this.exportURLToCSV(url, options);
      case 'json':
        return this.exportURLToJSON(url, options);
      case 'pdf':
        return this.exportURLToPDF(url, options);
      default:
        throw new Error(`Unsupported export format: ${options.format}`);
    }
  }

  // Export multiple URLs
  static exportURLs(urls: ShortenedURL[], options: ExportOptions): string | Blob {
    switch (options.format) {
      case 'csv':
        return this.exportURLsToCSV(urls, options);
      case 'json':
        return this.exportURLsToJSON(urls, options);
      case 'pdf':
        return this.exportURLsToPDF(urls, options);
      default:
        throw new Error(`Unsupported export format: ${options.format}`);
    }
  }

  // Export URL analytics
  static exportAnalytics(urlId: string, options: ExportOptions): string | Blob {
    const analytics = URLShortenerService.getURLAnalytics(urlId);

    switch (options.format) {
      case 'csv':
        return this.exportAnalyticsToCSV(analytics, options);
      case 'json':
        return this.exportAnalyticsToJSON(analytics, options);
      case 'pdf':
        return this.exportAnalyticsToPDF(analytics, options);
      default:
        throw new Error(`Unsupported export format: ${options.format}`);
    }
  }

  // Helper methods for CSV export
  private static exportURLToCSV(url: ShortenedURL, options: ExportOptions): string {
    // Define CSV headers
    const headers = [
      'ID',
      'Original URL',
      'Short URL',
      'Short Code',
      'Created At',
      'Expires At',
      'Clicks',
      'Has Password',
      'Has Custom Alias',
      'Has UTM Parameters'
    ];

    // Define CSV row
    const row = [
      url.id,
      url.originalURL,
      url.shortURL,
      url.shortCode,
      url.createdAt,
      url.expiresAt || '',
      url.clicks.toString(),
      url.password ? 'Yes' : 'No',
      url.customAlias ? 'Yes' : 'No',
      url.utmParameters ? 'Yes' : 'No'
    ];

    // Create CSV content
    let csv = headers.join(',') + '\n';
    csv += row.join(',');

    // Include analytics if requested
    if (options.includeAnalytics) {
      const analytics = URLShortenerService.getURLAnalytics(url.id);
      csv += '\n\n' + this.analyticsToCSV(analytics, options);
    }

    return csv;
  }

  private static exportURLsToCSV(urls: ShortenedURL[], options: ExportOptions): string {
    // Define CSV headers
    const headers = [
      'ID',
      'Original URL',
      'Short URL',
      'Short Code',
      'Created At',
      'Expires At',
      'Clicks',
      'Has Password',
      'Has Custom Alias',
      'Has UTM Parameters'
    ];

    // Create CSV content
    let csv = headers.join(',') + '\n';

    // Add rows for each URL
    urls.forEach(url => {
      const row = [
        url.id,
        url.originalURL,
        url.shortURL,
        url.shortCode,
        url.createdAt,
        url.expiresAt || '',
        url.clicks.toString(),
        url.password ? 'Yes' : 'No',
        url.customAlias ? 'Yes' : 'No',
        url.utmParameters ? 'Yes' : 'No'
      ];

      csv += row.join(',') + '\n';
    });

    return csv;
  }

  private static analyticsToCSV(analytics: URLAnalytics, options: ExportOptions): string {
    let csv = '';

    // Add basic analytics
    csv += 'Basic Analytics\n';
    csv += 'Total Clicks,' + analytics.totalClicks + '\n';

    if (analytics.totalConversions !== undefined) {
      csv += 'Total Conversions,' + analytics.totalConversions + '\n';
      csv += 'Conversion Rate (%),' + analytics.conversionRate?.toFixed(2) + '\n';
    }

    // Add clicks by date
    csv += '\nClicks by Date\n';
    csv += 'Date,Clicks\n';
    Object.entries(analytics.clicksByDate).forEach(([date, clicks]) => {
      csv += `${date},${clicks}\n`;
    });

    // Add clicks by referrer
    csv += '\nClicks by Referrer\n';
    csv += 'Referrer,Clicks\n';
    Object.entries(analytics.clicksByReferrer).forEach(([referrer, clicks]) => {
      csv += `${referrer},${clicks}\n`;
    });

    // Add clicks by device
    csv += '\nClicks by Device\n';
    csv += 'Device,Clicks\n';
    Object.entries(analytics.clicksByDevice).forEach(([device, clicks]) => {
      csv += `${device},${clicks}\n`;
    });

    // Add clicks by country
    csv += '\nClicks by Country\n';
    csv += 'Country,Clicks\n';
    Object.entries(analytics.clicksByCountry).forEach(([country, clicks]) => {
      csv += `${country},${clicks}\n`;
    });

    // Add UTM data if available
    if (analytics.clicksByUtmSource && Object.keys(analytics.clicksByUtmSource).length > 0) {
      csv += '\nClicks by UTM Source\n';
      csv += 'UTM Source,Clicks\n';
      Object.entries(analytics.clicksByUtmSource).forEach(([source, clicks]) => {
        csv += `${source},${clicks}\n`;
      });
    }

    return csv;
  }

  private static exportAnalyticsToCSV(analytics: URLAnalytics, options: ExportOptions): string {
    return this.analyticsToCSV(analytics, options);
  }

  // Helper methods for JSON export
  private static exportURLToJSON(url: ShortenedURL, options: ExportOptions): string {
    const data: Record<string, unknown> = { ...url };

    // Include analytics if requested
    if (options.includeAnalytics) {
      data.analytics = URLShortenerService.getURLAnalytics(url.id);
    }

    return JSON.stringify(data, null, 2);
  }

  private static exportURLsToJSON(urls: ShortenedURL[], options: ExportOptions): string {
    return JSON.stringify(urls, null, 2);
  }

  private static exportAnalyticsToJSON(analytics: URLAnalytics, options: ExportOptions): string {
    return JSON.stringify(analytics, null, 2);
  }

  // Helper methods for PDF export (simplified - in a real app, would use a PDF library)
  private static exportURLToPDF(url: ShortenedURL, options: ExportOptions): Blob {
    // In a real implementation, this would use a PDF library
    // For now, we'll just convert the JSON to a Blob
    const json = this.exportURLToJSON(url, options);
    return new Blob([json], { type: 'application/pdf' });
  }

  private static exportURLsToPDF(urls: ShortenedURL[], options: ExportOptions): Blob {
    // In a real implementation, this would use a PDF library
    // For now, we'll just convert the JSON to a Blob
    const json = this.exportURLsToJSON(urls, options);
    return new Blob([json], { type: 'application/pdf' });
  }

  private static exportAnalyticsToPDF(analytics: URLAnalytics, options: ExportOptions): Blob {
    // In a real implementation, this would use a PDF library
    // For now, we'll just convert the JSON to a Blob
    const json = this.exportAnalyticsToJSON(analytics, options);
    return new Blob([json], { type: 'application/pdf' });
  }

  // Download helper
  static downloadFile(data: string | Blob, filename: string): void {
    const blob = typeof data === 'string' ? new Blob([data]) : data;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
