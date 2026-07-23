import { Service } from '../model/service.model';

export const SERVICES: Service[] = [
  {
    id: 'web-development',
    title: 'Web Development',
    icon: 'ri-code-box-line',
    tagline: 'Modern, scalable & secure web applications.',
    overview:
      'We develop responsive corporate websites, enterprise applications and custom platforms focused on performance, scalability and user experience.',

    features: [
      'Corporate Websites',
      'E-Commerce Solutions',
      'Custom Web Applications',
      'REST API Integration',
      'Performance Optimization',
    ],

    technologies: ['Angular', '.NET Core', 'SQL Server', 'Azure', 'Docker'],
  },

  {
    id: 'agentic-ai',
    title: 'Agentic AI',
    icon: 'ri-robot-2-line',
    tagline: 'Intelligent AI agents for business.',
    overview:
      'Build autonomous AI agents capable of handling customer support, business workflows and decision making.',

    features: [
      'AI Business Agents',
      'Virtual Assistants',
      'Customer Support Bots',
      'Knowledge Base',
      'Multi Agent Systems',
    ],

    technologies: ['OpenAI', 'LangChain', 'Python', 'Vector DB', 'Azure AI'],
  },

  {
    id: 'ai-automation',
    title: 'AI Automation',
    icon: 'ri-cpu-line',
    tagline: 'Automate repetitive business operations.',
    overview:
      'Increase efficiency with intelligent workflow automation integrated into your existing systems.',

    features: [
      'Workflow Automation',
      'CRM Automation',
      'Email Automation',
      'Business Processes',
      'Custom Integrations',
    ],

    technologies: ['Power Automate', 'Zapier', 'Make', 'REST API', 'OpenAI'],
  },
];
