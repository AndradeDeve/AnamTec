import React, { useState, useContext } from "react";
import { Container, Card, Button, Toast, ToastContainer } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FormContext } from "../Context/FormContext";
import Header from "../Components/Header/Header";
import NavButtons from "../Components/NavButtons/NavButtons";
import ProgressBar from "../Components/ProgressBar/ProgressBar";
import "../Styles/FormRevisao.css";

function FormRevisao() {
  const navigate = useNavigate();
  const { dadosFormulario } = useContext(FormContext);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const confirmarFormulario = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosFormulario),
      });

      if (!response.ok) {
        throw new Error("Erro ao enviar dados");
      }

      const result = await response.json();
      console.log("Dados enviados com sucesso", result);

      navigate("/sucesso");
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
      setToastMessage("Não foi possível enviar os dados. Tente novamente.");
      setShowToast(true);
    }
  };

  const handleVoltar = () => navigate("/FormComportEmocio");

  return (
    <>
      <Header />

      <ToastContainer position="top-end" className="p-3">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
          bg="warning"
        >
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      <Container className="mt-4">
        <ProgressBar
          etapas={[
            "Informações principais",
            "Dados do Responsável",
            "Histórico de Saúde",
            "Aspectos Comportamentais e Emocionais",
            "Revisão",
          ]}
          etapaAtual={4}
        />

        <div className="form-box form-revisao-body">

          <h3 className="font-semibold mb-4 text-center">Revisão dos Dados</h3>

          {/* Informações Principais */}
          <Card className="p-3 mb-3 shadow-sm">
            <h5>Informações Principais</h5>
            <p><strong>Nome:</strong> {dadosFormulario.informacoesPrincipais?.nome}</p>
            <p><strong>RM:</strong> {dadosFormulario.informacoesPrincipais?.rm}</p>
            <p><strong>Curso:</strong> {dadosFormulario.informacoesPrincipais?.curso}</p>
            <p><strong>Data de Nascimento:</strong> {dadosFormulario.informacoesPrincipais?.dataNascimento}</p>
            <p><strong>Turno:</strong> {dadosFormulario.informacoesPrincipais?.turno}</p>
            <p><strong>Módulo:</strong> {dadosFormulario.informacoesPrincipais?.modulo}</p>
            <p><strong>Gênero:</strong> {dadosFormulario.informacoesPrincipais?.genero}</p>
            <p><strong>Email:</strong> {dadosFormulario.informacoesPrincipais?.email}</p>
            <p><strong>Endereço:</strong> {`${dadosFormulario.informacoesPrincipais?.logradouro}, ${dadosFormulario.informacoesPrincipais?.numero}, ${dadosFormulario.informacoesPrincipais?.complemento}, ${dadosFormulario.informacoesPrincipais?.bairro}, ${dadosFormulario.informacoesPrincipais?.cidade} - ${dadosFormulario.informacoesPrincipais?.uf}, CEP: ${dadosFormulario.informacoesPrincipais?.cep}`}</p>
          </Card>

          {/* Responsável */}
          <Card className="p-3 mb-3 shadow-sm">
            <h5>Responsável</h5>
            <p><strong>Nome:</strong> {dadosFormulario.responsavel?.[0]?.nome}</p>
            <p><strong>CPF:</strong> {dadosFormulario.responsavel?.[0]?.cpf}</p>
            <p><strong>Telefone:</strong> {dadosFormulario.responsavel?.[0]?.telefone}</p>
            <p><strong>Email:</strong> {dadosFormulario.responsavel?.[0]?.email}</p>
            <p><strong>Parentesco:</strong> {dadosFormulario.responsavel?.[0]?.parentesco}</p>
          </Card>

          {/* Saúde */}
          <Card className="p-3 mb-3">
            <h5>Histórico de Saúde</h5>
            <p><strong>Tipo sanguíneo:</strong> {dadosFormulario.saude?.tipoSanguineo}</p>
            <p><strong>Fumante:</strong> {dadosFormulario.saude?.fumante}</p>
            <p><strong>Alergia:</strong> {dadosFormulario.saude?.possuiAlergia}</p>
            <p><strong>Medicamentos:</strong> {dadosFormulario.saude?.medicamentos}</p>
            <p><strong>Cirurgia:</strong> {dadosFormulario.saude?.cirurgia}</p>
            <p><strong>Restrição Alimentar:</strong> {dadosFormulario.saude?.restricaoAlimentar}</p>
          </Card>

          {/* Comportamento */}
          <Card className="p-3 mb-3">
            <h5>Comportamento e Emocional</h5>
            <p><strong>Dificuldade de aprendizagem:</strong> {dadosFormulario.comportamento?.dificulAprendizagem}</p>
            <p><strong>Quais dificuldades:</strong> {dadosFormulario.comportamento?.quaisAprendizagens}</p>
            <p><strong>Acompanhamento psicológico/psiquiátrico:</strong> {dadosFormulario.comportamento?.acompPsi}</p>
            <p><strong>Qual acompanhamento:</strong> {dadosFormulario.comportamento?.qualAcompPsi}</p>
            <p><strong>Possui acesso à internet/dispositivos:</strong> {dadosFormulario.comportamento?.acesInternet}</p>
            <p><strong>Quais acessos:</strong> {dadosFormulario.comportamento?.quaisAcessos}</p>
            <p><strong>Pratica atividades físicas:</strong> {dadosFormulario.comportamento?.pratAtiv}</p>
            <p><strong>Quais atividades e frequência:</strong> {dadosFormulario.comportamento?.quaisAtividades}</p>
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