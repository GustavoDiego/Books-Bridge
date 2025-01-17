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
  // Subject pra gerenciar a vida das subscrições e evitar memory leaks
  private readonly destroy$ : Subject<void> = new Subject();
  // Lista de livros simplificados recebidos do serviço
  public booksList: SimplifiedBook[] = [];
  // Dados e opções pra o gráfico de linha
  public booksChartDatas!: ChartData;
  public booksChartOptions!: ChartOptions;
  // Recebe o Observable de tema escuro/claro via Input
  @Input() public dark!: Observable<boolean>

  public isDark: boolean = false;

  ngOnInit(): void {
    // Inicializa a busca de livros ao montar o componente
    this.getAllBooks();
    // Se o Observable dark estiver disponível, subscreve nele pra acompanhar mudança de tema
    if (this.dark) {
      this.dark.pipe(takeUntil(this.destroy$)).subscribe(isDark => {
        this.isDark = isDark;
      });
    }
  }

  constructor (private booksServices: BooksService, private messageService: MessageService) { }

  // Resolve a categoria do livro para um grupo padronizado baseado em palavras-chave
  private resolveCategoryGroup(originalCategory: string): string {
    const catNormalized = originalCategory.trim();

    for (const mapping of CATEGORY_MAPPINGS) {
      // Se a categoria bater com alguma palavra-chave mapeada, retorna o nome do grupo
      if (mapping.keywords.includes(catNormalized)) {
        return mapping.groupName;
      }
    }

    // Se não encontrou grupo correspondente, classifica como 'Outros'
    return 'Outros';
  }

  // Busca todos os livros do serviço e atualiza o gráfico
  getAllBooks(): void {
    this.booksServices.getAllBooks()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            // Armazena a lista de livros e configura o gráfico
            this.booksList = response;
            this.setBooksChartConfig();
          }
        },
        error: (err) => {
          console.log(err);
          // Mostra mensagem de erro em caso de falha na busca
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao recuperar dados dos Livros',
            life: 2500
          });
        }
      });
  }

  // Configura o gráfico de linha com base nos dados recebidos
  setBooksChartConfig(): void {
    // Cria um conjunto de anos de publicação de todos os livros
    const yearsSet = new Set<string>();
    this.booksList.forEach(book => {
      if (book.publishedDate) {
        const year = book.publishedDate.substring(0,4);
        yearsSet.add(year);
      }
    });
    // Ordena os anos cronologicamente
    const yearsArray = [...yearsSet].sort();

    // Cria um conjunto de grupos de categoria presentes nos livros
    const groupsSet = new Set<string>();
    this.booksList.forEach(book => {
      if (book.categories) {
        const groupName = this.resolveCategoryGroup(book.categories);
        groupsSet.add(groupName);
      }
    });
    // Lista de grupos únicos
    const groupsArray = [...groupsSet];

    // Prepara os datasets pro gráfico, um por grupo de categoria
    const datasets = groupsArray.map((groupName, i) => {
      // Conta quantos livros de cada grupo foram publicados por ano
      const dataPerYear = yearsArray.map(year => {
        return this.booksList.filter(b => {
          const hasYear = b.publishedDate?.startsWith(year);
          const catGroup = this.resolveCategoryGroup(b.categories ?? '');
          return hasYear && (catGroup === groupName);
        }).length;
      });

      // Definição de cores pra linhas do gráfico
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

      // Escolhe uma cor ciclicamente baseada no índice do grupo
      const color = borderColors[i % borderColors.length];

      return {
        label: groupName,
        data: dataPerYear,
        fill: false,
        borderColor: color,
        tension: 0.4
      };
    });

    // Monta a configuração final do dataset do gráfico
    this.booksChartDatas = {
      labels: yearsArray,
      datasets
    };

    // Configurações básicas de aparência do gráfico
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

  // Limpa recursos e subscrições quando o componente é destruído
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
