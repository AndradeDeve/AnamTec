import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import DashboardCards from './components/Dashboard/DashboardCards';
import  { getFunctionAluno } from './../services/APIService.js';
import FilterBar from './components/SearchBar/FilterBar';
import StudentTable from './components/StudantTable/StudantTable';
import ButtonGrid from './components/ButtonGrid/ButtonGrid';

export default function MasterDashboard() {
  const [showModal, setShowModal] = useState(false);
  const [alunosFiltrados, setAlunosFiltrados] = useState(null);
  const [alunosPendentes, setAlunosPendentes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        
        const dados = await getFunctionAluno();
        setAlunosFiltrados(dados);
        setLoading(true);
        setAlunosFiltrados(dados || []);
      } catch (error) {
        setAlunosFiltrados([]);
        console.error('Erro ao buscar dados dos alunos:', error);
      }finally {
        setLoading(false); 
      };
    };
    fetchAlunos();
  }, []);

  const carregarAlunosPendentes = () => {
    const mock = [
      { id: 1, nome: "Ana Paula", emailResponsavel: "ana.mae@email.com" },
      { id: 2, nome: "Carlos Henrique", emailResponsavel: "carlos.pai@email.com" }
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

  const enviarLembretes = () => {
    console.log("Enviando e-mails para:", alunosPendentes);
    setShowModal(false);
  };

  return (
    <header>
      <Header />
      <main>
          <div className="row my-3 justify-content-center">
            <div className="col-12 col-md-12">
              <DashboardCards />
            </div>
          </div>
          <div className="container my-3">
            <div className="row">
              <div className="col-12 col-md-6">
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
              <div className="col-12 col-md-6">
              <FilterBar onSearch={handleSearch} />
              </div>
            </div>
          </div>
        <StudentTable alunosFiltrados={alunosFiltrados}/>
      </main>
    </header>
  );
}
