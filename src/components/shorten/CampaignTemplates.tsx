import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CampaignTemplate, UTMParams } from '@/types/shorten.ts';
import { CampaignTemplateService } from '@/services/CampaignTemplateService.ts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.tsx';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Plus, Edit, Trash2, Copy, Tag, Save, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface CampaignTemplatesProps {
  onSelectTemplate: (template: UTMParams) => void;
}

export function CampaignTemplates({ onSelectTemplate }: CampaignTemplatesProps) {
  const [templates, setTemplates] = useState<CampaignTemplate[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<CampaignTemplate | null>(null);

  // Form state
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    category: '',
    utmSource: '',
    utmMedium: '',
    utmCampaign: '',
    utmTerm: '',
    utmContent: '',
    customParams: [{ key: '', value: '' }]
  });

  // Load templates
  useEffect(() => {
    const loadedTemplates = CampaignTemplateService.getTemplates();
    setTemplates(loadedTemplates);

    const loadedCategories = CampaignTemplateService.getCategories();
    setCategories(loadedCategories);
  }, []);

  // Filter templates by category
  const filteredTemplates = activeCategory === 'all'
    ? templates
    : templates.filter(template => template.category === activeCategory);

  // Handle template selection
  const handleSelectTemplate = (template: CampaignTemplate) => {
    onSelectTemplate(template.utmParameters);
    toast.success(`Applied template: ${template.name}`);
  };

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  // Handle custom param change
  const handleCustomParamChange = (index: number, field: 'key' | 'value', value: string) => {
    setFormState(prev => {
      const newCustomParams = [...prev.customParams];
      newCustomParams[index] = { ...newCustomParams[index], [field]: value };
      return { ...prev, customParams: newCustomParams };
    });
  };

  // Add custom param field
  const addCustomParam = () => {
    setFormState(prev => ({
      ...prev,
      customParams: [...prev.customParams, { key: '', value: '' }]
    }));
  };

  // Remove custom param field
  const removeCustomParam = (index: number) => {
    setFormState(prev => {
      const newCustomParams = [...prev.customParams];
      newCustomParams.splice(index, 1);
      return { ...prev, customParams: newCustomParams };
    });
  };

  // Reset form
  const resetForm = () => {
    setFormState({
      name: '',
      description: '',
      category: '',
      utmSource: '',
      utmMedium: '',
      utmCampaign: '',
      utmTerm: '',
      utmContent: '',
      customParams: [{ key: '', value: '' }]
    });
  };

  // Set form for editing
  const setFormForEditing = (template: CampaignTemplate) => {
    const customParams: { key: string; value: string }[] = [];

    // Extract custom params if they exist
    if (template.utmParameters.custom && typeof template.utmParameters.custom === 'object') {
      Object.entries(template.utmParameters.custom).forEach(([key, value]) => {
        customParams.push({ key, value });
      });
    }

    // If no custom params, add an empty one
    if (customParams.length === 0) {
      customParams.push({ key: '', value: '' });
    }

    setFormState({
      name: template.name,
      description: template.description || '',
      category: template.category,
      utmSource: template.utmParameters.source || '',
      utmMedium: template.utmParameters.medium || '',
      utmCampaign: template.utmParameters.campaign || '',
      utmTerm: template.utmParameters.term || '',
      utmContent: template.utmParameters.content || '',
      customParams
    });
  };

  // Handle create template
  const handleCreateTemplate = () => {
    // Validate form
    if (!formState.name) {
      toast.error('Template name is required');
      return;
    }

    if (!formState.category) {
      toast.error('Category is required');
      return;
    }

    if (!formState.utmSource) {
      toast.error('UTM Source is required');
      return;
    }

    // Create UTM parameters object
    const utmParameters: UTMParams = {
      source: formState.utmSource,
      medium: formState.utmMedium || undefined,
      campaign: formState.utmCampaign || undefined,
      term: formState.utmTerm || undefined,
      content: formState.utmContent || undefined
    };

    // Add custom parameters
    const customParams: Record<string, string> = {};
    formState.customParams.forEach(param => {
      if (param.key && param.value) {
        customParams[param.key] = param.value;
      }
    });

    if (Object.keys(customParams).length > 0) {
      utmParameters.custom = customParams;
    }

    // Create template
    const newTemplate = CampaignTemplateService.createTemplate({
      name: formState.name,
      description: formState.description,
      category: formState.category,
      utmParameters
    });

    // Update state
    setTemplates(CampaignTemplateService.getTemplates());
    setCategories(CampaignTemplateService.getCategories());

    // Reset form and close dialog
    resetForm();
    setIsCreateDialogOpen(false);

    toast.success('Template created successfully');
  };

  // Handle update template
  const handleUpdateTemplate = () => {
    if (!selectedTemplate) return;

    // Validate form
    if (!formState.name) {
      toast.error('Template name is required');
      return;
    }

    if (!formState.category) {
      toast.error('Category is required');
      return;
    }

    if (!formState.utmSource) {
      toast.error('UTM Source is required');
      return;
    }

    // Create UTM parameters object
    const utmParameters: UTMParams = {
      source: formState.utmSource,
      medium: formState.utmMedium || undefined,
      campaign: formState.utmCampaign || undefined,
      term: formState.utmTerm || undefined,
      content: formState.utmContent || undefined
    };

    // Add custom parameters
    const customParams: Record<string, string> = {};
    formState.customParams.forEach(param => {
      if (param.key && param.value) {
        customParams[param.key] = param.value;
      }
    });

    if (Object.keys(customParams).length > 0) {
      utmParameters.custom = customParams;
    }

    // Update template
    CampaignTemplateService.updateTemplate(selectedTemplate.id, {
      name: formState.name,
      description: formState.description,
      category: formState.category,
      utmParameters
    });

    // Update state
    setTemplates(CampaignTemplateService.getTemplates());
    setCategories(CampaignTemplateService.getCategories());

    // Reset form and close dialog
    resetForm();
    setIsEditDialogOpen(false);
    setSelectedTemplate(null);

    toast.success('Template updated successfully');
  };

  // Handle delete template
  const handleDeleteTemplate = (template: CampaignTemplate) => {
    if (confirm(`Are you sure you want to delete the template "${template.name}"?`)) {
      CampaignTemplateService.deleteTemplate(template.id);
      setTemplates(CampaignTemplateService.getTemplates());
      setCategories(CampaignTemplateService.getCategories());
      toast.success('Template deleted successfully');
    }
  };

  return (
    <div>
      <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 xs:gap-0 mb-4">
        <h2 className="text-base sm:text-lg font-semibold">Campaign Templates</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center gap-1 h-8 sm:h-9 text-xs sm:text-sm">
              <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>New Template</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[90vw] sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg">Create Campaign Template</DialogTitle>
              <DialogDescription className="text-xs sm:text-sm">
                Create a reusable template for your UTM parameters.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="name" className="text-xs sm:text-sm">Template Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Facebook Campaign"
                    className="text-xs sm:text-sm h-8 sm:h-10"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="description" className="text-xs sm:text-sm">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formState.description}
                    onChange={handleInputChange}
                    placeholder="What is this template for?"
                    rows={2}
                    className="text-xs sm:text-sm min-h-[60px]"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="category" className="text-xs sm:text-sm">Category</Label>
                  <Input
                    id="category"
                    name="category"
                    value={formState.category}
                    onChange={handleInputChange}
                    placeholder="e.g., Social Media"
                    className="text-xs sm:text-sm h-8 sm:h-10"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="utmSource" className="text-xs sm:text-sm">UTM Source (required)</Label>
                  <Input
                    id="utmSource"
                    name="utmSource"
                    value={formState.utmSource}
                    onChange={handleInputChange}
                    placeholder="e.g., facebook"
                    className="text-xs sm:text-sm h-8 sm:h-10"
                  />
                </div>
                <div>
                  <Label htmlFor="utmMedium" className="text-xs sm:text-sm">UTM Medium</Label>
                  <Input
                    id="utmMedium"
                    name="utmMedium"
                    value={formState.utmMedium}
                    onChange={handleInputChange}
                    placeholder="e.g., social"
                    className="text-xs sm:text-sm h-8 sm:h-10"
                  />
                </div>
                <div>
                  <Label htmlFor="utmCampaign" className="text-xs sm:text-sm">UTM Campaign</Label>
                  <Input
                    id="utmCampaign"
                    name="utmCampaign"
                    value={formState.utmCampaign}
                    onChange={handleInputChange}
                    placeholder="e.g., summer_sale"
                    className="text-xs sm:text-sm h-8 sm:h-10"
                  />
                </div>
                <div>
                  <Label htmlFor="utmTerm" className="text-xs sm:text-sm">UTM Term</Label>
                  <Input
                    id="utmTerm"
                    name="utmTerm"
                    value={formState.utmTerm}
                    onChange={handleInputChange}
                    placeholder="e.g., running+shoes"
                    className="text-xs sm:text-sm h-8 sm:h-10"
                  />
                </div>
                <div>
                  <Label htmlFor="utmContent" className="text-xs sm:text-sm">UTM Content</Label>
                  <Input
                    id="utmContent"
                    name="utmContent"
                    value={formState.utmContent}
                    onChange={handleInputChange}
                    placeholder="e.g., banner"
                    className="text-xs sm:text-sm h-8 sm:h-10"
                  />
                </div>

                <div className="col-span-2">
                  <div className="flex justify-between items-center mb-2">
                    <Label className="text-xs sm:text-sm">Custom UTM Parameters</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addCustomParam}
                      className="h-6 sm:h-7 text-[10px] sm:text-xs"
                    >
                      Add Parameter
                    </Button>
                  </div>

                  {formState.customParams.map((param, index) => (
                    <div key={index} className="flex gap-1 sm:gap-2 mb-2">
                      <Input
                        value={param.key}
                        onChange={(e) => handleCustomParamChange(index, 'key', e.target.value)}
                        placeholder="Parameter name"
                        className="flex-1 text-xs sm:text-sm h-8 sm:h-10"
                      />
                      <Input
                        value={param.value}
                        onChange={(e) => handleCustomParamChange(index, 'value', e.target.value)}
                        placeholder="Value"
                        className="flex-1 text-xs sm:text-sm h-8 sm:h-10"
                      />
                      {formState.customParams.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeCustomParam(index)}
                          className="h-8 w-8 sm:h-9 sm:w-9"
                        >
                          <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                className="text-xs sm:text-sm h-8 sm:h-10"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateTemplate}
                className="text-xs sm:text-sm h-8 sm:h-10"
              >
                Create Template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="mb-4 flex flex-wrap gap-1">
          <TabsTrigger value="all" className="text-xs sm:text-sm py-1 sm:py-1.5 px-2 sm:px-3 h-7 sm:h-8">All</TabsTrigger>
          {categories.map(category => (
            <TabsTrigger
              key={category}
              value={category}
              className="text-xs sm:text-sm py-1 sm:py-1.5 px-2 sm:px-3 h-7 sm:h-8"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <ScrollArea className="h-[300px] sm:h-[350px] md:h-[400px] pr-2 sm:pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTemplates.map((template) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader className="pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <CardTitle className="text-sm sm:text-base">{template.name}</CardTitle>
                        <Badge variant="outline" className="mt-1 text-[10px] sm:text-xs">
                          {template.category}
                        </Badge>
                      </div>
                      <div className="flex gap-0.5 sm:gap-1 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 sm:h-8 sm:w-8"
                          onClick={() => {
                            setSelectedTemplate(template);
                            setFormForEditing(template);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 sm:h-8 sm:w-8 text-red-500"
                          onClick={() => handleDeleteTemplate(template)}
                        >
                          <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </div>
                    {template.description && (
                      <CardDescription className="mt-1 text-[10px] sm:text-xs">
                        {template.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="pb-2 px-3 sm:px-6">
                    <div className="text-[10px] sm:text-xs space-y-1 font-mono bg-gray-50 p-1.5 sm:p-2 rounded">
                      {template.utmParameters.source && (
                        <div><span className="text-blue-600">utm_source</span>: {template.utmParameters.source}</div>
                      )}
                      {template.utmParameters.medium && (
                        <div><span className="text-green-600">utm_medium</span>: {template.utmParameters.medium}</div>
                      )}
                      {template.utmParameters.campaign && (
                        <div><span className="text-purple-600">utm_campaign</span>: {template.utmParameters.campaign}</div>
                      )}
                      {template.utmParameters.term && (
                        <div><span className="text-orange-600">utm_term</span>: {template.utmParameters.term}</div>
                      )}
                      {template.utmParameters.content && (
                        <div><span className="text-red-600">utm_content</span>: {template.utmParameters.content}</div>
                      )}
                      {template.utmParameters.custom && typeof template.utmParameters.custom === 'object' && (
                        Object.entries(template.utmParameters.custom).map(([key, value]) => (
                          <div key={key}><span className="text-gray-600">utm_{key}</span>: {value}</div>
                        ))
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 px-3 sm:px-6 pb-3 sm:pb-6">
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full h-7 sm:h-8 text-xs sm:text-sm"
                      onClick={() => handleSelectTemplate(template)}
                    >
                      <Tag className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                      Apply Template
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </Tabs>

      {/* Edit Template Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-[90vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Edit Campaign Template</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Update your UTM parameter template.
            </DialogDescription>
          </DialogHeader>

          {/* Same form fields as create dialog */}
          <div className="grid gap-4 py-4">
            {/* Form fields (same as create dialog) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="edit-name" className="text-xs sm:text-sm">Template Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formState.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Facebook Campaign"
                  className="text-xs sm:text-sm h-8 sm:h-10"
                />
              </div>
              {/* Other fields would be duplicated here */}
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="text-xs sm:text-sm h-8 sm:h-10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateTemplate}
              className="text-xs sm:text-sm h-8 sm:h-10"
            >
              Update Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
