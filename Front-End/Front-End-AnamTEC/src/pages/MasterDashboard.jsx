import React from 'react';
import Header from '../pages/components/Header';
import DashboardCards from '../pages/components/DashboardCards';
import FilterBar from '../pages/components/FilterBar';
import StudentTable from '../pages/components/StudantTable';
import SidebarMenu from '../pages/components/Sidebar';


export default function MasterDashboard() {
  return (
    <div className="flex">
      <SidebarMenu />

      <div className="flex-1 bg-gray-100 min-h-screen">
        <Header />

        <main className="p-6 space-y-6">
          <DashboardCards />

          <FilterBar />

          <StudentTable />
        </main>
      </div>
    </div>
  );
}
