const axios = require("axios");
const Dev = require("../models/Dev");
const parseStringAsArray = require("../utils/parseStringAsArray");
const { findConnections, sendMessage } = require("../websocket");

// index = mostrar uma lista, show = mostrar um único, store = criar, update = alterar, destroy = deletar

module.exports = {
  async index(request, response) {
    const devs = await Dev.find();

    return response.json(devs);
  },

  async store(request, response) {
    const { github_username, techs, latitude, longitude } = request.body;

    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      const apiResponse = await axios.get(
        `https://api.github.com/users/${github_username}`
      );

      let { name, avatar_url, bio } = apiResponse.data;

      if (!name) {
        name = apiResponse.data.login;
      }

      const techsArray = parseStringAsArray(techs);

      const location = {
        type: "Point",
        coordinates: [latitude, longitude],
      };

      dev = await Dev.create({
        name: name,
        github_username: github_username,
        bio: bio,
        avatar_url: avatar_url,
        techs: techsArray,
        location: location,
      });

      // Filtrar as conexões que estão á no máximo 10 quilômetros de distância e que o novo deve tenha pelo menos uma das tecnologias filtradas

      const sendSocketMessageTo = findConnections(
        { latitude: latitude, longitude: longitude },
        techsArray
      );

      sendMessage(sendSocketMessageTo, "new_dev", dev);
    }

    return response.json(dev);
  },

  async update(request, response) {
    const { id_username } = request.params;

    const { techs, latitude, longitude } = request.body;

    const techsArray = parseStringAsArray(techs);

    const location = {
      type: "Point",
      coordinates: [latitude, longitude],
    };

    const dev = await Dev.findOneAndUpdate(
      { github_username: id_username },
      { techs: techsArray, location: location },
      { new: true }
    );

    if (!dev) {
      return response.json({
        message: "Erro ao atualizar! Usuário não existe!",
      });
    } else {
      return response.json(dev);
    }
  },

  async destroy(request, response) {
    const { id_username } = request.params;

    const dev = await Dev.findOneAndDelete({ github_username: id_username });

    // console.log(dev);

    if (!dev) {
      return response.json({
        message: "Erro ao remover! Usuário não existe ou já foi removido!",
      });
    } else {
      return response.json({
        message: "Usuário removido com sucesso!",
      });
    }
  },
};
