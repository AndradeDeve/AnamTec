// src/features/reports/components/FilterControls.jsx
import React from 'react';

const FilterControls = ({ filters, onFilterChange, courseOptions, ageOptions }) => {
  return (
    <div className="p-3 border rounded bg-light">
      <div className="row g-3">
        {/* Filtro por Curso */}
        <div className="col-md-3">
          <label className="form-label small">Curso</label>
          <select 
            className="form-select" 
            value={filters.course} 
            onChange={(e) => onFilterChange('course', e.target.value)}
          >
            <option value="all">Todos os Cursos</option>
            {/* Renderizar options dinamicamente a partir de courseOptions */}
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
            <option value="18-25">18 a 25 anos</option>
            {/* ... */}
          </select>
        </div>
        
        {/* Filtro por Período (timeframe) */}
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
        
        {/* ... Adicionar filtros para Sexo e Status */}
      </div>
    </div>
  );
};

export default FilterControls;