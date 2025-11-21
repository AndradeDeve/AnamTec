import React, { useState, useEffect, useContext } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

  const [erros, setErros] = useState({});

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

const camposObrigatorios = [
    "possuiAlergia",
    "gravidez",
    "fumante",
    "alcool",
    "drogas",
    "restricaoAlimentar", 
    "tipoSanguineo",
    "medicamentos",
    "cirurgia",
    "possuiLaudo"
  ];


  const handleVoltar = () => navigate("/FormResp");

  const handleProximo = () => {
    if (!validarFormulario()) {
      toast.error("Preencha todos os campos obrigatórios!");
      return;
    }
    console.log("Dados de saúde:", saude);
    
    if (saude.laudo) {
      console.log("Laudo anexado:", saude.laudo);
    } else {
      console.log("Nenhum laudo anexado.")
    }
    navigate("/FormComportEmocio");
  };

  const validarFormulario = () => {
  let valid = true;
  let novosErros = {};

  camposObrigatorios.forEach((campo) => {
    if (!saude[campo] || saude[campo].trim() === "") {
      valid = false;
      novosErros[campo] = "Campo obrigatório";
    }
  });


  if (saude.gravidez === "sim" && !(saude.quantidadeGravidez?.trim() || "")) {
      valid = false;
      novosErros.quantidadeGravidez = "Campo obrigatório";
    }
  if (saude.medicamentos === "sim" && !(saude.qualMedicamento?.trim() || "")) {
      valid = false;
      novosErros.qualMedicamento = "Campo obrigatório";
    }

    if (saude.possuiAlergia === "sim" && !(saude.qualAlergia?.trim() || "")) {
      valid = false;
      novosErros.qualAlergia = "Campo obrigatório";
    }

    if (saude.restricaoAlimentar === "sim" && !(saude.qualRestricao?.trim() || "")) {
      valid = false;
      novosErros.qualRestricao = "Campo obrigatório";
    }

    if (saude.cirurgia === "sim" && !(saude.qualCirurgia?.trim() || "")) {
      valid = false;
      novosErros.qualCirurgia = "Campo obrigatório";
    }

    setErros(novosErros);
    return valid;
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
              <Form.Label>Tipo Sanguíneo:<span style={{ color: "red"}}>*</span></Form.Label>
                <Form.Select 
                value={saude.tipoSanguineo} 
                onChange={(e) => handleChange("tipoSanguineo", e.target.value)}
                isInvalid={!!erros.tipoSanguineo} 
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
                <Form.Control.Feedback type="invalid">
                  {erros.tipoSanguineo}
                </Form.Control.Feedback>
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
              label={
              <>
              Fumante: <span style={{ color: "red" }}>*</span>
              </>
              }
              value={saude.fumante}
              onChange={(e) => handleChange("fumante", e.target.value)}
              controlId="fumante"
              error={erros.fumante}
            />
            </Col>

            <Col xs={12} md={4}>
              <Form.Group>
              <Form.Label>Consome bebidas alcoolicas?<span style={{ color: "red" }}>*</span></Form.Label>
                <Form.Select 
                value={saude.alcool} 
                onChange={(e) => handleChange("alcool", e.target.value)} 
                isInvalid={!!erros.alcool}
                className="border p-2 rounded"
              >
                  <option value="">Selecione</option>
                  <option value="sim">Sim</option>
                  <option value="nao">Não</option>
                  <option value="eventualmente">Eventualmente</option>
                </Form.Select>

                <Form.Control.Feedback type="invalid">
                  {erros.alcool}
                </Form.Control.Feedback>
            </Form.Group>
            </Col>

            <Col xs={12} md={4}>
              <SelectYesNo
              label= {
                <>
                Drogas ilícitas:<span style={{ color: "red"}}>*</span>
                </>
              }
              value={saude.drogas}
              onChange={(e) => handleChange("drogas", e.target.value)}
              controlId="drogas"
              error={erros.drogas}
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={12} md={4}>
              <SelectYesNo
              label={
                <>
                Gravidez: <span style={{ color: "red"}}>*</span>
                </>
              }
              value={saude.gravidez}
              onChange={(e) => handleChange("gravidez", e.target.value)}
              controlId="gravidez"
              error={erros.gravidez}
              />
            </Col>

            <Col xs={12} md={8}>
              <Form.Group>
                <Form.Label>Se sim quantas?</Form.Label>
                <Form.Control 
                type="text"
                value={saude.quantidadeGravidez || ""}
                isInvalid={!!erros.quantidadeGravidez}
                onChange={(e) => handleChange("quantidadeGravidez", e.target.value)} 
              />
              <Form.Control.Feedback type="invalid">
                {erros.quantidadeGravidez}
              </Form.Control.Feedback>
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
              label={
                <>
                Faz uso continuo de medicamentos: <span style={{ color: "red" }}>*</span>
                </>
              }
              value={saude.medicamentos}
              onChange={(e) => handleChange("medicamentos", e.target.value)}
              controlId="medicamentos"
              error={erros.medicamentos}
              />
            </Col>

            <Col xs={12} md={8}>
              <Form.Group>
                <Form.Label>Se sim quais?</Form.Label>
                <Form.Control 
                type="text" 
                value={saude.qualMedicamento || ""}
                isInvalid={!!erros.qualMedicamento}
                onChange={(e) => handleChange("qualMedicamento", e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  {erros.qualMedicamento}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          
          <Row className="mb-3">            
            <Col xs={12} md={4}>
              <SelectYesNo
              label={
              <>
              Possui alguma alergia: <span style={{ color: "red" }}>*</span>
              </>
              }
              value={saude.possuiAlergia}
              onChange={(e) => handleChange("possuiAlergia", e.target.value)}
              controlId="possuiAlergia"
              error={erros.possuiAlergia}
              />
            </Col>

            <Col xs={12} md={8}>
              <Form.Group>
                <Form.Label>Se sim quais?</Form.Label>
                <Form.Control 
                type="text"
                value={saude.qualAlergia || ""}
                isInvalid={!!erros.qualAlergia}
                onChange={(e) => handleChange("qualAlergia", e.target.value)}
                />
              <Form.Control.Feedback type="invalid">
                {erros.qualAlergia}
              </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">            
            <Col xs={12} md={4}>
              <SelectYesNo
              label={
                <>
                Possui alguma restrição alimentar: <span style={{ color: "red" }}>*</span>
                </>
              }
              value={saude.restricaoAlimentar}
              onChange={(e) => handleChange("restricaoAlimentar", e.target.value)}
              controlId="restricaoAlimentar"
              error={erros.restricaoAlimentar}
              />
            </Col>

            <Col xs={12} md={8}>
              <Form.Group>
                <Form.Label>Se sim quais?</Form.Label>
                <Form.Control 
                type="text"
                value={saude.qualRestricao || ""}
                isInvalid={!!erros.qualRestricao}
                onChange={(e) => handleChange("qualRestricao", e.target.value)}
                />
              <Form.Control.Feedback type="invalid">
                {erros.qualRestricao}
              </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">            
            <Col xs={12} md={4}>
              <SelectYesNo
              label={
                <>
                Já realizou alguma cirgurgia: <span style={{ color: "red" }}>*</span>
                </>
              }
              value={saude.cirurgia}
              onChange={(e) => handleChange("cirurgia", e.target.value)}
              controlId="cirurgia"
              error={erros.cirurgia}
              />
            </Col>

            <Col xs={12} md={8}>
              <Form.Group>
                <Form.Label>Se sim quais?</Form.Label>
                <Form.Control 
                type="text"
                value={saude.qualCirurgia || ""}
                isInvalid={!!erros.qualCirurgia}
                onChange={(e) => handleChange("qualCirurgia", e.target.value)} 
                />
              <Form.Control.Feedback type="invalid">
                {erros.qualCirurgia}
              </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={12} md={4}>
              <SelectYesNo
              label={
              <>
              Possui laudo: <span style={{ color: "red" }}>*</span>
              </>
              }
              value={saude.possuiLaudo}
              onChange={(e) => handleChange("possuiLaudo", e.target.value)}
              controlId="possuiLaudo"
              error={erros.possuiLaudo}
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