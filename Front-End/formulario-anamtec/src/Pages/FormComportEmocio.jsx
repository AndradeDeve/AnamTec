import React, { useContext, useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header/Header";
import NavButtons from "../Components/NavButtons/NavButtons";
import ProgressBar from "../Components/ProgressBar/ProgressBar";
import { FormContext } from "../Context/FormContext";
import "../Styles/FormComportEmocio.css";

function FormComportEmocio() {
  const navigate = useNavigate();
  const { dadosFormulario, setDadosFormulario } = useContext(FormContext);

  const [erros, setErros] = useState({});

  // ✅ Campos obrigatórios
  const camposObrigatorios = ["dificuldadesAprendizagem"];

  // ✅ Garantindo que sempre exista um objeto comportamento
  const comportamento = dadosFormulario.comportamento || {
    dificuldadesAprendizagem: "",
    comportamento: "",
    emocionais: "",
  };

  // ✅ Atualiza apenas a tabela comportamento
  const handleChange = (field, value) => {
    setDadosFormulario((prev) => ({
      ...prev,
      comportamento: {
        ...prev.comportamento, // CORREÇÃO: usar o nome certo da chave
        [field]: value,
      },
    }));
    setErros((prev) => ({ ...prev, [field]: "" }));
  };

  // ✅ Validação simples
  const validarFormulario = () => {
    let valid = true;
    let novosErros = {};

    camposObrigatorios.forEach((campo) => {
      if (!comportamento[campo] || comportamento[campo].trim() === "") {
        valid = false;
        novosErros[campo] = "Campo obrigatório";
      }
    });

    setErros(novosErros);
    return valid;
  };

  const handleProximo = () => {
    if (!validarFormulario()) {
      alert("⚠️ Preencha todos os campos obrigatórios");
      return;
    }

    console.log("👉 Dados enviados (comportamento):", comportamento);
    navigate("/FormRevisao");
  };

  const handleVoltar = () => navigate("/FormSaude");

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
            "Revisão",
          ]}
          etapaAtual={3}
        />

        <Form className="form-box shadow rounded p-4">
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  O aluno apresenta dificuldades de aprendizagem:
                  <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite aqui"
                  value={comportamento.dificuldadesAprendizagem}
                  isInvalid={!!erros.dificuldadesAprendizagem}
                  onChange={(e) =>
                    handleChange("dificuldadesAprendizagem", e.target.value)
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {erros.dificuldadesAprendizagem}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={12} md={6}>
              <Form.Group>
                <Form.Label>Comportamento do aluno:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite aqui"
                  value={comportamento.comportamento}
                  onChange={(e) =>
                    handleChange("comportamento", e.target.value)
                  }
                />
              </Form.Group>
            </Col>

            <Col xs={12} md={6} className="mt-3 mt-md-0">
              <Form.Group>
                <Form.Label>Aspectos emocionais:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite aqui"
                  value={comportamento.emocionais}
                  onChange={(e) => handleChange("emocionais", e.target.value)}
                />
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
