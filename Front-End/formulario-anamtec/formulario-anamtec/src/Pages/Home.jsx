import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Bem-vindo ao AnamTec</h1>
      <button onClick={() => navigate("/formaspec")}>Ir para o Formulário</button>
    </div>
  );
}

export default Home;
