// Importando bibliotecas React e componentes do Bootstrap
import React, { useState } from "react";
import { Container, Row, Col, Button, Card, Form } from "react-bootstrap";
import Header from './components/Header/Header';
import './UserObservation.css'

// Função principal do componente
const ObservacoesProfessor = () => {
  // Estado inicial com uma observação simulada (poderia vir do banco futuramente)
  const [comentarios, setComentarios] = useState([
    {
      autor: "Marcos Costa",
      texto:
        "Aluno tem dificuldades de concentração e foco, com base na Anamnese realizada posso ressaltar que o aluno Weslley Samuel Novaes Santana pode conter algum grau de Transtorno do Déficit de Atenção com Hiperatividade (TDAH).",
      data: "03/08/2025",
    },
  ]);

  // Estado para armazenar o comentário que está sendo digitado
  const [novoComentario, setNovoComentario] = useState("");

  // Função para enviar novo comentário
  const handleEnviarComentario = () => {
    // Impede o envio de comentários vazios
    if (novoComentario.trim() === "") return;

    // Cria um novo comentário com autor fixo (poderá ser dinâmico no futuro)
    const novo = {
      autor: "Coordenador Atual", // Será substituído futuramente pelo nome de quem estiver logado
      texto: novoComentario,
      data: new Date().toLocaleDateString("pt-BR"), // Data atual formatada
    };

    // Adiciona o novo comentário no topo da lista
    setComentarios([novo, ...comentarios]);

    // Limpa o campo de digitação após envio
    setNovoComentario("");
  };

  // Estrutura visual (JSX) do componente
  return (
    <header>
         <Header />
    <Container fluid className="observacoes-container">
  <Row>
    {/* Professores */}
    <Col md={2} className="professores-lista">
      <h5>Professores</h5>
      <ul className="list-group">
        <li className="list-group-item">Luiz Felipe</li>
        <li className="list-group-item active">Marcos Costa</li>
        <li className="list-group-item">Marcos Nogueira</li>
      </ul>
    </Col>

    {/* Comentários */}
    <Col md={7} className="comentarios-area">
      <h4 className="mb-3 text-center">Observações dos Professores</h4>

      {/* Lista de comentários */}
      <div className="comentarios-lista">
        {comentarios.map((c, index) => (
          <Card key={index} className="comentario-card mb-3">
            <Card.Body>
              <div className="comentario-header">
                <strong>{c.autor}</strong>
                <span className="text-muted">({c.data})</span>
              </div>
              <p>{c.texto}</p>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Novo comentário */}
      <Card className="novo-comentario mt-3">
        <Card.Body>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Escreva sua observação..."
            value={novoComentario}
            onChange={(e) => setNovoComentario(e.target.value)}
          />
          <Button className="mt-2 w-100" onClick={handleEnviarComentario}>
            Enviar
          </Button>
        </Card.Body>
      </Card>
    </Col>

    {/* Dados do aluno */}
    <Col md={3} className="dados-aluno">
      <Card>
        <Card.Body>
          <h5 className="text-center">🎓 Dados do Aluno</h5>
          <p><strong>Nome:</strong> Weslley Samuel</p>
          <p><strong>Curso:</strong> Desenvolvimento de Sistemas</p>
          <p><strong>Turma:</strong> 3º Semestre</p>
        </Card.Body>
      </Card>
    </Col>
  </Row>
</Container>

            </header>
  );
};

// Exporta o componente para ser usado em outras partes do sistema
export default ObservacoesProfessor;
