import React, { useContext } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
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
        ...(prev.saude || {}), // Garante que 'saude' é um objeto
        [field]: value,
      },
    }));
  };

  const handleLaudoChange = (e) => {
    const file = e.target.files[0];
    setDadosFormulario((prev) => ({
      ...prev,
      saude: {
        ...(prev.saude || {}),
        laudo: file,
      },
    }));

    console.log("Arquivo selecionado:", file);
  };

  const handleVoltar = () => navigate("/FormResp");

  const handleProximo = () => {
    console.log("Dados de saúde:", saude);

    if (saude.laudo) {
      console.log("Laudo anexado:", saude.laudo.name);
    } else {
      console.log("Nenhum laudo anexado.");
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
            "Revisao",
          ]}
          etapaAtual={2}
        />

        <Form className="form-box p-4 shadow rounded">
          <Row className="mb-3">
            <Col xs={12} md={3}>
              {/*  ID Adicionado: tipoSanguineo */}
              <Form.Group>
                <Form.Label htmlFor="tipoSanguineo">Tipo Sanguíneo:</Form.Label>
                <Form.Select
                  id="tipoSanguineo"
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

            <Col xs={12} md={3}>
              {/*  ID Adicionado: peso */}
              <Form.Group>
                <Form.Label htmlFor="peso">Peso:</Form.Label>
                <Form.Control
                  type="text"
                  id="peso"
                  value={saude.peso || ""}
                  onChange={(e) => handleChange("peso", e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col xs={12} md={3}>
              {/* ID Adicionado: altura */}
              <Form.Group>
                <Form.Label htmlFor="altura">Altura:</Form.Label>
                <Form.Control
                  type="text"
                  id="altura"
                  value={saude.altura || ""}
                  onChange={(e) => handleChange("altura", e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col xs={12} md={3}>
              <SelectYesNo
                label="Fumante:"
                value={saude.fumante}
                onChange={(e) => handleChange("fumante", e.target.value)}
                id="fumante"
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={12} md={3}>
              <SelectYesNo
                label="Consome álcool:"
                value={saude.alcool}
                onChange={(e) => handleChange("alcool", e.target.value)}
                id="alcool"
              />
            </Col>

            <Col xs={12} md={3}>
              <SelectYesNo
                label="Drogas ilícitas:"
                value={saude.drogas}
                onChange={(e) => handleChange("drogas", e.target.value)}
                id="drogas"
              />
            </Col>

            <Col xs={12} md={3}>
              <SelectYesNo
                label="Gravidez:"
                value={saude.gravidez}
                onChange={(e) => handleChange("gravidez", e.target.value)}
                id="gravidez"
              />
            </Col>

            <Col xs={12} md={3}>
              {/*  Campo corrigido: quantidadeGravidezes */}
              <Form.Group>
                <Form.Label htmlFor="quantidadeGravidezes">
                  Se sim quantas?
                </Form.Label>
                <Form.Control
                  type="text"
                  id="quantidadeGravidezes"
                  value={saude.quantidadeGravidezes || ""} 
                  onChange={(e) =>
                    handleChange("quantidadeGravidezes", e.target.value)
                  } 
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={12} md={12}>
              {/*  ID Adicionado: historicoFamiliar */}
              <Form.Group>
                <Form.Label htmlFor="historicoFamiliar">
                  Histórico de Saúde Familiar:
                </Form.Label>
                <Form.Control
                  type="text"
                  id="historicoFamiliar"
                  value={saude.historicoFamiliar || ""}
                  onChange={(e) =>
                    handleChange("historicoFamiliar", e.target.value)
                  }
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
                id="possuiAlergia"
              />
            </Col>

            <Col xs={12} md={8}>
              {/* ID Adicionado: quaisAlergias */}
              <Form.Group>
                <Form.Label htmlFor="quaisAlergias">Se sim quais?</Form.Label>
                <Form.Control
                  type="text"
                  id="quaisAlergias"
                  value={saude.quaisAlergias || ""}
                  onChange={(e) => handleChange("quaisAlergias", e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={12} md={4}>
              <SelectYesNo
                label="Faz uso continuo de medicamentos:"
                value={saude.medicamentos}
                onChange={(e) => handleChange("medicamentos", e.target.value)}
                id="medicamentos"
              />
            </Col>

            <Col xs={12} md={8}>
              {/*  ID Adicionado: quaisMedicamentos */}
              <Form.Group>
                <Form.Label htmlFor="quaisMedicamentos">
                  Se sim quais?
                </Form.Label>
                <Form.Control
                  type="text"
                  id="quaisMedicamentos"
                  value={saude.quaisMedicamentos || ""}
                  onChange={(e) =>
                    handleChange("quaisMedicamentos", e.target.value)
                  }
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={12} md={4}>
              <SelectYesNo
                label="Possui alguma restrição alimentar:"
                value={saude.restricaoAlimentar}
                onChange={(e) =>
                  handleChange("restricaoAlimentar", e.target.value)
                }
                id="restricaoAlimentar"
              />
            </Col>

            <Col xs={12} md={8}>
              {/*  ID Adicionado: quaisRestricoes */}
              <Form.Group>
                <Form.Label htmlFor="quaisRestricoes">Se sim quais?</Form.Label>
                <Form.Control
                  type="text"
                  id="quaisRestricoes"
                  value={saude.quaisRestricoes || ""}
                  onChange={(e) =>
                    handleChange("quaisRestricoes", e.target.value)
                  }
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={12} md={4}>
              <SelectYesNo
                label="Já realizou alguma cirurgia:"
                value={saude.cirurgia}
                onChange={(e) => handleChange("cirurgia", e.target.value)}
                id="cirurgia"
              />
            </Col>

            <Col xs={12} md={8}>
              {/*  ID Adicionado: quaisCirurgias */}
              <Form.Group>
                <Form.Label htmlFor="quaisCirurgias">Se sim quais?</Form.Label>
                <Form.Control
                  type="text"
                  id="quaisCirurgias"
                  value={saude.quaisCirurgias || ""}
                  onChange={(e) =>
                    handleChange("quaisCirurgias", e.target.value)
                  }
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
                id="possuiLaudo"
              />
            </Col>

            <Col xs={12} md={8}>
              {/*  ID Adicionado: uploadLaudo */}
              <Form.Group>
                <Form.Label htmlFor="uploadLaudo">
                  Se sim realize o upload:
                </Form.Label>
                <Form.Control
                  type="file"
                  id="uploadLaudo"
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