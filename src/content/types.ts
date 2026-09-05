export interface CareerEntry {
  role: string;
  company: string;
  period: string;
  location: string;
}

export interface Certification {
  name: string;
  validUntil: string;
}

export interface Project {
  title: string;
  description: string;
  link: string | null;
}

export interface SiteContent {
  lang: 'de' | 'en';
  nav: {
    about: string;
    projects: string;
    contact: string;
  };
  hero: {
    name: string;
    role: string;
    pitch: string;
    ctaLabel: string;
  };
  about: {
    heading: string;
    careerHeading: string;
    career: CareerEntry[];
    educationHeading: string;
    education: string;
    certificationsHeading: string;
    certifications: Certification[];
  };
  projects: {
    heading: string;
    items: Project[];
  };
  contact: {
    heading: string;
    email: string;
    linkedin: string;
    github: string;
  };
}
