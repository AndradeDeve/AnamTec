import React, { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header/Header";
import NavButtons from "../Components/NavButtons/NavButtons";
import ProgressBar from "../Components/ProgressBar/ProgressBar";


function FormSaude() {
  const navigate = useNavigate();

  const [tipoSanguineo, setTipoSanguineo] = useState("");
  const [possuiLaudo, setPossuiLaudo] = useState("");
  const [laudo,setLaudo] = useState(null);

  const handleTipoSanguineoChange = (e) => setTipoSanguineo(e.target.value);
  const handleLaudoChange = (e) => {
    const file = e.target.files[0];
    setLaudo(file);
    console.log("Arquivo selecionado:", file);
  };

  const handleVoltar = () => navigate("/FormResp");
  const handleProximo = () => {
    console.log("Tipo sanguíneo:", tipoSanguineo);
    console.log("Possui laudo:", possuiLaudo);
    if (laudo) {
      console.log("Laudo anexado:", laudo);
    } else {
      console.log("Nenhum laudo anexado.")
    }
    navigate("/FormComportEmocio");
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
        "Aspectos Comportamentais e Emocionais"
      ]}
      etapaAtual={2}
      />

      <Form className="form-box">
          <Row className="mb-3">
            <Col md={6}>
            <Form.Group>
              <Form.Label>Tipo Sanguíneo:</Form.Label>
                <Form.Select value={tipoSanguineo} onChange={handleTipoSanguineoChange} className="border p-2 rounded">
                  <option value="">Selecione</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </Form.Select>
            </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label>Peso:</Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label>Gravidez:</Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>
          </Row> 

          <Row className="mb-3">
            <Col md={3}>
              <Form.Group>
                <Form.Label>Fumante:</Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label>Consome álcool:</Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label>Drogas ilícitas:</Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={3}>
              <Form.Group>
                <Form.Label>Possui algum problema de saúde diagnosticado:</Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label>Quais?</Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label>Possui laudo:</Form.Label>
                <Form.Select value={possuiLaudo} onChange={(e) => setPossuiLaudo(e.target.value)}>
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb3">
            <Col md={6}>
            <Form.Group controlId="formfile">
              <Form.Label>Laudo médico:</Form.Label>
              <Form.Control type="file" accept=".pdf, .jpg, .jpe, .png" onChange={handleLaudoChange} />
              {laudo && (
                <p className="mt-2 text-success">
                  Arquivo selecionado {laudo.name}
                </p>
              )}
            </Form.Group>
            </Col>
          </Row>
        
          <NavButtons onVoltar={handleVoltar} onProximo={handleProximo} />
        </Form>
      </Container>
    </>
  );
}

export default FormSaude;