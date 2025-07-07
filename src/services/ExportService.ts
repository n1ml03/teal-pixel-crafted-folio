/**
 * Optimized ExportService using well-established libraries
 * Replaced custom implementations with battle-tested packages
 */
import { ShortenedURL, URLAnalytics } from '@/types/shorten.ts';
import { URLShortenerService } from './URLShortenerService.ts';
import Papa from 'papaparse';
import { jsPDF } from 'jspdf';
import { format, parseISO } from 'date-fns';
import { pick, omit } from 'lodash-es';

// Export formats
export type ExportFormat = 'csv' | 'json' | 'pdf';

// Enhanced export options
export interface ExportOptions {
  format: ExportFormat;
  includeAnalytics?: boolean;
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  fields?: string[];
  filename?: string;
  title?: string;
  includeCharts?: boolean;
  compression?: boolean;
}

// Default export fields for different data types
const DEFAULT_URL_FIELDS = [
  'id',
  'originalURL',
  'shortURL',
  'shortCode',
  'createdAt',
  'expiresAt',
  'clicks',
  'hasPassword',
  'hasCustomAlias',
  'hasUtmParameters'
];

const DEFAULT_ANALYTICS_FIELDS = [
  'totalClicks',
  'totalConversions',
  'conversionRate',
  'clicksByDate',
  'clicksByReferrer',
  'clicksByDevice',
  'clicksByCountry'
];

/**
 * Optimized ExportService using established libraries
 */
export class ExportService {
  // Export a single URL with enhanced options
  static async exportURL(url: ShortenedURL, options: ExportOptions): Promise<string | Blob> {
    try {
      switch (options.format) {
        case 'csv':
          return await this.exportURLToCSV(url, options);
        case 'json':
          return await this.exportURLToJSON(url, options);
        case 'pdf':
          return await this.exportURLToPDF(url, options);
        default:
          throw new Error(`Unsupported export format: ${options.format}`);
      }
    } catch (error) {
      console.error('Error exporting URL:', error);
      throw new Error(`Failed to export URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Export multiple URLs with enhanced filtering
  static async exportURLs(urls: ShortenedURL[], options: ExportOptions): Promise<string | Blob> {
    try {
      // Filter URLs by date range if specified
      let filteredUrls = urls;
      if (options.dateRange) {
        const startDate = parseISO(options.dateRange.startDate);
        const endDate = parseISO(options.dateRange.endDate);
        
        filteredUrls = urls.filter(url => {
          const urlDate = parseISO(url.createdAt);
          return urlDate >= startDate && urlDate <= endDate;
        });
      }

      switch (options.format) {
        case 'csv':
          return this.exportURLsToCSV(filteredUrls, options);
        case 'json':
          return this.exportURLsToJSON(filteredUrls, options);
        case 'pdf':
          return await this.exportURLsToPDF(filteredUrls, options);
        default:
          throw new Error(`Unsupported export format: ${options.format}`);
      }
    } catch (error) {
      console.error('Error exporting URLs:', error);
      throw new Error(`Failed to export URLs: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Export URL analytics with enhanced data processing
  static async exportAnalytics(urlId: string, options: ExportOptions): Promise<string | Blob> {
    try {
      const analytics = await URLShortenerService.getURLAnalytics(urlId);

      switch (options.format) {
        case 'csv':
          return this.exportAnalyticsToCSV(analytics, options);
        case 'json':
          return this.exportAnalyticsToJSON(analytics, options);
        case 'pdf':
          return await this.exportAnalyticsToPDF(analytics, options);
        default:
          throw new Error(`Unsupported export format: ${options.format}`);
      }
    } catch (error) {
      console.error('Error exporting analytics:', error);
      throw new Error(`Failed to export analytics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Enhanced CSV export using papaparse
  private static async exportURLToCSV(url: ShortenedURL, options: ExportOptions): Promise<string> {
    const data = this.prepareURLData([url], options);
    
    // Include analytics if requested
    if (options.includeAnalytics) {
      try {
        const analytics = await URLShortenerService.getURLAnalytics(url.id);
        const analyticsData = this.prepareAnalyticsData(analytics, options);
        
        // Combine URL and analytics data
        const urlCsv = Papa.unparse(data, {
          header: true,
          delimiter: ',',
          quotes: true
        });
        
        const analyticsCsv = Papa.unparse(analyticsData, {
          header: true,
          delimiter: ',',
          quotes: true
        });
        
        return `${urlCsv}\n\n--- Analytics ---\n${analyticsCsv}`;
      } catch (error) {
        console.warn('Failed to include analytics in CSV export:', error);
      }
    }

    return Papa.unparse(data, {
      header: true,
      delimiter: ',',
      quotes: true,
      skipEmptyLines: true
    });
  }

  private static exportURLsToCSV(urls: ShortenedURL[], options: ExportOptions): string {
    const data = this.prepareURLData(urls, options);
    
    return Papa.unparse(data, {
      header: true,
      delimiter: ',',
      quotes: true,
      skipEmptyLines: true,
      transform: (value) => {
        // Handle special characters and formatting
        if (typeof value === 'string') {
          return value.replace(/[\r\n]/g, ' ').trim();
        }
        return value;
      }
    });
  }

  private static exportAnalyticsToCSV(analytics: URLAnalytics, options: ExportOptions): string {
    const data = this.prepareAnalyticsData(analytics, options);
    
    return Papa.unparse(data, {
      header: true,
      delimiter: ',',
      quotes: true,
      skipEmptyLines: true
    });
  }

  // Enhanced JSON export with better formatting
  private static async exportURLToJSON(url: ShortenedURL, options: ExportOptions): Promise<string> {
    const data = this.prepareURLData([url], options)[0];
    
    if (options.includeAnalytics) {
      try {
        const analytics = await URLShortenerService.getURLAnalytics(url.id);
        data.analytics = this.prepareAnalyticsForJSON(analytics, options);
      } catch (error) {
        console.warn('Failed to include analytics in JSON export:', error);
      }
    }

    return JSON.stringify({
      exportedAt: new Date().toISOString(),
      exportOptions: omit(options, ['filename']),
      data
    }, null, 2);
  }

  private static exportURLsToJSON(urls: ShortenedURL[], options: ExportOptions): string {
    const data = this.prepareURLData(urls, options);
    
    return JSON.stringify({
      exportedAt: new Date().toISOString(),
      exportOptions: omit(options, ['filename']),
      count: data.length,
      data
    }, null, 2);
  }

  private static exportAnalyticsToJSON(analytics: URLAnalytics, options: ExportOptions): string {
    const data = this.prepareAnalyticsForJSON(analytics, options);
    
    return JSON.stringify({
      exportedAt: new Date().toISOString(),
      exportOptions: omit(options, ['filename']),
      analytics: data
    }, null, 2);
  }

  // Enhanced PDF export using jsPDF
  private static async exportURLToPDF(url: ShortenedURL, options: ExportOptions): Promise<Blob> {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    let yPosition = 20;

    // Title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(options.title || 'URL Export Report', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Export date
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Exported on: ${format(new Date(), 'PPpp')}`, 20, yPosition);
    yPosition += 15;

    // URL details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('URL Details:', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    const urlData = this.prepareURLData([url], options)[0];
    for (const [key, value] of Object.entries(urlData)) {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }
      
      const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
      doc.text(`${label}: ${value}`, 20, yPosition);
      yPosition += 8;
    }

    // Include analytics if requested
    if (options.includeAnalytics) {
      try {
        const analytics = await URLShortenerService.getURLAnalytics(url.id);
        yPosition = this.addAnalyticsToPDF(doc, analytics, yPosition, options);
      } catch (error) {
        console.warn('Failed to include analytics in PDF export:', error);
      }
    }

    return doc.output('blob');
  }

  private static async exportURLsToPDF(urls: ShortenedURL[], options: ExportOptions): Promise<Blob> {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    let yPosition = 20;

    // Title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(options.title || 'URLs Export Report', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Summary
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Exported on: ${format(new Date(), 'PPpp')}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Total URLs: ${urls.length}`, 20, yPosition);
    yPosition += 15;

    // URLs table
    const data = this.prepareURLData(urls, options);
    const headers = Object.keys(data[0] || {});
    
    // Simple table implementation
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    
    let xPosition = 20;
    const colWidth = (pageWidth - 40) / headers.length;
    
    // Headers
    headers.forEach(header => {
      doc.text(header, xPosition, yPosition);
      xPosition += colWidth;
    });
    yPosition += 8;

    // Data rows
    doc.setFont('helvetica', 'normal');
    data.forEach(row => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }
      
      xPosition = 20;
      headers.forEach(header => {
        const value = String(row[header] || '').substring(0, 15);
        doc.text(value, xPosition, yPosition);
        xPosition += colWidth;
      });
      yPosition += 6;
    });

    return doc.output('blob');
  }

  private static async exportAnalyticsToPDF(analytics: URLAnalytics, options: ExportOptions): Promise<Blob> {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    let yPosition = 20;

    // Title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(options.title || 'Analytics Report', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    yPosition = this.addAnalyticsToPDF(doc, analytics, yPosition, options);

    return doc.output('blob');
  }

  // Helper method to add analytics to PDF
  private static addAnalyticsToPDF(doc: jsPDF, analytics: URLAnalytics, startY: number, options: ExportOptions): number {
    let yPosition = startY + 10;
    const pageHeight = doc.internal.pageSize.height;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Analytics Summary:', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    // Basic metrics
    const metrics = [
      ['Total Clicks', analytics.totalClicks],
      ['Total Conversions', analytics.totalConversions || 0],
      ['Conversion Rate', `${(analytics.conversionRate || 0).toFixed(2)}%`]
    ];

    metrics.forEach(([label, value]) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(`${label}: ${value}`, 20, yPosition);
      yPosition += 8;
    });

    // Top referrers, devices, countries
    const sections = [
      ['Top Referrers', analytics.clicksByReferrer],
      ['Top Devices', analytics.clicksByDevice],
      ['Top Countries', analytics.clicksByCountry]
    ];

    sections.forEach(([title, data]) => {
      if (!data || Object.keys(data).length === 0) return;

      yPosition += 10;
      if (yPosition > pageHeight - 50) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.text(title, 20, yPosition);
      yPosition += 8;

      doc.setFont('helvetica', 'normal');
      Object.entries(data)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 5)
        .forEach(([key, value]) => {
          if (yPosition > pageHeight - 30) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(`  ${key}: ${value}`, 20, yPosition);
          yPosition += 6;
        });
    });

    return yPosition;
  }

  // Data preparation helpers
  private static prepareURLData(urls: ShortenedURL[], options: ExportOptions): any[] {
    const fields = options.fields || DEFAULT_URL_FIELDS;
    
    return urls.map(url => {
      const data: any = {};
      
      fields.forEach(field => {
        switch (field) {
          case 'hasPassword':
            data[field] = url.password ? 'Yes' : 'No';
            break;
          case 'hasCustomAlias':
            data[field] = url.customAlias ? 'Yes' : 'No';
            break;
          case 'hasUtmParameters':
            data[field] = url.utmParameters ? 'Yes' : 'No';
            break;
          case 'createdAt':
          case 'expiresAt':
            data[field] = url[field] ? format(parseISO(url[field]), 'PPpp') : '';
            break;
          default:
            data[field] = url[field as keyof ShortenedURL] || '';
        }
      });
      
      return data;
    });
  }

  private static prepareAnalyticsData(analytics: URLAnalytics, options: ExportOptions): any[] {
    const data: any[] = [];

    // Add summary row
    data.push({
      metric: 'Total Clicks',
      value: analytics.totalClicks
    });

    if (analytics.totalConversions !== undefined) {
      data.push({
        metric: 'Total Conversions',
        value: analytics.totalConversions
      });
      data.push({
        metric: 'Conversion Rate (%)',
        value: (analytics.conversionRate || 0).toFixed(2)
      });
    }

    // Add detailed breakdowns
    const breakdowns = [
      ['Clicks by Date', analytics.clicksByDate],
      ['Clicks by Referrer', analytics.clicksByReferrer],
      ['Clicks by Device', analytics.clicksByDevice],
      ['Clicks by Country', analytics.clicksByCountry]
    ];

    breakdowns.forEach(([category, breakdown]) => {
      if (breakdown && Object.keys(breakdown).length > 0) {
        Object.entries(breakdown).forEach(([key, value]) => {
          data.push({
            metric: `${category} - ${key}`,
            value
          });
        });
      }
    });

    return data;
  }

  private static prepareAnalyticsForJSON(analytics: URLAnalytics, options: ExportOptions): any {
    const fields = options.fields || DEFAULT_ANALYTICS_FIELDS;
    return pick(analytics, fields);
  }

  // Enhanced file download with better error handling
  static downloadFile(data: string | Blob, filename: string, contentType?: string): void {
    try {
      const blob = data instanceof Blob ? data : new Blob([data], { 
        type: contentType || 'application/octet-stream' 
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the object URL
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error('Error downloading file:', error);
      throw new Error(`Failed to download file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get suggested filename based on content and format
  static getSuggestedFilename(type: 'url' | 'urls' | 'analytics', format: ExportFormat, customName?: string): string {
    const timestamp = format(new Date(), 'yyyy-MM-dd-HHmm');
    const base = customName || `${type}-export`;
    return `${base}-${timestamp}.${format}`;
  }

  // Validate export options
  static validateExportOptions(options: ExportOptions): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!['csv', 'json', 'pdf'].includes(options.format)) {
      errors.push('Invalid export format');
    }

    if (options.dateRange) {
      try {
        const start = parseISO(options.dateRange.startDate);
        const end = parseISO(options.dateRange.endDate);
        
        if (start > end) {
          errors.push('Start date must be before end date');
        }
      } catch (error) {
        errors.push('Invalid date range format');
      }
    }

    if (options.fields && !Array.isArray(options.fields)) {
      errors.push('Fields must be an array');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
