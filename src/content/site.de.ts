import type { SiteContent } from './types';

const site: SiteContent = {
  lang: 'de',
  nav: {
    about: 'Über mich',
    projects: 'Projekte',
    contact: 'Kontakt',
  },
  hero: {
    name: 'Christian Sislak',
    role: 'Solution Architect — Custom Development & Custom AI',
    pitch:
      'Ich berate Kunden bei kundeneigenen Entwicklungen auf SAP BTP, treibe interne Team- und KI-Initiativen voran und verbinde technische Tiefe mit strategischer Beratung.',
    ctaLabel: 'Kontakt aufnehmen',
  },
  about: {
    heading: 'Über mich',
    careerHeading: 'Werdegang',
    career: [
      {
        role: 'Cloud Solution Architect — Custom Development & Custom AI',
        company: 'SAP',
        period: 'Juli 2024–Heute',
        location: 'Eschborn (Hybrid)',
      },
      {
        role: 'Projektleiter S/4HANA',
        company: 'DB Systel GmbH',
        period: 'Apr. 2020–Juli 2024',
        location: 'Frankfurt',
      },
      {
        role: 'Product Owner Team SAP Business Technology Platform',
        company: 'DB Systel GmbH',
        period: 'März 2020–Juli 2024',
        location: 'Frankfurt',
      },
      {
        role: 'Product Owner Einheit SAP Mobile',
        company: 'DB Systel GmbH',
        period: 'Jan. 2018–März 2020',
        location: 'Frankfurt/Rhein-Main (Hybrid)',
      },
      {
        role: 'SAP Consultant',
        company: 'DB Systel GmbH',
        period: 'Jan. 2016–Jan. 2018',
        location: 'Frankfurt/Rhein-Main (Hybrid)',
      },
      {
        role: 'Senior Consultant / Consultant',
        company: 'Sopra Steria',
        period: 'März 2013–Dez. 2015',
        location: 'Frankfurt/Rhein-Main',
      },
      {
        role: 'Business Process Consultant',
        company: 'Goodyear Dunlop Tires Germany GmbH',
        period: 'Dez. 2010–Feb. 2013',
        location: 'Fulda',
      },
    ],
    educationHeading: 'Ausbildung',
    education:
      "Bachelor's Degree, Computer Software and Media Applications — Fachhochschule Wiesbaden, 2006–2010",
    certificationsHeading: 'Zertifizierungen',
    certifications: [
      { name: 'SAP Certified Associate – SAP Generative AI Developer', validUntil: 'Juni 2026' },
      { name: 'SAP Certified Professional – Solution Architect, SAP BTP', validUntil: 'Aug. 2026' },
    ],
  },
  projects: {
    heading: 'Projekte',
    items: [
      { title: '[PLACEHOLDER]', description: '[PLACEHOLDER]', link: null },
      { title: '[PLACEHOLDER]', description: '[PLACEHOLDER]', link: null },
    ],
  },
  contact: {
    heading: 'Kontakt',
    email: 'chris.sislak@googlemail.com',
    linkedin: '[PLACEHOLDER]',
    github: '[PLACEHOLDER]',
  },
};

export default site;
