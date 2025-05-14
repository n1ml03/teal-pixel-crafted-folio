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
  FileText,
  Download,
  RefreshCw,
  Loader2,
  Zap,
  Target,
  LayoutList,
  Code
} from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define the test action interface
interface TestAction {
  type: 'addTask' | 'completeTask' | 'deleteTask' | 'filterTasks' | 'verifyTaskExists' | 'verifyTaskCompleted' | 'verifyTaskCount' | 'verifyFilterActive';
  target?: string;
  value?: string;
  expectedResult?: string;
}

// Define the test case interface
interface TestCase {
  id: string;
  title: string;
  description: string;
  actions: TestAction[];
}

// Define the test result interface
interface TestResult {
  id: string;
  title: string;
  status: 'passed' | 'failed' | 'running' | 'pending';
  duration?: number;
  error?: string;
  details?: {
    action: string;
    expected: string;
    actual: string;
    passed: boolean;
  }[];
}

// Predefined test cases for the To-Do List app
const predefinedTestCases: TestCase[] = [
  {
    id: "test-1",
    title: "Add Task Test",
    description: "Verifies that tasks can be added to the list",
    actions: [
      { type: "addTask", value: "Buy groceries" },
      { type: "verifyTaskExists", value: "Buy groceries", expectedResult: "true" },
      { type: "verifyTaskCount", expectedResult: "1" }
    ]
  },
  {
    id: "test-2",
    title: "Complete Task Test",
    description: "Verifies that tasks can be marked as completed",
    actions: [
      { type: "addTask", value: "Clean house" },
      { type: "completeTask", value: "Clean house" },
      { type: "verifyTaskCompleted", value: "Clean house", expectedResult: "true" }
    ]
  },
  {
    id: "test-3",
    title: "Delete Task Test",
    description: "Verifies that tasks can be deleted",
    actions: [
      { type: "addTask", value: "Pay bills" },
      { type: "deleteTask", value: "Pay bills" },
      { type: "verifyTaskExists", value: "Pay bills", expectedResult: "false" },
      { type: "verifyTaskCount", expectedResult: "0" }
    ]
  },
  {
    id: "test-4",
    title: "Filter Tasks Test",
    description: "Verifies that tasks can be filtered by completion status",
    actions: [
      { type: "addTask", value: "Task 1" },
      { type: "addTask", value: "Task 2" },
      { type: "completeTask", value: "Task 1" },
      { type: "filterTasks", value: "completed" },
      { type: "verifyTaskCount", expectedResult: "1" },
      { type: "verifyFilterActive", value: "completed", expectedResult: "true" }
    ]
  },
  {
    id: "test-5",
    title: "Empty Task Validation Test",
    description: "Verifies that empty tasks cannot be added",
    actions: [
      { type: "addTask", value: "" },
      { type: "verifyTaskCount", expectedResult: "0" }
    ]
  }
];

const TestRunner: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("predefined");

  // Function to run all predefined tests
  const runAllTests = () => {
    if (isRunning) return;

    setIsRunning(true);
    setProgress(0);

    // Initialize all tests as pending
    const initialResults = predefinedTestCases.map(testCase => ({
      id: testCase.id,
      title: testCase.title,
      status: 'pending' as const
    }));

    setResults(initialResults);

    // Simulate test execution with delays
    let completedTests = 0;

    predefinedTestCases.forEach((testCase, index) => {
      // Set test to running status
      setTimeout(() => {
        setResults(prev =>
          prev.map(result =>
            result.id === testCase.id
              ? { ...result, status: 'running' }
              : result
          )
        );
      }, index * 1000);

      // Simulate executing the test actions
      setTimeout(() => {
        // In a real implementation, this would execute the actions against the Demo App
        // For now, we'll simulate the results
        const details = testCase.actions.map(action => {
          const passed = Math.random() > 0.2; // 80% chance to pass

          return {
            action: getActionDescription(action),
            expected: action.expectedResult || "Success",
            actual: passed ? action.expectedResult || "Success" : "Failed",
            passed
          };
        });

        const allPassed = details.every(detail => detail.passed);
        const duration = Math.floor(Math.random() * 1000) + 200; // 200-1200ms

        setResults(prev =>
          prev.map(result =>
            result.id === testCase.id
              ? {
                  ...result,
                  status: allPassed ? 'passed' : 'failed',
                  duration,
                  details,
                  error: allPassed ? undefined : `Test failed: ${details.find(d => !d.passed)?.action}`
                }
              : result
          )
        );

        completedTests++;
        setProgress((completedTests / predefinedTestCases.length) * 100);

        // Check if all tests are completed
        if (completedTests === predefinedTestCases.length) {
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

    // Find the test case
    const testCase = predefinedTestCases.find(t => t.id === testId);
    if (!testCase) return;

    // Initialize test as running
    setResults([{
      id: testCase.id,
      title: testCase.title,
      status: 'running'
    }]);

    // Simulate test execution
    setProgress(30);

    // Simulate executing the test actions
    setTimeout(() => {
      setProgress(60);

      // In a real implementation, this would execute the actions against the Demo App
      // For now, we'll simulate the results
      const details = testCase.actions.map(action => {
        const passed = Math.random() > 0.2; // 80% chance to pass

        return {
          action: getActionDescription(action),
          expected: action.expectedResult || "Success",
          actual: passed ? action.expectedResult || "Success" : "Failed",
          passed
        };
      });

      const allPassed = details.every(detail => detail.passed);
      const duration = Math.floor(Math.random() * 1000) + 200; // 200-1200ms

      setResults([{
        id: testCase.id,
        title: testCase.title,
        status: allPassed ? 'passed' : 'failed',
        duration,
        details,
        error: allPassed ? undefined : `Test failed: ${details.find(d => !d.passed)?.action}`
      }]);

      setProgress(100);
      setIsRunning(false);
      toast.success('Test completed!');
    }, 1500);
  };

  // Function to get a human-readable description of a test action
  const getActionDescription = (action: TestAction): string => {
    switch (action.type) {
      case 'addTask':
        return `Add task "${action.value}"`;
      case 'completeTask':
        return `Mark task "${action.value}" as completed`;
      case 'deleteTask':
        return `Delete task "${action.value}"`;
      case 'filterTasks':
        return `Filter tasks by "${action.value}"`;
      case 'verifyTaskExists':
        return `Verify task "${action.value}" exists`;
      case 'verifyTaskCompleted':
        return `Verify task "${action.value}" is completed`;
      case 'verifyTaskCount':
        return `Verify task count is ${action.expectedResult}`;
      case 'verifyFilterActive':
        return `Verify "${action.value}" filter is active`;
      default:
        return `Unknown action`;
    }
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
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Play className="h-5 w-5 mr-2 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">Test Runner</h2>
        </div>
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

      {/* Test Controls */}
      <div className="mb-4 flex gap-2">
        <MotionButton
          onClick={runAllTests}
          disabled={isRunning}
          className="bg-blue-500 hover:bg-blue-600 text-white flex-1"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Zap className="h-4 w-4 mr-2" />
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

      {/* Test Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start bg-white border border-gray-200 p-1 rounded-lg shadow-sm overflow-x-auto">
          <TabsTrigger
            value="predefined"
            className="data-[state=active]:shadow-sm flex items-center data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
          >
            <LayoutList className="h-4 w-4 mr-2" />
            Predefined Tests
          </TabsTrigger>
          <TabsTrigger
            value="automation"
            className="data-[state=active]:shadow-sm flex items-center data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700"
          >
            <Code className="h-4 w-4 mr-2" />
            Automation Scripts
          </TabsTrigger>
        </TabsList>

        {/* Predefined Tests Tab */}
        <TabsContent value="predefined" className="mt-4">
          <ScrollArea className="h-[480px] pr-4">
            <div className="space-y-3">
              {predefinedTestCases.map((testCase) => {
                const result = results.find(r => r.id === testCase.id);

                return (
                  <motion.div
                    key={testCase.id}
                    className={`p-4 border rounded-lg ${
                      selectedTest === testCase.id ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-white'
                    } hover:border-blue-300 transition-colors cursor-pointer`}
                    onClick={() => !isRunning && runSingleTest(testCase.id)}
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{testCase.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{testCase.description}</p>
                        <div className="flex items-center mt-2">
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            {testCase.actions.length} steps
                          </Badge>
                          {testCase.actions.some(a => a.type.startsWith('verify')) && (
                            <Badge className="ml-2 bg-amber-100 text-amber-800 border-amber-200">
                              <Target className="h-3 w-3 mr-1" />
                              Assertions
                            </Badge>
                          )}
                        </div>
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

                    {/* Test details for completed tests */}
                    {result?.details && (result.status === 'passed' || result.status === 'failed') && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <h5 className="text-xs font-medium text-gray-700 mb-2">Test Steps:</h5>
                        <div className="space-y-1">
                          {result.details.map((detail, index) => (
                            <div
                              key={index}
                              className={`text-xs p-1.5 rounded ${
                                detail.passed ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                              }`}
                            >
                              <div className="flex items-start">
                                {detail.passed ? (
                                  <CheckCircle2 className="h-3.5 w-3.5 mr-1 mt-0.5 text-green-500 flex-shrink-0" />
                                ) : (
                                  <XCircle className="h-3.5 w-3.5 mr-1 mt-0.5 text-red-500 flex-shrink-0" />
                                )}
                                <div>
                                  <span>{detail.action}</span>
                                  {!detail.passed && (
                                    <div className="mt-1 text-xs">
                                      <div>Expected: {detail.expected}</div>
                                      <div>Actual: {detail.actual}</div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Run single test button */}
                    {!isRunning && (
                      <div className="mt-3 flex justify-end">
                        <MotionButton
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            runSingleTest(testCase.id);
                          }}
                          className="bg-blue-500 hover:bg-blue-600 text-white text-xs"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Play className="h-3.5 w-3.5 mr-1" />
                          Run Test
                        </MotionButton>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Automation Scripts Tab */}
        <TabsContent value="automation" className="mt-4">
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-2">
              {automationScripts.map((script) => {
                return (
                  <motion.div
                    key={script.id}
                    className="p-3 border rounded-lg border-gray-200 bg-white hover:border-purple-300 transition-colors"
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{script.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">{script.framework} • {script.language}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                          <Code className="h-3 w-3 mr-1" />
                          Script
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Test Summary */}
      {results.length > 0 && !isRunning && (
        <Card className="border border-gray-200 shadow-sm mt-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <FileText className="h-4 w-4 mr-2 text-gray-600" />
              Test Results Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-gray-800">{results.length}</div>
                <div className="text-xs text-gray-500">Total Tests</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">
                  {results.filter(r => r.status === 'passed').length}
                </div>
                <div className="text-xs text-green-600">Passed</div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-600">
                  {results.filter(r => r.status === 'failed').length}
                </div>
                <div className="text-xs text-red-600">Failed</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {results.reduce((acc, curr) => acc + (curr.duration || 0), 0) / 1000}s
                </div>
                <div className="text-xs text-blue-600">Total Time</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TestRunner;
