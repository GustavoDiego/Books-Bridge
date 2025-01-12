import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { SimplifiedBook } from 'src/app/models/model/books/simplifiedBook'

@Injectable({
  providedIn: 'root'
})
export class BookDataTransferService {
  private cache$ = new BehaviorSubject<SimplifiedBook[] | null>(null)

  
  setCache(data: SimplifiedBook[]): void {
    this.cache$.next(data)
  }


  getCache(): Observable<SimplifiedBook[] | null> {
    return this.cache$.asObservable()
  }


  hasCache(): boolean {
    return this.cache$.value !== null
  }


  clearCache(): void {
    this.cache$.next(null)
  }
}
