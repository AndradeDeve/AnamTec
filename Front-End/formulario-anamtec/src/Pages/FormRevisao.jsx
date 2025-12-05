import React, { useState, useContext } from "react";
import { Container, Card, Button } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import { postFormularioAnamnese } from "../service/ApiService.js"
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { FormContext } from "../Context/FormContext";
import Header from "../Components/Header/Header";
import NavButtons from "../Components/NavButtons/NavButtons";
import ProgressBar from "../Components/ProgressBar/ProgressBar";
import "../Styles/FormRevisao.css";

function FormRevisao() {
  const navigate = useNavigate();
  const { dadosFormulario, resetFormulario } = useContext(FormContext);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const confirmarFormulario = async () => {
    try {
      // Monta payload usando a nova estrutura do contexto
      const payload = {
        alunoInformacoes: dadosFormulario.alunoInformacoes || {},
        logradouroInformacoes: dadosFormulario.logradouroInformacoes || {},
        cursoInformacoes: dadosFormulario.cursoInformacoes || {},
        responsavel: dadosFormulario.responsavel || [],
        saude: dadosFormulario.saude || {},
        comportamento: dadosFormulario.comportamento || {},
      };

      const response = await postFormularioAnamnese(payload);

      const backendMessage =
        response?.data?.response ||
        response?.data?.err ||
        `Status: ${response?.status}`;

      if (response && (response.status === 200 || response.status === 201)) {
        toast.success(backendMessage);
        // Limpa o formulário salvo (context + localStorage) para nova anamnese
        // try {
          // if (typeof resetFormulario === 'function') resetFormulario();
        // } catch (e) {
          // console.error('Erro ao resetar formulário:', e);
        // }
        navigate("/sucesso");
        return;
      }

      toast.error(backendMessage);
      navigate("/sucesso");
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
      const errMsg = error?.response?.data?.err;

      toast.error(errMsg);
    }
  };

  const handleVoltar = () => navigate("/FormComportEmocio");

  return (
    <>
      <Header />

      <Container className="mt-4">
        <ProgressBar
          etapas={[
            "Informações Principais",
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
            <p><strong>Nome:</strong> {dadosFormulario.alunoInformacoes?.nome}</p>
            <p><strong>RM:</strong> {dadosFormulario.alunoInformacoes?.rm}</p>
            <p><strong>Curso:</strong> {dadosFormulario.cursoInformacoes?.curso}</p>
            <p><strong>Data de Nascimento:</strong> {dadosFormulario.alunoInformacoes?.dataNascimento}</p>
            <p><strong>Turno:</strong> {dadosFormulario.cursoInformacoes?.turno}</p>
            <p><strong>Módulo:</strong> {dadosFormulario.cursoInformacoes?.modulo}</p>
            <p><strong>Gênero:</strong> {dadosFormulario.alunoInformacoes?.genero}</p>
            <p><strong>Email:</strong> {dadosFormulario.alunoInformacoes?.email}</p>
            <p><strong>Endereço:</strong> {`${dadosFormulario.logradouroInformacoes?.logradouro || ''}, ${dadosFormulario.logradouroInformacoes?.numero || ''}, ${dadosFormulario.logradouroInformacoes?.complemento || ''}, ${dadosFormulario.logradouroInformacoes?.bairro || ''}, ${dadosFormulario.logradouroInformacoes?.cidade || ''} - ${dadosFormulario.logradouroInformacoes?.uf || ''}, CEP: ${dadosFormulario.logradouroInformacoes?.cep || ''}`}</p>
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