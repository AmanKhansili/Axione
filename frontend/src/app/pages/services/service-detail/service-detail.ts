import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';

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
  private cdr = inject(ChangeDetectorRef);

  service: any = null;
  loading = true;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');

      if (!slug) {
        this.service = null;
        this.loading = false;

        this.cdr.detectChanges();
        return;
      }

      // Show loading while new service is being loaded
      this.loading = true;
      this.service = null;

      this.cdr.detectChanges();

      this.api.getServiceBySlug(slug).subscribe({
        next: (response: any) => {
          console.log('Service loaded:', response);

          this.service = response;
          this.loading = false;

          // Force Angular to update the UI immediately
          this.cdr.detectChanges();

          // Start the new detail page from top
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'auto',
          });
        },

        error: (error) => {
          console.error('Service Detail Error:', error);

          this.service = null;
          this.loading = false;

          this.cdr.detectChanges();

          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'auto',
          });
        },
      });
    });
  }
}
