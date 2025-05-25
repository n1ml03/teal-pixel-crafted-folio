import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  Code,
  Play,
  Pause,
  CheckCircle2,
  AlertCircle
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
}

const devicePresets: Record<DeviceType, DevicePreset> = {
  desktop: {
    width: 1280,
    height: 800,
    name: 'Desktop',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  },
  tablet: {
    width: 768,
    height: 1024,
    name: 'iPad',
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
  },
  mobile: {
    width: 375,
    height: 667,
    name: 'iPhone SE',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
  }
};

export const TestingEnvironment = ({
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

  // Load URL in iframe
  const loadUrl = useCallback((urlToLoad: string) => {
    setIsLoading(true);

    // Add protocol if missing
    if (!/^https?:\/\//i.test(urlToLoad) && urlToLoad !== 'about:blank') {
      urlToLoad = 'https://' + urlToLoad;
    }

    // Update URL
    setUrl(urlToLoad);

    // Add to history
    if (historyPositionRef.current === historyRef.current.length - 1) {
      historyRef.current.push(urlToLoad);
      historyPositionRef.current++;
    } else {
      // If we're in the middle of the history, truncate and add
      historyRef.current = historyRef.current.slice(0, historyPositionRef.current + 1);
      historyRef.current.push(urlToLoad);
      historyPositionRef.current = historyRef.current.length - 1;
    }

    // Clear console and network
    setConsoleLogs([{ type: 'info', message: `Navigating to ${urlToLoad}`, timestamp: getCurrentTimestamp() }]);
    setNetworkRequests([]);

    // Notify parent
    onUrlChange?.(urlToLoad);

    // Simulate loading time
    setTimeout(() => {
      setIsLoading(false);
      addConsoleLog('info', `Page loaded: ${urlToLoad}`);
    }, 1000);
  }, [onUrlChange, addConsoleLog]);

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
      const prevUrl = historyRef.current[historyPositionRef.current];
      setUrl(prevUrl);
      setInputUrl(prevUrl);
      loadUrl(prevUrl);
    }
  };

  const handleForward = () => {
    if (historyPositionRef.current < historyRef.current.length - 1) {
      historyPositionRef.current++;
      const nextUrl = historyRef.current[historyPositionRef.current];
      setUrl(nextUrl);
      setInputUrl(nextUrl);
      loadUrl(nextUrl);
    }
  };

  const handleDeviceChange = (newDevice: DeviceType) => {
    setDevice(newDevice);
    setViewportSize(devicePresets[newDevice]);

    // Add console log
    addConsoleLog('info', `Device changed to ${devicePresets[newDevice].name}`);
  };

  // Handle screenshot
  const takeScreenshot = () => {
    if (!iframeRef.current) {
      toast.error("Cannot take screenshot: iframe not available");
      return;
    }

    // In a real implementation, we would use html2canvas or a similar library
    // For now, we'll simulate it
    addConsoleLog('info', 'Screenshot taken');

    // Create a mock screenshot data URL
    const mockScreenshotUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

    if (onScreenshot) {
      onScreenshot(mockScreenshotUrl);
    }

    toast.success("Screenshot captured");
  };

  // Handle recording
  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording
      if (recordingInterval) {
        clearInterval(recordingInterval);
        setRecordingInterval(null);
      }
      setIsRecording(false);
      addConsoleLog('info', `Recording stopped after ${Math.floor(recordingTime / 60)}m ${recordingTime % 60}s`);
      toast.success(`Recording stopped after ${Math.floor(recordingTime / 60)}m ${recordingTime % 60}s`);
    } else {
      // Start recording
      setIsRecording(true);
      setRecordingTime(0);
      const interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      setRecordingInterval(interval);
      addConsoleLog('info', 'Recording started');
      toast.success("Recording started");
    }
  };

  // State for test progress animation
  const [testProgress, setTestProgress] = useState(0);
  const [showTestSuccess, setShowTestSuccess] = useState(false);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);

  // Run tests with visual feedback
  const runTests = useCallback(async () => {
    if (challengeTests.length === 0) {
      toast.info("No tests available for this challenge");
      return;
    }

    setIsRunningTests(true);
    setTestProgress(0);
    setCurrentTestIndex(0);
    setShowTestSuccess(false);
    addConsoleLog('info', 'Running tests...');

    // Create a sandbox environment object to pass to tests
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

  return (
    <div className="flex flex-col h-full bg-background">
      <div className={`${isNarrowViewport ? 'p-1.5' : 'p-2'} border-b flex flex-wrap items-center gap-1 md:gap-2`}>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className={`${isNarrowViewport ? 'h-7 w-7' : 'h-8 w-8'}`}
            onClick={handleBack}
            disabled={historyPositionRef.current <= 0}
          >
            <ArrowLeft className={`${isNarrowViewport ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`${isNarrowViewport ? 'h-7 w-7' : 'h-8 w-8'}`}
            onClick={handleForward}
            disabled={historyPositionRef.current >= historyRef.current.length - 1}
          >
            <ArrowRight className={`${isNarrowViewport ? 'h-3.5 w-3.5' : 'h-4 w-4'}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`${isNarrowViewport ? 'h-7 w-7' : 'h-8 w-8'}`}
            onClick={handleRefresh}
          >
            <RefreshCw className={cn(`${isNarrowViewport ? 'h-3.5 w-3.5' : 'h-4 w-4'}`, isLoading && "animate-spin")} />
          </Button>
        </div>

        <form onSubmit={handleUrlSubmit} className="flex-1 flex min-w-[100px]">
          <Input
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className={`${isNarrowViewport ? 'h-7 text-xs' : 'h-8 text-sm'}`}
            placeholder={isNarrowViewport ? "Enter URL" : "Enter URL to test"}
            disabled={isLoading}
          />
        </form>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className={`${isNarrowViewport ? 'h-7 w-7' : 'h-8 w-8'}`}
            onClick={() => handleDeviceChange('mobile')}
          >
            <Smartphone className={cn(`${isNarrowViewport ? 'h-3.5 w-3.5' : 'h-4 w-4'}`, device === 'mobile' && "text-primary")} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`${isNarrowViewport ? 'h-7 w-7' : 'h-8 w-8'}`}
            onClick={() => handleDeviceChange('tablet')}
          >
            <Tablet className={cn(`${isNarrowViewport ? 'h-3.5 w-3.5' : 'h-4 w-4'}`, device === 'tablet' && "text-primary")} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`${isNarrowViewport ? 'h-7 w-7' : 'h-8 w-8'}`}
            onClick={() => handleDeviceChange('desktop')}
          >
            <Monitor className={cn(`${isNarrowViewport ? 'h-3.5 w-3.5' : 'h-4 w-4'}`, device === 'desktop' && "text-primary")} />
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className={cn(
          "justify-start",
          isNarrowViewport ? "mx-2 mt-2 flex-wrap gap-1 w-full" : "mx-4 mt-2"
        )}>
          <TabsTrigger
            value="application"
            className={cn(
              isNarrowViewport ? "px-2 py-1 text-xs flex-1" : "px-3"
            )}
          >
            {isNarrowViewport ? "App" : "Application"}
          </TabsTrigger>
          <TabsTrigger
            value="console"
            className={cn(
              isNarrowViewport ? "px-2 py-1 text-xs flex-1" : "px-3"
            )}
          >
            Console
          </TabsTrigger>
          <TabsTrigger
            value="network"
            className={cn(
              isNarrowViewport ? "px-2 py-1 text-xs flex-1" : "px-3"
            )}
          >
            {isNarrowViewport ? "Net" : "Network"}
          </TabsTrigger>
          <TabsTrigger
            value="elements"
            className={cn(
              isNarrowViewport ? "px-2 py-1 text-xs flex-1" : "px-3"
            )}
          >
            {isNarrowViewport ? "DOM" : "Elements"}
          </TabsTrigger>
          {challengeTests.length > 0 && (
            <TabsTrigger
              value="tests"
              className={cn(
                isNarrowViewport ? "px-2 py-1 text-xs flex-1" : "px-3"
              )}
            >
              <span className="truncate">Tests</span>
              {Object.values(testResults).some(result => result.passed) && (
                <Badge className={`${isNarrowViewport ? 'ml-1 text-[10px] px-1 py-0' : 'ml-2'} bg-green-100 text-green-800 flex-shrink-0`}>
                  {Object.values(testResults).filter(result => result.passed).length}/{challengeTests.length}
                </Badge>
              )}
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="application" className={cn(
          "flex-1 flex flex-col",
          isNarrowViewport ? "p-2" : "p-4"
        )}>
          <div
            className="flex-1 border rounded-md overflow-hidden flex items-center justify-center bg-muted/30 relative"
            style={{
              maxWidth: isNarrowViewport ? '100%' : `${viewportSize.width}px`,
              maxHeight: `${viewportSize.height}px`,
              margin: '0 auto',
              width: '100%',
              height: '100%'
            }}
          >
            {isLoading ? (
              <div className="text-center">
                <RefreshCw className={`${isNarrowViewport ? 'h-6 w-6' : 'h-8 w-8'} animate-spin mx-auto mb-2 text-muted-foreground`} />
                <p className={`${isNarrowViewport ? 'text-xs' : 'text-sm'} text-muted-foreground`}>Loading...</p>
              </div>
            ) : (
              <iframe
                ref={iframeRef}
                src={url}
                title="Testing Sandbox"
                className="w-full h-full border-0"
                sandbox={sandboxMode === 'secure'
                  ? "allow-same-origin allow-scripts allow-forms"
                  : "allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
                }
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            )}

            {isRecording && (
              <div className={`absolute top-2 right-2 bg-red-500 text-white ${isNarrowViewport ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs'} rounded-full flex items-center`}>
                <span className="animate-pulse mr-1">●</span>
                {isNarrowViewport ? `${Math.floor(recordingTime / 60)}:${(recordingTime % 60).toString().padStart(2, '0')}` : `Recording: ${Math.floor(recordingTime / 60)}:${(recordingTime % 60).toString().padStart(2, '0')}`}
              </div>
            )}
          </div>

          <div className={cn(
            "flex justify-between items-center mt-4",
            isNarrowViewport && "flex-col gap-2"
          )}>
            <div className="text-xs text-muted-foreground">
              {viewportSize.width} × {viewportSize.height}
              {device !== 'desktop' && (
                <span className="ml-2">{devicePresets[device].name}</span>
              )}
            </div>

            <div className={cn(
              "flex gap-2",
              isNarrowViewport && "flex-wrap justify-center w-full"
            )}>
              <Button
                variant={isRecording ? "destructive" : "outline"}
                size="sm"
                onClick={toggleRecording}
                className={isNarrowViewport ? "flex-1" : ""}
              >
                {isRecording ? (
                  <>
                    <Pause className="h-4 w-4 mr-1" />
                    {isNarrowViewport ? "Stop" : "Stop Recording"}
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-1" />
                    {isNarrowViewport ? "Record" : "Record Session"}
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={takeScreenshot}
                className={isNarrowViewport ? "flex-1" : ""}
              >
                <Camera className="h-4 w-4 mr-1" />
                {isNarrowViewport ? "" : "Screenshot"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onBugReport}
                className={isNarrowViewport ? "flex-1" : ""}
              >
                <Bug className="h-4 w-4 mr-1" />
                {isNarrowViewport ? "" : "Report Bug"}
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="console" className="flex-1 p-4">
          <ScrollArea className="h-full border rounded-md bg-black text-white font-mono p-2">
            {consoleLogs.map((log, index) => (
              <div key={index} className={cn(
                "py-2 px-3 text-xs border-b border-gray-800 break-words",
                log.type === 'error' && "text-red-400",
                log.type === 'warning' && "text-yellow-400",
                log.type === 'info' && "text-blue-400",
                log.type === 'debug' && "text-gray-400"
              )}>
                <div className="flex items-start">
                  <span className="text-gray-500 mr-2 flex-shrink-0">{log.timestamp}</span>
                  {log.source && <span className="text-gray-400 mr-1 flex-shrink-0">[{log.source}]</span>}
                  <span className="break-words">{log.message}</span>
                </div>
              </div>
            ))}
            {consoleLogs.length === 0 && (
              <div className="py-4 text-center text-gray-500 text-sm">
                No console output yet
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="network" className="flex-1 p-4">
          <ScrollArea className="h-full border rounded-md">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-2">Method</th>
                  <th className="text-left p-2">URL</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Time</th>
                  <th className="text-left p-2">Size</th>
                  <th className="text-left p-2">Type</th>
                </tr>
              </thead>
              <tbody>
                {networkRequests.map((request, index) => (
                  <tr key={request.id || index} className="border-b">
                    <td className="p-2 font-medium">{request.method}</td>
                    <td className="p-2 truncate max-w-[200px]">{request.url}</td>
                    <td className={cn(
                      "p-2",
                      request.status >= 200 && request.status < 300 && "text-green-600",
                      request.status >= 400 && "text-red-600"
                    )}>
                      {request.status}
                    </td>
                    <td className="p-2">{request.time}</td>
                    <td className="p-2">{request.size}</td>
                    <td className="p-2">{request.type}</td>
                  </tr>
                ))}
                {networkRequests.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-muted-foreground">
                      No network requests captured yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="elements" className="flex-1 p-4">
          <ScrollArea className="h-full border rounded-md p-2">
            <div className="font-mono text-sm">
              {elements.map((element, index) => (
                <div key={index} className="py-1">
                  <div className="flex items-start">
                    <Code className="h-4 w-4 mr-1 mt-0.5 text-muted-foreground" />
                    <div>
                      <span className="text-blue-600">&lt;{element.tag}</span>
                      {element.id && <span className="text-purple-600"> id="{element.id}"</span>}
                      {element.classes.length > 0 && (
                        <span className="text-purple-600"> class="{element.classes.join(' ')}"</span>
                      )}
                      {Object.entries(element.attributes || {}).map(([key, value]) => (
                        <span key={key} className="text-purple-600"> {key}="{value}"</span>
                      ))}
                      <span className="text-blue-600">&gt;</span>
                      <span className="text-muted-foreground ml-2">// {element.children} children</span>
                      {element.path && (
                        <span className="text-gray-500 ml-2 text-xs">{element.path}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {elements.length === 0 && (
                <div className="py-4 text-center text-muted-foreground">
                  No DOM elements captured yet
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="tests" className="flex-1 p-4">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-medium">Challenge Tests</h3>
            <Button
              onClick={runTests}
              disabled={isRunningTests || challengeTests.length === 0}
              variant="outline"
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
                  Run Tests
                </>
              )}
            </Button>
          </div>

          {/* Test Progress Bar */}
          {isRunningTests && (
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span>Running tests...</span>
                <span>{Math.round(testProgress)}%</span>
              </div>
              <Progress value={testProgress} className="h-2" />
            </div>
          )}

          {/* Test Success Animation */}
          <AnimatePresence>
            {showTestSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-4 bg-green-50 border border-green-200 rounded-md p-3 flex items-center"
              >
                <motion.div
                  initial={{ scale: 0.5, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 10 }}
                  className="mr-3 bg-green-100 p-2 rounded-full"
                >
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </motion.div>
                <div>
                  <motion.h4
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="font-medium text-green-800"
                  >
                    All Tests Passed!
                  </motion.h4>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-sm text-green-600"
                  >
                    Great job! You've successfully completed all the tests.
                  </motion.p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <ScrollArea className="h-[calc(100%-3rem)] border rounded-md">
            <div className="p-4 space-y-4">
              {challengeTests.map((test, index) => {
                const result = testResults[test.id];
                const isCurrentTest = isRunningTests && index === currentTestIndex;

                return (
                  <motion.div
                    key={test.id}
                    className={cn(
                      "border rounded-md p-4 overflow-hidden",
                      result?.passed && "border-green-200 bg-green-50",
                      result?.passed === false && "border-red-200 bg-red-50",
                      isCurrentTest && "border-blue-300 shadow-sm"
                    )}
                    animate={isCurrentTest ? {
                      scale: [1, 1.02, 1],
                      transition: { repeat: Infinity, duration: 1.5 }
                    } : {}}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center flex-wrap gap-2">
                        {result?.passed === true && (
                          <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring" }}
                            className="flex-shrink-0"
                          >
                            <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                          </motion.div>
                        )}
                        {result?.passed === false && (
                          <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring" }}
                            className="flex-shrink-0"
                          >
                            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                          </motion.div>
                        )}
                        {isCurrentTest && !result && (
                          <RefreshCw className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 animate-spin" />
                        )}
                        <h4 className="font-medium break-words">{test.name}</h4>
                      </div>
                      {result && (
                        <Badge
                          className={cn(
                            "flex-shrink-0 ml-2",
                            result.passed
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          )}
                        >
                          {result.passed ? "Passed" : "Failed"}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 break-words leading-relaxed">{test.description}</p>
                    {result && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className={cn(
                          "text-sm p-3 rounded overflow-hidden",
                          result.passed ? "bg-green-100" : "bg-red-100"
                        )}
                      >
                        <div className="break-words">{result.message}</div>
                        {result.details && (
                          <div className="mt-3 text-xs font-mono whitespace-pre-wrap bg-black/5 p-2 rounded">
                            {result.details}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
              {challengeTests.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No tests available for this challenge
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TestingEnvironment;
