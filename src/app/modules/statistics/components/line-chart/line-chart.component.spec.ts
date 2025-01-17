import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError, BehaviorSubject } from 'rxjs';
import { LineChartComponent } from './line-chart.component';
import { BooksService } from 'src/app/services/books.service';
import { MessageService } from 'primeng/api';
import { SimplifiedBook } from 'src/app/models/model/books/simplifiedBook';
import { RouterTestingModule } from '@angular/router/testing';
import { ChartModule } from 'primeng/chart';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('LineChartComponent', () => {
  let component: LineChartComponent;
  let fixture: ComponentFixture<LineChartComponent>;

  let mockBooksService: jasmine.SpyObj<BooksService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;

  const dummyBooks: SimplifiedBook[] = [
    {
      id: '1',
      title: 'Livro Exemplo',
      authors: 'Autor Exemplo',
      categories: 'Ficção',
      averageRating: '4',
      saleability: 'FOR_SALE',
      publishedDate: '2020-05-05'
    },
    {
      id: '2',
      title: 'Outro Livro',
      authors: 'Outro Autor',
      categories: 'Não Ficção',
      averageRating: '5',
      saleability: 'NOT_FOR_SALE',
      publishedDate: '2021-03-15'
    }
  ];

  beforeEach(async () => {
    mockBooksService = jasmine.createSpyObj('BooksService', ['getAllBooks']);
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);

    await TestBed.configureTestingModule({
      imports: [ChartModule, RouterTestingModule],
      declarations: [LineChartComponent],
      providers: [
        { provide: BooksService, useValue: mockBooksService },
        { provide: MessageService, useValue: mockMessageService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(LineChartComponent);
    component = fixture.componentInstance;

    // Mock de Observable `dark`
    const darkSubject = new BehaviorSubject<boolean>(false);
    component.dark = darkSubject.asObservable();

    // Mock da resposta do serviço
    mockBooksService.getAllBooks.and.returnValue(of(dummyBooks));

    fixture.detectChanges();
  });

  afterEach(() => {
    component['destroy$'].next();
    component['destroy$'].complete();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  describe('getAllBooks', () => {
    it('deve definir booksList e configurar gráfico em caso de sucesso', () => {
      component.getAllBooks();

      expect(mockBooksService.getAllBooks).toHaveBeenCalled();
      expect(component.booksList).toEqual(dummyBooks);

      expect(component.booksChartDatas).toBeDefined();
      expect(component.booksChartOptions).toBeDefined();
    });

    it('deve lidar com erro ao obter livros e exibir mensagem', () => {
      const errorResponse = new Error('Erro de teste');
      mockBooksService.getAllBooks.and.returnValue(throwError(() => errorResponse));

      component.getAllBooks();

      expect(mockBooksService.getAllBooks).toHaveBeenCalled();
      expect(mockMessageService.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao recuperar dados dos Livros',
        life: 2500
      });
    });
  });

  describe('dark Observable', () => {
    it('deve atualizar isDark ao receber novos valores', () => {
      const darkSubject = new BehaviorSubject<boolean>(false);
      component.dark = darkSubject.asObservable();

      component.ngOnInit();

      expect(component.isDark).toBeFalse();

      darkSubject.next(true);
      expect(component.isDark).toBeTrue();

      darkSubject.next(false);
      expect(component.isDark).toBeFalse();
    });
  });

  describe('ngOnDestroy', () => {
    it('deve completar destroy$ ao destruir o componente', () => {
      const nextSpy = spyOn(component['destroy$'], 'next').and.callThrough();
      const completeSpy = spyOn(component['destroy$'], 'complete').and.callThrough();

      component.ngOnDestroy();

      expect(nextSpy).toHaveBeenCalled();
      expect(completeSpy).toHaveBeenCalled();
    });
  });
});
