import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // Common Methods
  private getAuthHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
  }

  // Authentication
  login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/auth/login`, {
      email,
      password,
    });
  }

  // Blog APIs
  getBlogs() {
    return this.http.get<any[]>(`${this.apiUrl}/blogs`);
  }

  getBlogBySlug(slug: string) {
    return this.http.get<any>(`${this.apiUrl}/blogs/${slug}`);
  }

  getBlogById(id: string) {
    return this.http.get<any>(`${this.apiUrl}/blogs/id/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  createBlog(data: any) {
    return this.http.post(`${this.apiUrl}/blogs`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  updateBlog(id: string, data: any) {
    return this.http.put(`${this.apiUrl}/blogs/${id}`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteBlog(id: string) {
    return this.http.delete(`${this.apiUrl}/blogs/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
  // Service APIs
  getServices() {
    return this.http.get<any[]>(`${this.apiUrl}/services`);
  }

  getServiceBySlug(slug: string) {
    return this.http.get<any>(`${this.apiUrl}/services/${slug}`);
  }

  getServiceById(id: string) {
    return this.http.get<any>(`${this.apiUrl}/services/id/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  createService(data: any) {
    return this.http.post(`${this.apiUrl}/services`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  updateService(id: string, data: any) {
    return this.http.put(`${this.apiUrl}/services/${id}`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteService(id: string) {
    return this.http.delete(`${this.apiUrl}/services/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Contact APIs
  submitContact(data: { name: string; email: string; subject: string; message: string }) {
    return this.http.post(`${this.apiUrl}/contact`, data);
  }

  getContacts() {
    return this.http.get<any[]>(`${this.apiUrl}/contact`, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteContact(id: string) {
    return this.http.delete(`${this.apiUrl}/contact/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Newsletter APIs
  subscribeNewsletter(email: string) {
    return this.http.post(`${this.apiUrl}/newsletter`, {
      email,
    });
  }

  // Get All Subscribers (Admin)
  getSubscribers() {
    return this.http.get<any[]>(`${this.apiUrl}/newsletter`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Delete Subscriber (Admin)
  deleteSubscriber(id: string) {
    return this.http.delete(`${this.apiUrl}/newsletter/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  //dashboard API's
  getDashboardStats() {
  return this.http.get(`${this.apiUrl}/dashboard/stats`, {
    headers: this.getAuthHeaders(),
  });
}
}
