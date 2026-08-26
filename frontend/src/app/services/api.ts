import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

interface SupabaseAuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at?: number;
  token_type: string;
  user: any;
}

@Injectable({
  providedIn: 'root',
})
export class Api {
  private readonly supabaseUrl = 'https://vkzhvupgtruhfpzrhfew.supabase.co';
  private readonly supabaseKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZremh2dXBndHJ1aGZwenJoZmV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxNDkzMjUsImV4cCI6MjEwMDcyNTMyNX0.MFPzHczT2e864gcGjbyXq3yxv8dbh4ObTCRlTP6VT24';

  private readonly restUrl = `${this.supabaseUrl}/rest/v1`;
  private readonly authUrl = `${this.supabaseUrl}/auth/v1`;

  private readonly ACCESS_TOKEN_KEY = 'axione_access_token';
  private readonly REFRESH_TOKEN_KEY = 'axione_refresh_token';
  private readonly USER_KEY = 'axione_admin_user';
  private readonly EXPIRY_KEY = 'axione_token_expiry';

  constructor(private http: HttpClient) {}

  // =====================================================
  // Headers
  // =====================================================

  private getSupabaseHeaders(extra: Record<string, string> = {}): HttpHeaders {
    return new HttpHeaders({
      apikey: this.supabaseKey,
      Authorization: `Bearer ${this.supabaseKey}`,
      ...extra,
    });
  }

  /**
   * Use the logged-in Supabase Auth access token for protected operations.
   * Falls back to the public anon key only when there is no admin session.
   */
  private authHeaders(extraHeaders: Record<string, string> = {}): HttpHeaders {
    const token = this.getAccessToken() || this.supabaseKey;

    return new HttpHeaders({
      apikey: this.supabaseKey,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...extraHeaders,
    });
  }

  // =====================================================
  // Supabase Authentication
  // =====================================================

  login(email: string, password: string): Observable<any> {
    return this.http
      .post<SupabaseAuthResponse>(
        `${this.authUrl}/token?grant_type=password`,
        { email, password },
        {
          headers: new HttpHeaders({
            apikey: this.supabaseKey,
            'Content-Type': 'application/json',
          }),
        },
      )
      .pipe(
        tap((session) => this.saveSession(session)),
        map((session) => ({
          message: 'Login successful',
          token: session.access_token,
          admin: this.buildAdminUser(session.user),
          user: session.user,
        })),
      );
  }

  private saveSession(session: SupabaseAuthResponse): void {
    const expiresAt = session.expires_at
      ? session.expires_at * 1000
      : Date.now() + session.expires_in * 1000;

    localStorage.setItem(this.ACCESS_TOKEN_KEY, session.access_token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, session.refresh_token);
    localStorage.setItem(this.EXPIRY_KEY, String(expiresAt));
    localStorage.setItem(this.USER_KEY, JSON.stringify(this.buildAdminUser(session.user)));

    // Kept for compatibility with any existing admin UI code.
    localStorage.setItem('token', session.access_token);
    localStorage.setItem('admin', JSON.stringify(this.buildAdminUser(session.user)));
  }

  private buildAdminUser(user: any): any {
    const metadata = user?.user_metadata || {};

    return {
      id: user?.id || '',
      email: user?.email || '',
      name: metadata.name || metadata.full_name || user?.email?.split('@')[0] || 'Admin',
      role: metadata.role || 'admin',
    };
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY) || localStorage.getItem('token');
  }

  hasAccessToken(): boolean {
    return !!this.getAccessToken();
  }

  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    const expiry = Number(localStorage.getItem(this.EXPIRY_KEY) || 0);

    return !!token && (!expiry || expiry > Date.now() + 5000);
  }

  getStoredUser(): any | null {
    try {
      const user = localStorage.getItem(this.USER_KEY) || localStorage.getItem('admin');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }

  /** Validate the current Supabase session. If expired, try the refresh token. */
  validateSession(): Observable<boolean> {
    const accessToken = this.getAccessToken();

    if (!accessToken) {
      return of(false);
    }

    return this.http
      .get<any>(`${this.authUrl}/user`, {
        headers: new HttpHeaders({
          apikey: this.supabaseKey,
          Authorization: `Bearer ${accessToken}`,
        }),
      })
      .pipe(
        tap((user) => {
          const admin = this.buildAdminUser(user);
          localStorage.setItem(this.USER_KEY, JSON.stringify(admin));
          localStorage.setItem('admin', JSON.stringify(admin));
        }),
        map(() => true),
        catchError((error) => {
          if (error?.status === 401) {
            return this.refreshSession();
          }

          return of(false);
        }),
      );
  }

  private refreshSession(): Observable<boolean> {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);

    if (!refreshToken) {
      this.clearSession();
      return of(false);
    }

    return this.http
      .post<SupabaseAuthResponse>(
        `${this.authUrl}/token?grant_type=refresh_token`,
        { refresh_token: refreshToken },
        {
          headers: new HttpHeaders({
            apikey: this.supabaseKey,
            'Content-Type': 'application/json',
          }),
        },
      )
      .pipe(
        tap((session) => this.saveSession(session)),
        map(() => true),
        catchError(() => {
          this.clearSession();
          return of(false);
        }),
      );
  }

  logout(): Observable<any> {
    const token = this.getAccessToken();

    if (!token) {
      this.clearSession();
      return of(null);
    }

    return this.http
      .post(
        `${this.authUrl}/logout`,
        {},
        {
          headers: new HttpHeaders({
            apikey: this.supabaseKey,
            Authorization: `Bearer ${token}`,
          }),
        },
      )
      .pipe(
        catchError(() => of(null)),
        tap(() => this.clearSession()),
      );
  }

  private clearSession(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.EXPIRY_KEY);
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
  }

  // =====================================================
  // Blog APIs
  // =====================================================

  getBlogs() {
    const params = new HttpParams().set('select', '*').set('order', 'createdAt.desc');

    return this.http.get<any[]>(`${this.restUrl}/Blog`, {
      headers: this.getSupabaseHeaders(),
      params,
    });
  }

  getBlogBySlug(slug: string) {
    const params = new HttpParams().set('select', '*').set('slug', `eq.${slug}`).set('limit', '1');

    return this.http
      .get<any[]>(`${this.restUrl}/Blog`, {
        headers: this.getSupabaseHeaders(),
        params,
      })
      .pipe(map((rows) => rows[0] ?? null));
  }

  getBlogById(id: string) {
    const params = new HttpParams().set('select', '*').set('id', `eq.${id}`).set('limit', '1');

    return this.http
      .get<any[]>(`${this.restUrl}/Blog`, {
        headers: this.authHeaders(),
        params,
      })
      .pipe(map((rows) => rows[0] ?? null));
  }

  createBlog(data: any) {
    return this.http
      .post<any>(`${this.restUrl}/Blog`, data, {
        headers: this.authHeaders({ Prefer: 'return=representation' }),
      })
      .pipe(
        map((rows: any) => ({
          message: 'Blog created successfully',
          data: Array.isArray(rows) ? rows[0] : rows,
        })),
      );
  }

  updateBlog(id: string, data: any) {
    const params = new HttpParams().set('id', `eq.${id}`);

    return this.http
      .patch<any>(`${this.restUrl}/Blog`, data, {
        headers: this.authHeaders({ Prefer: 'return=representation' }),
        params,
      })
      .pipe(
        map((rows: any) => ({
          message: 'Blog updated successfully',
          data: Array.isArray(rows) ? rows[0] : rows,
        })),
      );
  }

  deleteBlog(id: string) {
    const params = new HttpParams().set('id', `eq.${id}`);

    return this.http
      .delete(`${this.restUrl}/Blog`, {
        headers: this.authHeaders({ Prefer: 'return=minimal' }),
        params,
      })
      .pipe(map(() => ({ message: 'Blog deleted successfully' })));
  }

  // =====================================================
  // Service APIs
  // =====================================================

  getServices() {
    const params = new HttpParams()
      .set('select', '*')
      .set('isActive', 'eq.true')
      .set('order', 'createdAt.asc');

    return this.http.get<any[]>(`${this.restUrl}/Service`, {
      headers: this.getSupabaseHeaders(),
      params,
    });
  }

  getAdminServices() {
    const params = new HttpParams().set('select', '*').set('order', 'createdAt.asc');

    return this.http.get<any[]>(`${this.restUrl}/Service`, {
      headers: this.authHeaders(),
      params,
    });
  }

  getServiceBySlug(slug: string) {
    const params = new HttpParams().set('select', '*').set('slug', `eq.${slug}`).set('limit', '1');

    return this.http
      .get<any[]>(`${this.restUrl}/Service`, {
        headers: this.getSupabaseHeaders(),
        params,
      })
      .pipe(map((rows) => rows[0] ?? null));
  }

  getServiceById(id: string) {
    const params = new HttpParams().set('select', '*').set('id', `eq.${id}`).set('limit', '1');

    return this.http
      .get<any[]>(`${this.restUrl}/Service`, {
        headers: this.authHeaders(),
        params,
      })
      .pipe(map((rows) => rows[0] ?? null));
  }

  createService(data: any) {
    return this.http
      .post<any>(`${this.restUrl}/Service`, data, {
        headers: this.authHeaders({ Prefer: 'return=representation' }),
      })
      .pipe(
        map((rows: any) => ({
          message: 'Service created successfully',
          data: Array.isArray(rows) ? rows[0] : rows,
        })),
      );
  }

  updateService(id: string, data: any) {
    const params = new HttpParams().set('id', `eq.${id}`);

    return this.http
      .patch<any>(`${this.restUrl}/Service`, data, {
        headers: this.authHeaders({ Prefer: 'return=representation' }),
        params,
      })
      .pipe(
        map((rows: any) => ({
          message: 'Service updated successfully',
          data: Array.isArray(rows) ? rows[0] : rows,
        })),
      );
  }

  deleteService(id: string) {
    const params = new HttpParams().set('id', `eq.${id}`);

    return this.http
      .delete(`${this.restUrl}/Service`, {
        headers: this.authHeaders({ Prefer: 'return=minimal' }),
        params,
      })
      .pipe(map(() => ({ message: 'Service deleted successfully' })));
  }

  // =====================================================
  // Team APIs
  // =====================================================

  getTeamMembers() {
    const params = new HttpParams()
      .set('select', '*')
      .set('isActive', 'eq.true')
      .set('order', 'createdAt.asc');

    return this.http.get<any[]>(`${this.restUrl}/Team`, {
      headers: this.getSupabaseHeaders(),
      params,
    });
  }

  getAdminTeamMembers() {
    const params = new HttpParams().set('select', '*').set('order', 'createdAt.asc');

    return this.http.get<any[]>(`${this.restUrl}/Team`, {
      headers: this.authHeaders(),
      params,
    });
  }

  getTeamMemberById(id: string) {
    const params = new HttpParams().set('select', '*').set('id', `eq.${id}`).set('limit', '1');

    return this.http
      .get<any[]>(`${this.restUrl}/Team`, {
        headers: this.authHeaders(),
        params,
      })
      .pipe(map((rows) => rows[0] ?? null));
  }

  createTeamMember(data: any) {
    return this.http
      .post<any>(`${this.restUrl}/Team`, data, {
        headers: this.authHeaders({
          Prefer: 'return=representation',
        }),
      })
      .pipe(
        map((rows: any) => ({
          message: 'Team member created successfully',
          data: Array.isArray(rows) ? rows[0] : rows,
        })),
      );
  }

  updateTeamMember(id: string, data: any) {
    const params = new HttpParams().set('id', `eq.${id}`);

    return this.http
      .patch<any>(`${this.restUrl}/Team`, data, {
        headers: this.authHeaders({
          Prefer: 'return=representation',
        }),
        params,
      })
      .pipe(
        map((rows: any) => ({
          message: 'Team member updated successfully',
          data: Array.isArray(rows) ? rows[0] : rows,
        })),
      );
  }

  deleteTeamMember(id: string) {
    const params = new HttpParams().set('id', `eq.${id}`);

    return this.http
      .delete(`${this.restUrl}/Team`, {
        headers: this.authHeaders({
          Prefer: 'return=minimal',
        }),
        params,
      })
      .pipe(
        map(() => ({
          message: 'Team member deleted successfully',
        })),
      );
  }

  // =====================================================
  // Contact APIs
  // =====================================================

  submitContact(data: { name: string; email: string; subject: string; message: string }) {
    return this.http
      .post(`${this.restUrl}/Contact`, data, {
        headers: this.getSupabaseHeaders({
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        }),
      })
      .pipe(map(() => ({ message: 'Message sent successfully' })));
  }

  getContacts() {
    const params = new HttpParams().set('select', '*').set('order', 'createdAt.desc');

    return this.http.get<any[]>(`${this.restUrl}/Contact`, {
      headers: this.authHeaders(),
      params,
    });
  }

  deleteContact(id: string) {
    const params = new HttpParams().set('id', `eq.${id}`);

    return this.http
      .delete(`${this.restUrl}/Contact`, {
        headers: this.authHeaders({ Prefer: 'return=minimal' }),
        params,
      })
      .pipe(map(() => ({ message: 'Contact deleted successfully' })));
  }

  // =====================================================
  // Newsletter APIs
  // =====================================================

  subscribeNewsletter(email: string) {
    return this.http
      .post(
        `${this.restUrl}/Newsletter`,
        { email },
        {
          headers: this.getSupabaseHeaders({
            'Content-Type': 'application/json',
            Prefer: 'return=minimal',
          }),
        },
      )
      .pipe(map(() => ({ message: 'Subscribed successfully' })));
  }

  getSubscribers() {
    const params = new HttpParams().set('select', '*').set('order', 'createdAt.desc');

    return this.http.get<any[]>(`${this.restUrl}/Newsletter`, {
      headers: this.authHeaders(),
      params,
    });
  }

  deleteSubscriber(id: string) {
    const params = new HttpParams().set('id', `eq.${id}`);

    return this.http
      .delete(`${this.restUrl}/Newsletter`, {
        headers: this.authHeaders({ Prefer: 'return=minimal' }),
        params,
      })
      .pipe(map(() => ({ message: 'Subscriber deleted successfully' })));
  }

  // =====================================================
  // Dashboard
  // =====================================================

  getDashboardStats() {
    const idParams = new HttpParams().set('select', 'id');

    return forkJoin({
      blogs: this.http.get<any[]>(`${this.restUrl}/Blog`, {
        headers: this.authHeaders(),
        params: idParams,
      }),
      services: this.http.get<any[]>(`${this.restUrl}/Service`, {
        headers: this.authHeaders(),
        params: idParams,
      }),
      contacts: this.http.get<any[]>(`${this.restUrl}/Contact`, {
        headers: this.authHeaders(),
        params: idParams,
      }),
      newsletter: this.http.get<any[]>(`${this.restUrl}/Newsletter`, {
        headers: this.authHeaders(),
        params: idParams,
      }),
      team: this.http.get<any[]>(`${this.restUrl}/Team`, {
        headers: this.authHeaders(),
        params: idParams,
      }),
    }).pipe(
      map((result) => ({
        blogs: result.blogs.length,
        services: result.services.length,
        contacts: result.contacts.length,
        newsletter: result.newsletter.length,
        team: result.team.length,
      })),
    );
  }
}
