import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Api } from '../../../services/api';

@Component({
  selector: 'app-service-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './service-form.html',
  styleUrl: './service-form.scss',
})
export class ServiceForm implements OnInit {
  private api = inject(Api);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastr = inject(ToastrService);

  isEdit = false;
  serviceId = '';
  isLoading = false;

  service = {
    title: '',
    slug: '',
    icon: 'ri-code-s-slash-line',
    shortDescription: '',
    overview: '',
    features: [] as string[],
    technologies: [] as string[],
    benefits: [] as string[],
    isActive: true,
  };

  featuresText = '';
  technologiesText = '';
  benefitsText = '';

  ngOnInit(): void {
    this.serviceId = this.route.snapshot.paramMap.get('id') || '';
    this.isEdit = !!this.serviceId;

    if (this.isEdit) {
      this.loadService();
    }
  }

  generateSlug(): void {
    if (this.isEdit) return;

    this.service.slug = this.service.title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-');
  }

  private splitList(value: string): string[] {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  private generateId(): string {
    return 'cms' + crypto.randomUUID().replace(/-/g, '');
  }

  private loadService(): void {
    this.isLoading = true;

    this.api.getServiceById(this.serviceId).subscribe({
      next: (data: any) => {
        if (!data) {
          this.toastr.error('Service not found');
          this.router.navigate(['/admin/services']);
          return;
        }

        this.service = {
          title: data.title || '',
          slug: data.slug || '',
          icon: data.icon || 'ri-code-s-slash-line',
          shortDescription: data.shortDescription || '',
          overview: data.overview || '',
          features: Array.isArray(data.features) ? data.features : [],
          technologies: Array.isArray(data.technologies) ? data.technologies : [],
          benefits: Array.isArray(data.benefits) ? data.benefits : [],
          isActive: data.isActive !== false,
        };

        this.featuresText = this.service.features.join(', ');
        this.technologiesText = this.service.technologies.join(', ');
        this.benefitsText = this.service.benefits.join(', ');

        this.isLoading = false;
      },

      error: (error) => {
        console.error('Load Service Error:', error);

        this.isLoading = false;

        this.toastr.error(error?.error?.message || 'Unable to load service');
      },
    });
  }

  saveService(): void {
    if (
      !this.service.title.trim() ||
      !this.service.slug.trim() ||
      !this.service.shortDescription.trim()
    ) {
      this.toastr.warning('Please fill the required fields');
      return;
    }

    /*
     * CREATE
     * New ID generate hoga.
     *
     * EDIT
     * Existing serviceId use hoga API URL me,
     * isliye payload me ID bhejne ki zarurat nahi.
     */
    const now = new Date().toISOString();

    const payload = {
      ...(this.isEdit ? {} : { id: this.generateId() }),

      title: this.service.title.trim(),
      slug: this.service.slug.trim(),
      icon: this.service.icon.trim() || 'ri-code-s-slash-line',
      shortDescription: this.service.shortDescription.trim(),
      overview: this.service.overview.trim(),

      features: this.splitList(this.featuresText),
      technologies: this.splitList(this.technologiesText),
      benefits: this.splitList(this.benefitsText),

      isActive: this.service.isActive,

      updatedAt: now,

      ...(this.isEdit ? {} : { createdAt: now }),
    };

    this.isLoading = true;

    const request = this.isEdit
      ? this.api.updateService(this.serviceId, payload)
      : this.api.createService(payload);

    request.subscribe({
      next: (response: any) => {
        this.isLoading = false;

        this.toastr.success(response?.message || 'Service saved successfully');

        this.router.navigate(['/admin/services']);
      },

      error: (error) => {
        this.isLoading = false;

        console.error('Save Service Error:', error);

        this.toastr.error(error?.error?.message || error?.error?.msg || 'Unable to save service');
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/services']);
  }
}
