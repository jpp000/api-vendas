# API Vendas

## Descrição
A **API Vendas** é uma aplicação RESTful desenvolvida com **Node.js** e **TypeScript**, projetada para gerenciar pedidos e produtos de maneira eficiente. A API fornece funcionalidades para criação de clientes, gestão de produtos e pedidos, além de controle de estoque. Utiliza-se autenticação via JWT (Json Web Token) para garantir a segurança das rotas.

Este projeto segue os princípios do **SOLID** e adota o **DDD (Domain-Driven Design)**, oferecendo uma estrutura modular e escalável. A arquitetura é dividida em camadas, facilitando a manutenção e expansão da aplicação.

## Tecnologias Utilizadas
- **Node.js**: Plataforma para execução de JavaScript no servidor.
- **Express**: Framework minimalista e flexível para construção de APIs RESTful.
- **TypeScript**: Superset de JavaScript que adiciona tipagem estática opcional ao código.
- **PostgreSQL**: Banco de dados relacional utilizado para persistência de dados.
- **TypeORM**: ORM que facilita a manipulação de dados no banco de forma orientada a objetos.
- **Docker**: Utilizado para containerizar a aplicação e o banco de dados, facilitando a implantação e o ambiente de desenvolvimento.
- **JWT (Json Web Token)**: Sistema de autenticação via token seguro e eficiente.
- **Jest**: Framework de testes utilizado para garantir a qualidade do código, com cobertura de testes unitários e de integração.
- **Tsyringe**: Injeção de dependência para gerenciamento eficaz dos serviços da aplicação.

### Funcionalidades
- **Clientes**: Cadastro, listagem, edição e exclusão de clientes.
- **Produtos**: Gerenciamento de produtos com funcionalidades para criação, atualização de estoque e remoção.
- **Pedidos**: Criação de pedidos, com controle de quantidade e atualização automática do estoque.
- **Autenticação**: Sistema de login e cadastro de usuários, com recuperação de senha e atualização de perfil.

Cada serviço implementado na aplicação possui cobertura de testes unitários com **Jest**, garantindo a qualidade e segurança de todas as funcionalidades principais.

### Implementação de Cache

O **Redis** foi utilizado para gerenciar o cache de dados, especialmente para operações de leitura intensiva como listagem de produtos e clientes, otimizando o desempenho e reduzindo a carga sobre o banco de dados.

### Testes Automatizados

A aplicação foi totalmente testada com **Jest**, com cobertura para todos os **services**. Os testes garantem que as regras de negócio e interações entre módulos estejam funcionando corretamente, prevenindo regressões e bugs. 

### Containers com Docker

O projeto utiliza **Docker** para a conteinerização de seus serviços, com containers para o **PostgreSQL** e **Redis**. Isso facilita a criação de ambientes consistentes tanto para desenvolvimento quanto para produção, além de tornar o deploy mais simples e eficiente.

## Instalação
1. Clone o repositório:
   ```bash
   git clone https://github.com/jpp000/api-vendas.git
   ```
2. Instale as dependências:
   ```bash
   yarn install
   ```

3. Configure as variáveis de ambiente utilizando o arquivo `.env.example` como referência.

4. Execute a aplicação utilizando **Docker**:
   ```bash
   docker-compose up
   ```

## Testes
Execute os testes unitários e de integração para garantir a qualidade da aplicação:
```bash
yarn test
```

## Test Coverage
A aplicação está coberta por testes que garantem a integridade do código e das regras de negócio.

## Melhorias Futuras
- Introdução de um sistema de filas (queue system) para processamento de tarefas assíncronas.

## Licença
Este projeto está licenciado sob a MIT License.

---
