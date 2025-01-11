import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarNavigationComponent } from './components/toolbar-navigation/toolbar-navigation.component';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    ToolbarNavigationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    ToolbarModule,
    CardModule,
    ButtonModule,

  ],
  exports:[ToolbarNavigationComponent]
})
export class SharedModule { }
