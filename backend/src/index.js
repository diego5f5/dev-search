const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
const cors = require("cors");
const http = require("http");

const { setupWebsocket } = require("./websocket");

const app = express();
const server = http.Server(app);

setupWebsocket(server);

mongoose.connect(
  "mongodb://diego:diego@cluster0-shard-00-00.xsfh5.mongodb.net:27017/devSearch?ssl=true&replicaSet=atlas-ibzbdr-shard-0&authSource=admin&retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

app.use(cors());
app.use(express.json()); //precisa vir antes das rotas
app.use(routes);

server.listen(3333);

//Tipos de parâmetros:

// Query Params: request.query (filtros, ordenação, paginação, ...)

// Route Params: request.params (Identificar um recurso na alteração ou remoção)

// Body: request.body (Dados para criaçao ou alteração de um registro)
