# Edital em Questão

Simulador de questões para concursos públicos.

## Tecnologias

- Next.js 14
- React 18
- TypeScript
- CSS Modules

## Requisitos

- Node.js 18 ou superior
- npm ou yarn

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/edital-em-questao.git
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env.local` na raiz do projeto com:
```
NEXT_PUBLIC_API_URL=https://api.editalemquestao.com.br
```

## Desenvolvimento

Para iniciar o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

## Build e Deploy

1. Build do projeto:
```bash
npm run build
# ou
yarn build
```

2. Iniciar em produção:
```bash
# Para desenvolvimento local
npm run start
# ou
yarn start

# Para produção (com output standalone)
NODE_ENV=production node .next/standalone/server.js
```

## Deploy

O projeto pode ser hospedado em qualquer plataforma que suporte Next.js, como:

- Vercel (recomendado)
- Netlify
- AWS Amplify
- DigitalOcean App Platform

### Deploy na Vercel

1. Crie uma conta na [Vercel](https://vercel.com)
2. Conecte seu repositório GitHub
3. Configure as variáveis de ambiente:
   - `NEXT_PUBLIC_API_URL`: URL da API
4. Clique em Deploy

### Deploy em outros serviços

Para serviços que suportam Docker, você pode usar a configuração standalone:

1. Build do projeto:
```bash
npm run build
```

2. Execute o servidor standalone:
```bash
node .next/standalone/server.js
```

## Estrutura do Projeto

```
src/
  ├── app/                 # Páginas e componentes
  ├── contexts/            # Contextos React
  ├── reducers/            # Reducers
  ├── services/            # Serviços e APIs
  ├── types/               # Tipos TypeScript
  └── styles/              # Estilos globais
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request
