# Waslaa — Landing Page

Landing page estática da Waslaa: informação acessível em tempo real.  
Stack: HTML, CSS e JavaScript Vanilla (sem build, sem framework). Dados de demonstração ficam no `localStorage` do navegador.

## Estrutura

```
index.html      # Página principal
style.css       # Estilos
script.js       # Interações, tema, formulários e localStorage
i18n.js         # Traduções (pt-BR, es-CL, en-US)
assets/         # Imagens e logos
project.json    # Metadados do projeto
```

## Como executar localmente

Qualquer servidor HTTP estático na raiz do projeto:

```bash
# Python 3
python3 -m http.server 8080

# Node (npx)
npx --yes serve -l 8080
```

Abra `http://localhost:8080` no navegador.

Também é possível abrir `index.html` diretamente no navegador; um servidor local evita restrições de alguns recursos.

## Publicar como site estático

Publique a pasta inteira do projeto (exceto `.git` e arquivos ignorados) em qualquer host de arquivos estáticos, por exemplo:

- **GitHub Pages**: Settings → Pages → Branch `main` / pasta `/` (raiz)
- **Netlify / Cloudflare Pages / Vercel**: arraste a pasta ou conecte o repositório; pasta de publicação = raiz (sem comando de build)
- **Qualquer CDN/S3**: faça upload de `index.html`, `*.css`, `*.js` e `assets/`

Não há etapa de build (`npm install` / bundler). O `index.html` na raiz é o ponto de entrada.

## Funcionalidades locais

- Tema claro/escuro e escala de texto (persistidos em `localStorage`)
- Seletor de idioma
- Formulários de contato/CTA com leads salvos no navegador

## Licença / uso

Código e assets do mockup institucional Waslaa. Ajuste conforme a política da organização antes de publicar em produção.
