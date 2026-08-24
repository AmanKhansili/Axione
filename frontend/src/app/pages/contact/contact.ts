import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Api } from '../../services/api';

@Component({
  selector: 'app-contact',
  imports: [FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact {
  private api = inject(Api);
  private toastr = inject(ToastrService);

  name = '';
  email = '';
  phone = '';
  subject = '';
  message = '';

  submitContact() {
    const name = this.name.trim();
    const email = this.email.trim();
    const phone = this.phone.trim();
    const subject = this.subject.trim();
    const message = this.message.trim();

    if (!name || !email || !message || !phone) {
      this.toastr.warning('Please fill all required fields.', 'Required Fields');
      return;
    }

    const data = {
      name,
      email,
      phone,
      subject,
      message,
    };

    this.api.submitContact(data).subscribe({
      next: (response: any) => {
        this.toastr.success(response.message || 'Message sent successfully', 'Success');

        this.name = '';
        this.email = '';
        this.phone = '';
        this.subject = '';
        this.message = '';
      },

      error: (error) => {
        console.error('Contact Error:', error);

        this.toastr.error(error.error?.message || 'Unable to send message.', 'Error');
      },
    });
  }
}
