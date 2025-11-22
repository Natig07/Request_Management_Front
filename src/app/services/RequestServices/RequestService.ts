import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, } from 'rxjs';
import { Category,  } from '../Interfaces';

@Injectable({ providedIn: 'root' })
export class RequestService {
  private baseUrl = 'http://localhost:5269/api'; 

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
    return this.http.get<Category[]>(`${this.baseUrl}/Category`, { headers })
  }


  createRequest(formData: FormData): Observable<any> {
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
    console.log(Array.from(formData.entries()));
    return this.http.post<any>(`${this.baseUrl}/Requests`, formData,{headers});
  }

  getAllRequests(): Observable<any> {
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
    return this.http.get<any>(`${this.baseUrl}/Requests`, {headers});
  }





}
