# Curuja's Game Screen

Crie um site de portfólio de uma única página (single page, com rolagem suave entre as seções) para um editor de vídeo freelancer chamado "Curuja". O site serve para atrair clientes internacionais, então TODO o texto visível no site deve estar em inglês. O estilo visual é CARTOON + VIDEOGAME: o site deve parecer a tela de título e as fases de um jogo de plataforma, com contornos grossos, cores vivas, sombras duras e elementos de HUD (corações, moedas, conquistas, inventário).

## 1. Stack e regras gerais
- Use React + Vite + TypeScript + Tailwind CSS + shadcn/ui (padrão do Lovable). NÃO use backend, banco de dados nem Supabase por enquanto.
- Não adicione bibliotecas de animação. Use apenas CSS/Tailwind (keyframes) e IntersectionObserver para as animações de entrada ao rolar a página.
- Layout 100% responsivo (mobile first). Botões e áreas clicáveis com no mínimo 44px de altura.
- Acessibilidade: bom contraste, foco visível (contorno grosso amarelo + preto), textos alternativos, navegação por teclado, aria-labels, e respeitar prefers-reduced-motion (desligar animações nesse caso).
- NÃO invente números, clientes, marcas ou depoimentos falsos. Onde faltar conteúdo real, use placeholders claramente editáveis.
- NÃO use logos, texturas, personagens ou assets do Minecraft, da Adobe ou de qualquer jogo/marca. Todo o visual de "game" deve ser original e genérico (pixel art, arcade, jogo de plataforma). Para os softwares, use ícones genéricos (ex.: lucide-react: Film, Sparkles) e o nome do programa em texto.

## 2. Design system
Defina tudo como tokens semânticos (CSS variables em index.css e tailwind.config.ts). NÃO use cores soltas dentro dos componentes.

Cores:
- ink (contornos e texto): #1B1B2F
- cream (fundo claro): #FFF6E0
- sky (azul céu): #4CC9F0
- sunny (amarelo): #FFD23F
- coral (rosa/vermelho): #FF4D6D
- grass (verde): #3DDC84
- grape (roxo): #7B2FF7
Regra de contraste: texto ink sobre sky, sunny, grass, coral e cream; texto cream sobre grape e sobre ink.

Tipografia (Google Fonts):
- Títulos: "Lilita One" (grande, com contorno ink e sombra dura)
- Texto: "Fredoka" (400, 500, 600)
- Detalhes pixel (rótulos pequenos, HUD): "Press Start 2P", usada pouco e em tamanho pequeno (10 a 12px) para não prejudicar a leitura

Estilo cartoon (crie classes utilitárias reutilizáveis):
- .cartoon-border: borda sólida de 4px na cor ink, cantos bem arredondados (rounded-2xl)
- .cartoon-shadow: sombra dura sem desfoque (6px 6px 0 ink). No hover o elemento sobe um pouco e a sombra aumenta. No clique ele "afunda" (translate 4px) e a sombra some
- .sticker: leve rotação (-2° a 2°) nos cards, como adesivos
- .halftone: fundo com bolinhas estilo história em quadrinhos (radial-gradient)
- .burst: forma de explosão de quadrinhos (clip-path) para selos como "NEW!"
- Botões: grandes, coloridos, texto em caixa alta, borda ink e sombra dura (estilo botão de arcade)

Animações (só CSS): float (flutuar suave), wiggle (balançar no hover), blink (piscar), pop-in (aparecer com um pulinho ao entrar na tela), bounce (moedas).

Divisores entre as seções: faixas onduladas ou em "escadinha" de pixels, em SVG, mudando a cor de fundo a cada seção, como se o jogador passasse de fase.

## 3. Estrutura da página (cada seção é uma "fase" com fundo próprio)

### 3.1 Navbar (HUD fixo no topo, fundo cream, borda inferior ink)
- Esquerda: logo com o mascote coruja cartoon + o texto "CURUJA".
- Links em forma de botões de menu de jogo: "START" (home), "LEVELS" (portfólio), "SKILLS", "SERVICES", "PLAYER" (about), "CONTACT". O link ativo fica destacado conforme a rolagem.
- Botão amarelo destacado "HIRE ME" que rola até o contato.
- No mobile: botão de menu que abre um "pause menu" em tela cheia, com os links grandes empilhados.

### 3.2 Hero, a tela de título (fundo sky)
- Fundo: céu azul com nuvens de pixel flutuando devagar, estrelinhas, e na base uma faixa de chão de jogo de plataforma (grama verde + terra), genérica.
- Título gigante estilo logo de jogo: "CURUJA" com contorno ink grosso e sombra dura. Logo abaixo, "VIDEO EDITOR" em uma faixa amarela levemente inclinada.
- Subtítulo: "I turn raw footage into punchy, game-ready edits."
- Etiquetas de texto com os softwares: "Premiere Pro" e "After Effects".
- Texto piscando: "PRESS START".
- Dois botões: "▶ START A PROJECT" (rola até o contato) e "WATCH MY WORK" (rola até o portfólio).
- Mascote coruja cartoon grande, com fones de ouvido de gamer, flutuando ao lado do título. Crie como SVG original e simples (formas geométricas básicas). Espalhe moedas e corações de pixel flutuando.
- Abaixo, um player de vídeo no estilo TV/console retrô para o showreel: iframe do YouTube (use youtube-nocookie.com) controlado por uma constante SHOWREEL_YOUTUBE_ID. Enquanto a constante estiver vazia, mostre uma tela de TV com chiado colorido e o texto "SHOWREEL LOADING...".

### 3.3 Portfólio: "SELECT YOUR LEVEL" (fundo cream com .halftone)
- Título "SELECT YOUR LEVEL" e subtítulo "Pick a video and hit play."
- Filtros em formato de abas/botões arcade, gerados automaticamente a partir das categorias que existem nos dados (mais a aba "ALL"). Categoria sem vídeos não aparece.
- Grid responsivo de cards (1 coluna no mobile, 2 no tablet, 3 no desktop). Cada card parece um cartucho/cartão de fase: miniatura 16:9 com borda ink, número da fase ("LEVEL 01"), título, selo da categoria e um botão de play que pulsa no hover.
- Ao clicar, abre um modal estilo cinema (shadcn Dialog) com o vídeo do YouTube embutido (autoplay ao abrir), o título e um botão "CLOSE". Também fecha com a tecla Esc.
- Miniatura: se o item tiver youtubeId, use https://img.youtube.com/vi/{youtubeId}/hqdefault.jpg. Se não tiver, use um placeholder colorido com padrão de pixels e ícone de play.
- Todos os vídeos ficam em UM único arquivo: src/data/videos.ts, com a estrutura { id, title, category, youtubeId?, description? }. Crie 6 exemplos de placeholder com títulos como "Project Title 01", nas categorias "Minecraft Re-edits" (a principal, nos 3 primeiros), "Gameplay Edits" e "Shorts". Deixe um comentário no arquivo explicando onde trocar pelos vídeos reais.

### 3.4 Skills: "ACHIEVEMENTS" (fundo grape)
- Grid de conquistas em formato de troféu/medalha, cada uma com ícone, nome e descrição curta. Desbloqueadas:
  "Smooth Cuts" (fast, clean pacing), "Motion Graphics" (animation with After Effects), "Sound & SFX" (punchy sound design), "Color & Mood" (grading and style), "Captions" (clear, stylish subtitles).
- Inclua 2 conquistas bloqueadas, com cadeado, "???" e o texto "Unlocking soon".
- Abaixo, um "INVENTORY": slots de inventário (quadrados com borda ink) com os softwares Premiere Pro e After Effects preenchidos (ícone genérico + nome em texto) e alguns slots vazios.
- Dados das conquistas em src/data/skills.ts para eu editar fácil.

### 3.5 Services: "CHOOSE YOUR PACK" (fundo sunny)
- Cards no estilo "seleção de personagem", cada um com avatar/ícone cartoon, nome e descrição curta:
  1. "Gaming Re-edits": punchy edits of gameplay clips with effects and sound.
  2. "Short-form Content": vertical edits for Shorts, Reels and TikTok.
  3. "YouTube Videos": full edits with pacing, captions and polish.
  4. "Motion & Effects": custom animations and effects made in After Effects.
- NÃO mostre preços. Cada card tem um botão "GET A QUOTE" que rola até o contato e já seleciona o serviço no formulário.

### 3.6 Process: "HOW THE GAME WORKS" (fundo grass)
- Caminho de fase estilo mapa de jogo, com 4 checkpoints (bandeirinhas) ligados por uma linha tracejada: "1. Send your footage", "2. First cut", "3. Feedback round", "4. Final delivery". Cada checkpoint com um ícone e uma frase curta.

### 3.7 About: "PLAYER PROFILE" (fundo coral, conteúdo em cartão cream)
- Cartão de personagem de jogo: avatar do mascote, nome "Curuja", classe "Video Editor" e atributos: "Main tools: Premiere Pro, After Effects", "Specialty: Gaming content", "Availability: Remote, worldwide".
- Texto em inglês: "Hey! I'm Curuja, a video editor who loves gaming content. I use Premiere Pro and After Effects to make fast, fun and polished edits that keep viewers watching until the end. Got a project in mind? Let's team up!"

### 3.8 Contact: "READY PLAYER 2?" (fundo ink, céu noturno com estrelas piscando)
- Subtítulo: "Tell me about your project and let's build something awesome."
- Formulário em estilo cartoon (react-hook-form + zod) com: nome, e-mail, tipo de projeto (select com os 4 serviços + "Other") e mensagem. Validação com mensagens amigáveis.
- Ao enviar, abra o app de e-mail do usuário com mailto: para a constante CONTACT_EMAIL (valor de exemplo: seuemail@exemplo.com, fácil de trocar), com assunto e corpo preenchidos, e mostre um toast: "Quest accepted! Opening your email app…".
- Ao lado do formulário, botões de contato rápido: X (Twitter) com o texto "DM me on X @CurujaEdits" apontando para https://x.com/CurujaEdits, e-mail, e placeholders para Discord e YouTube (links em constantes).

### 3.9 Footer
- Frase: "GAME OVER? Never. Let's play again."
- Links sociais, "© Curuja" com o ano atual automático e um botão "BACK TO TOP" com seta/foguete.

## 4. SEO e finalização
- Title: "Curuja | Video Editor for Gaming & Creators". Meta description em inglês, tags Open Graph e favicon com a coruja (SVG).
- Rolagem suave, animação de entrada em cada seção, cursor pointer em tudo que for clicável.
- Organize em componentes pequenos (Navbar, Hero, Portfolio, VideoCard, VideoModal, Skills, Services, Process, About, Contact, Footer) e mantenha todos os textos/dados editáveis em src/data/.
- Antes de finalizar, confira o layout no celular e no desktop e corrija textos cortados ou sobrepostos.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c59a524e-da08-462e-8c13-6debf71f4090).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
