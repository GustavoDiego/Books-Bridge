import { BookItem } from './../../../../models/model/books/getAllBooksResponse';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SimplifiedBook } from 'src/app/models/model/books/simplifiedBook';

@Component({
  selector: 'app-books-tables',
  templateUrl: './books-tables.component.html',
  styleUrls: []
})
export class BooksTablesComponent  {
  @Input() public books: SimplifiedBook[] =[]
  @Input() public dark: boolean = false

  public bookSelected!: SimplifiedBook[]
  }

