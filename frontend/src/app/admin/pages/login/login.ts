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
  showPassword = false;

  ngOnInit(): void {
    if (this.api.isAuthenticated()) {
      this.router.navigate(['/admin']);
    }
  }

  login(): void {
    if (!this.email.trim() || !this.password) {
      this.toastr.warning('Please enter email and password');
      return;
    }

    this.isLoading = true;

    this.api.login(this.email.trim(), this.password).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.toastr.success('Login successful');
        this.router.navigate(['/admin']);
      },
      error: (error) => {
        this.isLoading = false;
        const message = error?.error?.msg || error?.error?.message || 'Invalid email or password';
        this.toastr.error(message);
      },
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}
