import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { SimplifiedBook } from 'src/app/models/model/books/simplifiedBook'

@Injectable({
  providedIn: 'root'
})
export class BookDataTransferService {
  // BehaviorSubject que guarda um array de SimplifiedBook ou null como cache inicial
  private cache$ = new BehaviorSubject<SimplifiedBook[] | null>(null)

  // Atualiza o cache com novos dados de livros
  setCache(data: SimplifiedBook[]): void {
    this.cache$.next(data)
  }

  // Retorna um Observable pra quem quiser se inscrever no cache de livros
  getCache(): Observable<SimplifiedBook[] | null> {
    return this.cache$.asObservable()
  }

  // Verifica se já tem algum dado armazenado no cache
  hasCache(): boolean {
    // Aqui verificamos se o valor atual do BehaviorSubject não é nulo
    return this.cache$.value !== null
  }

  // Limpa o cache, definindo-o novamente como null
  clearCache(): void {
    // Isso faz com que o cache seja resetado. Pode ser útil quando vc precisa de um estado limpo
    this.cache$.next(null)
  }
}
