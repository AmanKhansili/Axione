import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Services {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8000/api/admin';

  login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/login`, {
      email,
      password,
    });
  }
}
