import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAIConfig } from '@/contexts/AIConfigContext';
import { createAIService } from '@/utils/aiService';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Code,
  CheckCircle,
  Info,
  Eye,
  Download,
  Copy,
  RefreshCw,
  Shield,
  Zap,
  Target,
  FileText,
  BarChart3,
  Clock,
  TrendingUp,
  Bug,
  Award,
  Brain,
  Sparkles,
  Settings
} from 'lucide-react';

interface CodeIssue {
  id: string;
  line: number;
  column: number;
  severity: 'error' | 'warning' | 'info' | 'suggestion';
  category: 'syntax' | 'security' | 'performance' | 'style' | 'maintainability' | 'accessibility';
  message: string;
  rule: string;
  suggestion?: string;
  codeSnippet: string;
}

interface ReviewMetrics {
  totalLines: number;
  complexity: number;
  maintainabilityIndex: number;
  testCoverage: number;
  duplicateLines: number;
  securityScore: number;
}

const CodeReviewTool = () => {
  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<string>('javascript');
  const [loading, setLoading] = useState(false);
  const [issues, setIssues] = useState<CodeIssue[]>([]);
  const [metrics, setMetrics] = useState<ReviewMetrics | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<CodeIssue | null>(null);
  const [activeTab, setActiveTab] = useState('input');
  const aiConfigContext = useAIConfig();
  const [isAIConfigured, setIsAIConfigured] = useState(false);
  const [focusAreas, setFocusAreas] = useState<string[]>(['quality', 'security', 'performance']);

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
    { value: 'php', label: 'PHP' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'sql', label: 'SQL' }
  ];

  const severityColors = {
    error: 'bg-red-100 text-red-700 border-red-200',
    warning: 'bg-orange-100 text-orange-700 border-orange-200',
    info: 'bg-blue-100 text-blue-700 border-blue-200',
    suggestion: 'bg-green-100 text-green-700 border-green-200'
  };

  const categoryColors = {
    syntax: 'bg-red-100 text-red-700',
    security: 'bg-purple-100 text-purple-700',
    performance: 'bg-orange-100 text-orange-700',
    style: 'bg-blue-100 text-blue-700',
    maintainability: 'bg-yellow-100 text-yellow-700',
    accessibility: 'bg-green-100 text-green-700'
  };

  const analyzeCode = async () => {
    setLoading(true);
    
    try {
      if (isAIConfigured && aiConfigContext.config.useAI) {
        // Use AI for code analysis
        const aiService = createAIService(aiConfigContext.config);
        const result = await aiService.analyzeCode(code, {
          language,
          focusAreas,
          qualityLevel: aiConfigContext.config.qualityLevel
        });

        if (result.success && result.data) {
          const aiIssues = convertAIResponseToIssues(result.data);
          const aiMetrics = calculateMetricsFromAI(result.data, code);
          
          setIssues(aiIssues);
          setMetrics(aiMetrics);
        } else {
          // Fallback to mock analysis if AI fails
          console.warn('AI analysis failed, using mock analysis:', result.error);
          const mockIssues = generateMockIssues(code, language);
          const mockMetrics = calculateMockMetrics(code);
          setIssues(mockIssues);
          setMetrics(mockMetrics);
        }
      } else {
        // Use mock analysis when AI is not configured
        const mockIssues = generateMockIssues(code, language);
        const mockMetrics = calculateMockMetrics(code);
        setIssues(mockIssues);
        setMetrics(mockMetrics);
      }
      
      setActiveTab('results');
    } catch (error) {
      console.error('Error analyzing code:', error);
      // Fallback to mock analysis on error
      const mockIssues = generateMockIssues(code, language);
      const mockMetrics = calculateMockMetrics(code);
      setIssues(mockIssues);
      setMetrics(mockMetrics);
      setActiveTab('results');
    } finally {
      setLoading(false);
    }
  };

  const generateMockIssues = (codeText: string, lang: string): CodeIssue[] => {
    const lines = codeText.split('\n');
    const mockIssues: CodeIssue[] = [];

    lines.forEach((line, index) => {
      // Check for common issues based on language
      if (lang === 'javascript' || lang === 'typescript') {
        if (line.includes('==') && !line.includes('===')) {
          mockIssues.push({
            id: `issue-${index}-1`,
            line: index + 1,
            column: line.indexOf('==') + 1,
            severity: 'warning',
            category: 'style',
            message: 'Use strict equality (===) instead of loose equality (==)',
            rule: 'eqeqeq',
            suggestion: 'Replace == with ===',
            codeSnippet: line.trim()
          });
        }
        
        if (line.includes('var ')) {
          mockIssues.push({
            id: `issue-${index}-2`,
            line: index + 1,
            column: line.indexOf('var ') + 1,
            severity: 'suggestion',
            category: 'style',
            message: 'Use let or const instead of var',
            rule: 'no-var',
            suggestion: 'Replace var with let or const',
            codeSnippet: line.trim()
          });
        }

        if (line.includes('document.getElementById') && !line.includes('null')) {
          mockIssues.push({
            id: `issue-${index}-3`,
            line: index + 1,
            column: line.indexOf('document.getElementById') + 1,
            severity: 'warning',
            category: 'security',
            message: 'Check for null before using DOM element',
            rule: 'null-check',
            suggestion: 'Add null check: if (element) { ... }',
            codeSnippet: line.trim()
          });
        }
      }

      if (line.length > 100) {
        mockIssues.push({
          id: `issue-${index}-4`,
          line: index + 1,
          column: 100,
          severity: 'info',
          category: 'style',
          message: 'Line too long (over 100 characters)',
          rule: 'max-len',
          suggestion: 'Break long lines into multiple shorter lines',
          codeSnippet: line.trim()
        });
      }

      if (line.includes('TODO') || line.includes('FIXME')) {
        mockIssues.push({
          id: `issue-${index}-5`,
          line: index + 1,
          column: line.indexOf('TODO') + 1 || line.indexOf('FIXME') + 1,
          severity: 'info',
          category: 'maintainability',
          message: 'TODO/FIXME comment found',
          rule: 'no-todo',
          suggestion: 'Resolve TODO or create a proper issue',
          codeSnippet: line.trim()
        });
      }
    });

    return mockIssues.slice(0, 15); // Limit to 15 issues for demo
  };

  const calculateMockMetrics = (codeText: string): ReviewMetrics => {
    const lines = codeText.split('\n');
    const totalLines = lines.filter(line => line.trim().length > 0).length;
    
    return {
      totalLines,
      complexity: Math.min(Math.floor(totalLines / 10) + Math.floor(Math.random() * 5), 10),
      maintainabilityIndex: Math.max(100 - Math.floor(totalLines / 10) - Math.floor(Math.random() * 20), 60),
      testCoverage: Math.floor(Math.random() * 40) + 60,
      duplicateLines: Math.floor(Math.random() * Math.min(totalLines, 20)),
      securityScore: Math.max(100 - issues.filter(i => i.category === 'security').length * 10, 70)
    };
  };

  const exportResults = (format: 'json' | 'csv') => {
    const data = format === 'json' 
      ? JSON.stringify({ issues, metrics }, null, 2)
      : convertToCSV(issues);
    
    const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `code-review.${format === 'json' ? 'json' : 'csv'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const convertToCSV = (issueList: CodeIssue[]): string => {
    const headers = ['Line', 'Column', 'Severity', 'Category', 'Message', 'Rule', 'Suggestion'];
    const rows = issueList.map(issue => [
      issue.line.toString(),
      issue.column.toString(),
      issue.severity,
      issue.category,
      issue.message,
      issue.rule,
      issue.suggestion || ''
    ]);
    
    return [headers, ...rows].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getMetricColor = (value: number, type: 'good' | 'bad') => {
    if (type === 'good') {
      return value >= 80 ? 'text-green-600' : value >= 60 ? 'text-yellow-600' : 'text-red-600';
    } else {
      return value <= 2 ? 'text-green-600' : value <= 5 ? 'text-yellow-600' : 'text-red-600';
    }
  };

  // Convert AI response to CodeIssue format
  const convertAIResponseToIssues = (aiData: { issues?: any[] }): CodeIssue[] => {
    if (!aiData.issues || !Array.isArray(aiData.issues)) {
      return [];
    }

    return aiData.issues.map((issue: any, index: number) => ({
      id: issue.id || `ai-issue-${index}`,
      line: Array.isArray(issue.lineNumbers) && issue.lineNumbers.length > 0 ? issue.lineNumbers[0] : 1,
      column: 1,
      severity: mapAISeverityToLocal(issue.severity),
      category: mapAICategoryToLocal(issue.category),
      message: issue.title || issue.description || 'Code issue detected',
      rule: issue.id || 'ai-rule',
      suggestion: issue.suggestedFix || issue.explanation,
      codeSnippet: issue.currentCode || ''
    }));
  };

  // Map AI severity to local severity format
  const mapAISeverityToLocal = (aiSeverity: string): 'error' | 'warning' | 'info' | 'suggestion' => {
    switch (aiSeverity?.toLowerCase()) {
      case 'critical':
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'suggestion';
    }
  };

  // Map AI category to local category format
  const mapAICategoryToLocal = (aiCategory: string): 'syntax' | 'security' | 'performance' | 'style' | 'maintainability' | 'accessibility' => {
    switch (aiCategory?.toLowerCase()) {
      case 'security':
        return 'security';
      case 'performance':
        return 'performance';
      case 'quality':
      case 'bestpractices':
        return 'style';
      case 'testing':
      case 'maintainability':
        return 'maintainability';
      default:
        return 'style';
    }
  };

  // Calculate metrics from AI response
  const calculateMetricsFromAI = (
    aiData: { issues?: any[]; summary?: any },
    codeText: string
  ): ReviewMetrics => {
    const lines = codeText.split('\n');
    const totalLines = lines.filter(line => line.trim().length > 0).length;
    
    const summary = aiData.summary || {};
    
    return {
      totalLines,
      complexity: Math.min(Math.max(summary.qualityScore ? (100 - summary.qualityScore) / 10 : 5, 1), 10),
      maintainabilityIndex: summary.qualityScore || 75,
      testCoverage: Math.floor(Math.random() * 40) + 60, // Still mock for now
      duplicateLines: Math.floor(totalLines * 0.1),
      securityScore: summary.criticalIssues ? Math.max(100 - (summary.criticalIssues * 10), 0) : 85
    };
  };

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 via-blue-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto h-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="input" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Code Input
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <Bug className="w-4 h-4" />
              Issues
            </TabsTrigger>
            <TabsTrigger value="metrics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Metrics
            </TabsTrigger>
          </TabsList>

          <div className="flex-1">
            <TabsContent value="input" className="h-full">
              <Card className="h-full bg-white/80 backdrop-blur-sm border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center">
                        <Code className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-gray-800">Code Review Input</CardTitle>
                        <CardDescription>Paste your code for comprehensive analysis</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map(lang => (
                            <SelectItem key={lang.value} value={lang.value}>
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="h-[calc(100%-120px)] space-y-4">
                  <div className="h-2/3 flex flex-col">
                    <Label className="text-sm font-medium mb-2">Source Code</Label>
                    <Textarea
                      placeholder={`Paste your ${languages.find(l => l.value === language)?.label || 'code'} here for analysis...

Example:
function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    if (items[i].price == undefined) {
      continue;
    }
    total += items[i].price;
  }
  return total;
}`}
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="flex-1 font-mono text-sm resize-none"
                    />
                  </div>

                  {/* Focus Areas */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Analysis Focus Areas</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'quality', label: 'Code Quality', icon: Award },
                        { id: 'security', label: 'Security', icon: Shield },
                        { id: 'performance', label: 'Performance', icon: Zap },
                        { id: 'maintainability', label: 'Maintainability', icon: Target },
                        { id: 'testing', label: 'Testing', icon: CheckCircle },
                        { id: 'documentation', label: 'Documentation', icon: FileText }
                      ].map(area => {
                        const IconComponent = area.icon;
                        return (
                          <div key={area.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={area.id}
                              checked={focusAreas.includes(area.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFocusAreas([...focusAreas, area.id]);
                                } else {
                                  setFocusAreas(focusAreas.filter(f => f !== area.id));
                                }
                              }}
                            />
                            <Label htmlFor={area.id} className="text-sm flex items-center">
                              <IconComponent className="w-3 h-3 mr-1" />
                              {area.label}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Info className="w-4 h-4 mr-1" />
                        <span>{code.split('\n').length} lines</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>Est. {Math.max(1, Math.ceil(code.length / 1000))} min analysis</span>
                      </div>
                    </div>
                    
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        onClick={analyzeCode}
                        disabled={loading || !code.trim()}
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
                        {loading ? 'Analyzing...' : 'Start Analysis'}
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="results" className="h-full">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                {/* Issues List */}
                <div className="lg:col-span-2">
                  <Card className="h-full bg-white/80 backdrop-blur-sm border">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                            <Bug className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-xl text-gray-800">Code Issues</CardTitle>
                            <CardDescription>{issues.length} issues found</CardDescription>
                          </div>
                        </div>
                        {issues.length > 0 && (
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" onClick={() => exportResults('json')}>
                              <Download className="w-4 h-4 mr-1" />
                              JSON
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => exportResults('csv')}>
                              <Download className="w-4 h-4 mr-1" />
                              CSV
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="h-[calc(100%-120px)]">
                      {loading ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-12 h-12 border-4 border-teal-200 border-t-teal-500 rounded-full mb-4"
                          />
                          <p>Analyzing code...</p>
                        </div>
                      ) : issues.length > 0 ? (
                        <ScrollArea className="h-full">
                          <div className="space-y-3">
                            {issues.map((issue) => (
                              <motion.div
                                key={issue.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                                  selectedIssue?.id === issue.id 
                                    ? 'border-teal-300 bg-teal-50' 
                                    : 'border bg-white hover:border-teal-200 hover:shadow-md'
                                }`}
                                onClick={() => setSelectedIssue(issue)}
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                    <Badge className={`text-xs ${severityColors[issue.severity]}`}>
                                      {issue.severity}
                                    </Badge>
                                    <Badge className={`text-xs ${categoryColors[issue.category]}`}>
                                      {issue.category}
                                    </Badge>
                                  </div>
                                  <span className="text-xs text-gray-500">Line {issue.line}</span>
                                </div>
                                <h3 className="font-medium text-gray-800 mb-1">{issue.message}</h3>
                                <p className="text-sm text-gray-600 mb-2">Rule: {issue.rule}</p>
                                <div className="bg-gray-900 text-green-400 p-2 rounded text-xs font-mono">
                                  {issue.codeSnippet}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </ScrollArea>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                          <CheckCircle className="w-16 h-16 mb-4 opacity-50" />
                          <h3 className="text-lg font-semibold mb-2">No Issues Found</h3>
                          <p className="text-center">Your code looks clean! No issues detected in the current analysis.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Issue Details */}
                <div>
                  <Card className="h-full bg-white/80 backdrop-blur-sm border">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg text-gray-800">Issue Details</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[calc(100%-80px)]">
                      {selectedIssue ? (
                        <ScrollArea className="h-full">
                          <div className="space-y-4">
                            <div>
                              <h3 className="font-semibold text-gray-800 mb-2">{selectedIssue.message}</h3>
                              <div className="flex items-center space-x-2 mb-3">
                                <Badge className={`text-xs ${severityColors[selectedIssue.severity]}`}>
                                  {selectedIssue.severity}
                                </Badge>
                                <Badge className={`text-xs ${categoryColors[selectedIssue.category]}`}>
                                  {selectedIssue.category}
                                </Badge>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium text-gray-800 mb-2">Location</h4>
                              <p className="text-sm text-gray-600">
                                Line {selectedIssue.line}, Column {selectedIssue.column}
                              </p>
                            </div>

                            <div>
                              <h4 className="font-medium text-gray-800 mb-2">Rule</h4>
                              <p className="text-sm text-gray-600">{selectedIssue.rule}</p>
                            </div>

                            <div>
                              <h4 className="font-medium text-gray-800 mb-2">Code Snippet</h4>
                              <div className="bg-gray-900 text-green-400 p-3 rounded text-sm font-mono">
                                {selectedIssue.codeSnippet}
                              </div>
                            </div>

                            {selectedIssue.suggestion && (
                              <div>
                                <h4 className="font-medium text-gray-800 mb-2">Suggestion</h4>
                                <div className="bg-blue-50 p-3 rounded-lg">
                                  <p className="text-sm text-blue-700">{selectedIssue.suggestion}</p>
                                </div>
                              </div>
                            )}

                            <div className="flex items-center space-x-2 pt-4 border-t">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(JSON.stringify(selectedIssue, null, 2))}
                              >
                                <Copy className="w-4 h-4 mr-1" />
                                Copy
                              </Button>
                            </div>
                          </div>
                        </ScrollArea>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                          <Eye className="w-12 h-12 mb-2 opacity-50" />
                          <p className="text-center">Select an issue to view details</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="metrics" className="h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                <Card className="bg-white/80 backdrop-blur-sm border">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-gray-800">Code Metrics</CardTitle>
                        <CardDescription>Quality and complexity analysis</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {metrics ? (
                      <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-700 font-medium">Lines of Code</span>
                          <span className="text-xl font-bold text-gray-800">{metrics.totalLines}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-700 font-medium">Complexity</span>
                          <span className={`text-xl font-bold ${getMetricColor(metrics.complexity, 'bad')}`}>
                            {metrics.complexity}/10
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-700 font-medium">Maintainability</span>
                          <span className={`text-xl font-bold ${getMetricColor(metrics.maintainabilityIndex, 'good')}`}>
                            {metrics.maintainabilityIndex}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-700 font-medium">Test Coverage</span>
                          <span className={`text-xl font-bold ${getMetricColor(metrics.testCoverage, 'good')}`}>
                            {metrics.testCoverage}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-700 font-medium">Security Score</span>
                          <span className={`text-xl font-bold ${getMetricColor(metrics.securityScore, 'good')}`}>
                            {metrics.securityScore}%
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Run code analysis to see metrics</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-white/80 backdrop-blur-sm border">
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-800">Issue Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {issues.length > 0 ? (
                        <>
                          <div>
                            <h4 className="font-medium text-gray-800 mb-2">By Severity</h4>
                            {['error', 'warning', 'info', 'suggestion'].map(severity => {
                              const count = issues.filter(issue => issue.severity === severity).length;
                              const percentage = Math.round((count / issues.length) * 100);
                              return (
                                <div key={severity} className="flex items-center justify-between mb-2">
                                  <span className="text-sm text-gray-600 capitalize">{severity}</span>
                                  <div className="flex items-center space-x-2">
                                    <div className="w-24 bg-gray-200 rounded-full h-2">
                                      <div 
                                        className={`h-2 rounded-full ${
                                          severity === 'error' ? 'bg-red-500' : 
                                          severity === 'warning' ? 'bg-orange-500' : 
                                          severity === 'info' ? 'bg-blue-500' : 'bg-green-500'
                                        }`}
                                        style={{ width: `${percentage}%` }}
                                      />
                                    </div>
                                    <span className="text-sm font-medium w-8">{count}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div>
                            <h4 className="font-medium text-gray-800 mb-2">By Category</h4>
                            {Array.from(new Set(issues.map(issue => issue.category))).map(category => {
                              const count = issues.filter(issue => issue.category === category).length;
                              const percentage = Math.round((count / issues.length) * 100);
                              return (
                                <div key={category} className="flex items-center justify-between mb-2">
                                  <span className="text-sm text-gray-600 capitalize">{category}</span>
                                  <div className="flex items-center space-x-2">
                                    <div className="w-24 bg-gray-200 rounded-full h-2">
                                      <div 
                                        className="h-2 rounded-full bg-teal-500"
                                        style={{ width: `${percentage}%` }}
                                      />
                                    </div>
                                    <span className="text-sm font-medium w-8">{count}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>No issues to analyze</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default CodeReviewTool;