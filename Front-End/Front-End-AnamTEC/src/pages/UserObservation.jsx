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
    <Container fluid className="container.custom">
      <Row>
        {/* Coluna lateral esquerda: Lista de professores */}
        <Col md={2} className="column-professor">
          <h5>Professores</h5>
          <ul className="list-unstyled">
            <li>Luiz Felipe</li>
            <li>Marcos Costa</li> 
            <li>Marcos Nogueira</li>
            <li>Emerson Silva</li>
            <li>Aline Francisca</li>
            <li>Francisco Saiz</li>
          </ul>
        </Col>
        {/* Coluna central: observações e comentários */}
        <Col md={7} className="card">
     
          <h4 className="mb-3">Observação dos professores</h4>

          {/* Cartão que exibe todos os comentários já adicionados */}
          <Card className="mb-3">
            <Card.Body style={{ maxHeight: "300px", overflowY: "auto" }}>
              {/* Mapeia e exibe cada comentário */}
              {comentarios.map((comentario, index) => (
                <div key={index} className="mb-3">
                  {/* Nome do autor e data do comentário */}
                  <strong>{comentario.autor}</strong>{" "}
                  <span className="text-muted" style={{ fontSize: "0.9em" }}>
                    ({comentario.data})
                  </span>
                  {/* Texto do comentário */}
                  <p className="mb-0">{comentario.texto}</p>
                  <hr />
                </div>
              ))}
            </Card.Body>
          </Card>

          {/* Campo de texto para digitar novo comentário */}
          <Form.Control
            type="text"
            placeholder="Comentário"
            value={novoComentario}
            onChange={(e) => setNovoComentario(e.target.value)} // Atualiza estado ao digitar
            className="input-custom"
          />

          {/* Botão para enviar o comentário */}
          <Button className="btn-enviar" variant="primary" onClick={handleEnviarComentario}>
            Enviar
          </Button>
        </Col>

        {/* Coluna direita: Dados do aluno (exibidos em um card) */}
        <Col md={3}>
          <Card className="card-aluno">
            <Card.Body>
              <h3>Dados do Aluno</h3>
              <p><strong>Nome:</strong> Weslley Samuel Novaes Santana</p>
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
