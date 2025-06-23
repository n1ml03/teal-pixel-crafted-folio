/**
 * Help content for the Testing Playground
 */

export interface HelpItem {
  id: string;
  title: string;
  category: 'getting-started' | 'testing-environment' | 'bug-reporting';
  content: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'account' | 'challenges' | 'technical';
}

export const helpContent: HelpItem[] = [
  // Getting Started
  {
    id: 'gs-1',
    title: 'Welcome to Testing Playground',
    category: 'getting-started',
    content: `
      <p>Testing Playground is an interactive platform designed to help you learn and practice web testing skills in a safe, controlled environment.</p>

      <p>Here's what you can do with Testing Playground:</p>
      <ul>
        <li>Complete testing challenges to improve your skills</li>
        <li>Use the sandbox environment to practice testing techniques</li>
        <li>Track your progress and earn achievements</li>
        <li>Compete with others on the leaderboard</li>
      </ul>

      <p>To get started, navigate to the Dashboard and select a challenge that interests you, or try the Sandbox environment to experiment freely.</p>
    `
  },
  {
    id: 'gs-2',
    title: 'Navigating the Platform',
    category: 'getting-started',
    content: `
      <p>The Testing Playground platform has several main sections:</p>

      <ul>
        <li><strong>Dashboard</strong> - Your home base with challenges and progress tracking</li>
        <li><strong>Challenges</strong> - Structured testing exercises with specific objectives</li>
        <li><strong>Sandbox</strong> - An open environment for practicing testing techniques</li>
        <li><strong>Leaderboard</strong> - See how you rank compared to other users</li>
        <li><strong>Help & Support</strong> - Documentation and assistance</li>
      </ul>

      <p>Use the navigation bar at the top of the page to move between these sections.</p>
    `
  },
  {
    id: 'gs-3',
    title: 'Understanding Challenges',
    category: 'getting-started',
    content: `
      <p>Challenges are structured testing exercises designed to help you practice specific testing skills.</p>

      <p>Each challenge includes:</p>
      <ul>
        <li><strong>Objectives</strong> - Specific tasks you need to complete</li>
        <li><strong>Instructions</strong> - Guidance on how to approach the challenge</li>
        <li><strong>Testing Environment</strong> - A sandbox where you can interact with the target application</li>
        <li><strong>Hints</strong> - Optional help if you get stuck</li>
      </ul>

      <p>To complete a challenge, work through each objective and mark them as completed. Your progress is automatically saved if you're logged in.</p>
    `
  },
  {
    id: 'gs-4',
    title: 'Your User Profile',
    category: 'getting-started',
    content: `
      <p>Your user profile tracks your progress and achievements across the Testing Playground.</p>

      <p>Key profile features include:</p>
      <ul>
        <li><strong>Level</strong> - Increases as you complete challenges and earn points</li>
        <li><strong>Badges</strong> - Special achievements for accomplishing specific goals</li>
        <li><strong>Challenge History</strong> - Record of challenges you've attempted and completed</li>
        <li><strong>Activity Log</strong> - Timeline of your recent actions on the platform</li>
      </ul>

      <p>Access your profile through the user menu in the top-right corner of the navigation bar.</p>
    `
  },

  // Testing Environment
  {
    id: 'te-1',
    title: 'Testing Environment Overview',
    category: 'testing-environment',
    content: `
      <p>The Testing Environment is a powerful tool that allows you to interact with web applications and perform various testing activities.</p>

      <p>Key components of the Testing Environment include:</p>
      <ul>
        <li><strong>Application Viewer</strong> - Displays the target web application</li>
        <li><strong>Console</strong> - Shows console output and allows you to run JavaScript commands</li>
        <li><strong>Network Monitor</strong> - Tracks network requests and responses</li>
        <li><strong>Elements Inspector</strong> - Allows you to examine the DOM structure</li>
        <li><strong>Test Runner</strong> - Executes test scripts against the application</li>
      </ul>

      <p>Use the tabs at the top of the Testing Environment to switch between these different views.</p>
    `
  },
  {
    id: 'te-2',
    title: 'Writing Test Scripts',
    category: 'testing-environment',
    content: `
      <p>The Testing Playground provides a code editor where you can write and run test scripts against the target application.</p>

      <p>Basic test script structure:</p>
      <pre><code>// Example test script
console.log('Testing if header exists...');
const header = testElement('header');
if (header.exists()) {
  console.log('✅ Header found');
} else {
  console.log('❌ Header not found');
}</code></pre>

      <p>Available testing functions:</p>
      <ul>
        <li><code>testElement(selector)</code> - Select an element for testing</li>
        <li><code>testRequest(url)</code> - Test network requests</li>
        <li><code>testAccessibility()</code> - Run accessibility checks</li>
        <li><code>testPerformance()</code> - Measure performance metrics</li>
      </ul>

      <p>Click the "Run" button to execute your test script against the current application state.</p>
    `
  },
  {
    id: 'te-3',
    title: 'Device Simulation',
    category: 'testing-environment',
    content: `
      <p>The Testing Environment allows you to simulate different devices to test responsive design and mobile-specific behaviors.</p>

      <p>Available device options:</p>
      <ul>
        <li><strong>Desktop</strong> - Standard desktop viewport</li>
        <li><strong>Tablet</strong> - Simulates tablet dimensions</li>
        <li><strong>Mobile</strong> - Simulates smartphone dimensions</li>
      </ul>

      <p>You can also customize the viewport dimensions manually using the width and height controls.</p>

      <p>Device simulation affects:</p>
      <ul>
        <li>Viewport size</li>
        <li>User-Agent header</li>
        <li>Touch event simulation</li>
      </ul>
    `
  },
  {
    id: 'te-4',
    title: 'Network Monitoring',
    category: 'testing-environment',
    content: `
      <p>The Network tab in the Testing Environment allows you to monitor all network requests made by the application.</p>

      <p>Key features:</p>
      <ul>
        <li>View all HTTP requests and responses</li>
        <li>Inspect request headers, parameters, and body</li>
        <li>Examine response status, headers, and content</li>
        <li>Filter requests by type, status, or domain</li>
        <li>Simulate network conditions (throttling)</li>
      </ul>

      <p>This is particularly useful for API testing, performance analysis, and debugging network-related issues.</p>
    `
  },

  // Bug Reporting
  {
    id: 'br-1',
    title: 'Bug Reporting Basics',
    category: 'bug-reporting',
    content: `
      <p>Effective bug reporting is a critical skill for any tester. The Testing Playground includes a Bug Reporting Tool to help you practice documenting issues.</p>

      <p>A good bug report includes:</p>
      <ul>
        <li><strong>Title</strong> - Clear, concise summary of the issue</li>
        <li><strong>Description</strong> - Detailed explanation of the problem</li>
        <li><strong>Steps to Reproduce</strong> - Numbered steps to recreate the issue</li>
        <li><strong>Expected Result</strong> - What should happen</li>
        <li><strong>Actual Result</strong> - What actually happens</li>
        <li><strong>Environment</strong> - Browser, device, OS, etc.</li>
        <li><strong>Screenshots/Videos</strong> - Visual evidence of the issue</li>
        <li><strong>Severity/Priority</strong> - How serious and urgent the issue is</li>
      </ul>

      <p>Use the Bug Reporting Tool in the Testing Environment to practice creating comprehensive bug reports.</p>
    `
  },
  {
    id: 'br-2',
    title: 'Taking Effective Screenshots',
    category: 'bug-reporting',
    content: `
      <p>Screenshots are a crucial part of bug reporting, providing visual evidence of issues that might be difficult to describe in words.</p>

      <p>Tips for effective screenshots:</p>
      <ul>
        <li>Capture the entire relevant area, not just a small portion</li>
        <li>Use annotations (arrows, circles, text) to highlight specific elements</li>
        <li>Include context (URL bar, browser info) when relevant</li>
        <li>For complex issues, take multiple screenshots showing the sequence of events</li>
        <li>Consider recording a short video for issues involving animation or interaction</li>
      </ul>

      <p>The Testing Environment includes a Screenshot tool that allows you to capture the current state of the application for your bug reports.</p>
    `
  },
  {
    id: 'br-3',
    title: 'Determining Bug Severity',
    category: 'bug-reporting',
    content: `
      <p>Properly categorizing bug severity helps development teams prioritize their work effectively.</p>

      <p>Common severity levels:</p>
      <ul>
        <li><strong>Critical</strong> - Application crash, data loss, security vulnerability, or complete feature failure</li>
        <li><strong>High</strong> - Major functionality is impacted, but workarounds may exist</li>
        <li><strong>Medium</strong> - Functionality issue with reasonable workarounds available</li>
        <li><strong>Low</strong> - Minor issues like cosmetic problems, typos, or non-critical functionality issues</li>
      </ul>

      <p>When reporting bugs in the Testing Playground, practice assigning appropriate severity levels based on the impact of the issue.</p>
    `
  },
  {
    id: 'br-4',
    title: 'Writing Clear Reproduction Steps',
    category: 'bug-reporting',
    content: `
      <p>Clear, detailed steps to reproduce are essential for developers to understand and fix bugs efficiently.</p>

      <p>Guidelines for writing reproduction steps:</p>
      <ul>
        <li>Start from a known, clean state (e.g., "Start from the homepage")</li>
        <li>Number each step sequentially</li>
        <li>Be specific about user actions (e.g., "Click the Submit button" not "Submit the form")</li>
        <li>Include any necessary test data or preconditions</li>
        <li>Specify the exact location of elements when needed</li>
        <li>Keep steps atomic and focused on one action each</li>
      </ul>

      <p>Example:</p>
      <ol>
        <li>Navigate to https://example.com/login</li>
        <li>Enter "testuser" in the Username field</li>
        <li>Enter "password123" in the Password field</li>
        <li>Click the "Login" button</li>
      </ol>
    `
  }
];

export const faqs: FAQ[] = [
  {
    id: 'faq-1',
    question: 'What is Testing Playground?',
    answer: 'Testing Playground is an interactive platform designed to help you learn and practice web testing skills in a safe, controlled environment. It includes challenges, a sandbox environment where you can experiment with different testing techniques, and a leaderboard to track your progress.',
    category: 'general'
  },
  {
    id: 'faq-2',
    question: 'Do I need to create an account?',
    answer: 'While you can explore some features without an account, creating a free account allows you to track your progress, save your work, earn achievements, and appear on the leaderboard.',
    category: 'account'
  },
  {
    id: 'faq-3',
    question: 'How do challenges work?',
    answer: 'Challenges are structured testing exercises with specific objectives. Each challenge provides a target application and a set of testing tasks to complete. As you complete objectives, your progress is tracked, and you earn points and achievements.',
    category: 'challenges'
  },
  {
    id: 'faq-4',
    question: 'What programming languages are supported in the code editor?',
    answer: 'The code editor currently supports JavaScript, TypeScript, HTML, CSS, JSON, Python, and Markdown. For testing scripts, JavaScript is the primary language used.',
    category: 'technical'
  },
  {
    id: 'faq-5',
    question: 'Can I save my work and continue later?',
    answer: 'Yes, if you\'re logged in, your progress is automatically saved. You can leave a challenge and return later to continue where you left off.',
    category: 'general'
  },
  {
    id: 'faq-6',
    question: 'How do I report issues with the platform itself?',
    answer: 'If you encounter any issues with the Testing Playground platform, please use the "Report Issue" option in the user menu (top-right corner) or contact support at support@testingplayground.com.',
    category: 'general'
  },
  {
    id: 'faq-7',
    question: 'Are the applications in the Testing Playground real?',
    answer: 'The applications in the Testing Playground are simulated environments designed specifically for learning and practice. They mimic real-world applications but are contained within the platform for safety and educational purposes.',
    category: 'technical'
  },
  {
    id: 'faq-8',
    question: 'How do I reset my password?',
    answer: 'To reset your password, click on "Forgot Password" on the login page. Enter your email address, and you\'ll receive instructions to create a new password.',
    category: 'account'
  },
  {
    id: 'faq-9',
    question: 'Can I create my own challenges?',
    answer: 'Currently, only platform administrators can create official challenges. However, we\'re working on a feature that will allow users to create and share custom challenges in the future.',
    category: 'challenges'
  },
  {
    id: 'faq-10',
    question: 'What browsers are supported?',
    answer: 'Testing Playground works best in modern browsers like Chrome, Firefox, Safari, and Edge. We recommend using the latest version of these browsers for the best experience.',
    category: 'technical'
  }
];

export default { helpContent, faqs };
