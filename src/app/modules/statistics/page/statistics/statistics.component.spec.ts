import { ComponentFixture, TestBed } from '@angular/core/testing'
import { of, throwError, Subject } from 'rxjs'
import { StatisticsComponent } from './statistics.component'
import { BooksService } from 'src/app/services/books.service'
import { MessageService } from 'primeng/api'
import { ThemeService } from 'src/app/shared/services/theme/theme.service'
import { SimplifiedBook } from 'src/app/models/model/books/simplifiedBook'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('StatisticsComponent', () => {
  let component: StatisticsComponent
  let fixture: ComponentFixture<StatisticsComponent>

  let mockBooksService: jasmine.SpyObj<BooksService>
  let mockMessageService: jasmine.SpyObj<MessageService>
  let mockThemeService: jasmine.SpyObj<ThemeService>

  const dummyBooks: SimplifiedBook[] = [
    {
      id: '1',
      title: 'Livro Exemplo',
      authors: 'Autor Exemplo',
      categories: 'Categoria Exemplo',
      averageRating: '4',
      saleability: 'NOT_FOR_SALE',
      publishedDate: '2020-01-01'
    }
  ]

  beforeEach(async () => {

    mockBooksService = jasmine.createSpyObj('BooksService', ['getAllBooks'])
    mockMessageService = jasmine.createSpyObj('MessageService', ['add'])
    mockThemeService = jasmine.createSpyObj('ThemeService', ['getCurrentTheme', 'toggleTheme'])


    mockBooksService.getAllBooks.and.returnValue(of(dummyBooks))
    mockThemeService.getCurrentTheme.and.returnValue(of(false))

    await TestBed.configureTestingModule({
      declarations: [StatisticsComponent],
      providers: [
        { provide: BooksService, useValue: mockBooksService },
        { provide: MessageService, useValue: mockMessageService },
        { provide: ThemeService, useValue: mockThemeService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents()

    fixture = TestBed.createComponent(StatisticsComponent)
    component = fixture.componentInstance


    ;(component as any).destroy$ = new Subject<void>()

    fixture.detectChanges()
    console.log('Componente StatisticsComponent criado para testes.')
  })

  afterEach(() => {
    
    ;(component as any).destroy$.next()
    ;(component as any).destroy$.complete()
  })

  it('deve ser criado', () => {
    expect(component).toBeTruthy()
    console.log('Teste de criação do componente passou.')
  })

  describe('ngOnInit e getAllBooks', () => {
    it('deve obter livros com sucesso e definir BooksData', () => {
      mockBooksService.getAllBooks.and.returnValue(of(dummyBooks))

      component.getAllBooks()

      expect(mockBooksService.getAllBooks).toHaveBeenCalled()
      expect(component.BooksData).toEqual(dummyBooks)
      console.log('BooksData definido corretamente após sucesso na chamada.')
    })

    it('deve lidar com erro ao obter livros e exibir mensagem', () => {
      const errorResponse = new Error('Erro de teste')
      mockBooksService.getAllBooks.and.returnValue(throwError(() => errorResponse))

      component.getAllBooks()

      expect(mockBooksService.getAllBooks).toHaveBeenCalled()
      expect(mockMessageService.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao recuperar dados dos Livros',
        life: 2500
      })
      console.log('Mensagem de erro exibida corretamente após falha na chamada.')
    })
  })

  describe('toggleTheme', () => {
    it('deve chamar toggleTheme do ThemeService', () => {
      component.toggleTheme()

      expect(mockThemeService.toggleTheme).toHaveBeenCalled()
      console.log('toggleTheme chamado corretamente.')
    })
  })

  describe('ngOnDestroy', () => {
    it('deve limpar subscriptions ao destruir o componente', () => {
      const nextSpy = spyOn((component as any).destroy$, 'next').and.callThrough()
      const completeSpy = spyOn((component as any).destroy$, 'complete').and.callThrough()

      component.ngOnDestroy()

      expect(nextSpy).toHaveBeenCalled()
      expect(completeSpy).toHaveBeenCalled()
      console.log('destroy$ foi completado corretamente no ngOnDestroy.')
    })
  })
})
