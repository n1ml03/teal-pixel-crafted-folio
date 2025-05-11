export interface ResourceCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  url: string;
  image: string;
  tags: string[];
  featured?: boolean;
  type: 'tool' | 'template' | 'guide' | 'library' | 'framework' | 'language' | 'service' | 'course';
  pricing?: 'free' | 'freemium' | 'paid' | 'open-source';
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'all-levels';
  lastUpdated?: string;
  icon?: string;
}

export const resourceCategories: ResourceCategory[] = [
  {
    id: '1',
    name: 'Testing & QA',
    slug: 'testing-qa',
    description: 'Tools and resources for software testing and quality assurance',
    icon: 'TestTube'
  },
  {
    id: '2',
    name: 'Development',
    slug: 'development',
    description: 'Resources for frontend and backend development',
    icon: 'Code'
  },
  {
    id: '3',
    name: 'Design',
    slug: 'design',
    description: 'UI/UX design tools and resources',
    icon: 'Palette'
  },
  {
    id: '4',
    name: 'Productivity',
    slug: 'productivity',
    description: 'Tools to improve workflow and productivity',
    icon: 'Zap'
  },
  {
    id: '5',
    name: 'Learning',
    slug: 'learning',
    description: 'Educational resources and learning materials',
    icon: 'GraduationCap'
  },
  {
    id: '6',
    name: 'DevOps',
    slug: 'devops',
    description: 'Tools for CI/CD, deployment, and infrastructure management',
    icon: 'Server'
  },
  {
    id: '7',
    name: 'Security',
    slug: 'security',
    description: 'Resources for application security and penetration testing',
    icon: 'Shield'
  }
];

export const resources: Resource[] = [
  {
    id: '1',
    title: 'Cypress',
    description: 'Fast, easy and reliable testing for anything that runs in a browser. Install Cypress in seconds and take the pain out of front-end testing.',
    category: 'Testing & QA',
    url: 'https://www.cypress.io/',
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cypressio/cypressio-original.svg',
    tags: ['E2E Testing', 'JavaScript', 'Automation'],
    featured: true,
    type: 'tool',
    pricing: 'open-source',
    difficulty: 'beginner',
    lastUpdated: '2023-12-15'
  },
  {
    id: '2',
    title: 'Playwright',
    description: 'Playwright enables reliable end-to-end testing for modern web apps. It allows testing across all modern browsers.',
    category: 'Testing & QA',
    url: 'https://playwright.dev/',
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/playwright/playwright-original.svg',
    tags: ['E2E Testing', 'Cross-browser', 'Automation'],
    featured: true,
    type: 'tool',
    pricing: 'open-source',
    difficulty: 'intermediate',
    lastUpdated: '2023-11-20'
  },
  {
    id: '3',
    title: 'Jest',
    description: 'Jest is a delightful JavaScript Testing Framework with a focus on simplicity. It works with projects using Babel, TypeScript, Node, React, Angular, Vue and more.',
    category: 'Testing & QA',
    url: 'https://jestjs.io/',
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jest/jest-plain.svg',
    tags: ['Unit Testing', 'JavaScript', 'React'],
    featured: false,
    type: 'tool',
    pricing: 'open-source',
    difficulty: 'beginner',
    lastUpdated: '2023-10-05'
  },
  {
    id: '4',
    title: 'Postman',
    description: 'Postman is an API platform for building and using APIs. Simplify each step of the API lifecycle and streamline collaboration.',
    category: 'Testing & QA',
    url: 'https://www.postman.com/',
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg',
    tags: ['API Testing', 'API Development', 'Collaboration'],
    featured: true,
    type: 'tool',
    pricing: 'freemium',
    difficulty: 'beginner',
    lastUpdated: '2024-01-10'
  },
  {
    id: '5',
    title: 'React',
    description: 'A JavaScript library for building user interfaces. React makes it painless to create interactive UIs.',
    category: 'Development',
    url: 'https://reactjs.org/',
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
    tags: ['Frontend', 'JavaScript', 'UI'],
    featured: true,
    type: 'library',
    pricing: 'open-source',
    difficulty: 'intermediate',
    lastUpdated: '2023-12-20'
  },
  {
    id: '6',
    title: 'TypeScript',
    description: 'TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.',
    category: 'Development',
    url: 'https://www.typescriptlang.org/',
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg',
    tags: ['JavaScript', 'Static Typing', 'Language'],
    featured: false,
    type: 'language',
    pricing: 'open-source',
    difficulty: 'intermediate',
    lastUpdated: '2023-11-15'
  },
  {
    id: '7',
    title: 'Figma',
    description: 'Figma is a collaborative interface design tool. Create, test, and ship better designs from start to finish.',
    category: 'Design',
    url: 'https://www.figma.com/',
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg',
    tags: ['UI/UX', 'Design', 'Collaboration'],
    featured: false,
    type: 'tool',
    pricing: 'freemium',
    difficulty: 'beginner',
    lastUpdated: '2024-01-05'
  },
  {
    id: '8',
    title: 'VS Code',
    description: 'Visual Studio Code is a lightweight but powerful source code editor which runs on your desktop.',
    category: 'Development',
    url: 'https://code.visualstudio.com/',
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg',
    tags: ['Editor', 'IDE', 'Development'],
    featured: true,
    type: 'tool',
    pricing: 'free',
    difficulty: 'beginner',
    lastUpdated: '2023-12-10'
  },
  {
    id: '9',
    title: 'JIRA',
    description: 'Jira Software is built for every member of your software team to plan, track, and release great software.',
    category: 'Productivity',
    url: 'https://www.atlassian.com/software/jira',
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jira/jira-original.svg',
    tags: ['Project Management', 'Agile', 'Issue Tracking'],
    featured: false,
    type: 'tool',
    pricing: 'paid',
    difficulty: 'intermediate',
    lastUpdated: '2023-10-20'
  },
  {
    id: '10',
    title: 'Selenium',
    description: "Selenium automates browsers. That's it! What you do with that power is entirely up to you.",
    category: 'Testing & QA',
    url: 'https://www.selenium.dev/',
    image: '/images/selenium.svg',
    tags: ['Automation', 'Browser Testing', 'WebDriver'],
    featured: false,
    type: 'tool',
    pricing: 'open-source',
    difficulty: 'advanced',
    lastUpdated: '2023-09-15'
  },
  {
    id: '11',
    title: 'Docker',
    description: 'Docker is a platform for developing, shipping, and running applications in containers, making it easy to build and deploy applications in any environment.',
    category: 'DevOps',
    url: 'https://www.docker.com/',
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg',
    tags: ['Containers', 'DevOps', 'Deployment'],
    featured: true,
    type: 'tool',
    pricing: 'freemium',
    difficulty: 'intermediate',
    lastUpdated: '2024-01-15'
  },
  {
    id: '12',
    title: 'GitHub Actions',
    description: 'GitHub Actions makes it easy to automate all your software workflows, with world-class CI/CD. Build, test, and deploy your code right from GitHub.',
    category: 'DevOps',
    url: 'https://github.com/features/actions',
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg',
    tags: ['CI/CD', 'Automation', 'DevOps'],
    featured: false,
    type: 'service',
    pricing: 'freemium',
    difficulty: 'intermediate',
    lastUpdated: '2023-12-05'
  },
  {
    id: '13',
    title: 'Tailwind CSS',
    description: 'A utility-first CSS framework packed with classes like flex, pt-4, text-center and rotate-90 that can be composed to build any design, directly in your markup.',
    category: 'Development',
    url: 'https://tailwindcss.com/',
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg',
    tags: ['CSS', 'Frontend', 'Design'],
    featured: true,
    type: 'framework',
    pricing: 'open-source',
    difficulty: 'beginner',
    lastUpdated: '2024-01-20'
  },
  {
    id: '14',
    title: 'Notion',
    description: 'All-in-one workspace for notes, tasks, wikis, and databases. Notion is designed to help you organize your work and boost productivity.',
    category: 'Productivity',
    url: 'https://www.notion.so/',
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/notion/notion-original.svg',
    tags: ['Note-taking', 'Project Management', 'Knowledge Base'],
    featured: true,
    type: 'tool',
    pricing: 'freemium',
    difficulty: 'beginner',
    lastUpdated: '2023-12-25'
  },
  {
    id: '15',
    title: 'freeCodeCamp',
    description: 'Learn to code for free with interactive tutorials, programming challenges, and development projects.',
    category: 'Learning',
    url: 'https://www.freecodecamp.org/',
    image: '/images/fcc.png',
    tags: ['Learning', 'Web Development', 'Programming'],
    featured: true,
    type: 'course',
    pricing: 'free',
    difficulty: 'all-levels',
    lastUpdated: '2024-01-01'
  },
  {
    id: '16',
    title: 'Udemy',
    description: 'Online learning platform with thousands of courses on programming, testing, design, and more.',
    category: 'Learning',
    url: 'https://www.udemy.com/',
    image: '/images/udemy.svg',
    tags: ['Courses', 'Learning', 'Skills Development'],
    featured: false,
    type: 'service',
    pricing: 'paid',
    difficulty: 'all-levels',
    lastUpdated: '2023-12-15'
  },
  {
    id: '17',
    title: 'Trello',
    description: 'Trello is a collaboration tool that organizes your projects into boards, lists, and cards so you can prioritize and track progress.',
    category: 'Productivity',
    url: 'https://trello.com/',
    image: '/images/trello.svg',
    tags: ['Project Management', 'Kanban', 'Collaboration'],
    featured: false,
    type: 'tool',
    pricing: 'freemium',
    difficulty: 'beginner',
    lastUpdated: '2023-11-25'
  }
];

// Helper functions
export function getResourcesByCategory(category: string): Resource[] {
  return resources.filter(resource => resource.category === category);
}

export function getResourcesByTag(tag: string): Resource[] {
  return resources.filter(resource => resource.tags.includes(tag));
}

export function getFeaturedResources(): Resource[] {
  return resources.filter(resource => resource.featured);
}

export function getResourcesByType(type: string): Resource[] {
  return resources.filter(resource => resource.type === type);
}

export function getResourcesByPricing(pricing: string): Resource[] {
  return resources.filter(resource => resource.pricing === pricing);
}
