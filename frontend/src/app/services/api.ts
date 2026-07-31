import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  subscribeNewsletter(email: string) {
    return this.http.post(`${this.apiUrl}/newsletter`, {
      email,
    });
  }

  submitContact(data: { name: string; email: string; subject: string; message: string }) {
    return this.http.post(`${this.apiUrl}/contact`, data);
  }

  getBlogs() {
    return this.http.get<any[]>(`${this.apiUrl}/blogs`);
  }

  getBlogBySlug(slug: string) {
    return this.http.get<any>(`${this.apiUrl}/blogs/${slug}`);
  }
}
