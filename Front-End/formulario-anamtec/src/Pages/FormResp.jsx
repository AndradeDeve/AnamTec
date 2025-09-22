import React, {useContext, useState} from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header/Header";
import NavButtons from "../Components/NavButtons/NavButtons";
import ProgressBar from "../Components/ProgressBar/ProgressBar";
import { FormContext } from "../Context/FormContext";
import "../Styles/FormResp.css"


function FormResp() {
  const navigate = useNavigate();

  const { dadosFormulario, setDadosFormulario } = useContext(FormContext);

  const responsaveis = dadosFormulario.responsaveis;

  const handleAddResponsaveis = () => {
    setDadosFormulario((prev) => ({
      ...prev,
      responsaveis: [
        ...responsaveis,
        { nome: "", parentesco: "", telefone: "", estadoCivil: "", email: ""},
      ],
    }));
  };

  const handleChange = (index, field, value) => {
    const novosResponsaveis = [...responsaveis];
    novosResponsaveis[index][field] = value;

    setDadosFormulario(prev => ({
      ...prev,
      responsaveis: novosResponsaveis
    }));
  };

  const handleRemove = (index) => {
    const novosResponsaveis = responsaveis.filter((_, i) => i !== index);
    setDadosFormulario(prev => ({
      ...prev,
      responsaveis: novosResponsaveis
    }));
  };

  const handleVoltar = () => navigate("/FormInform");

  const handleProximo = () => navigate("/FormSaude");

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
          etapaAtual={1}
        />

        <Form className="form-box shadow rounded p-4">
          {responsaveis.map((responsavel, index) => (
            <div key={index} className="mb- border-b pb-4 relative">
                <h3 className="font-semibold mb-2">Responsável {index + 1}</h3>

                <Row className="mb-3">
                    <Col xs={12} md={6}>
                      <Form.Group>
                          <Form.Label>Nome do Responsável:</Form.Label>
                          <Form.Control type="text" placeholder="Digite o nome" value={responsavel.nome} onChange={(e) => handleChange(index, "nome", e.target.value)} 
                        />
                      </Form.Group>
                    </Col>
                  
                    <Col xs={12} md={6}>
                      <Form.Group>
                        <Form.Label>Parentesco:</Form.Label>
                          <Form.Select
                            value={responsavel.parentesco} onChange={(e) =>
                            handleChange(index, "parentesco", e.target.value)}>
                            <option value="">Selecione o parentesco</option>
                            <option value="Pai">Pai</option>
                            <option value="Mãe">Mãe</option>
                            <option value="Avô">Avô</option>
                            <option value="Avó">Avó</option>
                            <option value="Outros">Outros</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col xs={12} md={4}>
                          <Form.Group>
                            <Form.Label>Telefone:</Form.Label>
                            <Form.Control type="text" value={responsavel.telefone} onChange={(e) =>
                              handleChange(index, "telefone", e.target.value)} 
                          />
                          </Form.Group>
                        </Col>

                        <Col xs={12} md={4}>
                          <Form.Group>
                            <Form.Label>Estado Civil:</Form.Label>
                              <Form.Select
                                value={responsavel.estadoCivil} onChange={(e) =>
                                handleChange(index, "estadoCivil", e.target.value)}>
                                <option value="">Selecio</option>
                                <option value="Solteiro(a)">Solteiro(a)</option>
                                <option value="Casado(a)">Casado(a)</option>
                                <option value="Divorciado(a)">Divorsiado(a)</option>
                                <option value="Viúvo(a)">Viúvo(a)</option>
                              </Form.Select>
                          </Form.Group>
                        </Col>
                        
                        <Col xs={12} md={4}>
                          <Form.Group>
                            <Form.Label>E-mail:</Form.Label>
                            <Form.Control type="email" placeholder="Digite o e-mail" value={responsavel.email} onChange={(e) =>
                              handleChange(index, "email", e.target.value)} 
                          />
                          </Form.Group>
                        </Col>
                    </Row>
                        
    
                <div className="text-center mt-6">
                {responsaveis.length > 1 && (
                <button type="button" onClick={() => handleRemove(index)}
                className="custom-btn-resp">
                    Remover
                </button> 
                )}
                </div>
            </div>
          ))}
      
        <div className="text-center mt-6">
            <button type="button" onClick={handleAddResponsaveis} className="custom-btn-resp">
                + Adiconar Responsável
            </button>
        </div>

        <NavButtons onVoltar={handleVoltar} onProximo={handleProximo} />

        </Form>
      </Container>
    </>
  );
}

export default FormResp;