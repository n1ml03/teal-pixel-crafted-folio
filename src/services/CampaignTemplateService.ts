import { CampaignTemplate, UTMParams } from '@/types/shorten.ts';
import { nanoid } from 'nanoid';

// Constants
const TEMPLATE_STORAGE_KEY = 'campaign_templates';

// Error logging utility to prevent sensitive information exposure
const logError = (message: string, error?: unknown): void => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[CampaignTemplateService] ${message}`, error);
  }
};

// Helper to generate a unique ID using nanoid
const generateId = (): string => {
  try {
    return nanoid();
  } catch (error) {
    logError('Error generating ID, falling back to timestamp-based ID', error);
    return `template_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }
};

// Input validation helper
const validateTemplate = (template: Partial<CampaignTemplate>): string[] => {
  const errors: string[] = [];

  if (!template.name || typeof template.name !== 'string' || template.name.trim().length === 0) {
    errors.push('Template name is required and must be a non-empty string');
  }

  if (!template.category || typeof template.category !== 'string' || template.category.trim().length === 0) {
    errors.push('Template category is required and must be a non-empty string');
  }

  if (!template.utmParameters || typeof template.utmParameters !== 'object') {
    errors.push('UTM parameters are required and must be an object');
  } else {
    if (!template.utmParameters.source || typeof template.utmParameters.source !== 'string') {
      errors.push('UTM source is required and must be a string');
    }
    if (!template.utmParameters.medium || typeof template.utmParameters.medium !== 'string') {
      errors.push('UTM medium is required and must be a string');
    }
    if (!template.utmParameters.campaign || typeof template.utmParameters.campaign !== 'string') {
      errors.push('UTM campaign is required and must be a string');
    }
  }

  return errors;
};

// Default templates
const DEFAULT_TEMPLATES: CampaignTemplate[] = [
  {
    id: 'social-media-general',
    name: 'Social Media - General',
    description: 'General template for social media campaigns',
    category: 'Social Media',
    utmParameters: {
      source: 'social',
      medium: 'social',
      campaign: 'general_social'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'facebook-campaign',
    name: 'Facebook Campaign',
    description: 'Template for Facebook campaigns',
    category: 'Social Media',
    utmParameters: {
      source: 'facebook',
      medium: 'social',
      campaign: 'fb_campaign'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'email-newsletter',
    name: 'Email Newsletter',
    description: 'Template for email newsletter campaigns',
    category: 'Email',
    utmParameters: {
      source: 'newsletter',
      medium: 'email',
      campaign: 'weekly_newsletter'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'google-ads',
    name: 'Google Ads',
    description: 'Template for Google Ads campaigns',
    category: 'Advertising',
    utmParameters: {
      source: 'google',
      medium: 'cpc',
      campaign: 'search_campaign'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'product-launch',
    name: 'Product Launch',
    description: 'Template for product launch campaigns',
    category: 'Marketing',
    utmParameters: {
      source: 'marketing',
      medium: 'referral',
      campaign: 'product_launch',
      content: 'launch_announcement'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// CampaignTemplateService class
export class CampaignTemplateService {
  // Get all templates
  static getTemplates(): CampaignTemplate[] {
    try {
      const templatesJson = localStorage.getItem(TEMPLATE_STORAGE_KEY);
      
      // If no templates exist yet, initialize with default templates
      if (!templatesJson) {
        this.saveTemplates(DEFAULT_TEMPLATES);
        return DEFAULT_TEMPLATES;
      }
      
      return JSON.parse(templatesJson);
    } catch (error) {
      logError('Error getting templates from localStorage', error);
      return [];
    }
  }

  // Save templates to localStorage with error handling
  private static saveTemplates(templates: CampaignTemplate[]): boolean {
    try {
      localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(templates));
      return true;
    } catch (error) {
      logError('Error saving templates to localStorage', error);
      return false;
    }
  }

  // Get template by ID with validation
  static getTemplateById(id: string): CampaignTemplate | null {
    if (!id || typeof id !== 'string') {
      throw new Error('Template ID is required and must be a string');
    }

    const templates = this.getTemplates();
    return templates.find(template => template.id === id) || null;
  }

  // Create a new template with validation
  static createTemplate(template: Omit<CampaignTemplate, 'id' | 'createdAt' | 'updatedAt'>): CampaignTemplate {
    // Validate input
    const validationErrors = validateTemplate(template);
    if (validationErrors.length > 0) {
      throw new Error(`Template validation failed: ${validationErrors.join(', ')}`);
    }

    const now = new Date().toISOString();

    const newTemplate: CampaignTemplate = {
      ...template,
      id: generateId(),
      createdAt: now,
      updatedAt: now
    };

    const templates = this.getTemplates();
    const success = this.saveTemplates([...templates, newTemplate]);

    if (!success) {
      throw new Error('Failed to save template to storage');
    }

    return newTemplate;
  }

  // Update a template with validation
  static updateTemplate(id: string, updates: Partial<Omit<CampaignTemplate, 'id' | 'createdAt'>>): CampaignTemplate | null {
    // Validate ID
    if (!id || typeof id !== 'string') {
      throw new Error('Template ID is required and must be a string');
    }

    const templates = this.getTemplates();
    const templateIndex = templates.findIndex(template => template.id === id);

    if (templateIndex === -1) {
      return null;
    }

    // Create updated template object
    const updatedTemplate = {
      ...templates[templateIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    // Validate the updated template
    const validationErrors = validateTemplate(updatedTemplate);
    if (validationErrors.length > 0) {
      throw new Error(`Template validation failed: ${validationErrors.join(', ')}`);
    }

    // Update in array
    templates[templateIndex] = updatedTemplate;

    // Save to localStorage
    const success = this.saveTemplates(templates);
    if (!success) {
      throw new Error('Failed to save updated template to storage');
    }

    return updatedTemplate;
  }

  // Delete a template with validation
  static deleteTemplate(id: string): boolean {
    // Validate ID
    if (!id || typeof id !== 'string') {
      throw new Error('Template ID is required and must be a string');
    }

    const templates = this.getTemplates();
    const filteredTemplates = templates.filter(template => template.id !== id);

    if (filteredTemplates.length === templates.length) {
      return false; // Template not found
    }

    // Save to localStorage
    const success = this.saveTemplates(filteredTemplates);
    if (!success) {
      throw new Error('Failed to save templates after deletion');
    }

    return true;
  }

  // Get templates by category with validation
  static getTemplatesByCategory(category: string): CampaignTemplate[] {
    if (!category || typeof category !== 'string') {
      throw new Error('Category is required and must be a string');
    }

    const templates = this.getTemplates();
    return templates.filter(template => template.category === category);
  }

  // Get all categories
  static getCategories(): string[] {
    const templates = this.getTemplates();
    const categories = new Set(templates.map(template => template.category));
    return Array.from(categories);
  }

  // Apply template to UTM parameters
  static applyTemplate(templateId: string): UTMParams | null {
    const template = this.getTemplateById(templateId);
    
    if (!template) {
      return null;
    }
    
    return { ...template.utmParameters };
  }
}
