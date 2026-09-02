import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Api } from '../../../services/api';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './team.html',
  styleUrl: './team.scss',
})
export class Team implements OnInit {
  private api = inject(Api);
  private toastr = inject(ToastrService);
  private cdr = inject(ChangeDetectorRef);

  teamMembers: any[] = [];
  filteredMembers: any[] = [];

  search = '';
  loading = true;

  ngOnInit(): void {
    this.loadTeamMembers();
  }

  loadTeamMembers(): void {
    this.loading = true;

    this.api.getAdminTeamMembers().subscribe({
      next: (data) => {
        console.log('ADMIN TEAM DATA:', data);

        this.teamMembers = data || [];
        this.filteredMembers = [...this.teamMembers];
        this.loading = false;

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Load Team Error:', error);

        this.loading = false;

        this.cdr.detectChanges();

        this.toastr.error(error?.error?.message || 'Unable to load team members');
      },
    });
  }

  searchTeam(): void {
    const value = this.search.toLowerCase().trim();

    this.filteredMembers = this.teamMembers.filter(
      (member) =>
        (member.name || '').toLowerCase().includes(value) ||
        (member.designation || '').toLowerCase().includes(value) ||
        (member.email || '').toLowerCase().includes(value),
    );
    this.cdr.detectChanges();
  }

  deleteTeamMember(id: string): void {
    if (!confirm('Delete this team member?')) {
      return;
    }

    this.api.deleteTeamMember(id).subscribe({
      next: (response: any) => {
        this.toastr.success(response?.message || 'Team member deleted successfully');

        this.teamMembers = this.teamMembers.filter((member) => member.id !== id);

        this.filteredMembers = this.filteredMembers.filter((member) => member.id !== id);

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Delete Team Error:', error);

        this.toastr.error(error?.error?.message || 'Unable to delete team member');
      },  
    });
  }
}
