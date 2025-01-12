import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DialogService } from 'primeng/dynamicdialog';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {HttpClientModule} from '@angular/common/http'
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,

    ToastModule,

  ],

  providers: [DialogService, MessageService],

  bootstrap: [AppComponent]
})
export class AppModule { }
