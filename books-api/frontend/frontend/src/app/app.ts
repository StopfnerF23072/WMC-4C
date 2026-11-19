import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Book } from './book';
import { BooksService } from './books.service';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly booksService = inject(BooksService);

  protected books: Book[] = [];
  protected selectedBook: Book | null = null;
  protected authorFilter = '';
  protected yearFilter: number | null = null;
  protected editingBookId: number | null = null;
  protected form: { title: string; author: string; year: number | null } = {
    title: '',
    author: '',
    year: null,
  };
  protected loading = false;
  protected errorMessage = '';

  ngOnInit(): void {
    this.loadBooks();
  }

  protected get filteredBooks(): Book[] {
    const author = this.authorFilter.trim().toLowerCase();
    return this.books.filter((book) => {
      const matchesAuthor = !author || book.author.toLowerCase().includes(author);
      const matchesYear =
        this.yearFilter === null ||
        this.yearFilter === undefined ||
        book.year === this.yearFilter;
      return matchesAuthor && matchesYear;
    });
  }

  protected selectBook(id: number): void {
    this.errorMessage = '';
    this.booksService.getBook(id).subscribe({
      next: (book) => (this.selectedBook = book),
      error: (error: unknown) => this.setError(error, 'The book details could not be loaded.'),
    });
  }

  protected startAdding(): void {
    this.editingBookId = null;
    this.form = { title: '', author: '', year: null };
    this.errorMessage = '';
  }

  protected startEditing(book: Book): void {
    this.editingBookId = book.id;
    this.form = { title: book.title, author: book.author, year: book.year };
    this.errorMessage = '';
  }

  protected saveBook(): void {
    const input = {
      title: this.form.title.trim(),
      author: this.form.author.trim(),
      year: Number(this.form.year),
    };

    if (!input.title || !input.author || this.form.year === null || !Number.isInteger(input.year)) {
      this.errorMessage = 'Title, author, and a valid year are required.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    const request =
      this.editingBookId === null
        ? this.booksService.addBook(input)
        : this.booksService.updateBook(this.editingBookId, input);

    request.subscribe({
      next: (book) => {
        this.loading = false;
        this.replaceBook(book);
        this.selectedBook = book;
        this.startAdding();
      },
      error: (error: unknown) => {
        this.loading = false;
        this.setError(error, 'The book could not be saved.');
      },
    });
  }

  protected deleteSelectedBook(): void {
    if (!this.selectedBook) {
      return;
    }

    const id = this.selectedBook.id;
    this.loading = true;
    this.errorMessage = '';
    this.booksService.deleteBook(id).subscribe({
      next: () => {
        this.loading = false;
        this.books = this.books.filter((book) => book.id !== id);
        this.selectedBook = null;
        if (this.editingBookId === id) {
          this.startAdding();
        }
      },
      error: (error: unknown) => {
        this.loading = false;
        this.setError(error, 'The book could not be deleted.');
      },
    });
  }

  private loadBooks(): void {
    this.loading = true;
    this.booksService.getBooks().subscribe({
      next: (books) => {
        this.books = books;
        this.loading = false;
      },
      error: (error: unknown) => {
        this.loading = false;
        this.setError(error, 'The books could not be loaded.');
      },
    });
  }

  private replaceBook(book: Book): void {
    const index = this.books.findIndex((item) => item.id === book.id);
    if (index === -1) {
      this.books = [...this.books, book];
      return;
    }

    this.books = this.books.map((item) => (item.id === book.id ? book : item));
  }

  private setError(error: unknown, fallback: string): void {
    if (error instanceof HttpErrorResponse && typeof error.error === 'string') {
      this.errorMessage = error.error;
      return;
    }
    this.errorMessage = fallback;
  }
}
