import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Form, Toast } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header/Header";
import NavButtons from "../Components/NavButtons/NavButtons";
import ProgressBar from "../Components/ProgressBar/ProgressBar";
import SelectYesNo from "../Components/SelectYesNo/SelectYesNo";
import { FormContext } from "../Context/FormContext";
import "../Styles/FormSaude.css";


function FormSaude() {
  const navigate = useNavigate();

  const { dadosFormulario, setDadosFormulario } = useContext(FormContext);

  const saude = dadosFormulario.saude;

  const handleChange = (field, value) => {
    setDadosFormulario((prev) => ({
      ...prev,
      saude: {
        ...prev.saude,
        [field]: value,
      },
    }));
  };
  
  const handleLaudoChange = (e) => {
    const file = e.target.files[0];
    setDadosFormulario((prev) => ({
      ...prev, 
      saude: {
        ...prev.saude,
        laudo:file,
   },
  }));

  console.log("Arquivo selecionado:", file);
};

  const handleVoltar = () => navigate("/FormResp");

  const handleProximo = () => {
    console.log("Dados de saúde:", saude);
    
    if (saude.laudo) {
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
        "Aspectos Comportamentais e Emocionais",
        "Revisao"
      ]}
      etapaAtual={2}
      />

      <Form className="form-box p-4 shadow rounded">

        <h5 className="mb-3">Histórico de Saúde Pessoal</h5>

          <Row className="mb-3">
            <Col xs={12} md={4}>
            <Form.Group>
              <Form.Label>Tipo Sanguíneo:</Form.Label>
                <Form.Select 
                value={saude.tipoSanguineo} 
                onChange={(e) => handleChange("tipoSanguineo", e.target.value)} 
                className="border p-2 rounded"
              >
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

            <Col xs={12} md={4}>
              <Form.Group>
                <Form.Label>Peso:</Form.Label>
                <Form.Control 
                type="text"
                value={saude.peso || ""}
                onChange={(e) => handleChange("peso", e.target.value)}
              />
              </Form.Group>
            </Col>

            <Col xs={12} md={4}>
              <Form.Group>
                <Form.Label>Altura:</Form.Label>
                <Form.Control 
                type="text"
                value={saude.altura || ""}
                onChange={(e) => handleChange("altura", e.target.value)} 
              />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={12} md={4}>
              <SelectYesNo
              label="Fumante:"
              value={saude.fumante}
              onChange={(e) => handleChange(e.target.value)}
              controlId="fumante"
            />
            </Col>

            <Col xs={12} md={4}>
              <Form.Group>
              <Form.Label>Consome bebidas alcoolicas?</Form.Label>
                <Form.Select 
                value={saude.alcool} 
                onChange={(e) => handleChange("alcool", e.target.value)} 
                className="border p-2 rounded"
              >
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                  <option value="eventualmente">Eventualmente</option>
                </Form.Select>
            </Form.Group>
            </Col>

            <Col xs={12} md={4}>
              <SelectYesNo
              label="Drogas ilícitas:"
              value={saude.drogas}
              onChange={(e) => handleChange(e.target.value)}
              controlId="drogas"/>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={12} md={4}>
              <SelectYesNo
              label="Gravidez:"
              value={saude.gravidez}
              onChange={(e) => handleChange(e.target.value)}
              controlId="gravidez"/>
            </Col>

            <Col xs={12} md={8}>
              <Form.Group>
                <Form.Label>Se sim quantas?</Form.Label>
                <Form.Control 
                type="text"
                value={saude.quantidadegravidezes || ""}
                onChange={(e) => handleChange("quantidadeGravidezes", e.target.value)} 
              />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={12} md={12}>
              <Form.Group>
                <Form.Label>Histórico de Saúde Familiar:</Form.Label>
                <Form.Control 
                type="text"
                value={saude.historicoFamiliar || ""}
                onChange={(e) => handleChange("historicoFamiliar", e.target.value)}
              />
              </Form.Group>
            </Col>
          </Row>

          <h5 className="mb-3">Medicamentos e Alergias</h5>

          <Row className="mb-3">
            <Col xs={12} md={4}>
              <SelectYesNo
              label="Faz uso continuo de medicamentos:"
              value={saude.medicamentos}
              onChange={(e) => handleChange("medicamnetos", e.target.value)}
              controlId="medicamentos"
              />
            </Col>

            <Col xs={12} md={8}>
              <Form.Group>
                <Form.Label>Se sim quais?</Form.Label>
                <Form.Control 
                type="text" 
                value={saude.quaisMedicamentos || ""}
                onChange={(e) => handleChange("quaisMedicamentos", e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          
          <Row className="mb-3">            
            <Col xs={12} md={4}>
              <SelectYesNo
              label="Possui alguma alergia:"
              value={saude.possuiAlergia}
              onChange={(e) => handleChange("possuiAlergia", e.target.value)}
              controlId="possuiAlergia"
              />
            </Col>

            <Col xs={12} md={8}>
              <Form.Group>
                <Form.Label>Se sim quais?</Form.Label>
                <Form.Control 
                type="text"
                value={saude.quaisAlergias || ""}
                onChange={(e) => handleChange("quaisAlergias", e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">            
            <Col xs={12} md={4}>
              <SelectYesNo
              label="Possui alguma restrição alimentar:"
              value={saude.restricaoAlimentar}
              onChange={(e) => handleChange("restricaoAlimentar", e.target.value)}
              controlId="restricaoAlimentar"
              />
            </Col>

            <Col xs={12} md={8}>
              <Form.Group>
                <Form.Label>Se sim quais?</Form.Label>
                <Form.Control 
                type="text"
                value={saude.quaisRestricoes || ""}
                onChange={(e) => handleChange("quaisRestricoes", e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">            
            <Col xs={12} md={4}>
              <SelectYesNo
              label="Já realizou alguma cirgurgia:"
              value={saude.cirurgia}
              onChange={(e) => handleChange("cirurgia", e.target.value)}
              controlId="cirurgia"
              />
            </Col>

            <Col xs={12} md={8}>
              <Form.Group>
                <Form.Label>Se sim quais?</Form.Label>
                <Form.Control 
                type="text"
                value={saude.quaisCirurgias || ""}
                onChange={(e) => handleChange("quaisCirurgias", e.target.value)} 
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={12} md={4}>
              <SelectYesNo
              label="Possui laudo:"
              value={saude.possuiLaudo}
              onChange={(e) => handleChange("possuiLaudo", e.target.value)}
              controlId="possuiLaudo"
              />
            </Col>

            <Col xs={12} md={8}>
            <Form.Group controlId="formfile">
              <Form.Label>Se sim, realize o upload:</Form.Label>
              <Form.Control 
              type="file" 
              accept=".pdf, .jpg, .jpe, .png" 
              onChange={handleLaudoChange} 
            />
              {saude.laudo && (
                <p className="mt-2 text-success">
                  Arquivo selecionado: {saude.laudo.name}
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