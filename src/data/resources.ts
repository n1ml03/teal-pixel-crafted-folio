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
  category: string; // Should match ResourceCategory.name
  url: string;
  image: string;
  tags: string[];
  featured?: boolean;
  type: 'tool' | 'template' | 'guide' | 'library' | 'framework' | 'language' | 'service' | 'course';
  pricing?: 'free' | 'freemium' | 'paid' | 'open-source';
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'all-levels';
  lastUpdated?: string; // YYYY-MM-DD
  icon?: string; // Optional: if the resource itself has a specific icon distinct from its image
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
    tags: ['Frontend', 'JavaScript'],
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
    tags: ['IDE', 'Development'],
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
    image: '/images/selenium.svg', // Assuming you have a local image
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
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/githubactions/githubactions-original.svg', // Specific GitHub Actions icon
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
    tags: ['Frontend', 'Design'],
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
    image: '/images/fcc.webp', // Assuming local image
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
    image: '/images/udemy.svg', // Assuming local image
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
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/trello/trello-plain.svg',
    tags: ['Project Management', 'Kanban', 'Collaboration'],
    featured: false,
    type: 'tool',
    pricing: 'freemium',
    difficulty: 'beginner',
    lastUpdated: '2023-11-25'
  },
  // Adding more resources
  {
    id: '18',
    title: 'Node.js',
    description: 'Node.js® is a JavaScript runtime built on Chrome\'s V8 JavaScript engine. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient.',
    category: 'Development',
    url: 'https://nodejs.org/',
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original-wordmark.svg',
    tags: ['Backend', 'JavaScript', 'Runtime'],
    featured: true,
    type: 'framework', // Classified as framework due to its comprehensive nature for building applications
    pricing: 'open-source',
    difficulty: 'intermediate',
    lastUpdated: '2024-01-18'
  },
  {
    id: '19',
    title: 'Next.js',
    description: 'The React Framework for Production. Next.js gives you the best developer experience with all the features you need for production: hybrid static & server rendering, TypeScript support, smart bundling, route pre-fetching, and more.',
    category: 'Development',
    url: 'https://nextjs.org/',
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg',
    tags: ['React', 'Frontend', 'SSR', 'Framework'],
    featured: true,
    type: 'framework',
    pricing: 'open-source',
    difficulty: 'intermediate',
    lastUpdated: '2024-01-22'
  },
  {
    id: '20',
    title: 'Kubernetes',
    description: 'Kubernetes, also known as K8s, is an open-source system for automating deployment, scaling, and management of containerized applications.',
    category: 'DevOps',
    url: 'https://kubernetes.io/',
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kubernetes/kubernetes-plain.svg',
    tags: ['Containers', 'Orchestration', 'DevOps'],
    featured: true,
    type: 'tool',
    pricing: 'open-source',
    difficulty: 'advanced',
    lastUpdated: '2024-01-12'
  },
  {
    id: '21',
    title: 'MDN Web Docs',
    description: 'Resources for developers, by developers. Documenting web technologies, including CSS, HTML, and JavaScript, since 2005.',
    category: 'Learning',
    url: 'https://developer.mozilla.org/',
    image: '/images/mdn.svg', // Assuming local image, as no direct devicon
    tags: ['Documentation', 'Web Standards', 'HTML', 'CSS', 'JavaScript'],
    featured: true,
    type: 'guide',
    pricing: 'free',
    difficulty: 'all-levels',
    lastUpdated: '2024-01-25'
  },
  {
    id: '22',
    title: 'Slack',
    description: 'Slack is where work happens. It brings all your team’s communication together, giving everyone a shared workspace where conversations are organized and accessible.',
    category: 'Productivity',
    url: 'https://slack.com/',
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/slack/slack-original.svg',
    tags: ['Communication', 'Team Collaboration', 'Messaging'],
    featured: false,
    type: 'tool',
    pricing: 'freemium',
    difficulty: 'beginner',
    lastUpdated: '2023-12-01'
  },
  {
    id: '23',
    title: 'OWASP ZAP',
    description: 'The OWASP Zed Attack Proxy (ZAP) is one of the world’s most popular free security tools and is actively maintained by a dedicated international team of volunteers.',
    category: 'Security',
    url: 'https://www.zaproxy.org/',
    image: '/images/owasp-zap.webp', // Placeholder for ZAP logo
    tags: ['Security Testing', 'Vulnerability Scanner', 'Penetration Testing'],
    featured: false,
    type: 'tool',
    pricing: 'open-source',
    difficulty: 'intermediate',
    lastUpdated: '2023-11-10'
  },
  {
    id: '24',
    title: 'Vue.js',
    description: 'The Progressive JavaScript Framework. An approachable, performant and versatile framework for building web user interfaces.',
    category: 'Development',
    url: 'https://vuejs.org/',
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg',
    tags: ['Frontend', 'JavaScript', 'UI', 'Framework'],
    featured: true,
    type: 'framework',
    pricing: 'open-source',
    difficulty: 'beginner',
    lastUpdated: '2023-12-28'
  },
  {
    id: '25',
    title: 'Storybook',
    description: 'Storybook is an open source tool for building UI components and pages in isolation. It streamlines UI development, testing, and documentation.',
    category: 'Development',
    url: 'https://storybook.js.org/',
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/storybook/storybook-original.svg',
    tags: ['UI Development', 'Component Library', 'Frontend'],
    featured: false,
    type: 'tool',
    pricing: 'open-source',
    difficulty: 'intermediate',
    lastUpdated: '2023-11-30'
  },
  {
    id: '26',
    title: 'Snyk',
    description: 'Snyk is a developer security platform that helps you find and fix vulnerabilities in your code, open source dependencies, containers, and IaC.',
    category: 'Security',
    url: 'https://snyk.io/',
    image: '/images/snyk.svg', // Placeholder for Snyk logo
    tags: ['Security', 'Vulnerability Management', 'DevSecOps'],
    featured: false,
    type: 'service',
    pricing: 'freemium',
    difficulty: 'intermediate',
    lastUpdated: '2024-01-08'
  },
  {
    id: '27',
    title: 'Jenkins',
    description: 'Jenkins is an open source automation server which enables developers around the world to reliably build, test, and deploy their software.',
    category: 'DevOps',
    url: 'https://www.jenkins.io/',
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jenkins/jenkins-original.svg',
    tags: ['CI/CD', 'Automation', 'Build Tool'],
    featured: false,
    type: 'tool',
    pricing: 'open-source',
    difficulty: 'intermediate',
    lastUpdated: '2023-10-25'
  },
  {
    id: '28',
    title: 'GraphQL',
    description: 'GraphQL is a query language for your API, and a server-side runtime for executing queries by using a type system you define for your data.',
    category: 'Development',
    url: 'https://graphql.org/',
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/graphql/graphql-plain.svg',
    tags: ['API', 'Query Language', 'Data Fetching'],
    featured: true,
    type: 'language',
    pricing: 'open-source',
    difficulty: 'intermediate',
    lastUpdated: '2023-11-05'
  },
  {
    id: '29',
    title: 'Coursera',
    description: 'Build skills with courses, certificates, and degrees online from world-class universities and companies.',
    category: 'Learning',
    url: 'https://www.coursera.org/',
    image: '/images/coursera.svg', // Placeholder for Coursera logo
    tags: ['Online Courses', 'Education', 'Certification'],
    featured: false,
    type: 'service',
    pricing: 'paid', // Core experience for certificates is paid
    difficulty: 'all-levels',
    lastUpdated: '2023-12-01'
  },
  {
    id: '30',
    title: 'Figma Community',
    description: 'Explore thousands of free and paid templates, plugins, and UI kits to kickstart your next project or learn from the best designers.',
    category: 'Design',
    url: 'https://www.figma.com/community',
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg', // Same as Figma
    tags: ['Templates', 'Plugins', 'UI Kits', 'Design Resources'],
    featured: false,
    type: 'template', // Primarily templates, but also other resource types
    pricing: 'freemium',
    difficulty: 'all-levels',
    lastUpdated: '2024-01-19'
  },
  {
    id: '31',
    title: 'Amazon Web Services (AWS)',
    description: 'AWS offers a broad set of global cloud-based products including compute, storage, databases, analytics, networking, mobile, developer tools, management tools, IoT, security and enterprise applications.',
    category: 'DevOps',
    url: 'https://aws.amazon.com/',
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
    tags: ['Cloud', 'Infrastructure', 'Hosting', 'IaaS', 'PaaS'],
    featured: true,
    type: 'service',
    pricing: 'paid', // Pay-as-you-go with a free tier
    difficulty: 'intermediate',
    lastUpdated: '2024-01-20'
  },
  {
    id: '32',
    title: 'Google Cloud Platform (GCP)',
    description: 'GCP is a suite of cloud computing services that runs on the same infrastructure that Google uses to run its end-user products, such as Google Search and YouTube.',
    category: 'DevOps',
    url: 'https://cloud.google.com/',
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg',
    tags: ['Cloud', 'Infrastructure', 'Machine Learning', 'Big Data'],
    featured: false,
    type: 'service',
    pricing: 'paid', // Pay-as-you-go with a free tier
    difficulty: 'intermediate',
    lastUpdated: '2024-01-18'
  },
  {
    id: '33',
    title: 'Microsoft Azure',
    description: 'Azure is a cloud computing service created by Microsoft for building, testing, deploying, and managing applications and services through Microsoft-managed data centers.',
    category: 'DevOps',
    url: 'https://azure.microsoft.com/',
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azure/azure-original.svg',
    tags: ['Cloud', 'Microsoft', '.NET', 'Enterprise'],
    featured: false,
    type: 'service',
    pricing: 'paid', // Pay-as-you-go with a free tier
    difficulty: 'intermediate',
    lastUpdated: '2024-01-17'
  },
  {
    id: '34',
    title: 'TestRail',
    description: 'TestRail is a comprehensive web-based test case management software to efficiently manage, track, and organize your software testing efforts.',
    category: 'Testing & QA',
    url: 'https://www.gurock.com/testrail/',
    image: '/images/testrail.png', // Placeholder for TestRail logo
    tags: ['Test Management', 'QA', 'Reporting', 'Test Cases'],
    featured: false,
    type: 'tool',
    pricing: 'paid',
    difficulty: 'intermediate',
    lastUpdated: '2023-11-15'
  },
  {
    id: '35',
    title: 'Webflow',
    description: 'Webflow is a web design tool, CMS, and hosting platform that allows users to design, build, and launch responsive websites visually.',
    category: 'Design',
    url: 'https://webflow.com/',
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/webflow/webflow-original.svg',
    tags: ['Web Design', 'No-Code', 'CMS', 'Hosting'],
    featured: false,
    type: 'tool',
    pricing: 'freemium',
    difficulty: 'beginner',
    lastUpdated: '2023-12-10'
  },
  {
    id: '36',
    title: 'Git',
    description: 'Git is a free and open source distributed version control system designed to handle everything from small to very large projects with speed and efficiency.',
    category: 'Development',
    url: 'https://git-scm.com/',
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg',
    tags: ['Version Control', 'Source Code Management', 'Collaboration'],
    featured: true,
    type: 'tool',
    pricing: 'open-source',
    difficulty: 'beginner',
    lastUpdated: '2023-10-01'
  },
  {
    id: '37',
    title: 'GitHub',
    description: 'GitHub is a provider of Internet hosting for software development and version control using Git. It offers the distributed version control and source code management functionality of Git, plus its own features.',
    category: 'Development',
    url: 'https://github.com/',
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original-wordmark.svg',
    tags: ['Version Control', 'Collaboration', 'Code Hosting', 'CI/CD'],
    featured: true,
    type: 'service',
    pricing: 'freemium',
    difficulty: 'beginner',
    lastUpdated: '2024-01-20'
  },
  {
    id: '38',
    title: 'GitLab',
    description: 'GitLab is a complete DevOps platform, delivered as a single application. From project planning and source code management to CI/CD, monitoring, and security.',
    category: 'DevOps',
    url: 'https://about.gitlab.com/',
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/gitlab/gitlab-original.svg',
    tags: ['DevOps Platform', 'CI/CD', 'Version Control', 'Collaboration'],
    featured: false,
    type: 'service',
    pricing: 'freemium',
    difficulty: 'intermediate',
    lastUpdated: '2024-01-15'
  },
  {
    id: '39',
    title: 'Angular',
    description: 'Angular is a platform and framework for building single-page client applications using HTML and TypeScript. It is developed and maintained by Google.',
    category: 'Development',
    url: 'https://angular.io/',
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/angular/angular-original.svg',
    tags: ['Frontend', 'JavaScript', 'TypeScript', 'Framework', 'SPA'],
    featured: true,
    type: 'framework',
    pricing: 'open-source',
    difficulty: 'intermediate',
    lastUpdated: '2023-12-18'
  },
  {
    id: '40',
    title: 'Svelte',
    description: 'Svelte is a radical new approach to building user interfaces. Whereas traditional frameworks like React and Vue do the bulk of their work in the browser, Svelte shifts that work into a compile step that happens when you build your app.',
    category: 'Development',
    url: 'https://svelte.dev/',
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/svelte/svelte-original.svg',
    tags: ['Frontend', 'JavaScript', 'Compiler', 'UI'],
    featured: false,
    type: 'framework', // Classified as framework due to its role in UI building
    pricing: 'open-source',
    difficulty: 'intermediate',
    lastUpdated: '2023-11-22'
  },
  {
    id: '41',
    title: 'Zapier',
    description: 'Easy automation for busy people. Zapier moves info between your web apps automatically, so you can focus on your most important work.',
    category: 'Productivity',
    url: 'https://zapier.com/',
    image: '/images/zapier.svg', // Placeholder for Zapier logo
    tags: ['Automation', 'Integration', 'Workflow'],
    featured: false,
    type: 'service',
    pricing: 'freemium',
    difficulty: 'beginner',
    lastUpdated: '2023-12-05'
  },
  {
    id: '42',
    title: 'Miro',
    description: 'The online collaborative whiteboard platform to bring teams together, anytime, anywhere.',
    category: 'Productivity',
    url: 'https://miro.com/',
    image: '/images/miro.svg', // Placeholder for Miro logo
    tags: ['Collaboration', 'Whiteboard', 'Brainstorming', 'Diagramming'],
    featured: false,
    type: 'tool',
    pricing: 'freemium',
    difficulty: 'beginner',
    lastUpdated: '2023-11-28'
  },
  {
    id: '43',
    title: 'Terraform',
    description: 'Terraform enables you to safely and predictably create, change, and improve infrastructure. It is an open source tool that codifies APIs into declarative configuration files.',
    category: 'DevOps',
    url: 'https://www.terraform.io/',
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/terraform/terraform-original.svg',
    tags: ['Infrastructure as Code', 'IaC', 'Cloud', 'Automation'],
    featured: true,
    type: 'tool',
    pricing: 'open-source',
    difficulty: 'intermediate',
    lastUpdated: '2024-01-10'
  },
  {
    id: '44',
    title: 'Datadog',
    description: 'Datadog is the monitoring and security platform for cloud applications. It brings together data from servers, containers, databases, and third-party services to make your stack entirely observable.',
    category: 'DevOps',
    url: 'https://www.datadoghq.com/',
    image: '/images/datadog.svg',
    tags: ['Monitoring', 'APM', 'Logging', 'Observability', 'Security'],
    featured: false,
    type: 'service',
    pricing: 'paid',
    difficulty: 'intermediate',
    lastUpdated: '2024-01-05'
  },
  {
    id: '45',
    title: 'Chrome DevTools',
    description: 'A set of web developer tools built directly into the Google Chrome browser. DevTools can help you edit pages on-the-fly and diagnose problems quickly, which ultimately helps you build better websites, faster.',
    category: 'Development',
    url: 'https://developer.chrome.com/docs/devtools/',
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/chrome/chrome-original.svg', // Using Chrome icon
    tags: ['Debugging', 'Browser Tools', 'Performance', 'Frontend'],
    featured: true,
    type: 'tool',
    pricing: 'free',
    difficulty: 'beginner',
    lastUpdated: '2023-12-12'
  },
  {
    id: '46',
    title: 'Stack Overflow',
    description: 'A public platform building the definitive collection of coding questions & answers. A community-based space to find and contribute solutions to technical challenges.',
    category: 'Learning',
    url: 'https://stackoverflow.com/',
    image: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/stackoverflow/stackoverflow-original.svg',
    tags: ['Q&A', 'Community', 'Programming Help', 'Debugging'],
    featured: true,
    type: 'service',
    pricing: 'free',
    difficulty: 'all-levels',
    lastUpdated: '2024-01-20'
  },
  {
    id: '47',
    title: 'A List Apart',
    description: 'For people who make websites. A List Apart explores the design, development, and meaning of web content, with a special focus on web standards and best practices.',
    category: 'Learning',
    url: 'https://alistapart.com/',
    image: '/images/alistapart.svg', // Placeholder for A List Apart logo
    tags: ['Web Design', 'Web Development', 'Articles', 'Best Practices'],
    featured: false,
    type: 'guide',
    pricing: 'free',
    difficulty: 'intermediate',
    lastUpdated: '2024-01-15'
  },
  {
    id: '48',
    title: 'web.dev',
    description: 'Learn to build for the modern web. Get the latest guidance on how to build great web experiences on web.dev.',
    category: 'Learning',
    url: 'https://web.dev/',
    image: '/images/webdev.svg', // Placeholder for web.dev logo
    tags: ['Web Development', 'Performance', 'PWA', 'Accessibility', 'Best Practices'],
    featured: true,
    type: 'guide',
    pricing: 'free',
    difficulty: 'all-levels',
    lastUpdated: '2024-01-22'
  }
];

// Helper functions
export function getResourcesByCategory(categoryName: string): Resource[] {
  return resources.filter(resource => resource.category === categoryName);
}

export function getResourcesByTag(tag: string): Resource[] {
  return resources.filter(resource => resource.tags.includes(tag));
}

export function getFeaturedResources(): Resource[] {
  return resources.filter(resource => resource.featured);
}

export function getResourcesByType(typeValue: Resource['type']): Resource[] {
  return resources.filter(resource => resource.type === typeValue);
}

export function getResourcesByPricing(pricingValue: Resource['pricing']): Resource[] {
  return resources.filter(resource => resource.pricing === pricingValue);
}