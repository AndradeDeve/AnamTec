// src/pages/ControleAcesso.jsx 
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Button, Form, Card, InputGroup } from "react-bootstrap";
import Header from "../components/Header/Header"; 
import { 
  getFunctionAlunoControllSpacific, getFunctionUser, getFunctionAlunoControll,
  getFunctionUserSpecific, deleteFunctionAluno, ativarFunctionAluno,
  ativarFunctionUser, deleteFunctionUser
} from "../../services/APIService.js";
import BtnSearch from '../../assets/search-icon.png';
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
        toast.warn('Erro ao buscar usuários.', {  
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark" });
      }
    }
    fetchUser()
  }, []);

  const deleteAtUser = async (id, tipo, status)  => {
    try {
      if (tipo === "aluno") {
        if (status === "ativo") {
          const deletedAluno = await deleteFunctionAluno(id);
          if (deletedAluno.status === 200){
            toast.success('Aluno deletado com sucesso.', {  
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark" });
          };
        } else {
          const ativarAluno = await ativarFunctionAluno(id);
          if (ativarAluno.status === 200){
            toast.success('Aluno Ativo com sucesso.', {  
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark" });
          };
        }

        setAlunos((prev) =>
          prev.map((a) =>
            a.id === id ? { ...a, status: a.status === "ativo" ? "inativo" : "ativo" } : a
          )
        );
      } else {
        if (status === "ativo") {
          const deletedUser = await deleteFunctionUser(id);
          if (deletedUser.status === 200){
            toast.success('Usuário deletado com sucesso.', {  
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark" });
          };
        } else {
          const ativarUser = await ativarFunctionUser(id);
          if (ativarUser.status === 200){
            toast.success('Usuário ativo com sucesso.', {  
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark" });
          };
        }

        setUsuarios((prev) =>
          prev.map((u) =>
            u.id === id ? { ...u, status: u.status === "ativo" ? "inativo" : "ativo" } : u
          )
        );
      }

      // 🔥 Atualiza também a lista filtrada se estiver sendo exibida
      setUsuariosFiltrados((prev) =>
        prev.map((u) =>
          u.id === id ? { ...u, status: u.status === "ativo" ? "inativo" : "ativo" } : u
        )
      );

    } catch (err) {
      console.error("Erro: ", err);
      toast.error('Erro ao atualizar status da entidade.', {  
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark" });
    }
  };


  const handlePesquisar = async () => {
    try{
      let resultado = [...dadosCombindados];
      
      if (valorPesquisa.trim() !== "") {

        if(valorPesquisa.length < 3){
          toast.warn(`O ${tipoPesquisa.toLocaleUpperCase()} deve conter no mínimo 3 caracteres.`, {  
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark" });
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
          toast.warn("Nenhuma entidade encontrada.", {  
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark" });
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
      toast.error("Erro ao buscar entidade(s).", {  
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark" });
    }

    // Já estamos integrando 🥲
  };
  
  return (
    <>
      <Header />
  <Container fluid className="controle-wrapper">
    {/* Linha 2: Pesquisa organizada */}
<Row className="mb-4 pesquisa-row">
    <h1 className="titulo-controle">Controle de Acesso</h1>
  <Col xs={12} md={11}>
    <div className="d-flex filtros-container align-items-center">
      <Form.Select
        value={tipoPesquisa}
        onChange={(e) => setTipoPesquisa(e.target.value)}
      >
        <option value="rm">RM</option>
        <option value="nome">Nome</option>
        <option value="curso">Curso</option>
        <option value="coordenador">Coordenador</option>
      </Form.Select>
    <InputGroup className="input-group-search">

      <Form.Control
        type="text"
        placeholder={`Pesquisar por ${labelPorTipo[tipoPesquisa]}`}
        value={valorPesquisa}
        onChange={(e) => setValorPesquisa(e.target.value)}
        onKeyDown={(e) => { 
            if (e.key === 'Enter') handlePesquisar(); {/*Pesquisar pela tecla Enter*/}
        }}
      />
      <Button 
          className="btn-lupa" 
          onClick={handlePesquisar}
        >
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
                        <button
                          className={`status-badge ${
                            user.status.toLowerCase() === "ativo" ? "ativo" : "inativo"
                          }`} onClick={() =>deleteAtUser(user.id, user.entidade || "aluno", user.status)}
                          
                        >
                          {user.status}
                        </button> 
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
      </Container>
    </>
  );
}