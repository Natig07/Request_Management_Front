import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, switchMap, tap } from 'rxjs';
import { UserService } from './UserService/UserService';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:5269/api/Auth'; 

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) {}

  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, data).pipe(
      tap((response: any) => {
        // store tokens and basic info
        localStorage.setItem('token', response.token);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('firstName', response.firstName);
        localStorage.setItem('lastName', response.lastName);
        localStorage.setItem('userId', response.userID.toString());
        localStorage.setItem('profilePhotoId', response.profilePhotoId || '');
      }),
      // after login, call user info endpoint
      switchMap(response => this.userService.getUserInfo(response.userID)),

      tap(user => {
        this.userService.setCurrentUser(user);
        // console.log('Current user info loaded:', user);
      }),
    );
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserFullName(): string | null {
    const firstname = localStorage.getItem('firstName');
    const lastname = localStorage.getItem('lastName');
    return firstname && lastname ? `${firstname} ${lastname}` : null;
  }
  refreshToken(): Observable<any> {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return new Observable(observer => observer.error('No refresh token'));

  return this.http.post(`${this.baseUrl}/refresh`, { refreshToken }).pipe(
    tap((res: any) => {
      // Update access token
      localStorage.setItem('token', res.token);
    })
  );
}

}
