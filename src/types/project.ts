export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  year: string;
  description: string;
  longDescription: string;
  features: string[];
  challenges: string[];
  solutions: string[];
  outcome: string;
  tags: string[];
  technologies: string[];
  images: {
    main: string;
    gallery: string[];
  };
  links: {
    github?: string;
    demo?: string;
    documentation?: string;
  };
  featured?: boolean;
}

export interface ProjectCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}
