import React, {useContext, useState} from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header/Header";
import NavButtons from "../Components/NavButtons/NavButtons";
import ProgressBar from "../Components/ProgressBar/ProgressBar";
import { FormContext } from "../Context/FormContext";
import InputMask from "react-input-mask";
import "../Styles/FormResp.css"


function FormResp() {
  const navigate = useNavigate();
  const { dadosFormulario, setDadosFormulario } = useContext(FormContext);

  const { responsavel } = dadosFormulario;

  const [erros, setErros] = useState({});

  const handleAddResponsavel = () => {
    setDadosFormulario((prev) => ({
      ...prev,
      responsavel: [
        ...responsavel,
        { nome: "", cpf: "", parentesco: "", telefone: "", estadoCivil: "", email: ""},
      ],
    }));
  };

  const handleRemove = () => {
    if (responsavel.length > 0) {
      const novosResponsavel = responsavel.slice(0, -1);
      setDadosFormulario(prev => ({
        ...prev,
        responsavel: novosResponsavel
      }));
    }
  };

  const handleChange = (index, field, value) => {
    const novos = [...responsavel];
    novos[index][field] = value;

    setDadosFormulario(prev => ({
      ...prev,
      responsavel: novos
    }));

    setErros((prev) => ({ ...prev, [`${index}-${field}`]: ""}));
  };

  const camposObrigatorios = [
    "nome",
    "cpf",
    "email", 
    "telefone",
  ];

const validarFomulario = () => {
      let valid = true;
      let novosErros = {};

    responsavel.forEach((resp, index) => {
      camposObrigatorios.forEach((campo) => {
        if (!resp[campo] || resp[campo].trim() === "") {
          valid = false;
          novosErros[`${index}-${campo}`] = "Campo obrigatório";
        }
      });

      if (resp.email) {
      const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(!regexEmail.test(resp.email)) {
        valid = false;
        novosErros[`${index}-email`] = "Digite um e-mail válido";
      }
    }
  });
  
    setErros(novosErros);
    return valid;
  };

  const handleVoltar = () => {
    navigate("/FormInform");
  }

  const handleProximo = () => {
      if (!validarFomulario()) {
        toast.error("Preencha todos os campos obrigatorios corretamente!");
        return;
      }

     navigate("/FormSaude");
  };

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
            "Revisao"
          ]}
          etapaAtual={1}
        />

        <Form className="form-box shadow rounded p-4">
          {responsavel.map((resp, index) => (
            <div key={index} className="mb-4 border-b pb-4 relative">
                <h3 className="font-semibold mb-2">Responsável {index + 1}</h3>

                <Row className="mb-3">
                  <Col xs={12} md={7}>
                    <Form.Group>
                        <Form.Label>Nome do Responsável:<span style={{ color: "red"}}>*</span></Form.Label>
                        <Form.Control type="text" placeholder="Digite o nome" value={resp.nome} isInvalid={!!erros[`${index}-nome`]} onChange={(e) => handleChange(index, "nome", e.target.value)}
                      />
                      <Form.Control.Feedback type="invalid">
                          {erros[`${index}-nome`]}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col xs={12} md={5}>
                    <Form.Group>
                      <Form.Label>CPF:<span style={{ color: "red"}}>*</span></Form.Label>
                    
                        <InputMask mask="999.999.999-99" value={resp.cpf || ""} onChange={(e) => handleChange(index, "cpf", e.target.value)}
                        >
                          {(inputProps) => (
                          <Form.Control {...inputProps} type="text" placeholder="000.000.000-00" isInvalid={!!erros[`${index}-cpf`]} 
                           />
                          )}
                        </InputMask>
                    
                    <Form.Control.Feedback type="invalid">
                        {erros[`${index}-cpf`]}
                    </Form.Control.Feedback>
                  </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col xs={12} md={7}>
                    <Form.Group>
                      <Form.Label>E-mail:<span style={{ color: "red"}}>*</span></Form.Label>
                      <Form.Control type="email" placeholder="Digite o e-mail" value={resp.email} isInvalid={!!erros[`${index}-email`]} onChange={(e) =>
                        handleChange(index, "email", e.target.value)} 
                        />
                      
                      <Form.Control.Feedback type="invalid">
                          {erros[`${index}-nome`]}
                      </Form.Control.Feedback>
                    </Form.Group>
                 </Col>

                 <Col xs={12} md={5}>
                    <Form.Group>
                      <Form.Label>Telefone:<span style={{ color: "red"}}>*</span></Form.Label>
                      <Form.Control type="text" value={resp.telefone} isInvalid={!!erros[`${index}-telefone`]} onChange={(e) =>
                           handleChange(index, "telefone", e.target.value)} 
                      />
                      <Form.Control.Feedback type="invalid">
                          {erros[`${index}-telefone`]}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col xs={12} md={7}>
                    <Form.Group>
                      <Form.Label>Parentesco:</Form.Label>
                        <Form.Select
                          value={resp.parentesco} onChange={(e) =>
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

                  <Col xs={12} md={5}>
                    <Form.Group>
                      <Form.Label>Estado Civil:</Form.Label>
                        <Form.Select
                          value={resp.estadoCivil} onChange={(e) =>
                          handleChange(index, "estadoCivil", e.target.value)}>
                            <option value="">Selecione</option>
                            <option value="Solteiro(a)">Solteiro(a)</option>
                            <option value="Casado(a)">Casado(a)</option>
                            <option value="Divorciado(a)">Divorsiado(a)</option>
                            <option value="Viúvo(a)">Viúvo(a)</option>
                       </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </div>
          ))}
        
          <div className="btn-wrapper">
            <button type="button" onClick={handleAddResponsavel} className="custom-btn-resp">
                + Adicionar Responsável
            </button>

                {responsavel.length > 0 && (
                <button type="button" onClick={handleRemove}
                className="custom-btn-resp">
                  Remover
                </button>
                )}
        </div>

        <NavButtons onVoltar={handleVoltar} onProximo={handleProximo} />
        </Form>
      </Container>
    </>
  );
}

export default FormResp;