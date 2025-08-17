import React from 'react';
import { useNavigate } from 'react-router-dom';
import './StudantTable.css';

const mockData = [
  { rm: '24561', nome: 'Weslley Samuel Novaes Santana', curso: 'Desenvolvimento de Sistemas', semestre: '2º Semestre', turno: 'Noturno', coordenador: 'Marcos Costa', status: 'Concluída' },
  { rm: '25468', nome: 'Rosiane Costa', curso: 'Desenvolvimento de Sistemas', semestre: '2º Semestre', turno: 'Noturno', coordenador: 'Marcos Costa', status: 'Pendente' },
  { rm: '26101', nome: 'Bruno Almeida', curso: 'Administração', semestre: '1º Semestre', turno: 'Manhã', coordenador: 'Marcos Costa', status: 'Concluída' },
{ rm: '26102', nome: 'Camila Ferreira', curso: 'Logística', semestre: '2º Semestre', turno: 'Tarde', coordenador: 'Marcos Costa', status: 'Pendente' },
{ rm: '26103', nome: 'Diego Martins', curso: 'Redes de Programadores', semestre: '3º Semestre', turno: 'Noite', coordenador: 'Marcos Costa', status: 'Concluída' },
{ rm: '26104', nome: 'Elaine Souza', curso: 'Eletro-eletronica', semestre: '1º Semestre', turno: 'Manhã', coordenador: 'Marcos Costa', status: 'Pendente' },
{ rm: '26105', nome: 'Fábio Lima', curso: 'Administração', semestre: '2º Semestre', turno: 'Tarde', coordenador: 'Marcos Costa', status: 'Concluída' },
{ rm: '26106', nome: 'Gabriela Rocha', curso: 'Logística', semestre: '3º Semestre', turno: 'Noite', coordenador: 'Marcos Costa', status: 'Pendente' },
{ rm: '26107', nome: 'Henrique Silva', curso: 'Redes de Programadores', semestre: '1º Semestre', turno: 'Manhã', coordenador: 'Marcos Costa', status: 'Concluída' },
{ rm: '26108', nome: 'Isabela Torres', curso: 'Eletro-eletronica', semestre: '2º Semestre', turno: 'Tarde', coordenador: 'Marcos Costa', status: 'Pendente' },
{ rm: '26109', nome: 'João Pedro', curso: 'Administração', semestre: '3º Semestre', turno: 'Noite', coordenador: 'Marcos Costa', status: 'Concluída' },
{ rm: '26110', nome: 'Karen Oliveira', curso: 'Logística', semestre: '1º Semestre', turno: 'Manhã', coordenador: 'Marcos Costa', status: 'Pendente' },
{ rm: '26111', nome: 'Lucas Mendes', curso: 'Redes de Programadores', semestre: '2º Semestre', turno: 'Tarde', coordenador: 'Marcos Costa', status: 'Concluída' },
{ rm: '26112', nome: 'Mariana Cunha', curso: 'Eletro-eletronica', semestre: '3º Semestre', turno: 'Noite', coordenador: 'Marcos Costa', status: 'Pendente' },
{ rm: '26113', nome: 'Nicolas Barbosa', curso: 'Administração', semestre: '1º Semestre', turno: 'Manhã', coordenador: 'Marcos Costa', status: 'Concluída' },
{ rm: '26114', nome: 'Patrícia Ribeiro', curso: 'Logística', semestre: '2º Semestre', turno: 'Tarde', coordenador: 'Marcos Costa', status: 'Pendente' },
{ rm: '26115', nome: 'Rafael Teixeira', curso: 'Redes de Programadores', semestre: '3º Semestre', turno: 'Noite', coordenador: 'Marcos Costa', status: 'Concluída' }

  // Adicione mais linhas para testar o scroll
];


export default function StudentTable() {

   const navigate = useNavigate();
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
