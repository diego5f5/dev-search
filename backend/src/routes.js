const { Router } = require("express");

const DevController = require("./controllers/DevController");
const SearchController = require("./controllers/SearchController");

const routes = Router();

// Métodos de Developer
routes.get("/devs", DevController.index);
routes.post("/devs", DevController.store);
routes.put("/devs/:id_username", DevController.update);
routes.delete("/devs/:id_username", DevController.destroy);

// Método de busca
routes.get("/search", SearchController.index);

module.exports = routes;
