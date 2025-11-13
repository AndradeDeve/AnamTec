import React, { useContext } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header/Header";
import NavButtons from "../Components/NavButtons/NavButtons";
import ProgressBar from "../Components/ProgressBar/ProgressBar";
import { FormContext } from "../Context/FormContext";
import "../Styles/FormResp.css";

function FormResp() {
  const navigate = useNavigate();
  const { dadosFormulario, setDadosFormulario } = useContext(FormContext);

  // Variável principal para acessar o array de responsáveis no estado
  const responsaveis = dadosFormulario.infoResponsaveis || [];

  // ✅ Adicionar um novo responsável
  const handleAddResponsaveis = () => {
    // Objeto inicial com todas as chaves vazias
    const novoResponsavelVazio = {
      nome: "",
      parentesco: "",
      telefone: "",
      estadoCivil: "",
      email: "",
    };

    setDadosFormulario((prev) => ({
      ...prev,
      // ⭐️ CORREÇÃO AQUI: Garante que prev.infoResponsaveis é um array com '|| []'
      infoResponsaveis: [
        ...(prev.infoResponsaveis || []), 
        novoResponsavelVazio,
      ],
    }));
  };

  // ✅ Alterar um campo de um responsável específico
  const handleChange = (index, field, value) => {
    setDadosFormulario((prev) => {
      // ⭐️ CORREÇÃO AQUI: Garante que prev.infoResponsaveis é um array antes de copiar
      const novosResponsaveis = [...(prev.infoResponsaveis || [])];
      
      // Atualiza a propriedade específica
      novosResponsaveis[index] = {
        ...novosResponsaveis[index],
        [field]: value,
      };

      // Retorna o novo estado
      return {
        ...prev,
        infoResponsaveis: novosResponsaveis,
      };
    });
  };

  // ✅ Remover um responsável
  const handleRemove = (index) => {
    setDadosFormulario((prev) => {
      // Garante que se está trabalhando com um array antes de filtrar
      const responsaveisAtuais = prev.infoResponsaveis || []; 
      
      // Filtra o array removendo o item
      const novosResponsaveis = responsaveisAtuais.filter((_, i) => i !== index);
      
      return {
        ...prev,
        infoResponsaveis: novosResponsaveis,
      };
    });
  };

  const handleVoltar = () => navigate("/FormInform");
  
  const handleProximo = () => {
    // Os dados do array estão prontos e capturados na variável 'responsaveis'.
    console.log("👉 Dados de Responsáveis capturados (Array):", responsaveis);
    
    navigate("/FormSaude");
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
            "Revisão",
          ]}
          etapaAtual={1}
        />

        <Form className="form-box shadow rounded p-4" onSubmit={(e) => e.preventDefault()}>
          
          {/* Mapeamento para renderizar um bloco de formulário para cada responsável */}
          {responsaveis.map((responsavel, index) => (
            <div key={index} className="mb-4 border-bottom pb-4">
              <h3 className="font-semibold mb-2">Responsável {index + 1}</h3>

              <Row className="mb-3">
                <Col xs={12} md={6}>
                  <Form.Group>
                    <Form.Label>Nome do Responsável:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Digite o nome"
                      value={responsavel.nome}
                      onChange={(e) => handleChange(index, "nome", e.target.value)}
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={6}>
                  <Form.Group>
                    <Form.Label>Parentesco:</Form.Label>
                    <Form.Select
                      value={responsavel.parentesco}
                      onChange={(e) => handleChange(index, "parentesco", e.target.value)}
                    >
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
                    <Form.Control
                      type="text"
                      value={responsavel.telefone}
                      onChange={(e) => handleChange(index, "telefone", e.target.value)}
                    />
                  </Form.Group>
                </Col>

                <Col xs={12} md={4}>
                  <Form.Group>
                    <Form.Label>Estado Civil:</Form.Label>
                    <Form.Select
                      value={responsavel.estadoCivil}
                      onChange={(e) => handleChange(index, "estadoCivil", e.target.value)}
                    >
                      <option value="">Selecione</option>
                      <option value="Solteiro(a)">Solteiro(a)</option>
                      <option value="Casado(a)">Casado(a)</option>
                      <option value="Divorciado(a)">Divorciado(a)</option>
                      <option value="Viúvo(a)">Viúvo(a)</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col xs={12} md={4}>
                  <Form.Group>
                    <Form.Label>E-mail:</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Digite o e-mail"
                      value={responsavel.email}
                      onChange={(e) => handleChange(index, "email", e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="text-center mt-3">
                {/* Permite remover se houver pelo menos 1 item */}
                {responsaveis.length > 0 && ( 
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="custom-btn-resp"
                  >
                    Remover
                  </button>
                )}
              </div>
            </div>
          ))}

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={handleAddResponsaveis}
              className="custom-btn-resp"
            >
              + Adicionar Responsável
            </button>
          </div>

          <NavButtons onVoltar={handleVoltar} onProximo={handleProximo} />
        </Form>
      </Container>
    </>
  );
}

export default FormResp;