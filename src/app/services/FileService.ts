import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FileService {
    private baseUrl = 'http://localhost:5269/api/File';


    constructor(private http:HttpClient){}

    DeleteFile(fileId:number):Observable<any>{
        const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
        return this.http.delete(`${this.baseUrl}/${fileId}`,{headers});
    }
}
