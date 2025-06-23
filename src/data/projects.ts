import { Project, ProjectCategory } from '@/types/project';

export const projectCategories: ProjectCategory[] = [
  {
    id: '1',
    name: 'QA Engineering',
    slug: 'qa-engineering',
    description: 'Projects focused on quality assurance, testing automation, and test frameworks'
  },
  {
    id: '2',
    name: 'Full-Stack Development',
    slug: 'full-stack-development',
    description: 'Projects involving both frontend and backend development'
  },
  {
    id: '3',
    name: 'Data Analytics',
    slug: 'data-analytics',
    description: 'Projects involving data processing, analysis, and visualization'
  },
  {
    id: '4',
    name: 'Mobile Development',
    slug: 'mobile-development',
    description: 'Projects focused on mobile application development'
  }
];

export const projects: Project[] = [
  {
    id: '1',
    title: 'E-commerce Website Testing',
    slug: 'ecommerce-website-testing',
    category: 'QA Engineering',
    year: '2025',
    description: 'A comprehensive testing framework for e-commerce platforms with automated test suites for product listings, checkout flows, and payment processing.',
    longDescription: `This project involved developing a comprehensive testing framework for e-commerce platforms, focusing on ensuring reliability and performance across critical user journeys. The framework includes automated test suites for product listings, search functionality, checkout flows, payment processing, and user account management.

The testing solution was designed to be scalable and maintainable, with a focus on reducing test execution time while maximizing coverage. It includes both UI tests using Selenium WebDriver and API tests using REST Assured, allowing for comprehensive testing at different levels of the application stack.`,
    features: [
      'End-to-end test automation for critical user journeys',
      'Performance testing for high-traffic scenarios',
      'Security testing for payment processing',
      'Cross-browser compatibility testing',
      'Mobile responsiveness testing',
      'Continuous integration with Jenkins pipeline'
    ],
    challenges: [
      'Handling dynamic elements in the UI that change frequently',
      'Managing test data across multiple test environments',
      'Ensuring tests are resilient to network latency and third-party service failures',
      'Reducing test execution time for the CI/CD pipeline'
    ],
    solutions: [
      'Implemented a robust page object model with wait strategies for dynamic elements',
      'Created a test data management system with database seeding and cleanup',
      'Added retry mechanisms and circuit breakers for external service calls',
      'Optimized test execution with parallel running and selective test execution'
    ],
    outcome: 'The testing framework reduced regression testing time by 70% while increasing test coverage by 40%. It helped identify critical bugs before production deployment, improving overall product quality and customer satisfaction.',
    tags: ['JIRA', 'ZEPHYR', 'AUTOMATION'],
    technologies: ['Selenium WebDriver', 'Java', 'TestNG', 'REST Assured', 'Jenkins', 'Docker', 'MySQL'],
    images: {
      main: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000',
      gallery: [
        'https://images.unsplash.com/photo-1555952517-2e8e729e0b44?q=80&w=1000',
        'https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1000',
        'https://images.unsplash.com/photo-1555952517-2e8e729e0b44?q=80&w=1000'
      ]
    },
    links: {
      github: 'https://github.com/n1ml03/Website-Testing',
      demo: 'https://github.com/n1ml03/Website-Testing'
    },
    featured: true
  },
  {
    id: '2',
    title: 'Point of Sale (POS) System',
    slug: 'point-of-sale-system',
    category: 'Full-Stack Development',
    year: '2025',
    description: 'A responsive admin dashboard built with React and TypeScript featuring data visualization, user management, and real-time analytics.',
    longDescription: `The Nexus Checkout System is a modern Point of Sale (POS) solution designed for small to medium-sized retail businesses. It features a responsive admin dashboard built with React and TypeScript, providing powerful data visualization, comprehensive user management, and real-time analytics.

The system includes inventory management, sales tracking, employee management, and reporting features. It's designed to be user-friendly while providing robust functionality for business operations.`,
    features: [
      'Intuitive user interface with responsive design',
      'Real-time inventory management and stock alerts',
      'Customer management with purchase history',
      'Employee management with role-based access control',
      'Comprehensive reporting and analytics dashboard',
      'Offline mode with data synchronization',
      'Multi-payment method support including credit cards and mobile payments'
    ],
    challenges: [
      'Ensuring data consistency between offline and online modes',
      'Optimizing performance for large inventory databases',
      'Creating an intuitive UI that works well on both desktop and mobile devices',
      'Implementing secure payment processing'
    ],
    solutions: [
      'Used IndexedDB for offline data storage with conflict resolution strategies',
      'Implemented data pagination and lazy loading for large datasets',
      'Adopted a mobile-first design approach with responsive components',
      'Integrated with secure payment gateways and implemented PCI compliance measures'
    ],
    outcome: 'The POS system has been successfully deployed to multiple retail businesses, resulting in improved operational efficiency, reduced checkout times, and better inventory management. The analytics features have helped businesses make data-driven decisions to optimize their operations.',
    tags: ['REACT', 'TYPESCRIPT', 'POSTGRESSQL'],
    technologies: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Redux', 'Tailwind CSS', 'Chart.js'],
    images: {
      main: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000',
      gallery: [
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000',
        'https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1000',
        'https://images.unsplash.com/photo-1555952517-2e8e729e0b44?q=80&w=1000'
      ]
    },
    links: {
      github: 'https://github.com/n1ml03/nexus-checkout-system',
      demo: 'https://nexus-checkout-system.vercel.app/'
    },
    featured: true
  },
  {
    id: '3',
    title: 'Customer Behavior Analysis',
    slug: 'customer-behavior-analysis',
    category: 'Data Analytics',
    year: '2024',
    description: 'A data mining project that analyzes customer behavior patterns to provide insights for marketing strategies and product recommendations.',
    longDescription: `This data mining project focuses on analyzing customer behavior patterns to provide actionable insights for marketing strategies and product recommendations. The project involves collecting, processing, and analyzing large datasets of customer interactions, purchase history, and demographic information.

Using advanced data mining techniques and machine learning algorithms, the project identifies patterns and trends in customer behavior, segments customers based on their preferences and behaviors, and generates personalized product recommendations.`,
    features: [
      'Customer segmentation based on purchasing behavior',
      'Market basket analysis to identify product associations',
      'Churn prediction to identify at-risk customers',
      'Sentiment analysis of customer reviews and feedback',
      'Personalized product recommendation engine',
      'Interactive visualization dashboard for insights'
    ],
    challenges: [
      'Processing and analyzing large volumes of unstructured data',
      'Ensuring data privacy and compliance with regulations',
      'Developing accurate predictive models with limited historical data',
      'Creating meaningful visualizations for complex data relationships'
    ],
    solutions: [
      'Implemented distributed processing with Apache Spark for large datasets',
      'Developed anonymization and data protection protocols',
      'Used ensemble learning methods to improve prediction accuracy',
      'Created interactive visualizations with D3.js and Matplotlib'
    ],
    outcome: 'The project delivered valuable insights that led to a 25% increase in cross-selling opportunities, a 15% reduction in customer churn, and a 30% improvement in marketing campaign effectiveness through better targeting.',
    tags: ['PYTHON', 'PANDAS', 'MATPLOTLIB', 'SEABORN'],
    technologies: ['Python', 'Pandas', 'Scikit-learn', 'Matplotlib', 'Seaborn', 'Jupyter Notebooks', 'SQL'],
    images: {
      main: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=1000',
      gallery: [
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000',
        'https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1000',
        'https://images.unsplash.com/photo-1555952517-2e8e729e0b44?q=80&w=1000'
      ]
    },
    links: {
      github: 'https://github.com/n1ml03/Project-Data-Mining',
      demo: 'https://github.com/n1ml03/Project-Data-Mining'
    },
    featured: false
  }
];

// Helper functions
export function getAllProjects(): Project[] {
  return projects;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find(project => project.slug === slug);
}

export function getProjectsByCategory(category: string): Project[] {
  return projects.filter(project => project.category === category);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter(project => project.featured);
}

export function getRelatedProjects(currentProjectId: string, limit: number = 3): Project[] {
  const currentProject = projects.find(project => project.id === currentProjectId);
  
  if (!currentProject) return [];
  
  return projects
    .filter(project => 
      project.id !== currentProjectId && 
      (project.category === currentProject.category || 
       project.tags.some(tag => currentProject.tags.includes(tag)))
    )
    .slice(0, limit);
}
