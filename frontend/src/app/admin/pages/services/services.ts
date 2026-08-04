import { Component, OnInit, inject } from '@angular/core';
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

  services: any[] = [];
  filteredServices: any[] = [];

  search = '';

  loading = true;

  ngOnInit() {
    this.loadServices();
  }

  loadServices() {
    this.api.getServices().subscribe({
      next: (response: any) => {
        this.services = response;
        this.filteredServices = response;
        this.loading = false;
      },

      error: (error) => {
        console.error(error);
        this.loading = false;
      },
    });
  }

  searchServices() {
    const value = this.search.toLowerCase().trim();

    this.filteredServices = this.services.filter(
      (service) =>
        service.title.toLowerCase().includes(value) ||
        service.shortDescription.toLowerCase().includes(value),
    );
  }

  deleteService(id: string) {
    if (!confirm('Delete this service?')) {
      return;
    }

    this.api.deleteService(id).subscribe({
      next: (response: any) => {
        this.toastr.success(response.message);

        this.services = this.services.filter((x) => x.id !== id);
        this.filteredServices = this.filteredServices.filter((x) => x.id !== id);
      },

      error: (error) => {
        this.toastr.error(error.error.message);
      },
    });
  }
}
