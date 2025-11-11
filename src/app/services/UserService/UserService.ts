import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { PasswordRenew, User } from '../Interfaces';

@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl = 'http://localhost:5269/api'; 
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currrentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  getUserInfo(userId: number): Observable<User> {
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
    return this.http.get<User>(`${this.baseUrl}/User/${userId}`, { headers }).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
        localStorage.setItem('currentUser', JSON.stringify(user)); 
      })
    );
  }


  restoreUserFromStorage() {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      const user: User = JSON.parse(stored);
      this.currentUserSubject.next(user);
    } else {
      const id = localStorage.getItem('userID');
      if (id) this.getUserInfo(+id).subscribe();
    }
  }

 
  getUserProfilePhotoUrl(fileId: number): Observable<Blob> {
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
    return this.http.get(`${this.baseUrl}/File/${fileId}`, {
      headers,
      responseType: 'blob'
    });
  }

  getCurrrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  setCurrentUser(user: User) {
    this.currentUserSubject.next(user);
  }

  updateUser(userId: number, data: FormData): Observable<User> {
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
   
    return this.http.put<User>(`${this.baseUrl}/User/${userId}`, data, { headers });
  }

  renewPassword(dto:PasswordRenew):Observable<PasswordRenew>{
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

    return this.http.post<PasswordRenew>(`${this.baseUrl}/Auth/renew-password`,dto,{headers})

  }


}
