import { BookItem } from './../../../../models/model/books/getAllBooksResponse';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil, Observable } from 'rxjs';
import { SimplifiedBook } from 'src/app/models/model/books/simplifiedBook';

@Component({
  selector: 'app-books-tables',
  templateUrl: './books-tables.component.html',
  styleUrls: []
})
export class BooksTablesComponent implements OnInit {
  @Input() public books: SimplifiedBook[] =[]
  @Input() public dark!: Observable<boolean>

  public isDark: boolean = false;

  ngOnInit() {
    this.dark.subscribe(isDark => {
      this.isDark = isDark;
    });
  }

  public bookSelected!: SimplifiedBook[]
  }

