<img alt="GoStack" src="https://camo.githubusercontent.com/d25397e9df01fe7882dcc1cbc96bdf052ffd7d0c/68747470733a2f2f73746f726167652e676f6f676c65617069732e636f6d2f676f6c64656e2d77696e642f626f6f7463616d702d676f737461636b2f6865616465722d6465736166696f732e706e67" style="max-width:100%">

## <p style="margin-top: 16px" align="center">**Desafio - Relacionamentos com banco de dados no Node.js**</p>

Uma aplicação que permitir a criação de clientes, produtos e pedidos, onde o cliente pode gerar novos pedidos de compra de certos produtos, mas conhecido como um mini e-commerce. Utilizando Node.js junto ao TypeScript, incluindo o uso de banco de dados com o TypeORM, e relacionamentos ManyToMany.


```
# clonar o repositório
git clone https://github.com/nivaldoandrade/desafio-database-relations

# Instalar as dependências
yarn

#Criação do Banco de dados
Alterar as informações do arquivo ormconfig.json com as informações do seu banco de dados.

# Run migrations
yarn typeorm migration:run

# Iniciar a aplicação
yarn dev:server

```
---
### Insomnia
Tutorial de como importar Workspace para teste [Importing and Exporting Data.](https://support.insomnia.rest/article/52-importing-and-exporting-data)
Download do [Workspace](https://github.com/nivaldoandrade/desafio-database-relations/blob/master/InsomniaData/desafio-database-relations.json).

---
### Rotas da aplicação
* POST /customers: A rota receber **name** e **email** dentro do corpo da requisição, sendo o name o nome do cliente a ser cadastrado. Ao cadastrar no banco de dados, na tabela customers deverá possuir os campos name, email, created_at, updated_at. Impossível a criação de cliente com e-mail duplicado.

  ```JSON
  {
    "name": "John Doe",
    "email": "john.doe@email.com"
  }
  ```

* POST /products: Essa rota receber **name**, **price** e **quantity** dentro do corpo da requisição, sendo o name o nome do produto a ser cadastrado, price o valor unitário e quantity a quantidade existente em estoque do produto. Com esses dados devem ser criados no banco de dados um novo produto com os seguintes campos: name, price, quantity, created_at, updated_at. Impossível cria o produto com o mesmo nome.

  ```JSON
  {
	"name": "Cadeira Gamer 1",
	"price": 1500,
	"quantity": 5
  }
  ```

* POST /orders/: Nessa rota receber no corpo da requisição o customer_id e um array de products, contendo o id e a quantity que você deseja adicionar a um novo pedido. Aqui é cadastrado na tabela order um novo pedido, que estará relacionado ao customer_id informado, created_at e updated_at . Já na tabela orders_products, será armazenado o product_id, order_id, price e quantity, created_at e updated_at.

  ```JSON
  {
    "customer_id": "e26f0f2a-3ac5-4c21-bd22-671119adf4e9",
    "products": [
      {
        "id": "ce0516f3-63ae-4048-9a8a-8b6662281efe",
        "quantity": 5
      },
      {
        "id": "82612f2b-3f31-40c6-803d-c2a95ef35e7c",
        "quantity": 7
      }
    ]
  }
  ```

* GET /orders/:id: Essa rota retornar as informações de um pedido específico, com todas as informações que podem ser recuperadas através dos relacionamentos entre a tabela orders, customers e orders_products.

  ```JSON
    {
    "id": "79889bb3-85db-407b-8d7c-030a9bd36283",
    "created_at": "2020-10-16T23:29:55.610Z",
    "updated_at": "2020-10-16T23:29:55.610Z",
    "customer": {
      "id": "9d369d0f-cd74-4d5b-9230-48bd250ce83f",
      "name": "John Doe",
      "email": "john.doe@email.com",
      "created_at": "2020-10-16T23:29:11.602Z",
      "updated_at": "2020-10-16T23:29:11.602Z"
    },
    "order_products": [
      {
        "id": "20c6ea07-96f7-4e75-bafe-3c2677bac305",
        "product_id": "3edec852-7cc5-4061-8b3a-d168b03511b8",
        "order_id": "79889bb3-85db-407b-8d7c-030a9bd36283",
        "price": "1500.00",
        "quantity": 3,
        "created_at": "2020-10-16T23:29:55.610Z",
        "updated_at": "2020-10-16T23:29:55.610Z"
      },
      {
        "id": "f3dbe4f5-d0bd-4c9e-abba-82b3275a23a5",
        "product_id": "079f1a90-a6ee-4b5c-a297-72b8b2729033",
        "order_id": "79889bb3-85db-407b-8d7c-030a9bd36283",
        "price": "1500.00",
        "quantity": 1,
        "created_at": "2020-10-16T23:29:55.610Z",
        "updated_at": "2020-10-16T23:29:55.610Z"
      }
    ]
  }
  ```


____
Desafio feito pela [RocketSeat](https://rocketseat.com.br/).

