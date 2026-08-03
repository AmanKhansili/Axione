import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Api } from '../../../services/api';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './service-detail.html',
  styleUrl: './service-detail.scss',
})
export class ServiceDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private api = inject(Api);

  service: any = null;
  loading = true;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');

      if (!slug) {
        this.loading = false;
        return;
      }

      this.getService(slug);
    });
  }

  getService(slug: string): void {
    this.api.getServiceBySlug(slug).subscribe({
      next: (response: any) => {
        this.service = response;
        this.loading = false;
      },

      error: (error) => {
        console.error('Service Detail Error:', error);

        this.service = null;
        this.loading = false;
      },
    });
  }
}
