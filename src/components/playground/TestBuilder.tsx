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
  ListChecks,
  ArrowUp,
  ArrowDown,
  Play
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TestCase } from '@/data/testing-playground';
import { renderPriorityBadge, renderTestStatusBadge } from './utils/StatusBadges';

// Define the TestStep interface for scenarios
interface TestStep {
  id: string;
  action: string;
  target?: string;
  value?: string;
  expectedResult?: string;
  isVerification: boolean;
}

// Define the TestScenario interface
interface TestScenario {
  id: string;
  name: string;
  description: string;
  steps: TestStep[];
}

// Predefined actions for the To-Do List app
const predefinedActions = [
  { value: "addTask", label: "Add Task" },
  { value: "completeTask", label: "Complete Task" },
  { value: "deleteTask", label: "Delete Task" },
  { value: "filterTasks", label: "Filter Tasks" },
  { value: "verifyTaskExists", label: "Verify Task Exists", isVerification: true },
  { value: "verifyTaskCompleted", label: "Verify Task Completed", isVerification: true },
  { value: "verifyTaskCount", label: "Verify Task Count", isVerification: true },
  { value: "verifyFilterActive", label: "Verify Filter Active", isVerification: true }
];

// Sample test scenarios
const sampleScenarios: TestScenario[] = [
  {
    id: "scenario-1",
    name: "Add and Complete Tasks",
    description: "Tests adding multiple tasks and marking them as completed",
    steps: [
      { id: "step-1", action: "addTask", target: "input", value: "Buy groceries", isVerification: false },
      { id: "step-2", action: "addTask", target: "input", value: "Clean house", isVerification: false },
      { id: "step-3", action: "verifyTaskCount", expectedResult: "2", isVerification: true },
      { id: "step-4", action: "completeTask", target: "task", value: "Buy groceries", isVerification: false },
      { id: "step-5", action: "verifyTaskCompleted", target: "task", value: "Buy groceries", expectedResult: "true", isVerification: true }
    ]
  }
];

// Using imported renderPriorityBadge and renderTestStatusBadge functions

const TestBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("test-cases");

  // Test Case Builder state
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

  // Test Scenario Builder state
  const [scenarios, setScenarios] = useState<TestScenario[]>(sampleScenarios);
  const [currentScenario, setCurrentScenario] = useState<TestScenario | null>(null);
  const [newStepAction, setNewStepAction] = useState<string>("");
  const [newStepTarget, setNewStepTarget] = useState<string>("");
  const [newStepValue, setNewStepValue] = useState<string>("");
  const [newStepExpectedResult, setNewStepExpectedResult] = useState<string>("");
  const [isCreatingScenario, setIsCreatingScenario] = useState<boolean>(false);
  const [newScenarioName, setNewScenarioName] = useState<string>("");
  const [newScenarioDescription, setNewScenarioDescription] = useState<string>("");

  // Test Case Builder functions
  const addStep = () => {
    if (!currentTestCase.steps) return;
    setCurrentTestCase({
      ...currentTestCase,
      steps: [...currentTestCase.steps, '']
    });
  };

  const updateStep = (index: number, value: string) => {
    if (!currentTestCase.steps) return;
    const updatedSteps = [...currentTestCase.steps];
    updatedSteps[index] = value;
    setCurrentTestCase({
      ...currentTestCase,
      steps: updatedSteps
    });
  };

  const removeStep = (index: number) => {
    if (!currentTestCase.steps || currentTestCase.steps.length <= 1) return;
    const updatedSteps = [...currentTestCase.steps];
    updatedSteps.splice(index, 1);
    setCurrentTestCase({
      ...currentTestCase,
      steps: updatedSteps
    });
  };

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

  // Test Scenario Builder functions
  const selectScenario = (scenario: TestScenario) => {
    setCurrentScenario(scenario);
    setIsCreatingScenario(false);
  };

  const startNewScenario = () => {
    setIsCreatingScenario(true);
    setCurrentScenario(null);
    setNewScenarioName("");
    setNewScenarioDescription("");
  };

  const saveNewScenario = () => {
    if (!newScenarioName) {
      toast.error("Please enter a scenario name");
      return;
    }

    const newScenario: TestScenario = {
      id: `scenario-${Date.now()}`,
      name: newScenarioName,
      description: newScenarioDescription,
      steps: []
    };

    setScenarios([...scenarios, newScenario]);
    setCurrentScenario(newScenario);
    setIsCreatingScenario(false);
    toast.success("New test scenario created");
  };

  const addScenarioStep = () => {
    if (!currentScenario) return;
    if (!newStepAction) {
      toast.error("Please select an action");
      return;
    }

    const action = predefinedActions.find(a => a.value === newStepAction);
    const isVerification = action?.isVerification || false;

    const newStep: TestStep = {
      id: `step-${Date.now()}`,
      action: newStepAction,
      target: newStepTarget,
      value: newStepValue,
      expectedResult: isVerification ? newStepExpectedResult : undefined,
      isVerification
    };

    const updatedScenario = {
      ...currentScenario,
      steps: [...currentScenario.steps, newStep]
    };

    setScenarios(scenarios.map(s =>
      s.id === currentScenario.id ? updatedScenario : s
    ));
    setCurrentScenario(updatedScenario);

    // Reset new step form
    setNewStepAction("");
    setNewStepTarget("");
    setNewStepValue("");
    setNewStepExpectedResult("");

    toast.success("Step added to scenario");
  };

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <FileText className="h-5 w-5 mr-2 text-teal-600" />
          Test Builder
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start mb-4">
            <TabsTrigger value="test-cases" className="flex items-center">
              <FileText className="h-4 w-4 mr-1.5" />
              Test Cases
            </TabsTrigger>
            <TabsTrigger value="test-scenarios" className="flex items-center">
              <ListChecks className="h-4 w-4 mr-1.5" />
              Test Scenarios
            </TabsTrigger>
          </TabsList>

          {/* Test Cases Tab */}
          <TabsContent value="test-cases" className="mt-0">
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
                              {renderTestStatusBadge(testCase.status)}
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
          </TabsContent>

          {/* Test Scenarios Tab */}
          <TabsContent value="test-scenarios" className="mt-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <ListChecks className="h-5 w-5 mr-2 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-800">Test Scenario Builder</h2>
                </div>
                <MotionButton
                  onClick={startNewScenario}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Scenario
                </MotionButton>
              </div>

              {/* Scenario selection */}
              {!isCreatingScenario && !currentScenario && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {scenarios.map((scenario) => (
                    <motion.div
                      key={scenario.id}
                      className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all"
                      whileHover={{ scale: 1.02 }}
                      onClick={() => selectScenario(scenario)}
                    >
                      <h3 className="font-medium text-lg">{scenario.name}</h3>
                      <p className="text-gray-600 text-sm mt-1">{scenario.description}</p>
                      <div className="flex items-center mt-2">
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                          {scenario.steps.length} steps
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Create new scenario form */}
              {isCreatingScenario && (
                <Card className="border border-gray-200 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Create New Test Scenario</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="scenario-name">Scenario Name</Label>
                        <Input
                          id="scenario-name"
                          placeholder="Enter scenario name"
                          value={newScenarioName}
                          onChange={(e) => setNewScenarioName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="scenario-description">Description</Label>
                        <Textarea
                          id="scenario-description"
                          placeholder="Describe what this test scenario verifies"
                          value={newScenarioDescription}
                          onChange={(e) => setNewScenarioDescription(e.target.value)}
                        />
                      </div>
                      <div className="flex justify-end space-x-2 mt-4">
                        <MotionButton
                          variant="outline"
                          onClick={() => setIsCreatingScenario(false)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Cancel
                        </MotionButton>
                        <MotionButton
                          onClick={saveNewScenario}
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save Scenario
                        </MotionButton>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Edit scenario */}
              {currentScenario && (
                <div className="space-y-4">
                  <Card className="border border-gray-200 shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{currentScenario.name}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">{currentScenario.description}</p>
                        </div>
                        <MotionButton
                          onClick={() => toast.success(`Running scenario: ${currentScenario.name}`)}
                          className="bg-green-500 hover:bg-green-600 text-white"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Run Scenario
                        </MotionButton>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <h3 className="font-medium mb-2">Steps</h3>
                      <div className="space-y-2 mb-4">
                        {currentScenario.steps.length === 0 ? (
                          <p className="text-gray-500 text-sm italic">No steps added yet. Add steps below.</p>
                        ) : (
                          currentScenario.steps.map((step, index) => (
                            <motion.div
                              key={step.id}
                              className={`flex items-start p-3 rounded-lg border ${
                                step.isVerification ? 'border-amber-200 bg-amber-50' : 'border-gray-200 bg-gray-50'
                              }`}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="flex-1">
                                <div className="flex items-center">
                                  <span className="text-gray-500 text-sm font-mono mr-2">{index + 1}</span>
                                  <span className="font-medium">
                                    {predefinedActions.find(a => a.value === step.action)?.label || step.action}
                                  </span>
                                  {step.isVerification && (
                                    <Badge className="ml-2 bg-amber-100 text-amber-800 border-amber-200">
                                      Verification
                                    </Badge>
                                  )}
                                </div>
                                <div className="mt-1 text-sm text-gray-600">
                                  {step.target && <span className="mr-2">Target: {step.target}</span>}
                                  {step.value && <span className="mr-2">Value: {step.value}</span>}
                                  {step.expectedResult && (
                                    <span className="font-medium text-amber-700">
                                      Expected: {step.expectedResult}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MotionButton
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    if (index === 0) return;
                                    const updatedSteps = [...currentScenario.steps];
                                    [updatedSteps[index], updatedSteps[index - 1]] = [updatedSteps[index - 1], updatedSteps[index]];
                                    const updatedScenario = { ...currentScenario, steps: updatedSteps };
                                    setScenarios(scenarios.map(s => s.id === currentScenario.id ? updatedScenario : s));
                                    setCurrentScenario(updatedScenario);
                                  }}
                                  disabled={index === 0}
                                  className="text-gray-500 hover:text-gray-700"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <ArrowUp className="h-4 w-4" />
                                </MotionButton>
                                <MotionButton
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    if (index === currentScenario.steps.length - 1) return;
                                    const updatedSteps = [...currentScenario.steps];
                                    [updatedSteps[index], updatedSteps[index + 1]] = [updatedSteps[index + 1], updatedSteps[index]];
                                    const updatedScenario = { ...currentScenario, steps: updatedSteps };
                                    setScenarios(scenarios.map(s => s.id === currentScenario.id ? updatedScenario : s));
                                    setCurrentScenario(updatedScenario);
                                  }}
                                  disabled={index === currentScenario.steps.length - 1}
                                  className="text-gray-500 hover:text-gray-700"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <ArrowDown className="h-4 w-4" />
                                </MotionButton>
                                <MotionButton
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    const updatedSteps = currentScenario.steps.filter(s => s.id !== step.id);
                                    const updatedScenario = { ...currentScenario, steps: updatedSteps };
                                    setScenarios(scenarios.map(s => s.id === currentScenario.id ? updatedScenario : s));
                                    setCurrentScenario(updatedScenario);
                                    toast.success("Step removed from scenario");
                                  }}
                                  className="text-red-500 hover:text-red-700"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </MotionButton>
                              </div>
                            </motion.div>
                          ))
                        )}
                      </div>

                      <Separator className="my-4" />

                      <h3 className="font-medium mb-2">Add Step</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="step-action">Action</Label>
                          <Select value={newStepAction} onValueChange={setNewStepAction}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select action" />
                            </SelectTrigger>
                            <SelectContent>
                              {predefinedActions.map((action) => (
                                <SelectItem key={action.value} value={action.value}>
                                  {action.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="step-target">Target (optional)</Label>
                          <Input
                            id="step-target"
                            placeholder="e.g., input, task, filter"
                            value={newStepTarget}
                            onChange={(e) => setNewStepTarget(e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="step-value">Value (optional)</Label>
                          <Input
                            id="step-value"
                            placeholder="e.g., Buy groceries, completed"
                            value={newStepValue}
                            onChange={(e) => setNewStepValue(e.target.value)}
                          />
                        </div>

                        {newStepAction && predefinedActions.find(a => a.value === newStepAction)?.isVerification && (
                          <div className="space-y-2">
                            <Label htmlFor="step-expected-result">Expected Result</Label>
                            <Input
                              id="step-expected-result"
                              placeholder="e.g., true, 3, visible"
                              value={newStepExpectedResult}
                              onChange={(e) => setNewStepExpectedResult(e.target.value)}
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end mt-4">
                        <MotionButton
                          onClick={addScenarioStep}
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Step
                        </MotionButton>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TestBuilder;
