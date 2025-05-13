import { TestTube, AlertTriangle, Bug, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

// Types for the testing playground data
export interface TestCase {
  id: string;
  title: string;
  preconditions: string;
  steps: string[];
  expectedResult: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Passed' | 'Failed' | 'Blocked' | 'Not Run';
}

export interface BugReport {
  id: string;
  title: string;
  severity: 'Critical' | 'Major' | 'Minor' | 'Trivial';
  status: 'Open' | 'Fixed' | 'Verified' | 'Closed';
  stepsToReproduce: string[];
  expectedResult: string;
  actualResult: string;
  affectedArea: string;
  reportedDate: string;
}

export interface AutomationScript {
  id: string;
  title: string;
  description: string;
  language: 'javascript' | 'typescript' | 'java' | 'python';
  framework: 'Cypress' | 'Playwright' | 'Selenium' | 'Jest' | 'TestCafe';
  code: string;
}

// Test Cases Data
export const testCases: TestCase[] = [
  {
    id: 'TC001',
    title: 'Add a new task to the to-do list',
    preconditions: 'User is on the to-do list application',
    steps: [
      'Enter a task name in the input field',
      'Click the "Add Task" button'
    ],
    expectedResult: 'The new task should appear in the to-do list with unchecked status',
    priority: 'High',
    status: 'Passed'
  },
  {
    id: 'TC002',
    title: 'Mark a task as completed',
    preconditions: 'User is on the to-do list application with at least one task',
    steps: [
      'Click the checkbox next to an uncompleted task'
    ],
    expectedResult: 'The task should be marked as completed with a strikethrough text and checked checkbox',
    priority: 'High',
    status: 'Failed'
  },
  {
    id: 'TC003',
    title: 'Delete a task from the to-do list',
    preconditions: 'User is on the to-do list application with at least one task',
    steps: [
      'Click the delete (trash) icon next to a task'
    ],
    expectedResult: 'The task should be removed from the to-do list',
    priority: 'Medium',
    status: 'Passed'
  },
  {
    id: 'TC004',
    title: 'Filter tasks by completion status',
    preconditions: 'User is on the to-do list application with both completed and uncompleted tasks',
    steps: [
      'Click the "Active" filter button'
    ],
    expectedResult: 'Only uncompleted tasks should be displayed',
    priority: 'Medium',
    status: 'Not Run'
  },
  {
    id: 'TC005',
    title: 'Add a task with empty input',
    preconditions: 'User is on the to-do list application',
    steps: [
      'Leave the task input field empty',
      'Click the "Add Task" button'
    ],
    expectedResult: 'An error message should be displayed, and no task should be added',
    priority: 'Low',
    status: 'Blocked'
  }
];

// Bug Reports Data
export const bugReports: BugReport[] = [
  {
    id: 'BUG001',
    title: 'Completed tasks not showing strikethrough styling',
    severity: 'Minor',
    status: 'Open',
    stepsToReproduce: [
      'Add a new task',
      'Mark the task as completed by clicking the checkbox'
    ],
    expectedResult: 'Task text should have strikethrough styling',
    actualResult: 'Task text remains unchanged when marked as completed',
    affectedArea: 'Task Display',
    reportedDate: '2023-06-15'
  },
  {
    id: 'BUG002',
    title: 'Filter buttons not highlighting when selected',
    severity: 'Minor',
    status: 'Fixed',
    stepsToReproduce: [
      'Add multiple tasks and complete some of them',
      'Click on the "Active" filter button'
    ],
    expectedResult: 'The "Active" button should be highlighted to indicate it is selected',
    actualResult: 'No visual indication of which filter is currently selected',
    affectedArea: 'Filtering UI',
    reportedDate: '2023-06-16'
  },
  {
    id: 'BUG003',
    title: 'Task counter shows incorrect count',
    severity: 'Major',
    status: 'Open',
    stepsToReproduce: [
      'Add 3 tasks',
      'Complete 1 task',
      'Delete 1 uncompleted task'
    ],
    expectedResult: 'Counter should show "1 item left"',
    actualResult: 'Counter shows "2 items left"',
    affectedArea: 'Task Counter',
    reportedDate: '2023-06-17'
  },
  {
    id: 'BUG004',
    title: 'Double-clicking a task does not enable edit mode',
    severity: 'Major',
    status: 'Open',
    stepsToReproduce: [
      'Add a task',
      'Double-click on the task text'
    ],
    expectedResult: 'Task should become editable',
    actualResult: 'Nothing happens when double-clicking a task',
    affectedArea: 'Task Editing',
    reportedDate: '2023-06-18'
  },
  {
    id: 'BUG005',
    title: 'Application crashes when adding a task with more than 100 characters',
    severity: 'Critical',
    status: 'Fixed',
    stepsToReproduce: [
      'Enter a task with more than 100 characters',
      'Click the "Add Task" button'
    ],
    expectedResult: 'Task should be added or error message displayed',
    actualResult: 'Application crashes with a JavaScript error',
    affectedArea: 'Task Creation',
    reportedDate: '2023-06-19'
  }
];

// Automation Scripts Data
export const automationScripts: AutomationScript[] = [
  {
    id: 'AS001',
    title: 'Add Task Test',
    description: 'Verifies that a new task can be added to the to-do list',
    language: 'javascript',
    framework: 'Cypress',
    code: `describe('Todo App - Add Task', () => {
  beforeEach(() => {
    cy.visit('/testing-playground');
  });

  it('should add a new task to the list', () => {
    const taskText = 'New test task';
    
    // Type task text and submit
    cy.get('[data-testid="task-input"]').type(taskText);
    cy.get('[data-testid="add-task-btn"]').click();
    
    // Verify task was added
    cy.get('[data-testid="task-list"]')
      .should('contain', taskText);
    
    // Verify task count increased
    cy.get('[data-testid="items-left"]')
      .should('contain', '1 item left');
  });
});`
  },
  {
    id: 'AS002',
    title: 'Complete Task Test',
    description: 'Verifies that tasks can be marked as completed',
    language: 'typescript',
    framework: 'Playwright',
    code: `import { test, expect } from '@playwright/test';

test('should mark a task as completed', async ({ page }) => {
  // Navigate to the testing playground
  await page.goto('/testing-playground');
  
  // Add a new task
  await page.fill('[data-testid="task-input"]', 'Task to complete');
  await page.click('[data-testid="add-task-btn"]');
  
  // Mark the task as completed
  await page.click('[data-testid="task-checkbox"]');
  
  // Verify the task is marked as completed
  const completedTask = page.locator('.completed-task');
  await expect(completedTask).toBeVisible();
  await expect(completedTask).toHaveText('Task to complete');
  
  // Verify the counter updated
  await expect(page.locator('[data-testid="items-left"]'))
    .toHaveText('0 items left');
});`
  },
  {
    id: 'AS003',
    title: 'Filter Tasks Test',
    description: 'Verifies that tasks can be filtered by their completion status',
    language: 'javascript',
    framework: 'Jest',
    code: `import { render, screen, fireEvent } from '@testing-library/react';
import TodoApp from '../components/playground/DemoApp';

test('should filter tasks correctly', () => {
  // Render the component
  render(<TodoApp />);
  
  // Add two tasks
  const input = screen.getByTestId('task-input');
  const addButton = screen.getByTestId('add-task-btn');
  
  fireEvent.change(input, { target: { value: 'Task 1' } });
  fireEvent.click(addButton);
  
  fireEvent.change(input, { target: { value: 'Task 2' } });
  fireEvent.click(addButton);
  
  // Complete the first task
  const firstTaskCheckbox = screen.getAllByTestId('task-checkbox')[0];
  fireEvent.click(firstTaskCheckbox);
  
  // Filter by active tasks
  const activeFilter = screen.getByText('Active');
  fireEvent.click(activeFilter);
  
  // Verify only the active task is visible
  expect(screen.getByText('Task 2')).toBeInTheDocument();
  expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
  
  // Filter by completed tasks
  const completedFilter = screen.getByText('Completed');
  fireEvent.click(completedFilter);
  
  // Verify only the completed task is visible
  expect(screen.getByText('Task 1')).toBeInTheDocument();
  expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
});`
  }
];

// Intentional bugs for the demo app
export const intentionalBugs = [
  {
    id: 'DEMO-BUG-001',
    description: 'Completed tasks do not show strikethrough styling',
    hint: 'Try marking a task as completed and observe the styling'
  },
  {
    id: 'DEMO-BUG-002',
    description: 'Task counter shows incorrect count after deleting a task',
    hint: 'Add multiple tasks, then delete one and check the counter'
  },
  {
    id: 'DEMO-BUG-003',
    description: 'Empty tasks can be added despite validation',
    hint: 'Try submitting a task with no text'
  },
  {
    id: 'DEMO-BUG-004',
    description: 'Filter buttons do not highlight when selected',
    hint: 'Click on different filter buttons and observe their appearance'
  }
];
