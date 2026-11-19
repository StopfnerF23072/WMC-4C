import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Book, BookInput } from './book';

@Injectable({ providedIn: 'root' })
export class BooksService {
  private readonly http = inject(HttpClient);
  private readonly booksUrl = `${environment.apiRoot}/books`;

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.booksUrl);
  }

  getBook(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.booksUrl}/${id}`);
  }

  addBook(book: BookInput): Observable<Book> {
    return this.http.post<Book>(this.booksUrl, book);
  }

  updateBook(id: number, book: Partial<BookInput>): Observable<Book> {
    return this.http.put<Book>(`${this.booksUrl}/${id}`, book);
  }

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.booksUrl}/${id}`);
  }
}
