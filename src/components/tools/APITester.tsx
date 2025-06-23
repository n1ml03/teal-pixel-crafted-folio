import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { useAIConfig } from '@/contexts/AIConfigContext';
import { getAIService } from '@/utils/aiService';
import {
  Play,
  Pause,
  Copy,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Globe,
  Settings,
  History,
  Trash2,
  Plus,
  Activity,
  Shield,
  Timer,
  Database,
  Code,
  Terminal,
  Brain,
  Lightbulb,
  Target,
  RefreshCw
} from 'lucide-react';

interface RequestHistory {
  id: string;
  method: string;
  url: string;
  timestamp: Date;
  status?: number;
  responseTime?: number;
  success: boolean;
}

interface Header {
  key: string;
  value: string;
  enabled: boolean;
}

interface Environment {
  name: string;
  variables: { [key: string]: string };
}

interface APITestCase {
  id: string;
  name: string;
  category: 'Happy Path' | 'Authentication' | 'Validation' | 'Performance' | 'Security' | 'Edge Cases';
  description: string;
  request: {
    method: string;
    url: string;
    headers: { [key: string]: string };
    body?: string;
    params?: { [key: string]: string };
    authentication?: string;
  };
  expectedResponse: {
    statusCode: number;
    body?: string;
    headers?: { [key: string]: string };
    responseTime?: string;
  };
  validations: Array<{
    field: string;
    condition: string;
    expectedValue: string;
  }>;
  testData?: string;
  securityConsiderations?: string[];
  priority: 'High' | 'Medium' | 'Low';
}

interface AITestSuite {
  endpoint: string;
  method: string;
  testCases: APITestCase[];
  coverage: {
    categories: string[];
    totalTests: number;
    estimatedTime: string;
  };
  recommendations: string[];
}

interface APIResponse {
  status?: number;
  statusText?: string;
  headers?: { [key: string]: string };
  data?: unknown;
  responseTime?: number;
  size?: number;
  url?: string;
  method?: string;
  timestamp?: Date;
  error?: string;
}

interface TestResult {
  success: boolean;
  actualStatus?: number;
  responseTime?: number;
  error?: string;
}

const APITester = () => {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/posts/1');
  const [headers, setHeaders] = useState<Header[]>([
    { key: 'Content-Type', value: 'application/json', enabled: true }
  ]);
  const [body, setBody] = useState('');
  const [auth, setAuth] = useState({ type: 'none', token: '', username: '', password: '' });
  const [response, setResponse] = useState<APIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<RequestHistory[]>([]);
  const [environments, setEnvironments] = useState<Environment[]>([
    { name: 'Development', variables: { baseUrl: 'https://api.dev.example.com', apiKey: 'dev-key-123' } },
    { name: 'Production', variables: { baseUrl: 'https://api.example.com', apiKey: 'prod-key-456' } }
  ]);
  const [selectedEnv, setSelectedEnv] = useState<string>('Development');
  const [showResponse, setShowResponse] = useState(true);
  const [activeTab, setActiveTab] = useState('headers');

  // AI Testing states
  const [aiTestSuite, setAiTestSuite] = useState<AITestSuite | null>(null);
  const [isGeneratingTests, setIsGeneratingTests] = useState(false);
  const [testGenerationError, setTestGenerationError] = useState<string | null>(null);
  const [autoGenerateTests, setAutoGenerateTests] = useState(false);
  const [selectedTestCase, setSelectedTestCase] = useState<APITestCase | null>(null);
  const [runningTestSuite, setRunningTestSuite] = useState(false);
  const [testResults, setTestResults] = useState<{ [key: string]: TestResult }>({});

  const { config } = useAIConfig();
  const responseRef = useRef<HTMLDivElement>(null);

  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '', enabled: true }]);
  };

  const updateHeader = (index: number, field: keyof Header, value: string | boolean) => {
    const newHeaders = [...headers];
    newHeaders[index] = { ...newHeaders[index], [field]: value };
    setHeaders(newHeaders);
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const replaceVariables = (text: string) => {
    const env = environments.find(e => e.name === selectedEnv);
    if (!env) return text;
    
    let result = text;
    Object.entries(env.variables).forEach(([key, value]) => {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });
    return result;
  };

  const sendRequest = async () => {
    setLoading(true);
    const startTime = Date.now();
    
    try {
      const processedUrl = replaceVariables(url);
      const requestHeaders: { [key: string]: string } = {};
      
      headers.forEach(header => {
        if (header.enabled && header.key) {
          requestHeaders[header.key] = replaceVariables(header.value);
        }
      });

      // Add authentication headers
      if (auth.type === 'bearer' && auth.token) {
        requestHeaders['Authorization'] = `Bearer ${replaceVariables(auth.token)}`;
      } else if (auth.type === 'basic' && auth.username && auth.password) {
        const encoded = btoa(`${auth.username}:${auth.password}`);
        requestHeaders['Authorization'] = `Basic ${encoded}`;
      } else if (auth.type === 'api-key' && auth.token) {
        requestHeaders['X-API-Key'] = replaceVariables(auth.token);
      }

      const requestOptions: RequestInit = {
        method,
        headers: requestHeaders,
      };

      if (['POST', 'PUT', 'PATCH'].includes(method) && body) {
        requestOptions.body = replaceVariables(body);
      }

      const response = await fetch(processedUrl, requestOptions);
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      let responseData;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        try {
          responseData = await response.json();
        } catch {
          responseData = await response.text();
        }
      } else {
        responseData = await response.text();
      }

      const responseHeaders: { [key: string]: string } = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      const result = {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
        data: responseData,
        responseTime,
        size: new Blob([JSON.stringify(responseData)]).size,
        url: processedUrl,
        method,
        timestamp: new Date()
      };

      setResponse(result);

      // Add to history
      const historyItem: RequestHistory = {
        id: Date.now().toString(),
        method,
        url: processedUrl,
        timestamp: new Date(),
        status: response.status,
        responseTime,
        success: response.ok
      };

      setHistory(prev => [historyItem, ...prev.slice(0, 19)]); // Keep last 20

    } catch (error) {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      setResponse({
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        responseTime,
        timestamp: new Date()
      });

      const historyItem: RequestHistory = {
        id: Date.now().toString(),
        method,
        url: replaceVariables(url),
        timestamp: new Date(),
        responseTime,
        success: false
      };

      setHistory(prev => [historyItem, ...prev.slice(0, 19)]);
    } finally {
      setLoading(false);
    }
  };

  const formatJSON = (obj: unknown) => {
    try {
      return JSON.stringify(obj, null, 2);
    } catch {
      return obj.toString();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getStatusColor = (status?: number) => {
    if (!status) return 'text-gray-500';
    if (status >= 200 && status < 300) return 'text-green-600';
    if (status >= 300 && status < 400) return 'text-yellow-600';
    if (status >= 400 && status < 500) return 'text-orange-600';
    return 'text-red-600';
  };

  const loadFromHistory = (item: RequestHistory) => {
    setMethod(item.method);
    setUrl(item.url);
    // Reset other fields
    setHeaders([{ key: 'Content-Type', value: 'application/json', enabled: true }]);
    setBody('');
    setAuth({ type: 'none', token: '', username: '', password: '' });
  };

  const generateAPITests = async () => {
    if (!config.useAI) {
      setTestGenerationError('AI test generation is not enabled. Please configure AI settings.');
      return;
    }

    setIsGeneratingTests(true);
    setTestGenerationError(null);

    try {
      const aiService = getAIService();
      if (!aiService) {
        throw new Error('AI service not available');
      }

      const apiSpec = buildAPISpecForTesting();
      
      const result = await aiService.generateAPITests(apiSpec, {
        endpoint: url,
        method: method,
        authType: auth.type
      });

      function isAITestSuite(data: unknown): data is AITestSuite {
        return (
          typeof data === 'object' && data !== null &&
          'endpoint' in data &&
          'method' in data &&
          'testCases' in data &&
          'coverage' in data &&
          'recommendations' in data
        );
      }

      if (result.success && result.data) {
        if (isAITestSuite(result.data)) {
          setAiTestSuite(result.data);
        } else {
          throw new Error('Invalid AI test suite format');
        }
      } else {
        throw new Error(result.error || 'Failed to generate API tests');
      }
    } catch (error) {
      console.error('AI test generation failed:', error);
      setTestGenerationError(error instanceof Error ? error.message : 'Test generation failed');
    } finally {
      setIsGeneratingTests(false);
    }
  };

  const buildAPISpecForTesting = (): string => {
    const enabledHeaders = headers.filter(h => h.enabled && h.key);
    
    return `
API Endpoint Testing Specification:

ENDPOINT: ${url}
METHOD: ${method}
AUTHENTICATION: ${auth.type}

REQUEST HEADERS:
${enabledHeaders.map(h => `${h.key}: ${h.value}`).join('\n')}

REQUEST BODY:
${body || 'No body'}

ENVIRONMENT: ${selectedEnv}
ENVIRONMENT VARIABLES:
${JSON.stringify(environments.find(e => e.name === selectedEnv)?.variables || {}, null, 2)}

CURRENT RESPONSE DATA (if available):
${response ? JSON.stringify(response, null, 2) : 'No previous response'}

Please generate comprehensive test cases covering:
1. Happy path scenarios with valid inputs
2. Authentication and authorization testing
3. Input validation and error handling
4. Performance and load testing considerations
5. Security testing scenarios
6. Edge cases and boundary conditions
    `.trim();
  };

  const runTestCase = async (testCase: APITestCase) => {
    const testId = testCase.id;
    
    try {
      const startTime = Date.now();
      
      const requestOptions: RequestInit = {
        method: testCase.request.method,
        headers: testCase.request.headers,
      };

      if (testCase.request.body) {
        requestOptions.body = testCase.request.body;
      }

      const response = await fetch(testCase.request.url, requestOptions);
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      const responseData = await response.text();
      let parsedData;
      try {
        parsedData = JSON.parse(responseData);
      } catch {
        parsedData = responseData;
      }

      const testResult = {
        success: response.status === testCase.expectedResponse.statusCode,
        actualStatus: response.status,
        expectedStatus: testCase.expectedResponse.statusCode,
        responseTime,
        responseData: parsedData,
        validationResults: validateResponse(parsedData, testCase.validations),
        timestamp: new Date()
      };

      setTestResults(prev => ({
        ...prev,
        [testId]: testResult
      }));

      return testResult;
    } catch (error) {
      const testResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      };

      setTestResults(prev => ({
        ...prev,
        [testId]: testResult
      }));

      return testResult;
    }
  };

  const validateResponse = (responseData: unknown, validations: APITestCase['validations']) => {
    return validations.map(validation => {
      const fieldValue = typeof responseData === 'object' && responseData !== null
        ? getNestedValue(responseData as Record<string, unknown>, validation.field)
        : undefined;
      const isValid = evaluateCondition(fieldValue, validation.condition, validation.expectedValue);
      
      return {
        field: validation.field,
        condition: validation.condition,
        expectedValue: validation.expectedValue,
        actualValue: fieldValue,
        isValid
      };
    });
  };

  const getNestedValue = (obj: Record<string, unknown>, path: string) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  const evaluateCondition = (actual: unknown, condition: string, expected: string): boolean => {
    switch (condition) {
      case 'equals':
        return actual == expected;
      case 'contains':
        return String(actual).includes(expected);
      case 'greater_than':
        return Number(actual) > Number(expected);
      case 'less_than':
        return Number(actual) < Number(expected);
      case 'exists':
        return actual !== undefined && actual !== null;
      case 'type':
        return typeof actual === expected;
      default:
        return false;
    }
  };

  const runAllTests = async () => {
    if (!aiTestSuite) return;

    setRunningTestSuite(true);
    
    for (const testCase of aiTestSuite.testCases) {
      await runTestCase(testCase);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setRunningTestSuite(false);
  };

  const getTestResultStatus = (testId: string) => {
    const result = testResults[testId];
    if (!result) return 'pending';
    return result.success ? 'passed' : 'failed';
  };

  const getTestResultColor = (status: string) => {
    switch (status) {
      case 'passed': return 'text-green-600 bg-green-50 border-green-200';
      case 'failed': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border';
    }
  };

  // Auto-trigger test generation when URL or method changes
  useEffect(() => {
    if (autoGenerateTests && config.useAI && url && method) {
      const timer = setTimeout(() => {
        generateAPITests();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [url, method, autoGenerateTests, config.useAI, generateAPITests]);

  const getCategoryColor = (category: APITestCase['category']) => {
    switch (category) {
      case 'Happy Path': return 'text-green-600';
      case 'Authentication': return 'text-blue-600';
      case 'Validation': return 'text-yellow-600';
      case 'Performance': return 'text-purple-600';
      case 'Security': return 'text-red-600';
      case 'Edge Cases': return 'text-orange-600';
    }
  };

  const getPriorityColor = (priority: APITestCase['priority']) => {
    switch (priority) {
      case 'High': return 'text-red-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-green-600';
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 via-blue-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        {/* Request Panel */}
        <div className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-800">API Request Builder</CardTitle>
                    <CardDescription>Configure and send HTTP requests</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Select value={selectedEnv} onValueChange={setSelectedEnv}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {environments.map(env => (
                        <SelectItem key={env.name} value={env.name}>
                          {env.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* URL and Method */}
              <div className="flex space-x-2">
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {methods.map(m => (
                      <SelectItem key={m} value={m}>
                        <Badge 
                          variant={m === 'GET' ? 'secondary' : m === 'POST' ? 'default' : 'outline'}
                          className="text-xs"
                        >
                          {m}
                        </Badge>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Enter request URL..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1"
                />
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    onClick={sendRequest} 
                    disabled={loading || !url}
                    className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600"
                  >
                    {loading ? (
                      <motion.div 
                        animate={{ rotate: 360 }} 
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Pause className="w-4 h-4" />
                      </motion.div>
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                    {loading ? 'Sending...' : 'Send'}
                  </Button>
                </motion.div>
              </div>

              {/* Request Configuration Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="headers" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Headers
                  </TabsTrigger>
                  <TabsTrigger value="auth" className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Auth
                  </TabsTrigger>
                  <TabsTrigger value="body" className="flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    Body
                  </TabsTrigger>
                  <TabsTrigger value="ai-tests" className="flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    AI Tests
                  </TabsTrigger>
                  <TabsTrigger value="history" className="flex items-center gap-2">
                    <History className="w-4 h-4" />
                    History
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="headers" className="mt-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Request Headers</Label>
                      <Button variant="outline" size="sm" onClick={addHeader}>
                        <Plus className="w-4 h-4 mr-1" />
                        Add Header
                      </Button>
                    </div>
                    <ScrollArea className="h-48">
                      <div className="space-y-2">
                        {headers.map((header, index) => (
                          <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg"
                          >
                            <input
                              type="checkbox"
                              checked={header.enabled}
                              onChange={(e) => updateHeader(index, 'enabled', e.target.checked)}
                              className="w-4 h-4 text-teal-600"
                            />
                            <Input
                              placeholder="Header name"
                              value={header.key}
                              onChange={(e) => updateHeader(index, 'key', e.target.value)}
                              className="flex-1"
                            />
                            <Input
                              placeholder="Header value"
                              value={header.value}
                              onChange={(e) => updateHeader(index, 'value', e.target.value)}
                              className="flex-1"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeHeader(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </TabsContent>

                <TabsContent value="auth" className="mt-4">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Authentication Type</Label>
                      <Select value={auth.type} onValueChange={(value) => setAuth({ ...auth, type: value })}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Auth</SelectItem>
                          <SelectItem value="bearer">Bearer Token</SelectItem>
                          <SelectItem value="basic">Basic Auth</SelectItem>
                          <SelectItem value="api-key">API Key</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {auth.type === 'bearer' && (
                      <div>
                        <Label className="text-sm font-medium">Bearer Token</Label>
                        <Input
                          type="password"
                          placeholder="Enter bearer token..."
                          value={auth.token}
                          onChange={(e) => setAuth({ ...auth, token: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                    )}

                    {auth.type === 'basic' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Username</Label>
                          <Input
                            placeholder="Enter username..."
                            value={auth.username}
                            onChange={(e) => setAuth({ ...auth, username: e.target.value })}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Password</Label>
                          <Input
                            type="password"
                            placeholder="Enter password..."
                            value={auth.password}
                            onChange={(e) => setAuth({ ...auth, password: e.target.value })}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    )}

                    {auth.type === 'api-key' && (
                      <div>
                        <Label className="text-sm font-medium">API Key</Label>
                        <Input
                          type="password"
                          placeholder="Enter API key..."
                          value={auth.token}
                          onChange={(e) => setAuth({ ...auth, token: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="body" className="mt-4">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Request Body (JSON)</Label>
                    <Textarea
                      placeholder={`{
  "key": "value",
  "data": "example"
}`}
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      className="h-40 font-mono text-sm"
                      disabled={!['POST', 'PUT', 'PATCH'].includes(method)}
                    />
                    {!['POST', 'PUT', 'PATCH'].includes(method) && (
                      <p className="text-sm text-gray-500">
                        Request body is only available for POST, PUT, and PATCH methods
                      </p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="ai-tests" className="mt-4">
                  <div className="space-y-4">
                    {/* AI Test Generation Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Brain className="w-5 h-5 text-purple-500" />
                        <Label className="text-lg font-semibold">AI Test Generation</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="auto-generate"
                          checked={autoGenerateTests}
                          onCheckedChange={(checked) => setAutoGenerateTests(checked === true)}
                        />
                        <Label htmlFor="auto-generate" className="text-sm">Auto-generate</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={generateAPITests}
                          disabled={isGeneratingTests || !config.useAI}
                        >
                          {isGeneratingTests ? (
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                              <RefreshCw className="w-4 h-4" />
                            </motion.div>
                          ) : (
                            <Lightbulb className="w-4 h-4" />
                          )}
                          {isGeneratingTests ? 'Generating...' : 'Generate Tests'}
                        </Button>
                      </div>
                    </div>

                    {!config.useAI && (
                      <Alert>
                        <Info className="w-4 h-4" />
                        <AlertDescription>
                          AI test generation is disabled. Enable AI in settings to generate intelligent test cases.
                        </AlertDescription>
                      </Alert>
                    )}

                    {testGenerationError && (
                      <Alert variant="destructive">
                        <AlertTriangle className="w-4 h-4" />
                        <AlertDescription>{testGenerationError}</AlertDescription>
                      </Alert>
                    )}

                    {isGeneratingTests && (
                      <div className="flex items-center justify-center py-8">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-8 h-8 border-4 border-purple-200 border-t-purple-500 rounded-full"
                        />
                        <span className="ml-3 text-gray-600">Generating AI test cases...</span>
                      </div>
                    )}

                    {aiTestSuite && (
                      <div className="space-y-4">
                        {/* Test Suite Overview */}
                        <Card className="bg-gradient-to-r from-purple-50 to-indigo-50">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center">
                              <Target className="w-5 h-5 mr-2 text-purple-600" />
                              Test Suite Overview
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">
                                  {aiTestSuite.testCases.length}
                                </div>
                                <div className="text-xs text-gray-600">Total Tests</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                  {aiTestSuite.coverage.categories.length}
                                </div>
                                <div className="text-xs text-gray-600">Categories</div>
                              </div>
                              <div className="text-center">
                                <div className="text-sm font-semibold text-gray-800">
                                  {aiTestSuite.coverage.estimatedTime}
                                </div>
                                <div className="text-xs text-gray-600">Est. Time</div>
                              </div>
                              <div className="text-center">
                                <Button
                                  size="sm"
                                  onClick={runAllTests}
                                  disabled={runningTestSuite}
                                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                                >
                                  {runningTestSuite ? (
                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                                      <RefreshCw className="w-3 h-3" />
                                    </motion.div>
                                  ) : (
                                    <Play className="w-3 h-3" />
                                  )}
                                  {runningTestSuite ? 'Running...' : 'Run All'}
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Test Cases List */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium mb-2 block">Test Cases</Label>
                            <ScrollArea className="h-96 border rounded-lg">
                              <div className="p-2 space-y-2">
                                {aiTestSuite.testCases.map((testCase) => {
                                  const status = getTestResultStatus(testCase.id);
                                  return (
                                    <motion.div
                                      key={testCase.id}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                                        selectedTestCase?.id === testCase.id 
                                          ? 'border-purple-300 bg-purple-50' 
                                          : 'border bg-white hover:border-purple-200 hover:shadow-md'
                                      }`}
                                      onClick={() => setSelectedTestCase(testCase)}
                                    >
                                      <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center space-x-2">
                                          <Badge className={`text-xs ${getCategoryColor(testCase.category)}`}>
                                            {testCase.category}
                                          </Badge>
                                          <Badge className={`text-xs ${getPriorityColor(testCase.priority)}`}>
                                            {testCase.priority}
                                          </Badge>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                          <Badge className={`text-xs ${getTestResultColor(status)}`}>
                                            {status}
                                          </Badge>
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              runTestCase(testCase);
                                            }}
                                            className="h-6 w-6 p-0"
                                          >
                                            <Play className="w-3 h-3" />
                                          </Button>
                                        </div>
                                      </div>
                                      <h3 className="font-medium text-gray-800 mb-1 text-sm">{testCase.name}</h3>
                                      <p className="text-xs text-gray-600 line-clamp-2">{testCase.description}</p>
                                    </motion.div>
                                  );
                                })}
                              </div>
                            </ScrollArea>
                          </div>

                          {/* Test Case Details */}
                          <div>
                            <Label className="text-sm font-medium mb-2 block">Test Details</Label>
                            <Card className="h-96">
                              <CardContent className="h-full p-4">
                                {selectedTestCase ? (
                                  <ScrollArea className="h-full">
                                    <div className="space-y-4">
                                      <div>
                                        <h3 className="font-semibold text-gray-800 mb-2">{selectedTestCase.name}</h3>
                                        <div className="flex items-center space-x-2 mb-3">
                                          <Badge className={`text-xs ${getCategoryColor(selectedTestCase.category)}`}>
                                            {selectedTestCase.category}
                                          </Badge>
                                          <Badge className={`text-xs ${getPriorityColor(selectedTestCase.priority)}`}>
                                            {selectedTestCase.priority}
                                          </Badge>
                                        </div>
                                        <p className="text-sm text-gray-600">{selectedTestCase.description}</p>
                                      </div>

                                      <div>
                                        <h4 className="font-medium text-gray-800 mb-2">Request</h4>
                                        <div className="bg-gray-50 p-3 rounded text-sm">
                                          <div><strong>Method:</strong> {selectedTestCase.request.method}</div>
                                          <div><strong>URL:</strong> {selectedTestCase.request.url}</div>
                                          {selectedTestCase.request.body && (
                                            <div><strong>Body:</strong> {selectedTestCase.request.body}</div>
                                          )}
                                        </div>
                                      </div>

                                      <div>
                                        <h4 className="font-medium text-gray-800 mb-2">Expected Response</h4>
                                        <div className="bg-gray-50 p-3 rounded text-sm">
                                          <div><strong>Status:</strong> {selectedTestCase.expectedResponse.statusCode}</div>
                                          {selectedTestCase.expectedResponse.body && (
                                            <div><strong>Body:</strong> {selectedTestCase.expectedResponse.body}</div>
                                          )}
                                        </div>
                                      </div>

                                      {selectedTestCase.validations.length > 0 && (
                                        <div>
                                          <h4 className="font-medium text-gray-800 mb-2">Validations</h4>
                                          <div className="space-y-2">
                                            {selectedTestCase.validations.map((validation, index) => (
                                              <div key={index} className="bg-blue-50 p-2 rounded text-sm">
                                                <div><strong>Field:</strong> {validation.field}</div>
                                                <div><strong>Condition:</strong> {validation.condition}</div>
                                                <div><strong>Expected:</strong> {validation.expectedValue}</div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {selectedTestCase.securityConsiderations && selectedTestCase.securityConsiderations.length > 0 && (
                                        <div>
                                          <h4 className="font-medium text-gray-800 mb-2">Security Considerations</h4>
                                          <ul className="text-sm text-gray-600 space-y-1">
                                            {selectedTestCase.securityConsiderations.map((consideration, index) => (
                                              <li key={index} className="flex items-start">
                                                <Shield className="w-3 h-3 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                                                {consideration}
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}

                                      {/* Test Results */}
                                      {testResults[selectedTestCase.id] && (
                                        <div>
                                          <h4 className="font-medium text-gray-800 mb-2">Test Results</h4>
                                          <div className={`p-3 rounded border ${
                                            testResults[selectedTestCase.id].success 
                                              ? 'bg-green-50 border-green-200' 
                                              : 'bg-red-50 border-red-200'
                                          }`}>
                                            <div className="flex items-center space-x-2 mb-2">
                                              {testResults[selectedTestCase.id].success ? (
                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                              ) : (
                                                <XCircle className="w-4 h-4 text-red-600" />
                                              )}
                                              <span className={`font-medium ${
                                                testResults[selectedTestCase.id].success ? 'text-green-800' : 'text-red-800'
                                              }`}>
                                                {testResults[selectedTestCase.id].success ? 'PASSED' : 'FAILED'}
                                              </span>
                                            </div>
                                            <div className="text-sm space-y-1">
                                              <div><strong>Status:</strong> {testResults[selectedTestCase.id].actualStatus}</div>
                                              <div><strong>Response Time:</strong> {testResults[selectedTestCase.id].responseTime}ms</div>
                                              {testResults[selectedTestCase.id].error && (
                                                <div><strong>Error:</strong> {testResults[selectedTestCase.id].error}</div>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </ScrollArea>
                                ) : (
                                  <div className="flex items-center justify-center h-full text-gray-500">
                                    <div className="text-center">
                                      <Target className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                      <p>Select a test case to view details</p>
                                    </div>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </div>
                        </div>

                        {/* Recommendations */}
                        {aiTestSuite.recommendations.length > 0 && (
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg flex items-center">
                                <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
                                AI Recommendations
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                {aiTestSuite.recommendations.map((recommendation, index) => (
                                  <div key={index} className="flex items-start space-x-2 p-2 bg-yellow-50 rounded">
                                    <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-gray-700">{recommendation}</span>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="history" className="mt-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Request History</Label>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setHistory([])}
                        disabled={history.length === 0}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Clear
                      </Button>
                    </div>
                    <ScrollArea className="h-48">
                      <div className="space-y-2">
                        {history.map((item) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => loadFromHistory(item)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Badge variant={item.success ? 'secondary' : 'destructive'} className="text-xs">
                                  {item.method}
                                </Badge>
                                <span className={`text-sm font-medium ${getStatusColor(item.status)}`}>
                                  {item.status || 'Error'}
                                </span>
                              </div>
                              <div className="flex items-center text-xs text-gray-500">
                                <Timer className="w-3 h-3 mr-1" />
                                {item.responseTime}ms
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 truncate mt-1">{item.url}</p>
                            <p className="text-xs text-gray-400">
                              {item.timestamp.toLocaleTimeString()}
                            </p>
                          </motion.div>
                        ))}
                        {history.length === 0 && (
                          <div className="text-center py-8 text-gray-500">
                            <History className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>No requests in history</p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Response Panel */}
        <div className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border h-full">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gray-800">Response</CardTitle>
                    <CardDescription>API response details</CardDescription>
                  </div>
                </div>
                {response && (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(formatJSON(response))}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowResponse(!showResponse)}
                    >
                      {showResponse ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="h-[calc(100%-120px)]">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-full text-gray-500"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-12 h-12 border-4 border-teal-200 border-t-teal-500 rounded-full mb-4"
                    />
                    <p>Sending request...</p>
                  </motion.div>
                ) : response ? (
                  <motion.div
                    key="response"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="h-full"
                  >
                    {response.error ? (
                      <div className="flex flex-col items-center justify-center h-full text-red-500">
                        <XCircle className="w-16 h-16 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Request Failed</h3>
                        <p className="text-center text-gray-600">{response.error}</p>
                        {response.responseTime && (
                          <div className="mt-4 flex items-center text-sm text-gray-500">
                            <Timer className="w-4 h-4 mr-1" />
                            Response time: {response.responseTime}ms
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-full flex flex-col">
                        {/* Response Status */}
                        <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <CheckCircle className={`w-5 h-5 ${getStatusColor(response.status)}`} />
                              <span className={`font-semibold ${getStatusColor(response.status)}`}>
                                {response.status} {response.statusText}
                              </span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Timer className="w-4 h-4 mr-1" />
                              {response.responseTime}ms
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Database className="w-4 h-4 mr-1" />
                              {(response.size / 1024).toFixed(2)} KB
                            </div>
                          </div>
                        </div>

                        {/* Response Tabs */}
                        <Tabs defaultValue="body" className="flex-1 flex flex-col">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="body">Response Body</TabsTrigger>
                            <TabsTrigger value="headers">Headers</TabsTrigger>
                          </TabsList>

                          <TabsContent value="body" className="flex-1">
                            <ScrollArea className="h-full">
                              <pre className="text-sm bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                                {showResponse ? formatJSON(response.data) : '••• Response hidden •••'}
                              </pre>
                            </ScrollArea>
                          </TabsContent>

                          <TabsContent value="headers" className="flex-1">
                            <ScrollArea className="h-full">
                              <div className="space-y-2">
                                {Object.entries(response.headers).map(([key, value]) => (
                                  <div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                                    <span className="font-medium text-gray-700">{key}</span>
                                    <span className="text-gray-600 truncate max-w-xs">{String(value)}</span>
                                  </div>
                                ))}
                              </div>
                            </ScrollArea>
                          </TabsContent>
                        </Tabs>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-full text-gray-500"
                  >
                    <Terminal className="w-16 h-16 mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">Ready to Test</h3>
                    <p className="text-center">Configure your request and click Send to see the response</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default APITester;