import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Api } from '../../services/api';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, FormsModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  private api = inject(Api);
  private toastr = inject(ToastrService);

  email = '';

  subscribeNewsletter() {
    const email = this.email.trim();

    if (!email) {
      this.toastr.warning('Please enter your email address.', 'Email Required');
      return;
    }

    this.api.subscribeNewsletter(email).subscribe({
      next: (response: any) => {
        this.toastr.success(response.message || 'Subscribed successfully', 'Success');

        this.email = '';
      },

      error: (error) => {
        if (error.status === 400) {
          this.toastr.warning(
            error.error?.message || 'Email already subscribed',
            'Already Subscribed',
          );

          return;
        }

        this.toastr.error(error.error?.message || 'Something went wrong.', 'Error');
      },
    });
  }
}
