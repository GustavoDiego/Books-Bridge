import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DialogService } from 'primeng/dynamicdialog';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [DialogService],
  bootstrap: [AppComponent]
})
export class AppModule { }
