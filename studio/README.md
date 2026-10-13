# studio

Site de portfólio estático com as funcionalidades típicas de um portfólio de estúdio: shell de UI persistente, transição de página sem recarregar, thumb que segue o cursor na lista de trabalhos, tema claro/escuro, preloader e páginas de case study.

É uma implementação própria — código, CSS, tipografia (Google Fonts) e conteúdo são deste repositório. Nada é copiado de outro site; o conteúdo vem dos projetos reais em `data/content.js`.

## Rodar

```bash
node studio/server.js          # http://localhost:4321
node studio/server.js 8080     # outra porta
```

O roteador usa `fetch` + History API, então o site precisa de HTTP. Abrir `index.html` via `file://` funciona, mas sem as transições — cada link vira navegação normal do navegador (degradação intencional).

## Gerar as páginas

Todo o HTML é gerado a partir de um único arquivo de conteúdo:

```bash
node studio/build.js
```

Isso reescreve `index.html`, `about/`, `journal/`, `404.html` e um `work/<slug>/index.html` por projeto.

## Estrutura

```
studio/
├── build.js            gerador estático (templates + shell de UI)
├── server.js           servidor de desenvolvimento, sem dependências
├── data/content.js     ÚNICA fonte de conteúdo: site, projetos, diário
├── css/app.css         tokens, shell, páginas, movimento, responsivo
├── js/app.js           runtime: roteador, stage, cursor, tema, preloader
├── img/                imagens locais
├── index.html          ─┐
├── about/              ─┤ gerados — não editar à mão
├── journal/            ─┤
├── work/<slug>/        ─┤
└── 404.html            ─┘
```

## Funcionalidades

| Recurso | Onde | Observação |
| --- | --- | --- |
| Transição entre páginas | `js/app.js` → `router` | fetch + DOMParser, troca só o `#router`; cortina em 5 faixas; prefetch no hover; `popstate` tratado |
| Thumb que segue o cursor | `router` → `workStage` | uma `<img>` por projeto, pré-carregada; posição com lerp e inclinação 3D proporcional à velocidade |
| Tema claro/escuro | `theme` | persistido em `localStorage`, com script inline no `<head>` para não piscar; respeita `prefers-color-scheme` quando nunca foi alternado |
| Cursor customizado | `cursor` | só em ponteiro fino; cresce sobre links e botões |
| Preloader | `preloader` | progresso real pelas imagens pendentes, com teto de 6s para rede lenta |
| Revelação por rolagem | `reveals` | `IntersectionObserver`, atraso escalonado por índice |
| Paralaxe nas capturas | `parallax` | leitura de layout agrupada em um único `requestAnimationFrame` |
| Menu mobile | `menu` | folha em tela cheia, fecha no `Esc` e ao navegar |
| Case study | `build.js` → `workPage` | hero, metadados, capturas, link “ver no ar”, próximo projeto em ciclo |

## Acessibilidade e degradação

- Link “pular para o conteúdo”, `aria-current` na navegação e foco movido para o `<main>` após cada transição.
- `prefers-reduced-motion: reduce` desliga cortina, paralaxe, grão e cursor, e reduz as transições a ~0.
- `@media (hover: none)`: a lista com thumb flutuante é substituída por uma grade de miniaturas.
- Sem JavaScript: todas as páginas são HTML estático completo e os links funcionam normalmente.
- Falha de rede no roteador cai para `location.href`, sem engolir o clique.

## Editar conteúdo

Mexa em `data/content.js` e rode `node studio/build.js`. Campos de um projeto:

```js
{
  slug: "meu-projeto",      // vira work/meu-projeto/
  title, subtitle, year,
  client, role,
  stack: ["..."],           // também alimenta a lista de stack em /about
  live: "https://...",      // vazio esconde o botão "ver no ar"
  cover: "img/x.png",       // relativa (prefixada no build) ou URL absoluta
  tags: ["..."],            // aparece na lista da home
  intro: "...",
  sections: [{ heading, body }],
  shots: ["..."]            // opcional; usa a capa se omitido
}
```
