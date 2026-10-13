// Fonte única de conteúdo do site. O build.js consome este arquivo
// e gera o HTML estático de todas as páginas.

const site = {
  name: "Luis H.",
  role: "Desenvolvedor front-end",
  tagline: "Direção técnica, front-end e interfaces animadas.",
  location: "Remoto — Brasil",
  email: "ti.brl.edu@gmail.com",
  year: new Date().getFullYear(),
  services: [
    "Direção técnica",
    "Desenvolvimento front-end",
    "Interfaces animadas",
    "Integração de APIs",
  ],
  social: [
    { label: "GitHub", url: "https://github.com/luishdsg" },
    { label: "LinkedIn", url: "https://www.linkedin.com/" },
    { label: "E-mail", url: "mailto:ti.brl.edu@gmail.com" },
  ],
  stats: [
    { label: "Projetos publicados", value: "12" },
    { label: "Anos de prática", value: "04" },
    { label: "Stacks principais", value: "06" },
  ],
};

const projects = [
  {
    slug: "sea-black",
    title: "Sea Black",
    subtitle: "Cadastro e classificação de funcionários",
    year: "2026",
    client: "Projeto próprio",
    role: "Front-end · Modelagem de dados",
    stack: ["Next.js", "TypeScript", "Tailwind"],
    live: "https://sea-black.vercel.app/employees",
    cover: "https://i.ibb.co/KpTS6ZQc/Captura-de-Tela-255.png",
    tags: ["Painel", "CRUD"],
    intro:
      "Painel administrativo para cadastrar, classificar e acompanhar equipes. O foco foi reduzir o número de telas necessárias para concluir uma operação de cadastro.",
    sections: [
      {
        heading: "O problema",
        body: "Cadastros de pessoal costumam espalhar campos obrigatórios por várias etapas, o que aumenta o abandono do formulário. A proposta foi concentrar tudo em uma tabela editável, com validação no próprio campo.",
      },
      {
        heading: "Solução",
        body: "Tabela virtualizada com edição inline, estados otimistas e desfazer. A classificação por cargo é calculada no cliente para manter a filtragem instantânea, sem viagem ao servidor.",
      },
    ],
  },
  {
    slug: "wordtree",
    title: "WordTree",
    subtitle: "Analisador de hierarquia de palavras",
    year: "2026",
    client: "Projeto próprio",
    role: "Front-end · Algoritmo",
    stack: ["JavaScript", "Canvas", "Vite"],
    live: "https://wordtree2.vercel.app/",
    cover: "https://i.ibb.co/WpBt7syz/Captura-de-tela-2026-08-29-082711.png",
    tags: ["Visualização", "Algoritmo"],
    intro:
      "Ferramenta que monta a árvore hierárquica de um conjunto de palavras e desenha as relações em tempo real conforme o texto é digitado.",
    sections: [
      {
        heading: "Estrutura",
        body: "O texto é tokenizado e convertido em um grafo acíclico; os nós recebem peso por frequência e profundidade. O layout usa um algoritmo de tensão simples, com passo fixo para manter 60fps.",
      },
      {
        heading: "Render",
        body: "Desenho em canvas 2D com camada separada para rótulos, evitando recalcular métricas de texto a cada quadro.",
      },
    ],
  },
  {
    slug: "superheroe",
    title: "Superheroe",
    subtitle: "Classificador de heróis",
    year: "2026",
    client: "Projeto próprio",
    role: "Front-end · Consumo de API",
    stack: ["React", "REST", "CSS Modules"],
    live: "https://superheroe.vercel.app/",
    cover: "https://i.ibb.co/5WLyLmQ3/Captura-de-Tela-249.png",
    tags: ["API", "Interface"],
    intro:
      "Interface de busca e comparação que classifica personagens por atributos, com cache local das consultas para tornar a navegação de volta instantânea.",
    sections: [
      {
        heading: "Busca",
        body: "Entrada com debounce, cancelamento de requisições em voo e cache por chave de consulta. Resultados anteriores continuam visíveis enquanto a próxima página carrega.",
      },
      {
        heading: "Comparação",
        body: "Barras de atributo normalizadas pelo maior valor do conjunto selecionado, para que a leitura relativa funcione com qualquer combinação.",
      },
    ],
  },
  {
    slug: "xadrez",
    title: "Xadrez",
    subtitle: "Tabuleiro jogável — em desenvolvimento",
    year: "2026",
    client: "Projeto próprio",
    role: "Front-end · Regras de jogo",
    stack: ["TypeScript", "Canvas"],
    live: "https://xadrez-rho.vercel.app/",
    cover: "img/tgt.png",
    tags: ["Jogo", "Estado"],
    intro:
      "Implementação das regras de xadrez a partir do zero: geração de movimentos legais, detecção de xeque e histórico navegável de lances.",
    sections: [
      {
        heading: "Motor",
        body: "Representação do tabuleiro em array plano de 64 posições, geração de movimentos por peça e filtro final que descarta lances que deixam o rei em xeque.",
      },
      {
        heading: "Em aberto",
        body: "Falta cobrir en passant em notação, promoção com escolha de peça e empate por repetição tripla.",
      },
    ],
  },
  {
    slug: "funtools",
    title: "Fun Tools",
    subtitle: "Pacote de utilitários de interface",
    year: "2026",
    client: "Projeto próprio",
    role: "Front-end",
    stack: ["JavaScript", "CSS"],
    live: "https://funtools.vercel.app/",
    cover: "https://i.ibb.co/3YLb1bh9/Captura-de-Tela-248.png",
    tags: ["Ferramentas", "Experimento"],
    intro:
      "Coleção de pequenas ferramentas — conversores, geradores e medidores — reunidas em uma única casca de navegação com atalhos de teclado.",
    sections: [
      {
        heading: "Arquitetura",
        body: "Cada ferramenta é um módulo isolado registrado em um índice; a casca carrega sob demanda e mantém o estado na URL, então qualquer ferramenta é compartilhável por link.",
      },
    ],
  },
  {
    slug: "gommes",
    title: "Gommes",
    subtitle: "Portfólio — segunda versão",
    year: "2026",
    client: "Projeto próprio",
    role: "Design · Front-end",
    stack: ["HTML", "CSS", "GSAP"],
    live: "https://gommes.vercel.app/",
    cover: "https://i.ibb.co/Xrd6C9p2/Captura-de-Tela-250.png",
    tags: ["Portfólio", "Animação"],
    intro:
      "Segunda iteração do portfólio pessoal, focada em transição de página e revelação de conteúdo por rolagem.",
    sections: [
      {
        heading: "Movimento",
        body: "Cortina de transição entre rotas, revelação por linha nos títulos e paralaxe leve nas imagens. Todo o movimento respeita prefers-reduced-motion.",
      },
    ],
  },
  {
    slug: "mks-sistemas",
    title: "MKS Sistemas",
    subtitle: "E-commerce de catálogo e carrinho",
    year: "2026",
    client: "Projeto próprio",
    role: "Front-end · Estado global",
    stack: ["React", "Redux", "Styled"],
    live: "https://mkssistemas.vercel.app",
    cover: "img/myeshop.png",
    tags: ["E-commerce", "Carrinho"],
    intro:
      "Vitrine com carrinho persistente, variações de produto e cálculo de total no cliente.",
    sections: [
      {
        heading: "Carrinho",
        body: "Estado normalizado por id de variação, persistência em storage com versionamento de schema e reconciliação quando o preço muda entre sessões.",
      },
    ],
  },
  {
    slug: "puzzle",
    title: "Puzzle",
    subtitle: "Mini-game de enigmas",
    year: "2026",
    client: "Projeto próprio",
    role: "Front-end · Game design",
    stack: ["JavaScript", "CSS"],
    live: "https://eight-sandy.vercel.app/",
    cover: "img/bol.png",
    tags: ["Jogo", "Puzzle"],
    intro:
      "Sequência de enigmas curtos com progressão salva localmente e dicas liberadas por tempo.",
    sections: [
      {
        heading: "Progressão",
        body: "Cada fase declara condição de vitória e validador próprio; o motor só conhece a interface, o que torna a adição de uma fase nova um arquivo isolado.",
      },
    ],
  },
  {
    slug: "imovestock",
    title: "ImoveStock",
    subtitle: "Listagem e filtro de imóveis",
    year: "2025",
    client: "Projeto próprio",
    role: "Front-end",
    stack: ["Angular", "SCSS"],
    live: "",
    cover: "img/imovestock.png",
    tags: ["Listagem", "Filtro"],
    intro: "Busca de imóveis com filtros combinados, mapa e lista sincronizados.",
    sections: [
      {
        heading: "Filtros",
        body: "Filtros combinados escritos na query string, com estado derivado em um único seletor para evitar renders duplicados na lista e no mapa.",
      },
    ],
  },
  {
    slug: "mocar",
    title: "Mocar",
    subtitle: "Catálogo automotivo",
    year: "2025",
    client: "Projeto próprio",
    role: "Front-end",
    stack: ["Vue", "Vite"],
    live: "",
    cover: "img/mocar.png",
    tags: ["Catálogo"],
    intro: "Catálogo de veículos com comparação lado a lado e galeria por item.",
    sections: [
      {
        heading: "Comparação",
        body: "Tabela de atributos que destaca apenas as linhas em que os veículos selecionados divergem, reduzindo o ruído visual da comparação.",
      },
    ],
  },
];

const journal = [
  {
    slug: "transicoes-sem-framework",
    title: "Transições de página sem framework",
    date: "2026-09-18",
    excerpt:
      "Como a History API, um fetch e um DOMParser cobrem quase tudo o que um roteador SPA faz em um site de conteúdo.",
  },
  {
    slug: "movimento-acessivel",
    title: "Movimento que não atrapalha",
    date: "2026-08-02",
    excerpt:
      "prefers-reduced-motion não é um detalhe de acessibilidade: é o caminho mais curto para um site que continua usável em máquina fraca.",
  },
  {
    slug: "cursor-custom",
    title: "O custo real de um cursor customizado",
    date: "2026-06-11",
    excerpt:
      "Quando vale, quando não vale, e como não quebrar a navegação por teclado no caminho.",
  },
  {
    slug: "imagens-que-pesam",
    title: "Imagens que pesam mais que o JavaScript",
    date: "2026-04-27",
    excerpt:
      "Um inventário honesto do que carrega em um portfólio médio e o que dá para cortar sem perder o impacto.",
  },
];

module.exports = { site, projects, journal };
