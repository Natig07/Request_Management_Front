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
    return this.http.get<User>(`${this.baseUrl}/User/${userId}`).pipe(
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
    return this.http.get(`${this.baseUrl}/File/${fileId}`, {
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
   
    return this.http.put<User>(`${this.baseUrl}/User/${userId}`, data);
  }

  renewPassword(dto:PasswordRenew):Observable<PasswordRenew>{

    return this.http.post<PasswordRenew>(`${this.baseUrl}/Auth/renew-password`,dto)

  }


}
