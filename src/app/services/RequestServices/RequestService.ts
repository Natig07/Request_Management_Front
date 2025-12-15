import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, } from 'rxjs';
import { Category, CommentInterface,  } from '../Interfaces';

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
    // console.log(Array.from(formData.entries()));
    return this.http.post<any>(`${this.baseUrl}/Requests`, formData,{headers});
  }

  getAllRequests(): Observable<any> {
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
    return this.http.get<any>(`${this.baseUrl}/Requests`, {headers});
  }

  getRequestById(id:number):Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/Requests/reqres/${id}`);
  }

  changeReqStatus(requestId:number,newStatusId:number,userId:number){
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
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




}
