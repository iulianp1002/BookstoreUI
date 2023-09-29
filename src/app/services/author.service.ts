import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Author } from '../models/author';
import { environment } from '../environments/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {

  private url ="Author";
  constructor(private http:HttpClient) { 
  
  }

  public getAuthors(): Observable<Author[]>{
    return this.http.get<Author[]>(`${environment.apiURL}/${this.url}/AuthorsList`)
  }

  public updateAuthor(author:Author): Observable<number>{
    return this.http.put<number>(`${environment.apiURL}/${this.url}`,author)
  }

  public createAuthor(author:Author): Observable<number>{
    return this.http.post<number>(`${environment.apiURL}/${this.url}`,author)
  }

  public deleteAuthor(authorId: number): Observable<number>{
    return this.http.delete<number>(`${environment.apiURL}/${this.url}/${authorId}`)
  }

  public getAuthor(authorId: number): Observable<Author>{
    return this.http.get<Author>(`${environment.apiURL}/${this.url}/${authorId}`)
  }
}
