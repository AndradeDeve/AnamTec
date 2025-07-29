import React from 'react';
import '../components/StudantTable.css'
const mockData = [
  { rm: '24561', nome: 'Weslley Samuel Novaes Santana', curso: 'Desenvolvimento de Sistemas', semestre: '2º Semestre', turno: 'Noturno', coordenador: 'Marcos Costa', status: 'Concluída' },
  { rm: '25468', nome: 'Rosiane Costa', curso: 'Desenvolvimento de Sistemas', semestre: '2º Semestre', turno: 'Noturno', coordenador: 'Marcos Costa', status: 'Pendente' },
];

export default function StudentTable() {
  return (
    <div className="studants-table">
      <table className="table">
        <thead>
          <tr className="search">
            <th className="p-3">RM</th>
            <th className="p-3">Nome do Aluno</th>
            <th className="p-3">Curso</th>
            <th className="p-3">Semestre</th>
            <th className="p-3">Turno</th>
            <th className="p-3">Coordenador</th>
            <th className="p-3">Status</th>
            <th className="p-3">Anamnese</th>
            <th className="p-3">Observações</th>
          </tr>
        </thead>
        <tbody>
          {mockData.map((aluno, index) => (
            <tr key={index} className="table-itens">
              <td className="p-3">{aluno.rm}</td>
              <td className="p-3">{aluno.nome}</td>
              <td className="p-3">{aluno.curso}</td>
              <td className="p-3">{aluno.semestre}</td>
              <td className="p-3">{aluno.turno}</td>
              <td className="p-3">{aluno.coordenador}</td>
              <td className={`p-3 font-semibold ${aluno.status === 'Concluída' ? 'text-green-600' : 'text-red-600'}`}>{aluno.status}</td>
              <td className="p-3">
                <button className="btn-table">ACESSAR</button>
              </td>
              <td className="p-3">
                <button className="btn-table">ACESSAR</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
