//Vai disponibilizar o uso de variáveis de ambiente
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const swaggerjsdoc = require("swagger-jsdoc");
const swaggerui = require("swagger-ui-express");
const swaggerDocs = require("./swagger.json");

//Configuração do App
const app = express();
app.use(express.json()); //Possibilitar transitar dados usando JSON
app.use(morgan("tiny"));

//Configuração do Banco de Dados
const { connection, authenticate } = require("./database/database");
authenticate(connection);

//Definição de rotas
const rotaEntregadores = require("./routes/entregadores");
const rotaPedidos = require("./routes/pedidos");
const router = require("./routes/entregadores");

//Juntar ao app as rotas
app.use(rotaEntregadores);
app.use(rotaPedidos);

app.use("/api-docs", swaggerui.serve, swaggerui.setup(swaggerDocs));

app.listen(4000, () => {
  // Gerar as tabelas a partir do model
  //Force = apaga tudo e recria as tabelas
  connection.sync();
  console.log("http://localhost:4000/");
});
