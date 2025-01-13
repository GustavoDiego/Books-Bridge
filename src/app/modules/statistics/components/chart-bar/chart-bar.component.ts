import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BookDataTransferService } from 'src/app/shared/services/book-data-transfer.service';

@Component({
  selector: 'app-chart-bar',
  templateUrl: './chart-bar.component.html',
  styleUrls: []
})
export class ChartBarComponent implements OnInit, OnDestroy{
  private readonly destroy$ : Subject<void> = new Subject();

  constructor(private bookDTSersvice:BookDataTransferService){}

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
