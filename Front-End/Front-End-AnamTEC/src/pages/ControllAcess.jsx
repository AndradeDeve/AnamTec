// src/pages/ControleAcesso.jsx
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, Form, Card } from "react-bootstrap";
import Header from "./components/Header/Header"; 
import { getFunctionUser } from "../services/APIService.js";
import { getFunctionAlunoControll } from "../services/APIService.js";
import { getFunctionAlunoControllSpacific } from "../services/APIService.js";
import { getFunctionUserSpecific } from "../services/APIService.js";
import "./ControllAcess.css";
import { toast } from "react-toastify";

export default function ControleAcesso() {
  const [filtroStatus, setFiltroStatus] = useState("");   // "" | "ativo" | "inativo"
  const [filtroAlunoProf, setFiltroAlunoProf] = useState("") // "" | "Aluno" | "Professor"
  const [tipoPesquisa, setTipoPesquisa] = useState("rm"); 
  const [valorPesquisa, setValorPesquisa] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const dadosCombindados = [...alunos, ...usuarios]

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
        toast.error("Sla");
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
                 {(usuariosFiltrados.length > 0 ? usuariosFiltrados : dadosCombindados).map((user, index) => (
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
            </Card>
          </Col>
        </Row>
</Container>
</>

  );
}
