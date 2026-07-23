import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ServiceModalComponent } from '../../components/service-modal/service-modal';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [RouterLink, ServiceModalComponent],
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class Services {
  scrollToServices(): void {
    const element = document.getElementById('services');
    element?.scrollIntoView({
      behavior: 'smooth',
    });
  }

  showModal = false;

  selectedService: any = null;

  servicesData = [
    {
      title: 'Web Development',
      icon: 'ri-code-box-line',
      overview:
        'We build modern, secure and scalable web applications for startups and enterprises.',

      features: [
        'Corporate Website',
        'E-Commerce Solutions',
        'Custom Web Applications',
        'REST API Integration',
      ],

      technologies: [
        'HTML',
        'CSS',
        'JavaScript',
        'React',
        'Next.js',
        'Angular',
        'SQL Server',
        'Azure',
      ],
    },

    {
      title: 'Agentic AI',
      icon: 'ri-robot-2-line',
      overview: 'Build intelligent AI agents to automate customer support and business operations.',

      features: [
        'AI Business Agents',
        'Customer Support Bots',
        'Virtual Assistants',
        'Knowledge Base',
      ],

      technologies: ['OpenAI', 'Python', 'Azure AI', 'LangChain/Langraph'],
    },

    {
      title: 'AI Automation',
      icon: 'ri-cpu-line',
      overview: 'Automate repetitive business processes using intelligent workflows.',

      features: [
        'Workflow Automation',
        'CRM Automation',
        'Email Automation',
        'Business Process Automation',
      ],

      technologies: ['Power Automate', 'Zapier', 'REST API', 'OpenAI'],
    },

    {
      title: 'Digital Marketing',
      icon: 'ri-megaphone-line',
      overview: 'Grow your business with SEO, paid marketing and social media strategies.',

      features: ['SEO', 'Google Ads', 'Social Media Marketing', 'Analytics'],

      technologies: ['Google Ads', 'GA4', 'Meta', 'Search Console'],
    },

    {
      title: 'Support & Maintenance',
      icon: 'ri-customer-service-2-line',
      overview: 'Continuous monitoring, maintenance and support for your applications.',

      features: ['Bug Fixes', 'Performance Optimization', 'Monitoring', 'Technical Support'],

      technologies: ['SQL Server', 'Azure', 'Docker'],
    },

    {
      title: 'UI/UX Design',
      icon: 'ri-layout-4-line',
      overview: 'Design beautiful and user-friendly digital experiences.',

      features: ['Wireframing', 'UI Design', 'User Research', 'Interactive Prototype'],

      technologies: ['Figma', 'Adobe XD', 'Illustrator', 'Photoshop'],
    },
  ];

  openModal(service: any) {
    this.selectedService = service;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedService = null;
  }
}
