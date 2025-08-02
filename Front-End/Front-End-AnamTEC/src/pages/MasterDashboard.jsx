import React from 'react';
import  Header  from '../pages/components/Header';
import DashboardCards from '../pages/components/DashboardCards';
import FilterBar from '../pages/components/FilterBar';
import StudentTable from '../pages/components/StudantTable';
import ButtonGrid from '../pages/components/ButtonGrid';


export default function MasterDashboard() {
  return (
    <header className="">
        <Header />
      <main className="">
          <aside className="d-flex">
          <DashboardCards />
            <div className="me-1"> {/* Espaço entre os botões e os dados */}
              <ButtonGrid 
                onCadastrar={() => console.log("Cadastrar")} 
                onEnviarEmail={() => console.log("Enviar Email")} 
                onPesquisar={() => console.log("Pesquisar")}
              />
            </div>
          </aside>
          <FilterBar />
          <StudentTable />
      </main>
    </header>
  );
}
