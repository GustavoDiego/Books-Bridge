import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, BehaviorSubject } from 'rxjs';
import { BooksTablesComponent } from './books-tables.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TableModule } from 'primeng/table';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('BooksTablesComponent', () => {
  let component: BooksTablesComponent;
  let fixture: ComponentFixture<BooksTablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableModule, RouterTestingModule],
      declarations: [BooksTablesComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(BooksTablesComponent);
    component = fixture.componentInstance;

    // Inicialização dos valores observáveis
    component.dark = of(false);
    component.books = [];

    fixture.detectChanges();
    console.log('Componente BooksTablesComponent criado para testes.');
  });

  it('deve criar', () => {
    expect(component).toBeTruthy();
    console.log('Componente BooksTablesComponent criado com sucesso.');
  });

  describe('isDark', () => {
    it('deve definir isDark baseado no Observable dark ao iniciar', () => {
      expect(component.isDark).toBeFalse();
      console.log('isDark inicial definido corretamente como false.');
    });

    it('deve atualizar isDark quando dark emitir um novo valor', () => {
      const darkSubject = new BehaviorSubject<boolean>(false);
      component.dark = darkSubject.asObservable();

      component.ngOnInit();

      expect(component.isDark).toBeFalse();
      console.log('isDark inicialmente false conforme emissão inicial.');

      darkSubject.next(true);
      expect(component.isDark).toBeTrue();
      console.log('isDark atualizado para true após nova emissão.');

      darkSubject.next(false);
      expect(component.isDark).toBeFalse();
      console.log('isDark atualizado para false após nova emissão.');
    });
  });
});
