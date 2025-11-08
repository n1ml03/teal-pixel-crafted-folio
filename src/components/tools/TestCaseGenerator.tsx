import { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useAIConfig } from '@/contexts/AIConfigContext';
import { getAIService } from '@/utils/aiService';
import {
  TestTube,
  Sparkles,
  Download,
  Copy,
  RefreshCw,
  CheckCircle,
  Info,
  Target,
  FileText,
  Clock,
  Eye,
  Brain,
  AlertCircle,
  TrendingUp,
  Shield} from 'lucide-react';

interface TestCase {
  id: string;
  title: string;
  description: string;
  preconditions: string[];
  steps: string[];
  expectedResults: string[];
  priority: 'High' | 'Medium' | 'Low';
  type: 'Functional' | 'Non-Functional' | 'Security' | 'Performance' | 'Usability';
  category: string;
  estimatedTime: number;
  testData?: string;
  tags: string[];
}

interface Requirement {
  id: string;
  text: string;
  type: 'Feature' | 'User Story' | 'Acceptance Criteria';
  priority: 'High' | 'Medium' | 'Low';
}

interface AITestSuite {
  id: string;
  name: string;
  description: string;
  testCases: TestCase[];
  coverage: {
    functional: number;
    security: number;
    performance: number;
    usability: number;
    boundary: number;
    negative: number;
  };
  metrics: {
    totalTests: number;
    estimatedTime: number;
    complexityScore: number;
    riskLevel: 'Low' | 'Medium' | 'High';
  };
  recommendations: string[];
  generatedAt: string;
  aiModel: string;
}

interface AIAnalysisResult {
  testSuite: AITestSuite;
  insights: {
    coverageGaps: string[];
    riskAreas: string[];
    optimizationSuggestions: string[];
    qualityScore: number;
  };
  metadata: {
    analysisTime: number;
    confidence: number;
    model: string;
  };
}

const TestCaseGenerator = () => {
  const [requirements, setRequirements] = useState<string>('');
  const [selectedFramework, setSelectedFramework] = useState('traditional');
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['Functional']);
  const [includeBoundary, setIncludeBoundary] = useState(true);
  const [includeNegative, setIncludeNegative] = useState(true);
  const [includePerformance, setIncludePerformance] = useState(false);
  const [includeSecurity, setIncludeSecurity] = useState(false);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('input');
  const [selectedTestCase, setSelectedTestCase] = useState<TestCase | null>(null);
  const [coverage, setCoverage] = useState<{ [key: string]: number }>({});

  // AI Integration States
  const { config, isConfigured } = useAIConfig();
  const [aiTestSuite, setAiTestSuite] = useState<AITestSuite | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [useAIGeneration, setUseAIGeneration] = useState(true);
  const [maxTestCases, setMaxTestCases] = useState(25);
  const [qualityLevel, setQualityLevel] = useState<'basic' | 'standard' | 'premium' | 'enterprise'>('standard');
  const [autoAnalyze, setAutoAnalyze] = useState(true);

  const frameworks = [
    { value: 'traditional', label: 'Traditional Test Cases' },
    { value: 'bdd', label: 'BDD (Given-When-Then)' },
    { value: 'exploratory', label: 'Exploratory Testing' },
    { value: 'datadriven', label: 'Data-Driven Testing' }
  ];

  const testTypes = [
    'Functional',
    'Non-Functional',
    'Security',
    'Performance',
    'Usability',
    'Compatibility',
    'Integration',
    'Regression'
  ];

  const priorityColors = {
    High: 'bg-red-100 text-red-700 border-red-200',
    Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Low: 'bg-green-100 text-green-700 border-green-200'
  };

  const typeColors = {
    Functional: 'bg-blue-100 text-blue-700 border-blue-200',
    'Non-Functional': 'bg-purple-100 text-purple-700 border-purple-200',
    Security: 'bg-red-100 text-red-700 border-red-200',
    Performance: 'bg-orange-100 text-orange-700 border-orange-200',
    Usability: 'bg-green-100 text-green-700 border-green-200'
  };

  // AI-Enhanced Test Case Generation
  const generateTestCasesWithAI = async (): Promise<TestCase[]> => {
    const aiService = getAIService();
    if (!aiService || !isConfigured) {
      throw new Error('AI service is not configured');
    }

    setAiError(null);
    
    const response = await aiService.generateTestCases(requirements, {
      framework: selectedFramework,
      testTypes: selectedTypes,
      maxTestCases,
      qualityLevel
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to generate test cases');
    }

    // Parse the AI response and convert to TestCase format
    const aiData = response.data as {
      testCases?: Array<{
        id?: string;
        title?: string;
        description?: string;
        preconditions?: string[];
        steps?: string[];
        expectedResults?: string[];
        priority?: string;
        type?: string;
        category?: string;
        estimatedTime?: number;
        testData?: string;
        tags?: string[];
      }>;
    };
    
    if (aiData.testCases && Array.isArray(aiData.testCases)) {
      return aiData.testCases.map((tc, index: number) => ({
        id: tc.id || `ai-tc-${Date.now()}-${index}`,
        title: tc.title || `AI Generated Test Case ${index + 1}`,
        description: tc.description || '',
        preconditions: Array.isArray(tc.preconditions) ? tc.preconditions : [],
        steps: Array.isArray(tc.steps) ? tc.steps : [],
        expectedResults: Array.isArray(tc.expectedResults) ? tc.expectedResults : [],
        priority: ['High', 'Medium', 'Low'].includes(tc.priority) ? tc.priority as 'High' | 'Medium' | 'Low' : 'Medium',
        type: ['Functional', 'Non-Functional', 'Security', 'Performance', 'Usability'].includes(tc.type) ? tc.type as 'Functional' | 'Non-Functional' | 'Security' | 'Performance' | 'Usability' : 'Functional',
        category: tc.category || 'General',
        estimatedTime: typeof tc.estimatedTime === 'number' ? tc.estimatedTime : 15,
        testData: tc.testData,
        tags: Array.isArray(tc.tags) ? tc.tags : ['ai-generated']
      }));
    }

    return [];
  };

  // AI Test Suite Analysis
  const performAIAnalysis = async (testCases: TestCase[]): Promise<void> => {
    const aiService = getAIService();
    if (!aiService || !isConfigured || testCases.length === 0) return;

    setIsAnalyzing(true);
    setAiError(null);

    try {
      // Create test suite data for analysis
      const testSuiteData = {
        requirements,
        framework: selectedFramework,
        testTypes: selectedTypes,
        testCases: testCases.map(tc => ({
          title: tc.title,
          type: tc.type,
          priority: tc.priority,
          category: tc.category,
          estimatedTime: tc.estimatedTime,
          tags: tc.tags
        }))
      };

      // Call AI service for analysis (using code analysis as a base)
      const response = await aiService.analyzeCode(JSON.stringify(testSuiteData), {
        language: 'test-suite',
        focusAreas: ['coverage', 'quality', 'optimization', 'risk-assessment'],
        qualityLevel
      });

      if (response.success && response.data) {
        // Build AI test suite
        const responseData = response.data as {
          recommendations?: string[];
          coverageGaps?: string[];
          riskAreas?: string[];
          optimizations?: string[];
          qualityScore?: number;
          confidence?: number;
        };
        
        const aiTestSuite: AITestSuite = {
          id: `ai-suite-${Date.now()}`,
          name: `AI Generated Test Suite - ${new Date().toLocaleDateString()}`,
          description: `Comprehensive test suite generated for: ${requirements.slice(0, 100)}...`,
          testCases,
          coverage: calculateAICoverage(testCases),
          metrics: calculateAIMetrics(testCases),
          recommendations: responseData.recommendations || [],
          generatedAt: new Date().toISOString(),
          aiModel: config.selectedModel
        };

        // Build analysis result
        const analysisResult: AIAnalysisResult = {
          testSuite: aiTestSuite,
          insights: {
            coverageGaps: responseData.coverageGaps || [],
            riskAreas: responseData.riskAreas || [],
            optimizationSuggestions: responseData.optimizations || [],
            qualityScore: responseData.qualityScore || 85
          },
          metadata: {
            analysisTime: response.metadata?.responseTime || 0,
            confidence: responseData.confidence || 90,
            model: response.metadata?.model || config.selectedModel
          }
        };

        setAiTestSuite(aiTestSuite);
        setAiAnalysis(analysisResult);
      }
    } catch (error) {
      setAiError((error as Error).message || 'Failed to perform AI analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Calculate AI-enhanced coverage metrics
  const calculateAICoverage = (testCases: TestCase[]) => {
    const total = testCases.length;
    if (total === 0) return { functional: 0, security: 0, performance: 0, usability: 0, boundary: 0, negative: 0 };

    return {
      functional: Math.round((testCases.filter(tc => tc.type === 'Functional').length / total) * 100),
      security: Math.round((testCases.filter(tc => tc.type === 'Security' || tc.tags.includes('security')).length / total) * 100),
      performance: Math.round((testCases.filter(tc => tc.type === 'Performance' || tc.tags.includes('performance')).length / total) * 100),
      usability: Math.round((testCases.filter(tc => tc.type === 'Usability' || tc.tags.includes('usability')).length / total) * 100),
      boundary: Math.round((testCases.filter(tc => tc.tags.includes('boundary') || tc.tags.includes('edge-case')).length / total) * 100),
      negative: Math.round((testCases.filter(tc => tc.tags.includes('negative') || tc.tags.includes('error')).length / total) * 100)
    };
  };

  // Calculate AI-enhanced metrics
  const calculateAIMetrics = (testCases: TestCase[]) => {
    const totalTime = testCases.reduce((sum, tc) => sum + tc.estimatedTime, 0);
    const highPriorityCount = testCases.filter(tc => tc.priority === 'High').length;
    const complexityScore = Math.round((testCases.length * 2 + highPriorityCount * 3 + totalTime * 0.1) / 10);
    
    let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
    if (complexityScore > 15) riskLevel = 'High';
    else if (complexityScore > 8) riskLevel = 'Medium';

    return {
      totalTests: testCases.length,
      estimatedTime: totalTime,
      complexityScore,
      riskLevel
    };
  };

  const generateTestCases = async () => {
    if (!requirements.trim()) {
      alert('Please enter requirements first');
      return;
    }

    setLoading(true);
    setAiError(null);
    
    try {
      let generatedCases: TestCase[] = [];

      if (useAIGeneration && isConfigured) {
        // Use AI generation
        setIsGeneratingAI(true);
        generatedCases = await generateTestCasesWithAI();
        setIsGeneratingAI(false);
      } else {
        // Use traditional generation
        const reqs = parseRequirements(requirements);
        generatedCases = await createTestCasesFromRequirements(reqs);
      }

      setTestCases(generatedCases);
      
      if (generatedCases.length > 0) {
        calculateCoverage(generatedCases);
        
        // Perform AI analysis if enabled
        if (autoAnalyze && isConfigured) {
          await performAIAnalysis(generatedCases);
        }
      }
      
      setActiveTab('results');
    } catch (error) {
      console.error('Error generating test cases:', error);
      setAiError((error as Error).message || 'Failed to generate test cases');
    } finally {
      setLoading(false);
      setIsGeneratingAI(false);
    }
  };

  const parseRequirements = (text: string): Requirement[] => {
    const lines = text.split('\n').filter(line => line.trim());
    return lines.map((line, index) => ({
      id: `req-${index}`,
      text: line.trim(),
      type: line.toLowerCase().includes('user') ? 'User Story' : 
            line.toLowerCase().includes('given') || line.toLowerCase().includes('when') ? 'Acceptance Criteria' : 'Feature',
      priority: line.toLowerCase().includes('critical') || line.toLowerCase().includes('must') ? 'High' :
                line.toLowerCase().includes('should') ? 'Medium' : 'Low'
    }));
  };

  const createTestCasesFromRequirements = async (reqs: Requirement[]): Promise<TestCase[]> => {
    const cases: TestCase[] = [];
    
    reqs.forEach((req, index) => {
      // Generate positive test cases
      cases.push({
        id: `tc-${index}-positive`,
        title: `Verify ${req.text.slice(0, 50)}... - Positive Flow`,
        description: `Test the main functionality of: ${req.text}`,
        preconditions: [
          'User is logged in',
          'Application is in stable state',
          'Required permissions are granted'
        ],
        steps: generateStepsFromRequirement(req, 'positive'),
        expectedResults: [
          'Feature works as expected',
          'Appropriate success message is displayed',
          'System state is updated correctly'
        ],
        priority: req.priority,
        type: selectedTypes.includes('Functional') ? 'Functional' : (['Non-Functional', 'Security', 'Performance', 'Usability'].includes(selectedTypes[0]) ? selectedTypes[0] as 'Non-Functional' | 'Security' | 'Performance' | 'Usability' : 'Functional'),
        category: getTestCategory(req.text),
        estimatedTime: 15,
        testData: generateTestData(req.text),
        tags: extractTags(req.text)
      });

      // Generate negative test cases if enabled
      if (includeNegative) {
        cases.push({
          id: `tc-${index}-negative`,
          title: `Verify ${req.text.slice(0, 50)}... - Negative Flow`,
          description: `Test error handling for: ${req.text}`,
          preconditions: [
            'User is logged in',
            'Application is in stable state'
          ],
          steps: generateStepsFromRequirement(req, 'negative'),
          expectedResults: [
            'Appropriate error message is displayed',
            'System handles error gracefully',
            'No data corruption occurs'
          ],
          priority: req.priority,
          type: 'Functional',
          category: getTestCategory(req.text),
          estimatedTime: 10,
          testData: generateInvalidTestData(req.text),
          tags: [...extractTags(req.text), 'negative', 'error-handling']
        });
      }

      // Generate boundary test cases if enabled
      if (includeBoundary) {
        cases.push({
          id: `tc-${index}-boundary`,
          title: `Verify ${req.text.slice(0, 50)}... - Boundary Conditions`,
          description: `Test boundary conditions for: ${req.text}`,
          preconditions: [
            'User is logged in',
            'Application is in stable state'
          ],
          steps: generateStepsFromRequirement(req, 'boundary'),
          expectedResults: [
            'Boundary values are handled correctly',
            'System behavior is consistent at limits',
            'No unexpected errors occur'
          ],
          priority: 'Medium',
          type: 'Functional',
          category: getTestCategory(req.text),
          estimatedTime: 12,
          testData: generateBoundaryTestData(req.text),
          tags: [...extractTags(req.text), 'boundary', 'edge-case']
        });
      }

      // Generate performance test cases if enabled
      if (includePerformance) {
        cases.push({
          id: `tc-${index}-performance`,
          title: `Performance Test - ${req.text.slice(0, 50)}...`,
          description: `Test performance aspects of: ${req.text}`,
          preconditions: [
            'Performance testing environment is set up',
            'Baseline metrics are recorded'
          ],
          steps: generatePerformanceSteps(req),
          expectedResults: [
            'Response time is within acceptable limits',
            'System can handle expected load',
            'No memory leaks or performance degradation'
          ],
          priority: 'Medium',
          type: 'Performance',
          category: 'Performance',
          estimatedTime: 30,
          testData: 'Load testing data set',
          tags: [...extractTags(req.text), 'performance', 'load-testing']
        });
      }

      // Generate security test cases if enabled
      if (includeSecurity) {
        cases.push({
          id: `tc-${index}-security`,
          title: `Security Test - ${req.text.slice(0, 50)}...`,
          description: `Test security aspects of: ${req.text}`,
          preconditions: [
            'Security testing tools are configured',
            'Test environment is isolated'
          ],
          steps: generateSecuritySteps(req),
          expectedResults: [
            'No security vulnerabilities are exposed',
            'Unauthorized access is prevented',
            'Data is properly protected'
          ],
          priority: 'High',
          type: 'Security',
          category: 'Security',
          estimatedTime: 25,
          testData: 'Security test payloads',
          tags: [...extractTags(req.text), 'security', 'vulnerability']
        });
      }
    });

    return cases;
  };

  const generateStepsFromRequirement = (req: Requirement, type: 'positive' | 'negative' | 'boundary'): string[] => {
    const baseSteps = [
      'Navigate to the relevant page/feature',
      'Ensure all preconditions are met',
      'Identify the test elements'
    ];

    switch (type) {
      case 'positive':
        return [
          ...baseSteps,
          'Enter valid test data',
          'Execute the primary action',
          'Verify the expected outcome',
          'Check system state changes'
        ];
      case 'negative':
        return [
          ...baseSteps,
          'Enter invalid/malformed test data',
          'Attempt to execute the action',
          'Verify error handling',
          'Confirm system stability'
        ];
      case 'boundary':
        return [
          ...baseSteps,
          'Test with minimum valid values',
          'Test with maximum valid values',
          'Test with values just outside valid range',
          'Verify boundary behavior'
        ];
      default:
        return baseSteps;
    }
  };

  const generatePerformanceSteps = (req: Requirement): string[] => [
    'Set up performance monitoring tools',
    'Configure load testing parameters',
    'Execute baseline performance test',
    'Gradually increase load to target volume',
    'Monitor system metrics during test',
    'Record response times and throughput',
    'Analyze performance bottlenecks',
    'Compare results with performance criteria'
  ];

  const generateSecuritySteps = (req: Requirement): string[] => [
    'Configure security testing tools',
    'Identify potential attack vectors',
    'Test for common vulnerabilities (OWASP Top 10)',
    'Attempt SQL injection attacks',
    'Test for XSS vulnerabilities',
    'Verify authentication and authorization',
    'Test for data exposure',
    'Document security findings'
  ];

  const getTestCategory = (text: string): string => {
    if (text.toLowerCase().includes('login') || text.toLowerCase().includes('auth')) return 'Authentication';
    if (text.toLowerCase().includes('user') || text.toLowerCase().includes('profile')) return 'User Management';
    if (text.toLowerCase().includes('data') || text.toLowerCase().includes('database')) return 'Data Management';
    if (text.toLowerCase().includes('ui') || text.toLowerCase().includes('interface')) return 'User Interface';
    if (text.toLowerCase().includes('api') || text.toLowerCase().includes('service')) return 'API';
    return 'General';
  };

  const generateTestData = (text: string): string => {
    if (text.toLowerCase().includes('email')) return 'test@example.com, user123@domain.org';
    if (text.toLowerCase().includes('password')) return 'ValidPass123!, TestPassword456@';
    if (text.toLowerCase().includes('name')) return 'John Doe, Jane Smith, Test User';
    if (text.toLowerCase().includes('number') || text.toLowerCase().includes('amount')) return '100, 1000, 50.25';
    return 'Valid test data set';
  };

  const generateInvalidTestData = (text: string): string => {
    if (text.toLowerCase().includes('email')) return 'invalid-email, @domain.com, test@';
    if (text.toLowerCase().includes('password')) return 'weak, 123, empty string';
    if (text.toLowerCase().includes('name')) return 'Special@Chars, Very Long Name That Exceeds Limits';
    if (text.toLowerCase().includes('number')) return '-1, 0, extremely large number';
    return 'Invalid/malformed test data';
  };

  const generateBoundaryTestData = (text: string): string => {
    if (text.toLowerCase().includes('email')) return 'a@b.co (min), very.long.email.address@extremely.long.domain.name.com (max)';
    if (text.toLowerCase().includes('password')) return '8 chars (min), 128 characters long password (max)';
    if (text.toLowerCase().includes('number')) return '0, 1, 9999, 10000';
    return 'Boundary value test data';
  };

  const extractTags = (text: string): string[] => {
    const tags = [];
    if (text.toLowerCase().includes('user')) tags.push('user-related');
    if (text.toLowerCase().includes('login')) tags.push('authentication');
    if (text.toLowerCase().includes('data')) tags.push('data-handling');
    if (text.toLowerCase().includes('ui')) tags.push('ui-testing');
    if (text.toLowerCase().includes('api')) tags.push('api-testing');
    return tags.length > 0 ? tags : ['general'];
  };

  const calculateCoverage = (cases: TestCase[]) => {
    const categories = Array.from(new Set(cases.map(tc => tc.category)));
    const types = Array.from(new Set(cases.map(tc => tc.type)));
    
    setCoverage({
      'Total Test Cases': cases.length,
      'Categories Covered': categories.length,
      'Test Types': types.length,
      'High Priority': cases.filter(tc => tc.priority === 'High').length,
      'Estimated Hours': Math.round(cases.reduce((sum, tc) => sum + tc.estimatedTime, 0) / 60 * 10) / 10
    });
  };

  const exportTestCases = (format: 'json' | 'csv' | 'excel') => {
    const dataStr = format === 'json' 
      ? JSON.stringify(testCases, null, 2)
      : convertToCSV(testCases);
    
    const blob = new Blob([dataStr], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `test-cases.${format === 'json' ? 'json' : 'csv'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const convertToCSV = (data: TestCase[]): string => {
    const headers = ['ID', 'Title', 'Description', 'Priority', 'Type', 'Category', 'Estimated Time', 'Tags'];
    const rows = data.map(tc => [
      tc.id,
      tc.title,
      tc.description,
      tc.priority,
      tc.type,
      tc.category,
      tc.estimatedTime.toString(),
      tc.tags.join('; ')
    ]);
    
    return [headers, ...rows].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="w-full bg-transparent p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="input" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Requirements & Settings</span>
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center space-x-2">
              <TestTube className="w-4 h-4" />
              <span>Generated Test Cases</span>
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span>AI Analysis</span>
            </TabsTrigger>
          </TabsList>

          <div className="min-h-[600px]">
            <TabsContent value="input" className="space-y-0">
              <Card className="bg-white/80 backdrop-blur-sm border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-gray-800">Requirements & Configuration</CardTitle>
                        <CardDescription>Define your requirements and configure test generation settings</CardDescription>
                      </div>
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        onClick={generateTestCases}
                        disabled={loading || !requirements.trim()}
                        className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600"
                      >
                        {loading ? (
                          <motion.div 
                            animate={{ rotate: 360 }} 
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                          </motion.div>
                        ) : (
                          <Sparkles className="w-4 h-4 mr-2" />
                        )}
                        {loading ? (isGeneratingAI ? 'AI Generating...' : 'Generating...') : 'Generate Test Cases'}
                      </Button>
                    </motion.div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Requirements Input */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Requirements</Label>
                    <Textarea
                      placeholder="Enter your requirements, user stories, or acceptance criteria here. Each line will be treated as a separate requirement..."
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                      className="min-h-[200px] resize-none"
                    />
                    <p className="text-sm text-gray-500">
                      Tip: Write clear, specific requirements. Each line will be analyzed separately for test case generation.
                    </p>
                  </div>

                  {/* Test Framework and Types */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Test Framework</Label>
                      <Select value={selectedFramework} onValueChange={setSelectedFramework}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {frameworks.map(framework => (
                            <SelectItem key={framework.value} value={framework.value}>
                              {framework.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Test Types to Include</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {testTypes.map(type => (
                          <div key={type} className="flex items-center space-x-2">
                            <Checkbox
                              id={type}
                              checked={selectedTypes.includes(type)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedTypes([...selectedTypes, type]);
                                } else {
                                  setSelectedTypes(selectedTypes.filter(t => t !== type));
                                }
                              }}
                            />
                            <Label htmlFor={type} className="text-sm">{type}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* AI Generation Settings */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold flex items-center">
                      <Brain className="w-4 h-4 mr-2" />
                      AI Generation Settings
                    </Label>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="useAI"
                          checked={useAIGeneration}
                          onCheckedChange={(checked) => setUseAIGeneration(checked as boolean)}
                        />
                        <Label htmlFor="useAI" className="text-sm">Use AI Generation</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="autoAnalyze"
                          checked={autoAnalyze}
                          onCheckedChange={(checked) => setAutoAnalyze(checked as boolean)}
                        />
                        <Label htmlFor="autoAnalyze" className="text-sm">Auto-analyze Results</Label>
                      </div>
                    </div>

                    {useAIGeneration && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm">Max Test Cases</Label>
                          <Input
                            type="number"
                            value={maxTestCases}
                            onChange={(e) => setMaxTestCases(Number(e.target.value))}
                            min={1}
                            max={100}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label className="text-sm">Quality Level</Label>
                          <Select value={qualityLevel} onValueChange={(value) => setQualityLevel(value as 'basic' | 'standard' | 'premium' | 'enterprise')}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="basic">Basic</SelectItem>
                              <SelectItem value="standard">Standard</SelectItem>
                              <SelectItem value="premium">Premium</SelectItem>
                              <SelectItem value="enterprise">Enterprise</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    {!isConfigured && useAIGeneration && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <div className="flex items-center">
                          <AlertCircle className="w-4 h-4 text-amber-600 mr-2" />
                          <span className="text-sm text-amber-800">
                            AI is not configured. Please configure AI settings to use AI generation.
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Traditional Generation Options */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Generation Options</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="boundary"
                          checked={includeBoundary}
                          onCheckedChange={(checked) => setIncludeBoundary(checked as boolean)}
                        />
                        <Label htmlFor="boundary" className="text-sm">Include Boundary Value Testing</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="negative"
                          checked={includeNegative}
                          onCheckedChange={(checked) => setIncludeNegative(checked as boolean)}
                        />
                        <Label htmlFor="negative" className="text-sm">Include Negative Test Cases</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="performance"
                          checked={includePerformance}
                          onCheckedChange={(checked) => setIncludePerformance(checked as boolean)}
                        />
                        <Label htmlFor="performance" className="text-sm">Generate Performance Tests</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="security"
                          checked={includeSecurity}
                          onCheckedChange={(checked) => setIncludeSecurity(checked as boolean)}
                        />
                        <Label htmlFor="security" className="text-sm">Generate Security Tests</Label>
                      </div>
                    </div>
                  </div>

                  {/* Error Display */}
                  {aiError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-center">
                        <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                        <span className="text-sm text-red-800">{aiError}</span>
                      </div>
                    </div>
                  )}

                  {/* Preview */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Generation Preview</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Requirements:</span>
                        <div className="font-medium">{requirements.split('\n').filter(line => line.trim()).length}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Est. Test Cases:</span>
                        <div className="font-medium">
                          {useAIGeneration ? maxTestCases : Math.min(
                            25,
                            requirements.split('\n').filter(line => line.trim()).length * 
                            (1 + (includeNegative ? 1 : 0) + (includeBoundary ? 1 : 0) + 
                             (includePerformance ? 1 : 0) + (includeSecurity ? 1 : 0))
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Framework:</span>
                        <div className="font-medium">{frameworks.find(f => f.value === selectedFramework)?.label}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Types:</span>
                        <div className="font-medium">{selectedTypes.length}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Generation Mode:</span>
                        <div className="font-medium">{useAIGeneration ? 'AI-Powered' : 'Traditional'}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">AI Status:</span>
                        <div className={`font-medium ${isConfigured ? 'text-green-600' : 'text-orange-600'}`}>
                          {isConfigured ? 'Configured' : 'Not Configured'}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Quality Level:</span>
                        <div className="font-medium">{qualityLevel}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Model:</span>
                        <div className="font-medium">{isConfigured ? config.selectedModel : 'N/A'}</div>
                      </div>
                    </div>
                    
                    {/* AI Configuration Status */}
                    <div className="mt-4 p-3 rounded-lg border-l-4 border-blue-400 bg-blue-50">
                      <div className="flex items-center">
                        <Info className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="text-sm text-blue-800">
                          {isConfigured && useAIGeneration
                            ? `Using ${config.selectedModel} for AI-powered test case generation`
                            : useAIGeneration 
                              ? 'AI generation selected but not configured. Please configure AI settings.'
                              : 'Using traditional rule-based test case generation'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="results" className="space-y-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Test Cases List */}
                <div className="lg:col-span-2">
                  <Card className="bg-white/80 backdrop-blur-sm border">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                            <TestTube className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-xl text-gray-800">Generated Test Cases</CardTitle>
                            <CardDescription>{testCases.length} test cases generated</CardDescription>
                          </div>
                        </div>
                        {testCases.length > 0 && (
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" onClick={() => exportTestCases('json')}>
                              <Download className="w-4 h-4 mr-1" />
                              JSON
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => exportTestCases('csv')}>
                              <Download className="w-4 h-4 mr-1" />
                              CSV
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-12 h-12 border-4 border-teal-200 border-t-teal-500 rounded-full mb-4"
                          />
                          <p>Generating test cases...</p>
                        </div>
                      ) : testCases.length > 0 ? (
                        <ScrollArea className="h-96">
                          <div className="space-y-3 pr-4">
                            {testCases.map((testCase) => (
                              <motion.div
                                key={testCase.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                                  selectedTestCase?.id === testCase.id 
                                    ? 'border-teal-300 bg-teal-50' 
                                    : 'border bg-white hover:border-teal-200 hover:shadow-md'
                                }`}
                                onClick={() => setSelectedTestCase(testCase)}
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <h3 className="font-semibold text-gray-800 line-clamp-2">{testCase.title}</h3>
                                  <div className="flex items-center space-x-2 ml-4">
                                    <Badge className={`text-xs ${priorityColors[testCase.priority]}`}>
                                      {testCase.priority}
                                    </Badge>
                                    <Badge className={`text-xs ${typeColors[testCase.type] || 'bg-gray-100 text-gray-700'}`}>
                                      {testCase.type}
                                    </Badge>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{testCase.description}</p>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                  <span>Category: {testCase.category}</span>
                                  <div className="flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    <span>{testCase.estimatedTime}min</span>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </ScrollArea>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                          <TestTube className="w-16 h-16 mb-4 opacity-50" />
                          <h3 className="text-lg font-semibold mb-2">No Test Cases Generated</h3>
                          <p className="text-center">Configure your requirements and generation settings to create test cases</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Test Case Details */}
                <div>
                  <Card className="bg-white/80 backdrop-blur-sm border">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg text-gray-800">Test Case Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedTestCase ? (
                        <ScrollArea className="h-96">
                          <div className="space-y-4 pr-4">
                            <div>
                              <h3 className="font-semibold text-gray-800 mb-2">{selectedTestCase.title}</h3>
                              <p className="text-sm text-gray-600 mb-3">{selectedTestCase.description}</p>
                              <div className="flex flex-wrap gap-2 mb-4">
                                {selectedTestCase.tags.map(tag => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium text-gray-800 mb-2">Preconditions</h4>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {selectedTestCase.preconditions.map((condition, index) => (
                                  <li key={index} className="flex items-start">
                                    <CheckCircle className="w-3 h-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                    {condition}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h4 className="font-medium text-gray-800 mb-2">Test Steps</h4>
                              <ol className="text-sm text-gray-600 space-y-2">
                                {selectedTestCase.steps.map((step, index) => (
                                  <li key={index} className="flex items-start">
                                    <span className="bg-teal-100 text-teal-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mr-2 mt-0.5 flex-shrink-0">
                                      {index + 1}
                                    </span>
                                    {step}
                                  </li>
                                ))}
                              </ol>
                            </div>

                            <div>
                              <h4 className="font-medium text-gray-800 mb-2">Expected Results</h4>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {selectedTestCase.expectedResults.map((result, index) => (
                                  <li key={index} className="flex items-start">
                                    <Target className="w-3 h-3 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                                    {result}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {selectedTestCase.testData && (
                              <div>
                                <h4 className="font-medium text-gray-800 mb-2">Test Data</h4>
                                <div className="bg-gray-50 p-3 rounded text-sm text-gray-700">
                                  {selectedTestCase.testData}
                                </div>
                              </div>
                            )}

                            <div className="flex items-center justify-between pt-4 border-t">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(JSON.stringify(selectedTestCase, null, 2))}
                              >
                                <Copy className="w-4 h-4 mr-1" />
                                Copy
                              </Button>
                              <div className="text-xs text-gray-500">
                                Est. {selectedTestCase.estimatedTime} minutes
                              </div>
                            </div>
                          </div>
                        </ScrollArea>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                          <Eye className="w-12 h-12 mb-2 opacity-50" />
                          <p className="text-center">Select a test case to view details</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-0">
              <Card className="bg-white/80 backdrop-blur-sm border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Brain className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-gray-800">AI Analysis</CardTitle>
                        <CardDescription>Intelligent test suite analysis and recommendations</CardDescription>
                      </div>
                    </div>
                    {testCases.length > 0 && isConfigured && (
                      <Button 
                        onClick={() => performAIAnalysis(testCases)}
                        disabled={isAnalyzing}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        {isAnalyzing ? (
                          <motion.div 
                            animate={{ rotate: 360 }} 
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                          </motion.div>
                        ) : (
                          <Brain className="w-4 h-4 mr-2" />
                        )}
                        {isAnalyzing ? 'Analyzing...' : 'Analyze Test Suite'}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {!isConfigured ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                      <AlertCircle className="w-16 h-16 mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">AI Not Configured</h3>
                      <p className="text-center">Configure AI settings to enable intelligent test suite analysis</p>
                    </div>
                  ) : testCases.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                      <Brain className="w-16 h-16 mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">No Test Cases to Analyze</h3>
                      <p className="text-center">Generate test cases first to enable AI analysis</p>
                    </div>
                  ) : aiAnalysis ? (
                    <div className="space-y-6">
                      {/* Test Suite Overview */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600">Quality Score</p>
                              <p className="text-2xl font-bold text-green-600">{aiAnalysis.insights.qualityScore}%</p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-green-500" />
                          </div>
                        </Card>
                        
                        <Card className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600">Risk Level</p>
                              <p className={`text-2xl font-bold ${
                                aiAnalysis.testSuite.metrics.riskLevel === 'High' ? 'text-red-600' :
                                aiAnalysis.testSuite.metrics.riskLevel === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                              }`}>
                                {aiAnalysis.testSuite.metrics.riskLevel}
                              </p>
                            </div>
                            <Shield className="w-8 h-8 text-blue-500" />
                          </div>
                        </Card>
                        
                        <Card className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600">Confidence</p>
                              <p className="text-2xl font-bold text-blue-600">{aiAnalysis.metadata.confidence}%</p>
                            </div>
                            <Brain className="w-8 h-8 text-purple-500" />
                          </div>
                        </Card>
                      </div>

                      {/* Coverage Analysis */}
                      <Card className="p-4">
                        <h3 className="font-semibold text-gray-800 mb-4">Coverage Analysis</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {Object.entries(aiAnalysis.testSuite.coverage).map(([type, percentage]) => (
                            <div key={type} className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="capitalize">{type}</span>
                                <span>{percentage}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-teal-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>

                      {/* Insights */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="p-4">
                          <h3 className="font-semibold text-gray-800 mb-3">Coverage Gaps</h3>
                          <div className="space-y-2">
                            {aiAnalysis.insights.coverageGaps.length > 0 ? (
                              aiAnalysis.insights.coverageGaps.map((gap, index) => (
                                <div key={index} className="flex items-start space-x-2">
                                  <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm text-gray-700">{gap}</span>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-gray-500">No significant coverage gaps identified</p>
                            )}
                          </div>
                        </Card>

                        <Card className="p-4">
                          <h3 className="font-semibold text-gray-800 mb-3">Risk Areas</h3>
                          <div className="space-y-2">
                            {aiAnalysis.insights.riskAreas.length > 0 ? (
                              aiAnalysis.insights.riskAreas.map((risk, index) => (
                                <div key={index} className="flex items-start space-x-2">
                                  <Shield className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm text-gray-700">{risk}</span>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-gray-500">No high-risk areas identified</p>
                            )}
                          </div>
                        </Card>
                      </div>

                      {/* Recommendations */}
                      <Card className="p-4">
                        <h3 className="font-semibold text-gray-800 mb-3">AI Recommendations</h3>
                        <div className="space-y-3">
                          {aiAnalysis.testSuite.recommendations.length > 0 ? (
                            aiAnalysis.testSuite.recommendations.map((recommendation, index) => (
                              <div key={index} className="flex items-start space-x-2 p-3 bg-blue-50 rounded-lg">
                                <Sparkles className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-blue-800">{recommendation}</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500">No specific recommendations at this time</p>
                          )}
                        </div>
                      </Card>

                      {/* Analysis Metadata */}
                      <Card className="p-4 bg-gray-50">
                        <h3 className="font-semibold text-gray-800 mb-3">Analysis Details</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Model:</span>
                            <div className="font-medium">{aiAnalysis.metadata.model}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Analysis Time:</span>
                            <div className="font-medium">{aiAnalysis.metadata.analysisTime}ms</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Generated:</span>
                            <div className="font-medium">{new Date(aiAnalysis.testSuite.generatedAt).toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Test Count:</span>
                            <div className="font-medium">{aiAnalysis.testSuite.metrics.totalTests}</div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                      <Brain className="w-16 h-16 mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">Ready for Analysis</h3>
                      <p className="text-center">Click "Analyze Test Suite" to get AI-powered insights and recommendations</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default TestCaseGenerator;