import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

import { Observable, forkJoin } from 'rxjs'
import { map, tap } from 'rxjs/operators'
import { BookItem, GetAllBooksResponse } from '../models/model/books/getAllBooksResponse'
import { SimplifiedBook } from '../models/model/books/simplifiedBook'
import { Authors } from '../models/enums/authors/authors'
import { BookDataTransferService } from '../shared/services/book-data-transfer/book-data-transfer.service'
import { environments } from 'src/environments/environments'

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  // URL da API e chave de acesso vindos do ambiente
  private API_URL = environments.API_URL;
  private API_KEY = environments.API_KEY;

  // Injeta HttpClient e o serviço de transferência de dados de livros
  constructor(private http: HttpClient,
              private bookDTService: BookDataTransferService) {}

  // Método pra obter todos os livros simplificados
  getAllBooks(): Observable<SimplifiedBook[]> {
    // Se já tem cache disponível, retorna ele direto pra não refazer chamada
    if (this.bookDTService.hasCache()) {
      return this.bookDTService.getCache() as Observable<SimplifiedBook[]>
    }

    // Cria um array de requisições HTTP, uma por autor definido no enum Authors
    const authorsRequests = Object.values(Authors).map(author =>
      this.http.get<GetAllBooksResponse>(
        `${this.API_URL}?q=inauthor:"${author}"&filter=ebooks&maxResults=20&key=${this.API_KEY}`
      )
    )

    // Executa todas as requisições em paralelo e processa os resultados
    return forkJoin(authorsRequests).pipe(
      // Mapeia as respostas para um array de SimplifiedBook
      map(responses =>
        responses
          // Junta todos os itens de livros em um único array
          .flatMap(response => response.items)
          // Mapeia cada item pra nossa estrutura simplificada
          .map(book => ({
            id: book.id,
            title: book.volumeInfo.title,
            // Se não houver autores, marca como 'Unknown'
            authors: (book.volumeInfo.authors || ['Unknown']).join(', '),
            // Junta as categorias se existirem
            categories: (book.volumeInfo.categories || []).join(', '),
            // Converte averageRating em string ou marca como 'Não registrado'
            averageRating: (book.volumeInfo.averageRating?.toString() || 'Não registrado'),
            saleability: book.saleInfo.saleability,
            publishedDate: book.volumeInfo.publishedDate
          }))
      ),
      // Após mapear, salva o resultado no cache pra uso futuro
      tap(books => this.bookDTService.setCache(books))
      // Aqui eu sei que houve um pequeno erro na implementação, mas tá funcionando bem!
    )
  }

}
