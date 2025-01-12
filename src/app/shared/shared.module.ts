import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarNavigationComponent } from './components/toolbar-navigation/toolbar-navigation.component';

import { RouterModule } from '@angular/router';


import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    ToolbarNavigationComponent
  ],
  imports: [
    CommonModule,

    HttpClientModule,

    RouterModule

  ],
  exports:[ToolbarNavigationComponent]
})
export class SharedModule { }
