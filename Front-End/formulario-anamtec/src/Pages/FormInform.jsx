import React, { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Form, Toast, ToastContainer } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FormContext } from "../Context/FormContext";
import Header from "../Components/Header/Header";
import NavButtons from "../Components/NavButtons/NavButtons";
import ProgressBar from "../Components/ProgressBar/ProgressBar";
import "../Styles/FormInform.css";

function FormInform() {
  const navigate = useNavigate();
  const { dadosFormulario, setDadosFormulario } = useContext(FormContext);

  const [erros, setErros] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const informacoes = dadosFormulario.informacoesPrincipais;

  const camposObrigatorios = [
    "nome",
    "rm",
    "curso",
    "dataNascimento",
    "turno",
    "modulo",
    "email",
    "cep",
  ];

  const handleChange = (field, value) => {
    const novosDados = { ...informacoes, [field]: value };
    setDadosFormulario((prev) => ({
      ...prev,
      informacoesPrincipais: novosDados,
    }));
    setErros((prev) => ({ ...prev, [field]: "" }));
    setShowToast(false);
  };

  const buscarCEP = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setDadosFormulario((prev) => ({
            ...prev,
            informacoesPrincipais: {
              ...prev.informacoesPrincipais,
              logradouro: data.logradouro || "",
              bairro: data.bairro || "",
              cidade: data.localidade || "",
              uf: data.uf || "",
            },
          }));
        } else {
          alert("CEP não encontrado!");
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    }
  };

  const validarFormulario = () => {
    let valid = true;
    let novosErros = {};

    camposObrigatorios.forEach((campo) => {
      if (!informacoes[campo]) {
        valid = false;
        novosErros[campo] = "Campo obrigatório";
      }
    });

    if (informacoes.email) {
      const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regexEmail.test(informacoes.email)) {
        valid = false;
        novosErros.email = "Digite um e-mail válido";
      }
    }

    setErros(novosErros);
    return valid;
  };

  const handleProximo = () => {
    if (!validarFormulario()) {
      setToastMessage("⚠️ Preencha todos os campos obrigatórios corretamente!");
      setShowToast(true);
      return;
    }

    console.log("👉 Dados capturados:", informacoes);
    navigate("/FormResp");
  };

  const handleVoltar = () => navigate("/Home");

  return (
    <>
      <Header />

      <Container className="mt-3">
        <ProgressBar
          etapas={[
            "Informações principais",
            "Dados do Responsável",
            "Histórico de Saúde",
            "Aspectos Comportamentais e Emocionais",
            "Revisão",
          ]}
          etapaAtual={0}
        />

        <Form
          className="form-box p-4 shadow rounded"
          onSubmit={(e) => {
            e.preventDefault();
            handleProximo();
          }}
        >
          <ToastContainer className="p-3" position="top-center">
            <Toast
              onClose={() => setShowToast(false)}
              show={showToast}
              delay={4000}
              autohide
              bg="danger"
            >
              <Toast.Body className="text-white">{toastMessage}</Toast.Body>
            </Toast>
          </ToastContainer>

          <h5 className="mb-3">Dados Pessoais</h5>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  Nome:<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite o nome"
                  value={informacoes.nome || ""}
                  isInvalid={!!erros.nome}
                  onChange={(e) => handleChange("nome", e.target.value)}
                />
                <Form.Control.Feedback type="invalid">{erros.nome}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label>
                  RM:<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Digite o RM"
                  value={informacoes.rm || ""}
                  isInvalid={!!erros.rm}
                  onChange={(e) => handleChange("rm", e.target.value)}
                />
                <Form.Control.Feedback type="invalid">{erros.rm}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label>
                  Data de Nascimento:<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="date"
                  value={informacoes.dataNascimento || ""}
                  isInvalid={!!erros.dataNascimento}
                  onChange={(e) => handleChange("dataNascimento", e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  {erros.dataNascimento}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>
                  E-mail:<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Digite o e-mail"
                  value={informacoes.email || ""}
                  isInvalid={!!erros.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
                <Form.Control.Feedback type="invalid">{erros.email}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Telefone:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="(xx) xxxxx-xxxx"
                  value={informacoes.telefone || ""}
                  onChange={(e) => handleChange("telefone", e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col md={2}>
              <Form.Group>
                <Form.Label>Gênero:</Form.Label>
                <Form.Select
                  value={informacoes.genero || ""}
                  onChange={(e) => handleChange("genero", e.target.value)}
                >
                  <option value="">Selecione</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Outros">Outros</option>
                  <option value="Prefiro não informar">Prefiro não informar</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={2}>
              <Form.Group>
                <Form.Label>Reside com:</Form.Label>
                <Form.Control
                  type="text"
                  value={informacoes.resideCom || ""}
                  onChange={(e) => handleChange("resideCom", e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>
                  Curso:<span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  value={informacoes.curso || ""}
                  isInvalid={!!erros.curso}
                  onChange={(e) => handleChange("curso", e.target.value)}
                >
                  <option value="">Selecione o curso</option>
                  <option value="Administração">Administração</option>
                  <option value="Contabilidade">Contabilidade</option>
                  <option value="Recursos Humanos">Recursos Humanos</option>
                  <option value="Desenvolvimento de Sistemas">Desenvolvimento de Sistemas</option>
                  <option value="Informática">Informática</option>
                  <option value="Eletroeletrônica">Eletroeletrônica</option>
                  <option value="Automação Industrial">Automação Industrial</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">{erros.curso}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>
                  Turno:<span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  value={informacoes.turno || ""}
                  isInvalid={!!erros.turno}
                  onChange={(e) => handleChange("turno", e.target.value)}
                >
                  <option value="">Selecione</option>
                  <option value="Manhã">Manhã</option>
                  <option value="Tarde">Tarde</option>
                  <option value="Noite">Noite</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">{erros.turno}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>
                  Módulo:<span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  value={informacoes.modulo || ""}
                  isInvalid={!!erros.modulo}
                  onChange={(e) => handleChange("modulo", e.target.value)}
                >
                  <option value="">Selecione</option>
                  <option value="Módulo 1">Módulo 1</option>
                  <option value="Módulo 2">Módulo 2</option>
                  <option value="Módulo 3">Módulo 3</option>
                  <option value="Ensino Médio">Ensino Médio</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">{erros.modulo}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <h5 className="mt-5 mb-3">Endereço Residencial</h5>

          <Row className="mb-3">
            <Col md={3}>
              <Form.Group>
                <Form.Label>
                  CEP:<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  value={informacoes.cep || ""}
                  isInvalid={!!erros.cep}
                  onChange={(e) => handleChange("cep", e.target.value)}
                  onBlur={(e) => buscarCEP(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">{erros.cep}</Form.Control.Feedback>
              </Form.Group>
            </Col>

            <Col md={7}>
              <Form.Group>
                <Form.Label>Logradouro:</Form.Label>
                <Form.Control
                  type="text"
                  value={informacoes.logradouro || ""}
                  onChange={(e) => handleChange("logradouro", e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col md={2}>
              <Form.Group>
                <Form.Label>Número:</Form.Label>
                <Form.Control
                  type="text"
                  value={informacoes.numero || ""}
                  onChange={(e) => handleChange("numero", e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={3}>
              <Form.Group>
                <Form.Label>Complemento:</Form.Label>
                <Form.Control
                  type="text"
                  value={informacoes.complemento || ""}
                  onChange={(e) => handleChange("complemento", e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label>Bairro:</Form.Label>
                <Form.Control
                  type="text"
                  value={informacoes.bairro || ""}
                  onChange={(e) => handleChange("bairro", e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label>Cidade:</Form.Label>
                <Form.Control
                  type="text"
                  value={informacoes.cidade || ""}
                  onChange={(e) => handleChange("cidade", e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col md={2}>
              <Form.Group>
                <Form.Label>UF:</Form.Label>
                <Form.Control
                  type="text"
                  maxLength="2"
                  value={informacoes.uf || ""}
                  onChange={(e) => handleChange("uf", e.target.value.toUpperCase())}
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

export default FormInform;