import React from 'react';
import './FilterBar.css';
import  { useState } from 'react';


function FilterBar({onSearch}) {
  const [termo, setTermo] = useState(""); 
  const [filtro, setFiltro] = useState("");

  const HandleSearch = () =>{

    if (!termo){
      alert("Digite algo para pesquisar")
      return;
    }

    onchange(filtro, termo)
  }


 return (
  <div className="filter-container mt-3 mb-3 col-md-3">
      <div className="row g-1 align-items-center">
        
        {/* Dropdown */}
        <div className="col-12 col-md-5">
          <select
            className="form-select"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          >
            <option value="rm">RM</option>
            <option value="nome">Nome do Aluno</option>
            <option value="curso">Curso</option>
            <option value="turno">Turno</option>
            <option value="coordenador">Coordenador</option>
            <option value="status">Status Anamnese</option>
          </select>
        </div>

        {/* Campo de pesquisa */}
        <div className="col-12 col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder={`Pesquisar por ${filtro.toLocaleLowerCase()}`}
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
          />
        </div>

        {/* Botão */}
        <div className="col-12 col-md-2 d-grid ">
          <button className="custon-btn" onClick={HandleSearch}>
            Pesquisar
          </button>
        </div>
      </div>
    </div>
  );
}

export default FilterBar;

