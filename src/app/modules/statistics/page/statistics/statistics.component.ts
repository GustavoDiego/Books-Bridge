import { Subject, takeUntil } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BooksService } from 'src/app/services/books.service';
import { MessageService } from 'primeng/api';
import { SimplifiedBook } from 'src/app/models/model/books/simplifiedBook';
import { ThemeService } from 'src/app/shared/services/theme/theme.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: []
})
export class StatisticsComponent implements OnInit, OnDestroy{
  // Subject usado pra cancelar assinaturas quando o componente for destruído
  private readonly destroy$ : Subject<void> = new Subject();
  // Array pra armazenar dados simplificados dos livros
  public BooksData: SimplifiedBook[] = [];
  // Observable pra acompanhar o tema atual (claro/escuro)
  public isDarkMode$ = this.themeService.getCurrentTheme();

  constructor(
    private booksServices: BooksService,
    private messageService: MessageService,
    private themeService: ThemeService
  ){}

  // Método de inicialização do componente
  ngOnInit(): void {
    this.getAllBooks();
  }

  // Faz requisição pra obter todos os livros
  getAllBooks(): void {
    this.booksServices.getAllBooks()
      // Cancela a assinatura automaticamente quando destroy$ emitir
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          // Se receber resposta, atualiza BooksData
          if (response){
            this.BooksData = response;
            console.log(this.BooksData);
          }
        },
        error: (err) =>{
          // Em caso de erro, loga e mostra mensagem de erro pro usuário
          console.log(err);
          this.messageService.add({
            severity:'error',
            summary:'Erro',
            detail: 'Erro ao recuperar dados dos Livros',
            life: 2500
          })
        }
      });
  }

  // Método pra alternar tema
  toggleTheme():void{
    this.themeService.toggleTheme();
  }

  // Ao destruir o componente, emite e completa destroy$ pra limpar recursos
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
