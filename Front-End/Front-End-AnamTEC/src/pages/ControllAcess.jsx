// src/pages/ControleAcesso.jsx
import React, { useState } from "react";
import { Container, Row, Col, Table, Button, Form, Card } from "react-bootstrap";
import Header from "./components/Header/Header"; 
import "./ControllAcess.css";

export default function ControleAcesso() {
  const [filtroStatus, setFiltroStatus] = useState("");   // "" | "ativo" | "inativo"
  const [filtroAlunoProf, setFiltroAlunoProf] = useState("") // "" | "Aluno" | "Professor"
  const [tipoPesquisa, setTipoPesquisa] = useState("rm"); 
  const [valorPesquisa, setValorPesquisa] = useState("");

    const labelPorTipo = {
    rm: "RM",
    nome: "Nome",
    curso: "Curso",
    coordenador: "Coordenador",
  };
  // Exemplo de dados mockados
  const usuarios = [
      { rm: "20100", nome: "Zorvanius Meteora", entidade: "Aluno", disciplina: "Não Aplica", curso: "Desenvolvimento de Sistemas", coordenador: "Marcos Costa", status: "Ativo" },
      { rm: "18005", nome: "Bréfila Aurora", entidade: "Aluno", disciplina: "Não Aplica", curso: "Administração", coordenador: "Ricardo", status: "Ativo" },
      { rm: "19045", nome: "Krumthor César", entidade: "Aluno", disciplina: "Não Aplica", curso: "Logística", coordenador: "Olivaldo", status: "Inativo" },
      { rm: "19754", nome: "Lullabee Sofia", entidade: "Aluno", disciplina: "Não Aplica", curso: "Eletroeletrônica", coordenador: "Willian Martins", status: "Ativo" },
      { rm: "21023", nome: "Xandrópico Dante", entidade: "Aluno", disciplina: "Não Aplica", curso: "Desenvolvimento de Sistemas", coordenador: "Marcos Costa", status: "Ativo" },
  ];

  const handlePesquisar = () => {
    console.log("🔍 Pesquisando por:", tipoPesquisa, valorPesquisa, filtroStatus, filtroAlunoProf);
    // Aqui no futuro vamos integrar com API
  };

  return (
    <>
      <Header />

  <Container fluid className="controle-wrapper">
    {/* Linha 2: Pesquisa organizada */}
<Row className="mb-4 pesquisa-row">
  <Col xs={12} md={8}>
    <div className="d-flex gap-2 controle">
      {/* Dropdown tipo pesquisa */}
      <Form.Select
        value={tipoPesquisa}
        onChange={(e) => setTipoPesquisa(e.target.value)}
        style={{ maxWidth: "150px" }}
      >
        <option value="rm">RM</option>
        <option value="nome">Nome</option>
        <option value="curso">Curso</option>
        <option value="coordenador">Coordenador</option>
      </Form.Select>

      {/* Input */}
      <Form.Control
        type="text"
        placeholder={`Pesquisar por ${labelPorTipo[tipoPesquisa]}`}
        value={valorPesquisa}
        onChange={(e) => setValorPesquisa(e.target.value)}
      />

      {/* Botão + Filtros */}
      <button className="btn-submit" onClick={handlePesquisar}>
        Pesquisar
      </button>

      {/* Dropdowns de filtro ao lado do botão */}
   
      <Form.Select
     
        value={filtroStatus}
        onChange={(e) => setFiltroStatus(e.target.value)}
        style={{ maxWidth: "150px" }}
      >
        <option value="">Status</option>
        <option value="ativo">Ativos</option>
        <option value="inativo">Inativos</option>
      </Form.Select>

      <Form.Select
        value={filtroAlunoProf}
        onChange={(e) => setFiltroAlunoProf(e.target.value)}
        style={{ maxWidth: "150px" }}
      >
        <option value="">Todos</option>
        <option value="aluno">Aluno</option>
        <option value="professor">Professor</option>
      </Form.Select>
 
    </div>
  </Col>
</Row>

<Row className="justify-content-center">
          <Col xs={12} md={11}>
            <Card className="p-3">
              <Table striped bordered hover responsive className="tabela-custom">
                <thead>
                  <tr>
                    <th>RM</th>
                    <th>Nome</th>
                    <th>Entidade</th>
                    <th>Disciplina</th>
                    <th>Curso</th>
                    <th>Coordenador</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((user, index) => (
                    <tr key={index}>
                      <td>{user.rm}</td>
                      <td>{user.nome}</td>
                      <td>{user.entidade}</td>
                      <td>{user.disciplina}</td>
                      <td>{user.curso}</td>
                      <td>{user.coordenador}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            user.status.toLowerCase() === "ativo" ? "ativo" : "inativo"
                          }`}
                        >
                          {user.status}
                        </span> 
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
</Container>
</>

  );
}
