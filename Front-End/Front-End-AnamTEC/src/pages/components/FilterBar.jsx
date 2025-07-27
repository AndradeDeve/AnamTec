import React from 'react';
import '../components/FilterBar.css';
import personIcon from '../../IMG/person-icon.png';
import professorIcon from '../../IMG/professor-icon.png';
import turnIcon from '../../IMG/turn-icon.png';
import searchIcon from '../../IMG/search-icon.png';
import anamneseIcon from '../../IMG/anamnese-icon.png';

export default function FilterBar() {
  return (
    <div className="filter-bar">
      <div className="filter-input">
        <img src={personIcon} alt="icone RM" />
        <input type="text" placeholder="RM" />
      </div>
      <div className="filter-input">
        <img src={personIcon} alt="icone Aluno" />
        <input type="text" placeholder="Pesquisa por Aluno" />
      </div>
      <div className="filter-input">
        <img src={searchIcon} alt="icone Curso" />
        <input type="text" placeholder="Pesquisa por Curso" />
      </div>
      <div className="filter-input">
        <img src={turnIcon} alt="icone Turno" />
        <input type="text" placeholder="Turno" />
      </div>
      <div className="filter-input">
        <img src={professorIcon} alt="icone Coordenador" />
        <input type="text" placeholder="Coordenador" />
      </div>
      <div className="filter-input">
        <img src={anamneseIcon} alt="icone Status" />
        <input type="text" placeholder="Status Anamnese" />
      </div>
    </div>
  );
}
