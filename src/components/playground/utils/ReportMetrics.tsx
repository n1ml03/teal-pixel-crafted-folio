import React from 'react';
import { Badge } from "@/components/ui/badge";
import { PieChart, CheckCircle2, AlertCircle } from 'lucide-react';

interface TestMetrics {
  passedTests: number;
  failedTests: number;
  blockedTests: number;
  notRunTests: number;
  totalTests: number;
  passRate: number;
}

interface BugMetrics {
  criticalBugs: number;
  majorBugs: number;
  minorBugs: number;
  trivialBugs: number;
  totalBugs: number;
  fixedBugs: number;
  openBugs: number;
}

interface ReportMetricsProps {
  testMetrics: TestMetrics;
  bugMetrics: BugMetrics;
}

export const ReportMetrics: React.FC<ReportMetricsProps> = ({ testMetrics, bugMetrics }) => {
  const { passedTests, failedTests, blockedTests, notRunTests, passRate } = testMetrics;
  const { criticalBugs, majorBugs, minorBugs, trivialBugs, totalBugs, fixedBugs } = bugMetrics;

  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
        <PieChart className="h-5 w-5 mr-2 text-teal-600" />
        Test Metrics
      </h2>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Test Case Status</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm text-gray-600">Passed</span>
              </div>
              <span className="text-sm font-medium">{passedTests}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span className="text-sm text-gray-600">Failed</span>
              </div>
              <span className="text-sm font-medium">{failedTests}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                <span className="text-sm text-gray-600">Blocked</span>
              </div>
              <span className="text-sm font-medium">{blockedTests}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
                <span className="text-sm text-gray-600">Not Run</span>
              </div>
              <span className="text-sm font-medium">{notRunTests}</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Pass Rate:</span>
              <Badge className={`${
                passRate >= 80 ? 'bg-green-100 text-green-800' : 
                passRate >= 60 ? 'bg-amber-100 text-amber-800' : 
                'bg-red-100 text-red-800'
              }`}>
                {passRate}%
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Bug Severity</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-600 mr-2"></div>
                <span className="text-sm text-gray-600">Critical</span>
              </div>
              <span className="text-sm font-medium">{criticalBugs}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                <span className="text-sm text-gray-600">Major</span>
              </div>
              <span className="text-sm font-medium">{majorBugs}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <span className="text-sm text-gray-600">Minor</span>
              </div>
              <span className="text-sm font-medium">{minorBugs}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
                <span className="text-sm text-gray-600">Trivial</span>
              </div>
              <span className="text-sm font-medium">{trivialBugs}</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Fix Rate:</span>
              <Badge className="bg-blue-100 text-blue-800">
                {Math.round((fixedBugs / totalBugs) * 100)}%
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const calculateTestMetrics = (testCases: any[]) => {
  const passedTests = testCases.filter(tc => tc.status === 'Passed').length;
  const failedTests = testCases.filter(tc => tc.status === 'Failed').length;
  const blockedTests = testCases.filter(tc => tc.status === 'Blocked').length;
  const notRunTests = testCases.filter(tc => tc.status === 'Not Run').length;
  const totalTests = testCases.length;
  
  const passRate = Math.round((passedTests / totalTests) * 100);

  return {
    passedTests,
    failedTests,
    blockedTests,
    notRunTests,
    totalTests,
    passRate
  };
};

export const calculateBugMetrics = (bugReports: any[]) => {
  const criticalBugs = bugReports.filter(bug => bug.severity === 'Critical').length;
  const majorBugs = bugReports.filter(bug => bug.severity === 'Major').length;
  const minorBugs = bugReports.filter(bug => bug.severity === 'Minor').length;
  const trivialBugs = bugReports.filter(bug => bug.severity === 'Trivial').length;
  const totalBugs = bugReports.length;
  
  const openBugs = bugReports.filter(bug => bug.status === 'Open').length;
  const fixedBugs = bugReports.filter(bug => bug.status === 'Fixed').length;

  return {
    criticalBugs,
    majorBugs,
    minorBugs,
    trivialBugs,
    totalBugs,
    openBugs,
    fixedBugs
  };
};
