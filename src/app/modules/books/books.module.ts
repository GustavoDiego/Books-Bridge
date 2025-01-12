import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BooksComponent } from './page/books/books.component';
import { RouterModule } from '@angular/router';
import { BOOKS_ROUTES } from './books.routing';
import { SharedModule } from 'src/app/shared/shared.module';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { SidebarModule } from 'primeng/sidebar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BooksTablesComponent } from './components/books-tables/books-tables.component';
import { HttpClientModule } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import {TooltipModule} from 'primeng/tooltip';
@NgModule({
  declarations: [
    BooksComponent,
    BooksTablesComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(BOOKS_ROUTES),
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    SidebarModule,
    ButtonModule,
    ToolbarModule,
    CardModule,
    ToastModule,
    TableModule,
    TooltipModule

  ],
  providers:[MessageService]
})
export class BooksModule { }
