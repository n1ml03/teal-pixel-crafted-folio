import React, { lazy, Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from 'framer-motion';
import {
  ListChecks,
  Bug,
  FileCode,
  Lightbulb,
  Play,
  FileText,
  Diff,
  FileCheck
} from 'lucide-react';
import { testCases, bugReports, automationScripts } from '@/data/testing-playground';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Skeleton component for tab content loading state
const TabContentSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="flex items-center mb-4">
      <Skeleton className="h-5 w-5 mr-2 rounded-full" />
      <Skeleton className="h-6 w-48 rounded-md" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <Skeleton className="h-4 w-12 mr-2 rounded-md" />
                <Skeleton className="h-5 w-32 rounded-md" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-3/4 rounded-md" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

// Lazy load heavy components
const TestCasesPanel = lazy(() => import('./TestCasesPanel'));
const BugReportsPanel = lazy(() => import('./BugReportsPanel'));
const AutomationPanel = lazy(() => import('./AutomationPanel'));
const TestRunner = lazy(() => import('./TestRunner'));
const TestCaseBuilder = lazy(() => import('./TestCaseBuilder'));
const BugComparison = lazy(() => import('./BugComparison'));
const TestReportGenerator = lazy(() => import('./TestReportGenerator'));

const PlaygroundTabs: React.FC = () => {
  return (
    <Tabs defaultValue="test-cases" className="w-full">
      <TabsList className="w-full justify-start mb-6 bg-white border border-gray-200 p-1 rounded-lg shadow-sm overflow-x-auto">
        <TabsTrigger
          value="test-cases"
          className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 data-[state=active]:shadow-sm flex items-center"
        >
          <ListChecks className="h-4 w-4 mr-2" />
          Test Cases
        </TabsTrigger>
        <TabsTrigger
          value="bug-reports"
          className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 data-[state=active]:shadow-sm flex items-center"
        >
          <Bug className="h-4 w-4 mr-2" />
          Bug Reports
        </TabsTrigger>
        <TabsTrigger
          value="automation"
          className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 data-[state=active]:shadow-sm flex items-center"
        >
          <FileCode className="h-4 w-4 mr-2" />
          Automation
        </TabsTrigger>
        <TabsTrigger
          value="test-runner"
          className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 data-[state=active]:shadow-sm flex items-center"
        >
          <Play className="h-4 w-4 mr-2" />
          Test Runner
        </TabsTrigger>
        <TabsTrigger
          value="test-builder"
          className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 data-[state=active]:shadow-sm flex items-center"
        >
          <FileText className="h-4 w-4 mr-2" />
          Test Builder
        </TabsTrigger>
        <TabsTrigger
          value="bug-comparison"
          className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 data-[state=active]:shadow-sm flex items-center"
        >
          <Diff className="h-4 w-4 mr-2" />
          Bug Comparison
        </TabsTrigger>
        <TabsTrigger
          value="report-generator"
          className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 data-[state=active]:shadow-sm flex items-center"
        >
          <FileCheck className="h-4 w-4 mr-2" />
          Report Generator
        </TabsTrigger>
        <TabsTrigger
          value="hints"
          className="data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700 data-[state=active]:shadow-sm flex items-center"
        >
          <Lightbulb className="h-4 w-4 mr-2" />
          Fixed Bugs
        </TabsTrigger>
      </TabsList>

      <TabsContent value="test-cases" className="mt-0">
        <Suspense fallback={<TabContentSkeleton />}>
          <TestCasesPanel testCases={testCases} />
        </Suspense>
      </TabsContent>

      <TabsContent value="bug-reports" className="mt-0">
        <Suspense fallback={<TabContentSkeleton />}>
          <BugReportsPanel bugReports={bugReports} />
        </Suspense>
      </TabsContent>

      <TabsContent value="automation" className="mt-0">
        <Suspense fallback={<TabContentSkeleton />}>
          <AutomationPanel automationScripts={automationScripts} />
        </Suspense>
      </TabsContent>

      <TabsContent value="test-runner" className="mt-0">
        <Suspense fallback={<TabContentSkeleton />}>
          <TestRunner />
        </Suspense>
      </TabsContent>

      <TabsContent value="test-builder" className="mt-0">
        <Suspense fallback={<TabContentSkeleton />}>
          <TestCaseBuilder />
        </Suspense>
      </TabsContent>

      <TabsContent value="bug-comparison" className="mt-0">
        <Suspense fallback={<TabContentSkeleton />}>
          <BugComparison />
        </Suspense>
      </TabsContent>

      <TabsContent value="report-generator" className="mt-0">
        <Suspense fallback={<TabContentSkeleton />}>
          <TestReportGenerator />
        </Suspense>
      </TabsContent>

      <TabsContent value="hints" className="mt-0">
        <div className="space-y-4">
          <div className="flex items-center mb-4">
            <Lightbulb className="h-5 w-5 mr-2 text-teal-600" />
            <h2 className="text-xl font-bold text-gray-800">Fixed Bugs & Testing Tips</h2>
          </div>

          <Card className="border border-green-200 bg-green-50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-green-800">
                All Bugs Fixed!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700 mb-4">
                All bugs in the To-Do List app have been fixed! Here's what was fixed:
              </p>

              <ul className="space-y-3">
                <motion.li
                  className="flex items-start bg-white p-3 rounded-lg border border-green-200 shadow-sm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Badge className="mt-0.5 mr-3 bg-green-100 text-green-800 border-green-200">
                    Bug #1
                  </Badge>
                  <div>
                    <p className="font-medium text-gray-800">Completed tasks now show strikethrough styling</p>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Fix:</span> Added line-through and text-gray-400 classes to completed tasks
                    </p>
                  </div>
                </motion.li>

                <motion.li
                  className="flex items-start bg-white p-3 rounded-lg border border-green-200 shadow-sm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Badge className="mt-0.5 mr-3 bg-green-100 text-green-800 border-green-200">
                    Bug #2
                  </Badge>
                  <div>
                    <p className="font-medium text-gray-800">Task counter now shows correct count</p>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Fix:</span> Fixed the task counter to properly update after deletion
                    </p>
                  </div>
                </motion.li>

                <motion.li
                  className="flex items-start bg-white p-3 rounded-lg border border-green-200 shadow-sm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Badge className="mt-0.5 mr-3 bg-green-100 text-green-800 border-green-200">
                    Bug #3
                  </Badge>
                  <div>
                    <p className="font-medium text-gray-800">Empty tasks cannot be added</p>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Fix:</span> Added proper validation to prevent empty tasks from being added
                    </p>
                  </div>
                </motion.li>

                <motion.li
                  className="flex items-start bg-white p-3 rounded-lg border border-green-200 shadow-sm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Badge className="mt-0.5 mr-3 bg-green-100 text-green-800 border-green-200">
                    Bug #4
                  </Badge>
                  <div>
                    <p className="font-medium text-gray-800">Filter buttons now highlight when selected</p>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Fix:</span> Added proper styling to highlight the active filter button
                    </p>
                  </div>
                </motion.li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border border-teal-200 bg-teal-50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-teal-800">
                QA Testing Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-teal-700 mb-4">
                Here are some general tips for effective testing:
              </p>

              <ul className="space-y-2 pl-5 list-disc text-teal-700">
                <li>Start with positive test cases before exploring edge cases</li>
                <li>Pay attention to validation messages and error handling</li>
                <li>Test with different input types (empty, special characters, very long text)</li>
                <li>Check if the UI updates correctly after each action</li>
                <li>Verify that counters and status indicators are accurate</li>
                <li>Test keyboard shortcuts and accessibility features</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default PlaygroundTabs;
