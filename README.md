# 📚 BookBridge

**BookBridge** é uma aplicação web moderna construída com Angular, projetada para visualizar e interagir com dados de livros. A aplicação oferece visualizações gráficas interativas, suporte à alternância de temas (claro/escuro) e cache de dados para desempenho otimizado.

# 🚀 Visão Geral

**BookBridge** consiste em um dashboard para análise de livros, fornecendo:

* **Listagens de Livros** : Exibição eficiente de livros obtidos através de API Google Books, com cache para melhor performance.
* **Visualizações Gráficas** : Gráficos de linha e barras interativos utilizando Chart.js para representar estatísticas dos livros.
* **Suporte a Temas** : Alternância entre modos claro e escuro, respeitando as preferências do usuário e do sistema.
* **Interface Responsiva** : Componentes adaptáveis a diferentes dispositivos e tamanhos de tela.

# 🌟 Principais Funcionalidades

* **Busca e Cache Eficientes** : Integração com APIs de livros e armazenamento em cache utilizando `BehaviorSubject`, evitando chamadas redundantes e melhorando a performance.
* **Gráficos Interativos** : Análise visual de dados como anos de publicação, categorias e tipos de venda com gráficos de linha e barras.
* **Alternância de Temas** : Serviço de tema robusto que permite alternar entre modo claro e escuro, com persistência da escolha do usuário via `localStorage`.
* **Feedback ao Usuário** : Integração com PrimeNG para exibir mensagens e notificações, melhorando a experiência do usuário.

# 🛠️ Stack Tecnológica

* **Framework** : [Angular](https://angular.io/)
* **Linguagem** : [TypeScript](https://www.typescriptlang.org/)
* **Gráficos** : [Chart.js](https://www.chartjs.org/)
* **UI Components** : [PrimeNG]()
* **Reatividade** : [RxJS](https://rxjs.dev/)
* **Gerenciamento de Estado** : Serviços Angular com `BehaviorSubject`

# 📦 Instalação e Configuração

### Pré-requisitos

* [Node.js](https://nodejs.org/) (versão 12 ou superior)
* [Angular CLI]() instalado globalmente

### Passos para Rodar Localmente

1. **Clone o repositório :**
   1.1

   ```
   https://github.com/GustavoDiego/Books-Bridge.git
   ```

   1.2

   ```
   cd bookbridge
   ```
2. **Instale as dependências** :
   2.1

   ```
   npm install 
   ```
3. **Configuração de Ambiente** :
   3.1 Configure as variáveis de ambiente no arquivo `src/environments/environments.ts`
4. **Execute a Aplicação** :

   4.1 `ng serve`

# 🧪 Testes

Para executar os testes unitários:

`ng test`

# 📂 Estrutura do Projeto

src/
├── app/
│   ├── models/
│   │   ├── enums/
│   │   └── model/
│   │       ├── books/
│   │       └── categories/
│   ├── modules/
│   │   ├── books/
│   │   │   ├── components/
│   │   │   │   └── books-table/
│   │   │   └── page/
│   │   │       └── books/
│   │   └── statistics/
│   │       ├── components/
│   │       │   ├── chart-bar/
│   │       │   └── line-chart/
│   │       └── page/
│   │           └── statistics/
│   ├── services/
│   │   ├── book-data-transfer/
│   │   └── theme/
│   └── shared/
│       ├── services/
│       └── components/
│           └── toolbar-navigation/
├── assets/
└── environments/

# 🎨 Personalização de Tema

**BookBridge** suporta alternância entre temas claro e escuro:

* **Toggle Manual** : Controles na interface permitem alternar entre temas.
* **Preferência do Sistema** : O tema inicial respeita a configuração do sistema do usuário.
* **Persistência** : A escolha do usuário é armazenada no `localStorage`, mantendo a preferência em recargas da página.

# 🤝 Contribuição


Contribuições são bem-vindas! Siga estes passos para colaborar:

1. Faça um fork do repositório.
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`).
3. Faça commits com suas alterações (`git commit -am 'Adiciona nova funcionalidade'`).
4. Envie sua branch (`git push origin feature/nova-funcionalidade`).
5. Abra um Pull Request no repositório original.

# 📄 Licença

Este projeto está licenciado sob a [MIT License]().

# 📝 Contato

Para dúvidas ou sugestões, abra uma issue no repositório ou entre em contato pelo email [gustavodiego298]()[@gmail.com]().
