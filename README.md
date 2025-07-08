# E-Questions Web

Plataforma de Simulados/Quizzes Online

---

## ✨ Visão Geral

Este projeto é a versão web do E-Questions, uma plataforma de simulados e quizzes focada em concursos e exames. Desenvolvido com [Next.js](https://nextjs.org/), oferece uma experiência moderna, responsiva e intuitiva para usuários realizarem, acompanharem e revisarem seus simulados.

---

## 🚀 Principais Recursos

- Cadastro e login de usuários
- Realização de quizzes/simulados com timer
- Histórico de tentativas e estatísticas
- Visualização de detalhes do quiz
- Políticas de Privacidade e Termos de Uso
- Interface responsiva e moderna
- Navegação rápida e feedback visual

---

## 🛠️ Tecnologias Utilizadas

- [Next.js 14+](https://nextjs.org/)
- React 18+
- CSS Modules
- TypeScript

---

## 📁 Estrutura do Projeto

```
web/
  src/
    app/           # Páginas e rotas (Next.js App Router)
    components/     # Componentes reutilizáveis
    contexts/       # Contextos de autenticação e quiz
    hooks/          # Hooks customizados
    reducers/       # Reducers para estado global
    services/       # Serviços de API e autenticação
    types/          # Tipagens TypeScript
    utils/          # Utilitários
    assets/         # Assets estáticos (textos, imagens, sons)
```

---

## ⚙️ Configuração e Execução Local

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repo>
   cd web
   ```
2. **Instale as dependências:**
   ```bash
   npm install
   # ou
   yarn
   ```
3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env.local` na raiz do projeto com:
   ```env
   NEXT_PUBLIC_API_URL=https://sua-api.com
   ```
   > Esta variável define a URL base da API utilizada pelo frontend.

4. **Execute o projeto em modo desenvolvimento:**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```
   O app estará disponível em [http://localhost:3000](http://localhost:3000).

---

## 🏗️ Build para Produção

1. **Gere o build:**
   ```bash
   npm run build
   # ou
   yarn build
   ```
2. **Inicie em modo produção:**
   ```bash
   npm start
   # ou
   yarn start
   ```

---

## 🔐 Variáveis de Ambiente

- `NEXT_PUBLIC_API_URL` (obrigatória): URL base da API backend.

---

## 📄 Políticas e Termos

- [Política de Privacidade](./src/app/privacy-policy/page.tsx)
- [Termos de Serviço](./src/app/terms-of-service/page.tsx)

---

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

---

## 📝 Licença

Este projeto está sob licença MIT.

---

## 📧 Suporte

Dúvidas ou sugestões? Entre em contato pelo e-mail: suporte@e-questions.com 