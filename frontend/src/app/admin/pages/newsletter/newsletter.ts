import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api } from '../../../services/api';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-newsletter',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './newsletter.html',
  styleUrl: './newsletter.scss',
})
export class Newsletter implements OnInit {
  private api = inject(Api);
  private toastr = inject(ToastrService);
  private cdr = inject(ChangeDetectorRef);

  subscribers: any[] = [];
  filteredSubscribers: any[] = [];

  search = '';
  loading = true;

  ngOnInit() {
    this.loadSubscribers();
  }

  loadSubscribers() {
    this.api.getSubscribers().subscribe({
      next: (response: any) => {
        this.subscribers = response;
        this.filteredSubscribers = response;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        this.loading = false;
        this.toastr.error(error.error?.message || 'Failed to load subscribers');
      },
    });
  }

  searchSubscribers() {
    const value = this.search.toLowerCase().trim();

    this.filteredSubscribers = this.subscribers.filter((subscriber) =>
      subscriber.email.toLowerCase().includes(value),
    );
    this.cdr.detectChanges();
  }

  deleteSubscriber(id: string) {
    if (!confirm('Delete this subscriber?')) {
      return;
    }

    this.api.deleteSubscriber(id).subscribe({
      next: (response: any) => {
        this.toastr.success(response.message);

        this.subscribers = this.subscribers.filter((x) => x.id !== id);
        this.filteredSubscribers = this.filteredSubscribers.filter((x) => x.id !== id);
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        this.toastr.error(error.error?.message || 'Delete failed');
      },
    });
  }
}
