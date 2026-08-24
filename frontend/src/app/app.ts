import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Header, Footer, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  isAdmin = false;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        const url = (event as NavigationEnd).urlAfterRedirects;

        this.isAdmin = url.startsWith('/admin');

        document.body.classList.toggle('admin-page', this.isAdmin);
      });

    // Initial page load
    this.isAdmin = this.router.url.startsWith('/admin');

    document.body.classList.toggle('admin-page', this.isAdmin);
  }
}
