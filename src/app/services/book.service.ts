import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment.dev';
import { AddBook } from '../models/AddBook';
import { Book } from '../models/Book';
import { BookWithAuthors } from '../models/BookWithAuthors';


@Injectable({
  providedIn: 'root'
})
export class BookService {

  private url ="Book";
  constructor(private http:HttpClient) { 
  
  }

  public getBooks(): Observable<Book[]>{
    return this.http.get<Book[]>(`${environment.apiURL}/${this.url}/BookList`)
  }

  public getBooksWithAuthors(): Observable<BookWithAuthors[]>{ 
    
    return this.http.get<BookWithAuthors[]>(`${environment.apiURL}/${this.url}/BookListWithAuthors`)
  }

  public updateBook(book: AddBook): Observable<number>{
    return this.http.put<number>(`${environment.apiURL}/${this.url}`,book)
  }

  public createBook(book: AddBook): Observable<number>{
    
    return this.http.post<number>(`${environment.apiURL}/${this.url}`,book)
  }

  public deleteBook(bookId: number): Observable<number>{//id?id
    return this.http.delete<number>(`${environment.apiURL}/${this.url}/id?id=${bookId}`)
  }

  public getBook(bookId: number): Observable<number>{
    return this.http.get<number>(`${environment.apiURL}/${this.url}/${bookId}`)
  }

  public getCompanyLogoBase(pictureNume: string): any {
    const url = 'https://localhost:7268/Resources/Images/'+pictureNume;

    return this.http.get(url);
}
}
