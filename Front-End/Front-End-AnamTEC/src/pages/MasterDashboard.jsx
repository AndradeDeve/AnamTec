import React from 'react';
import { Header } from '../pages/components/Header';
import DashboardCards from '../pages/components/DashboardCards';
import FilterBar from '../pages/components/FilterBar';
import StudentTable from '../pages/components/StudantTable';


export default function MasterDashboard() {
  return (
    <div className="">
        <Header />
      <div className="">

        <main className="">
          <DashboardCards />

          <FilterBar />

          <StudentTable />
        </main>
      </div>
    </div>
  );
}
