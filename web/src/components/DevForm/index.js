import React, { useState, useEffect } from "react";

import "./styles.css";

function DevForm({ onSubmit }) {
  const [github_username, setGithubUsername] = useState("");
  const [techs, setTechs] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setLatitude(latitude);
        setLongitude(longitude);
      },
      (err) => {
        console.log(err);
      },
      {
        timeout: 30000,
      }
    );
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    await onSubmit({
      github_username: github_username,
      techs: techs,
      latitude: latitude,
      longitude: longitude,
    });

    setGithubUsername("");
    setTechs("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="input-block">
        <label htmlFor="github_username">Usuário do Github:</label>
        <input
          name="github_username"
          id="github_username"
          value={github_username}
          onChange={(e) => setGithubUsername(e.target.value)}
        ></input>
      </div>

      <div className="input-block">
        <label htmlFor="techs">Tecnologias:</label>
        <input
          name="techs"
          id="techs"
          value={techs}
          onChange={(e) => setTechs(e.target.value)}
        ></input>
      </div>

      <div className="input-group">
        <div className="input-block">
          <label htmlFor="latitude">Latitude:</label>
          <input
            name="latitude"
            id="latitude"
            type="number"
            required
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
          ></input>
        </div>
        <div className="input-block">
          <label htmlFor="longitude">Longitude:</label>
          <input
            name="longitude"
            id="longitude"
            type="number"
            required
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
          ></input>
        </div>
      </div>

      <button type="submit">Salvar</button>
    </form>
  );
}

export default DevForm;
