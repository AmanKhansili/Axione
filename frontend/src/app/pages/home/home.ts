import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  activeFaq: number | null = null;

  faqs = [
    {
      question: 'What does Axione Solutions do?',
      answer:
        'Axione Solutions helps businesses build modern digital solutions, including websites, web applications, software solutions, and other technology services tailored to their business needs.',
    },
    {
      question: 'How can I get a project started with Axione Solutions?',
      answer:
        'Simply get in touch with our team and share your requirements. We will understand your business needs, discuss the project scope, and guide you through the next steps.',
    },
    {
      question: 'Can you build a website according to our specific requirements?',
      answer:
        'Yes. We build websites based on your business requirements, brand identity, target audience, and desired functionality rather than using a one-size-fits-all approach.',
    },
    // {
    //   question: 'Do you work with both small businesses and larger organizations?',
    //   answer:
    //     'Yes. We work with businesses of different sizes and can tailor our solutions according to the project requirements, goals, and budget.',
    // },
    {
      question: 'How much does a website or software project cost?',
      answer:
        'The cost depends on the project scope, features, design, technology, and development requirements. Contact us with your requirements and we can discuss the appropriate solution.',
    },
    {
      question: 'How long will it take to complete my project?',
      answer:
        'The timeline depends on the complexity and scope of the project. After understanding your requirements, we can provide an estimated development timeline.',
    },
    // {
    //   question: 'Can you redesign or improve an existing website?',
    //   answer:
    //     'Yes. We can redesign existing websites, improve their user experience, make them responsive, and add or improve functionality based on your requirements.',
    // },
    {
      question: 'How can I contact Axione Solutions?',
      answer:
        'You can reach us at info@axionesolutionllc.com or through the Contact Us section on our website. Share your requirements and our team will get back to you.',
    },
  ];

  toggleFaq(index: number): void {
    this.activeFaq = this.activeFaq === index ? null : index;
  }
}
