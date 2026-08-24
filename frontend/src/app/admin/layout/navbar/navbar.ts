import { Component, inject } from '@angular/core';
import { Api } from '../../../services/api';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  private api = inject(Api);

  get admin(): any {
    return this.api.getStoredUser() || {};
  }

  get pageTitle(): string {
    const url = location.pathname;

    if (url.includes('blogs')) return 'Blogs';
    if (url.includes('services')) return 'Services';
    if (url.includes('contacts')) return 'Contacts';
    if (url.includes('newsletter')) return 'Newsletter';
    if (url.includes('chatbot')) return 'AI Chatbot';

    return 'Dashboard';
  }
}
