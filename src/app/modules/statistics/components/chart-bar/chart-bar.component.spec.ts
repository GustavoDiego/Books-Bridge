import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of, throwError, BehaviorSubject } from 'rxjs';
import { ChartBarComponent } from './chart-bar.component';
import { BooksService } from 'src/app/services/books.service';
import { MessageService } from 'primeng/api';
import { SimplifiedBook } from 'src/app/models/model/books/simplifiedBook';
import { RouterTestingModule } from '@angular/router/testing';
import { ChartModule } from 'primeng/chart';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ChartBarComponent', () => {
  let component: ChartBarComponent;
  let fixture: ComponentFixture<ChartBarComponent>;
  let mockBooksService: jasmine.SpyObj<BooksService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;

  const dummyBooks: SimplifiedBook[] = [
    {
      id: '1',
      title: 'Livro Exemplo',
      authors: 'Autor Exemplo',
      categories: 'Categoria Exemplo',
      averageRating: '4',
      saleability: 'FOR_SALE',
      publishedDate: '2020-01-01'
    },
    {
      id: '2',
      title: 'Outro Livro',
      authors: 'Outro Autor',
      categories: 'Outra Categoria',
      averageRating: '5',
      saleability: 'NOT_FOR_SALE',
      publishedDate: '2021-01-01'
    }
  ];

  beforeEach(async () => {

    mockBooksService = jasmine.createSpyObj('BooksService', {
      getAllBooks: of(dummyBooks)
    });
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);

    await TestBed.configureTestingModule({
      imports: [ChartModule, RouterTestingModule],
      declarations: [ChartBarComponent],
      providers: [
        { provide: BooksService, useValue: mockBooksService },
        { provide: MessageService, useValue: mockMessageService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartBarComponent);
    component = fixture.componentInstance;


    const darkSubject = new BehaviorSubject<boolean>(false);
    component.dark = darkSubject.asObservable();

    fixture.detectChanges();
  });

  afterEach(() => {
    if (component['destroy$']) {
      component['destroy$'].next();
      component['destroy$'].complete();
    }
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve definir booksList e configurar gráfico em caso de sucesso', () => {

    mockBooksService.getAllBooks.and.returnValue(of(dummyBooks));

    component.getAllBooks();

    expect(mockBooksService.getAllBooks).toHaveBeenCalled();
    expect(component.booksList).toEqual(dummyBooks);
    expect(component.booksChartDatas).toBeDefined();
    expect(component.booksChartOptions).toBeDefined();
  });

  it('deve lidar com erro ao obter livros e exibir mensagem', () => {
    mockBooksService.getAllBooks.and.returnValue(throwError(() => new Error('Erro de teste')));

    component.getAllBooks();

    expect(mockBooksService.getAllBooks).toHaveBeenCalled();
    expect(mockMessageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Erro',
      detail: 'Erro ao recuperar dados dos Livros',
      life: 2500
    });
  });

  it('deve atualizar isDark ao receber novos valores', fakeAsync(() => {
    const darkSubject = new BehaviorSubject<boolean>(false);
    component.dark = darkSubject.asObservable();

    component.ngOnInit();
    tick(); 
    expect(component.isDark).toBeFalse();

    darkSubject.next(true);
    tick();
    fixture.detectChanges();
    expect(component.isDark).toBeTrue();

    darkSubject.next(false);
    tick();
    fixture.detectChanges();
    expect(component.isDark).toBeFalse();
  }));
});
