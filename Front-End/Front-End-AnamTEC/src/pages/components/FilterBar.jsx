import React from 'react';
import '../components/FilterBar.css'

export default function FilterBar() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
      <input type="text" placeholder="RM" className="p-2 border rounded" />
      <input type="text" placeholder="Pesquisa por Aluno" className="p-2 border rounded" />
      <input type="text" placeholder="Pesquisa por Curso" className="p-2 border rounded" />
      <input type="text" placeholder="Turno" className="p-2 border rounded" />
      <input type="text" placeholder="Coordenador" className="p-2 border rounded" />
      <input type="text" placeholder="Status Anamnese" className="p-2 border rounded" />
    </div>
  );
}
