import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
private url = "File";

  constructor(private http: HttpClient) { }

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);
console.log('to the upload...')
    const req = new HttpRequest('POST', `${environment.apiURL}/File/Upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    const req1 = new HttpRequest('POST', `${environment.apiURL}/File/Upload`, formData);
req1.headers.set("Content-Type","multipart/form-data");
    return this.http.request(req1);
  }

  getFiles(): Observable<any> {
    return this.http.get(`${environment.apiURL}${this.url}/files`);
  }


}