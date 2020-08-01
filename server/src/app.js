const express = require("express");
const routes = require("./routes");

const cors = require("cors");

// Classe principal do projeto
class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    // Liberando o acesso de fora do servidor local
    this.server.use(cors());
    // Dizendo ao servidor que ele deve trabalhar com JSON
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }
}

module.exports = new App().server;
