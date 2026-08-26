import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Api } from '../../../services/api';

@Component({
  selector: 'app-team-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './team-form.html',
  styleUrl: './team-form.scss',
})
export class TeamForm implements OnInit {
  private api = inject(Api);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastr = inject(ToastrService);

  isEdit = false;
  memberId = '';
  isLoading = false;

  member = {
    name: '',
    designation: '',
    description: '',
    image: '',
    email: '',
    linkedin: '',
    github: '',
    isActive: true,
  };

  ngOnInit(): void {
    this.memberId = this.route.snapshot.paramMap.get('id') || '';
    this.isEdit = !!this.memberId;

    if (this.isEdit) {
      this.loadMember();
    }
  }

  loadMember(): void {
    this.isLoading = true;

    this.api.getTeamMemberById(this.memberId).subscribe({
      next: (data: any) => {
        if (!data) {
          this.toastr.error('Team member not found');
          this.router.navigate(['/admin/team']);
          return;
        }

        this.member = {
          name: data.name || '',
          designation: data.designation || '',
          description: data.description || '',
          image: data.image || '',
          email: data.email || '',
          linkedin: data.linkedin || '',
          github: data.github || '',
          isActive: data.isActive !== false,
        };

        this.isLoading = false;
      },

      error: (error) => {
        console.error('Load Team Member Error:', error);
        this.isLoading = false;

        this.toastr.error(error?.error?.message || 'Unable to load team member');
      },
    });
  }

  saveMember(): void {
    if (
      !this.member.name.trim() ||
      !this.member.designation.trim() ||
      !this.member.description.trim()
    ) {
      this.toastr.warning('Please fill the required fields');
      return;
    }

    const payload = {
      name: this.member.name.trim(),
      designation: this.member.designation.trim(),
      description: this.member.description.trim(),
      image: this.member.image.trim(),
      email: this.member.email.trim(),
      linkedin: this.member.linkedin.trim(),
      github: this.member.github.trim(),
      isActive: this.member.isActive,
    };

    this.isLoading = true;

    const request = this.isEdit
      ? this.api.updateTeamMember(this.memberId, payload)
      : this.api.createTeamMember(payload);

    request.subscribe({
      next: (response: any) => {
        this.isLoading = false;

        this.toastr.success(response?.message || 'Team member saved successfully');

        this.router.navigate(['/admin/team']);
      },

      error: (error) => {
        this.isLoading = false;

        console.error('Save Team Member Error:', error);

        this.toastr.error(
          error?.error?.message || error?.error?.msg || 'Unable to save team member',
        );
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/team']);
  }
}
