import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, } from 'rxjs';
import { Category, CommentInterface, PagedResult, RequestFilter,  } from '../Interfaces';

@Injectable({ providedIn: 'root' })
export class RequestService {
  private baseUrl = 'http://localhost:5269/api'; 

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/Category`,)
  }


  createRequest(formData: FormData): Observable<any> {
    // console.log(Array.from(formData.entries()));
    return this.http.post<any>(`${this.baseUrl}/Requests`, formData);
  }

  getAllRequests(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Requests`);
  }

  getRequestById(id:number):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/Requests/reqres/${id}`);
  }

  changeReqStatus(requestId:number,newStatusId:number,userId:number){
    return this.http.put<any>(`${this.baseUrl}/Requests/${requestId}/status/${newStatusId}/${userId}`,{requestId,newStatusId,userId});
  }

  // In RequestService
  getRequestHistory(requestId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/RequestsHistory/history/${requestId}`);
  }

  addComment(comment:FormData):Observable<any>{
    return this.http.post<any>(`${this.baseUrl}/Comment`,comment);
  }

  getComments(reqId:number):Observable<any[]>{
    // console.log(reqId)
    return this.http.get<any[]>(`${this.baseUrl}/Comment/${reqId}`);
  }

  takeRequest(executorId:number,reqId:number){
     return this.http.put(`${this.baseUrl}/Requests/take/${executorId}/${reqId}`,{});


  }

  getFilteredRequests(filter: RequestFilter): Observable<PagedResult<any>> {
  const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

  let params = new HttpParams();

  Object.entries(filter).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      params = params.set(key, value.toString());
    }
  });

  return this.http.get<PagedResult<any>>(
    `${this.baseUrl}/Requests/filter`,
    { headers, params }
  );
  }
  getRequestBySection(id: number, section: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Requests/${id}/section/${section}`);
  }

  getCommentCount(reqId: number): Observable<{count: number}> {
    return this.http.get<{count: number}>(`${this.baseUrl}/Requests/${reqId}/comment-count`);
  }




}
