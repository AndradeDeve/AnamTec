import React, { useContext, useState } from "react";
import { Container, Row, Col, Form, } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header/Header";
import NavButtons from "../Components/NavButtons/NavButtons";
import ProgressBar from "../Components/ProgressBar/ProgressBar";
import SelectYesNo from "../Components/SelectYesNo/SelectYesNo";
import { FormContext } from "../Context/FormContext";
import "../Styles/FormComportEmocio.css";
import "../Styles/Paletas.css";

function FormComportEmocio() {
  const navigate = useNavigate();
  const { dadosFormulario, setDadosFormulario } = useContext(FormContext);

  const [erros, setErros] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleChange = (field, value) => {
    setDadosFormulario((prev) => {
      const newComport = {
        ...prev.comportamento,
        [field]: value || "",
      };

      // Limpa campos dependentes quando a resposta não for 'sim'
      if (field === "dificulAprendizagem" && value !== "sim") newComport.quaisAprendizagens = "";
      if (field === "acompPsi" && value !== "sim") newComport.qualAcompPsi = "";
      if (field === "acesInternet" && value !== "sim") newComport.quaisAcessos = "";
      if (field === "pratAtiv" && value !== "sim") newComport.quaisAtividades = "";

      return {
        ...prev,
        comportamento: newComport,
      };
    });
    setErros((prev) => ({ ...prev, [field]: "" }));
  };

  const validarFormulario = () => {
    let valid = true;
    let novosErros = {};
    const comportamento = dadosFormulario.comportamento;

    // Campos sim/não obrigatórios
    const obrigatorios = ["dificulAprendizagem", "acompPsi", "acesInternet", "pratAtiv"];
    obrigatorios.forEach((campo) => {
      if (!comportamento[campo] || comportamento[campo].trim() === "") {
        valid = false;
        novosErros[campo] = "Campo obrigatório";
      }
    });

    const camposObrigatorios = [
    "dificulAprendizagem",
    "acomPsi",
    "acesInternet", 
    "pratAtiv",
  ];

    // Campos "detalhes" obrigatórios se marcado "sim"
    if (comportamento.dificulAprendizagem === "sim" && !comportamento.quaisAprendizagens.trim()) {
      valid = false;
      novosErros.quaisAprendizagens = "Campo obrigatório";
    }

    if (comportamento.acompPsi === "sim" && !comportamento.qualAcompPsi.trim()) {
      valid = false;
      novosErros.qualAcompPsi = "Campo obrigatório";
    }

    if (comportamento.acesInternet === "sim" && !comportamento.quaisAcessos.trim()) {
      valid = false;
      novosErros.quaisAcessos = "Campo obrigatório";
    }

    if (comportamento.pratAtiv === "sim" && !comportamento.quaisAtividades.trim()) {
      valid = false;
      novosErros.quaisAtividades = "Campo obrigatório";
    }

    setErros(novosErros);
    return valid;
  };

  const handleProximo = () => {
    if (!validarFormulario()) {
      toast.error("⚠️ Preencha todos os campos obrigatórios corretamente!");
      return;
    }

    navigate("/FormRevisao");
  };

  const handleVoltar = () => navigate("/FormSaude");

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
          etapaAtual={3}
        />

        <Form className="form-box p-4 shadow rounded">
          <h5 className="mb-3">Aspectos Comportamentais e Emocionais</h5>

          <Row className="mb-3">
            <Col xs={12} md={5}>
              <SelectYesNo
                label ={
                  <>
                  Apresenta dificuldades de aprendizagem?{""}
                  <span style={{ color: "red"}}>*</span>
                  </>
                }
                value={dadosFormulario.comportamento.dificulAprendizagem || ""}
                onChange={(e) => handleChange("dificulAprendizagem", e.target.value)}
                controlId="dificulAprendizagem"
                error={erros.dificulAprendizagem}
              />
            </Col>
            <Col xs={12} md={7}>
              <Form.Group>
                <Form.Label>Se sim, quais?</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite aqui"
                  value={dadosFormulario.comportamento.quaisAprendizagens || ""}
                  isInvalid={!!erros.quaisAprendizagens}
                  onChange={(e) => handleChange("quaisAprendizagens", e.target.value)}
                  disabled={dadosFormulario.comportamento.dificulAprendizagem !== "sim"}
                />
                <Form.Control.Feedback type="invalid">
                  {erros.quaisAprendizagens}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          {/* Repetir para os outros campos de forma similar */}
          {/* acompanhamento psicológico */}
          <Row className="mb-3">
            <Col xs={12} md={5}>
              <SelectYesNo
                label={
                <>
                Faz acompanhamento psicológico ou psiquiátrico?
                <span style={{ color: "red"}}>*</span>
                </>
                }
                value={dadosFormulario.comportamento.acompPsi || ""}
                onChange={(e) => handleChange("acompPsi", e.target.value)}
                controlId="acompPsi"
                error={erros.acompPsi}
              />
            </Col>
            <Col xs={12} md={7}>
              <Form.Group>
                <Form.Label>Se sim, qual?</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite aqui"
                  value={dadosFormulario.comportamento.qualAcompPsi || ""}
                  isInvalid={!!erros.qualAcompPsi}
                  onChange={(e) => handleChange("qualAcompPsi", e.target.value)}
                  disabled={dadosFormulario.comportamento.acompPsi !== "sim"}
                />
                <Form.Control.Feedback type="invalid">
                  {erros.qualAcompPsi}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          {/* Internet e atividades físicas */}
          <Row className="mb-3">
            <Col xs={12} md={5}>
              <SelectYesNo
                label={
                <>
                Tem acesso à internet e dispositivos para estudo?
                <span style={{ color: "red"}}>*</span>
                </>
                }
                value={dadosFormulario.comportamento.acesInternet || ""}
                onChange={(e) => handleChange("acesInternet", e.target.value)}
                controlId="acesInternet"
                error={erros.acesInternet}
              />
            </Col>
            <Col xs={12} md={7}>
              <Form.Group>
                <Form.Label>Se sim, quais?</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite aqui"
                  value={dadosFormulario.comportamento.quaisAcessos || ""}
                  isInvalid={!!erros.quaisAcessos}
                  onChange={(e) => handleChange("quaisAcessos", e.target.value)}
                  disabled={dadosFormulario.comportamento.acesInternet !== "sim"}
                />
                <Form.Control.Feedback type="invalid">
                  {erros.quaisAcessos}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={12} md={5}>
              <SelectYesNo
                label={
                <>
                Pratica atividades físicas regularmente?
                <span style={{ color: "red"}}>*</span>
                </>
                }
                value={dadosFormulario.comportamento.pratAtiv || ""}
                onChange={(e) => handleChange("pratAtiv", e.target.value)}
                controlId="pratAtiv"
                error={erros.pratAtiv}
              />
            </Col>
            <Col xs={12} md={7}>
              <Form.Group>
                <Form.Label>Se sim, quais e com que frequência?</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite aqui"
                  value={dadosFormulario.comportamento.quaisAtividades || ""}
                  isInvalid={!!erros.quaisAtividades}
                  onChange={(e) => handleChange("quaisAtividades", e.target.value)}
                  disabled={dadosFormulario.comportamento.pratAtiv !== "sim"}
                />
                <Form.Control.Feedback type="invalid">
                  {erros.quaisAtividades}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <NavButtons onVoltar={handleVoltar} onProximo={handleProximo} />
        </Form>
      </Container>
    </>
  );
}

export default FormComportEmocio;