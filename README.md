# Dinamicas Cristas v1

Aplicacao web para gerar dinamicas cristas com filtros, detalhes e bonus (datas especiais, perguntas, emergencia e grupos dificeis).

## Requisitos

- VPS Linux com acesso `sudo`
- Node.js 20+ e npm
- Nginx

## Estrutura do projeto

- `web`: frontend React + Vite
- `dinamics.json`: base principal de dinamicas consumida pelo app

## Instalacao na VPS (producao)

### 1) Preparar servidor

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx curl
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

### 2) Enviar projeto para a VPS

Voce pode usar `git clone`, `scp` ou upload via painel da sua hospedagem.  
Exemplo com `scp` (rodar no seu computador local):

```bash
scp -r ./dinamicas-cristas-v1 usuario@IP_DA_VPS:/var/www/
```

### 3) Instalar dependencias e gerar build

```bash
cd /var/www/dinamicas-cristas-v1/web
npm install
npm run build
```

Ao final, os arquivos estaticos ficarao em `web/dist`.

### 4) Configurar Nginx

Crie o arquivo:

```bash
sudo nano /etc/nginx/sites-available/dinamicas-cristas
```

Conteudo:

```nginx
server {
    listen 80;
    server_name SEU_DOMINIO_OU_IP;

    root /var/www/dinamicas-cristas-v1/web/dist;
    index index.html;

    location / {
        try_files $uri /index.html;
    }
}
```

Ative o site e reinicie o Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/dinamicas-cristas /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5) Atualizar quando houver mudancas

```bash
cd /var/www/dinamicas-cristas-v1/web
npm install
npm run build
sudo systemctl reload nginx
```

## Como adicionar mais dinamicas

As dinamicas do app ficam em `dinamics.json` (raiz do projeto).  
Cada item e um objeto JSON com campos como:

- `id` (numero unico)
- `title`
- `slug` (unico, sem espacos, ex: `cordao-da-uniao`)
- `summary`
- `objective`
- `materials` (texto separado por virgula, ex: `"papel, caneta, fita"`)
- `steps` (texto com passos numerados: `1. ... 2. ... 3. ...`)
- `verse`
- `meeting_type`
- `audience_type`
- `min_people` / `max_people`
- `duration_minutes`
- `energy_level`
- `difficulty_level`
- `is_emergency` (`true` ou `false`)
- `is_featured` (`true` ou `false`)
- `active` (`true` para aparecer no app)

Exemplo minimo:

```json
{
  "id": 999,
  "title": "Minha Dinamica",
  "slug": "minha-dinamica",
  "summary": "Resumo curto",
  "objective": "Objetivo da dinamica",
  "materials": "papel, caneta",
  "steps": "1. Primeiro passo. 2. Segundo passo.",
  "verse": "Joao 3:16",
  "meeting_type": "grupo pequeno",
  "audience_type": "todos",
  "min_people": 5,
  "max_people": 20,
  "duration_minutes": 12,
  "energy_level": "baixo",
  "difficulty_level": "facil",
  "bonus_category_id": null,
  "is_emergency": false,
  "is_featured": false,
  "active": true,
  "created_at": "2026-03-27",
  "updated_at": "2026-03-27"
}
```

Depois de editar:

```bash
cd web
npm run build
```

## Como colocar dinamicas em Datas Especiais

A aba "Datas especiais" encontra dinamicas por palavras-chave no texto da dinamica (titulo, resumo, objetivo, versiculo e passos).

Para sua dinamica aparecer nessa secao:

1. Inclua termos de data especial no conteudo, por exemplo: `Natal`, `Pascoa`, `Dia das Maes`, `Congresso`, `Retiro`, `Especial`.
2. Coloque essas palavras no `title`, `summary` ou `objective` para facilitar o match.
3. Opcional: marque `is_featured: true` para aumentar relevancia em listas de fallback.

Exemplo de titulo/summary:

- `title`: `Quebrando o Gelo de Natal`
- `summary`: `Dinamica para celulas e cultos de Natal, com foco em gratidao.`

## Como colocar perguntas em "50 Perguntas"

As perguntas da aba "Perguntas" nao vem do `dinamics.json`.  
Elas estao no arquivo:

- `web/src/features/bonuses/BonusQuestions.tsx`

Para adicionar:

1. Abra o array `QUESTIONS`.
2. Inclua sua nova string no array.
3. Salve e rode o build.

Exemplo:

```ts
const QUESTIONS = [
  // ...
  "Qual area da sua vida Deus esta pedindo obediencia hoje?",
]
```

## Como adicionar em Grupos Especiais (Grupos Dificeis)

A aba "Grupos dificeis" usa dinamicas de `dinamics.json` com esta regra:

- `energy_level === "baixo"` **ou** `difficulty_level === "facil"`

Para uma dinamica aparecer nessa secao:

1. Defina `energy_level` como `baixo` e/ou `difficulty_level` como `facil`.
2. No texto (`title`, `summary`, `objective`), descreva contexto util para busca (ex: timidez, dispersao, ansiedade, gelo, integracao).
3. Mantenha `active: true`.

## Dicas importantes

- Sempre mantenha `slug` unico.
- Nao repita `id`.
- Use passos numerados no campo `steps` (`1.`, `2.`, `3.`...) para renderizar corretamente.
- Se uma dinamica "sumir", verifique se `active` esta `true`.
- Depois de qualquer alteracao de conteudo, rode novo `npm run build`.
