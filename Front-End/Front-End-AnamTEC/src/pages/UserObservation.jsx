// src/pages/ObservacoesProfessor.jsx
import React, { useState } from "react";
import { Container, Row, Col, Button, Card, Form } from "react-bootstrap";
import Header from './components/Header/Header';
import './UserObservation.css';

export default function ObservacoesProfessor() {
  const [comentarios, setComentarios] = useState([
    {
      autor: "Marcos Costa",
      texto:
        "Aluno contém boa presença em sala de aula, consegue desenvolver as atividades exigidas pelo professor, entretanto, apresenta sonolência em sala de aula devido à exaustão física do dia a dia.",
      data: "04/09/2025",
    },
  ]);

  const [novoComentario, setNovoComentario] = useState("");

  const handleEnviarComentario = () => {
    if (novoComentario.trim() === "") return;

    const novo = {
      autor: "Professor Atual",
      texto: novoComentario,
      data: new Date().toLocaleDateString("pt-BR"),
    };

    setComentarios([novo, ...comentarios]);
    setNovoComentario("");
  };

  return (
    <>
      <Header />
      <Container fluid className="observacoes-wrapper">
        <Row>
          {/* Coluna Professores */}
      {/* Coluna lateral esquerda: Lista de professores */}
      <Col md={2} className="professores-col d-none d-md-block">
        <h5>Professores</h5>
        <ul className="prof-list">
          {["Luiz Felipe", "Marcos Costa", "Marcos Nogueira", "Emerson Silva", "Aline Francisca", "Francisco Saiz"].map((prof, idx) => (
            <li key={idx}>{prof}</li>
          ))}
        </ul>
      </Col>

   

          {/* Coluna Observações */}
          <Col md={7} className="observacoes-col">
            <h4 className="obs-title">Observação dos professores</h4>
          
            <div className="obs-card">
              {comentarios.map((c, i) => (
                <div key={i} className="comentario">
                  <p>{c.texto}</p>
                  <span className="autor">
                    {c.autor} ({c.data})
                  </span>
                </div>
              ))}
            </div>
               {/* Dropdown no mobile */}
            <Col xs={12} className="d-md-none mb-3">
              <Form.Select className="dropdown-mobile">
                <option>Selecione um professor</option>
                <option>Luiz Felipe</option>
                <option>Marcos Costa</option>
                <option>Marcos Nogueira</option>
                <option>Emerson Silva</option>
                <option>Aline Francisca</option>
                <option>Francisco Saiz</option>
              </Form.Select>
            </Col>

            {/* Campo de novo comentário */}
        <div className="novo-comentario">
          <Form.Control
            type="text"
            placeholder="Digite seu comentário..."
            value={novoComentario}
            onChange={(e) => setNovoComentario(e.target.value)}
            className="input-comentario"
          />
          <Button className="btn-enviar" onClick={handleEnviarComentario}>
            Enviar
          </Button>
        </div>

          </Col>

          {/* Coluna Dados do Aluno */}
          <Col md={3} className="aluno-col">
            <h5 className="aluno-title">Dados Aluno</h5>
            <div className="aluno-card">
              <p><strong>Nome:</strong> Weslley Samuel Novaes Santana</p>
              <p><strong>Curso:</strong> Desenvolvimento de Sistemas</p>
              <p><strong>Turma:</strong> 3º Semestre</p>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}
