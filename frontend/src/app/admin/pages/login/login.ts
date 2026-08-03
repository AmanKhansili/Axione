import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Api } from '../../../services/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  private api = inject(Api);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  email = '';
  password = '';
  isLoading = false;

  ngOnInit() {
    const token = localStorage.getItem('token');

    if (token) {
      this.router.navigate(['/admin']);
    }
  }

  login() {
    if (!this.email || !this.password) {
      this.toastr.warning('Please enter email and password');
      return;
    }

    this.isLoading = true;

    this.api.login(this.email, this.password).subscribe({
      next: (response: any) => {
        this.isLoading = false;

        localStorage.setItem('token', response.token);
        localStorage.setItem('admin', JSON.stringify(response.admin));

        this.toastr.success(response.message);

        this.router.navigate(['/admin']);
      },

      error: (error) => {
        this.isLoading = false;
        this.toastr.error(error.error.message);
      },
    });
  }
}