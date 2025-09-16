import React, { useState } from "react";
import { Container, Row, Col, Form, Toast, ToastContainer } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {FormContext} from "../Context/FormContext";
import { useContext } from "react";
import Header from "../Components/Header/Header";
import NavButtons from "../Components/NavButtons/NavButtons";
import ProgressBar from "../Components/ProgressBar/ProgressBar";
import "./FormRevisao.css"

function FormRevisao() {
  const navigate = useNavigate();
  const { dadosFormulario } = useContext(FormContext);

  const handleConfirmar = () => {
    console.log("Enviando dados finais:", dadosFormulario);
    // Aqui vai o POST pro backend
    navigate("/sucesso");
  };

  return (
    <>
      <Header />
      <Container className="mt-4">
        <ProgressBar
          etapas={[
            "Informações principais",
            "Dados do Responsável",
            "Histórico de Saúde",
            "Aspectos Comportamentais e Emocionais",
            "Revisão"
          ]}
          etapaAtual={5}
        />

        <h3 className="mb-4 text-center">Revisão dos Dados</h3>

                  <Card className="p-3 mb-3">
          <h5>Informações Principais</h5>
          <p><strong>Nome:</strong> {dadosFormulario.informacoesPrincipais?.nome}</p>
          <p><strong>Data de Nascimento:</strong> {dadosFormulario.informacoesPrincipais?.dataNascimento}</p>
        </Card>

        {/* Responsável */}
        <Card className="p-3 mb-3">
          <h5>Responsável</h5>
          <p><strong>Nome:</strong> {dadosFormulario.responsavel?.nome}</p>
          <p><strong>Telefone:</strong> {dadosFormulario.responsavel?.telefone}</p>
        </Card>

        {/* Saúde */}
        <Card className="p-3 mb-3">
          <h5>Histórico de Saúde</h5>
          <p><strong>Tipo sanguíneo:</strong> {dadosFormulario.saude?.tipoSanguineo}</p>
          <p><strong>Fumante:</strong> {dadosFormulario.saude?.fumante}</p>
          <p><strong>Alergia:</strong> {dadosFormulario.saude?.possuiAlergia}</p>
        </Card>

        {/* Comportamento */}
        <Card className="p-3 mb-3">
          <h5>Comportamento e Emoções</h5>
          <p><strong>Dificuldades:</strong> {dadosFormulario.comportamento?.dificuldadesAprendizagem}</p>
          <p><strong>Comportamento:</strong> {dadosFormulario.comportamento?.comportamento}</p>
          <p><strong>Emocionais:</strong> {dadosFormulario.comportamento?.emocionais}</p>
        </Card>

        <div className="d-flex justify-content-between mt-3">
          <Button variant="secondary" onClick={() => navigate("/FormComportEmocio")}>
            Voltar
          </Button>
          <Button variant="success" onClick={handleConfirmar}>
            Confirmar e Enviar
          </Button>
        </div>
      </Container>
    </>
  );
}

export default FormRevisao;
