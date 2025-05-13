import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MotionButton } from "@/components/ui/motion-button";
import { automationScripts } from '@/data/testing-playground';
import { toast } from "@/components/ui/sonner";
import { 
  Play, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle,
  FileText,
  Download,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TestResult {
  id: string;
  title: string;
  status: 'passed' | 'failed' | 'running' | 'pending';
  duration?: number;
  error?: string;
}

const TestRunner: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  
  // Function to run all tests
  const runAllTests = () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setProgress(0);
    
    // Initialize all tests as pending
    const initialResults = automationScripts.map(script => ({
      id: script.id,
      title: script.title,
      status: 'pending' as const
    }));
    
    setResults(initialResults);
    
    // Simulate test execution with delays
    let completedTests = 0;
    
    automationScripts.forEach((script, index) => {
      // Set test to running status
      setTimeout(() => {
        setResults(prev => 
          prev.map(result => 
            result.id === script.id 
              ? { ...result, status: 'running' } 
              : result
          )
        );
      }, index * 1000);
      
      // Complete test with random result
      setTimeout(() => {
        const passed = Math.random() > 0.3; // 70% chance to pass
        const duration = Math.floor(Math.random() * 1000) + 200; // 200-1200ms
        
        setResults(prev => 
          prev.map(result => 
            result.id === script.id 
              ? { 
                  ...result, 
                  status: passed ? 'passed' : 'failed',
                  duration,
                  error: passed ? undefined : 'Assertion failed: Expected element to be visible'
                } 
              : result
          )
        );
        
        completedTests++;
        setProgress((completedTests / automationScripts.length) * 100);
        
        // Check if all tests are completed
        if (completedTests === automationScripts.length) {
          setIsRunning(false);
          toast.success('All tests completed!');
        }
      }, (index + 1) * 1000 + 500);
    });
  };
  
  // Function to run a single test
  const runSingleTest = (testId: string) => {
    if (isRunning) return;
    
    setIsRunning(true);
    setProgress(0);
    setSelectedTest(testId);
    
    // Find the test script
    const script = automationScripts.find(s => s.id === testId);
    if (!script) return;
    
    // Initialize test as running
    setResults([{
      id: script.id,
      title: script.title,
      status: 'running'
    }]);
    
    // Simulate test execution
    setProgress(50);
    
    // Complete test with random result after delay
    setTimeout(() => {
      const passed = Math.random() > 0.3; // 70% chance to pass
      const duration = Math.floor(Math.random() * 1000) + 200; // 200-1200ms
      
      setResults([{ 
        id: script.id, 
        title: script.title,
        status: passed ? 'passed' : 'failed',
        duration,
        error: passed ? undefined : 'Assertion failed: Expected element to be visible'
      }]);
      
      setProgress(100);
      setIsRunning(false);
      toast.success('Test completed!');
    }, 1500);
  };
  
  // Function to reset test results
  const resetTests = () => {
    setResults([]);
    setProgress(0);
    setSelectedTest(null);
  };
  
  // Function to generate test report
  const generateReport = () => {
    if (results.length === 0) {
      toast.error('No test results to generate report');
      return;
    }
    
    toast.success('Test report generated!');
    
    // In a real application, this would generate and download a PDF report
    const passed = results.filter(r => r.status === 'passed').length;
    const failed = results.filter(r => r.status === 'failed').length;
    
    // Show report summary
    toast.info(`Test Summary: ${passed} passed, ${failed} failed`);
  };
  
  // Function to render status badge
  const renderStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'passed':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" /> Passed
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200">
            <XCircle className="h-3 w-3 mr-1" /> Failed
          </Badge>
        );
      case 'running':
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" /> Running
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200">
            <Clock className="h-3 w-3 mr-1" /> Pending
          </Badge>
        );
      default:
        return null;
    }
  };
  
  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <Play className="h-5 w-5 mr-2 text-teal-600" />
            Test Runner
          </CardTitle>
          <div className="flex gap-2">
            <MotionButton
              size="sm"
              variant="outline"
              className="text-xs"
              onClick={resetTests}
              disabled={isRunning || results.length === 0}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              Reset
            </MotionButton>
            <MotionButton
              size="sm"
              variant="outline"
              className="text-xs"
              onClick={generateReport}
              disabled={isRunning || results.length === 0}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="h-3.5 w-3.5 mr-1" />
              Report
            </MotionButton>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Test Controls */}
        <div className="mb-4 flex gap-2">
          <MotionButton
            onClick={runAllTests}
            disabled={isRunning}
            className="bg-teal-500 hover:bg-teal-600 text-white flex-1"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Play className="h-4 w-4 mr-2" />
            Run All Tests
          </MotionButton>
        </div>
        
        {/* Progress Bar */}
        {isRunning && (
          <div className="mb-4">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-gray-500 mt-1 text-right">{Math.round(progress)}% complete</p>
          </div>
        )}
        
        {/* Test List */}
        <div className="space-y-2 mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Available Tests</h3>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-2">
              {automationScripts.map((script) => {
                const result = results.find(r => r.id === script.id);
                
                return (
                  <motion.div
                    key={script.id}
                    className={`p-3 border rounded-lg ${
                      selectedTest === script.id ? 'border-teal-300 bg-teal-50' : 'border-gray-200 bg-white'
                    } hover:border-teal-300 transition-colors cursor-pointer`}
                    onClick={() => !isRunning && runSingleTest(script.id)}
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{script.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">{script.framework} • {script.language}</p>
                      </div>
                      {result && (
                        <div className="flex flex-col items-end">
                          {renderStatusBadge(result.status)}
                          {result.duration && (
                            <span className="text-xs text-gray-500 mt-1">{result.duration}ms</span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Error message for failed tests */}
                    {result?.status === 'failed' && result.error && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-100 rounded text-xs text-red-700">
                        <div className="flex items-start">
                          <AlertCircle className="h-3.5 w-3.5 mr-1 mt-0.5 flex-shrink-0" />
                          <span>{result.error}</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestRunner;
