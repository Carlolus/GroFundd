import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../interfaces/user.interface';

export interface AuthResponse {
  user: any;
  access_token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private currentUser: any;

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        this.currentUser = response.user;
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('user', JSON.stringify(response.user));
      })
    );
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, userData);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    return !!token;
  }

  getUser(): any {
    if (!this.currentUser) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        this.currentUser = JSON.parse(userStr);
      }
    }
    return this.currentUser;
  }

  getUserTyped(): User {
    return this.currentUser as User;
  }
}
