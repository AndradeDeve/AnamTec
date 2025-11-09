// src/pages/ControleAcesso/ControleAcesso.jsx
import React from "react";
import { Container, Row, Col, Table, Card } from "react-bootstrap";
import Header from "../components/Header/Header";
import { useControleAcessoData } from "./hooks/useControleAcessoData"; // Importa o Custom Hook
import BarraFiltros from "./BarraFiltros"; // Importa o Componente de Filtro
import "./ControllAcess.css"; 

export default function ControleAcesso() {
    // 🎣 Usa o Custom Hook para obter todos os dados e handlers
    const {
        itensPagina, currentPage, totalPaginas, searchField, setSearchField,
        searchValue, setSearchValue, filtroStatus, setFiltroStatus,
        filtroAlunoProf, setFiltroAlunoProf, toggleEntityStatus,
        handlePesquisar, irParaPagina, paginaAnterior, proximaPagina
    } = useControleAcessoData();
    
    return (
        <>
            <Header /> 
            <Container fluid className="controle-wrapper">
                
                {/* Componente Isolado para Filtros e Busca */}
                <BarraFiltros
                    searchField={searchField} setSearchField={setSearchField}
                    searchValue={searchValue} setSearchValue={setSearchValue}
                    filtroStatus={filtroStatus} setFiltroStatus={setFiltroStatus}
                    filtroAlunoProf={filtroAlunoProf} setFiltroAlunoProf={setFiltroAlunoProf}
                    handlePesquisar={handlePesquisar}
                />
                
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
                                    {itensPagina.map((entity, index) => {
                                        // Normalização e verificação de status em variáveis claras
                                        const tipo = entity.entidade || "aluno";
                                        const statusClass = entity.status && entity.status.toLowerCase() === "ativo" ? "ativo" : "inativo";

                                        return (
                                            <tr key={entity.id || index}> 
                                                <td>{entity.rm || "Não se aplica"}</td>
                                                <td>{entity.nome_user || entity.nome_aluno}</td> 
                                                <td>{entity.entidade || "Aluno"}</td>
                                                <td>{entity.disciplina || "Não se aplica"}</td> 
                                                <td>{entity.curso_user || entity.nome_curso}</td> 
                                                <td>{entity.coordenador}</td> 
                                                <td>
                                                    <button 
                                                        className={`status-badge ${statusClass}`}
                                                        // Chama o handler do hook, que encapsula toda a lógica de API
                                                        onClick={() => toggleEntityStatus(entity.id, tipo, entity.status)} 
                                                    >
                                                        {entity.status} 
                                                    </button> 
                                                </td>
                                            </tr>
                                        )})}
                                </tbody>
                            </Table>

                            {/* Componente de Paginação Isolado */}
                            <div className="d-flex justify-content-center align-items-center mt-3 gap-2">
                                <button className="btn-pages" onClick={paginaAnterior} disabled={currentPage === 1}> 
                                    Anterior
                                </button>
                                {[...Array(totalPaginas)].map((_, i) => (
                                    <button 
                                        key={i} 
                                        className={`btn ${currentPage === i + 1 ? "btn-primary" : "btn-light"}`} 
                                        onClick={() => irParaPagina(i + 1)} 
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button className="btn-pages" onClick={proximaPagina} disabled={currentPage === totalPaginas}> 
                                    Próximo
                                </button>
                            </div>
                        </Card> 
                    </Col>
                </Row>
            </Container>
        </>
    );
}