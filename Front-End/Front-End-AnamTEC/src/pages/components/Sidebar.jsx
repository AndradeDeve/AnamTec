import React from 'react';
import '../components/Sidebar.css'
export default function SidebarMenu() {
  return (
    <aside className="w-64 bg-primary text-white h-screen p-4 hidden md:block">
      {/* Links para outras páginas */}
      <ul className="space-y-4">
        <li>Dashboard</li>
        <li>Usuários</li>
        <li>Configurações</li>
        <li>Relatórios</li>
      </ul>
    </aside>
  );
}
