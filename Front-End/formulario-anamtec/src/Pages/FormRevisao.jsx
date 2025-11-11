import React, { useContext, useState } from "react";
import { Container, Card, Button, Spinner, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FormContext } from "../Context/FormContext";
import Header from "../Components/Header/Header";
import NavButtons from "../Components/NavButtons/NavButtons";
import ProgressBar from "../Components/ProgressBar/ProgressBar";
import { postFormularioAnamnese } from "../Service/ApiService";
import "../Styles/FormRevisao.css";

function FormRevisao() {
  const navigate = useNavigate();
  const { dadosFormulario } = useContext(FormContext);

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const informacoes = dadosFormulario?.informacoesPrincipais || {};
  // 🌟 CORREÇÃO: Usando 'responsaveis' (definido no Context) ao invés de 'infoResponsaveis'
  const responsaveis = dadosFormulario?.responsaveis || []; 
  const saude = dadosFormulario?.saude || {};
  const comportamento = dadosFormulario?.comportamento || {};

  const safe = (v) => (v ? v : "-");

  const confirmarFormulario = async () => {
    setErro("");
    setSucesso("");
    setLoading(true);
    try {
      const result = await postFormularioAnamnese(dadosFormulario);
      console.log("✅ Dados enviados:", result);
      setSucesso("Formulário enviado com sucesso!");
      setTimeout(() => navigate("/sucesso"), 1500);
    } catch (error) {
      console.error("❌ Erro ao enviar:", error);
      setErro("Erro ao enviar formulário. Verifique a conexão.");
    } finally {
      setLoading(false);
    }
  };

  const handleVoltar = () => navigate("/FormComportEmocio");

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
          etapaAtual={4}
        />

        <div className="form-box form-revisao-body">
          <h3 className="text-center mb-4">Revisão dos Dados</h3>

          {erro && <p className="text-danger text-center">{erro}</p>}
          {sucesso && <p className="text-success text-center">{sucesso}</p>}

          {/* --- INFORMAÇÕES PRINCIPAIS --- */}
          <Card className="mb-3">
            <Card.Header>Informações Principais</Card.Header>
            <Card.Body>
              <Form.Group>
                <Form.Label>Nome</Form.Label>
                <Form.Control type="text" value={safe(informacoes.nome)} readOnly />
              </Form.Group>

              <Form.Group className="mt-2">
                <Form.Label>Data de Nascimento</Form.Label>
                <Form.Control type="text" value={safe(informacoes.dataNascimento)} readOnly />
              </Form.Group>

              <Form.Group className="mt-2">
                <Form.Label>RM</Form.Label>
                <Form.Control type="text" value={safe(informacoes.rm)} readOnly />
              </Form.Group>

              <Form.Group className="mt-2">
                <Form.Label>Curso</Form.Label>
                <Form.Control type="text" value={safe(informacoes.curso)} readOnly />
              </Form.Group>

              <Form.Group className="mt-2">
                <Form.Label>Módulo</Form.Label>
                <Form.Control type="text" value={safe(informacoes.modulo)} readOnly />
              </Form.Group>

              <Form.Group className="mt-2">
                <Form.Label>Turno</Form.Label>
                <Form.Control type="text" value={safe(informacoes.turno)} readOnly />
              </Form.Group>

              <Form.Group className="mt-2">
                <Form.Label>Email</Form.Label>
                <Form.Control type="text" value={safe(informacoes.email)} readOnly />
              </Form.Group>
                
             {/* 🌟 CAMPO DE TELEFONE ADICIONADO AQUI */}
              <Form.Group className="mt-2">
                <Form.Label>Telefone</Form.Label>
                <Form.Control type="text" value={safe(informacoes.telefone)} readOnly />
              </Form.Group>

              <Form.Group className="mt-2">
                <Form.Label>CEP</Form.Label>
                <Form.Control type="text" value={safe(informacoes.cep)} readOnly />
              </Form.Group>

              <Form.Group className="mt-2">
                <Form.Label>Endereço</Form.Label>
                <Form.Control
                  type="text"
                  value={`${safe(informacoes.logradouro)}, ${safe(informacoes.numero)} - ${safe(informacoes.bairro)} - ${safe(informacoes.cidade)}/${safe(informacoes.uf)}`}
                  readOnly
                />
              </Form.Group>
            </Card.Body>
          </Card>

          {/* --- RESPONSÁVEIS --- */}
          <Card className="mb-3">
            <Card.Header>Responsáveis</Card.Header>
            <Card.Body>
              {responsaveis.length === 0 || (responsaveis.length === 1 && !responsaveis[0].nome) ? (
                <p>Nenhum responsável adicionado.</p>
              ) : (
                responsaveis.map((resp, index) => (
                  <div key={index} className="mb-3 border-bottom pb-3">
                    <h6>Responsável {index + 1}</h6>
                    <Form.Group>
                      <Form.Label>Nome</Form.Label>
                      <Form.Control type="text" value={safe(resp.nome)} readOnly />
                    </Form.Group>
                    <Form.Group className="mt-2">
                      <Form.Label>Parentesco</Form.Label>
                      <Form.Control type="text" value={safe(resp.parentesco)} readOnly />
                    </Form.Group>
                    <Form.Group className="mt-2">
                      <Form.Label>Telefone</Form.Label>
                      <Form.Control type="text" value={safe(resp.telefone)} readOnly />
                    </Form.Group>
                    {/* Note: Os campos 'estadoCivil' e 'email' abaixo podem estar vazios 
                           se você não os preencheu no formulário de responsável, 
                           mas foram mantidos aqui conforme seu código original.*/}
                    <Form.Group className="mt-2">
                      <Form.Label>Estado Civil</Form.Label>
                      <Form.Control type="text" value={safe(resp.estadoCivil)} readOnly />
                    </Form.Group>
                    <Form.Group className="mt-2">
                      <Form.Label>E-mail</Form.Label>
                      <Form.Control type="text" value={safe(resp.email)} readOnly />
                    </Form.Group>
                  </div>
                ))
              )}
            </Card.Body>
          </Card>

          {/* --- HISTÓRICO DE SAÚDE --- */}
          <Card className="mb-3">
            <Card.Header>Histórico de Saúde</Card.Header>
            <Card.Body>
              <Form.Group>
                <Form.Label>Tipo Sanguíneo</Form.Label>
                <Form.Control type="text" value={safe(saude.tipoSanguineo)} readOnly />
              </Form.Group>

              <Form.Group className="mt-2">
                <Form.Label>Peso</Form.Label>
                <Form.Control type="text" value={safe(saude.peso)} readOnly />
              </Form.Group>

              <Form.Group className="mt-2">
                <Form.Label>Altura</Form.Label>
                <Form.Control type="text" value={safe(saude.altura)} readOnly />
              </Form.Group>

              <Form.Group className="mt-2">
                <Form.Label>Histórico Familiar</Form.Label>
                <Form.Control as="textarea" rows={2} value={safe(saude.historicoFamiliar)} readOnly />
              </Form.Group>

              <Form.Group className="mt-2">
                <Form.Label>Alergias</Form.Label>
                <Form.Control as="textarea" rows={2} value={safe(saude.quaisAlergias)} readOnly />
              </Form.Group>

              <Form.Group className="mt-2">
                <Form.Label>Medicamentos de Uso Contínuo</Form.Label>
                <Form.Control as="textarea" rows={2} value={safe(saude.quaisMedicamentos)} readOnly />
              </Form.Group>

              <Form.Group className="mt-2">
                <Form.Label>Restrições Alimentares</Form.Label>
                <Form.Control as="textarea" rows={2} value={safe(saude.quaisRestricoes)} readOnly />
              </Form.Group>

              <Form.Group className="mt-2">
                <Form.Label>Cirurgias Realizadas</Form.Label>
                <Form.Control as="textarea" rows={2} value={safe(saude.quaisCirurgias)} readOnly />
              </Form.Group>
            </Card.Body>
          </Card>

          {/* --- COMPORTAMENTO --- */}
          <Card className="mb-3">
            <Card.Header>Comportamento e Aspectos Emocionais</Card.Header>
            <Card.Body>
              <Form.Group>
                <Form.Label>Dificuldades de Aprendizagem</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={safe(comportamento.dificuldadesAprendizagem)}
                  readOnly
                />
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label>Comportamento do Aluno</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={safe(comportamento.comportamento)}
                  readOnly
                />
              </Form.Group>

              <Form.Group className="mt-3">
                <Form.Label>Aspectos Emocionais</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={safe(comportamento.emocionais)}
                  readOnly
                />
              </Form.Group>
            </Card.Body>
          </Card>

          {/* --- BOTÕES --- */}
          <div className="d-flex justify-content-between mt-3 mb-5">
            <NavButtons onVoltar={handleVoltar} mostrarProximo={false} />
            <Button
              className="custom-btn mt-3"
              onClick={confirmarFormulario}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" /> Enviando...
                </>
              ) : (
                "Enviar Formulário"
              )}
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
}

export default FormRevisao;