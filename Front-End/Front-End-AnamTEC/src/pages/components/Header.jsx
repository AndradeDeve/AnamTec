import React from 'react';
import '../components/Header.css'
export default function Header() {
  return (
    <header className="bg-primary text-white flex justify-between items-center p-4 shadow">
      <div className="text-2xl font-bold">AnamTec <span className="text-xl">⚙</span></div>
      <div className="text-sm">
        Bem-vindo <strong>(Coordenador)</strong>
      </div>
      <button className="text-white hover:text-gray-300">
       
      </button>
    </header>
  );
}
