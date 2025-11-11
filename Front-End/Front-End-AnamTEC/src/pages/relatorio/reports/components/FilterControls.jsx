import React from 'react';
import './FilterControls.css';

const cursosDisponiveis = [
  "Administração",
  "Recursos Humanos",
  "Contabilidade",
  "Administração (Ensino médio)",
  "Desenvolvimento de Sistemas",
  "Redes de Computadores",
  "Redes de Computadores (Ensino médio)",
  "Desenvolvimento de Sistemas (Ensino médio)",
  "Informática",
  "Eletroeletrônica",
  "Automação Industrial (Ensino Médio)",
  "Agenciamento de viagens",
];

const idade = [
  "Entre: 14 a 16",
  "Entre 17 a 20",
  "Entre 21 a 25",
  "Entre 26 a 30",
  "Entre 30+"
];

const FilterControls = ({ filters, onFilterChange }) => {
  return (
    <div className="p-3 border rounded bg-light">
      <div className="row g-4">
        {/* Filtro por Curso */}
        <div className="col-md-5">
          <label className="form-label small">Curso</label>
          <select 
            className="form-select" 
            value={filters.course} 
            onChange={(e) => onFilterChange('course', e.target.value)}
          >
            <option value="all">Todos os Cursos</option>
            {cursosDisponiveis.map((curso) => (
              <option key={curso} value={curso}>
                {curso}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Faixa Etária */}
        <div className="col-md-3">
          <label className="form-label small">Faixa Etária</label>
          <select 
            className="form-select" 
            value={filters.ageRange} 
            onChange={(e) => onFilterChange('ageRange', e.target.value)}
          >
            <option value="all">Todas</option>
            {idade.map((faixa) => (
              <option key={faixa} value={faixa}>
                {faixa}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Período */}
        <div className="col-md-3">
          <label className="form-label small">Agrupar por</label>
          <select 
            className="form-select" 
            value={filters.timeframe} 
            onChange={(e) => onFilterChange('timeframe', e.target.value)}
          >
            <option value="day">Dia</option>
            <option value="week">Semana</option>
            <option value="month">Mês</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;
