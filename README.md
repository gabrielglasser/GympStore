# Gymp Store 🏋️‍♂️💪

Gymp Store é um e-commerce moderno focado na venda de suplementos e acessórios para academia. Nossa plataforma oferece uma experiência intuitiva e dinâmica, permitindo que os usuários encontrem os melhores produtos para potencializar seus resultados.

## 🚀 Tecnologias Utilizadas

### Frontend
- React
- TypeScript
- Sass para estilização
- Lucide React para ícones
- React Hook Form para formulários
- Zod para validação
- React Hot Toast para notificações
- Axios para requisições HTTP

### Backend
- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT para autenticação
- Bcrypt para criptografia
- Express Validator
- Multer para upload de arquivos
- Cors

## 📌 Funcionalidades Principais

✔️ Autenticação e autorização de usuários  
✔️ Catálogo de produtos com filtros e busca  
✔️ Gerenciamento de carrinho de compras  
✔️ Sistema de endereços  
✔️ Checkout seguro  
✔️ Painel administrativo  (em desenvolvimento)
✔️ Upload e gerenciamento de imagens  
✔️ Design responsivo  

## 🛠️ Como Rodar o Projeto

### Pré-requisitos
- Node.js 18 ou superior
- PostgreSQL 14 ou superior
- Git

### Configuração do Backend

1. Clone o repositório:
```bash
git clone https://github.com/gabrielglasser/GympStore.git
cd GympStore/backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```
Edite o arquivo `.env` com suas configurações locais

4. Execute as migrações do banco de dados:
```bash
npx prisma migrate dev
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

### Configuração do Frontend

1. Acesse a pasta do frontend:
```bash
cd ../frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```
Edite o arquivo `.env.local` com suas configurações

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## 📝 Scripts Disponíveis

### Backend
- `npm run dev`: Inicia o servidor em modo desenvolvimento
- `npm run build`: Compila o projeto
- `npm start`: Inicia o servidor em modo produção
- `npm run test`: Executa os testes
- `npm run lint`: Executa o linter

### Frontend
- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Gera build de produção
- `npm start`: Inicia o servidor em modo produção
- `npm run lint`: Executa o linter

## 🌐 Endpoints da API

A documentação completa da API está disponível em `http://localhost:8000/api-docs` após iniciar o servidor.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte, envie um email para gbsantos.dev@gmail.com ou abra uma issue no repositório.
