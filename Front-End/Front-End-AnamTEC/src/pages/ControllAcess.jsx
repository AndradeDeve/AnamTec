// src/pages/ControleAcesso.jsx 
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, Form, Card, InputGroup } from "react-bootstrap";
import Header from "./components/Header/Header"; 
import { getFunctionUser } from "../services/APIService.js";
import { getFunctionAlunoControll } from "../services/APIService.js";
import { getFunctionAlunoControllSpacific } from "../services/APIService.js";
import { getFunctionUserSpecific } from "../services/APIService.js";
import BtnSearch from '../assets/search-icon.png';
import "./ControllAcess.css";
import { toast } from "react-toastify";

export default function ControleAcesso() {
  const [correntPage, setCorrentPage] = useState(1);
  const [itensPorPagina] = useState(6);
  const [filtroStatus, setFiltroStatus] = useState("");   // "" | "ativo" | "inativo"
  const [filtroAlunoProf, setFiltroAlunoProf] = useState("") // "" | "Aluno" | "Professor"
  const [tipoPesquisa, setTipoPesquisa] = useState("rm");
  const [valorPesquisa, setValorPesquisa] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const dadosCombindados = [...alunos, ...usuarios]



  const dadosParaExibir = (usuariosFiltrados.length > 0 ? usuariosFiltrados : dadosCombindados);
  const indexUltimoItem = correntPage * itensPorPagina;
  const indexPrimeiroItem = indexUltimoItem - itensPorPagina;
  const itensPagina = dadosParaExibir.slice(indexPrimeiroItem, indexUltimoItem);
  const totalPaginas = Math.ceil(dadosParaExibir.length / itensPorPagina);


  const irParaPagina = (numero) =>{
    if(numero < 1 || numero > totalPaginas) return;
    setCorrentPage(numero);
  }

  const paginaAnterior = () => irParaPagina(correntPage - 1);
  const proximaPagina = () => irParaPagina(correntPage + 1);  
  
  const labelPorTipo = {
    rm: "RM",
    nome: "Nome",
    curso: "Curso",
    coordenador: "Coordenador",
  };
  useEffect(()  => {
    const fetchUser = async () => {
      try{
        const responseUser = await getFunctionUser();
        const responseAl = await getFunctionAlunoControll(); 
        
        setUsuarios(responseUser.data);
        setAlunos(responseAl.data);
      }catch(err){
        console.log("Erro: ", err);
        toast.error("Erro ao buscar alunos.");
      }
    }
    fetchUser()
  }, []);


  const handlePesquisar = async () => {
    try{
      let resultado = [...dadosCombindados];
      
      if (valorPesquisa.trim() !== "") {

        if(valorPesquisa.length < 3){
          toast.warn(`O ${tipoPesquisa.toLocaleUpperCase()} deve conter no mínimo 3 caracteres.`)
          return
        }

        let alunosRes = [];
        let usersRes = [];

        try {
          const responseAl = await getFunctionAlunoControllSpacific(
            tipoPesquisa,
            valorPesquisa + (tipoPesquisa !== "rm" ? "%" : "")
          );
          console.log("Sucesso.")
          alunosRes = responseAl.data || [];
        } catch (err) {
          console.warn("Nenhum aluno encontrado");
        }

        try {
          const responseUser = await getFunctionUserSpecific(
            tipoPesquisa,
            valorPesquisa + (tipoPesquisa !== "rm" ? "%" : "")
          );
          usersRes = responseUser.data.response || [];
          console.log(usersRes)
        } catch (err) {
          console.warn("Nenhum professor encontrado",err);
        }
        resultado = [...alunosRes, ...usersRes];
        if(!resultado || resultado.length === 0 ){
          toast.warn("Nenhuma entidade encontrada.")
        }

      }
      
      if (filtroStatus) {
        resultado = resultado.filter(
          (u) => u.status && u.status.toLowerCase() === filtroStatus.toLowerCase()
        );
      }
      const normalizarEntidade = (tipo) => {
      if (!tipo) return "aluno";
        const t = tipo.toLowerCase();
        if (t.includes("professor")) return "professor";
        return t;
      };

      if (filtroAlunoProf) {
        resultado = resultado.filter((u) => {
        return normalizarEntidade(u.entidade) === filtroAlunoProf.toLowerCase();
      });
    }
      setUsuariosFiltrados(resultado);
    }catch(err){
      console.log("Erro: ", err);
      toast.error("Erro ao buscar entidade(s).")
    }
    // Aqui no futuro vamos integrar com API
    // Já estamos integrando 🥲
  };
  
  return (
    <>
      <Header />
  <Container fluid className="controle-wrapper">
    {/* Linha 2: Pesquisa organizada */}
<Row className="mb-4 pesquisa-row">
    <h1 className="titulo-controle">Controle de Acesso</h1>
  <Col xs={12} md={8}>
    <div className="d-flex gap-2 filtros-container">
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
                 {itensPagina.map((user, index) => (

                    <tr key={index}>
                      <td>{user.rm || "Não se aplica"}</td>
                      <td>{user.nome_user || user.nome_aluno}</td>
                      <td>{user.entidade || "Aluno"}</td>
                      <td>{user.disciplina || "Não se aplica"}</td>
                      <td>{user.curso_user || user.nome_curso}</td>
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
              <div className="d-flex justify-content-center align-items-center mt-3 gap-2">
                <button className="btn-pages" onClick={paginaAnterior} disabled={correntPage === 1}>
                  Anterior
                </button>
                {[...Array(totalPaginas)].map((_, i) => (
                  <button
                    key={i}
                    className={`btn ${correntPage === i + 1 ? "btn-primary" : "btn-light"}`}
                    onClick={() => irParaPagina(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button className="btn-pages" onClick={proximaPagina} disabled={correntPage === totalPaginas}>
                  Próximo
                </button>
              </div>

            </Card>
          </Col>
        </Row>

        {/* Linha 2: Barra de Filtros - Centralizada e com 11 colunas de largura (igual à tabela)
        <Row className="mb-4 align-items-end justify-content-center pesquisa-row">
             Coluna Mestra (md={11}) para garantir o alinhamento com a tabela 
            <Col xs={12} md={11} className="d-flex flex-wrap"> 
                
                 1. Dropdown Tipo Pesquisa 
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

                2. Input Group (Input + Botão Buscar) 
                <Col xs={12} md={5} className="mb-3">
               
                    <InputGroup>
                        <Form.Control
                            className="form-select"
                            type="text"
                            placeholder={`Informe o ${labelPorTipo[tipoPesquisa]}`}
                            value={valorPesquisa}
                            onChange={(e) => setValorPesquisa(e.target.value)}
                        />
                         Botão anexado ao input, usando a classe btn-buscar 
                        <Button 
                            className="btn-buscar" 
                            onClick={handlePesquisar}
                        >
                            <img src={BtnSearch} alt="Pesquisar" />
                        </Button>
                    </InputGroup>
                </Col>

                 3. Filtro Status (xs={6} para ficar lado a lado no mobile) 
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

                 4. Filtro Entidade (Aluno/Professor) (xs={6} para ficar lado a lado no mobile) 
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
        </Row> */}
        
        {/* Linha da Tabela - Centralizada e com 11 colunas de largura
        <Row className="justify-content-center">
            <Col xs={12} md={11}>
                <Card className="tabela p-3">
                    
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
        </Row> */}
      </Container>
    </>
  );
}