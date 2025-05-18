import { Challenge } from '../components/playground/ChallengeCard';

// Basic challenge metadata
export interface ChallengeMeta extends Challenge {
  // These properties are already in the Challenge interface,
  // but we're redefining them here to ensure type consistency
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  tags: string[];
  category: string;
}

// Challenge 1: Accessibility Testing
const accessibilityChallenge: ChallengeMeta = {
  id: 'challenge-accessibility-1',
  title: 'Web Accessibility Testing Fundamentals',
  description: 'Learn how to test websites for accessibility compliance, ensuring they work for users with disabilities.',
  thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2076&h=1384&auto=format&fit=crop',
  difficulty: 'intermediate',
  duration: '30-40 min',
  tags: ['Accessibility', 'WCAG', 'Screen Readers'],
  category: 'Accessibility Testing',
  featured: false,
};

// Challenge 2: Performance Testing
const performanceChallenge: ChallengeMeta = {
  id: 'challenge-performance-1',
  title: 'Web Performance Testing Essentials',
  description: 'Learn how to identify performance bottlenecks, measure load times, and analyze resource usage in web applications.',
  thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&h=1380&auto=format&fit=crop',
  difficulty: 'advanced',
  duration: '45-60 min',
  tags: ['Performance', 'Load Testing', 'Optimization'],
  category: 'Performance Testing',
  featured: false,
};

// Challenge 3: Security Testing
const securityChallenge: ChallengeMeta = {
  id: 'challenge-security-1',
  title: 'Web Security Testing Fundamentals',
  description: 'Learn how to identify common security vulnerabilities in web applications, including XSS, CSRF, and insecure authentication.',
  thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070&h=1380&auto=format&fit=crop',
  difficulty: 'advanced',
  duration: '50-60 min',
  tags: ['Security', 'XSS', 'CSRF', 'Authentication'],
  category: 'Security Testing',
  featured: true,
};

// Challenge 4: API Testing
const apiTestingChallenge: ChallengeMeta = {
  id: 'challenge-api-1',
  title: 'RESTful API Testing Mastery',
  description: 'Learn to test REST APIs, validate responses, handle authentication, and verify data integrity across endpoints.',
  thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2000&h=1333&auto=format&fit=crop',
  difficulty: 'intermediate',
  duration: '40-50 min',
  tags: ['API', 'REST', 'Backend', 'JSON'],
  category: 'API Testing',
  featured: true,
};

// Challenge 5: Mobile Testing
const mobileTestingChallenge: ChallengeMeta = {
  id: 'challenge-mobile-1',
  title: 'Mobile App Testing Essentials',
  description: 'Master testing techniques for mobile applications including responsive design, touch interactions, and device compatibility.',
  thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2070&h=1380&auto=format&fit=crop',
  difficulty: 'intermediate',
  duration: '35-45 min',
  tags: ['Mobile', 'Responsive', 'Touch', 'Devices'],
  category: 'Mobile Testing',
  featured: false,
};

// Challenge 6: Automated UI Testing
const automatedUITestingChallenge: ChallengeMeta = {
  id: 'challenge-automated-ui-1',
  title: 'Automated UI Testing with Cypress',
  description: 'Learn to create robust automated UI tests using Cypress, including test organization, selectors, and assertions.',
  thumbnail: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?q=80&w=2070&h=1380&auto=format&fit=crop',
  difficulty: 'advanced',
  duration: '50-60 min',
  tags: ['Automation', 'Cypress', 'E2E Testing', 'UI Testing'],
  category: 'Automated Testing',
  featured: true,
};

// Challenge 7: Usability Testing
const usabilityTestingChallenge: ChallengeMeta = {
  id: 'challenge-usability-1',
  title: 'Usability Testing Fundamentals',
  description: 'Learn how to evaluate user interfaces for usability issues, assess user workflows, and identify friction points in the user experience.',
  thumbnail: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2070&h=1380&auto=format&fit=crop',
  difficulty: 'beginner',
  duration: '30-40 min',
  tags: ['Usability', 'UX', 'User Testing', 'Workflows'],
  category: 'Usability Testing',
  featured: false,
};

// Challenge 8: Localization Testing
const localizationTestingChallenge: ChallengeMeta = {
  id: 'challenge-localization-1',
  title: 'Web Localization Testing',
  description: 'Learn to test applications for international audiences, including language translation quality, cultural adaptation, and formatting conventions.',
  thumbnail: 'https://images.unsplash.com/photo-1526376043067-5af36c35cd6c?q=80&w=2069&h=1380&auto=format&fit=crop',
  difficulty: 'intermediate',
  duration: '40-50 min',
  tags: ['Localization', 'i18n', 'Translation', 'Cultural'],
  category: 'Localization Testing',
  featured: false,
};

// Challenge 9: Regression Testing
const regressionTestingChallenge: ChallengeMeta = {
  id: 'challenge-regression-1',
  title: 'Effective Regression Testing',
  description: 'Learn strategies for effective regression testing to ensure that new code changes don\'t break existing functionality.',
  thumbnail: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?q=80&w=2065&h=1380&auto=format&fit=crop',
  difficulty: 'intermediate',
  duration: '40-50 min',
  tags: ['Regression', 'Quality Assurance', 'Test Automation'],
  category: 'Regression Testing',
  featured: false,
};

// Challenge 10: Cross-Browser Testing
const crossBrowserTestingChallenge: ChallengeMeta = {
  id: 'challenge-cross-browser-1',
  title: 'Cross-Browser Testing Mastery',
  description: 'Learn to test web applications across different browsers and devices to ensure consistent functionality and appearance.',
  thumbnail: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=2070&h=1380&auto=format&fit=crop',
  difficulty: 'intermediate',
  duration: '35-45 min',
  tags: ['Browser Compatibility', 'CSS', 'JavaScript', 'Rendering'],
  category: 'Cross-Browser Testing',
  featured: false,
};

// Export all challenge metadata
export const challengesMeta: ChallengeMeta[] = [
  accessibilityChallenge,
  performanceChallenge,
  securityChallenge,
  apiTestingChallenge,
  mobileTestingChallenge,
  automatedUITestingChallenge,
  usabilityTestingChallenge,
  localizationTestingChallenge,
  regressionTestingChallenge,
  crossBrowserTestingChallenge,
];

export default challengesMeta;
