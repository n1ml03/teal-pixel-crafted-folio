import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from "@/components/ui/input";
import { MotionButton } from "@/components/ui/motion-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import {
  CheckCircle2,
  Circle,
  Trash2,
  Plus,
  AlertCircle,
  Info
} from 'lucide-react';
import { toast } from "@/components/ui/sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Define the Task interface
interface Task {
  id: string;
  text: string;
  completed: boolean;
}

// Define the filter types
type FilterType = 'all' | 'active' | 'completed';

const DemoApp: React.FC = () => {
  // State for tasks, new task input, and filter
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [error, setError] = useState<string | null>(null);

  // Function to add a new task
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
  };

  // Function to toggle task completion - Fixed Bug 1: Added strikethrough styling
  const toggleTaskCompletion = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));

    // Show success message when a task is toggled
    const task = tasks.find(t => t.id === id);
    if (task) {
      const newStatus = !task.completed;
      toast.success(`Task marked as ${newStatus ? 'completed' : 'active'}`);
    }
  };

  // Function to delete a task - Fixed Bug 2: Task counter now updates correctly
  const deleteTask = (id: string) => {
    // Properly update tasks state
    setTasks(tasks.filter(task => task.id !== id));

    // Show success message when a task is deleted
    toast.success('Task deleted successfully!');
  };

  // Function to filter tasks
  const filteredTasks = () => {
    switch (filter) {
      case 'active':
        return tasks.filter(task => !task.completed);
      case 'completed':
        return tasks.filter(task => task.completed);
      default:
        return tasks;
    }
  };

  // Function to handle filter change - Fixed Bug 4: Added filter button highlighting
  const changeFilter = (newFilter: FilterType) => {
    setFilter(newFilter);

    // Show a message when filter is changed
    toast.info(`Showing ${newFilter} tasks`);
  };

  // Count active tasks - fixed Bug 2: Task counter now updates correctly
  const activeTaskCount = () => {
    // Correctly count active tasks
    return tasks.filter(task => !task.completed).length;
  };

  // Handle Enter key press in the input field
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  return (
    <Card className="border border-gray-200 shadow-md overflow-visible">
      <CardHeader className="bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center justify-between">
          <span>Task Management App</span>
          <Badge variant="outline" className="bg-white/20 text-white border-white/30">
            Interactive App
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        {/* Task Input */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="What needs to be done?"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pr-10"
              data-testid="task-input"
            />
            {error && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <AlertCircle size={16} />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{error}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </div>
          <MotionButton
            onClick={addTask}
            className="bg-teal-500 hover:bg-teal-600 text-white"
            data-testid="add-task-btn"
          >
            <Plus size={16} className="mr-1" /> Add
          </MotionButton>
        </div>

        {/* Task List */}
        <div className="space-y-2 max-h-[400px] overflow-y-auto p-1" data-testid="task-list">
          {filteredTasks().length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No tasks to display
            </div>
          ) : (
            filteredTasks().map(task => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center p-3 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => toggleTaskCompletion(task.id)}
                  className="mr-3 text-gray-400 hover:text-teal-500 transition-colors"
                  data-testid="task-checkbox"
                >
                  {task.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-teal-500" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </button>

                {/* Fixed Bug 1: Added strikethrough styling for completed tasks */}
                <span className={`flex-1 ${task.completed ? 'line-through text-gray-400' : ''}`}>
                  {task.text}
                </span>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Delete task"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </motion.div>
            ))
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center border-t border-gray-100 px-4 py-3 bg-gray-50 rounded-b-lg">
        {/* Task Counter - intentionally buggy (DEMO-BUG-002) */}
        <div className="text-sm text-gray-500" data-testid="items-left">
          {activeTaskCount()} {activeTaskCount() === 1 ? 'item' : 'items'} left
        </div>

        {/* Fixed Bug 4: Added highlighting for selected filter buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => changeFilter('all')}
            className={`px-2 py-1 text-sm rounded ${filter === 'all' ? 'bg-teal-100 text-teal-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            All
          </button>
          <button
            onClick={() => changeFilter('active')}
            className={`px-2 py-1 text-sm rounded ${filter === 'active' ? 'bg-teal-100 text-teal-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Active
          </button>
          <button
            onClick={() => changeFilter('completed')}
            className={`px-2 py-1 text-sm rounded ${filter === 'completed' ? 'bg-teal-100 text-teal-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Completed
          </button>
        </div>

        {/* Bug Hint */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info size={16} className="text-gray-400 hover:text-teal-500 transition-colors" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">All bugs have been fixed! This app now works correctly.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
};

export default DemoApp;
