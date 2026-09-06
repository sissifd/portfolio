import type { SiteContent } from './types';

const site: SiteContent = {
  lang: 'en',
  nav: {
    about: 'About',
    projects: 'Projects',
    contact: 'Contact',
    skipToContent: 'Skip to content',
  },
  hero: {
    name: 'Christian Sislak',
    role: 'Solution Architect — Custom Development & Custom AI',
    pitch:
      'I advise customers on custom development for SAP BTP, drive internal team and AI initiatives, and connect deep technical expertise with strategic consulting.',
    ctaLabel: 'Get in touch',
  },
  about: {
    heading: 'About Me',
    careerHeading: 'Career',
    career: [
      {
        role: 'Cloud Solution Architect — Custom Development & Custom AI',
        company: 'SAP',
        period: 'Jul 2024–Present',
        location: 'Eschborn (Hybrid)',
      },
      {
        role: 'Project Lead S/4HANA',
        company: 'DB Systel GmbH',
        period: 'Apr 2020–Jul 2024',
        location: 'Frankfurt',
      },
      {
        role: 'Product Owner, SAP Business Technology Platform Team',
        company: 'DB Systel GmbH',
        period: 'Mar 2020–Jul 2024',
        location: 'Frankfurt',
      },
      {
        role: 'Product Owner, SAP Mobile Unit',
        company: 'DB Systel GmbH',
        period: 'Jan 2018–Mar 2020',
        location: 'Frankfurt/Rhine-Main (Hybrid)',
      },
      {
        role: 'SAP Consultant',
        company: 'DB Systel GmbH',
        period: 'Jan 2016–Jan 2018',
        location: 'Frankfurt/Rhine-Main (Hybrid)',
      },
      {
        role: 'Senior Consultant / Consultant',
        company: 'Sopra Steria',
        period: 'Mar 2013–Dec 2015',
        location: 'Frankfurt/Rhine-Main',
      },
      {
        role: 'Business Process Consultant',
        company: 'Goodyear Dunlop Tires Germany GmbH',
        period: 'Dec 2010–Feb 2013',
        location: 'Fulda',
      },
    ],
    educationHeading: 'Education',
    education:
      "Bachelor's Degree, Computer Software and Media Applications — Fachhochschule Wiesbaden, 2006–2010",
    certificationsHeading: 'Certifications',
    certifications: [
      { name: 'SAP Certified Associate – SAP Generative AI Developer', validUntil: 'Jun 2026' },
      { name: 'SAP Certified Professional – Solution Architect, SAP BTP', validUntil: 'Aug 2026' },
    ],
  },
  projects: {
    heading: 'Projects',
    items: [
      { title: '[PLACEHOLDER]', description: '[PLACEHOLDER]', link: null },
      { title: '[PLACEHOLDER]', description: '[PLACEHOLDER]', link: null },
    ],
  },
  contact: {
    heading: 'Contact',
    email: 'chris.sislak@googlemail.com',
    linkedin: 'https://www.linkedin.com/in/christian-sislak-a6b5315a',
    github: '[PLACEHOLDER]',
  },
};

export default site;
