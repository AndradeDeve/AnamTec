import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import DashboardCards from './components/Dashboard/DashboardCards';
import { getFunctionAluno } from './../services/APIService.js';
import { postEmailAlunosPendentes } from './../services/APIService.js';
import FilterBar from './components/SearchBar/FilterBar';
import StudentTable from './components/StudantTable/StudantTable';
import ButtonGrid from './components/ButtonGrid/ButtonGrid';
import { toast } from 'react-toastify';

export default function MasterDashboard() {
  const [showModal, setShowModal] = useState(false);
  const [alunosFiltrados, setAlunosFiltrados] = useState([]);
  const [todosAlunos, setTodosAlunos] = useState([]); // ✅ novo estado base
  const [alunosPendentes, setAlunosPendentes] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Busca inicial dos alunos
  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const dados = await getFunctionAluno();
        setTodosAlunos(dados || []);
        setAlunosFiltrados(dados || []);
      } catch (error) {
        console.error('Erro ao buscar dados dos alunos:', error);
        setTodosAlunos([]);
        setAlunosFiltrados([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAlunos();
  }, []);

  // 🔹 Quando o usuário clica em um card
  const handleCardClick = (tipo) => {
    if (tipo === 'todos') {
      setAlunosFiltrados(todosAlunos);
    } else {
      const filtrados = todosAlunos.filter(aluno =>
        tipo === 'concluida'
          ? aluno.status === 'Concluída'
          : aluno.status === 'Não' || aluno.status === 'Pendente'
      );
      setAlunosFiltrados(filtrados);
    }
  };

  // 🔹 Mock do modal
  const carregarAlunosPendentes = () => {
    const mock = [
    ];
    setAlunosPendentes(mock);
  };

  const abrirModal = () => {
    carregarAlunosPendentes();
    setShowModal(true);
  };

  const handleSearch = (dados) => {
    setAlunosFiltrados(dados);
  };

  // 🔹 Enviar lembretes
  const enviarLembretes = async () => {
    try {
      const response = await postEmailAlunosPendentes();
      if (response.status === 200) {
        toast.success("E-mails enviados para alunos pendentes");
      } else if (response.status === 404) {
        toast.error("Nenhum aluno encontrado.");
      } else {
        toast.error("Erro ao enviar e-mail para alunos");
      }
    } catch (err) {
      console.log("Erro: ", err);
    }
    setShowModal(false);
  };

  return (
    <header>
      <Header />
      <main>
        <div className="row my-3 justify-content-center">
          <div className="col-12 col-md-10">
            <DashboardCards onCardClick={handleCardClick} />
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-11 col-md-5">
              <ButtonGrid
                onCadastrar={() => console.log("Cadastrar")}
                onPesquisar={() => console.log("Pesquisar")}
                onEnviarEmail={abrirModal}
                showModal={showModal}
                setShowModal={setShowModal}
                alunosPendentes={alunosPendentes}
                onEnviar={enviarLembretes}
              />
            </div>
            <div className="col-11 col-md-7">
              <FilterBar onSearch={handleSearch} />
            </div>
          </div>
        </div>

        <StudentTable alunosFiltrados={alunosFiltrados} />
      </main>
    </header>
  );
}
