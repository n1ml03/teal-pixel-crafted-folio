import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Bug,
  Smartphone,
  Tablet,
  Monitor,
  Camera,
  Play,
  Pause,
  CheckCircle2,
  AlertCircle,
  Terminal,
  Globe,
  Activity,
  Zap,
  Eye,
  FlaskConical,
  Star,
  CircuitBoard
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useIsMobile } from '@/hooks/use-mobile.tsx';
import { Progress } from "@/components/ui/progress";

interface ConsoleLog {
  type: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  timestamp: string;
  source?: string;
}

interface NetworkRequest {
  id: string;
  method: string;
  url: string;
  status: number;
  time: string;
  size: string;
  type: string;
  initiator: string;
  startTime: number;
}

interface DOMElement {
  tag: string;
  id: string;
  classes: string[];
  attributes: Record<string, string>;
  children: number;
  path: string;
}

interface TestResult {
  passed: boolean;
  message: string;
  details?: string;
}

interface TestingEnvironmentProps {
  initialUrl?: string;
  onUrlChange?: (url: string) => void;
  onScreenshot?: (dataUrl: string) => void;
  onBugReport?: () => void;
  onTestResult?: (result: TestResult) => void;
  challengeTests?: ChallengeTest[];
  sandboxMode?: 'secure' | 'open';
}

interface ChallengeTest {
  id: string;
  name: string;
  description: string;
  testFunction: (env: {
    iframe: HTMLIFrameElement | null;
    url: string;
    device: DeviceType;
    consoleLogs: ConsoleLog[];
    networkRequests: NetworkRequest[];
    elements: DOMElement[];
  }) => Promise<TestResult>;
}

type DeviceType = 'desktop' | 'tablet' | 'mobile';

interface DevicePreset {
  width: number;
  height: number;
  userAgent?: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

const devicePresets: Record<DeviceType, DevicePreset> = {
  desktop: {
    width: 1280,
    height: 800,
    name: 'Desktop',
    icon: Monitor,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  },
  tablet: {
    width: 768,
    height: 1024,
    name: 'iPad',
    icon: Tablet,
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
  },
  mobile: {
    width: 375,
    height: 667,
    name: 'iPhone SE',
    icon: Smartphone,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
  }
};

// Console log type styling
const consoleLogStyles = {
  info: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800',
  warning: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800',
  error: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800',
  debug: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800'
};

// HTTP status code styling
const getStatusBadgeStyle = (status: number) => {
  if (status >= 200 && status < 300) {
    return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800';
  } else if (status >= 300 && status < 400) {
    return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800';
  } else if (status >= 400 && status < 500) {
    return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800';
  } else {
    return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800';
  }
};

export const TestingEnvironment = React.memo(({
  initialUrl = 'about:blank',
  onUrlChange,
  onScreenshot,
  onBugReport,
  onTestResult,
  challengeTests = [],
  sandboxMode = 'secure'
}: TestingEnvironmentProps) => {
  const [url, setUrl] = useState(initialUrl);
  const [inputUrl, setInputUrl] = useState(initialUrl);
  const [activeTab, setActiveTab] = useState('application');
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [viewportSize, setViewportSize] = useState<DevicePreset>(devicePresets.desktop);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingInterval, setRecordingInterval] = useState<NodeJS.Timeout | null>(null);
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testProgress, setTestProgress] = useState(0);
  const [currentTestIndex, setCurrentTestIndex] = useState(-1);
  const [showTestSuccess, setShowTestSuccess] = useState(false);

  // Refs
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const historyRef = useRef<string[]>([]);
  const historyPositionRef = useRef<number>(-1);

  // State for console logs, network requests, and DOM elements
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([
    { type: 'info', message: 'Environment initialized', timestamp: getCurrentTimestamp() }
  ]);

  const [networkRequests, setNetworkRequests] = useState<NetworkRequest[]>([]);

  const [elements, setElements] = useState<DOMElement[]>([]);

  // Helper function to get current timestamp
  function getCurrentTimestamp(): string {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour12: false });
  }

  // Add console log
  const addConsoleLog = useCallback((type: ConsoleLog['type'], message: string, source?: string) => {
    setConsoleLogs(prev => [
      ...prev,
      {
        type,
        message,
        timestamp: getCurrentTimestamp(),
        source
      }
    ]);
  }, []);

  // Load URL function
  const loadUrl = useCallback((newUrl: string) => {
    if (!newUrl || newUrl === url) return;
    
    setIsLoading(true);
    setUrl(newUrl);

    // Update history
    if (historyRef.current[historyPositionRef.current] !== newUrl) {
      historyRef.current = [
        ...historyRef.current.slice(0, historyPositionRef.current + 1),
        newUrl
      ];
      historyPositionRef.current = historyRef.current.length - 1;
    }

    if (onUrlChange) {
      onUrlChange(newUrl);
    }

    // Simulate loading delay
    setTimeout(() => {
      setIsLoading(false);
      addConsoleLog('info', `Navigated to ${newUrl}`);
    }, 500);
  }, [url, onUrlChange, addConsoleLog]);

  // Handle messages from the iframe
  const handleIframeMessage = useCallback((event: MessageEvent) => {
    const { type, data } = event.data || {};

    if (!type) return;

    switch (type) {
      case 'console':
        addConsoleLog(data.type, data.message, data.source);
        break;
      case 'network':
        addNetworkRequest(data);
        break;
      case 'dom':
        setElements(data.elements);
        break;
      case 'testResult':
        if (onTestResult) {
          onTestResult(data.result);
        }
        setTestResults(prev => ({
          ...prev,
          [data.testId]: data.result
        }));
        break;
    }
  }, [onTestResult, addConsoleLog]);

  // Add network request
  const addNetworkRequest = (request: NetworkRequest) => {
    setNetworkRequests(prev => [request, ...prev]);
  };

  // Event handlers
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadUrl(inputUrl);
  };

  const handleRefresh = () => {
    loadUrl(url);
  };

  const handleBack = () => {
    if (historyPositionRef.current > 0) {
      historyPositionRef.current--;
      const previousUrl = historyRef.current[historyPositionRef.current];
      setUrl(previousUrl);
      setInputUrl(previousUrl);
    }
  };

  const handleForward = () => {
    if (historyPositionRef.current < historyRef.current.length - 1) {
      historyPositionRef.current++;
      const nextUrl = historyRef.current[historyPositionRef.current];
      setUrl(nextUrl);
      setInputUrl(nextUrl);
    }
  };

  const handleDeviceChange = (newDevice: DeviceType) => {
    setDevice(newDevice);
    setViewportSize(devicePresets[newDevice]);
    addConsoleLog('info', `Switched to ${devicePresets[newDevice].name} view`);
  };

  const takeScreenshot = () => {
    if (onScreenshot) {
      // In a real implementation, this would capture the iframe content
      onScreenshot('data:image/png;base64,screenshot-data');
      toast.success("Screenshot captured!");
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      if (recordingInterval) {
        clearInterval(recordingInterval);
        setRecordingInterval(null);
      }
      setRecordingTime(0);
      toast.success("Recording stopped");
    } else {
      setIsRecording(true);
      setRecordingTime(0);
      const interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      setRecordingInterval(interval);
      toast.success("Recording started");
    }
  };

  // Test running functionality
  const runTests = useCallback(async () => {
    if (challengeTests.length === 0) {
      toast.error("No tests available");
      return;
    }

    setIsRunningTests(true);
    setTestProgress(0);
    setCurrentTestIndex(-1);
    setTestResults({});
    setShowTestSuccess(false);

    const testEnv = {
      iframe: iframeRef.current,
      url,
      device,
      consoleLogs,
      networkRequests,
      elements
    };

    // Track timeouts for cleanup
    const timeouts: NodeJS.Timeout[] = [];
    let isCancelled = false;

    try {
      // Run each test with visual progress
      let passedCount = 0;

      for (let i = 0; i < challengeTests.length; i++) {
        if (isCancelled) break;

        const test = challengeTests[i];
        setCurrentTestIndex(i);

        // Update progress animation
        setTestProgress(Math.round((i / challengeTests.length) * 100));

        // Add a small delay for visual effect with cleanup tracking
        await new Promise<void>(resolve => {
          const timeout = setTimeout(resolve, 500);
          timeouts.push(timeout);
        });

        if (isCancelled) break;

        try {
          addConsoleLog('info', `Running test: ${test.name}`);
          const result = await test.testFunction(testEnv);

          if (isCancelled) break;

          setTestResults(prev => ({
            ...prev,
            [test.id]: result
          }));

          if (result.passed) {
            passedCount++;
          }

          addConsoleLog(
            result.passed ? 'info' : 'error',
            `Test ${result.passed ? 'passed' : 'failed'}: ${result.message}`
          );

          // Add a small delay between tests with cleanup tracking
          await new Promise<void>(resolve => {
            const timeout = setTimeout(resolve, 300);
            timeouts.push(timeout);
          });
        } catch (error) {
          if (isCancelled) break;

          console.error(`Error running test ${test.id}:`, error);
          setTestResults(prev => ({
            ...prev,
            [test.id]: {
              passed: false,
              message: `Test error: ${error instanceof Error ? error.message : 'Unknown error'}`
            }
          }));

          addConsoleLog('error', `Test error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      if (isCancelled) return;

      // Complete the progress bar
      setTestProgress(100);

      // Show success animation if all tests passed
      if (passedCount === challengeTests.length) {
        setShowTestSuccess(true);

        // Show notification if available
        try {
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Tests Completed!', {
              body: 'All tests passed successfully!'
            });
          }
        } catch (error) {
          console.warn('Notification failed:', error);
        }
      }

      // Wait for animations to complete with cleanup tracking
      await new Promise<void>(resolve => {
        const timeout = setTimeout(resolve, 1000);
        timeouts.push(timeout);
      });

      if (isCancelled) return;

      setIsRunningTests(false);
      addConsoleLog('info', 'All tests completed');

      // Hide success animation after a delay with cleanup tracking
      const hideTimeout = setTimeout(() => {
        if (!isCancelled) {
          setShowTestSuccess(false);
        }
      }, 3000);
      timeouts.push(hideTimeout);

    } catch (error) {
      console.error('Error in runTests:', error);
      setIsRunningTests(false);
    }

    // Cleanup function
    return () => {
      isCancelled = true;
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [challengeTests, url, device, consoleLogs, networkRequests, elements, addConsoleLog]);

  // Initialize the sandbox
  useEffect(() => {
    if (initialUrl && initialUrl !== 'about:blank') {
      setInputUrl(initialUrl);
      loadUrl(initialUrl);
    }

    // Set up message listener for iframe communication
    window.addEventListener('message', handleIframeMessage);

    return () => {
      window.removeEventListener('message', handleIframeMessage);
    };
  }, [initialUrl, handleIframeMessage, loadUrl]);

  // Separate effect for recording interval cleanup
  useEffect(() => {
    return () => {
      if (recordingInterval) {
        clearInterval(recordingInterval);
      }
    };
  }, [recordingInterval]);

  // Determine if we're in a narrow viewport
  const isNarrowViewport = useIsMobile();

  // Memoized viewport style to prevent recalculations
  const viewportStyle = useMemo(() => ({
    width: Math.min(viewportSize.width, 800),
    height: Math.min(viewportSize.height, 600),
    aspectRatio: `${viewportSize.width}/${viewportSize.height}`
  }), [viewportSize]);

  // Memoized console logs (limit to last 100 for performance)
  const limitedConsoleLogs = useMemo(() => consoleLogs.slice(-100), [consoleLogs]);
  
  // Memoized network requests (limit to first 50 for performance)
  const limitedNetworkRequests = useMemo(() => networkRequests.slice(0, 50), [networkRequests]);

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-background via-background to-muted/10 backdrop-blur-sm">
      {/* Enhanced Browser Controls */}
      <div className={cn(
        "p-4 border-b border/50 bg-gradient-to-r from-background/90 to-muted/20 backdrop-blur-md",
        "flex flex-wrap items-center gap-3"
      )}>
        <div className="flex items-center gap-2">
          {/* Navigation Controls */}
          <div className="flex items-center bg-muted/30 rounded-lg p-1 border border/50">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-accent/50 transition-all duration-200"
              onClick={handleBack}
              disabled={historyPositionRef.current <= 0}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-accent/50 transition-all duration-200"
              onClick={handleForward}
              disabled={historyPositionRef.current >= historyRef.current.length - 1}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-accent/50 transition-all duration-200"
              onClick={handleRefresh}
            >
              <RefreshCw className={cn("h-4 w-4 transition-transform", isLoading && "animate-spin")} />
            </Button>
          </div>

          {/* Device Controls */}
          <div className="flex items-center bg-muted/30 rounded-lg p-1 border border/50">
            {(Object.keys(devicePresets) as DeviceType[]).map((deviceType) => {
              const preset = devicePresets[deviceType];
              const IconComponent = preset.icon;
              return (
                <Button
                  key={deviceType}
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-8 w-8 transition-all duration-200",
                    device === deviceType
                      ? "bg-primary/20 text-primary border border-primary/30"
                      : "hover:bg-accent/50"
                  )}
                  onClick={() => handleDeviceChange(deviceType)}
                >
                  <IconComponent className="h-4 w-4" />
                </Button>
              );
            })}
          </div>
        </div>

        {/* URL Input */}
        <form onSubmit={handleUrlSubmit} className="flex-1 flex min-w-[200px]">
          <div className="relative flex-1">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="pl-10 bg-background/50 border/50 focus:border-primary/50 transition-all duration-200"
              placeholder="Enter URL to test"
              disabled={isLoading}
            />
            {isLoading && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.5 }}
                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full"
              />
            )}
          </div>
        </form>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border/50 hover:border hover:bg-muted/50"
            onClick={takeScreenshot}
          >
            <Camera className="h-4 w-4 mr-2" />
            Screenshot
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "border/50 hover:border transition-all duration-200",
              isRecording && "bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
            )}
            onClick={toggleRecording}
          >
            {isRecording ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Stop ({recordingTime}s)
              </>
            ) : (
              <>
                <Activity className="h-4 w-4 mr-2" />
                Record
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border/50 hover:border hover:bg-muted/50"
            onClick={onBugReport}
          >
            <Bug className="h-4 w-4 mr-2" />
            Report Bug
          </Button>
        </div>
      </div>

      {/* Enhanced Tab System */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="px-4 pt-2 pb-0 bg-gradient-to-r from-background/80 to-muted/10">
          <TabsList className="grid w-full grid-cols-4 bg-muted/30 border border/50">
            <TabsTrigger 
              value="application" 
              className="data-[state=active]:bg-background data-[state=active]:shadow-md transition-all duration-200"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </TabsTrigger>
            <TabsTrigger 
              value="console"
              className="data-[state=active]:bg-background data-[state=active]:shadow-md transition-all duration-200"
            >
              <Terminal className="h-4 w-4 mr-2" />
              Console
            </TabsTrigger>
            <TabsTrigger 
              value="network"
              className="data-[state=active]:bg-background data-[state=active]:shadow-md transition-all duration-200"
            >
              <Activity className="h-4 w-4 mr-2" />
              Network
            </TabsTrigger>
            <TabsTrigger 
              value="tests"
              className="data-[state=active]:bg-background data-[state=active]:shadow-md transition-all duration-200"
            >
              <FlaskConical className="h-4 w-4 mr-2" />
              Tests
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Application Preview */}
        <TabsContent value="application" className="flex-1 p-4 m-0">
          <div className="h-full bg-gradient-to-br from-muted/20 to-background/50 rounded-xl border border/50 p-4 backdrop-blur-sm">
            <div className="h-full flex items-center justify-center relative">
              <motion.div
                key={device}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="relative shadow-2xl rounded-lg overflow-hidden border border/50 bg-background"
                style={viewportStyle}
              >
                <iframe
                  ref={iframeRef}
                  src={url}
                  className="w-full h-full border-none"
                  sandbox={sandboxMode === 'secure' ? "allow-scripts allow-same-origin allow-forms" : undefined}
                  title="Testing Environment"
                />
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-background/80 flex items-center justify-center backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-3">
                      <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                      <span className="text-sm font-medium">Loading...</span>
                    </div>
                  </motion.div>
                )}
              </motion.div>
              
              {/* Device Info Badge */}
              <div className="absolute top-4 right-4">
                <Badge className="bg-background/80 border border/50 backdrop-blur-sm">
                  {(() => {
                    const IconComponent = devicePresets[device].icon;
                    return <IconComponent className="h-3 w-3 mr-1" />;
                  })()}
                  {viewportSize.name}
                </Badge>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Enhanced Console */}
        <TabsContent value="console" className="flex-1 p-4 m-0">
          <div className="h-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border/50 overflow-hidden">
            <div className="bg-slate-800/50 px-4 py-2 border-b border-slate-600/50 flex items-center">
              <Terminal className="h-4 w-4 mr-2 text-slate-300" />
              <span className="text-sm font-medium text-slate-200">Console Output</span>
              <Badge className="ml-auto bg-slate-700 text-slate-200 border-slate-600">
                {consoleLogs.length} logs
              </Badge>
            </div>
            <ScrollArea className="h-[calc(100%-3rem)]">
              <div className="p-4 space-y-2 font-mono text-sm">
                {limitedConsoleLogs.map((log, index) => (
                  <motion.div
                    key={`${index}-${log.timestamp}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(index * 0.005, 0.1) }}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg border transition-colors duration-200",
                      consoleLogStyles[log.type]
                    )}
                  >
                    <span className="text-xs text-muted-foreground font-medium min-w-[60px]">
                      {log.timestamp}
                    </span>
                    <Badge className="text-xs uppercase font-semibold">
                      {log.type}
                    </Badge>
                    <span className="flex-1 break-words">{log.message}</span>
                    {log.source && (
                      <span className="text-xs text-muted-foreground">
                        {log.source}
                      </span>
                    )}
                  </motion.div>
                ))}
                {consoleLogs.length === 0 && (
                  <div className="text-center py-8 text-slate-400">
                    No console output yet
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>

        {/* Enhanced Network Panel */}
        <TabsContent value="network" className="flex-1 p-4 m-0">
          <div className="h-full bg-gradient-to-br from-muted/20 to-background/50 rounded-xl border border/50 overflow-hidden">
            <div className="bg-background/80 px-4 py-3 border-b border/50 flex items-center backdrop-blur-sm">
              <Activity className="h-4 w-4 mr-2 text-primary" />
              <span className="text-sm font-medium">Network Requests</span>
              <Badge className="ml-auto bg-primary/10 text-primary border-primary/20">
                {networkRequests.length} requests
              </Badge>
            </div>
            <ScrollArea className="h-[calc(100%-3.5rem)]">
              <div className="p-4 space-y-3">
                {limitedNetworkRequests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.005, 0.1) }}
                    className="bg-background/80 p-4 rounded-lg border border/50 hover:border transition-colors duration-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-slate-100 text-slate-700 border-slate-200 font-mono text-xs">
                          {request.method}
                        </Badge>
                        <Badge className={cn("text-xs font-medium", getStatusBadgeStyle(request.status))}>
                          {request.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Zap className="h-3 w-3" />
                        {request.time}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="font-mono text-sm break-all">{request.url}</div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{request.type}</span>
                        <span>{request.size}</span>
                        <span>by {request.initiator}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {networkRequests.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <CircuitBoard className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                    <p>No network requests captured yet</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>

        {/* Enhanced Tests Panel */}
        <TabsContent value="tests" className="flex-1 p-4 m-0">
          <div className="h-full bg-gradient-to-br from-muted/20 to-background/50 rounded-xl border border/50 overflow-hidden">
            {/* Test Header */}
            <div className="bg-background/80 px-4 py-3 border-b border/50 backdrop-blur-sm">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <FlaskConical className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Challenge Tests</h3>
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    {challengeTests.length} tests
                  </Badge>
                </div>
                <Button
                  onClick={runTests}
                  disabled={isRunningTests || challengeTests.length === 0}
                  className={cn(
                    "transition-all duration-300 hover:scale-105",
                    isRunningTests
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                      : "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
                  )}
                  size="sm"
                >
                  {isRunningTests ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Running Tests...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Run All Tests
                    </>
                  )}
                </Button>
              </div>

              {/* Test Progress Bar */}
              {isRunningTests && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4"
                >
                  <div className="flex justify-between text-xs mb-2">
                    <span className="font-medium">Running tests...</span>
                    <span className="font-mono">{Math.round(testProgress)}%</span>
                  </div>
                  <Progress 
                    value={testProgress} 
                    className="h-2 bg-muted/50"
                  />
                </motion.div>
              )}
            </div>

            {/* Test Success Animation */}
            <AnimatePresence>
              {showTestSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mx-4 mt-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 flex items-center"
                >
                  <motion.div
                    initial={{ scale: 0.5, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 10 }}
                    className="mr-4 bg-gradient-to-br from-emerald-500 to-green-600 p-3 rounded-full shadow-lg shadow-emerald-500/25"
                  >
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </motion.div>
                  <div>
                    <motion.h4
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="font-semibold text-emerald-800 dark:text-emerald-200 flex items-center gap-2"
                    >
                      <Star className="h-4 w-4" />
                      All Tests Passed!
                    </motion.h4>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-sm text-emerald-600 dark:text-emerald-400 mt-1"
                    >
                      Excellent work! You've successfully completed all the tests.
                    </motion.p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tests List */}
            <ScrollArea className="h-[calc(100%-6rem)]">
              <div className="p-4 space-y-4">
                {challengeTests.map((test, index) => {
                  const result = testResults[test.id];
                  const isCurrentTest = isRunningTests && index === currentTestIndex;

                  return (
                    <motion.div
                      key={test.id}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className={cn(
                        "bg-background/80 border rounded-xl p-4 transition-all duration-300",
                        result?.passed && "border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50/50 to-green-50/30 dark:from-emerald-950/20 dark:to-green-950/10",
                        result?.passed === false && "border-red-200 dark:border-red-800 bg-gradient-to-br from-red-50/50 to-rose-50/30 dark:from-red-950/20 dark:to-rose-950/10",
                        isCurrentTest && "border-primary/50 shadow-lg shadow-primary/10"
                      )}
                      style={{
                        transform: isCurrentTest ? 'scale(1.02)' : 'scale(1)',
                        transition: 'transform 0.3s ease'
                      }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          {result?.passed === true && (
                            <motion.div
                              initial={{ scale: 0.5, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.2 }}
                              className="bg-gradient-to-br from-emerald-500 to-green-600 p-1.5 rounded-full shadow-lg shadow-emerald-500/25"
                            >
                              <CheckCircle2 className="h-4 w-4 text-white" />
                            </motion.div>
                          )}
                          {result?.passed === false && (
                            <motion.div
                              initial={{ scale: 0.5, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.2 }}
                              className="bg-gradient-to-br from-red-500 to-rose-600 p-1.5 rounded-full shadow-lg shadow-red-500/25"
                            >
                              <AlertCircle className="h-4 w-4 text-white" />
                            </motion.div>
                          )}
                          {isCurrentTest && !result && (
                            <div className="bg-gradient-to-br from-primary to-primary/80 p-1.5 rounded-full">
                              <RefreshCw className="h-4 w-4 text-white animate-spin" />
                            </div>
                          )}
                          <div>
                            <h4 className="font-medium">{test.name}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{test.description}</p>
                          </div>
                        </div>
                        {result && (
                          <Badge
                            className={cn(
                              "transition-all duration-300",
                              result.passed
                                ? "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800"
                                : "bg-red-100 text-red-800 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800"
                            )}
                          >
                            {result.passed ? "Passed" : "Failed"}
                          </Badge>
                        )}
                      </div>
                      {result && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className={cn(
                            "text-sm p-3 rounded-lg border mt-3",
                            result.passed 
                              ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800" 
                              : "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800"
                          )}
                        >
                          <div className="break-words">{result.message}</div>
                          {result.details && (
                            <div className="mt-3 text-xs font-mono whitespace-pre-wrap bg-background/50 p-3 rounded border border/50">
                              {result.details}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
                {challengeTests.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <FlaskConical className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                    <h3 className="text-lg font-medium mb-2">No Tests Available</h3>
                    <p className="text-sm">Tests will appear here when available for this challenge.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
});

export default TestingEnvironment;
