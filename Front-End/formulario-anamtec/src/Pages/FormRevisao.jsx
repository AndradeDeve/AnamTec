import React, { useState, useContext } from "react";
import { Container, Row, Col, Form, Toast, ToastContainer, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {FormContext} from "../Context/FormContext";
import Header from "../Components/Header/Header";
import NavButtons from "../Components/NavButtons/NavButtons";
import ProgressBar from "../Components/ProgressBar/ProgressBar";
import "../Styles/FormRevisao.css"

function FormRevisao() {
  const navigate = useNavigate();
  const { dadosFormulario } = useContext(FormContext);

  const confirmarFormulario = async () => {
    try {
      const respomse = await fetch("http://localhost:5000/api/form", {
        method: "POST",
        headers: { "Context-Type": "application/json" },
        body: JSON.stringify(dadosFormulario),
      });

      if (!Response.ok) {
        throw new Error("Erro ao enviar dados");
      }

      const result = await Response.json();
      console.log("Dados enviados com sucesso", result);

      navigate("/sucesso");
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
      alert("Não foi possível enviar os dados. Tente novamente");
    }
  };

  const handleVoltar = () => navigate("/FormComportEmocio");

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
          etapaAtual={4}
        />
      
      <div className="form-box form-revisao-body">

        <h3 className="font-semibold mb-4 text-center">Revisão dos Dados</h3>

        <Card className="p-3 mb-3 shadow-sm">
          <h5>👤Informações Principais</h5>
          <p><strong>Nome:</strong> {dadosFormulario.informacoesPrincipais?.nome}</p>
          <p><strong>RM:</strong> {dadosFormulario.informacoesPrincipais?.rm}</p>
          <p><strong>Data de Nascimento:</strong> {dadosFormulario.informacoesPrincipais?.dataNascimento}</p>
          <p><strong>Curso:</strong> {dadosFormulario.informacoesPrincipais?.curso}</p>
          <p><strong>Turno:</strong> {dadosFormulario.informacoesPrincipais?.turno}</p>
          <p><strong>Módulo:</strong> {dadosFormulario.informacoesPrincipais?.modulo}</p>
        </Card>

        {/* Responsável */}
        <Card className="p-3 mb-3 shadow-sm">
          <h5>Responsável</h5>
          <p><strong>Nome:</strong> {dadosFormulario.responsavel?.nome}</p>
          <p><strong>Telefone:</strong> {dadosFormulario.responsavel?.telefone}</p>
          <p><strong>Email:</strong> {dadosFormulario.informacoesPrincipais?.email}</p>
          <p><strong>Parentesco:</strong> {dadosFormulario.informacoesPrincipais?.parentesco}</p>
        </Card>

        {/* Saúde */}
        <Card className="p-3 mb-3">
          <h5>Histórico de Saúde</h5>
          <p><strong>Tipo sanguíneo:</strong> {dadosFormulario.saude?.tipoSanguineo}</p>
          <p><strong>Fumante:</strong> {dadosFormulario.saude?.fumante}</p>
          <p><strong>Alergia:</strong> {dadosFormulario.saude?.possuiAlergia}</p>
          <p><strong>Medicamentos:</strong> {dadosFormulario.informacoesPrincipais?.medicamentos}</p>
        </Card>

        {/* Comportamento */}
        <Card className="p-3 mb-3">
          <h5>Comportamento e Emocional</h5>
          <p><strong>Dificuldades:</strong> {dadosFormulario.comportamento?.dificuldadesAprendizagem}</p>
          <p><strong>Comportamento:</strong> {dadosFormulario.comportamento?.comportamento}</p>
          <p><strong>Questões Emocionais:</strong> {dadosFormulario.comportamento?.emocionais}</p>
          <p><strong>Observações:</strong> {dadosFormulario.informacoesPrincipais?.observacoes}</p>
        </Card>

        <div className="d-flex justify-content-between mt-3 mb-5">
        
        <NavButtons onVoltar={handleVoltar} mostrarProximo={false} />

          <Button          
          type="button" 
          className="custom-btn mt-3" 
          onClick={confirmarFormulario}
          >
            Enviar
          </Button>
      </div>
      </div>
      </Container>
    </>
  );
}

export default FormRevisao;
