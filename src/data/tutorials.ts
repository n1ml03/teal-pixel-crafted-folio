/**
 * Tutorial data for the Testing Playground
 */

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  content: string;
  tip?: string;
  warning?: string;
  hasCodeEditor?: boolean;
  initialCode?: string;
  codeLanguage?: 'javascript' | 'typescript' | 'html' | 'css' | 'json' | 'python' | 'markdown';
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'functional' | 'accessibility' | 'performance' | 'security' | 'api';
  duration: string;
  steps: TutorialStep[];
}

export const tutorials: Tutorial[] = [
  // First Challenge Tutorial
  {
    id: 'tutorial-first-challenge',
    title: 'Completing Your First Challenge',
    description: 'Learn how to navigate and complete a testing challenge in the Testing Playground',
    difficulty: 'beginner',
    category: 'functional',
    duration: '10-15 min',
    steps: [
      {
        id: 'first-challenge-step-1',
        title: 'Understanding the Challenge Interface',
        description: 'Get familiar with the challenge interface and its components',
        content: `
          <p>Welcome to your first Testing Playground challenge! Let's start by understanding the interface.</p>
          
          <p>The challenge screen is divided into two main panels:</p>
          
          <h3>Left Panel: Instructions</h3>
          <p>This panel contains:</p>
          <ul>
            <li><strong>Challenge Title and Description</strong> - Overview of what you'll be testing</li>
            <li><strong>Objectives</strong> - Specific tasks you need to complete</li>
            <li><strong>Progress Tracker</strong> - Shows your completion status</li>
            <li><strong>Hints</strong> - Optional help if you get stuck</li>
            <li><strong>Custom Test Script Editor</strong> - Where you can write test code</li>
          </ul>
          
          <h3>Right Panel: Testing Environment</h3>
          <p>This panel contains:</p>
          <ul>
            <li><strong>Application Viewer</strong> - The web application you'll be testing</li>
            <li><strong>Console</strong> - Shows output from your tests and application</li>
            <li><strong>Network</strong> - Monitors network requests</li>
            <li><strong>Elements</strong> - Lets you inspect the DOM structure</li>
            <li><strong>Tests</strong> - Shows results of your test runs</li>
          </ul>
          
          <p>Take a moment to explore these panels and get comfortable with the layout.</p>
        `,
        tip: 'You can resize the panels by dragging the divider between them.'
      },
      {
        id: 'first-challenge-step-2',
        title: 'Reading Challenge Objectives',
        description: 'Learn how to understand and approach challenge objectives',
        content: `
          <p>Each challenge has specific objectives you need to complete. These are listed in the left panel under "Objectives".</p>
          
          <p>Objectives typically include:</p>
          <ul>
            <li>Finding specific elements on the page</li>
            <li>Testing functionality (buttons, forms, etc.)</li>
            <li>Checking for accessibility issues</li>
            <li>Monitoring network requests</li>
            <li>Evaluating performance metrics</li>
          </ul>
          
          <p>To complete an objective:</p>
          <ol>
            <li>Read the objective carefully to understand what you need to test</li>
            <li>Use the Testing Environment to perform the necessary actions</li>
            <li>Check the checkbox next to the objective when you've completed it</li>
          </ol>
          
          <p>Your progress is automatically saved if you're logged in, so you can return to a challenge later.</p>
        `,
        tip: 'Start with the simplest objectives first to build momentum.'
      },
      {
        id: 'first-challenge-step-3',
        title: 'Using the Testing Environment',
        description: 'Learn how to interact with the application and use testing tools',
        content: `
          <p>The Testing Environment is where you'll interact with the application and perform your tests.</p>
          
          <h3>Basic Interactions:</h3>
          <ul>
            <li><strong>Clicking and Typing</strong> - Interact directly with the application in the viewer</li>
            <li><strong>URL Bar</strong> - Enter URLs to navigate to different pages</li>
            <li><strong>Device Selector</strong> - Switch between desktop, tablet, and mobile views</li>
            <li><strong>Screenshot</strong> - Capture the current state of the application</li>
          </ul>
          
          <h3>Testing Tools:</h3>
          <ul>
            <li><strong>Console Tab</strong> - View console output and run JavaScript commands</li>
            <li><strong>Network Tab</strong> - Monitor HTTP requests and responses</li>
            <li><strong>Elements Tab</strong> - Inspect and interact with the DOM</li>
            <li><strong>Tests Tab</strong> - Run and view test results</li>
          </ul>
          
          <p>Try interacting with the application now. Click around, fill out forms, and explore the different tabs in the Testing Environment.</p>
        `,
        warning: 'The Testing Environment is sandboxed for security. Some features like file downloads may be restricted.'
      },
      {
        id: 'first-challenge-step-4',
        title: 'Writing Your First Test Script',
        description: 'Learn how to write and run a simple test script',
        content: `
          <p>Now let's write a simple test script to check if an element exists on the page.</p>
          
          <p>In the left panel, scroll down to find the "Custom Test Script" section with a code editor.</p>
          
          <p>Here's a basic test script structure:</p>
          
          <pre><code>// Test if the header exists
console.log('Testing if header exists...');
const header = testElement('header');
if (header.exists()) {
  console.log('✅ Header found');
} else {
  console.log('❌ Header not found');
}</code></pre>
          
          <p>This script:</p>
          <ol>
            <li>Logs a message to the console</li>
            <li>Uses the <code>testElement()</code> function to select the header</li>
            <li>Checks if the header exists</li>
            <li>Logs the result</li>
          </ol>
          
          <p>Try writing this script in the code editor, then click the "Run" button to execute it.</p>
        `,
        hasCodeEditor: true,
        initialCode: `// Write your test script here
console.log('Testing if header exists...');
const header = testElement('header');
if (header.exists()) {
  console.log('✅ Header found');
} else {
  console.log('❌ Header not found');
}`,
        codeLanguage: 'javascript'
      },
      {
        id: 'first-challenge-step-5',
        title: 'Completing and Submitting the Challenge',
        description: 'Learn how to mark objectives as complete and submit your challenge',
        content: `
          <p>Once you've completed all the objectives for a challenge, it's time to submit your work.</p>
          
          <h3>Completing Objectives:</h3>
          <ol>
            <li>Check the box next to each objective you've completed</li>
            <li>Verify that your progress bar shows 100% completion</li>
            <li>Review your work to make sure you haven't missed anything</li>
          </ol>
          
          <h3>Submitting the Challenge:</h3>
          <ol>
            <li>Click the "Submit" button at the bottom of the instructions panel</li>
            <li>If all objectives are complete, you'll see a success message</li>
            <li>If some objectives are incomplete, you'll be prompted to complete them</li>
          </ol>
          
          <p>After successful submission:</p>
          <ul>
            <li>Your completion is recorded in your profile</li>
            <li>You earn points and possibly achievements</li>
            <li>You can view your results and compare with others</li>
            <li>You can return to the dashboard to select another challenge</li>
          </ul>
          
          <p>Congratulations! You now know how to complete a challenge in the Testing Playground.</p>
        `,
        tip: 'Don\'t forget to save your work periodically using the "Save" button, especially for longer challenges.'
      }
    ]
  },
  
  // Accessibility Testing Tutorial
  {
    id: 'tutorial-accessibility-testing',
    title: 'Introduction to Accessibility Testing',
    description: 'Learn the basics of testing web applications for accessibility compliance',
    difficulty: 'beginner',
    category: 'accessibility',
    duration: '20-25 min',
    steps: [
      {
        id: 'accessibility-step-1',
        title: 'Understanding Web Accessibility',
        description: 'Learn why accessibility is important and the key principles',
        content: `
          <p>Web accessibility ensures that websites and applications can be used by people with disabilities. This includes users with visual, auditory, motor, or cognitive impairments.</p>
          
          <h3>Why Accessibility Matters:</h3>
          <ul>
            <li><strong>Inclusivity</strong> - Ensures everyone can use your application</li>
            <li><strong>Legal Compliance</strong> - Many countries have laws requiring accessibility</li>
            <li><strong>Better UX for Everyone</strong> - Accessible design often improves usability for all users</li>
            <li><strong>SEO Benefits</strong> - Many accessibility practices also improve search engine optimization</li>
          </ul>
          
          <h3>Key Accessibility Principles (WCAG):</h3>
          <ul>
            <li><strong>Perceivable</strong> - Information must be presentable to users in ways they can perceive</li>
            <li><strong>Operable</strong> - User interface components must be operable by all users</li>
            <li><strong>Understandable</strong> - Information and operation must be understandable</li>
            <li><strong>Robust</strong> - Content must be robust enough to work with various assistive technologies</li>
          </ul>
          
          <p>In this tutorial, you'll learn how to test for common accessibility issues using the Testing Playground.</p>
        `
      },
      {
        id: 'accessibility-step-2',
        title: 'Testing for Keyboard Accessibility',
        description: 'Learn how to test if a website can be used with keyboard only',
        content: `
          <p>Many users with motor disabilities rely on keyboards or keyboard alternatives to navigate websites. Testing keyboard accessibility is a fundamental part of accessibility testing.</p>
          
          <h3>Key Keyboard Accessibility Requirements:</h3>
          <ul>
            <li>All interactive elements must be focusable using the Tab key</li>
            <li>Focus order should be logical and follow the visual layout</li>
            <li>Focus indicators must be visible</li>
            <li>All functionality should be operable using keyboard alone</li>
            <li>No keyboard traps (where focus cannot escape an element)</li>
          </ul>
          
          <h3>How to Test Keyboard Accessibility:</h3>
          <ol>
            <li>Start at the top of the page</li>
            <li>Press Tab repeatedly to move through interactive elements</li>
            <li>Verify that focus moves in a logical order</li>
            <li>Check that focus is clearly visible at all times</li>
            <li>Test all functionality using only keyboard commands (Tab, Enter, Space, Arrow keys)</li>
          </ol>
          
          <p>Try testing keyboard accessibility on the sample application in the Testing Environment.</p>
        `,
        tip: 'Common keyboard commands: Tab (next element), Shift+Tab (previous element), Enter (activate links/buttons), Space (check/uncheck checkboxes, activate buttons)'
      },
      {
        id: 'accessibility-step-3',
        title: 'Testing Alternative Text for Images',
        description: 'Learn how to verify that images have appropriate alternative text',
        content: `
          <p>Alternative text (alt text) provides a textual alternative to non-text content like images. This is essential for users with visual impairments who use screen readers.</p>
          
          <h3>Guidelines for Alt Text:</h3>
          <ul>
            <li>All informative images should have descriptive alt text</li>
            <li>Decorative images should have empty alt text (alt="")</li>
            <li>Alt text should be concise but descriptive</li>
            <li>Alt text should convey the purpose/content of the image, not just describe it</li>
            <li>Complex images (charts, diagrams) may need longer descriptions</li>
          </ul>
          
          <h3>How to Test Alt Text:</h3>
          <ol>
            <li>Inspect image elements using the Elements tab</li>
            <li>Check if images have alt attributes</li>
            <li>Evaluate if the alt text accurately describes the image's purpose</li>
            <li>Verify that decorative images have empty alt text</li>
          </ol>
          
          <p>Let's write a simple test script to check for images without alt text:</p>
        `,
        hasCodeEditor: true,
        initialCode: `// Test for images without alt text
console.log('Testing for images without alt text...');
const images = document.querySelectorAll('img');
let imagesWithoutAlt = 0;

images.forEach((img, index) => {
  if (!img.hasAttribute('alt')) {
    console.log(\`❌ Image #\${index + 1} is missing alt text: \${img.src}\`);
    imagesWithoutAlt++;
  }
});

if (imagesWithoutAlt === 0) {
  console.log('✅ All images have alt attributes');
} else {
  console.log(\`❌ Found \${imagesWithoutAlt} images without alt text\`);
}`,
        codeLanguage: 'javascript'
      },
      {
        id: 'accessibility-step-4',
        title: 'Testing Color Contrast',
        description: 'Learn how to check if text has sufficient contrast with its background',
        content: `
          <p>Sufficient color contrast between text and its background is essential for users with low vision or color blindness.</p>
          
          <h3>WCAG Contrast Requirements:</h3>
          <ul>
            <li><strong>AA Level</strong> (minimum):
              <ul>
                <li>Text: Contrast ratio of at least 4.5:1</li>
                <li>Large Text (18pt+): Contrast ratio of at least 3:1</li>
              </ul>
            </li>
            <li><strong>AAA Level</strong> (enhanced):
              <ul>
                <li>Text: Contrast ratio of at least 7:1</li>
                <li>Large Text (18pt+): Contrast ratio of at least 4.5:1</li>
              </ul>
            </li>
          </ul>
          
          <h3>How to Test Contrast:</h3>
          <ol>
            <li>Use the Elements tab to inspect text elements</li>
            <li>Note the text color and background color</li>
            <li>Use a contrast checker tool to calculate the ratio</li>
            <li>Verify that the ratio meets WCAG requirements</li>
          </ol>
          
          <p>In a real testing scenario, you would use browser extensions or specialized tools to check contrast ratios automatically.</p>
        `,
        warning: 'Don\'t rely solely on visual inspection for contrast issues. Always use a contrast checker tool for accurate results.'
      },
      {
        id: 'accessibility-step-5',
        title: 'Testing Form Accessibility',
        description: 'Learn how to verify that forms are accessible to all users',
        content: `
          <p>Forms are often critical interaction points in web applications, and they need to be accessible to all users.</p>
          
          <h3>Key Form Accessibility Requirements:</h3>
          <ul>
            <li>All form controls must have associated labels</li>
            <li>Required fields should be clearly indicated</li>
            <li>Error messages must be clear and programmatically associated with fields</li>
            <li>Form controls must be keyboard accessible</li>
            <li>Instructions should be provided where needed</li>
          </ul>
          
          <h3>How to Test Form Accessibility:</h3>
          <ol>
            <li>Check that all form controls have visible, associated labels</li>
            <li>Verify that labels are programmatically associated using the 'for' attribute or nesting</li>
            <li>Test form submission with invalid data to check error handling</li>
            <li>Ensure the form can be completed using keyboard only</li>
            <li>Check that focus moves to the first error when validation fails</li>
          </ol>
          
          <p>Let's write a test script to check for form inputs without labels:</p>
        `,
        hasCodeEditor: true,
        initialCode: `// Test for form inputs without associated labels
console.log('Testing for form inputs without labels...');
const inputs = document.querySelectorAll('input, select, textarea');
let inputsWithoutLabels = 0;

inputs.forEach((input, index) => {
  const id = input.getAttribute('id');
  if (!id) {
    console.log(\`❌ Input #\${index + 1} has no ID attribute\`);
    inputsWithoutLabels++;
    return;
  }
  
  const label = document.querySelector(\`label[for="\${id}"]\`);
  if (!label) {
    console.log(\`❌ No label found for input with ID: \${id}\`);
    inputsWithoutLabels++;
  }
});

if (inputsWithoutLabels === 0) {
  console.log('✅ All form controls have associated labels');
} else {
  console.log(\`❌ Found \${inputsWithoutLabels} form controls without proper labels\`);
}`,
        codeLanguage: 'javascript'
      }
    ]
  }
];

export default tutorials;
