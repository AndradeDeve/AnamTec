import React from 'react';
import '../components/StudantTable.css';

const mockData = [
  { rm: '24561', nome: 'Weslley Samuel Novaes Santana', curso: 'Desenvolvimento de Sistemas', semestre: '2º Semestre', turno: 'Noturno', coordenador: 'Marcos Costa', status: 'Concluída' },
  { rm: '25468', nome: 'Rosiane Costa', curso: 'Desenvolvimento de Sistemas', semestre: '2º Semestre', turno: 'Noturno', coordenador: 'Marcos Costa', status: 'Pendente' },
  // Adicione mais linhas para testar o scroll
];

export default function StudentTable() {
  return (
    <div className="tabela-container">
      <div className="tabela-scroll-horizontal">
        <table className="table table-hover table-bordered table-striped align-middle text-center">
          <thead className="thead-dark sticky-top">
            <tr>
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
              <tr key={index}>
                <td className="p-3">{aluno.rm}</td>
                <td className="p-3">{aluno.nome}</td>
                <td className="p-3">{aluno.curso}</td>
                <td className="p-3">{aluno.semestre}</td>
                <td className="p-3">{aluno.turno}</td>
                <td className="p-3">{aluno.coordenador}</td>
                <td className={`p-3 fw-bold ${aluno.status === 'Concluída' ? 'text-white bg-green'  : 'text-white bg-red'}`}>
                  {aluno.status}
                </td>
                <td className="p-3">
                  <button className="btn-table btn-outline-primary btn-sm">ACESSAR</button>
                </td>
                <td className="p-3">
                  <button className="btn-table btn-outline-secondary btn-sm">ACESSAR</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
