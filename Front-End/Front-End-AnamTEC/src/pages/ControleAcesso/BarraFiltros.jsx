import React from 'react';
import { Row, Col, Button, Form, InputGroup } from "react-bootstrap";
import BtnSearch from '../../assets/search-icon.png';

const LABEL_POR_TIPO = {
    rm: "RM",
    nome: "Nome",
    curso: "Curso",
    coordenador: "Coordenador",
};

export default function BarraFiltros({
    searchField, setSearchField, searchValue, setSearchValue,
    filtroStatus, setFiltroStatus, filtroAlunoProf, setFiltroAlunoProf,
    handlePesquisar 
}) {
    return (
        <Row className="mb-4 pesquisa-row">
            <h1 className="titulo-controle">Controle de Acesso</h1>
            <Col xs={12} md={11}>
                <div className="d-flex filtros-container align-items-center">
                    
                    {/* 1. Seleção do Campo de Busca (CORRIGIDO) */}
                    <Form.Select 
                        value={searchField} 
                        onChange={(e) => setSearchField(e.target.value)} 
                    >
                        {Object.entries(LABEL_POR_TIPO).map(([key, value]) => (
                             <option key={key} value={key}> 
                                        {value}
                                        </option> 
                        ))}
                    </Form.Select>

                    {/* 2. Input de Busca e Botão */}
                    <InputGroup className="input-group-search">
                        <Form.Control 
                            type="text" 
                            placeholder={`Pesquisar por ${LABEL_POR_TIPO[searchField]}`}
                            value={searchValue} 
                            onChange={(e) => setSearchValue(e.target.value)}
                            onKeyDown={(e) => { 
                                if (e.key === 'Enter') handlePesquisar(); 
                            }}
                        />
                        <Button className="btn-lupa" onClick={handlePesquisar}>
                            <img src={BtnSearch} alt="Pesquisar" /> 
                        </Button>
                    </InputGroup>

                    <Form.Select 
                        value={filtroStatus} 
                        onChange={(e) => setFiltroStatus(e.target.value)} 
                    >
                        <option value="">Status</option>
                        <option value="ativo">Ativos</option>
                        <option value="inativo">Inativos</option>
                    </Form.Select>

                    <Form.Select 
                        value={filtroAlunoProf} 
                        onChange={(e) => setFiltroAlunoProf(e.target.value)}
                    >
                        <option value="">Todos</option> 
                        <option value="aluno">Aluno</option>
                        <option value="professor">Professor</option>
                    </Form.Select>
                </div>
            </Col>
        </Row>
    );
}