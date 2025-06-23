import { CampaignTemplate, UTMParams } from '@/types/shorten.ts';

// Constants
const TEMPLATE_STORAGE_KEY = 'campaign_templates';

// Helper to generate a unique ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
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
      console.error('Error getting templates from localStorage:', error);
      return [];
    }
  }

  // Save templates to localStorage
  private static saveTemplates(templates: CampaignTemplate[]): void {
    localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(templates));
  }

  // Get template by ID
  static getTemplateById(id: string): CampaignTemplate | null {
    const templates = this.getTemplates();
    return templates.find(template => template.id === id) || null;
  }

  // Create a new template
  static createTemplate(template: Omit<CampaignTemplate, 'id' | 'createdAt' | 'updatedAt'>): CampaignTemplate {
    const now = new Date().toISOString();
    
    const newTemplate: CampaignTemplate = {
      ...template,
      id: generateId(),
      createdAt: now,
      updatedAt: now
    };

    const templates = this.getTemplates();
    this.saveTemplates([...templates, newTemplate]);

    return newTemplate;
  }

  // Update a template
  static updateTemplate(id: string, updates: Partial<Omit<CampaignTemplate, 'id' | 'createdAt'>>): CampaignTemplate | null {
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

    // Update in array
    templates[templateIndex] = updatedTemplate;

    // Save to localStorage
    this.saveTemplates(templates);

    return updatedTemplate;
  }

  // Delete a template
  static deleteTemplate(id: string): boolean {
    const templates = this.getTemplates();
    const filteredTemplates = templates.filter(template => template.id !== id);

    if (filteredTemplates.length === templates.length) {
      return false; // Template not found
    }

    // Save to localStorage
    this.saveTemplates(filteredTemplates);

    return true;
  }

  // Get templates by category
  static getTemplatesByCategory(category: string): CampaignTemplate[] {
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
