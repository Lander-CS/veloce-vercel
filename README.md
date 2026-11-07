# Veloce Motors — versão para Vercel

Site em Next.js, React e TypeScript, com vitrine Three.js e modelo 3D local.
Esta versão é independente do ChatGPT Sites e não exige login no ChatGPT.

## Executar no computador

Instale o Node.js 22 e, dentro da pasta do projeto, execute:

```bash
npm ci
npm run dev
```

Abra http://localhost:3000.

## Publicar na Vercel

1. Extraia o ZIP.
2. Crie um repositório no GitHub e envie o conteúdo da pasta `veloce-vercel`. O `package.json` deve ficar na raiz do repositório.
3. Na Vercel, escolha **Add New → Project** e importe esse repositório.
4. Use o framework **Next.js**, Node.js **22.x** e a pasta raiz que contém `package.json`.
5. Instalação: `npm ci`. Build: `npm run build`. Deixe o diretório de saída no padrão do Next.js.
6. Clique em **Deploy**. Não são necessárias variáveis de ambiente.

Alternativa pelo terminal, sem criar repositório:

```bash
npx vercel
```

Após revisar a prévia, publique em produção:

```bash
npx vercel --prod
```

## O que está incluído

- Layout responsivo e catálogo demonstrativo com busca, filtros, ordenação e favoritos da sessão.
- Modal de detalhes e simulação financeira ilustrativa.
- Modelo 3D Car Concept em `public/models/car-concept.glb`, com texturas incorporadas.
- Rotação, cores e vistas frontal/perspectiva em navegadores com WebGL.
- Imagem alternativa do próprio modelo para navegadores sem WebGL.

## Personalizar

- Marca, textos, veículos, valores e formulário: `app/page.tsx`.
- Título e descrição: `app/layout.tsx`.
- Cores, fontes e responsividade: `app/globals.css`.
- Modelo, câmera e iluminação: `app/scene.tsx`.
- Créditos e licença: `public/models/CREDITS.md` e `LICENSE-CarConcept.md`.

Preserve os créditos do modelo ao redistribuir o site.

## Estado atual da demonstração

Estoque, valores e financiamento são ilustrativos. O formulário não envia nem salva dados; WhatsApp, CRM e recebimento de contatos ainda precisam ser conectados ao atendimento real. Os favoritos ficam apenas na sessão atual.

Fotos do catálogo usam URLs do Unsplash e as fontes usam Google Fonts; ambos precisam de internet. O arquivo 3D está incluído e não depende de um servidor de modelos externo.

O projeto não inclui credenciais, banco de dados, autenticação ou integrações privadas.
