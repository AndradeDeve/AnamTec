import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {FormContext} from "../Context/FormContext";
import { useContext } from "react";
import Header from "../Components/Header/Header";
import NavButtons from "../Components/NavButtons/NavButtons";
import ProgressBar from "../Components/ProgressBar/ProgressBar";
import InputMask from "react-input-mask";
import "../Styles/FormInform.css";

function FormInform() {
  const navigate = useNavigate();

  const { dadosFormulario, setDadosFormulario } = useContext(FormContext);

  const [erros, setErros] = useState({});
  const [showToast, setShowToast] = useState(false);

  const camposObrigatorios = [
    "nome",
    "cpf",
    "rm",
    "curso",
    "dataNascimento",
    "turno",
    "modulo",
    "email",
    "cep",
  ];

  // Combina blocos para facilitar leitura no JSX
  const informacoes = {
    ...((dadosFormulario && dadosFormulario.alunoInformacoes) || {}),
    ...((dadosFormulario && dadosFormulario.logradouroInformacoes) || {}),
    ...((dadosFormulario && dadosFormulario.cursoInformacoes) || {}),
  };

  const handleChange = (field, value) => {
    const cursoFields = ["curso", "turno", "modulo"];
    const logradouroFields = ["cep", "numero", "complemento", "logradouro", "bairro", "cidade", "uf"];

    if (cursoFields.includes(field)) {
      setDadosFormulario(prev => ({
        ...prev,
        cursoInformacoes: {
          ...((prev && prev.cursoInformacoes) || {}),
          [field]: value,
        }
      }));
    } else if (logradouroFields.includes(field)) {
      setDadosFormulario(prev => ({
        ...prev,
        logradouroInformacoes: {
          ...((prev && prev.logradouroInformacoes) || {}),
          [field]: value,
        }
      }));
    } else {
      setDadosFormulario(prev => ({
        ...prev,
        alunoInformacoes: {
          ...((prev && prev.alunoInformacoes) || {}),
          [field]: value,
        }
      }));
    }

    setErros(prev => ({ ...prev, [field]: "" }));
    setShowToast(false);
  };

  const buscarCEP = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();
        console.log("Resposta ViaCEP:", data);

        if (!data.erro) {
          setDadosFormulario((prev) => ({
            ...prev,
            logradouroInformacoes: {
              ...((prev && prev.logradouroInformacoes) || {}),
              logradouro: data.logradouro || "",
              bairro: data.bairro || "",
              cidade: data.localidade || "",
              uf: data.uf || ""
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
      toast.error("⚠️ Preencha todos os campos obrigatorios corretamente!");
      return;
    }

    console.log("Enviando para o banco:", informacoes);
    navigate("/FormResp");
  };

  const handleVoltar = () => navigate("/");
  
  return (
    <>
    <Header />

    <Container className="mt-3">
      <ProgressBar 
      etapas={[
        "Informações Principais",
        "Dados do Responsável",
        "Histórico de Saúde",
        "Aspectos Comportamentais e Emocionais",
        "Revisão"
      ]}
      etapaAtual={0}
      />

      <Form className="form-box p-4 shadow rounded" 
      onSubmit={(e) => { 
        e.preventDefault(); 
        handleProximo();
        }}
      >
        
        <h5 className="mb-3">Dados Pessoais</h5>

          <Row className="mb-3">
          <Col xs={12} md={7}>
            <Form.Group>
              <Form.Label>Nome:<span style={{ color: "red"}}>*</span></Form.Label>
              <Form.Control 
              type="text" 
              placeholder="Digite o nome" 
              value={informacoes.nome} 
              isInvalid={!!erros.nome} 
              onChange={(e) => handleChange("nome", e.target.value)} 
            />
              <Form.Control.Feedback type="invalid">{erros.nome}</Form.Control.Feedback>
            </Form.Group>
            </Col>

            <Col xs={12} md={5}>
              <Form.Group>
                <Form.Label>CPF:<span style={{ color: "red"}}>*</span></Form.Label>

                <InputMask mask="999.999.999-99" value={informacoes.cpf || ""} onChange={(e) => handleChange("cpf", e.target.value)}
              >
                {(inputProps) => (
                  <Form.Control {...inputProps} type="text" placeholder="000.000.000-00" isInvalid={!!erros.cpf} 
                  />
                )}
                </InputMask>

                <Form.Control.Feedback type="invalid">
                  {erros.cpf}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>  
          
          <Row className="mb-3">
            <Col xs={12} md={7}>
            <Form.Group>
              <Form.Label>Email:<span style={{ color: "red" }}>*</span></Form.Label>
              <Form.Control type="email" placeholder="Digite o e-mail" value={informacoes.email} isInvalid={!!erros.email} onChange={(e) => handleChange("email", e.target.value)} />
              <Form.Control.Feedback type="invalid"> {erros.email} </Form.Control.Feedback>
            </Form.Group>
            </Col>

            <Col xs={12} md={5}>
             <Form.Group>
              <Form.Label>Data de Nascimento:<span style={{ color: "red" }}>*</span></Form.Label>
              <Form.Control type="date" value={informacoes.dataNascimento} isInvalid={!!erros.dataNascimento} onChange={(e) => handleChange("dataNascimento", e.target.value)}/>
              <Form.Control.Feedback type="invalid">{erros.dataNascimento}</Form.Control.Feedback>
            </Form.Group>
            </Col>
          </Row>
          
          <Row className="mb-3">
            <Col xs={12} md={7}>
            <Form.Group>
              <Form.Label>Reside com:</Form.Label>
              <Form.Control type="text" value={informacoes.resideCom} onChange={(e) => handleChange("resideCom", e.target.value)} />
            </Form.Group>
            </Col>

            <Col xs={12} md={5}>
            <Form.Group>
              <Form.Label>Telefone:<span style={{ color: "red" }}>*</span></Form.Label>
              <Form.Control 
              type="text" 
              placeholder="Digite o telefone:" 
              value={informacoes.telefone} 
              isInvalid={!!erros.telefone} 
              onChange={(e) => handleChange("telefone", e.target.value)} />
              <Form.Control.Feedback type="invalid"> {erros.telefone} </Form.Control.Feedback>
            </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={12} md={7}>
              <Form.Group>
                <Form.Label>Etnia:</Form.Label>
                <Form.Select value={informacoes.etnia} onChange={(e) => handleChange("etnia", e.target.value)}>
                  <option value="">Selecione a etnia</option>
                  <option value="Negro(a)">Negro(a)</option>
                  <option value="Pardo(a)">Pardo(a)</option>
                  <option value="Branco(a)">Branco(a)</option>
                  <option value="Amarelo(a)">Amarelo(a)</option>
                  <option value="Indígena(a)">Indígena</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col xs={12} md={5}>
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
          </Row>    

          <h5 className="mt-5 mb-3">Informações do Curso</h5>      

          <Row className="mb-3">
            <Col xs={12} md={7}>
              <Form.Group>
              <Form.Label>Curso:<span style={{ color: "red" }}>*</span></Form.Label>
              <Form.Select value={informacoes.curso}  isInvalid={!!erros.curso} onChange={(e) => handleChange("curso", e.target.value)}>
                <option value="">Selecione o curso</option>
                <option value="Administração">Administração</option>
                <option value="Administração (Ensino médio)">Administração - Ensino Médio</option>
                <option value="Contabilidade">Contabilidade</option>
                <option value="Recursos Humanos">Recursos Humanos</option>
                <option value="Desenvolvimento de Sistemas">Desenvolvimentos de Sistemas</option>
                <option value="Desenvolvimento de Sistemas (Ensino médio)">Desenvolvimento de Sistemas - Ensino Médio</option>
                <option value="Redes de Computadores">Redes de Computadores</option>
                <option value="Redes de Computadores (Ensino médio)">Redes de Computadores - Ensino médio</option>
                <option value="Informática">Informática</option>
                <option value="Eletroeletrônica">Eletoreletrônica</option>
                <option value="Automação Industrial (Ensino Médio)">Automação Idustrial - Ensino Médio</option>
                <option value="Agenciamento de viagens">Agenciamento de viagens</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid"> {erros.curso} </Form.Control.Feedback>  
            </Form.Group>
            </Col>

            <Col xs={12} md={5}>
              <Form.Group>
                <Form.Label>RM:<span style={{ color: "red" }}>*</span></Form.Label>
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
          </Row>
            
          <Row className="mb-3">  
            <Col xs={12} md={7}>
            <Form.Group>
              <Form.Label>Módulo:<span style={{ color: "red" }}>*</span></Form.Label>
              <Form.Select value={informacoes.modulo} isInvalid={!!erros.modulo} onChange={(e) => handleChange("modulo", e.target.value)}>
                <option value="">Selecione o módulo</option>
                <option value="1">Módulo 1</option>
                <option value="2">Módulo 2</option>
                <option value="3">Módulo 3</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid"> {erros.modulo} </Form.Control.Feedback>
            </Form.Group>
            </Col>

            <Col xs={12} md={5}>
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
          </Row>

          <h5 className="mt-5 mb-3">Endereço Residencial</h5>

          <Row className="mb-3">
            <Col xs={12} md={7}>
              <Form.Group>
                <Form.Label>Logradouro:</Form.Label>
                <Form.Control type="text" value={informacoes.logradouro} onChange={(e) => handleChange("logradouro", e.target.value)}/>
              </Form.Group>
            </Col>

            <Col xs={12} md={5}>
              <Form.Group>
                <Form.Label>CEP:<span style={{ color: "red" }}>*</span></Form.Label>
              <Form.Control type="text" value={informacoes.cep} isInvalid={!!erros.cep} onChange={(e) => handleChange("cep", e.target.value)} onBlur={(e) => buscarCEP(e.target.value)}
                onKeyDown={(e) => { 
                  if (e.key === "Enter") { 
                    e.preventDefault(); 
                    buscarCEP(informacoes.cep);}}} />
                <Form.Control.Feedback type="invalid">
                  {erros.cep}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={12} md={7}>
              <Form.Group>
                <Form.Label>Número/Complemento:</Form.Label>
                <Form.Control type="text" value={informacoes.numero} onChange={(e) => handleChange("numero", e.target.value)} />
              </Form.Group>
            </Col>

            <Col xs={12} md={5}>
              <Form.Group>
                <Form.Label>Bairro:</Form.Label>
                <Form.Control type="text" value={informacoes.bairro} onChange={(e) => handleChange("bairro", e.target.value)}/>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={12} md={7}>
              <Form.Group>
                <Form.Label>Cidade:</Form.Label>
                <Form.Control type="text"  value={informacoes.cidade} onChange={(e) => handleChange("cidade", e.target.value )}/>
              </Form.Group>
            </Col>

            <Col xs={12} md={5}>
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