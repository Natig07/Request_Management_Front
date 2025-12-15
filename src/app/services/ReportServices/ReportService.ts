import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private baseUrl = 'http://localhost:5269/api/Reports'; 

  constructor(private http: HttpClient) {}


  createReport(formData: FormData): Observable<any> {
    console.log(Array.from(formData.entries()));
    return this.http.post<any>(`${this.baseUrl}`, formData);
  }

  getAllReports(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`);
  }

  getReportById(id:number):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }






}
