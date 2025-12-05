import React, { useState } from 'react';
import BtnSearch from '../../../assets/search-icon.png';
import { getFunctionAlunoSpecific } from '../../../services/APIService.js';
import { toast } from 'react-toastify';
import './FilterBar.css';
import { getUser } from '../../../helpers/auth.js'; // ← certifique-se de adicionar

function FilterBar({ onSearch }) {
  const [termo, setTermo] = useState("");
  const [filtro, setFiltro] = useState("todos");

  const handleAcess = async (e) => {
  e.preventDefault();

  try {
    const userData = getUser(); // curso do professor

    // validação do termo
    if (filtro !== "todos" && termo.trim().length < 3) {
      toast.warn(
        `O ${filtro.toUpperCase()} deve conter no mínimo 3 caracteres.`,
        {
          position: "top-center",
          autoClose: 5000,
          theme: "dark"
        }
      );
      return;
    }

    const termoFormatado = filtro !== "rm" ? termo + "%" : termo;

    // busca no backend
    const response = await getFunctionAlunoSpecific(filtro, termoFormatado);

    // garante que existe array
    const lista = response.data || [];
    
    const alunosFiltrados = userData.curso
      ? lista.filter(a => a.nome_curso === userData.curso)
      : lista;

    
    if (alunosFiltrados.length === 0) {
      toast.warn("Nenhum aluno encontrado.", {
        position: "top-center",
        autoClose: 4000,
        theme: "dark"
      });
    }

    // envia o resultado filtrado para o componente pai
    onSearch(alunosFiltrados);

  } catch (error) {
    console.error("Erro: ", error);

    toast.error("Erro ao buscar dados.", {
      position: "top-center",
      autoClose: 5000,
      theme: "dark"
    });
  }
};


  return (
    <div className="d-flex align-items-center justify-content-center container-fluid">
      <div className="d-flex row g-4 align-items-center">

        <div className="col-12 col-md-5">
          <select
            className="form-select"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="rm">RM</option>
            <option value="nome">Nome do Aluno</option>
            <option value="curso">Curso</option>
            <option value="turno">Turno</option>
            <option value="coordenador">Coordenador</option>
          </select>
        </div>

        <div className="col-12 col-md-7">
          <div className="search-bar">
            <input
              type="text"
              className="search-input"
              placeholder={`Pesquisar por ${filtro.toLowerCase()}`}
              value={termo}
              onChange={(e) => setTermo(e.target.value)}
            />

            <button className="search-button" onClick={handleAcess}>
              <img src={BtnSearch} alt="Pesquisar" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default FilterBar;
