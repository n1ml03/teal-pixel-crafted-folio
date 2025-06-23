import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAIConfig } from '@/contexts/AIConfigContext';
import { getAIService } from '@/utils/aiService';
import {
  Bug,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Camera,
  Video,
  FileText,
  Download,
  Copy,
  Send,
  User,
  Settings,
  Target,
  Zap,
  Plus,
  Minus,
  RefreshCw,
  Brain,
  Lightbulb,
  Search,
  TrendingUp,
  Shield,
  Cpu
} from 'lucide-react';

interface BugReport {
  id: string;
  title: string;
  description: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  category: string;
  environment: {
    browser: string;
    os: string;
    device: string;
    version: string;
  };
  stepsToReproduce: string[];
  expectedResult: string;
  actualResult: string;
  attachments: string[];
  reporter: string;
  assignee?: string;
  tags: string[];
  timestamp: Date;
}

interface AIAnalysis {
  summary: {
    confidence: number;
    severity: string;
    priority: string;
    estimatedImpact: string;
    urgency: string;
  };
  rootCause: {
    possibleCauses: string[];
    probability: number[];
    category: string;
    systemComponent: string;
  };
  investigation: {
    suggestedSteps: string[];
    requiredInformation: string[];
    stakeholders: string[];
    estimatedTime: string;
  };
  solution: {
    quickFixes: string[];
    permanentSolutions: string[];
    workarounds: string[];
    preventionMeasures: string[];
  };
  relatedIssues: {
    similarBugs: string[];
    knownPatterns: string[];
    historicalData: string[];
  };
  metrics: {
    processingTime: number;
    aiModel: string;
    timestamp: string;
  };
}

interface StepTemplate {
  id: string;
  title: string;
  description: string;
  fields: string[];
  validation: (data: Partial<BugReport>) => boolean;
}

const BugReportSimulator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [bugReport, setBugReport] = useState<Partial<BugReport>>({
    severity: 'Medium',
    priority: 'P3',
    environment: {
      browser: '',
      os: '',
      device: '',
      version: ''
    },
    stepsToReproduce: [''],
    attachments: [],
    tags: [],
    timestamp: new Date()
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  
  // AI Analysis states
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [autoAnalyze, setAutoAnalyze] = useState(true);
  const [showAIPanel, setShowAIPanel] = useState(false);

  const { config } = useAIConfig();

  const severityColors = {
    Critical: 'bg-red-100 text-red-700 border-red-200',
    High: 'bg-orange-100 text-orange-700 border-orange-200',
    Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Low: 'bg-green-100 text-green-700 border-green-200'
  };

  const priorityColors = {
    P1: 'bg-red-100 text-red-700 border-red-200',
    P2: 'bg-orange-100 text-orange-700 border-orange-200',
    P3: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    P4: 'bg-green-100 text-green-700 border-green-200'
  };

  const stepTemplates: StepTemplate[] = [
    {
      id: 'basic-info',
      title: 'Basic Information',
      description: 'Provide essential details about the bug',
      fields: ['title', 'description', 'category'],
      validation: (data) => !!(data.title && data.description && data.category)
    },
    {
      id: 'severity-priority',
      title: 'Severity & Priority',
      description: 'Assess the impact and urgency of the bug',
      fields: ['severity', 'priority'],
      validation: (data) => !!(data.severity && data.priority)
    },
    {
      id: 'environment',
      title: 'Environment Details',
      description: 'Specify the testing environment',
      fields: ['environment'],
      validation: (data) => !!(data.environment?.browser && data.environment?.os)
    },
    {
      id: 'reproduction',
      title: 'Reproduction Steps',
      description: 'Detail how to reproduce the bug',
      fields: ['stepsToReproduce', 'expectedResult', 'actualResult'],
      validation: (data) => !!(data.stepsToReproduce?.length > 0 && data.expectedResult && data.actualResult)
    },
    {
      id: 'attachments',
      title: 'Attachments & Evidence',
      description: 'Add supporting materials',
      fields: ['attachments'],
      validation: () => true // Optional step
    },
    {
      id: 'ai-analysis',
      title: 'AI Analysis',
      description: 'Get intelligent insights and recommendations',
      fields: [],
      validation: () => true
    },
    {
      id: 'review',
      title: 'Review & Submit',
      description: 'Review your bug report before submission',
      fields: [],
      validation: () => true
    }
  ];

  const categories = [
    'UI/UX Issues',
    'Functional Defects',
    'Performance Issues',
    'Security Vulnerabilities',
    'Data Issues',
    'Integration Problems',
    'Compatibility Issues',
    'Accessibility Issues'
  ];

  const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera'];
  const operatingSystems = ['Windows 11', 'Windows 10', 'macOS', 'Linux', 'iOS', 'Android'];
  const devices = ['Desktop', 'Laptop', 'Tablet', 'Mobile Phone'];

  useEffect(() => {
    // Auto-detect environment
    const userAgent = navigator.userAgent;
    const detectedBrowser = browsers.find(browser => 
      userAgent.toLowerCase().includes(browser.toLowerCase())
    ) || 'Unknown';
    
    const detectedOS = operatingSystems.find(os => 
      userAgent.includes(os) || 
      (os === 'macOS' && userAgent.includes('Mac')) ||
      (os === 'Windows 10' && userAgent.includes('Windows'))
    ) || 'Unknown';

    setBugReport(prev => ({
      ...prev,
      environment: {
        ...prev.environment,
        browser: detectedBrowser,
        os: detectedOS,
        device: 'Desktop' // Default assumption
      }
    }));
  }, []);

  const updateBugReport = (field: string, value: unknown) => {
    setBugReport(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateEnvironment = (field: string, value: string) => {
    setBugReport(prev => ({
      ...prev,
      environment: {
        ...prev.environment,
        [field]: value
      }
    }));
  };

  const addReproductionStep = () => {
    setBugReport(prev => ({
      ...prev,
      stepsToReproduce: [...(prev.stepsToReproduce || []), '']
    }));
  };

  const updateReproductionStep = (index: number, value: string) => {
    setBugReport(prev => ({
      ...prev,
      stepsToReproduce: prev.stepsToReproduce?.map((step, i) => 
        i === index ? value : step
      ) || []
    }));
  };

  const removeReproductionStep = (index: number) => {
    setBugReport(prev => ({
      ...prev,
      stepsToReproduce: prev.stepsToReproduce?.filter((_, i) => i !== index) || []
    }));
  };

  const addAttachment = (type: 'screenshot' | 'video' | 'log') => {
    const attachment = `${type}_${Date.now()}.${type === 'video' ? 'mp4' : type === 'screenshot' ? 'png' : 'txt'}`;
    setBugReport(prev => ({
      ...prev,
      attachments: [...(prev.attachments || []), attachment]
    }));
  };

  const validateCurrentStep = () => {
    const currentTemplate = stepTemplates[currentStep];
    const errors: string[] = [];

    if (!currentTemplate.validation(bugReport)) {
      errors.push(`Please complete all required fields in ${currentTemplate.title}`);
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const nextStep = () => {
    if (validateCurrentStep() && currentStep < stepTemplates.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitBugReport = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate API submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const finalReport: BugReport = {
        id: `BUG-${Date.now()}`,
        title: bugReport.title || '',
        description: bugReport.description || '',
        severity: bugReport.severity || 'Medium',
        priority: bugReport.priority || 'P3',
        category: bugReport.category || '',
        environment: bugReport.environment || { browser: '', os: '', device: '', version: '' },
        stepsToReproduce: bugReport.stepsToReproduce || [],
        expectedResult: bugReport.expectedResult || '',
        actualResult: bugReport.actualResult || '',
        attachments: bugReport.attachments || [],
        reporter: 'Test User',
        tags: bugReport.tags || [],
        timestamp: new Date()
      };

      console.log('Bug report submitted:', finalReport);
      setShowPreview(true);
    } catch (error) {
      console.error('Error submitting bug report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const exportBugReport = (format: 'json' | 'text') => {
    const data = format === 'json' 
      ? JSON.stringify(bugReport, null, 2)
      : formatBugReportAsText(bugReport);
    
    const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `bug-report-${Date.now()}.${format === 'json' ? 'json' : 'txt'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatBugReportAsText = (report: Partial<BugReport>) => {
    return `
BUG REPORT
==========

Title: ${report.title || 'N/A'}
Category: ${report.category || 'N/A'}
Severity: ${report.severity || 'N/A'}
Priority: ${report.priority || 'N/A'}

Description:
${report.description || 'N/A'}

Environment:
- Browser: ${report.environment?.browser || 'N/A'}
- OS: ${report.environment?.os || 'N/A'}
- Device: ${report.environment?.device || 'N/A'}
- Version: ${report.environment?.version || 'N/A'}

Steps to Reproduce:
${report.stepsToReproduce?.map((step, i) => `${i + 1}. ${step}`).join('\n') || 'N/A'}

Expected Result:
${report.expectedResult || 'N/A'}

Actual Result:
${report.actualResult || 'N/A'}

Attachments:
${report.attachments?.join('\n') || 'None'}

Tags: ${report.tags?.join(', ') || 'None'}
    `.trim();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const performAIAnalysis = async () => {
    if (!config.useAI) {
      setAnalysisError('AI analysis is not enabled. Please configure AI settings.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const aiService = getAIService();
      if (!aiService) {
        throw new Error('AI service not available');
      }

      const bugReportText = formatBugReportForAnalysis(bugReport);
      
      const result = await aiService.analyzeBugReport(bugReportText, {
        environment: `${bugReport.environment?.browser} on ${bugReport.environment?.os}`,
        platform: bugReport.environment?.device || 'unknown',
        version: bugReport.environment?.version || 'unknown'
      });

      if (result.success && result.data) {
        setAiAnalysis(result.data as unknown as AIAnalysis);
        setShowAIPanel(true);
      } else {
        throw new Error(result.error || 'Failed to analyze bug report');
      }
    } catch (error) {
      console.error('AI analysis failed:', error);
      setAnalysisError(error instanceof Error ? error.message : 'AI analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatBugReportForAnalysis = (report: Partial<BugReport>): string => {
    return `
Bug Report Analysis Request:

TITLE: ${report.title || 'No title provided'}

DESCRIPTION:
${report.description || 'No description provided'}

CATEGORY: ${report.category || 'Unknown'}
SEVERITY: ${report.severity || 'Unknown'}
PRIORITY: ${report.priority || 'Unknown'}

ENVIRONMENT:
- Browser: ${report.environment?.browser || 'Unknown'}
- Operating System: ${report.environment?.os || 'Unknown'}
- Device: ${report.environment?.device || 'Unknown'}
- Version: ${report.environment?.version || 'Unknown'}

STEPS TO REPRODUCE:
${report.stepsToReproduce?.map((step, i) => `${i + 1}. ${step}`).join('\n') || 'No steps provided'}

EXPECTED RESULT:
${report.expectedResult || 'No expected result provided'}

ACTUAL RESULT:
${report.actualResult || 'No actual result provided'}

ATTACHMENTS: ${report.attachments?.length || 0} files
TAGS: ${report.tags?.join(', ') || 'None'}
    `.trim();
  };

  // Auto-trigger AI analysis when bug report data changes
  useEffect(() => {
    if (autoAnalyze && config.useAI && bugReport.title && bugReport.description && bugReport.actualResult) {
      const timer = setTimeout(() => {
        performAIAnalysis();
      }, 2000); // Delay to avoid too frequent calls

      return () => clearTimeout(timer);
    }
  }, [bugReport.title, bugReport.description, bugReport.actualResult, autoAnalyze, config.useAI]);

  const renderStepContent = () => {
    const currentTemplate = stepTemplates[currentStep];

    switch (currentTemplate.id) {
      case 'basic-info':
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium">Bug Title *</Label>
              <Input
                placeholder="Brief, descriptive title of the bug"
                value={bugReport.title || ''}
                onChange={(e) => updateBugReport('title', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium">Category *</Label>
              <Select value={bugReport.category || ''} onValueChange={(value) => updateBugReport('category', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select bug category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Description *</Label>
              <Textarea
                placeholder="Detailed description of the bug, including what you were trying to do when it occurred"
                value={bugReport.description || ''}
                onChange={(e) => updateBugReport('description', e.target.value)}
                className="mt-1 h-32"
              />
            </div>
          </div>
        );

      case 'severity-priority':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium">Severity *</Label>
                <Select value={bugReport.severity || ''} onValueChange={(value) => updateBugReport('severity', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Critical">Critical - System crash/data loss</SelectItem>
                    <SelectItem value="High">High - Major feature broken</SelectItem>
                    <SelectItem value="Medium">Medium - Minor feature issue</SelectItem>
                    <SelectItem value="Low">Low - Cosmetic/enhancement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Priority *</Label>
                <Select value={bugReport.priority || ''} onValueChange={(value) => updateBugReport('priority', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="P1">P1 - Fix immediately</SelectItem>
                    <SelectItem value="P2">P2 - Fix in current sprint</SelectItem>
                    <SelectItem value="P3">P3 - Fix in next release</SelectItem>
                    <SelectItem value="P4">P4 - Fix when time permits</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Severity vs Priority Guide</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p><strong>Severity:</strong> Technical impact of the bug</p>
                <p><strong>Priority:</strong> Business urgency to fix the bug</p>
                <p><strong>Example:</strong> A typo on the homepage might be Low severity but High priority if it affects brand image</p>
              </div>
            </div>
          </div>
        );

      case 'environment':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium">Browser *</Label>
                <Select value={bugReport.environment?.browser || ''} onValueChange={(value) => updateEnvironment('browser', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {browsers.map(browser => (
                      <SelectItem key={browser} value={browser}>
                        {browser}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Operating System *</Label>
                <Select value={bugReport.environment?.os || ''} onValueChange={(value) => updateEnvironment('os', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {operatingSystems.map(os => (
                      <SelectItem key={os} value={os}>
                        {os}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Device Type</Label>
                <Select value={bugReport.environment?.device || ''} onValueChange={(value) => updateEnvironment('device', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {devices.map(device => (
                      <SelectItem key={device} value={device}>
                        {device}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Version/Build</Label>
                <Input
                  placeholder="e.g., v2.1.0, build 1234"
                  value={bugReport.environment?.version || ''}
                  onChange={(e) => updateEnvironment('version', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                <span className="font-medium text-green-800">Auto-detected Environment</span>
              </div>
              <p className="text-sm text-green-700">
                We've automatically detected your browser and OS. Please verify and update if needed.
              </p>
            </div>
          </div>
        );

      case 'reproduction':
        return (
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium">Steps to Reproduce *</Label>
                <Button variant="outline" size="sm" onClick={addReproductionStep}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Step
                </Button>
              </div>
              <div className="space-y-3">
                {bugReport.stepsToReproduce?.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-2"
                  >
                    <span className="bg-teal-100 text-teal-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium flex-shrink-0">
                      {index + 1}
                    </span>
                    <Input
                      placeholder={`Step ${index + 1}`}
                      value={step}
                      onChange={(e) => updateReproductionStep(index, e.target.value)}
                      className="flex-1"
                    />
                    {bugReport.stepsToReproduce && bugReport.stepsToReproduce.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeReproductionStep(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium">Expected Result *</Label>
                <Textarea
                  placeholder="What should happen when following the steps above"
                  value={bugReport.expectedResult || ''}
                  onChange={(e) => updateBugReport('expectedResult', e.target.value)}
                  className="mt-1 h-24"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Actual Result *</Label>
                <Textarea
                  placeholder="What actually happens (the bug behavior)"
                  value={bugReport.actualResult || ''}
                  onChange={(e) => updateBugReport('actualResult', e.target.value)}
                  className="mt-1 h-24"
                />
              </div>
            </div>
          </div>
        );

      case 'attachments':
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium">Attachments</Label>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  onClick={() => addAttachment('screenshot')}
                  className="h-24 flex flex-col items-center justify-center space-y-2"
                >
                  <Camera className="w-6 h-6" />
                  <span>Add Screenshot</span>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => addAttachment('video')}
                  className="h-24 flex flex-col items-center justify-center space-y-2"
                >
                  <Video className="w-6 h-6" />
                  <span>Add Video</span>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => addAttachment('log')}
                  className="h-24 flex flex-col items-center justify-center space-y-2"
                >
                  <FileText className="w-6 h-6" />
                  <span>Add Log File</span>
                </Button>
              </div>
            </div>

            {bugReport.attachments && bugReport.attachments.length > 0 && (
              <div>
                <Label className="text-sm font-medium">Current Attachments</Label>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {bugReport.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded border">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700 flex-1">{attachment}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setBugReport(prev => ({
                            ...prev,
                            attachments: prev.attachments?.filter((_, i) => i !== index) || []
                          }));
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Info className="w-4 h-4 text-yellow-600 mr-2" />
                <span className="font-medium text-yellow-800">Attachment Tips</span>
              </div>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Screenshots help visualize the issue</li>
                <li>• Videos are great for showing reproduction steps</li>
                <li>• Log files provide technical details for developers</li>
                <li>• Ensure sensitive information is removed from attachments</li>
              </ul>
            </div>
          </div>
        );

      case 'ai-analysis':
        return renderAIAnalysisPanel();

      case 'review':
        return (
          <div className="space-y-6">
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Bug Report Summary</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Basic Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Title:</strong> {bugReport.title || 'N/A'}</div>
                    <div><strong>Category:</strong> {bugReport.category || 'N/A'}</div>
                    <div className="flex items-center space-x-2">
                      <strong>Severity:</strong>
                      <Badge className={`${severityColors[bugReport.severity || 'Medium']}`}>
                        {bugReport.severity}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <strong>Priority:</strong>
                      <Badge className={`${priorityColors[bugReport.priority || 'P3']}`}>
                        {bugReport.priority}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Environment</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Browser:</strong> {bugReport.environment?.browser || 'N/A'}</div>
                    <div><strong>OS:</strong> {bugReport.environment?.os || 'N/A'}</div>
                    <div><strong>Device:</strong> {bugReport.environment?.device || 'N/A'}</div>
                    <div><strong>Version:</strong> {bugReport.environment?.version || 'N/A'}</div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium text-gray-700 mb-2">Description</h4>
                <p className="text-sm text-gray-600">{bugReport.description || 'N/A'}</p>
              </div>

              <div className="mt-6">
                <h4 className="font-medium text-gray-700 mb-2">Reproduction Steps</h4>
                <ol className="text-sm text-gray-600 space-y-1">
                  {bugReport.stepsToReproduce?.map((step, index) => (
                    <li key={index}>{index + 1}. {step}</li>
                  ))}
                </ol>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Expected Result</h4>
                  <p className="text-sm text-gray-600">{bugReport.expectedResult || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Actual Result</h4>
                  <p className="text-sm text-gray-600">{bugReport.actualResult || 'N/A'}</p>
                </div>
              </div>

              {bugReport.attachments && bugReport.attachments.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-700 mb-2">Attachments</h4>
                  <div className="flex flex-wrap gap-2">
                    {bugReport.attachments.map((attachment, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {attachment}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={() => exportBugReport('json')}>
                  <Download className="w-4 h-4 mr-1" />
                  Export JSON
                </Button>
                <Button variant="outline" onClick={() => exportBugReport('text')}>
                  <Download className="w-4 h-4 mr-1" />
                  Export Text
                </Button>
                <Button variant="outline" onClick={() => copyToClipboard(formatBugReportAsText(bugReport))}>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderAIAnalysisPanel = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-purple-500" />
            <Label className="text-lg font-semibold">AI Bug Analysis</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="auto-analyze"
              checked={autoAnalyze}
              onCheckedChange={(checked) => setAutoAnalyze(checked === true)}
            />
            <Label htmlFor="auto-analyze" className="text-sm">Auto-analyze</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={performAIAnalysis}
              disabled={isAnalyzing || !config.useAI}
            >
              {isAnalyzing ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                  <RefreshCw className="w-4 h-4" />
                </motion.div>
              ) : (
                <Search className="w-4 h-4" />
              )}
              {isAnalyzing ? 'Analyzing...' : 'Analyze'}
            </Button>
          </div>
        </div>

        {!config.useAI && (
          <Alert>
            <Info className="w-4 h-4" />
            <AlertDescription>
              AI analysis is disabled. Enable AI in settings to get intelligent bug insights.
            </AlertDescription>
          </Alert>
        )}

        {analysisError && (
          <Alert variant="destructive">
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>{analysisError}</AlertDescription>
          </Alert>
        )}

        {isAnalyzing && (
          <div className="flex items-center justify-center py-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-4 border-purple-200 border-t-purple-500 rounded-full"
            />
            <span className="ml-3 text-gray-600">Analyzing bug report with AI...</span>
          </div>
        )}

        {aiAnalysis && (
          <div className="space-y-6">
            {/* Summary Section */}
            <Card className="bg-gradient-to-r from-purple-50 to-indigo-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
                  Analysis Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round(aiAnalysis.summary.confidence)}%
                    </div>
                    <div className="text-xs text-gray-600">Confidence</div>
                  </div>
                  <div className="text-center">
                    <Badge className={`${getSeverityColor(aiAnalysis.summary.severity)} text-xs`}>
                      {aiAnalysis.summary.severity}
                    </Badge>
                    <div className="text-xs text-gray-600 mt-1">AI Severity</div>
                  </div>
                  <div className="text-center">
                    <Badge className={`${getPriorityColor(aiAnalysis.summary.priority)} text-xs`}>
                      {aiAnalysis.summary.priority}
                    </Badge>
                    <div className="text-xs text-gray-600 mt-1">AI Priority</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-gray-800">
                      {aiAnalysis.summary.urgency}
                    </div>
                    <div className="text-xs text-gray-600">Urgency</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Root Cause Analysis */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Search className="w-5 h-5 mr-2 text-orange-600" />
                  Root Cause Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Most Likely Causes:</Label>
                    <div className="mt-2 space-y-2">
                      {aiAnalysis.rootCause.possibleCauses.map((cause, index) => (
                        <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                          <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                          <span className="text-sm flex-1">{cause}</span>
                          <Badge variant="outline" className="text-xs">
                            {aiAnalysis.rootCause.probability[index]}% likely
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Category:</Label>
                      <p className="text-sm text-gray-600 mt-1">{aiAnalysis.rootCause.category}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">System Component:</Label>
                      <p className="text-sm text-gray-600 mt-1">{aiAnalysis.rootCause.systemComponent}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Investigation Plan */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Target className="w-5 h-5 mr-2 text-blue-600" />
                  Investigation Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="steps" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="steps">Next Steps</TabsTrigger>
                    <TabsTrigger value="info">Required Info</TabsTrigger>
                    <TabsTrigger value="team">Stakeholders</TabsTrigger>
                  </TabsList>
                  <TabsContent value="steps" className="mt-4">
                    <div className="space-y-2">
                      {aiAnalysis.investigation.suggestedSteps.map((step, index) => (
                        <div key={index} className="flex items-start space-x-3 p-2 border rounded">
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-medium">
                            {index + 1}
                          </div>
                          <span className="text-sm">{step}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="info" className="mt-4">
                    <div className="space-y-2">
                      {aiAnalysis.investigation.requiredInformation.map((info, index) => (
                        <div key={index} className="flex items-center space-x-2 p-2 bg-yellow-50 rounded">
                          <Info className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm">{info}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="team" className="mt-4">
                    <div className="space-y-2">
                      {aiAnalysis.investigation.stakeholders.map((stakeholder, index) => (
                        <div key={index} className="flex items-center space-x-2 p-2 bg-green-50 rounded">
                          <User className="w-4 h-4 text-green-600" />
                          <span className="text-sm">{stakeholder}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-3 bg-gray-50 rounded text-sm text-gray-600">
                      <strong>Estimated Investigation Time:</strong> {aiAnalysis.investigation.estimatedTime}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Solutions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Lightbulb className="w-5 h-5 mr-2 text-green-600" />
                  Suggested Solutions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="quick" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="quick">Quick Fixes</TabsTrigger>
                    <TabsTrigger value="permanent">Permanent</TabsTrigger>
                    <TabsTrigger value="workarounds">Workarounds</TabsTrigger>
                    <TabsTrigger value="prevention">Prevention</TabsTrigger>
                  </TabsList>
                  <TabsContent value="quick" className="mt-4">
                    <div className="space-y-2">
                      {aiAnalysis.solution.quickFixes.map((fix, index) => (
                        <div key={index} className="p-3 border rounded-lg bg-green-50">
                          <div className="flex items-center space-x-2 mb-1">
                            <Zap className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium">Quick Fix #{index + 1}</span>
                          </div>
                          <p className="text-sm text-gray-700">{fix}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="permanent" className="mt-4">
                    <div className="space-y-2">
                      {aiAnalysis.solution.permanentSolutions.map((solution, index) => (
                        <div key={index} className="p-3 border rounded-lg bg-blue-50">
                          <div className="flex items-center space-x-2 mb-1">
                            <CheckCircle className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium">Permanent Solution #{index + 1}</span>
                          </div>
                          <p className="text-sm text-gray-700">{solution}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="workarounds" className="mt-4">
                    <div className="space-y-2">
                      {aiAnalysis.solution.workarounds.map((workaround, index) => (
                        <div key={index} className="p-3 border rounded-lg bg-yellow-50">
                          <div className="flex items-center space-x-2 mb-1">
                            <Settings className="w-4 h-4 text-yellow-600" />
                            <span className="text-sm font-medium">Workaround #{index + 1}</span>
                          </div>
                          <p className="text-sm text-gray-700">{workaround}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="prevention" className="mt-4">
                    <div className="space-y-2">
                      {aiAnalysis.solution.preventionMeasures.map((measure, index) => (
                        <div key={index} className="p-3 border rounded-lg bg-purple-50">
                          <div className="flex items-center space-x-2 mb-1">
                            <Shield className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-medium">Prevention #{index + 1}</span>
                          </div>
                          <p className="text-sm text-gray-700">{measure}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Related Issues */}
            {aiAnalysis.relatedIssues && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Cpu className="w-5 h-5 mr-2 text-gray-600" />
                    Related Issues & Patterns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Similar Bugs:</Label>
                      <div className="mt-2 space-y-1">
                        {aiAnalysis.relatedIssues.similarBugs.map((bug, index) => (
                          <Badge key={index} variant="outline" className="text-xs block text-center">
                            {bug}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Known Patterns:</Label>
                      <div className="mt-2 space-y-1">
                        {aiAnalysis.relatedIssues.knownPatterns.map((pattern, index) => (
                          <Badge key={index} variant="outline" className="text-xs block text-center">
                            {pattern}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Historical Data:</Label>
                      <div className="mt-2 space-y-1">
                        {aiAnalysis.relatedIssues.historicalData.map((data, index) => (
                          <Badge key={index} variant="outline" className="text-xs block text-center">
                            {data}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Analysis Metadata */}
            <div className="text-xs text-gray-500 text-center p-2 bg-gray-50 rounded">
              Analysis completed by {aiAnalysis.metrics.aiModel} in {aiAnalysis.metrics.processingTime}ms
              at {new Date(aiAnalysis.metrics.timestamp).toLocaleString()}
            </div>
          </div>
        )}
      </div>
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'p1': return 'bg-red-100 text-red-700 border-red-200';
      case 'p2': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'p3': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'p4': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border';
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 via-blue-50 to-teal-50 p-6">
      <div className="max-w-4xl mx-auto h-full">
        <Card className="h-full bg-white/80 backdrop-blur-sm border">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                <Bug className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-gray-800">Bug Report Simulator</CardTitle>
                <CardDescription>Guided workflow for creating comprehensive bug reports</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="h-[calc(100%-120px)] flex flex-col">
            {/* Progress Indicator */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Step {currentStep + 1} of {stepTemplates.length}
                </span>
                <span className="text-sm text-gray-500">
                  {Math.round(((currentStep + 1) / stepTemplates.length) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-teal-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / stepTemplates.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Step Content */}
            <div className="flex-1 overflow-y-auto">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {stepTemplates[currentStep].title}
                  </h2>
                  <p className="text-gray-600">
                    {stepTemplates[currentStep].description}
                  </p>
                </div>

                {validationErrors.length > 0 && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center mb-2">
                      <XCircle className="w-4 h-4 text-red-600 mr-2" />
                      <span className="font-medium text-red-800">Please fix the following issues:</span>
                    </div>
                    <ul className="text-sm text-red-700 space-y-1">
                      {validationErrors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {renderStepContent()}
              </motion.div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                Previous
              </Button>

              <div className="flex items-center space-x-2">
                {currentStep === stepTemplates.length - 1 ? (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={submitBugReport}
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600"
                    >
                      {isSubmitting ? (
                        <motion.div 
                          animate={{ rotate: 360 }} 
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                        </motion.div>
                      ) : (
                        <Send className="w-4 h-4 mr-2" />
                      )}
                      {isSubmitting ? 'Submitting...' : 'Submit Bug Report'}
                    </Button>
                  </motion.div>
                ) : (
                  <Button
                    onClick={nextStep}
                    className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600"
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Success Modal */}
        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowPreview(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                className="bg-white rounded-3xl max-w-md w-full p-8 text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Bug Report Submitted!</h3>
                <p className="text-gray-600 mb-6">
                  Your bug report has been successfully created and is ready for review by the development team.
                </p>
                <Button
                  onClick={() => setShowPreview(false)}
                  className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600"
                >
                  Close
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BugReportSimulator;