import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MotionButton } from "@/components/ui/motion-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { 
  FileText, 
  Plus, 
  Save,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TestCase } from '@/data/testing-playground';

const TestCaseBuilder: React.FC = () => {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [currentTestCase, setCurrentTestCase] = useState<Partial<TestCase>>({
    id: `TC${String(testCases.length + 1).padStart(3, '0')}`,
    title: '',
    preconditions: '',
    steps: [''],
    expectedResult: '',
    priority: 'Medium',
    status: 'Not Run'
  });
  
  // Function to add a new step
  const addStep = () => {
    if (!currentTestCase.steps) return;
    setCurrentTestCase({
      ...currentTestCase,
      steps: [...currentTestCase.steps, '']
    });
  };
  
  // Function to update a step
  const updateStep = (index: number, value: string) => {
    if (!currentTestCase.steps) return;
    const updatedSteps = [...currentTestCase.steps];
    updatedSteps[index] = value;
    setCurrentTestCase({
      ...currentTestCase,
      steps: updatedSteps
    });
  };
  
  // Function to remove a step
  const removeStep = (index: number) => {
    if (!currentTestCase.steps || currentTestCase.steps.length <= 1) return;
    const updatedSteps = [...currentTestCase.steps];
    updatedSteps.splice(index, 1);
    setCurrentTestCase({
      ...currentTestCase,
      steps: updatedSteps
    });
  };
  
  // Function to save the current test case
  const saveTestCase = () => {
    // Validate required fields
    if (!currentTestCase.title || !currentTestCase.expectedResult || 
        !currentTestCase.steps || currentTestCase.steps.some(step => !step)) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Create a new test case
    const newTestCase: TestCase = {
      id: currentTestCase.id || `TC${String(testCases.length + 1).padStart(3, '0')}`,
      title: currentTestCase.title || '',
      preconditions: currentTestCase.preconditions || '',
      steps: currentTestCase.steps || [''],
      expectedResult: currentTestCase.expectedResult || '',
      priority: currentTestCase.priority as TestCase['priority'] || 'Medium',
      status: currentTestCase.status as TestCase['status'] || 'Not Run'
    };
    
    // Add to test cases
    setTestCases([...testCases, newTestCase]);
    
    // Reset form for next test case
    setCurrentTestCase({
      id: `TC${String(testCases.length + 2).padStart(3, '0')}`,
      title: '',
      preconditions: '',
      steps: [''],
      expectedResult: '',
      priority: 'Medium',
      status: 'Not Run'
    });
    
    toast.success('Test case saved successfully!');
  };
  
  // Function to render priority badge
  const renderPriorityBadge = (priority: TestCase['priority']) => {
    switch (priority) {
      case 'High':
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200">
            P1 - High
          </Badge>
        );
      case 'Medium':
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200">
            P2 - Medium
          </Badge>
        );
      case 'Low':
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200">
            P3 - Low
          </Badge>
        );
      default:
        return null;
    }
  };
  
  // Function to render status badge
  const renderStatusBadge = (status: TestCase['status']) => {
    switch (status) {
      case 'Passed':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" /> Passed
          </Badge>
        );
      case 'Failed':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200">
            <AlertTriangle className="h-3 w-3 mr-1" /> Failed
          </Badge>
        );
      case 'Blocked':
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200">
            <Info className="h-3 w-3 mr-1" /> Blocked
          </Badge>
        );
      case 'Not Run':
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200">
            Not Run
          </Badge>
        );
      default:
        return null;
    }
  };
  
  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <FileText className="h-5 w-5 mr-2 text-teal-600" />
          Test Case Builder
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Test Case Form */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Create New Test Case</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Test Case ID
              </label>
              <Input
                value={currentTestCase.id}
                onChange={(e) => setCurrentTestCase({ ...currentTestCase, id: e.target.value })}
                placeholder="TC001"
                className="bg-gray-50"
                readOnly
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <Input
                value={currentTestCase.title}
                onChange={(e) => setCurrentTestCase({ ...currentTestCase, title: e.target.value })}
                placeholder="Enter test case title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preconditions
              </label>
              <Textarea
                value={currentTestCase.preconditions}
                onChange={(e) => setCurrentTestCase({ ...currentTestCase, preconditions: e.target.value })}
                placeholder="Enter preconditions"
                rows={2}
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Steps <span className="text-red-500">*</span>
                </label>
                <MotionButton
                  size="sm"
                  variant="outline"
                  className="text-xs"
                  onClick={addStep}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Step
                </MotionButton>
              </div>
              <div className="space-y-2">
                {currentTestCase.steps?.map((step, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm text-gray-700">
                      {index + 1}
                    </div>
                    <Input
                      value={step}
                      onChange={(e) => updateStep(index, e.target.value)}
                      placeholder={`Step ${index + 1}`}
                      className="flex-1"
                    />
                    {currentTestCase.steps && currentTestCase.steps.length > 1 && (
                      <MotionButton
                        size="sm"
                        variant="ghost"
                        className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removeStep(index)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </MotionButton>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expected Result <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={currentTestCase.expectedResult}
                onChange={(e) => setCurrentTestCase({ ...currentTestCase, expectedResult: e.target.value })}
                placeholder="Enter expected result"
                rows={2}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <Select
                  value={currentTestCase.priority}
                  onValueChange={(value) => setCurrentTestCase({ ...currentTestCase, priority: value as TestCase['priority'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <Select
                  value={currentTestCase.status}
                  onValueChange={(value) => setCurrentTestCase({ ...currentTestCase, status: value as TestCase['status'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Not Run">Not Run</SelectItem>
                    <SelectItem value="Passed">Passed</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
                    <SelectItem value="Blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="pt-2">
              <MotionButton
                onClick={saveTestCase}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Test Case
              </MotionButton>
            </div>
          </div>
          
          {/* Saved Test Cases */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Your Test Cases</h3>
            
            {testCases.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <FileText className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No test cases created yet</p>
                <p className="text-sm text-gray-400 mt-1">Create your first test case using the form</p>
              </div>
            ) : (
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-3">
                  {testCases.map((testCase) => (
                    <motion.div
                      key={testCase.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-teal-300 transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center">
                            <span className="text-xs font-mono text-gray-500 mr-2">{testCase.id}</span>
                            <h4 className="font-medium text-gray-800">{testCase.title}</h4>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {renderPriorityBadge(testCase.priority)}
                          {renderStatusBadge(testCase.status)}
                        </div>
                      </div>
                      
                      {testCase.preconditions && (
                        <div className="mb-2">
                          <p className="text-xs font-medium text-gray-700">Preconditions:</p>
                          <p className="text-xs text-gray-600">{testCase.preconditions}</p>
                        </div>
                      )}
                      
                      <div className="mb-2">
                        <p className="text-xs font-medium text-gray-700">Steps:</p>
                        <ol className="list-decimal pl-5 text-xs text-gray-600">
                          {testCase.steps.map((step, index) => (
                            <li key={index}>{step}</li>
                          ))}
                        </ol>
                      </div>
                      
                      <div>
                        <p className="text-xs font-medium text-gray-700">Expected Result:</p>
                        <p className="text-xs text-gray-600">{testCase.expectedResult}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestCaseBuilder;
