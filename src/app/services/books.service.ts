import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environments } from 'src/environments/environments'
import { Observable, forkJoin } from 'rxjs'
import { map } from 'rxjs/operators'
import { BookItem, GetAllBooksResponse } from '../models/model/books/getAllBooksResponse'
import { SimplifiedBook } from '../models/model/books/simplifiedBook'
import { Authors } from '../models/enums/authors/authors'
import { BookDataTransferService } from '../shared/services/book-data-transfer.service'

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  private API_URL = environments.API_URL
  private API_KEY = environments.API_KEY

  constructor(private http: HttpClient,
              private bookDTService: BookDataTransferService) {}

  getAllBooks(): Observable<SimplifiedBook[]> {
    if (this.bookDTService.hasCache()) {
      return this.bookDTService.getCache() as Observable<SimplifiedBook[]>
    }
    const authorsRequests = Object.values(Authors).map(author =>
      this.http.get<GetAllBooksResponse>(
        `${this.API_URL}?q=inauthor:"${author}"&printType=books&maxResults=20&key=${this.API_KEY}`
      )
    )

    return forkJoin(authorsRequests).pipe(
      map(responses =>
        responses
          .flatMap(response => response.items)
          .map(book => ({
            id: book.id,
            title: book.volumeInfo.title,
            authors: (book.volumeInfo.authors || ['Unknown']).join(', '),
            categories: (book.volumeInfo.categories || []).join(', '),
            averageRating: book.volumeInfo.averageRating,
            saleability: book.saleInfo.saleability
          }))
      )
    )
  }

}
