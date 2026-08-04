import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  admin = JSON.parse(localStorage.getItem('admin') || '{}');

  get pageTitle() {
    const url = location.pathname;

    if (url.includes('blogs')) return 'Blogs';

    if (url.includes('services')) return 'Services';

    if (url.includes('contacts')) return 'Contacts';

    if (url.includes('newsletter')) return 'Newsletter';

    if (url.includes('chatbot')) return 'AI Chatbot';

    return 'Dashboard';
  }
}
