import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  private router = inject(Router);

  blogOpen = false;
  serviceOpen = false;

  toggleBlogs() {
    this.blogOpen = !this.blogOpen;
  }

  toggleServices() {
    this.serviceOpen = !this.serviceOpen;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');

    this.router.navigate(['/admin/login']);
  }
}