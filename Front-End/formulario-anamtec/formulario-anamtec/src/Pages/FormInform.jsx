import React, { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header/Header";
import NavButtons from "../Components/NavButtons/NavButtons";
import ProgressBar from "../Components/ProgressBar/ProgressBar";
import "./FormInform.css";

function FormInform() {
  const navigate = useNavigate();

  const [informacoes, setInformacoes] = useState({
    nome: "", curso: "", data_nasc: "", turno: "", modulo: "", idade: "", genero: "", resideCom: "", email: "", cep: "", numero: "", complemento: "", logradouro: "", bairro: "", cidade: "", uf: "", 
  });

  const [erros, setErros] = useState({});

  const camposObrigatorios = ["nome", "curso", "dataNascimento", "turno", "modulo", "email",];

  const handleChange = (field, value) => {
    setInformacoes((prev) => ({...prev, [field]: value}));
    setErros((prev) => ({ ...prev, [field]: ""}));
  };

  const validarFomulario = () => {
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
    if(!regexEmail.test(informacoes.email)) {
      valid = false;
      novosErros.email = "Digite um e-mail válido";
    }
  }

  setErros(novosErros);
  return valid;
};

  const handleProximo = () => {
    if (!validarFomulario()) {
      alert("⚠️ Preencha todos os campos obrigatorios corretamente!");
      return;
    }

    console.log("Enviando para o banco:", informacoes);

    navigate("/FormResp");
  };

  const handleVoltar = () => navigate("/Home");
  
  return (
    <>
    <Header />

    <Container className="mt-4">
      <ProgressBar 
      etapas={[
        "Informações principais",
        "Dados do Responsável",
        "Histórico de Saúde",
        "Aspectos Comportamentais e Emocionais"
      ]}
      etapaAtual={0}
      />

      <Form className="form-box p-4 shadow rounded">
          <Row className="mb-3">
            <Col xs={12} md={6}>
            <Form.Group>
              <Form.Label>Nome:<span style={{ color: "red"}}>*</span></Form.Label>
              <Form.Control
              type="text"
              placeholder="Digite o nome"
              value={informacoes.nome}
              isInvalid={!!erros.nome}
              onChange={(e) => handleChange("nome", e.target.value)} />
              <Form.Control.Feedback type="invalid">{erros.nome}</Form.Control.Feedback>
            </Form.Group>
            </Col>

            <Col xs={12} md={6}>
              <Form.Group>
              <Form.Label>Curso:<span style={{ color: "red" }}>*</span></Form.Label>
              <Form.Select value={informacoes.curso}  isInvalid={!!erros.curso} onChange={(e) => handleChange("curso", e.target.value)}>
                <option value="">Selecione o curso</option>
                <option value="Administração">Administração</option>
                <option value="Administração - Ensino Médio">Administração - Ensino Médio</option>
                <option value="Contabilidade">Contabilidade</option>
                <option value="Recursos Humanos">Recursos Humanos</option>
                <option value="Desenvolvimento de Sistemas">Desenvolvimentos de Sistemas</option>
                <option value="Desenvolvimento de Sistemas - Ensino Médio">Desenvolvimento de Sistemas - Ensino Médio</option>
                <option value="Informática">Informática</option>
                <option value="Eletroeletrônica">Eletoreletrônica</option>
                <option value="Automação Industrial - Ensino Médio">Automação Idustrial - Ensino Médio</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid"> {erros.curso} </Form.Control.Feedback>  
            </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={12} md={4}>
            <Form.Group>
              <Form.Label>Data de Nascimento:<span style={{ color: "red" }}>*</span></Form.Label>
              <Form.Control type="date" value={informacoes.dataNascimento} isInvalid={!!erros.dataNascimento} onChange={(e) => handleChange("dataNascimento", e.target.value)}/>
              <Form.Control.Feedback type="invalid">{erros.dataNascimento}</Form.Control.Feedback>
            </Form.Group>
            </Col>

            <Col xs={12} md={4}>
            <Form.Group>
              <Form.Label>Turno:<span style={{ color: "red" }}>*</span></Form.Label>
              <Form.Select value={informacoes.turno} isInvalid={!!erros.turno} onChange={(e) => handleChange("turno", e.target.value)}>
                <option value="">Selecione o curso</option>
                <option value="Manhã">Manhã</option>
                <option value="Tarde">Tarde</option>
                <option value="Noite">Noite</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid"> {erros.turno} </Form.Control.Feedback>
            </Form.Group>
            </Col>

            <Col xs={12} md={4}>
            <Form.Group>
              <Form.Label>Módulo:<span style={{ color: "red" }}>*</span></Form.Label>
              <Form.Select value={informacoes.modulo} isInvalid={!!erros.modulo} onChange={(e) => handleChange("modulo", e.target.value)}>
                <option value="">Selecione o módulo</option>
                <option value="Módulo 1">Módulo 1</option>
                <option value="Módulo 2">Módulo 2</option>
                <option value="Módulo 3">Módulo 3</option>
                <option value="Ensino Médio">Ensino Médio</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid"> {erros.modulo} </Form.Control.Feedback>
            </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={12} md={4}>
            <Form.Group>
              <Form.Label>Idade:</Form.Label>
              <Form.Control type="text" value={informacoes.idade} onChange={(e) => handleChange("idade", e.target.value)}/>
            </Form.Group>
            </Col>

            <Col xs={12} md={4}>
            <Form.Group>
              <Form.Label>Gênero:</Form.Label>
              <Form.Select value={informacoes.genero} onChange={(e) => handleChange("genero", e.target.value)}>
                <option value="">Selecione o gênero</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Outros">Outros</option>
                <option value="Prefiro não informar">Prefiro não informar</option>
              </Form.Select>
            </Form.Group>
            </Col>

            <Col xs={12} md={4}>
            <Form.Group>
              <Form.Label>Reside com:</Form.Label>
              <Form.Control type="text" value={informacoes.resideCom} onChange={(e) => handleChange("resideCom", e.target.value)} />
            </Form.Group>
            </Col>

            <Col xs={12} md={4}>
            <Form.Group>
              <Form.Label>Email:<span style={{ color: "red" }}>*</span></Form.Label>
              <Form.Control type="email" placeholder="Digite o e-mail" value={informacoes.email} isInvalid={!!erros.email} onChange={(e) => handleChange("email", e.target.value)} />
              <Form.Control.Feedback type="invalid"> {erros.email} </Form.Control.Feedback>
            </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={12} md={4}>
              <Form.Group>
                <Form.Label>CEP:</Form.Label>
                <Form.Control type="text" value={informacoes.cep} onChange={(e) => handleChange("cep", e.target.value)} />
              </Form.Group>
            </Col>

            <Col xs={12} md={4}>
              <Form.Group>
                <Form.Label>Número:</Form.Label>
                <Form.Control type="text" value={informacoes.numero} onChange={(e) => handleChange("numero", e.target.value)} />
              </Form.Group>
            </Col>

            <Col xs={12} md={4}>
              <Form.Group>
                <Form.Label>Complemento:</Form.Label>
                <Form.Control type="text" value={informacoes.complemento} onChange={(e) => handleChange("complemento", e.target.value)}/>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={12} md={4}>
              <Form.Group>
                <Form.Label>Logradouro:</Form.Label>
                <Form.Control type="text" value={informacoes.logradouro} onChange={(e) => handleChange("logradouro", e.target.value)}/>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={12} md={4}>
              <Form.Group>
                <Form.Label>Bairro:</Form.Label>
                <Form.Control type="text" value={informacoes.bairro} onChange={(e) => handleChange("bairro", e.target.value)}/>
              </Form.Group>
            </Col>

            <Col xs={12} md={4}>
              <Form.Group>
                <Form.Label>Cidade:</Form.Label>
                <Form.Control type="text"  value={informacoes.cidade} onChange={(e) => handleChange("cidade", e.target.value )}/>
              </Form.Group>
            </Col>

            <Col xs={12} md={4}>
              <Form.Group>
                <Form.Label>UF:</Form.Label>
                <Form.Control type="text" value={informacoes.uf} onChange={(e) => handleChange("uf", e.target.value)}/>
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



