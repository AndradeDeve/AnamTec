import React, { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header/Header";
import NavButtons from "../Components/NavButtons/NavButtons";
import ProgressBar from "../Components/ProgressBar/ProgressBar";
import SelectYesNo from "../Components/SelectYesNo/SelectYesNo";
import "./FormSaude.css";


function FormSaude() {
  const navigate = useNavigate();

  const [tipoSanguineo, setTipoSanguineo] = useState("");
  const [possuiLaudo, setPossuiLaudo] = useState("");
  const [possuiAlergia, setPossuiAlegria] = useState("");
  const [fumante, setFumante] = useState("");
  const [alcool, setAlcool] = useState("");
  const [drogas, setDrogas] = useState("");
  const [medicamentos, setMedicamentos] = useState("");
  const [gravidez, setGravidez] = useState("");
  const [restricaoAlimentar, setRestricaoAlimentar] = useState(""); 
  const [cirurgia, setCirurgia] = useState("");
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
    console.log("Fuamante:", fumante);
    console.log("Consome álcool:", alcool);
    console.log("Drogas:", drogas);
    console.log("Alergia:", possuiAlergia);
    console.log("Medicamentos:", medicamentos);
    console.log("Gravidez:", gravidez);
    console.log("Restrição Alimentar:", restricaoAlimentar);
    console.log("Cirurgia:", cirurgia);

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

      <Form className="form-box p-4 shadow rounded">
          <Row className="mb-3">
            <Col xs={12} md={3}>
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

            <Col xs={12} md={3}>
              <Form.Group>
                <Form.Label>Peso:</Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>

            <Col xs={12} md={3}>
              <Form.Group>
                <Form.Label>Altura:</Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>

            <Col xs={12} md={3}>
              <SelectYesNo
              label="Fumante:"
              value={fumante}
              onChange={(e) => setFumante(e.target.value)}
              controlId="fumante"/>
            </Col>
          </Row> 

          <Row className="mb-3">
            <Col xs={12} md={3}>
              <SelectYesNo
              label="Consome álcool:"
              value={alcool}
              onChange={(e) => setAlcool(e.target.value)}
              controlId="alcool"/>
            </Col>

            <Col xs={12} md={3}>
              <SelectYesNo
              label="Drogas ilícitas:"
              value={drogas}
              onChange={(e) => setDrogas(e.target.value)}
              controlId="drogas"/>
            </Col>

            <Col xs={12} md={3}>
              <SelectYesNo
              label="Gravidez:"
              value={gravidez}
              onChange={(e) => setGravidez(e.target.value)}
              controlId="gravidez"/>
            </Col>

            <Col xs={12} md={3}>
              <Form.Group>
                <Form.Label>Se sim quantas?</Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
             

            <Col xs={12} md={12}>
              <Form.Group>
                <Form.Label>Histórico de Saúde Familiar:</Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">            
            <Col xs={12} md={4}>
              <SelectYesNo
              label="Possui alguma alergia:"
              value={possuiAlergia}
              onChange={(e) => setPossuiAlegria(e.target.value)}
              controlId="possuiAlergia"/>
            </Col>

            <Col xs={12} md={8}>
              <Form.Group>
                <Form.Label>Se sim quais?</Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={12} md={4}>
              <SelectYesNo
              label="Faz uso continuo de medicamentos:"
              value={medicamentos}
              onChange={(e) => setMedicamentos(e.target.value)}
              controlId="medicamentos"/>
            </Col>

            <Col xs={12} md={8}>
              <Form.Group>
                <Form.Label>Se sim quais?</Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">            
            <Col xs={12} md={4}>
              <SelectYesNo
              label="Possui alguma restrição alimentar:"
              value={restricaoAlimentar}
              onChange={(e) => setRestricaoAlimentar(e.target.value)}
              controlId="restricaoAlimentar"/>
            </Col>

            <Col xs={12} md={8}>
              <Form.Group>
                <Form.Label>Se sim quais?</Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">            
            <Col xs={12} md={4}>
              <SelectYesNo
              label="Já realizou alguma cirgurgia:"
              value={cirurgia}
              onChange={(e) => setCirurgia(e.target.value)}
              controlId="cirurgia"/>
            </Col>

            <Col xs={12} md={8}>
              <Form.Group>
                <Form.Label>Se sim quais?</Form.Label>
                <Form.Control type="text" />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={12} md={4}>
              <SelectYesNo
              label="Possui laudo:"
              value={possuiLaudo}
              onChange={(e) => setPossuiLaudo(e.target.value)}
              controlId="possuiLaudo"/>
            </Col>

            <Col xs={12} md={8}>
            <Form.Group controlId="formfile">
              <Form.Label>Se sim realize o upload:</Form.Label>
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