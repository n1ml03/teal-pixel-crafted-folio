import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MotionButton } from "@/components/ui/motion-button";
import {
  ArrowLeft,
  ArrowRight,
  Bug,
  CheckCircle2,
  Code,
  Eye,
  EyeOff,
  Diff
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import MarkdownDiffViewer from './MarkdownDiffViewer';

interface BugFix {
  id: string;
  title: string;
  description: string;
  beforeCode: string;
  afterCode: string;
  beforeScreenshot: string;
  afterScreenshot: string;
}

const bugFixes: BugFix[] = [
  {
    id: 'BUG-001',
    title: 'Completed tasks not showing strikethrough styling',
    description: 'When a task was marked as completed, the text did not have strikethrough styling applied to it, making it difficult to distinguish between completed and active tasks.',
    beforeCode: `// Intentional bug: No strikethrough styling (DEMO-BUG-001)
<span className={\`flex-1 \${task.completed ? '' : ''}\`}>
  {task.text}
</span>`,
    afterCode: `// Fixed Bug 1: Added strikethrough styling for completed tasks
<span className={\`flex-1 \${task.completed ? 'line-through text-gray-400' : ''}\`}>
  {task.text}
</span>`,
    beforeScreenshot: '/images/bug-1-before.png',
    afterScreenshot: '/images/bug-1-after.png'
  },
  {
    id: 'BUG-002',
    title: 'Task counter showing incorrect count',
    description: 'The task counter did not update correctly after deleting a task, showing an incorrect count of remaining tasks.',
    beforeCode: `// Count active tasks - intentionally buggy for DEMO-BUG-002
const activeTaskCount = () => {
  // This is intentionally incorrect after deletion
  return tasks.filter(task => !task.completed).length;
};`,
    afterCode: `// Count active tasks - fixed Bug 2: Task counter now updates correctly
const activeTaskCount = () => {
  // Correctly count active tasks
  return tasks.filter(task => !task.completed).length;
};`,
    beforeScreenshot: '/images/bug-2-before.png',
    afterScreenshot: '/images/bug-2-after.png'
  },
  {
    id: 'BUG-003',
    title: 'Empty tasks can be added despite validation',
    description: 'The application allowed empty tasks to be added despite having validation logic, resulting in empty items in the task list.',
    beforeCode: `// Function to add a new task
const addTask = () => {
  // Intentional bug: Allow empty tasks (DEMO-BUG-003)
  if (newTaskText.trim() === '') {
    setError('Task cannot be empty');
    return;
  }

  const newTask: Task = {
    id: Date.now().toString(),
    text: newTaskText,
    completed: false
  };

  setTasks([...tasks, newTask]);
  setNewTaskText('');
  setError(null);
};`,
    afterCode: `// Function to add a new task
const addTask = () => {
  // Fixed Bug 3: Properly validate empty tasks
  if (newTaskText.trim() === '') {
    setError('Task cannot be empty');
    toast.error('Task cannot be empty');
    return;
  }

  const newTask: Task = {
    id: Date.now().toString(),
    text: newTaskText,
    completed: false
  };

  setTasks([...tasks, newTask]);
  setNewTaskText('');
  setError(null);
};`,
    beforeScreenshot: '/images/bug-3-before.png',
    afterScreenshot: '/images/bug-3-after.png'
  },
  {
    id: 'BUG-004',
    title: 'Filter buttons not highlighting when selected',
    description: 'The filter buttons (All, Active, Completed) did not have any visual indication of which filter was currently selected.',
    beforeCode: `{/* Filter Buttons - intentionally no highlight (DEMO-BUG-004) */}
<div className="flex gap-2">
  <button
    onClick={() => changeFilter('all')}
    className={\`px-2 py-1 text-sm rounded \${filter === 'all' ? '' : ''}\`}
  >
    All
  </button>
  <button
    onClick={() => changeFilter('active')}
    className={\`px-2 py-1 text-sm rounded \${filter === 'active' ? '' : ''}\`}
  >
    Active
  </button>
  <button
    onClick={() => changeFilter('completed')}
    className={\`px-2 py-1 text-sm rounded \${filter === 'completed' ? '' : ''}\`}
  >
    Completed
  </button>
</div>`,
    afterCode: `{/* Fixed Bug 4: Added highlighting for selected filter buttons */}
<div className="flex gap-2">
  <button
    onClick={() => changeFilter('all')}
    className={\`px-2 py-1 text-sm rounded \${filter === 'all' ? 'bg-teal-100 text-teal-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}\`}
  >
    All
  </button>
  <button
    onClick={() => changeFilter('active')}
    className={\`px-2 py-1 text-sm rounded \${filter === 'active' ? 'bg-teal-100 text-teal-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}\`}
  >
    Active
  </button>
  <button
    onClick={() => changeFilter('completed')}
    className={\`px-2 py-1 text-sm rounded \${filter === 'completed' ? 'bg-teal-100 text-teal-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}\`}
  >
    Completed
  </button>
</div>`,
    beforeScreenshot: '/images/bug-4-before.png',
    afterScreenshot: '/images/bug-4-after.png'
  }
];

const BugComparison: React.FC = () => {
  const [selectedBug, setSelectedBug] = useState<BugFix>(bugFixes[0]);
  const [showDiff, setShowDiff] = useState(false);

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <Diff className="h-5 w-5 mr-2 text-teal-600" />
            Bug Fix Comparison
          </CardTitle>
          <MotionButton
            size="sm"
            variant="outline"
            className="text-xs"
            onClick={() => setShowDiff(!showDiff)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {showDiff ? (
              <>
                <Eye className="h-3.5 w-3.5 mr-1" />
                Show Side by Side
              </>
            ) : (
              <>
                <Diff className="h-3.5 w-3.5 mr-1" />
                Show Diff View
              </>
            )}
          </MotionButton>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Bug List */}
          <div className="md:col-span-1">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Fixed Bugs</h3>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-2">
                {bugFixes.map((bug) => (
                  <motion.div
                    key={bug.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedBug.id === bug.id
                        ? 'border-teal-300 bg-teal-50'
                        : 'border-gray-200 bg-white hover:border-teal-200 hover:bg-teal-50/50'
                    }`}
                    onClick={() => setSelectedBug(bug)}
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-0.5">
                        {selectedBug.id === bug.id ? (
                          <CheckCircle2 className="h-4 w-4 text-teal-500" />
                        ) : (
                          <Bug className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                      <div className="ml-2">
                        <div className="flex items-center">
                          <span className="text-xs font-mono text-gray-500 mr-1">{bug.id}</span>
                        </div>
                        <h4 className="text-sm font-medium text-gray-800">{bug.title}</h4>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Bug Details */}
          <div className="md:col-span-3">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-800">{selectedBug.title}</h2>
              <p className="text-gray-600 mt-1">{selectedBug.description}</p>
            </div>

            <Tabs defaultValue="code" className="w-full">
              <TabsList className="w-full justify-start mb-4">
                <TabsTrigger value="code" className="flex items-center">
                  <Code className="h-4 w-4 mr-1.5" />
                  Code Changes
                </TabsTrigger>
                <TabsTrigger value="visual" className="flex items-center">
                  <Eye className="h-4 w-4 mr-1.5" />
                  Visual Changes
                </TabsTrigger>
              </TabsList>

              <TabsContent value="code" className="mt-0">
                <MarkdownDiffViewer
                  beforeCode={selectedBug.beforeCode}
                  afterCode={selectedBug.afterCode}
                  language="jsx"
                  title={`Bug Fix: ${selectedBug.title}`}
                  initialViewMode={showDiff ? 'unified' : 'split'}
                  maxHeight="400px"
                />
              </TabsContent>

              <TabsContent value="visual" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <Badge className="bg-red-100 text-red-800 border-red-200">
                        <Bug className="h-3.5 w-3.5 mr-1" />
                        Before Fix
                      </Badge>
                    </div>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-100 p-4 flex items-center justify-center min-h-[200px]">
                        <p className="text-gray-500 text-sm">Screenshot placeholder</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center mb-2">
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                        After Fix
                      </Badge>
                    </div>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-100 p-4 flex items-center justify-center min-h-[200px]">
                        <p className="text-gray-500 text-sm">Screenshot placeholder</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BugComparison;
