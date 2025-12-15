import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FileService {
    private baseUrl = 'http://localhost:5269/api/File';


    constructor(private http:HttpClient){}

    DeleteFile(fileId:number):Observable<any>{
        return this.http.delete(`${this.baseUrl}/${fileId}`);
    }


    getFileUrl(fileId: number): Observable<Blob> {
        return this.http.get(`${this.baseUrl}/${fileId}`, {
        responseType: 'blob'
        });
    }

    downloadFile(fileId:number){
        return this.http.get(`${this.baseUrl}/download/${fileId}`, {
        observe:"response",
        responseType:"blob",
        });
    }
}
