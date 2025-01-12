
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { BookItem } from 'src/app/models/model/books/getAllBooksResponse';
import { SimplifiedBook } from 'src/app/models/model/books/simplifiedBook';
import { BooksService } from 'src/app/services/books.service';
@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: []
})

export class BooksComponent implements OnInit, OnDestroy{
  private readonly destroy$ :  Subject<void> = new Subject()
  public BooksData: SimplifiedBook[] = [];
  ngOnInit(): void {
    this.getAllBooks()

  }

  constructor (private booksServices: BooksService, private messageservice:MessageService){}
  getAllBooks() {
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
          this.messageservice.add({
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
