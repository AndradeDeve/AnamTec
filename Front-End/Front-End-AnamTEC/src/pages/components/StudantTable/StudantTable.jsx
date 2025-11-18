import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudantTable.css';

export default function StudentTable({ alunosFiltrados = [] }) {
  const navigate = useNavigate();
  // 🔹 Estados para paginação (mesma lógica do ControleAcesso)
  const [correntPage, setCorrentPage] = useState(1);
  const [itensPorPagina] = useState(10);

  // 🔹 Lógica idêntica ao ControleAcesso.jsx
  const indexUltimoItem = correntPage * itensPorPagina;
  const indexPrimeiroItem = indexUltimoItem - itensPorPagina;
  const itensPagina = alunosFiltrados.slice(indexPrimeiroItem, indexUltimoItem);
  const totalPaginas = Math.ceil(alunosFiltrados.length / itensPorPagina);

  const irParaPagina = (numero) => {
    if (numero < 1 || numero > totalPaginas) return;
    setCorrentPage(numero);
  };

  const paginaAnterior = () => irParaPagina(correntPage - 1);
  const proximaPagina = () => irParaPagina(correntPage + 1);

  // 🔹 Caso não haja alunos
  if (!alunosFiltrados || alunosFiltrados.length === 0) {
    return (
      <div className="tabela-container col-11 m-auto col-md-10 my-2">
        <div className="tabela-scroll-horizontal">
          <table className="table table-hover table-bordered table-striped align-middle text-center">
            <thead className="thead-dark sticky-top">
              <tr>
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
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="tabela-container col-11 m-auto col-md-10 my-2">
      <div className="tabela-scroll-horizontal">
        <table className="table table-hover table-bordered table-striped align-middle text-center">
          <thead className="thead-dark sticky-top">
            <tr>
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
          <tbody>
            {Array.isArray(itensPagina) && itensPagina.map((aluno, index) => (
              <tr key={index}>
                <td className="p-3">{aluno.rm}</td>
                <td className="p-3">{aluno.nome_aluno}</td>
                <td className="p-3">{aluno.nome_curso}</td>
                <td className="p-3">{aluno.semestre}</td>
                <td className="p-3">{aluno.turno}</td>
                <td className="p-3">{aluno.coordenador}</td>
                <td className={`p-3 fw-bold ${aluno.status === 'Concluída' ? 'text-white bg-green' : 'text-white bg-red'}`}>
                  {aluno.status}
                </td>
                <td className="p-3">
                  <a href="http://localhost:3001/" target='_blanck'><button className="btn-table btn-outline-primary btn-sm">ACESSAR</button></a>
                </td>
                <td className="p-3">
                  <button
                    className="btn-table btn-outline-secondary btn-sm"
                    onClick={() => navigate('/Observacoes', {state: {aluno}})}
                  >
                    ACESSAR
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔹 Paginação com mesmo estilo e lógica do ControleAcesso.jsx */}
      <div className="d-flex justify-content-center align-items-center mt-3 gap-2">
        <button
          className="btn-pages"
          onClick={paginaAnterior}
          disabled={correntPage === 1}
        >
          Anterior
        </button>

        {[...Array(totalPaginas)].map((_, i) => (
          <button
            key={i}
            className={`btn ${correntPage === i + 1 ? "btn-primary" : "btn-light"}`}
            onClick={() => irParaPagina(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          className="btn-pages"
          onClick={proximaPagina}
          disabled={correntPage === totalPaginas}
        >
          Próximo
        </button>
      </div>
    </div>
  );
}
