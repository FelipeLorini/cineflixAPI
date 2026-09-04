# CineFlix — Catálogo de Filmes (TMDB)

Aplicação React de catálogo de filmes com dados em tempo real da API TMDB:
destaques, catálogo com filtros, detalhes com trailer e elenco, autenticação,
favoritos e comentários (tudo persistido em `localStorage`).

## Stack

- **React 19** + **TypeScript**
- **TanStack Router** (roteamento type-safe com SSR) e **TanStack Query** (cache/paginação)
- **Axios** para as requisições HTTP à TMDB (+ cache próprio de 5 minutos)
- **Context API**: `AuthContext`, `FavoritesContext`, `CommentsContext`
- **Tailwind CSS v4** com design system em tokens (`src/styles.css`)
- **react-icons** (FontAwesome) e **sonner** (toasts de erro/sucesso)

> Observação: o projeto usa TanStack Router em vez de `react-router-dom` — é o
> roteador oficial desta base de código. Todas as rotas pedidas existem e
> funcionam, com a vantagem de params/search params validados em tempo de compilação.

## Instalação

```bash
bun install     # ou: npm install
bun run dev     # sobe em http://localhost:8080
bun run build   # build de produção
```

## Configuração da API

A chave pública da TMDB fica em `src/services/api.ts`:

```
Base URL: https://api.themoviedb.org/3
API Key:  328e30d97723b14cb927d5adfc722139
Idioma:   pt-BR
```

Para usar variável de ambiente, crie um `.env` na raiz e troque a constante:

```
VITE_TMDB_API_KEY=328e30d97723b14cb927d5adfc722139
```

```ts
export const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
```

Endpoints usados: `/movie/popular`, `/movie/now_playing`, `/movie/upcoming`,
`/movie/top_rated`, `/movie/{id}`, `/movie/{id}/credits`, `/movie/{id}/videos`,
`/search/movie`, `/discover/movie`, `/genre/movie/list`.

## Rotas

| Rota | Página |
| --- | --- |
| `/` | Home: hero do filme #1 popular, carrossel Top Rated, grids Em Cartaz e Lançamentos |
| `/filmes?categoria=&q=&ano=&genero=` | Catálogo com filtros e "Carregar mais" (20 por página) |
| `/filme/$id` | Detalhes: backdrop, sinopse, elenco (5), trailer YouTube, avaliação, favorito, comentários |
| `/favoritos` | Lista protegida por login, com remoção e compartilhamento |
| `/login` | Login com e-mail, senha e "Lembrar-me" |
| `/registro` | Cadastro com validação |

## Estrutura

```
src/
├── components/
│   ├── layout/      Header, Footer, ProtectedRoute
│   ├── common/      MovieCard, MovieCarousel, SearchBar, LoadingSpinner, RatingStars, ErrorMessage
│   └── forms/       LoginForm, RegisterForm, CommentForm
├── context/         AuthContext, FavoritesContext, CommentsContext
├── hooks/           useDebounce (500ms), useLocalStorage
├── services/        api.ts (axios + cache 5min), movieService.ts
├── utils/           constants.ts, helpers.ts
├── routes/          __root.tsx, index.tsx, filmes.tsx, filme.$id.tsx, favoritos.tsx, login.tsx, registro.tsx
└── styles.css       design system (tema escuro, tokens oklch)
```

## Regras de negócio implementadas

1. Busca com **debounce de 500ms** e sugestões instantâneas no header.
2. **Cache de 5 minutos** por requisição (chave = endpoint + params).
3. Paginação de **20 filmes** por carregamento ("Carregar mais").
4. Favoritos e comentários persistidos em `localStorage`, separados por usuário.
5. Login obrigatório para favoritar, comentar e abrir `/favoritos`.
6. Compartilhamento da lista: texto com todos os títulos + link com os IDs
   (`/favoritos?ids=1,2,3`), via Web Share API ou cópia para a área de transferência.
7. Erros de rede/API exibem toast com mensagem amigável em português, além de
   botão "Tentar novamente".

## Design

Tema escuro: `#1a1a2e` (fundo), `#16213e` (cards), `#0f3460` (destaque),
`#e94560` (ações). Tipografia Poppins. Layout mobile-first com breakpoints em
768px e 1024px, animações de fade-in/rise, hover scale e skeletons de carregamento.
