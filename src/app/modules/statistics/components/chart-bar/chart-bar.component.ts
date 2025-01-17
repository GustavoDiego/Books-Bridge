import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { MessageService } from 'primeng/api';
import { Observable, of, Subject, takeUntil } from 'rxjs';
import { SimplifiedBook } from 'src/app/models/model/books/simplifiedBook';
import { BooksService } from 'src/app/services/books.service';

@Component({
  selector: 'app-chart-bar',
  templateUrl: './chart-bar.component.html',
  styleUrls: []
})
export class ChartBarComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject()
  public booksList: SimplifiedBook[] = []
  public booksChartDatas!: ChartData
  public booksChartOptions!: ChartOptions
  @Input() public dark: Observable<boolean> = of(false)
  public isDark: boolean = false

  constructor(private booksServices: BooksService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.getAllBooks()
    if (this.dark) {
      this.dark.pipe(takeUntil(this.destroy$)).subscribe(isDark => {
        this.isDark = isDark
      })
    } else {
      console.warn('Input "dark" não foi fornecido, usando valor padrão.')
      this.isDark = false
    }
  }

  getAllBooks(): void {
    this.booksServices.getAllBooks()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          if (response) {
            this.booksList = response
            this.setBooksChartConfig()
          }
        },
        error: err => {
          console.log(err)
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao recuperar dados dos Livros',
            life: 2500
          })
        }
      })
  }

  setBooksChartConfig(): void {
    if (this.booksList.length > 0) {
      const groupedBySaleability: { [key: string]: number } = this.booksList.reduce((acc, book) => {
        const saleability = book.saleability || 'Unknown'
        acc[saleability] = (acc[saleability] || 0) + 1
        return acc
      }, {} as { [key: string]: number })

      const documentStyle = getComputedStyle(document.documentElement)
      const textColor = documentStyle.getPropertyValue('--text-color')
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary')
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border')

      this.booksChartDatas = {
        labels: Object.keys(groupedBySaleability),
        datasets: [
          {
            label: 'Quantidade por Tipo de venda',
            backgroundColor: documentStyle.getPropertyValue('--indigo-400'),
            borderColor: documentStyle.getPropertyValue('--indigo-400'),
            hoverBackgroundColor: documentStyle.getPropertyValue('--indigo-600'),
            data: Object.values(groupedBySaleability)
          }
        ]
      }

      this.booksChartOptions = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
          legend: {
            labels: {
              color: textColor
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
              font: {
                weight: 500
              }
            },
            grid: {
              color: surfaceBorder
            }
          },
          y: {
            ticks: {
              color: textColorSecondary
            },
            grid: {
              color: surfaceBorder
            }
          }
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
