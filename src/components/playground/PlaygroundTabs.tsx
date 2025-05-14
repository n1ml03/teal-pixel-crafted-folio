import React, { lazy, Suspense, useState } from 'react';
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
  FileCheck,
  HelpCircle
} from 'lucide-react';
import { testCases, bugReports, automationScripts } from '@/data/testing-playground';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
const TestBuilder = lazy(() => import('./TestBuilder'));
const BugComparison = lazy(() => import('./BugComparison'));
const TestReportGenerator = lazy(() => import('./TestReportGenerator'));

// Tab tooltip content
interface TabInfo {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  category: 'documentation' | 'automation' | 'tools';
}

const PlaygroundTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("test-cases");

  // Tab information with tooltips and categories
  const tabInfo: TabInfo[] = [
    // Documentation category
    {
      id: "test-cases",
      title: "Test Cases",
      icon: <ListChecks className="h-4 w-4 mr-2" />,
      description: "View sample test cases for the To-Do application",
      category: "documentation"
    },
    {
      id: "bug-reports",
      title: "Bug Reports",
      icon: <Bug className="h-4 w-4 mr-2" />,
      description: "Explore bug reports with detailed steps to reproduce",
      category: "documentation"
    },
    {
      id: "hints",
      title: "Fixed Bugs",
      icon: <Lightbulb className="h-4 w-4 mr-2" />,
      description: "See what bugs were fixed in the application",
      category: "documentation"
    },

    // Automation category
    {
      id: "automation",
      title: "Automation",
      icon: <FileCode className="h-4 w-4 mr-2" />,
      description: "View automation scripts for testing the application",
      category: "automation"
    },
    {
      id: "test-runner",
      title: "Test Runner",
      icon: <Play className="h-4 w-4 mr-2" />,
      description: "Run automated tests and view results",
      category: "automation"
    },

    // Tools category
    {
      id: "test-builder",
      title: "Test Builder",
      icon: <FileText className="h-4 w-4 mr-2" />,
      description: "Create your own test cases interactively",
      category: "tools"
    },
    {
      id: "bug-comparison",
      title: "Bug Comparison",
      icon: <Diff className="h-4 w-4 mr-2" />,
      description: "Compare code before and after bug fixes",
      category: "tools"
    },
    {
      id: "report-generator",
      title: "Report Generator",
      icon: <FileCheck className="h-4 w-4 mr-2" />,
      description: "Generate test reports from test results",
      category: "tools"
    }
  ];

  // Get tabs by category
  const getTabsByCategory = (category: TabInfo['category']) => {
    return tabInfo.filter(tab => tab.category === category);
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <Tabs defaultValue="test-cases" className="w-full" onValueChange={handleTabChange}>
      <div className="mb-6">
        {/* Category labels */}
        <div className="flex flex-wrap gap-4 mb-3 text-sm text-gray-500">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
            Documentation
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
            Automation
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-teal-500 mr-2"></div>
            Tools
          </div>
          <div className="flex items-center ml-auto">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <HelpCircle className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p className="text-sm max-w-xs">
                    Click on any tab to explore different aspects of QA testing.
                    Hover over tabs for more information.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Tab navigation with tooltips */}
        <TabsList className="w-full justify-start bg-white border border-gray-200 p-1 rounded-lg shadow-sm overflow-x-auto">
          {/* Documentation tabs */}
          {getTabsByCategory('documentation').map((tab) => (
            <TooltipProvider key={tab.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger
                    value={tab.id}
                    className={`data-[state=active]:shadow-sm flex items-center ${
                      tab.category === 'documentation'
                        ? 'data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 border-r border-gray-100'
                        : tab.category === 'automation'
                        ? 'data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 border-r border-gray-100'
                        : 'data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700'
                    }`}
                  >
                    {tab.icon}
                    {tab.title}
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <p>{tab.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}

          {/* Divider */}
          <div className="h-8 border-r border-gray-200 mx-1"></div>

          {/* Automation tabs */}
          {getTabsByCategory('automation').map((tab) => (
            <TooltipProvider key={tab.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger
                    value={tab.id}
                    className={`data-[state=active]:shadow-sm flex items-center ${
                      tab.category === 'documentation'
                        ? 'data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700'
                        : tab.category === 'automation'
                        ? 'data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 border-r border-gray-100'
                        : 'data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700'
                    }`}
                  >
                    {tab.icon}
                    {tab.title}
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <p>{tab.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}

          {/* Divider */}
          <div className="h-8 border-r border-gray-200 mx-1"></div>

          {/* Tools tabs */}
          {getTabsByCategory('tools').map((tab) => (
            <TooltipProvider key={tab.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger
                    value={tab.id}
                    className={`data-[state=active]:shadow-sm flex items-center ${
                      tab.category === 'documentation'
                        ? 'data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700'
                        : tab.category === 'automation'
                        ? 'data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700'
                        : 'data-[state=active]:bg-teal-50 data-[state=active]:text-teal-700'
                    }`}
                  >
                    {tab.icon}
                    {tab.title}
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <p>{tab.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </TabsList>
      </div>

      {/* Tab content with descriptions */}
      {tabInfo.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="mt-0">
          {/* Tab header with description */}
          <div className={`mb-6 p-4 rounded-lg border ${
            tab.category === 'documentation'
              ? 'bg-blue-50/50 border-blue-100'
              : tab.category === 'automation'
              ? 'bg-purple-50/50 border-purple-100'
              : 'bg-teal-50/50 border-teal-100'
          }`}>
            <div className="flex items-start">
              <div className={`p-2 rounded-full mr-3 flex-shrink-0 ${
                tab.category === 'documentation'
                  ? 'bg-blue-100 text-blue-700'
                  : tab.category === 'automation'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-teal-100 text-teal-700'
              }`}>
                {tab.icon}
              </div>
              <div>
                <h3 className={`font-medium text-lg mb-1 ${
                  tab.category === 'documentation'
                    ? 'text-blue-800'
                    : tab.category === 'automation'
                    ? 'text-purple-800'
                    : 'text-teal-800'
                }`}>
                  {tab.title}
                </h3>
                <p className={`${
                  tab.category === 'documentation'
                    ? 'text-blue-700'
                    : tab.category === 'automation'
                    ? 'text-purple-700'
                    : 'text-teal-700'
                }`}>
                  {tab.description}
                </p>
              </div>
              <div className="ml-auto">
                <Badge className={`${
                  tab.category === 'documentation'
                    ? 'bg-blue-100 text-blue-800 border-blue-200'
                    : tab.category === 'automation'
                    ? 'bg-purple-100 text-purple-800 border-purple-200'
                    : 'bg-teal-100 text-teal-800 border-teal-200'
                }`}>
                  {tab.category.charAt(0).toUpperCase() + tab.category.slice(1)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Tab content */}
          <Suspense fallback={<TabContentSkeleton />}>
            {tab.id === "test-cases" && <TestCasesPanel testCases={testCases} />}
            {tab.id === "bug-reports" && <BugReportsPanel bugReports={bugReports} />}
            {tab.id === "automation" && <AutomationPanel automationScripts={automationScripts} />}
            {tab.id === "test-runner" && <TestRunner />}
            {tab.id === "test-builder" && <TestBuilder />}
            {tab.id === "bug-comparison" && <BugComparison />}
            {tab.id === "report-generator" && <TestReportGenerator />}
            {tab.id === "hints" && (
              <div className="space-y-4">
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
            )}
          </Suspense>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default PlaygroundTabs;
