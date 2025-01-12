import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartBarComponent } from './components/chart-bar/chart-bar.component';
import { StatisticsComponent } from './page/statistics/statistics.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { STATISTICS_ROUTES } from './statistics.routing';



@NgModule({
  declarations: [
    ChartBarComponent,
    StatisticsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(STATISTICS_ROUTES),
    HttpClientModule,
  ],
  providers:[MessageService]
})
export class StatisticsModule { }
