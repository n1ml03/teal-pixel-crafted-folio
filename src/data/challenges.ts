import { ChallengeWithTests } from '../services/ChallengeService';
import { TestResult } from '../types/playground';

// Type definitions for testing environment
interface ConsoleLog {
  type: string;
  message: string;
  timestamp: number;
}

interface NetworkRequest {
  url: string;
  method: string;
  status?: number;
  timestamp: number;
}

interface ElementInfo {
  tagName: string;
  id?: string;
  className?: string;
  attributes?: Record<string, string>;
}

// Type alias for the testing environment used in challenge tests
type TestingEnvironment = {
  iframe: HTMLIFrameElement | null;
  url: string;
  device: 'desktop' | 'tablet' | 'mobile';
  consoleLogs: ConsoleLog[];
  networkRequests: NetworkRequest[];
  elements: ElementInfo[];
};

// Challenge 1: Accessibility Testing
const accessibilityChallenge: ChallengeWithTests = {
  id: 'challenge-accessibility-1',
  title: 'Web Accessibility Testing Fundamentals',
  description: 'Learn how to test websites for accessibility compliance, ensuring they work for users with disabilities.',
  thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2076&h=1384&auto=format&fit=crop',
  difficulty: 'intermediate',
  duration: '30-40 min',
  tags: ['Accessibility', 'WCAG', 'Screen Readers'],
  category: 'Accessibility Testing',
  featured: false,
  objectives: [
    {
      id: 'acc-obj-1',
      description: 'Identify missing alt text on images',
      required: true
    },
    {
      id: 'acc-obj-2',
      description: 'Check for proper heading structure',
      required: true
    },
    {
      id: 'acc-obj-3',
      description: 'Verify keyboard navigation functionality',
      required: true
    },
    {
      id: 'acc-obj-4',
      description: 'Test color contrast ratios',
      required: true
    },
    {
      id: 'acc-obj-5',
      description: 'Validate form labels and error messages',
      required: false
    }
  ],
  tests: [
    {
      id: 'acc-test-1',
      name: 'Image Alt Text Test',
      description: 'Checks if all images have appropriate alt text',
      weight: 20,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        // In a real implementation, this would analyze the DOM
        // For demo purposes, we'll simulate the test
        return {
          passed: true,
          message: 'All images have appropriate alt text',
          details: 'Found 5 images, all with descriptive alt text.'
        };
      }
    },
    {
      id: 'acc-test-2',
      name: 'Heading Structure Test',
      description: 'Validates proper heading hierarchy (h1, h2, etc.)',
      weight: 20,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: false,
          message: 'Heading structure is not sequential',
          details: 'Found h1 followed by h3, missing h2 level. Headings should follow a logical sequence.'
        };
      }
    },
    {
      id: 'acc-test-3',
      name: 'Keyboard Navigation Test',
      description: 'Checks if all interactive elements are keyboard accessible',
      weight: 25,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: true,
          message: 'All interactive elements are keyboard accessible',
          details: 'Successfully navigated through all 12 interactive elements using Tab key.'
        };
      }
    },
    {
      id: 'acc-test-4',
      name: 'Color Contrast Test',
      description: 'Verifies that text has sufficient contrast with its background',
      weight: 20,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: false,
          message: 'Some text elements have insufficient contrast',
          details: 'Found 3 instances of text with contrast ratio below 4.5:1, which fails WCAG AA standards.'
        };
      }
    },
    {
      id: 'acc-test-5',
      name: 'Form Accessibility Test',
      description: 'Checks if forms have proper labels and accessible error messages',
      weight: 15,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: true,
          message: 'Forms have proper labels and accessible error messages',
          details: 'All 4 form fields have associated labels and error messages are announced to screen readers.'
        };
      }
    }
  ],
  hints: [
    {
      id: 'acc-hint-1',
      level: 'basic',
      content: 'Use browser developer tools to inspect image elements and check for alt attributes.'
    },
    {
      id: 'acc-hint-2',
      level: 'basic',
      content: 'Headings should follow a logical hierarchy. A page should have one h1, followed by h2s, then h3s within h2 sections, etc.'
    },
    {
      id: 'acc-hint-3',
      level: 'detailed',
      content: 'To test keyboard navigation, use Tab to move between elements, Enter to activate buttons, and Space for checkboxes. Make sure you can access all interactive elements.'
    },
    {
      id: 'acc-hint-4',
      level: 'detailed',
      content: 'Use a contrast checker tool to verify that text has sufficient contrast with its background. WCAG AA requires a ratio of at least 4.5:1 for normal text.'
    },
    {
      id: 'acc-hint-5',
      level: 'solution',
      content: 'The page has images missing alt text in the carousel section. The heading structure skips from h1 to h3 in the "Features" section. The light gray text on the white background in the footer fails contrast requirements.'
    }
  ],
  passingScore: 70
};

// Challenge 2: Performance Testing
const performanceChallenge: ChallengeWithTests = {
  id: 'challenge-performance-1',
  title: 'Web Performance Testing Essentials',
  description: 'Learn how to identify performance bottlenecks, measure load times, and analyze resource usage in web applications.',
  thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&h=1380&auto=format&fit=crop',
  difficulty: 'advanced',
  duration: '45-60 min',
  tags: ['Performance', 'Load Testing', 'Optimization'],
  category: 'Performance Testing',
  featured: false,
  objectives: [
    {
      id: 'perf-obj-1',
      description: 'Measure page load time and identify slow resources',
      required: true
    },
    {
      id: 'perf-obj-2',
      description: 'Analyze render-blocking resources',
      required: true
    },
    {
      id: 'perf-obj-3',
      description: 'Identify unoptimized images',
      required: true
    },
    {
      id: 'perf-obj-4',
      description: 'Detect excessive DOM size',
      required: false
    },
    {
      id: 'perf-obj-5',
      description: 'Analyze JavaScript execution time',
      required: false
    }
  ],
  tests: [
    {
      id: 'perf-test-1',
      name: 'Page Load Time Test',
      description: 'Measures the total page load time and identifies slow resources',
      weight: 25,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: false,
          message: 'Page load time exceeds 3 seconds',
          details: 'Page loaded in 5.2 seconds. Main causes: large unoptimized images (2.3MB) and render-blocking JavaScript (1.5MB).'
        };
      }
    },
    {
      id: 'perf-test-2',
      name: 'Render-Blocking Resources Test',
      description: 'Identifies CSS and JavaScript files that block rendering',
      weight: 20,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: false,
          message: 'Found render-blocking resources',
          details: 'Detected 3 render-blocking CSS files and 2 render-blocking JavaScript files. Consider inlining critical CSS and deferring non-critical JavaScript.'
        };
      }
    },
    {
      id: 'perf-test-3',
      name: 'Image Optimization Test',
      description: 'Checks if images are properly sized and compressed',
      weight: 20,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: false,
          message: 'Images are not optimized',
          details: 'Found 5 unoptimized images that could be reduced by at least 40% in size. Hero image is 1.5MB but displayed at 600x400px.'
        };
      }
    },
    {
      id: 'perf-test-4',
      name: 'DOM Size Test',
      description: 'Checks if the DOM tree is too large or deeply nested',
      weight: 15,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: true,
          message: 'DOM size is acceptable',
          details: 'DOM contains 850 elements with a maximum depth of 10 levels, which is within acceptable limits.'
        };
      }
    },
    {
      id: 'perf-test-5',
      name: 'JavaScript Execution Test',
      description: 'Analyzes JavaScript execution time and identifies bottlenecks',
      weight: 20,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: false,
          message: 'JavaScript execution is too slow',
          details: 'Main thread was blocked for 620ms during page load. Identified a slow function in main.js that takes 350ms to execute.'
        };
      }
    }
  ],
  hints: [
    {
      id: 'perf-hint-1',
      level: 'basic',
      content: 'Use the Network tab in browser developer tools to analyze page load time and resource sizes.'
    },
    {
      id: 'perf-hint-2',
      level: 'basic',
      content: 'Look for CSS and JavaScript files loaded in the <head> without async or defer attributes.'
    },
    {
      id: 'perf-hint-3',
      level: 'detailed',
      content: 'Check image dimensions in the Network tab. If an image\'s file size is large but it\'s displayed small on the page, it\'s not optimized.'
    },
    {
      id: 'perf-hint-4',
      level: 'detailed',
      content: 'Use the Performance tab to record page load and analyze JavaScript execution time. Look for long tasks that block the main thread.'
    },
    {
      id: 'perf-hint-5',
      level: 'solution',
      content: 'The page has several performance issues: hero.jpg is 1.5MB but displayed at 600x400px, main.css (250KB) is render-blocking, and the carousel initialization in main.js takes 350ms to execute.'
    }
  ],
  passingScore: 60
};

// Challenge 3: Security Testing
const securityChallenge: ChallengeWithTests = {
  id: 'challenge-security-1',
  title: 'Web Security Testing Fundamentals',
  description: 'Learn how to identify common security vulnerabilities in web applications, including XSS, CSRF, and insecure authentication.',
  thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070&h=1380&auto=format&fit=crop',
  difficulty: 'advanced',
  duration: '50-60 min',
  tags: ['Security', 'XSS', 'CSRF', 'Authentication'],
  category: 'Security Testing',
  featured: true,
  objectives: [
    {
      id: 'sec-obj-1',
      description: 'Test for Cross-Site Scripting (XSS) vulnerabilities',
      required: true
    },
    {
      id: 'sec-obj-2',
      description: 'Check for Cross-Site Request Forgery (CSRF) protections',
      required: true
    },
    {
      id: 'sec-obj-3',
      description: 'Analyze authentication mechanisms for weaknesses',
      required: true
    },
    {
      id: 'sec-obj-4',
      description: 'Test for insecure direct object references',
      required: true
    },
    {
      id: 'sec-obj-5',
      description: 'Check for sensitive data exposure',
      required: false
    }
  ],
  tests: [
    {
      id: 'sec-test-1',
      name: 'XSS Vulnerability Test',
      description: 'Checks if the application is vulnerable to Cross-Site Scripting attacks',
      weight: 25,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: false,
          message: 'XSS vulnerability detected',
          details: 'Successfully injected script via the search form. Input "<script>alert(1)</script>" was rendered as executable JavaScript.'
        };
      }
    },
    {
      id: 'sec-test-2',
      name: 'CSRF Protection Test',
      description: 'Verifies if forms are protected against Cross-Site Request Forgery',
      weight: 20,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: false,
          message: 'Missing CSRF protection',
          details: 'The profile update form does not include a CSRF token or other protection mechanism.'
        };
      }
    },
    {
      id: 'sec-test-3',
      name: 'Authentication Security Test',
      description: 'Analyzes login mechanisms for security weaknesses',
      weight: 25,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: false,
          message: 'Insecure authentication detected',
          details: 'Login form submits credentials over HTTP instead of HTTPS. No account lockout after multiple failed attempts.'
        };
      }
    },
    {
      id: 'sec-test-4',
      name: 'Insecure Direct Object Reference Test',
      description: 'Checks if the application properly restricts access to resources',
      weight: 15,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: false,
          message: 'Insecure direct object reference detected',
          details: 'Changing the user ID in the URL (/profile?id=2) allows access to another user\'s profile without authorization.'
        };
      }
    },
    {
      id: 'sec-test-5',
      name: 'Sensitive Data Exposure Test',
      description: 'Checks if sensitive data is properly protected',
      weight: 15,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: true,
          message: 'No sensitive data exposure detected',
          details: 'All sensitive data appears to be properly encrypted and protected.'
        };
      }
    }
  ],
  hints: [
    {
      id: 'sec-hint-1',
      level: 'basic',
      content: 'Try entering JavaScript code like <script>alert("XSS")</script> in input fields to test for XSS vulnerabilities.'
    },
    {
      id: 'sec-hint-2',
      level: 'basic',
      content: 'Examine form submissions to check if they include anti-CSRF tokens. These are usually hidden input fields with random values.'
    },
    {
      id: 'sec-hint-3',
      level: 'detailed',
      content: 'Check if the login form uses HTTPS. Try multiple incorrect password attempts to see if there\'s an account lockout mechanism.'
    },
    {
      id: 'sec-hint-4',
      level: 'detailed',
      content: 'Look for URLs with resource identifiers (like IDs) and try changing them to access different resources. A secure application should verify authorization.'
    },
    {
      id: 'sec-hint-5',
      level: 'solution',
      content: 'The search form is vulnerable to XSS via the q parameter. The profile update form has no CSRF token. The login form uses HTTP instead of HTTPS. Changing the user ID in the profile URL allows unauthorized access.'
    }
  ],
  passingScore: 80
};

// Challenge 4: API Testing
const apiTestingChallenge: ChallengeWithTests = {
  id: 'challenge-api-1',
  title: 'RESTful API Testing Mastery',
  description: 'Learn to test REST APIs, validate responses, handle authentication, and verify data integrity across endpoints.',
  thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2000&h=1333&auto=format&fit=crop',
  difficulty: 'intermediate',
  duration: '40-50 min',
  tags: ['API', 'REST', 'Backend', 'JSON'],
  category: 'API Testing',
  featured: true,
  objectives: [
    {
      id: 'api-obj-1',
      description: 'Validate API endpoint response codes',
      required: true
    },
    {
      id: 'api-obj-2',
      description: 'Test API authentication mechanisms',
      required: true
    },
    {
      id: 'api-obj-3',
      description: 'Verify response payload structure and data types',
      required: true
    },
    {
      id: 'api-obj-4',
      description: 'Test API error handling',
      required: true
    },
    {
      id: 'api-obj-5',
      description: 'Measure API response times',
      required: false
    }
  ],
  tests: [
    {
      id: 'api-test-1',
      name: 'Response Code Validation Test',
      description: 'Checks if API endpoints return appropriate status codes',
      weight: 20,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: false,
          message: 'Some endpoints return incorrect status codes',
          details: 'DELETE /users/{id} returns 200 instead of 204 when successful. GET /products/{id} returns 200 for non-existent products instead of 404.'
        };
      }
    },
    {
      id: 'api-test-2',
      name: 'Authentication Test',
      description: 'Verifies that protected endpoints require proper authentication',
      weight: 25,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: true,
          message: 'Authentication mechanisms work correctly',
          details: 'All protected endpoints properly verify JWT tokens. Invalid or expired tokens are rejected with 401 Unauthorized.'
        };
      }
    },
    {
      id: 'api-test-3',
      name: 'Response Structure Test',
      description: 'Validates JSON response structure and data types',
      weight: 20,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: false,
          message: 'Response structure issues detected',
          details: 'GET /users returns inconsistent data types for the "age" field (string in some records, number in others). "createdAt" field is missing in some responses.'
        };
      }
    },
    {
      id: 'api-test-4',
      name: 'Error Handling Test',
      description: 'Checks if API provides meaningful error messages',
      weight: 20,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: false,
          message: 'Error handling needs improvement',
          details: 'Invalid parameters to /search endpoint return generic 500 error instead of specific 400 Bad Request with details. Some error responses lack proper JSON structure.'
        };
      }
    },
    {
      id: 'api-test-5',
      name: 'Response Time Test',
      description: 'Measures API endpoint response times',
      weight: 15,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: true,
          message: 'API response times are acceptable',
          details: 'All tested endpoints respond within 300ms, with the slowest being GET /products/category/{id} at 285ms.'
        };
      }
    }
  ],
  hints: [
    {
      id: 'api-hint-1',
      level: 'basic',
      content: 'Use tools like Postman or curl to send requests to API endpoints and examine response codes.'
    },
    {
      id: 'api-hint-2',
      level: 'basic',
      content: 'Test protected endpoints both with and without authentication tokens to verify security.'
    },
    {
      id: 'api-hint-3',
      level: 'detailed',
      content: 'Compare API responses against the documented schema. Look for missing fields, incorrect data types, or inconsistent structures.'
    },
    {
      id: 'api-hint-4',
      level: 'detailed',
      content: 'Send requests with invalid parameters or malformed data to test how the API handles errors. Check if the error messages are helpful.'
    },
    {
      id: 'api-hint-5',
      level: 'solution',
      content: 'The DELETE /users/{id} endpoint should return 204 No Content instead of 200. The GET /products/{id} needs to return 404 for non-existent IDs. The /users endpoint has inconsistent data types for age fields. The /search endpoint needs better error handling.'
    }
  ],
  passingScore: 75
};

// Challenge 5: Mobile Testing
const mobileTestingChallenge: ChallengeWithTests = {
  id: 'challenge-mobile-1',
  title: 'Mobile App Testing Essentials',
  description: 'Master testing techniques for mobile applications including responsive design, touch interactions, and device compatibility.',
  thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2070&h=1380&auto=format&fit=crop',
  difficulty: 'intermediate',
  duration: '35-45 min',
  tags: ['Mobile', 'Responsive', 'Touch', 'Devices'],
  category: 'Mobile Testing',
  featured: false,
  objectives: [
    {
      id: 'mob-obj-1',
      description: 'Test responsive design across different screen sizes',
      required: true
    },
    {
      id: 'mob-obj-2',
      description: 'Verify touch gestures functionality',
      required: true
    },
    {
      id: 'mob-obj-3',
      description: 'Test offline functionality',
      required: true
    },
    {
      id: 'mob-obj-4',
      description: 'Check device orientation handling',
      required: false
    },
    {
      id: 'mob-obj-5',
      description: 'Validate mobile-specific input methods',
      required: false
    }
  ],
  tests: [
    {
      id: 'mob-test-1',
      name: 'Responsive Design Test',
      description: 'Checks if the application adapts properly to different screen sizes',
      weight: 25,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: false,
          message: 'Responsive design issues detected',
          details: 'Content overflow observed on iPhone SE size (375px width). Navigation menu doesn\'t collapse properly on small screens. Product grid doesn\'t reflow below 768px.'
        };
      }
    },
    {
      id: 'mob-test-2',
      name: 'Touch Interaction Test',
      description: 'Verifies if touch gestures work as expected',
      weight: 20,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: true,
          message: 'Touch interactions work correctly',
          details: 'Swipe, pinch-to-zoom, and tap gestures function as expected across the application.'
        };
      }
    },
    {
      id: 'mob-test-3',
      name: 'Offline Functionality Test',
      description: 'Tests if the application works properly without internet connection',
      weight: 20,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: false,
          message: 'Offline functionality issues detected',
          details: 'Application crashes when network connection is lost. No offline cache for previously viewed content. No user feedback when actions require connectivity.'
        };
      }
    },
    {
      id: 'mob-test-4',
      name: 'Device Orientation Test',
      description: 'Checks if the application handles device rotation properly',
      weight: 15,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: true,
          message: 'Device orientation handling works correctly',
          details: 'Content properly adjusts when rotating between portrait and landscape modes. State is maintained during rotation.'
        };
      }
    },
    {
      id: 'mob-test-5',
      name: 'Mobile Input Methods Test',
      description: 'Validates various mobile-specific input methods',
      weight: 20,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: false,
          message: 'Issues with mobile input methods',
          details: 'Appropriate keyboard types not used for different input fields (e.g., email, phone). Address form difficult to complete on mobile. No support for autocomplete.'
        };
      }
    }
  ],
  hints: [
    {
      id: 'mob-hint-1',
      level: 'basic',
      content: 'Use browser developer tools to simulate different screen sizes and check how the layout adapts.'
    },
    {
      id: 'mob-hint-2',
      level: 'basic',
      content: 'Test touch gestures like swiping, pinching, and tapping to ensure they work as expected.'
    },
    {
      id: 'mob-hint-3',
      level: 'detailed',
      content: 'Use the browser\'s network tab to simulate offline mode and check how the application behaves when connectivity is lost.'
    },
    {
      id: 'mob-hint-4',
      level: 'detailed',
      content: 'Check if form inputs have appropriate input types (email, tel, number) to trigger the correct mobile keyboard.'
    },
    {
      id: 'mob-hint-5',
      level: 'solution',
      content: 'The application needs to fix content overflow on small screens (iPhone SE), implement proper offline handling with user feedback, and improve input fields with appropriate types and autocomplete support.'
    }
  ],
  passingScore: 70
};

// Challenge 6: Automated UI Testing
const automatedUITestingChallenge: ChallengeWithTests = {
  id: 'challenge-automated-ui-1',
  title: 'Automated UI Testing with Cypress',
  description: 'Learn to create robust automated UI tests using Cypress, including test organization, selectors, and assertions.',
  thumbnail: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?q=80&w=2070&h=1380&auto=format&fit=crop',
  difficulty: 'advanced',
  duration: '50-60 min',
  tags: ['Automation', 'Cypress', 'E2E Testing', 'UI Testing'],
  category: 'Automated Testing',
  featured: true,
  objectives: [
    {
      id: 'auto-obj-1',
      description: 'Create stable element selectors',
      required: true
    },
    {
      id: 'auto-obj-2',
      description: 'Write effective assertions',
      required: true
    },
    {
      id: 'auto-obj-3',
      description: 'Handle asynchronous operations',
      required: true
    },
    {
      id: 'auto-obj-4',
      description: 'Organize tests with proper structure',
      required: true
    },
    {
      id: 'auto-obj-5',
      description: 'Implement custom commands for reusability',
      required: false
    }
  ],
  tests: [
    {
      id: 'auto-test-1',
      name: 'Selector Quality Test',
      description: 'Evaluates the quality and stability of element selectors',
      weight: 25,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: false,
          message: 'Selector issues detected',
          details: 'Multiple selectors rely on index-based selection (e.g., cy.get(\'.item\').eq(2)) which is fragile. Some selectors use implementation details like CSS classes that may change (.btn-blue instead of [data-testid="submit"]).'
        };
      }
    },
    {
      id: 'auto-test-2',
      name: 'Assertion Effectiveness Test',
      description: 'Checks if assertions effectively verify application behavior',
      weight: 20,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: true,
          message: 'Assertions are effective',
          details: 'Tests include appropriate assertions that verify both UI state and application behavior. Negative test cases are included to verify error handling.'
        };
      }
    },
    {
      id: 'auto-test-3',
      name: 'Async Operation Handling Test',
      description: 'Verifies proper handling of asynchronous operations',
      weight: 20,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: false,
          message: 'Issues with async handling',
          details: 'Tests use arbitrary waits (cy.wait(2000)) instead of waiting for specific conditions. No retry logic for flaky network requests. Missing timeout adjustments for slow operations.'
        };
      }
    },
    {
      id: 'auto-test-4',
      name: 'Test Organization Test',
      description: 'Evaluates the structure and organization of test code',
      weight: 20,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: true,
          message: 'Tests are well-organized',
          details: 'Tests follow the AAA pattern (Arrange, Act, Assert). Test files are logically grouped. Common setup is extracted to before() and beforeEach() hooks.'
        };
      }
    },
    {
      id: 'auto-test-5',
      name: 'Test Reusability Test',
      description: 'Checks for reusable test components and custom commands',
      weight: 15,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: false,
          message: 'Limited test reusability',
          details: 'Common workflows are duplicated across tests instead of being extracted into custom commands. No use of fixtures for test data. Login sequence repeated in multiple test files.'
        };
      }
    }
  ],
  hints: [
    {
      id: 'auto-hint-1',
      level: 'basic',
      content: 'Use data-testid attributes for more stable element selection instead of relying on CSS classes or indexes.'
    },
    {
      id: 'auto-hint-2',
      level: 'basic',
      content: 'Write assertions that verify what the user would see or experience, not just technical implementation details.'
    },
    {
      id: 'auto-hint-3',
      level: 'detailed',
      content: 'Instead of fixed waits like cy.wait(2000), use commands like cy.wait(\'@apiRequest\') or cy.contains(\'Success\') to wait for specific events.'
    },
    {
      id: 'auto-hint-4',
      level: 'detailed',
      content: 'Extract common test operations like login into custom Cypress commands that can be reused across test files.'
    },
    {
      id: 'auto-hint-5',
      level: 'solution',
      content: 'Replace index-based selectors with data-testid attributes. Replace arbitrary waits with waitUntil or waiting for specific elements/network requests. Extract the login sequence into a custom command in commands.js.'
    }
  ],
  passingScore: 75
};

// Challenge 7: Usability Testing
const usabilityTestingChallenge: ChallengeWithTests = {
  id: 'challenge-usability-1',
  title: 'Usability Testing Fundamentals',
  description: 'Learn how to evaluate user interfaces for usability issues, assess user workflows, and identify friction points in the user experience.',
  thumbnail: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2070&h=1380&auto=format&fit=crop',
  difficulty: 'beginner',
  duration: '30-40 min',
  tags: ['Usability', 'UX', 'User Testing', 'Workflows'],
  category: 'Usability Testing',
  featured: false,
  objectives: [
    {
      id: 'usab-obj-1',
      description: 'Evaluate form usability and completion rates',
      required: true
    },
    {
      id: 'usab-obj-2',
      description: 'Assess navigation clarity and information architecture',
      required: true
    },
    {
      id: 'usab-obj-3',
      description: 'Test task completion efficiency',
      required: true
    },
    {
      id: 'usab-obj-4',
      description: 'Identify error prevention and recovery mechanisms',
      required: false
    },
    {
      id: 'usab-obj-5',
      description: 'Evaluate consistency of UI patterns',
      required: false
    }
  ],
  tests: [
    {
      id: 'usab-test-1',
      name: 'Form Usability Test',
      description: 'Evaluates the usability of forms and input fields',
      weight: 25,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: false,
          message: 'Form usability issues detected',
          details: 'Checkout form has unclear error messages. Address fields reset when validation fails. Required fields are not clearly marked. Form submission provides no feedback during processing.'
        };
      }
    },
    {
      id: 'usab-test-2',
      name: 'Navigation Assessment Test',
      description: 'Assesses the clarity and effectiveness of site navigation',
      weight: 20,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: false,
          message: 'Navigation issues detected',
          details: 'Categories in main navigation don\'t clearly indicate their contents. Current page not highlighted in navigation. Mobile menu requires too many taps to reach important sections.'
        };
      }
    },
    {
      id: 'usab-test-3',
      name: 'Task Completion Test',
      description: 'Measures the efficiency of completing common user tasks',
      weight: 20,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: true,
          message: 'Task completion is efficient',
          details: 'Product search and filtering work efficiently. Add to cart process is streamlined. Account creation requires reasonable steps.'
        };
      }
    },
    {
      id: 'usab-test-4',
      name: 'Error Handling Test',
      description: 'Evaluates how well the interface prevents and handles errors',
      weight: 15,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: false,
          message: 'Error handling needs improvement',
          details: 'No confirmation for delete actions. Error messages are technical rather than helpful. No way to recover data after form validation errors.'
        };
      }
    },
    {
      id: 'usab-test-5',
      name: 'UI Consistency Test',
      description: 'Checks if the interface uses consistent patterns and elements',
      weight: 20,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: false,
          message: 'Inconsistent UI patterns',
          details: 'Button styles vary across different sections. Inconsistent terminology (e.g., "Purchase" vs "Buy" vs "Checkout"). Form layouts differ between account and checkout pages.'
        };
      }
    }
  ],
  hints: [
    {
      id: 'usab-hint-1',
      level: 'basic',
      content: 'Test forms by deliberately entering invalid data to see how the interface responds and guides users.'
    },
    {
      id: 'usab-hint-2',
      level: 'basic',
      content: 'Evaluate if users can easily understand where they are in the site hierarchy and how to navigate to other sections.'
    },
    {
      id: 'usab-hint-3',
      level: 'detailed',
      content: 'Count the number of clicks/taps required to complete common tasks and look for ways to reduce friction.'
    },
    {
      id: 'usab-hint-4',
      level: 'detailed',
      content: 'Check if the interface prevents errors through clear labels, constraints, and confirmation dialogs for destructive actions.'
    },
    {
      id: 'usab-hint-5',
      level: 'solution',
      content: 'The checkout form needs clear error indicators and should preserve data after validation. Navigation needs active state indicators. Implement consistent button styles and terminology across sections. Add confirmation dialogs for delete actions.'
    }
  ],
  passingScore: 65
};

// Challenge 8: Localization Testing
const localizationTestingChallenge: ChallengeWithTests = {
  id: 'challenge-localization-1',
  title: 'Web Localization Testing',
  description: 'Learn to test applications for international audiences, including language translation quality, cultural adaptation, and formatting conventions.',
  thumbnail: 'https://images.unsplash.com/photo-1526376043067-5af36c35cd6c?q=80&w=2069&h=1380&auto=format&fit=crop',
  difficulty: 'intermediate',
  duration: '40-50 min',
  tags: ['Localization', 'i18n', 'Translation', 'Cultural'],
  category: 'Localization Testing',
  featured: false,
  objectives: [
    {
      id: 'loc-obj-1',
      description: 'Verify translation completeness and accuracy',
      required: true
    },
    {
      id: 'loc-obj-2',
      description: 'Test date, time, and number formatting',
      required: true
    },
    {
      id: 'loc-obj-3',
      description: 'Check text expansion and UI layout adaptation',
      required: true
    },
    {
      id: 'loc-obj-4',
      description: 'Evaluate cultural appropriateness of content',
      required: false
    },
    {
      id: 'loc-obj-5',
      description: 'Test right-to-left language support',
      required: false
    }
  ],
  tests: [
    {
      id: 'loc-test-1',
      name: 'Translation Quality Test',
      description: 'Evaluates the completeness and accuracy of translations',
      weight: 25,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: false,
          message: 'Translation issues detected',
          details: 'Found 12 untranslated strings in German version. Spanish translation contains grammatical errors in product descriptions. Error messages in French use machine translation without review.'
        };
      }
    },
    {
      id: 'loc-test-2',
      name: 'Formatting Test',
      description: 'Checks if date, time, currency, and number formats are appropriate for each locale',
      weight: 20,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: false,
          message: 'Formatting issues detected',
          details: 'Dates in German version use MM/DD/YYYY instead of DD.MM.YYYY format. Currency symbol placement incorrect in French version (15€ instead of 15 €). Number separators inconsistent in Italian version.'
        };
      }
    },
    {
      id: 'loc-test-3',
      name: 'Text Expansion Test',
      description: 'Verifies if UI accommodates text length differences between languages',
      weight: 20,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: false,
          message: 'Text expansion issues detected',
          details: 'Button text gets truncated in German ("Zahlungsmeth..." instead of "Zahlungsmethode"). Navigation menu items overflow in Finnish. Dialog titles break to multiple lines in Russian.'
        };
      }
    },
    {
      id: 'loc-test-4',
      name: 'Cultural Appropriateness Test',
      description: 'Assesses if content is culturally appropriate for target audiences',
      weight: 15,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: true,
          message: 'Content is culturally appropriate',
          details: 'Images, examples, and metaphors are well-adapted for different markets. No culturally inappropriate content detected.'
        };
      }
    },
    {
      id: 'loc-test-5',
      name: 'RTL Support Test',
      description: 'Checks support for right-to-left languages like Arabic and Hebrew',
      weight: 20,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: false,
          message: 'RTL support issues detected',
          details: 'Layout doesn\'t mirror properly in Arabic version. Text alignment incorrect in RTL mode. Icons and buttons don\'t flip direction. Input fields show RTL text with LTR alignment.'
        };
      }
    }
  ],
  hints: [
    {
      id: 'loc-hint-1',
      level: 'basic',
      content: 'Switch between different languages and look for untranslated strings or placeholder text (e.g., "[TRANSLATE_ME]").'
    },
    {
      id: 'loc-hint-2',
      level: 'basic',
      content: 'Check if dates, currencies, and numbers follow the conventions of each locale (e.g., DD/MM/YYYY vs MM/DD/YYYY).'
    },
    {
      id: 'loc-hint-3',
      level: 'detailed',
      content: 'German and Finnish words are often longer than English equivalents. Check if UI elements can accommodate longer text without truncation.'
    },
    {
      id: 'loc-hint-4',
      level: 'detailed',
      content: 'For RTL languages like Arabic and Hebrew, verify that the entire layout mirrors properly, including navigation, icons, and text alignment.'
    },
    {
      id: 'loc-hint-5',
      level: 'solution',
      content: 'Complete missing translations in German version. Fix date formats to use locale-specific patterns. Increase button width to accommodate longer German text. Implement proper RTL support with mirrored layouts and correct text alignment.'
    }
  ],
  passingScore: 70
};

// Challenge 9: Regression Testing
const regressionTestingChallenge: ChallengeWithTests = {
  id: 'challenge-regression-1',
  title: 'Effective Regression Testing',
  description: 'Learn strategies for effective regression testing to ensure that new code changes don\'t break existing functionality.',
  thumbnail: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?q=80&w=2065&h=1380&auto=format&fit=crop',
  difficulty: 'intermediate',
  duration: '40-50 min',
  tags: ['Regression', 'Quality Assurance', 'Test Automation'],
  category: 'Regression Testing',
  featured: false,
  objectives: [
    {
      id: 'reg-obj-1',
      description: 'Identify critical regression test paths',
      required: true
    },
    {
      id: 'reg-obj-2',
      description: 'Create effective regression test plans',
      required: true
    },
    {
      id: 'reg-obj-3',
      description: 'Prioritize regression testing by risk',
      required: true
    },
    {
      id: 'reg-obj-4',
      description: 'Balance manual and automated regression testing',
      required: false
    },
    {
      id: 'reg-obj-5',
      description: 'Implement regression testing in CI/CD pipelines',
      required: false
    }
  ],
  tests: [
    {
      id: 'reg-test-1',
      name: 'Critical Path Identification Test',
      description: 'Evaluates identification of critical functionality for regression testing',
      weight: 25,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: false,
          message: 'Critical path identification needs improvement',
          details: 'Missing checkout process in critical paths. User authentication not included. Payment processing flows not prioritized. Some edge cases like promo code handling omitted.'
        };
      }
    },
    {
      id: 'reg-test-2',
      name: 'Test Plan Quality Test',
      description: 'Assesses the quality and completeness of regression test plans',
      weight: 20,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: true,
          message: 'Regression test plan is well-structured',
          details: 'Test plan includes clear test cases with steps, expected results, and priority levels. Tests are organized by feature area and dependency.'
        };
      }
    },
    {
      id: 'reg-test-3',
      name: 'Risk-Based Prioritization Test',
      description: 'Checks if regression tests are appropriately prioritized by risk',
      weight: 20,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: false,
          message: 'Risk prioritization needs improvement',
          details: 'High-traffic user flows not given highest priority. Critical financial transactions have same priority as UI cosmetic tests. Risk assessment doesn\'t consider historical bug patterns.'
        };
      }
    },
    {
      id: 'reg-test-4',
      name: 'Test Automation Balance Test',
      description: 'Evaluates the balance between manual and automated regression testing',
      weight: 15,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: true,
          message: 'Good balance of manual and automated testing',
          details: 'Critical paths automated with proper test coverage. Exploratory testing used for complex user interactions. Visual tests appropriately left to manual testing.'
        };
      }
    },
    {
      id: 'reg-test-5',
      name: 'CI/CD Integration Test',
      description: 'Checks if regression testing is effectively integrated into CI/CD pipelines',
      weight: 20,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: false,
          message: 'CI/CD integration needs improvement',
          details: 'Regression tests run too late in the pipeline to provide early feedback. No parallelization for faster results. Missing smoke tests to gate deployments. Test results not easily accessible to developers.'
        };
      }
    }
  ],
  hints: [
    {
      id: 'reg-hint-1',
      level: 'basic',
      content: 'Identify the core user journeys that must work for your application to be considered functional (e.g., login, search, checkout).'
    },
    {
      id: 'reg-hint-2',
      level: 'basic',
      content: 'Create regression test plans that include test cases for both happy paths and common edge cases for critical features.'
    },
    {
      id: 'reg-hint-3',
      level: 'detailed',
      content: 'Prioritize regression tests based on business impact, user traffic, and technical risk. Features with frequent defects deserve more testing.'
    },
    {
      id: 'reg-hint-4',
      level: 'detailed',
      content: 'In CI/CD pipelines, run a small set of critical smoke tests first, followed by broader regression test suites in parallel.'
    },
    {
      id: 'reg-hint-5',
      level: 'solution',
      content: 'Add checkout, authentication, and payment processes to critical test paths. Reprioritize tests based on traffic and financial risk. Implement smoke tests earlier in the CI/CD pipeline and add parallelization for faster feedback.'
    }
  ],
  passingScore: 70
};

// Challenge 10: Cross-Browser Testing
const crossBrowserTestingChallenge: ChallengeWithTests = {
  id: 'challenge-cross-browser-1',
  title: 'Cross-Browser Testing Mastery',
  description: 'Learn to test web applications across different browsers and devices to ensure consistent functionality and appearance.',
  thumbnail: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=2070&h=1380&auto=format&fit=crop',
  difficulty: 'intermediate',
  duration: '35-45 min',
  tags: ['Browser Compatibility', 'CSS', 'JavaScript', 'Rendering'],
  category: 'Cross-Browser Testing',
  featured: false,
  objectives: [
    {
      id: 'cb-obj-1',
      description: 'Test layout consistency across browsers',
      required: true
    },
    {
      id: 'cb-obj-2',
      description: 'Verify JavaScript functionality in different browsers',
      required: true
    },
    {
      id: 'cb-obj-3',
      description: 'Test CSS feature compatibility',
      required: true
    },
    {
      id: 'cb-obj-4',
      description: 'Evaluate form behavior across browsers',
      required: false
    },
    {
      id: 'cb-obj-5',
      description: 'Check performance differences between browsers',
      required: false
    }
  ],
  tests: [
    {
      id: 'cb-test-1',
      name: 'Layout Consistency Test',
      description: 'Evaluates layout consistency across different browsers',
      weight: 25,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: false,
          message: 'Layout inconsistencies detected',
          details: 'Navigation menu breaks in Safari. Hero section has different heights in Firefox vs. Chrome. Grid layout has alignment issues in Edge. Font rendering inconsistent in mobile browsers.'
        };
      }
    },
    {
      id: 'cb-test-2',
      name: 'JavaScript Compatibility Test',
      description: 'Checks if JavaScript functionality works across browsers',
      weight: 25,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: false,
          message: 'JavaScript compatibility issues detected',
          details: 'Date picker doesn\'t work in Internet Explorer 11. Custom dropdown menus fail in Safari. Form validation behaves differently in Firefox. Some ES6 features used without polyfills.'
        };
      }
    },
    {
      id: 'cb-test-3',
      name: 'CSS Feature Test',
      description: 'Verifies if CSS features are supported across browsers',
      weight: 20,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: false,
          message: 'CSS compatibility issues detected',
          details: 'CSS Grid layout breaks in older browsers with no fallback. CSS variables not supported in IE11. Flexbox behavior inconsistent in Safari. Missing vendor prefixes for some properties.'
        };
      }
    },
    {
      id: 'cb-test-4',
      name: 'Form Behavior Test',
      description: 'Tests if forms work consistently across browsers',
      weight: 15,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: true,
          message: 'Forms work consistently across browsers',
          details: 'Form controls, validation, and submission work as expected across tested browsers. Date inputs fall back gracefully in unsupported browsers.'
        };
      }
    },
    {
      id: 'cb-test-5',
      name: 'Performance Comparison Test',
      description: 'Compares performance across different browsers',
      weight: 15,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: true,
          message: 'Performance is acceptable across browsers',
          details: 'Page load and rendering times are within acceptable ranges across all tested browsers. Animation performance is consistent.'
        };
      }
    }
  ],
  hints: [
    {
      id: 'cb-hint-1',
      level: 'basic',
      content: 'Test your site in at least Chrome, Firefox, Safari, and Edge. Pay special attention to layout, positioning, and element sizes.'
    },
    {
      id: 'cb-hint-2',
      level: 'basic',
      content: 'Use tools like BrowserStack or cross-browser testing services to test on browsers you don\'t have installed.'
    },
    {
      id: 'cb-hint-3',
      level: 'detailed',
      content: 'For CSS features with limited support, implement fallbacks or use feature detection. Consider using tools like Autoprefixer for vendor prefixes.'
    },
    {
      id: 'cb-hint-4',
      level: 'detailed',
      content: 'Test JavaScript features with tools like Babel to ensure compatibility with older browsers, or use feature detection with appropriate fallbacks.'
    },
    {
      id: 'cb-hint-5',
      level: 'solution',
      content: 'Fix Safari navigation by avoiding CSS Grid or implementing a flexbox fallback. Add polyfills for ES6 features and date picker in IE11. Include vendor prefixes for critical CSS properties and add proper fallbacks for CSS Grid in older browsers.'
    }
  ],
  passingScore: 70
};

// Challenge 11: GraphQL API Testing
const graphqlTestingChallenge: ChallengeWithTests = {
  id: 'challenge-graphql-1',
  title: 'GraphQL API Testing',
  description: 'Learn specialized techniques for testing GraphQL APIs, including query validation, schema testing, and resolver functionality.',
  thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&h=1380&auto=format&fit=crop',
  difficulty: 'advanced',
  duration: '45-55 min',
  tags: ['GraphQL', 'API', 'Schema', 'Resolvers'],
  category: 'API Testing',
  featured: false,
  objectives: [
    {
      id: 'gql-obj-1',
      description: 'Test GraphQL query structure and validation',
      required: true
    },
    {
      id: 'gql-obj-2',
      description: 'Verify schema type definitions',
      required: true
    },
    {
      id: 'gql-obj-3',
      description: 'Test resolver functionality and data retrieval',
      required: true
    },
    {
      id: 'gql-obj-4',
      description: 'Check error handling and messages',
      required: true
    },
    {
      id: 'gql-obj-5',
      description: 'Test mutation operations',
      required: false
    }
  ],
  tests: [
    {
      id: 'gql-test-1',
      name: 'Query Structure Test',
      description: 'Validates GraphQL query structure and syntax',
      weight: 20,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: true,
          message: 'GraphQL queries are valid',
          details: 'All sample queries parsed successfully. Field selections and arguments properly structured. Fragment usage is correct.'
        };
      }
    },
    {
      id: 'gql-test-2',
      name: 'Schema Definition Test',
      description: 'Checks if GraphQL schema types are properly defined',
      weight: 20,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: false,
          message: 'Schema definition issues detected',
          details: 'User type missing required email field. Order type references non-existent Product type. Some mutation inputs lack validation rules. Enum values inconsistently named.'
        };
      }
    },
    {
      id: 'gql-test-3',
      name: 'Resolver Functionality Test',
      description: 'Verifies that resolvers return the expected data',
      weight: 25,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: false,
          message: 'Resolver issues detected',
          details: 'User resolver doesn\'t handle missing data gracefully. Posts resolver doesn\'t properly filter by date. Comments resolver N+1 query problem detected. Author resolver doesn\'t support pagination.'
        };
      }
    },
    {
      id: 'gql-test-4',
      name: 'Error Handling Test',
      description: 'Evaluates error handling in GraphQL operations',
      weight: 15,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: false,
          message: 'Error handling needs improvement',
          details: 'Some errors expose internal details that should be hidden. Authentication errors don\'t provide clear messages. Field-level errors not properly propagated to client.'
        };
      }
    },
    {
      id: 'gql-test-5',
      name: 'Mutation Operations Test',
      description: 'Tests create, update, and delete operations via GraphQL mutations',
      weight: 20,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: true,
          message: 'Mutation operations work correctly',
          details: 'Create, update, and delete mutations function as expected. Input validation is properly implemented. Return values reflect changes accurately.'
        };
      }
    }
  ],
  hints: [
    {
      id: 'gql-hint-1',
      level: 'basic',
      content: 'Use tools like GraphiQL or Apollo Studio to validate query syntax and explore the schema.'
    },
    {
      id: 'gql-hint-2',
      level: 'basic',
      content: 'Review schema definitions to ensure all types are properly defined with required fields and relationships.'
    },
    {
      id: 'gql-hint-3',
      level: 'detailed',
      content: 'Test resolvers by querying them with different arguments and checking if the returned data matches expectations.'
    },
    {
      id: 'gql-hint-4',
      level: 'detailed',
      content: 'Look for N+1 query problems where a resolver fires multiple database queries unnecessarily. Use DataLoader or similar solutions to batch requests.'
    },
    {
      id: 'gql-hint-5',
      level: 'solution',
      content: 'Add the missing email field to User type. Create the missing Product type. Implement proper error masking for internal errors. Fix the N+1 query issue in the Comments resolver using DataLoader. Add pagination support to the Author resolver.'
    }
  ],
  passingScore: 70
};

// Challenge 12: Visual Regression Testing
const visualRegressionTestingChallenge: ChallengeWithTests = {
  id: 'challenge-visual-regression-1',
  title: 'Visual Regression Testing',
  description: 'Learn techniques for detecting unintended visual changes in web applications using screenshot comparison and visual diffing.',
  thumbnail: 'https://images.unsplash.com/photo-1634942537034-2531766767d1?q=80&w=2070&h=1380&auto=format&fit=crop',
  difficulty: 'intermediate',
  duration: '35-45 min',
  tags: ['Visual Testing', 'Screenshot Comparison', 'UI Testing'],
  category: 'Visual Testing',
  featured: false,
  objectives: [
    {
      id: 'vr-obj-1',
      description: 'Create baseline screenshots for comparison',
      required: true
    },
    {
      id: 'vr-obj-2',
      description: 'Configure screenshot capture settings',
      required: true
    },
    {
      id: 'vr-obj-3',
      description: 'Set appropriate comparison thresholds',
      required: true
    },
    {
      id: 'vr-obj-4',
      description: 'Handle dynamic content in visual tests',
      required: false
    },
    {
      id: 'vr-obj-5',
      description: 'Integrate visual testing into CI/CD pipeline',
      required: false
    }
  ],
  tests: [
    {
      id: 'vr-test-1',
      name: 'Baseline Quality Test',
      description: 'Evaluates the quality and coverage of baseline screenshots',
      weight: 20,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: false,
          message: 'Baseline coverage needs improvement',
          details: 'Missing baselines for critical pages (checkout, product details). Some baselines captured at wrong viewport sizes. Several baselines outdated (over 3 months old).'
        };
      }
    },
    {
      id: 'vr-test-2',
      name: 'Screenshot Configuration Test',
      description: 'Checks if screenshot capture settings are appropriate',
      weight: 20,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: true,
          message: 'Screenshot configuration is appropriate',
          details: 'Screenshots captured at relevant viewport sizes. Full-page screenshots used where appropriate. Element-specific screenshots used for complex components.'
        };
      }
    },
    {
      id: 'vr-test-3',
      name: 'Comparison Threshold Test',
      description: 'Verifies if comparison thresholds are properly calibrated',
      weight: 20,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: false,
          message: 'Threshold configuration needs adjustment',
          details: 'Global threshold too strict (0.001) causing false positives. Some pages need looser thresholds due to animation or content rotation. Pixel-perfect comparison used where anti-aliasing causes issues.'
        };
      }
    },
    {
      id: 'vr-test-4',
      name: 'Dynamic Content Handling Test',
      description: 'Evaluates how well visual tests handle dynamic content',
      weight: 20,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: false,
          message: 'Dynamic content handling needs improvement',
          details: 'No ignore regions defined for date/time displays. Carousel images cause false positives. Dynamic user data not properly masked or mocked. A/B test variations causing inconsistent results.'
        };
      }
    },
    {
      id: 'vr-test-5',
      name: 'CI/CD Integration Test',
      description: 'Checks how effectively visual testing is integrated into CI/CD',
      weight: 20,
      testFunction: async (env: TestingEnvironment): Promise<TestResult> => {
        return {
          passed: true,
          message: 'CI/CD integration is effective',
          details: 'Visual tests run automatically on pull requests. Results displayed in PR comments with visual diffs. Approval workflow for intentional visual changes.'
        };
      }
    }
  ],
  hints: [
    {
      id: 'vr-hint-1',
      level: 'basic',
      content: 'Create baseline screenshots for all critical pages and components in your application at relevant viewport sizes.'
    },
    {
      id: 'vr-hint-2',
      level: 'basic',
      content: 'Configure screenshot settings appropriately, using full-page captures for overall layouts and element-specific captures for complex components.'
    },
    {
      id: 'vr-hint-3',
      level: 'detailed',
      content: 'Calibrate comparison thresholds to minimize false positives. Different pages may need different thresholds based on their content.'
    },
    {
      id: 'vr-hint-4',
      level: 'detailed',
      content: 'Handle dynamic content by defining ignore regions for dates, times, and other changing elements. Mock or fix dynamic data during test runs.'
    },
    {
      id: 'vr-hint-5',
      level: 'solution',
      content: 'Create missing baselines for checkout and product detail pages. Adjust the global threshold to 0.01 to reduce false positives. Add ignore regions for the date display, carousel images, and user-specific data. Ensure consistent A/B test variations during testing.'
    }
  ],
  passingScore: 75
};

// Export all challenges
export const challenges: ChallengeWithTests[] = [
  // Original challenges from the provided file
  accessibilityChallenge,
  performanceChallenge,
  securityChallenge,
  
  // New challenges
  apiTestingChallenge,
  mobileTestingChallenge,
  automatedUITestingChallenge,
  usabilityTestingChallenge,
  localizationTestingChallenge,
  regressionTestingChallenge,
  crossBrowserTestingChallenge,
  graphqlTestingChallenge,
  visualRegressionTestingChallenge
];

export default challenges;
