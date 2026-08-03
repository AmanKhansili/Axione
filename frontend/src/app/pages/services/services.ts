import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Api } from '../../services/api';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class Services implements OnInit {
  private api = inject(Api);

  services: any[] = [];
  loading = true;

  ngOnInit(): void {
    this.getServices();
  }

  getServices(): void {
    this.api.getServices().subscribe({
      next: (response: any) => {
        this.services = response;
        this.loading = false;
      },

      error: (error) => {
        console.error('Services Error:', error);

        this.services = [];
        this.loading = false;
      },
    });
  }

  scrollToServices(): void {
    const element = document.getElementById('services');

    element?.scrollIntoView({
      behavior: 'smooth',
    });
  }
}
