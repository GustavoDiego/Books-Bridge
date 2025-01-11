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
import { ChartModule } from 'primeng/chart';
import { SidebarModule } from 'primeng/sidebar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    BooksComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(BOOKS_ROUTES),
    SharedModule,
    FormsModule,
    ReactiveFormsModule,

    SidebarModule,
    ButtonModule,
    ToolbarModule,
    CardModule,
    ToastModule,
    ChartModule
  ]
})
export class BooksModule { }
