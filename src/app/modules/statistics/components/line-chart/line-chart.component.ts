import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { MessageService } from 'primeng/api';
import { Observable, Subject, takeUntil } from 'rxjs';
import { SimplifiedBook } from 'src/app/models/model/books/simplifiedBook';
import { CATEGORY_MAPPINGS } from 'src/app/models/model/categories/categoriesMapping';
import { BooksService } from 'src/app/services/books.service';


@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: []
})
export class LineChartComponent implements OnInit, OnDestroy {
  private readonly destroy$ : Subject<void> = new Subject();
  public booksList: SimplifiedBook[] = [];
  public booksChartDatas!: ChartData;
  public booksChartOptions!: ChartOptions;
  @Input() public dark!: Observable<boolean>

  public isDark: boolean = false;

  ngOnInit(): void {
    this.getAllBooks();
    if (this.dark) {
      this.dark.pipe(takeUntil(this.destroy$)).subscribe(isDark => {
        this.isDark = isDark;
      });
    }
  }


  constructor (private booksServices: BooksService, private messageService: MessageService) { }

  private resolveCategoryGroup(originalCategory: string): string {

    const catNormalized = originalCategory.trim();


    for (const mapping of CATEGORY_MAPPINGS) {
      if (mapping.keywords.includes(catNormalized)) {
        return mapping.groupName;
      }
    }


    return 'Outros';
  }

  getAllBooks(): void {
    this.booksServices.getAllBooks()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            this.booksList = response;
            this.setBooksChartConfig();
          }
        },
        error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao recuperar dados dos Livros',
            life: 2500
          });
        }
      });
  }
  setBooksChartConfig(): void {

    const yearsSet = new Set<string>();
      this.booksList.forEach(book => {
        if (book.publishedDate) {
          const year = book.publishedDate.substring(0,4);
          yearsSet.add(year);
        }
      });
    const yearsArray = [...yearsSet].sort();


    const groupsSet = new Set<string>();
      this.booksList.forEach(book => {
        if (book.categories) {
          const groupName = this.resolveCategoryGroup(book.categories);
          groupsSet.add(groupName);
        }
      });
    const groupsArray = [...groupsSet];

    const datasets = groupsArray.map((groupName, i) => {

      const dataPerYear = yearsArray.map(year => {
        return this.booksList.filter(b => {
          const hasYear = b.publishedDate?.startsWith(year);
          const catGroup = this.resolveCategoryGroup(b.categories ?? '');
          return hasYear && (catGroup === groupName);
        }).length;
      });


      const borderColors = [
        '#42A5F5', // Azul claro
        '#FFA726', // Laranja
        '#66BB6A', // Verde
        '#FF6384', // Rosa avermelhado
        '#36A2EB', // Azul
        '#FFCE56', // Amarelo
        '#00C851', // Verde forte
        '#FFBB33', // Amarelo-alaranjado
        '#AA66CC', // Roxo claro
        '#2B2B2B', // Cinza-escuro
        '#CC0000', // Vermelho forte
        '#44BD32', // Verde-limão
        '#9B59B6', // Roxo
        '#2980B9', // Azul escuro
        '#F1C40F', // Amarelo vivo
        '#D35400', // Laranja queimado
        '#2ECC71', // Esmeralda
        '#1ABC9C', // Azul turquesa
        '#607D8B', // Azul acinzentado
        '#E91E63', // Pink forte
      ];


      const color = borderColors[i % borderColors.length];

      return {
        label: groupName,
        data: dataPerYear,
        fill: false,
        borderColor: color,
        tension: 0.4
      };
    });


    this.booksChartDatas = {
      labels: yearsArray,
      datasets
    };


    this.booksChartOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#495057'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        },
        y: {
          ticks: {
            color: '#495057'
          },
          grid: {
            color: '#ebedef'
          }
        }
      }
    };
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
