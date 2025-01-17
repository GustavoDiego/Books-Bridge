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
  // Subject para gerenciar o ciclo de vida das subscrições e evitar vazamentos de memória
  private readonly destroy$: Subject<void> = new Subject();
  // Armazena a lista de livros recebidos
  public booksList: SimplifiedBook[] = [];
  // Dados e opções para configurar o gráfico de barra
  public booksChartDatas!: ChartData;
  public booksChartOptions!: ChartOptions;

  // Input para receber o tema dark como um Observable; inicializa como false por padrão
  @Input() public dark: Observable<boolean> = of(false);
  public isDark: boolean = false;

  constructor(private booksServices: BooksService, private messageService: MessageService) {}

  ngOnInit(): void {
    // Ao inicializar, busca os livros e configura a subscrição de tema
    this.getAllBooks();
    if (this.dark) {
      // Se o Observable dark foi passado, subscreve pra atualizar o estado do tema
      this.dark.pipe(takeUntil(this.destroy$)).subscribe(isDark => {
        this.isDark = isDark;
      });
    } else {
      // Se não informou "dark", usa valor padrão e avisa no console
      console.warn('Input "dark" não foi fornecido, usando valor padrão.');
      this.isDark = false;
    }
  }

  // Método pra buscar todos os livros usando o serviço
  getAllBooks(): void {
    this.booksServices.getAllBooks()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: response => {
          if (response) {
            // Se obteve resposta, armazena a lista e configura o gráfico
            this.booksList = response;
            this.setBooksChartConfig();
          }
        },
        error: err => {
          console.log(err);
          // Em caso de erro, mostra mensagem pro usuário
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao recuperar dados dos Livros',
            life: 2500
          });
        }
      });
  }

  // Configura o gráfico de barras com base nos dados dos livros
  setBooksChartConfig(): void {
    if (this.booksList.length > 0) {
      // Agrupa os livros por tipo de venda (saleability)
      const groupedBySaleability: { [key: string]: number } = this.booksList.reduce((acc, book) => {
        const saleability = book.saleability || 'Unknown';
        acc[saleability] = (acc[saleability] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });

      // Obtém estilos do documento pra personalizar o gráfico de acordo com o tema
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

      // Configura os dados do gráfico usando os valores agrupados
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
      };

      // Define as opções de apresentação do gráfico
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
      };
    }
  }

  // Limpa as subscrições pra evitar memory leaks quando o componente é destruído
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
