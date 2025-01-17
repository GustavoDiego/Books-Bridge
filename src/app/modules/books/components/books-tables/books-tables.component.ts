import { BookItem } from './../../../../models/model/books/getAllBooksResponse';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil, Observable } from 'rxjs';
import { SimplifiedBook } from 'src/app/models/model/books/simplifiedBook';

@Component({
  selector: 'app-books-tables',
  templateUrl: './books-tables.component.html',
  styleUrls: []
})
// Componente responsável por exibir uma tabela de livros
export class BooksTablesComponent implements OnInit, OnDestroy {

  // Recebe uma lista de livros do componente pai via property binding
  @Input() public books: SimplifiedBook[] = [];
  // Recebe um Observable que indica se o tema atual é escuro ou não
  @Input() public dark!: Observable<boolean>;

  // Variável para armazenar o estado atual do tema (claro ou escuro)
  public isDark: boolean = false;
  // Subject para gerenciar encerramento de subscrições e evitar memory leaks
  private readonly destroy$ : Subject<void>  = new Subject();

  ngOnInit() {
    // Subscrição para atualizar isDark sempre que o tema mudar.
    // Utiliza takeUntil com destroy$ pra cancelar a inscrição quando o componente for destruído
    this.dark.pipe(takeUntil(this.destroy$))
      .subscribe(isDark => {
        this.isDark = isDark;
      });
  }

  // Guarda os livros selecionados, se necessário para lógica adicional (não está usado no momento)
  public bookSelected!: SimplifiedBook[];

  ngOnDestroy(): void {
    // Emite e completa destroy$ para cancelar todas as subscrições ativas
    this.destroy$.next();
    this.destroy$.complete();
  }
}
