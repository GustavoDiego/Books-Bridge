import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { BooksService } from './books.service'
import { BookDataTransferService } from '../shared/services/book-data-transfer/book-data-transfer.service'
import { of } from 'rxjs'
import { SimplifiedBook } from '../models/model/books/simplifiedBook'
import { GetAllBooksResponse, BookItem } from '../models/model/books/getAllBooksResponse'
import { Authors } from '../models/enums/authors/authors'

describe('BooksService', () => {
  let service: BooksService
  let httpMock: HttpTestingController
  let fakeBookDTService: Partial<BookDataTransferService>

  const dummyBookItem: BookItem = {
    kind: 'books#volume',
    id: '1',
    etag: 'etag-test',
    selfLink: 'http://exemplo.com',
    volumeInfo: {
      title: 'Livro Teste',
      authors: ['Autor Teste'],
      categories: ['Categoria Teste'],
      averageRating: 4,
      publishedDate: '2020-01-01',
      readingModes: { text: true, image: true },
      maturityRating: 'NOT_MATURE',
      allowAnonLogging: false,
      contentVersion: '1.0.0',
      language: 'pt',
      previewLink: 'http://preview-exemplo.com',
      infoLink: 'http://info-exemplo.com',
      canonicalVolumeLink: 'http://volume-canonico-exemplo.com'
    },
    saleInfo: {
      country: 'US',
      saleability: 'NOT_FOR_SALE',
      isEbook: false
    },
    accessInfo: {
      country: 'US',
      viewability: 'NO_PAGES',
      embeddable: false,
      publicDomain: false,
      textToSpeechPermission: 'ALLOWED',
      epub: { isAvailable: false },
      pdf: { isAvailable: false },
      webReaderLink: 'http://webreader-exemplo.com',
      accessViewStatus: 'NONE',
      quoteSharingAllowed: false
    }
  }

  const dummyResponse: GetAllBooksResponse = {
    kind: 'books#volumes',
    totalItems: 1,
    items: [dummyBookItem]
  }

  const expectedSimplifiedBook: SimplifiedBook = {
    id: '1',
    title: 'Livro Teste',
    authors: 'Autor Teste',
    categories: 'Categoria Teste',
    averageRating: '4',
    saleability: 'NOT_FOR_SALE',
    publishedDate: '2020-01-01'
  }

  beforeEach(() => {
    fakeBookDTService = {
      hasCache: jasmine.createSpy('hasCache'),
      getCache: jasmine.createSpy('getCache'),
      setCache: jasmine.createSpy('setCache')
    }

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        BooksService,
        { provide: BookDataTransferService, useValue: fakeBookDTService }
      ]
    })
    service = TestBed.inject(BooksService)
    httpMock = TestBed.inject(HttpTestingController)
    console.log('Serviço BooksService criado para testes.')
  })

  afterEach(() => {
    httpMock.verify()
  })

  it('deve ser criado', () => {
    expect(service).toBeTruthy()
    console.log('Teste de criação do serviço passou.')
  })

  it('deve retornar dados do cache se disponíveis', (done: DoneFn) => {
    const cachedBooks: SimplifiedBook[] = [expectedSimplifiedBook]

    ;(fakeBookDTService.hasCache as jasmine.Spy).and.returnValue(true)
    ;(fakeBookDTService.getCache as jasmine.Spy).and.returnValue(of(cachedBooks))

    service.getAllBooks().subscribe(books => {
      expect(books).toEqual(cachedBooks)
      console.log('Dados retornados do cache corretamente.')
      done()
    })
  })

  it('deve buscar livros quando não há cache', (done: DoneFn) => {
    (fakeBookDTService.hasCache as jasmine.Spy).and.returnValue(false)

    service.getAllBooks().subscribe(books => {
      expect(books.length).toBeGreaterThan(0)
      expect(books[0]).toEqual(expectedSimplifiedBook)
      console.log('Livros buscados e processados corretamente sem cache.')
      done()
    })

    const requests = httpMock.match(req => true)
    expect(requests.length).toBe(Object.values(Authors).length)
    console.log(`Foram feitas ${requests.length} requisições HTTP simuladas.`)

    requests.forEach(req => req.flush(dummyResponse))

    expect(fakeBookDTService.setCache).toHaveBeenCalled()
  })
})
