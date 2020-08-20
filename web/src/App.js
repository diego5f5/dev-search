import React, { useEffect, useState } from "react";
import api from "./services/api";

import "./global.css";
import "./App.css";
import "./Sidebar.css";
import "./Main.css";

import DevItem from "./components/DevItem/index";
import DevForm from "./components/DevForm/index";

// Componente: Bloco isolado de HTML, CSS e JS, o qual não interfere no restante da aplicação;
// Propriedade: Informações que um componente PAI passa para o componente FILHO;
// Estado:

function App() {
  const [devs, setDevs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadDevs() {
      setLoading(true);

      try {
        const response = await api.get("/devs");

        setDevs(response.data);
        setLoading(false);
      } catch (error) {
        alert("Erro ao carregar Devs!");
        setLoading(false);
      }
    }

    loadDevs();
  }, []);

  async function handleAddDev(data) {
    const response = await api.post("/devs", data);

    setDevs([...devs, response.data]);
  }

  async function handleDevDelete(id) {
    const response = await api.delete(`/devs/${id}`);

    if (response.status === 200) {
      window.location.href = "/";
    } else {
      alert("Erro ao tentar remover o Dev!");
    }
  }

  return (
    <div id="app">
      <aside>
        <strong>Cadastrar Dev</strong>
        <DevForm onSubmit={handleAddDev} />
      </aside>
      {loading ? "Carregando..." : null}
      <main>
        <ul>
          {devs.map((dev) => (
            <DevItem key={dev._id} dev={dev} onDelete={handleDevDelete} />
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
