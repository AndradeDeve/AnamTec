import React, { useState } from 'react';
import Header from '../pages/components/Header';
import DashboardCards from '../pages/components/DashboardCards';
import FilterBar from '../pages/components/FilterBar';
import StudentTable from '../pages/components/StudantTable';
import ButtonGrid from '../pages/components/ButtonGrid';

export default function MasterDashboard() {
  const [showModal, setShowModal] = useState(false);
  const [alunosPendentes, setAlunosPendentes] = useState([]);

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

  const enviarLembretes = () => {
    console.log("Enviando e-mails para:", alunosPendentes);
    setShowModal(false);
  };

  return (
    <header>
      <Header />
      <main>
        <aside className="d-flex">
          <DashboardCards />
          <div className="me-1">
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
        </aside>
        <FilterBar />
        <StudentTable />
      </main>
    </header>
  );
}
