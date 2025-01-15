
import { DOCUMENT } from '@angular/common';
import { Component, Inject, inject, OnDestroy, OnInit } from '@angular/core';
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
  public isDarkMode = false;
  ngOnInit(): void {
    this.getAllBooks()

  }

  constructor (private booksServices: BooksService, private messageservice:MessageService, @Inject(DOCUMENT) private document:Document){}
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
  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme();
  }


  applyTheme() {

    const body = document.body;
    if (this.isDarkMode) {
      body.classList.add('dark');
      let themeLink = this.document.getElementById('app-theme') as HTMLLinkElement
      themeLink.href = 'lara-dark-blue.css'


    } else {
      body.classList.remove('dark');
      let themeLink = this.document.getElementById('app-theme') as HTMLLinkElement
      themeLink.href = 'lara-light-blue.css'

    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }



}
