import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Sucesso() {
  const navigate = useNavigate();

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100">
      <h2 className="text-success mb-3">✅ Formulário enviado com sucesso!</h2>
      <Button variant="primary" onClick={() => navigate("/")}>
        Voltar para o início
      </Button>
    </div>
  );
}

export default Sucesso;
