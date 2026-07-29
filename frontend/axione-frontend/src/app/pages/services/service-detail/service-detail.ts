import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SERVICES } from '../services-data';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './service-detail.html',
  styleUrl: './service-detail.scss',
})
export class ServiceDetail {
  service: any;

  constructor(private route: ActivatedRoute) {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');

      this.service = SERVICES.find((service) => service.slug === slug);
    });
  }
}
