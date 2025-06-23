import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAIConfig } from '@/contexts/AIConfigContext';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Brain,
  Key,
  Settings,
  Globe,
  Zap,
  Shield,
  Clock,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Info,
  Sparkles,
  Save,
  RefreshCw,
  Upload,
  Download,
  Trash2,
  Plus,
  TestTube,
  Edit,
  Copy
} from 'lucide-react';

interface AIConfigPanelProps {
  toolCategory?: 'testing' | 'code-review' | 'bug-analysis' | 'api-testing' | 'general';
  onConfigChange?: (isConfigured: boolean) => void;
  className?: string;
}

const AIConfigPanel: React.FC<AIConfigPanelProps> = ({ 
  toolCategory = 'general', 
  onConfigChange,
  className = "" 
}) => {
  const { 
    config, 
    updateConfig, 
    resetConfig, 
    models, 
    templates, 
    addTemplate, 
    removeTemplate, 
    isConfigured, 
    testConnection, 
    saveConfig, 
    loadConfig 
  } = useAIConfig();

  const [activeTab, setActiveTab] = useState('api');
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [isExpanded, setIsExpanded] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    template: ''
  });
  const [showNewTemplateForm, setShowNewTemplateForm] = useState(false);

  // Notify parent when configuration changes
  useEffect(() => {
    onConfigChange?.(isConfigured);
  }, [isConfigured, onConfigChange]);

  const handleTestConnection = async () => {
    setConnectionStatus('testing');
    try {
      const success = await testConnection();
      setConnectionStatus(success ? 'success' : 'error');
      setTimeout(() => setConnectionStatus('idle'), 3000);
    } catch (error) {
      setConnectionStatus('error');
      setTimeout(() => setConnectionStatus('idle'), 3000);
    }
  };

  const handleSaveConfig = () => {
    saveConfig();
    // Show toast or notification
  };

  const handleResetConfig = () => {
    resetConfig();
    setConnectionStatus('idle');
  };

  const handleExportConfig = () => {
    const exportData = {
      config: { ...config, apiKey: '' }, // Don't export API key for security
      templates: templates.filter(t => t.category === toolCategory)
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ai-config-${toolCategory}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target?.result as string);
        if (importData.config) {
          updateConfig(importData.config);
        }
        if (importData.templates && Array.isArray(importData.templates)) {
          importData.templates.forEach((template: any) => {
            if (!templates.find(t => t.id === template.id)) {
              addTemplate(template);
            }
          });
        }
      } catch (error) {
        console.error('Failed to import config:', error);
      }
    };
    reader.readAsText(file);
  };

  const handleAddTemplate = () => {
    if (newTemplate.name && newTemplate.template) {
      const template = {
        id: `custom-${Date.now()}`,
        name: newTemplate.name,
        description: newTemplate.description,
        category: toolCategory,
        template: newTemplate.template,
        variables: extractVariables(newTemplate.template)
      };
      
      addTemplate(template);
      setNewTemplate({ name: '', description: '', template: '' });
      setShowNewTemplateForm(false);
    }
  };

  const extractVariables = (template: string): string[] => {
    const matches = template.match(/\{([^}]+)\}/g);
    return matches ? [...new Set(matches.map(match => match.slice(1, -1)))] : [];
  };

  const getModelByProvider = (provider: string) => {
    return models.filter(model => model.provider === provider);
  };

  const selectedModel = models.find(m => m.id === config.selectedModel);
  const relevantTemplates = templates.filter(t => t.category === toolCategory || t.category === 'general');

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'testing':
        return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <TestTube className="w-4 h-4" />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'testing':
        return 'Testing connection...';
      case 'success':
        return 'Connection successful';
      case 'error':
        return 'Connection failed';
      default:
        return 'Test Connection';
    }
  };

  return (
    <Card className={`bg-transparent border-0 shadow-none ${className}`}>
      <CardHeader className="pb-4 px-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.02, 1]
              }}
              transition={{ 
                rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                scale: { duration: 4, repeat: Infinity }
              }}
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg relative overflow-hidden"
            >
              {/* Animated shine effect */}
              <motion.div
                animate={{ x: [-100, 100] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
              />
              <Brain className="w-6 h-6 text-white relative z-10" />
            </motion.div>
            
            <div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-2"
              >
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  AI Configuration
                </CardTitle>
                {isConfigured && (
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-5 h-5 text-emerald-500" />
                  </motion.div>
                )}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <CardDescription className="text-gray-600 mt-1">
                  Configure AI settings for {toolCategory.replace('-', ' ')} tools
                </CardDescription>
              </motion.div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ 
                rotate: isConfigured ? [0, 360] : 0,
                scale: isConfigured ? [1, 1.05, 1] : 1
              }}
              transition={{ 
                duration: isConfigured ? 2 : 0,
                repeat: isConfigured ? Infinity : 0,
                repeatDelay: 3
              }}
            >
              <Badge 
                className={`
                  px-3 py-1 font-medium text-sm rounded-full shadow-md border-0
                  ${isConfigured 
                    ? "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 shadow-emerald-500/20" 
                    : "bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 shadow-orange-500/20"
                  }
                `}
              >
                {isConfigured ? (
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Configured</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>Setup Required</span>
                  </div>
                )}
              </Badge>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-600 hover:text-gray-800 hover:bg-white/50 rounded-xl border border/50 shadow-sm"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </CardHeader>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent className="pt-0">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4 bg-white/60 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl p-1 h-auto">
                  <TabsTrigger 
                    value="api" 
                    className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 transition-all duration-300 py-3 px-4 text-sm font-medium"
                  >
                    <Key className="w-4 h-4" />
                    <span className="hidden sm:inline">API</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="models" 
                    className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-purple-600 transition-all duration-300 py-3 px-4 text-sm font-medium"
                  >
                    <Zap className="w-4 h-4" />
                    <span className="hidden sm:inline">Models</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="templates" 
                    className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-pink-600 transition-all duration-300 py-3 px-4 text-sm font-medium"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span className="hidden sm:inline">Templates</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="advanced" 
                    className="flex items-center gap-2 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-emerald-600 transition-all duration-300 py-3 px-4 text-sm font-medium"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="hidden sm:inline">Advanced</span>
                  </TabsTrigger>
                </TabsList>

                <div className="mt-8">
                  <TabsContent value="api" className="space-y-6">
                    {/* API Endpoint */}
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      <Label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-blue-500" />
                        <span>API Endpoint</span>
                      </Label>
                      <Input
                        placeholder="https://api.openai.com/v1/chat/completions"
                        value={config.apiEndpoint}
                        onChange={(e) => updateConfig({ apiEndpoint: e.target.value })}
                        className="bg-white/70 backdrop-blur-sm border-white/20 rounded-xl shadow-sm focus:shadow-md transition-all duration-300 px-4 py-3"
                      />
                    </motion.div>

                    {/* API Key */}
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="space-y-3"
                    >
                      <Label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                        <Key className="w-4 h-4 text-purple-500" />
                        <span>API Key</span>
                      </Label>
                      <Input
                        type="password"
                        placeholder="Enter your API key"
                        value={config.apiKey}
                        onChange={(e) => updateConfig({ apiKey: e.target.value })}
                        className="bg-white/70 backdrop-blur-sm border-white/20 rounded-xl shadow-sm focus:shadow-md transition-all duration-300 px-4 py-3"
                      />
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xs text-gray-500 flex items-center space-x-1"
                      >
                        <Shield className="w-3 h-3" />
                        <span>Your API key is stored locally and never sent to our servers</span>
                      </motion.p>
                    </motion.div>

                    {/* Connection Test */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="p-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 backdrop-blur-sm rounded-2xl border border-white/30 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <motion.div
                            animate={connectionStatus === 'testing' ? { rotate: 360 } : {}}
                            transition={{ duration: 1, repeat: connectionStatus === 'testing' ? Infinity : 0 }}
                          >
                            {getStatusIcon()}
                          </motion.div>
                          <span className="text-sm font-medium text-gray-700">{getStatusText()}</span>
                        </div>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleTestConnection}
                            disabled={!isConfigured || connectionStatus === 'testing'}
                            className="bg-white/70 hover:bg-white/90 border-white/30 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                          >
                            {connectionStatus === 'testing' ? 'Testing...' : 'Test Connection'}
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>

                    {/* AI Toggle */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 backdrop-blur-sm rounded-2xl border border-white/30 shadow-sm"
                    >
                      <div>
                        <Label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                          <Zap className="w-4 h-4 text-emerald-500" />
                          <span>Enable AI Features</span>
                        </Label>
                        <p className="text-xs text-gray-500 mt-1">Turn on AI-powered functionality</p>
                      </div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Checkbox
                          checked={config.useAI}
                          onCheckedChange={(checked) => updateConfig({ useAI: checked as boolean })}
                          className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                        />
                      </motion.div>
                    </motion.div>
                  </TabsContent>

                  <TabsContent value="models" className="space-y-4">
                    {/* Model Selection */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">AI Model</Label>
                      <Select 
                        value={config.selectedModel} 
                        onValueChange={(value) => updateConfig({ selectedModel: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {['openai', 'anthropic', 'google'].map(provider => (
                            <div key={provider}>
                              <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">
                                {provider}
                              </div>
                              {getModelByProvider(provider).map(model => (
                                <SelectItem key={model.id} value={model.id}>
                                  <div className="flex items-center justify-between w-full">
                                    <span>{model.name}</span>
                                    {model.recommended && (
                                      <Badge variant="outline" className="ml-2 text-xs">
                                        Recommended
                                      </Badge>
                                    )}
                                  </div>
                                </SelectItem>
                              ))}
                            </div>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Model Info */}
                    {selectedModel && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">{selectedModel.name}</h4>
                        <p className="text-sm text-blue-700 mb-3">{selectedModel.description}</p>
                        
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>Max Tokens: {selectedModel.maxTokens.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-3 h-3" />
                            <span>Cost: ${selectedModel.costPer1k}/1K tokens</span>
                          </div>
                        </div>
                        
                        <div className="mt-2">
                          <span className="text-xs text-blue-600">Capabilities:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedModel.capabilities.map(cap => (
                              <Badge key={cap} variant="outline" className="text-xs">
                                {cap}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Model Parameters */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Max Tokens</Label>
                        <Slider
                          value={[config.maxTokens]}
                          onValueChange={([value]) => updateConfig({ maxTokens: value })}
                          max={selectedModel?.maxTokens || 4000}
                          min={100}
                          step={100}
                          className="w-full"
                        />
                        <p className="text-xs text-gray-500">{config.maxTokens} tokens</p>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Temperature</Label>
                        <Slider
                          value={[config.temperature]}
                          onValueChange={([value]) => updateConfig({ temperature: value })}
                          max={2}
                          min={0}
                          step={0.1}
                          className="w-full"
                        />
                        <p className="text-xs text-gray-500">
                          {config.temperature} (0 = deterministic, 2 = very creative)
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="templates" className="space-y-4">
                    {/* Template Selection */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">Available Templates</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowNewTemplateForm(!showNewTemplateForm)}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add Template
                        </Button>
                      </div>

                      <ScrollArea className="h-48">
                        <div className="space-y-2">
                          {relevantTemplates.map(template => (
                            <div
                              key={template.id}
                              className="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium text-sm">{template.name}</h4>
                                  <p className="text-xs text-gray-500 mt-1">{template.description}</p>
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {template.variables.map(variable => (
                                      <Badge key={variable} variant="outline" className="text-xs">
                                        {`{${variable}}`}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-1 ml-2">
                                  <Button variant="ghost" size="sm">
                                    <Copy className="w-3 h-3" />
                                  </Button>
                                  {template.id.startsWith('custom-') && (
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => removeTemplate(template.id)}
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>

                    {/* New Template Form */}
                    {showNewTemplateForm && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-3 p-3 border rounded-lg bg-gray-50"
                      >
                        <Input
                          placeholder="Template name"
                          value={newTemplate.name}
                          onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                        />
                        <Input
                          placeholder="Template description"
                          value={newTemplate.description}
                          onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                        />
                        <Textarea
                          placeholder="Template content (use {variable} for variables)"
                          value={newTemplate.template}
                          onChange={(e) => setNewTemplate({ ...newTemplate, template: e.target.value })}
                          rows={4}
                        />
                        <div className="flex items-center space-x-2">
                          <Button size="sm" onClick={handleAddTemplate}>
                            <Plus className="w-3 h-3 mr-1" />
                            Add Template
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setShowNewTemplateForm(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </TabsContent>

                  <TabsContent value="advanced" className="space-y-4">
                    {/* Quality Settings */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Quality Level</Label>
                      <Select 
                        value={config.qualityLevel} 
                        onValueChange={(value: any) => updateConfig({ qualityLevel: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic - Fast and simple</SelectItem>
                          <SelectItem value="standard">Standard - Balanced quality</SelectItem>
                          <SelectItem value="premium">Premium - High quality</SelectItem>
                          <SelectItem value="enterprise">Enterprise - Maximum quality</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Advanced Options */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Include Examples</Label>
                        <Checkbox
                          checked={config.includeExamples}
                          onCheckedChange={(checked) => updateConfig({ includeExamples: checked as boolean })}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Validate Responses</Label>
                        <Checkbox
                          checked={config.validateResponses}
                          onCheckedChange={(checked) => updateConfig({ validateResponses: checked as boolean })}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Include Metrics</Label>
                        <Checkbox
                          checked={config.includeMetrics}
                          onCheckedChange={(checked) => updateConfig({ includeMetrics: checked as boolean })}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Add Timestamps</Label>
                        <Checkbox
                          checked={config.addTimestamps}
                          onCheckedChange={(checked) => updateConfig({ addTimestamps: checked as boolean })}
                        />
                      </div>
                    </div>

                    {/* Custom Prompts */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Custom Prompt Prefix</Label>
                      <Textarea
                        placeholder="Add custom instructions that will be prepended to all prompts"
                        value={config.customPromptPrefix}
                        onChange={(e) => updateConfig({ customPromptPrefix: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Custom Prompt Suffix</Label>
                      <Textarea
                        placeholder="Add custom instructions that will be appended to all prompts"
                        value={config.customPromptSuffix}
                        onChange={(e) => updateConfig({ customPromptSuffix: e.target.value })}
                        rows={3}
                      />
                    </div>
                  </TabsContent>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={handleExportConfig}>
                      <Download className="w-3 h-3 mr-1" />
                      Export
                    </Button>
                    
                    <label className="cursor-pointer">
                      <Button variant="outline" size="sm" asChild>
                        <span>
                          <Upload className="w-3 h-3 mr-1" />
                          Import
                        </span>
                      </Button>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportConfig}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={handleResetConfig}>
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Reset
                    </Button>
                    
                    <Button size="sm" onClick={handleSaveConfig}>
                      <Save className="w-3 h-3 mr-1" />
                      Save
                    </Button>
                  </div>
                </div>
              </Tabs>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default AIConfigPanel; 