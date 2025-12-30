import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateReportInterface, PagedReportResult, ReportFilter } from '../Interfaces';



@Injectable({ providedIn: 'root' })
export class ReportService {
  private baseUrl = 'http://localhost:5269/api/Reports'; 

  constructor(private http: HttpClient) {}

  createReport(report: any): Observable<any> {
    console.log("Sent report: ",report)
    return this.http.post<any>(`${this.baseUrl}`, report);
  }

  getAllReports(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`);
  }

  getReportById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  getReportByRequestId(requestId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/by-request/${requestId}`);
  }

  getFilteredReports(filter: ReportFilter): Observable<PagedReportResult> {

    let params = new HttpParams();

    Object.entries(filter).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    // console.log(params)
    return this.http.get<PagedReportResult>(
      `${this.baseUrl}/filter`,
      { params }
      
    );
  }

  // // Optional: Get dropdown data for filters
  // getCategories(): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.baseUrl}/categories`);
  // }

  // getExecutors(): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.baseUrl}/executors`);
  // }

  // getStatuses(): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.baseUrl}/statuses`);
  // }
}