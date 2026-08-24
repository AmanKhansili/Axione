import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Api } from '../../../services/api';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [RouterLink, FormsModule, DatePipe],
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class Services implements OnInit {
  private api = inject(Api);
  private toastr = inject(ToastrService);
  private cdr = inject(ChangeDetectorRef);

  services: any[] = [];
  filteredServices: any[] = [];

  search = '';
  loading = true;

  ngOnInit(): void {
    this.loadServices();
  }

  loadServices(): void {
    this.loading = true;

    this.api.getAdminServices().subscribe({
      next: (response: any) => {
        this.services = Array.isArray(response) ? response : [];
        this.filteredServices = [...this.services];
        this.loading = false;

        // Force the view to update after API response
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Admin Services Error:', error);

        this.services = [];
        this.filteredServices = [];
        this.loading = false;

        this.cdr.detectChanges();
      },
    });
  }

  searchServices(): void {
    const value = this.search.toLowerCase().trim();

    this.filteredServices = this.services.filter((service) => {
      const title = service?.title?.toLowerCase() ?? '';
      const description = service?.shortDescription?.toLowerCase() ?? '';

      return title.includes(value) || description.includes(value);
    });

    this.cdr.detectChanges();
  }

  deleteService(id: string): void {
    if (!confirm('Delete this service?')) {
      return;
    }

    this.api.deleteService(id).subscribe({
      next: (response: any) => {
        this.toastr.success(response.message || 'Service deleted successfully');

        this.services = this.services.filter((x) => x.id !== id);
        this.filteredServices = this.filteredServices.filter((x) => x.id !== id);

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Delete Service Error:', error);

        this.toastr.error(error?.error?.message || 'Unable to delete service');

        this.cdr.detectChanges();
      },
    });
  }
}
