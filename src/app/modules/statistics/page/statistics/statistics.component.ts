import { Subject, takeUntil } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BooksService } from 'src/app/services/books.service';
import { MessageService } from 'primeng/api';
import { SimplifiedBook } from 'src/app/models/model/books/simplifiedBook';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: []
})
export class StatisticsComponent implements OnInit, OnDestroy{
  private readonly destroy$ : Subject<void> = new Subject();
  public BooksData: SimplifiedBook[] = [];
  ngOnInit(): void {
    this.getAllBooks();
  }

  constructor(private booksServices: BooksService, private messageService: MessageService){}

  getAllBooks(): void {
      this.booksServices.getAllBooks()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        {
          next: (response) =>{
            if (response){

              this.BooksData = response;
              console.log(this.BooksData)
            }

          },
          error: (err) =>{
            console.log(err);
            this.messageService.add({
              severity:'error',
              summary:'Erro',
              detail: 'Erro ao recuperar dados dos Livros',
              life: 2500

            })
          }
        }
      )
    }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }




}
