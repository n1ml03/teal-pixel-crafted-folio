import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MotionButton } from "@/components/ui/motion-button";
import { toast } from "@/components/ui/sonner";
import { 
  FileText, 
  Download, 
  Printer,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  PieChart,
  Calendar,
  User,
  FileCheck
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { testCases, bugReports } from '@/data/testing-playground';

interface ReportSettings {
  title: string;
  tester: string;
  date: string;
  summary: string;
  includeTestCases: boolean;
  includeBugReports: boolean;
  includeCharts: boolean;
  includeScreenshots: boolean;
}

const TestReportGenerator: React.FC = () => {
  const [settings, setSettings] = useState<ReportSettings>({
    title: 'To-Do List Application Test Report',
    tester: 'Nam Le',
    date: new Date().toISOString().split('T')[0],
    summary: 'This report summarizes the testing activities performed on the To-Do List application, including test results and bug reports.',
    includeTestCases: true,
    includeBugReports: true,
    includeCharts: true,
    includeScreenshots: false
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  
  // Function to handle settings change
  const handleSettingChange = (key: keyof ReportSettings, value: string | boolean) => {
    setSettings({
      ...settings,
      [key]: value
    });
  };
  
  // Function to generate report
  const generateReport = () => {
    if (!settings.title || !settings.tester || !settings.date) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      setReportGenerated(true);
      toast.success('Test report generated successfully!');
    }, 1500);
  };
  
  // Function to download report
  const downloadReport = () => {
    toast.success('Report downloaded successfully!');
  };
  
  // Function to print report
  const printReport = () => {
    toast.success('Report sent to printer!');
  };
  
  // Calculate test metrics
  const passedTests = testCases.filter(tc => tc.status === 'Passed').length;
  const failedTests = testCases.filter(tc => tc.status === 'Failed').length;
  const blockedTests = testCases.filter(tc => tc.status === 'Blocked').length;
  const notRunTests = testCases.filter(tc => tc.status === 'Not Run').length;
  const totalTests = testCases.length;
  
  const passRate = Math.round((passedTests / totalTests) * 100);
  
  // Calculate bug metrics
  const criticalBugs = bugReports.filter(bug => bug.severity === 'Critical').length;
  const majorBugs = bugReports.filter(bug => bug.severity === 'Major').length;
  const minorBugs = bugReports.filter(bug => bug.severity === 'Minor').length;
  const trivialBugs = bugReports.filter(bug => bug.severity === 'Trivial').length;
  const totalBugs = bugReports.length;
  
  const openBugs = bugReports.filter(bug => bug.status === 'Open').length;
  const fixedBugs = bugReports.filter(bug => bug.status === 'Fixed').length;
  
  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <FileCheck className="h-5 w-5 mr-2 text-teal-600" />
          Test Report Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Report Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Report Settings</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Report Title <span className="text-red-500">*</span>
              </label>
              <Input
                value={settings.title}
                onChange={(e) => handleSettingChange('title', e.target.value)}
                placeholder="Enter report title"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tester Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={settings.tester}
                  onChange={(e) => handleSettingChange('tester', e.target.value)}
                  placeholder="Enter tester name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={settings.date}
                  onChange={(e) => handleSettingChange('date', e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Summary
              </label>
              <Textarea
                value={settings.summary}
                onChange={(e) => handleSettingChange('summary', e.target.value)}
                placeholder="Enter report summary"
                rows={3}
              />
            </div>
            
            <div className="space-y-2 pt-2">
              <h4 className="text-sm font-medium text-gray-700">Include in Report:</h4>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-test-cases"
                  checked={settings.includeTestCases}
                  onCheckedChange={(checked) => handleSettingChange('includeTestCases', checked as boolean)}
                />
                <Label htmlFor="include-test-cases">Test Cases</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-bug-reports"
                  checked={settings.includeBugReports}
                  onCheckedChange={(checked) => handleSettingChange('includeBugReports', checked as boolean)}
                />
                <Label htmlFor="include-bug-reports">Bug Reports</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-charts"
                  checked={settings.includeCharts}
                  onCheckedChange={(checked) => handleSettingChange('includeCharts', checked as boolean)}
                />
                <Label htmlFor="include-charts">Charts & Metrics</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-screenshots"
                  checked={settings.includeScreenshots}
                  onCheckedChange={(checked) => handleSettingChange('includeScreenshots', checked as boolean)}
                />
                <Label htmlFor="include-screenshots">Screenshots</Label>
              </div>
            </div>
            
            <div className="pt-2">
              <MotionButton
                onClick={generateReport}
                disabled={isGenerating}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isGenerating ? (
                  <>
                    <FileText className="h-4 w-4 mr-2 animate-pulse" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </>
                )}
              </MotionButton>
            </div>
          </div>
          
          {/* Report Preview */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-gray-700">Report Preview</h3>
              
              {reportGenerated && (
                <div className="flex gap-2">
                  <MotionButton
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    onClick={downloadReport}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Download className="h-3.5 w-3.5 mr-1" />
                    Download
                  </MotionButton>
                  
                  <MotionButton
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    onClick={printReport}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Printer className="h-3.5 w-3.5 mr-1" />
                    Print
                  </MotionButton>
                </div>
              )}
            </div>
            
            {!reportGenerated ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center h-[500px] flex flex-col items-center justify-center">
                <FileText className="h-12 w-12 text-gray-400 mb-3" />
                <p className="text-gray-500 font-medium">No report generated yet</p>
                <p className="text-sm text-gray-400 mt-1 max-w-xs">
                  Configure your report settings and click "Generate Report" to see a preview
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[500px] border border-gray-200 rounded-lg bg-white shadow-sm">
                <div className="p-6">
                  <div className="text-center mb-6 pb-4 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-800">{settings.title}</h1>
                    
                    <div className="flex justify-center gap-4 mt-3 text-sm text-gray-600">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1 text-gray-500" />
                        {settings.tester}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                        {new Date(settings.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  {settings.summary && (
                    <div className="mb-6">
                      <h2 className="text-lg font-bold text-gray-800 mb-2">Executive Summary</h2>
                      <p className="text-gray-600">{settings.summary}</p>
                    </div>
                  )}
                  
                  {settings.includeCharts && (
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
                  )}
                  
                  {settings.includeTestCases && (
                    <div className="mb-6">
                      <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                        <CheckCircle2 className="h-5 w-5 mr-2 text-teal-600" />
                        Test Cases
                      </h2>
                      
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-50 text-left">
                            <th className="p-2 border border-gray-200 text-sm font-medium text-gray-700">ID</th>
                            <th className="p-2 border border-gray-200 text-sm font-medium text-gray-700">Title</th>
                            <th className="p-2 border border-gray-200 text-sm font-medium text-gray-700">Priority</th>
                            <th className="p-2 border border-gray-200 text-sm font-medium text-gray-700">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {testCases.map((testCase) => (
                            <tr key={testCase.id} className="hover:bg-gray-50">
                              <td className="p-2 border border-gray-200 text-sm text-gray-600 font-mono">{testCase.id}</td>
                              <td className="p-2 border border-gray-200 text-sm text-gray-800">{testCase.title}</td>
                              <td className="p-2 border border-gray-200">
                                <Badge className={`
                                  ${testCase.priority === 'High' ? 'bg-purple-100 text-purple-800' : 
                                    testCase.priority === 'Medium' ? 'bg-blue-100 text-blue-800' : 
                                    'bg-gray-100 text-gray-800'}
                                `}>
                                  {testCase.priority}
                                </Badge>
                              </td>
                              <td className="p-2 border border-gray-200">
                                <Badge className={`
                                  ${testCase.status === 'Passed' ? 'bg-green-100 text-green-800' : 
                                    testCase.status === 'Failed' ? 'bg-red-100 text-red-800' : 
                                    testCase.status === 'Blocked' ? 'bg-amber-100 text-amber-800' : 
                                    'bg-gray-100 text-gray-800'}
                                `}>
                                  {testCase.status}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  
                  {settings.includeBugReports && (
                    <div className="mb-6">
                      <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                        <AlertCircle className="h-5 w-5 mr-2 text-teal-600" />
                        Bug Reports
                      </h2>
                      
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-50 text-left">
                            <th className="p-2 border border-gray-200 text-sm font-medium text-gray-700">ID</th>
                            <th className="p-2 border border-gray-200 text-sm font-medium text-gray-700">Title</th>
                            <th className="p-2 border border-gray-200 text-sm font-medium text-gray-700">Severity</th>
                            <th className="p-2 border border-gray-200 text-sm font-medium text-gray-700">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bugReports.map((bug) => (
                            <tr key={bug.id} className="hover:bg-gray-50">
                              <td className="p-2 border border-gray-200 text-sm text-gray-600 font-mono">{bug.id}</td>
                              <td className="p-2 border border-gray-200 text-sm text-gray-800">{bug.title}</td>
                              <td className="p-2 border border-gray-200">
                                <Badge className={`
                                  ${bug.severity === 'Critical' ? 'bg-red-100 text-red-800' : 
                                    bug.severity === 'Major' ? 'bg-orange-100 text-orange-800' : 
                                    bug.severity === 'Minor' ? 'bg-yellow-100 text-yellow-800' : 
                                    'bg-blue-100 text-blue-800'}
                                `}>
                                  {bug.severity}
                                </Badge>
                              </td>
                              <td className="p-2 border border-gray-200">
                                <Badge className={`
                                  ${bug.status === 'Open' ? 'bg-purple-100 text-purple-800' : 
                                    bug.status === 'Fixed' ? 'bg-green-100 text-green-800' : 
                                    bug.status === 'Verified' ? 'bg-teal-100 text-teal-800' : 
                                    'bg-gray-100 text-gray-800'}
                                `}>
                                  {bug.status}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestReportGenerator;
