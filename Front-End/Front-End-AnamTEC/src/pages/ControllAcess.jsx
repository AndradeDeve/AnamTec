// src/pages/ControleAcesso.jsx
import React, { useState } from "react";
import { Container, Row, Col, Table, Button, Form, Card,InputGroup } from "react-bootstrap";
import Header from "./components/Header/Header"; 
import BtnSearch from '../assets/search-icon.png';
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
      { rm: "19754", nome: "Lullabee Sofia", entidade: "Aluno", disciplina: "Não Aplica", curso: "Eletroeletrônica", 
coordenador: "Willian Martins", status: "Ativo" },
      { rm: "21023", nome: "Xandrópico Dante", entidade: "Aluno", disciplina: "Não Aplica", curso: "Desenvolvimento de Sistemas", coordenador: "Marcos Costa", status: "Ativo" },
  ];
  
  const handlePesquisar = () => {
    console.log("🔍 Pesquisando por:", tipoPesquisa, valorPesquisa, filtroStatus, filtroAlunoProf);
    // Aqui no futuro vamos integrar com API
  };
  
  return (
    <>
      <Header />

      <Container fluid className="controle-wrapper my-3">
        
        {/* Linha 1: Título Centralizado - Ocupa a largura total para centralizar o texto */}
        <Row className="justify-content-center">
            <Col xs={12} md={11}>
                <h1 className="titulo-controle text-center mb-4">Controle de Acesso</h1>
            </Col>
        </Row>

        {/* Linha 2: Barra de Filtros - Centralizada e com 11 colunas de largura (igual à tabela) */}
        <Row className="mb-4 align-items-end justify-content-center pesquisa-row">
            {/* Coluna Mestra (md={11}) para garantir o alinhamento com a tabela */}
            <Col xs={12} md={11} className="d-flex flex-wrap"> 
                
                {/* 1. Dropdown Tipo Pesquisa */}
                <Col xs={12} md={3} className="mb-3">
                
                    <Form.Select
                        value={tipoPesquisa}
                        onChange={(e) => setTipoPesquisa(e.target.value)}
                    >
                        <option value="rm">RM</option>
                        <option value="nome">Nome</option>
                        <option value="curso">Curso</option>
                        <option value="coordenador">Coordenador</option>
                    </Form.Select>
                </Col>

                {/* 2. Input Group (Input + Botão Buscar) */}
                <Col xs={12} md={5} className="mb-3">
               
                    <InputGroup>
                        <Form.Control
                            className="form-select"
                            type="text"
                            placeholder={`Informe o ${labelPorTipo[tipoPesquisa]}`}
                            value={valorPesquisa}
                            onChange={(e) => setValorPesquisa(e.target.value)}
                        />
                        {/* Botão anexado ao input, usando a classe btn-buscar */}
                        <Button 
                            className="btn-buscar" 
                            onClick={handlePesquisar}
                        >
                            <img src={BtnSearch} alt="Pesquisar" />
                        </Button>
                    </InputGroup>
                </Col>

                {/* 3. Filtro Status (xs={6} para ficar lado a lado no mobile) */}
                <Col xs={6} md={2} className="mb-3 pe-sm-2">
                    <Form.Select
                        value={filtroStatus}
                        onChange={(e) => setFiltroStatus(e.target.value)}
                    >
                        <option value="">Todos</option>
                        <option value="ativo">Ativos</option>
                        <option value="inativo">Inativos</option>
                    </Form.Select>
                </Col>

                {/* 4. Filtro Entidade (Aluno/Professor) (xs={6} para ficar lado a lado no mobile) */}
                <Col xs={6} md={2} className="mb-3 ps-sm-2">
              
                    <Form.Select
                        value={filtroAlunoProf}
                        onChange={(e) => setFiltroAlunoProf(e.target.value)}
                    >
                        <option value="">Todos</option>
                        <option value="aluno">Aluno</option>
                        <option value="professor">Professor</option>
                    </Form.Select>
                </Col>
                
            </Col>
        </Row>
        
        {/* Linha da Tabela - Centralizada e com 11 colunas de largura */}
        <Row className="justify-content-center">
            <Col xs={12} md={11}>
                <Card className="tabela p-3">
                    {/* A propriedade responsive faz a tabela rolar horizontalmente em telas pequenas */}
                    <Table striped bordered hover responsive className=" tabela-custom">
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
                        <tbody className="table">
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
                                                user.status.toLowerCase() === "ativo" ?
                                                "ativo" : "inativo"
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