import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useReportData } from './hooks/useReportData';
import FilterControls from './components/FilterControls';
import AnamnseBarGrafico from './components/Graficos/AnamneseBarGrafico'; 
import AnamnsePieGrafico from './components/Graficos/AnamnesePieGrafico'; 
import Header from "../../components/Header/Header"; 
export default function ReportsDashboard() {

  const navigate = useNavigate(); 

  const { 
    loading, 
    filters, 
    setFilters, 
    barChartData, 
    pieChartData, 
  } = useReportData();

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const getPieChartTitle = (category) => {
      switch (category) {
          case 'gender': return 'Distribuição por Gênero';
          case 'status': return 'Distribuição por Status de Preenchimento';
          default: return 'Distribuição';
      }
  }

  if (loading) {
    return <div className="text-center p-5">Carregando dados...</div>;
  }
  return (
    <>
       <Header />

    <div className="container-fluid p-4">
   
      
      <h1 className="mb-4 text-center">Relatórios de Anamneses</h1>
      
      {/* Linha de Filtros */}
      <div className="row mb-4">
        <div className="col-12">
          <FilterControls 
            filters={filters} 
            onFilterChange={handleFilterChange} 
          />
        </div>
      </div>

      {/* Linha de Gráficos */}
      <div className="row">
        {/* Gráfico 1 */}
        <div className="col-12 col-lg-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-header">
              Anamneses Realizadas por {filters.timeframe === 'day' ? 'Dia' : filters.timeframe === 'week' ? 'Semana' : 'Mês'}
            </div>
            <div className="card-body" style={{ height: '300px' }}>
              <AnamnseBarGrafico data={barChartData} /> 
            </div>
          </div>
        </div>

        {/* Gráfico 2 */}
        <div className="col-12 col-lg-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-header">
              {getPieChartTitle(filters.distributionCategory)}
            </div>
            <div className="card-body" style={{ height: '300px' }}>
              <AnamnsePieGrafico 
                data={pieChartData} 
                title={getPieChartTitle(filters.distributionCategory)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
  );
}