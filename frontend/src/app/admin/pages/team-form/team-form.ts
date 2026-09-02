import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef);

  isEdit = false;
  memberId = '';
  isLoading = false;

  selectedImage: File | null = null;
  imagePreview = '';

  member = {
    name: '',
    designation: '',
    description: '',
    image: '',
    linkedin: '',
    github: '',
    isActive: true,
    displayOrder: 0,
  };

  ngOnInit(): void {
    this.memberId = this.route.snapshot.paramMap.get('id') || '';
    this.isEdit = !!this.memberId;
    this.cdr.detectChanges();

    if (this.isEdit) {
      this.loadMember();
    }
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    if (!file.type.startsWith('image/')) {
      this.toastr.warning('Please select a valid image');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.toastr.warning('Image size should be less than 5MB');
      return;
    }

    this.selectedImage = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };

    reader.readAsDataURL(file);
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
          linkedin: data.linkedin || '',
          github: data.github || '',
          isActive: data.isActive !== false,
          displayOrder: Number(data.displayOrder ?? 0),
        };

        this.imagePreview = this.member.image;

        this.isLoading = false;
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Load Team Member Error:', error);

        this.isLoading = false;

        this.toastr.error(error?.error?.message || 'Unable to load team member');
        this.cdr.detectChanges();
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

    if (this.member.displayOrder < 1) {
      this.toastr.warning('Display order must be greater than 0');
      return;
    }

    this.isLoading = true;

    const saveMemberData = (imageUrl: string) => {
      const payload = {
        name: this.member.name.trim(),
        designation: this.member.designation.trim(),
        description: this.member.description.trim(),
        image: imageUrl,
        linkedin: this.member.linkedin.trim(),
        github: this.member.github.trim(),
        isActive: this.member.isActive,
        displayOrder: Number(this.member.displayOrder),
      };

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
    };

    // New image selected
    if (this.selectedImage) {
      this.api.uploadTeamImage(this.selectedImage).subscribe({
        next: (result: any) => {
          saveMemberData(result.url);
        },

        error: (error) => {
          this.isLoading = false;

          console.error('Team Image Upload Error:', error);

          this.toastr.error(error?.error?.message || 'Unable to upload team image');
        },
      });
    } else {
      // Existing image / no image
      saveMemberData(this.member.image || '');
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/team']);
  }
}
