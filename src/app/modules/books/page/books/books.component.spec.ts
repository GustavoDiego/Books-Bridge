import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BooksComponent } from './books.component';
import { BooksService } from 'src/app/services/books.service';
import { MessageService } from 'primeng/api';
import { ThemeService } from 'src/app/shared/services/theme/theme.service';
import { of, throwError, BehaviorSubject } from 'rxjs';
import { SimplifiedBook } from 'src/app/models/model/books/simplifiedBook';
import { RouterTestingModule } from '@angular/router/testing';
import { TableModule } from 'primeng/table';
import { SharedModule } from 'src/app/shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('BooksComponent', () => {
  let component: BooksComponent;
  let fixture: ComponentFixture<BooksComponent>;

  let mockBooksService: jasmine.SpyObj<BooksService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockThemeService: jasmine.SpyObj<ThemeService>;

  const dummyBooks: SimplifiedBook[] = [
    {
      id: '1',
      title: 'Livro de Teste 1',
      authors: 'Autor Teste 1',
      categories: 'Categoria Teste 1',
      averageRating: '4',
      saleability: 'NOT_FOR_SALE',
      publishedDate: '2020-01-01'
    },
    {
      id: '2',
      title: 'Livro de Teste 2',
      authors: 'Autor Teste 2',
      categories: 'Categoria Teste 2',
      averageRating: '5',
      saleability: 'FOR_SALE',
      publishedDate: '2021-02-02'
    }
  ];

  beforeEach(async () => {
    mockBooksService = jasmine.createSpyObj('BooksService', ['getAllBooks']);
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);
    mockThemeService = jasmine.createSpyObj('ThemeService', ['getCurrentTheme', 'toggleTheme']);

    const darkSubject = new BehaviorSubject<boolean>(false);
    mockThemeService.getCurrentTheme.and.returnValue(darkSubject.asObservable());
    mockBooksService.getAllBooks.and.returnValue(of(dummyBooks));

    await TestBed.configureTestingModule({
      imports: [TableModule, RouterTestingModule, SharedModule],
      declarations: [BooksComponent],
      providers: [
        { provide: BooksService, useValue: mockBooksService },
        { provide: MessageService, useValue: mockMessageService },
        { provide: ThemeService, useValue: mockThemeService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(BooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    component['destroy$'].next();
    component['destroy$'].complete();
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('deve chamar getAllBooks ao inicializar', () => {
      spyOn(component, 'getAllBooks');
      component.ngOnInit();
      expect(component.getAllBooks).toHaveBeenCalled();
    });
  });

  describe('getAllBooks', () => {
    it('deve definir BooksData quando a chamada de serviço for bem-sucedida', () => {
      component.getAllBooks();
      expect(mockBooksService.getAllBooks).toHaveBeenCalled();
      expect(component.BooksData).toEqual(dummyBooks);
    });

    it('deve exibir mensagem de erro quando a chamada de serviço falhar', () => {
      
      mockBooksService.getAllBooks.and.returnValue(throwError(() => new Error('Erro ao buscar livros')))


      component.BooksData = []


      component.getAllBooks()


      expect(component.BooksData).toEqual([], 'BooksData deve ser vazio quando a chamada do serviço falha')


      expect(mockMessageService.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao recuperar dados dos Livros',
        life: 2500
      })
    })


  });

  describe('toggleTheme', () => {
    it('deve chamar toggleTheme do ThemeService', () => {
      component.toggleTheme();
      expect(mockThemeService.toggleTheme).toHaveBeenCalled();
    });
  });

  describe('isDarkMode$', () => {
    it('deve receber o valor do ThemeService', (done: DoneFn) => {
      component.isDarkMode$.subscribe(isDark => {
        expect(isDark).toBeFalse();
        done();
      });
    });
  });

  describe('ngOnDestroy', () => {
    it('deve completar destroy$ ao destruir o componente', () => {
      const destroySpy = spyOn(component['destroy$'], 'next').and.callThrough();
      const completeSpy = spyOn(component['destroy$'], 'complete').and.callThrough();
      component.ngOnDestroy();
      expect(destroySpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });
});
