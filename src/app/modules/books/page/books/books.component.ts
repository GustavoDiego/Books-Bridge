import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable, Subject, takeUntil } from 'rxjs';

import { SimplifiedBook } from 'src/app/models/model/books/simplifiedBook';
import { BooksService } from 'src/app/services/books.service';
import { ThemeService } from 'src/app/shared/services/theme/theme.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: []
})
export class BooksComponent implements OnInit, OnDestroy {
  // Subject para gerenciar o encerramento das subscrições e evitar memory leaks
  private readonly destroy$ : Subject<void> = new Subject();

  // Armazena a lista de livros obtidos do serviço
  public BooksData: SimplifiedBook[] = [];
  // Observable para acompanhar o tema atual da aplicação (claro ou escuro)
  public isDarkMode$ = this.themeService.getCurrentTheme();

  // Injeta os serviços necessários: BooksService, MessageService e ThemeService
  constructor (
    private booksServices: BooksService,
    private messageservice: MessageService,
    private themeService: ThemeService
  ) {}

  // Método de inicialização do componente
  ngOnInit(): void {
    // Busca todos os livros ao inicializar o componente
    this.getAllBooks();
  }

  // Faz a chamada ao serviço para obter os livros
  getAllBooks() {
    this.booksServices.getAllBooks()
      .pipe(takeUntil(this.destroy$)) // cancela a subscrição quando destroy$ emitir
      .subscribe({
        next: (response) => {
          if (response) {
            // Se tiver resposta válida, armazena os livros e loga no console
            this.BooksData = response;
            console.log(this.BooksData);
          }
        },
        error: (err) => {
          console.log(err);
          // Em caso de erro, exibe uma mensagem de erro usando o MessageService
          this.messageservice.add({
            severity:'error',
            summary:'Erro',
            detail: 'Erro ao recuperar dados dos Livros',
            life: 2500
          });
        }
      });
  }

  // Método para alternar o tema da aplicação
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  // Limpa as subscrições quando o componente for destruído
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
