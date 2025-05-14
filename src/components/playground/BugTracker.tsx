import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MotionButton } from "@/components/ui/motion-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import {
  Bug,
  Plus,
  Save,
  Trash2,
  Calendar,
  Edit,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { intentionalBugs } from '@/data/testing-playground';
import { renderSeverityBadge, renderBugStatusBadge } from './utils/StatusBadges';

// Define the BugReport interface
interface BugReport {
  id: string;
  title: string;
  severity: 'Critical' | 'Major' | 'Minor' | 'Trivial';
  status: 'Open' | 'In Progress' | 'Fixed' | 'Verified' | 'Closed';
  stepsToReproduce: string[];
  expectedResult: string;
  actualResult: string;
  affectedArea: string;
  reportedDate: string;
  assignedTo?: string;
  fixedInVersion?: string;
  screenshots?: string[];
}

// Sample bug reports
const sampleBugReports: BugReport[] = [
  {
    id: "BUG-001",
    title: "Completed tasks do not show strikethrough styling",
    severity: "Minor",
    status: "Fixed",
    stepsToReproduce: [
      "Add a new task",
      "Click the checkbox to mark it as completed"
    ],
    expectedResult: "Task text should have strikethrough styling",
    actualResult: "Task text appears the same as incomplete tasks",
    affectedArea: "Task List",
    reportedDate: "2023-06-15",
    fixedInVersion: "1.0.1"
  },
  {
    id: "BUG-002",
    title: "Task counter shows incorrect count after deleting a task",
    severity: "Major",
    status: "Open",
    stepsToReproduce: [
      "Add multiple tasks",
      "Delete one of the tasks",
      "Observe the task counter"
    ],
    expectedResult: "Task counter should show the correct number of remaining tasks",
    actualResult: "Task counter shows incorrect number",
    affectedArea: "Task Counter",
    reportedDate: "2023-06-16"
  },
  {
    id: "BUG-003",
    title: "Empty tasks can be added despite validation",
    severity: "Minor",
    status: "In Progress",
    stepsToReproduce: [
      "Leave the task input field empty",
      "Click the Add button or press Enter"
    ],
    expectedResult: "An error message should appear and no task should be added",
    actualResult: "An empty task is added to the list",
    affectedArea: "Task Input",
    reportedDate: "2023-06-17",
    assignedTo: "Developer"
  }
];

const BugTracker: React.FC = () => {
  // State for bug reports
  const [bugReports, setBugReports] = useState<BugReport[]>(sampleBugReports);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [isCreatingBug, setIsCreatingBug] = useState<boolean>(false);
  const [isEditingBug, setIsEditingBug] = useState<boolean>(false);
  const [currentBug, setCurrentBug] = useState<BugReport | null>(null);

  // New bug form state
  const [newBugTitle, setNewBugTitle] = useState<string>("");
  const [newBugSeverity, setNewBugSeverity] = useState<BugReport['severity']>("Minor");
  const [newBugSteps, setNewBugSteps] = useState<string>("");
  const [newBugExpectedResult, setNewBugExpectedResult] = useState<string>("");
  const [newBugActualResult, setNewBugActualResult] = useState<string>("");
  const [newBugAffectedArea, setNewBugAffectedArea] = useState<string>("");

  // Function to start creating a new bug report
  const startNewBugReport = () => {
    setIsCreatingBug(true);
    setIsEditingBug(false);
    setCurrentBug(null);
    resetForm();
  };

  // Function to reset the form
  const resetForm = () => {
    setNewBugTitle("");
    setNewBugSeverity("Minor");
    setNewBugSteps("");
    setNewBugExpectedResult("");
    setNewBugActualResult("");
    setNewBugAffectedArea("");
  };

  // Function to save a new bug report
  const saveBugReport = () => {
    if (!newBugTitle || !newBugSteps || !newBugExpectedResult || !newBugActualResult) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newBug: BugReport = {
      id: isEditingBug && currentBug ? currentBug.id : `BUG-${Date.now().toString().slice(-3)}`,
      title: newBugTitle,
      severity: newBugSeverity,
      status: isEditingBug && currentBug ? currentBug.status : "Open",
      stepsToReproduce: newBugSteps.split('\n').filter(step => step.trim() !== ''),
      expectedResult: newBugExpectedResult,
      actualResult: newBugActualResult,
      affectedArea: newBugAffectedArea || "General",
      reportedDate: isEditingBug && currentBug ? currentBug.reportedDate : new Date().toISOString().split('T')[0],
      assignedTo: isEditingBug && currentBug ? currentBug.assignedTo : undefined,
      fixedInVersion: isEditingBug && currentBug ? currentBug.fixedInVersion : undefined,
      screenshots: isEditingBug && currentBug ? currentBug.screenshots : undefined
    };

    if (isEditingBug && currentBug) {
      // Update existing bug
      setBugReports(bugReports.map(bug =>
        bug.id === currentBug.id ? newBug : bug
      ));
      toast.success("Bug report updated");
    } else {
      // Add new bug
      setBugReports([...bugReports, newBug]);
      toast.success("Bug report created");
    }

    setIsCreatingBug(false);
    setIsEditingBug(false);
    setCurrentBug(null);
    resetForm();
  };

  // Function to edit a bug report
  const editBugReport = (bug: BugReport) => {
    setCurrentBug(bug);
    setIsEditingBug(true);
    setIsCreatingBug(true);

    setNewBugTitle(bug.title);
    setNewBugSeverity(bug.severity);
    setNewBugSteps(bug.stepsToReproduce.join('\n'));
    setNewBugExpectedResult(bug.expectedResult);
    setNewBugActualResult(bug.actualResult);
    setNewBugAffectedArea(bug.affectedArea);
  };

  // Function to change bug status
  const changeBugStatus = (bugId: string, newStatus: BugReport['status']) => {
    setBugReports(bugReports.map(bug =>
      bug.id === bugId ? { ...bug, status: newStatus } : bug
    ));

    toast.success(`Bug status updated to ${newStatus}`);
  };

  // Function to delete a bug report
  const deleteBugReport = (bugId: string) => {
    setBugReports(bugReports.filter(bug => bug.id !== bugId));
    toast.success("Bug report deleted");
  };

  // Using imported renderSeverityBadge and renderBugStatusBadge functions

  // Filter bugs based on active tab
  const filteredBugs = bugReports.filter(bug => {
    if (activeTab === 'all') return true;
    if (activeTab === 'open') return bug.status === 'Open';
    if (activeTab === 'in-progress') return bug.status === 'In Progress';
    if (activeTab === 'fixed') return bug.status === 'Fixed' || bug.status === 'Verified';
    if (activeTab === 'closed') return bug.status === 'Closed';
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Bug className="h-5 w-5 mr-2 text-red-600" />
          <h2 className="text-xl font-bold text-gray-800">Bug Tracker</h2>
        </div>
        <MotionButton
          onClick={startNewBugReport}
          className="bg-red-500 hover:bg-red-600 text-white"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Report Bug
        </MotionButton>
      </div>

      {/* Bug report form */}
      {isCreatingBug && (
        <Card className="border border-gray-200 shadow-sm mb-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              {isEditingBug ? "Edit Bug Report" : "Report New Bug"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bug-title">Bug Title</Label>
                <Input
                  id="bug-title"
                  placeholder="Describe the bug briefly"
                  value={newBugTitle}
                  onChange={(e) => setNewBugTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bug-severity">Severity</Label>
                  <Select value={newBugSeverity} onValueChange={(value) => setNewBugSeverity(value as BugReport['severity'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Critical">Critical</SelectItem>
                      <SelectItem value="Major">Major</SelectItem>
                      <SelectItem value="Minor">Minor</SelectItem>
                      <SelectItem value="Trivial">Trivial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bug-area">Affected Area</Label>
                  <Input
                    id="bug-area"
                    placeholder="e.g., Task List, Filter, Counter"
                    value={newBugAffectedArea}
                    onChange={(e) => setNewBugAffectedArea(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bug-steps">Steps to Reproduce</Label>
                <Textarea
                  id="bug-steps"
                  placeholder="Enter each step on a new line"
                  value={newBugSteps}
                  onChange={(e) => setNewBugSteps(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bug-expected">Expected Result</Label>
                  <Textarea
                    id="bug-expected"
                    placeholder="What should happen"
                    value={newBugExpectedResult}
                    onChange={(e) => setNewBugExpectedResult(e.target.value)}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bug-actual">Actual Result</Label>
                  <Textarea
                    id="bug-actual"
                    placeholder="What actually happens"
                    value={newBugActualResult}
                    onChange={(e) => setNewBugActualResult(e.target.value)}
                    rows={2}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <MotionButton
                  variant="outline"
                  onClick={() => {
                    setIsCreatingBug(false);
                    setIsEditingBug(false);
                    resetForm();
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </MotionButton>
                <MotionButton
                  onClick={saveBugReport}
                  className="bg-red-500 hover:bg-red-600 text-white"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isEditingBug ? "Update Bug" : "Save Bug"}
                </MotionButton>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bug list tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start bg-white border border-gray-200 p-1 rounded-lg shadow-sm overflow-x-auto">
          <TabsTrigger value="all" className="data-[state=active]:shadow-sm flex items-center data-[state=active]:bg-gray-50 data-[state=active]:text-gray-700">
            All Bugs
          </TabsTrigger>
          <TabsTrigger value="open" className="data-[state=active]:shadow-sm flex items-center data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            Open
          </TabsTrigger>
          <TabsTrigger value="in-progress" className="data-[state=active]:shadow-sm flex items-center data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
            In Progress
          </TabsTrigger>
          <TabsTrigger value="fixed" className="data-[state=active]:shadow-sm flex items-center data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
            Fixed
          </TabsTrigger>
          <TabsTrigger value="closed" className="data-[state=active]:shadow-sm flex items-center data-[state=active]:bg-gray-50 data-[state=active]:text-gray-700">
            Closed
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {filteredBugs.length === 0 ? (
            <div className="text-center py-8">
              <Bug className="h-12 w-12 mx-auto text-gray-300 mb-2" />
              <h3 className="text-lg font-medium text-gray-500">No bugs found</h3>
              <p className="text-gray-400 text-sm mt-1">
                {activeTab === 'all'
                  ? "No bugs have been reported yet"
                  : `No bugs with status "${activeTab}" found`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBugs.map((bug) => (
                <motion.div
                  key={bug.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <span className="text-gray-500 text-sm font-mono mr-2">{bug.id}</span>
                      <h3 className="font-medium text-lg">{bug.title}</h3>
                    </div>
                    <div className="flex gap-2">
                      {renderSeverityBadge(bug.severity)}
                      {renderBugStatusBadge(bug.status)}
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    <span>Reported: {bug.reportedDate}</span>
                    <Badge variant="outline" className="ml-3 text-xs">
                      {bug.affectedArea}
                    </Badge>
                  </div>

                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-700 text-sm mb-1">Steps to Reproduce:</h4>
                      <ol className="list-decimal pl-5 space-y-1 text-sm text-gray-600">
                        {bug.stepsToReproduce.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ol>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <h4 className="font-medium text-gray-700 text-sm mb-1">Expected Result:</h4>
                        <p className="text-sm text-gray-600">{bug.expectedResult}</p>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-700 text-sm mb-1">Actual Result:</h4>
                        <p className="text-sm text-gray-600">{bug.actualResult}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end space-x-2">
                    {bug.status === 'Open' && (
                      <MotionButton
                        size="sm"
                        variant="outline"
                        onClick={() => changeBugStatus(bug.id, 'In Progress')}
                        className="text-xs"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ArrowRight className="h-3.5 w-3.5 mr-1" />
                        Start Working
                      </MotionButton>
                    )}

                    {bug.status === 'In Progress' && (
                      <MotionButton
                        size="sm"
                        variant="outline"
                        onClick={() => changeBugStatus(bug.id, 'Fixed')}
                        className="text-xs"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                        Mark as Fixed
                      </MotionButton>
                    )}

                    {bug.status === 'Fixed' && (
                      <MotionButton
                        size="sm"
                        variant="outline"
                        onClick={() => changeBugStatus(bug.id, 'Verified')}
                        className="text-xs"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                        Verify Fix
                      </MotionButton>
                    )}

                    {(bug.status === 'Verified' || bug.status === 'Fixed') && (
                      <MotionButton
                        size="sm"
                        variant="outline"
                        onClick={() => changeBugStatus(bug.id, 'Closed')}
                        className="text-xs"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <XCircle className="h-3.5 w-3.5 mr-1" />
                        Close Bug
                      </MotionButton>
                    )}

                    <MotionButton
                      size="sm"
                      variant="outline"
                      onClick={() => editBugReport(bug)}
                      className="text-xs"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Edit className="h-3.5 w-3.5 mr-1" />
                      Edit
                    </MotionButton>

                    <MotionButton
                      size="sm"
                      variant="outline"
                      onClick={() => deleteBugReport(bug.id)}
                      className="text-xs text-red-500 hover:text-red-700 hover:border-red-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                      Delete
                    </MotionButton>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Intentional bugs section */}
      <Card className="border border-amber-200 bg-amber-50 shadow-sm mt-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-amber-800 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2 text-amber-600" />
            Intentional Bugs for Testing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-amber-700">
            <p className="mb-2">The following bugs have been intentionally added to the Demo App for testing purposes:</p>
            <ul className="list-disc pl-5 space-y-1">
              {intentionalBugs.map((bug) => (
                <li key={bug.id}>
                  <span className="font-medium">{bug.description}</span>
                  <span className="text-xs text-amber-600 ml-2">({bug.hint})</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BugTracker;
