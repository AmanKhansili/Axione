import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Api } from '../../../services/api';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './contacts.html',
  styleUrl: './contacts.scss',
})
export class Contacts implements OnInit {
  private api = inject(Api);
  private toastr = inject(ToastrService);
  private cdr = inject(ChangeDetectorRef);

  contacts: any[] = [];
  filteredContacts: any[] = [];

  search = '';

  loading = true;

  ngOnInit() {
    this.loadContacts();
  }

  expandedContactId: string | null = null;

  toggleMessage(id: string): void {
    this.expandedContactId = this.expandedContactId === id ? null : id;
  }

  loadContacts() {
    this.api.getContacts().subscribe({
      next: (response: any) => {
        this.contacts = response;
        this.filteredContacts = response;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.loading = false;
        this.toastr.error(error.error.message);
      },
    });
  }

  searchContacts() {
    const value = this.search.toLowerCase().trim();

    this.filteredContacts = this.contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(value) || contact.email.toLowerCase().includes(value),
    );
  }

  deleteContact(id: string) {
    if (!confirm('Delete this contact?')) return;

    this.api.deleteContact(id).subscribe({
      next: (response: any) => {
        this.toastr.success(response.message);

        this.contacts = this.contacts.filter((x) => x.id !== id);
        this.filteredContacts = this.filteredContacts.filter((x) => x.id !== id);
      },
      error: (error: any) => {
        this.toastr.error(error.error.message);
      },
    });
  }
}
