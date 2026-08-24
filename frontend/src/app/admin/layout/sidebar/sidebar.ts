import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Api } from '../../../services/api';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  private router = inject(Router);
  private api = inject(Api);

  blogOpen = false;
  serviceOpen = false;

  toggleBlogs(): void {
    this.blogOpen = !this.blogOpen;
  }

  toggleServices(): void {
    this.serviceOpen = !this.serviceOpen;
  }

  logout(): void {
    this.api.logout().subscribe({
      next: () => this.router.navigate(['/admin/login']),
      error: () => this.router.navigate(['/admin/login']),
    });
  }
}
