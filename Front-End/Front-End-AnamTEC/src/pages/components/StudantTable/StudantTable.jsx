import React, { useState }from 'react';
import { data, useNavigate } from 'react-router-dom';

import './StudantTable.css';

export default function StudentTable({alunosFiltrados = []}) {
    
  const navigate = useNavigate();
  // Se não há alunos, mostrar mensagem
  if (!alunosFiltrados || alunosFiltrados.length === 0) {
    return (
      <div className="tabela-container col-12 col-md-12">
        <div className="text-center p-4">
          <p className="text-muted">Nenhum aluno encontrado.</p>
        </div>
      </div>
    );
  }


  return (
    <div className="tabela-container col-12 col-md-12">
      <div className="tabela-scroll-horizontal">
        <table className="table table-hover table-bordered table-striped align-middle text-center">
          <thead className="thead-dark sticky-top">
            <tr className=''>
              <th className="p-4">RM</th>
              <th className="p-4">Nome do Aluno</th>
              <th className="p-4">Curso</th>
              <th className="p-4">Semestre</th>
              <th className="p-4">Turno</th>
              <th className="p-4">Coordenador</th>
              <th className="p-4">Status</th>
              <th className="p-4">Anamnese</th>
              <th className="p-4">Observações</th>
            </tr>
          </thead>
          <tbody className=''>
             {alunosFiltrados.map((aluno, index) => (
              <tr key={index}>
                <td className="p-3">{aluno.ra}</td>
                <td className="p-3">{aluno.nome_aluno}</td>
                <td className="p-3">{aluno.nome_curso}</td>
                <td className="p-3">{aluno.semestre}</td>
                <td className="p-3">{aluno.turno}</td>
                <td className="p-3">{aluno.coordenador}</td>
                <td className={`p-3 fw-bold ${aluno.status === 'Concluída' ? 'text-white bg-green'  : 'text-white bg-red'}`}>
                  {aluno.status}
                </td>
                <td className="p-3">
                  <button className="btn-table btn-outline-primary btn-sm" >ACESSAR</button>
                </td>
                <td className="p-3">
                  <button className="btn-table btn-outline-secondary btn-sm" onClick={()=> navigate('/Observacoes')}>ACESSAR</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
