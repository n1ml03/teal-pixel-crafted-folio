import React, { useState, lazy, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
// No toast import needed
import {
  Play,
  Bug,
  FileText,
  ListChecks,
  Code,
  Diff
} from 'lucide-react';

// Lazy load components to improve performance
const DemoApp = lazy(() => import('./DemoApp'));
const TestBuilder = lazy(() => import('./TestBuilder'));
const BugTracker = lazy(() => import('./BugTracker'));
const TestRunner = lazy(() => import('./TestRunner'));
const BugComparison = lazy(() => import('./BugComparison'));
const TestReportGenerator = lazy(() => import('./TestReportGenerator'));

// Define the available tools
interface Tool {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  component: React.ReactNode;
}

const IntegratedTestingEnvironment: React.FC = () => {
  // State for the active tool
  const [activeTool, setActiveTool] = useState<string>("test-runner");

  // Define the available tools
  const tools: Tool[] = [
    {
      id: "test-runner",
      name: "Test Runner",
      icon: <Play className="h-4 w-4 mr-2" />,
      description: "Run automated tests against the interactive application",
      component: <TestRunner />
    },
    {
      id: "test-builder",
      name: "Test Builder",
      icon: <ListChecks className="h-4 w-4 mr-2" />,
      description: "Create and manage test cases for the interactive application",
      component: <TestBuilder />
    },
    {
      id: "bug-tracker",
      name: "Bug Tracker",
      icon: <Bug className="h-4 w-4 mr-2" />,
      description: "Document and track bugs discovered during testing",
      component: <BugTracker />
    },
    {
      id: "bug-comparison",
      name: "Bug Comparison",
      icon: <Diff className="h-4 w-4 mr-2" />,
      description: "Compare bugs before and after fixes",
      component: <BugComparison />
    },
    {
      id: "report-generator",
      name: "Report Generator",
      icon: <FileText className="h-4 w-4 mr-2" />,
      description: "Generate comprehensive test reports",
      component: <TestReportGenerator />
    }
  ];

  // No reset function needed

  return (
    <div className="grid grid-cols-1 gap-10 w-full max-w-full overflow-visible">
      {/* Demo Application Panel - Positioned above Testing Tools */}
      <div>
        <Card className="border border-gray-200 shadow-md">
          <CardContent className="p-0">
            <Suspense fallback={
              <div className="flex flex-col space-y-3 p-6 bg-gray-50/50 animate-pulse">
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-32 w-full rounded-lg" />
                <Skeleton className="h-8 w-1/3 rounded-lg" />
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-24 rounded-lg" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-6 w-16 rounded-lg" />
                    <Skeleton className="h-6 w-16 rounded-lg" />
                    <Skeleton className="h-6 w-16 rounded-lg" />
                  </div>
                </div>
              </div>
            }>
              <DemoApp />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      {/* Testing Tools Panel - Positioned below Demo Application */}
      <div>
        <Card className="border border-gray-200 shadow-md overflow-visible">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-bold flex items-center">
                Testing Tools
              </CardTitle>
            </div>
          </CardHeader>
        <CardContent className="p-0 pt-2">
          <Tabs value={activeTool} onValueChange={setActiveTool} className="w-full overflow-visible">
            <TabsList className="w-full justify-start bg-white border border-gray-200 p-2 mb-2 rounded-lg shadow-sm overflow-x-auto">
              {tools.map((tool) => (
                <TabsTrigger
                  key={tool.id}
                  value={tool.id}
                  className="data-[state=active]:shadow-sm flex items-center data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 px-4 py-2 rounded-md"
                >
                  {tool.icon}
                  {tool.name}
                </TabsTrigger>
              ))}
            </TabsList>

            <ScrollArea className="h-[calc(160vh-300px)] min-h-[500px] p-6 overflow-visible">
              {tools.map((tool) => (
                <TabsContent key={tool.id} value={tool.id} className="mt-0 px-6 pt-6 pb-16 overflow-visible">
                  <Suspense fallback={
                    <div className="flex flex-col space-y-3 animate-pulse">
                      <Skeleton className="h-8 w-1/2 rounded-lg" />
                      <Skeleton className="h-24 w-full rounded-lg" />
                      <Skeleton className="h-32 w-full rounded-lg" />
                      <div className="flex justify-end space-x-2">
                        <Skeleton className="h-8 w-24 rounded-lg" />
                        <Skeleton className="h-8 w-24 rounded-lg" />
                      </div>
                    </div>
                  }>
                    {tool.component}
                  </Suspense>
                </TabsContent>
              ))}
            </ScrollArea>
          </Tabs>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default IntegratedTestingEnvironment;
