// src/features/reports/hooks/useReportData.js
import { useState, useEffect, useMemo } from 'react';
// import { fetchAnamnesisData } from '../../../services/APIService'; 

// Função auxiliar para agregar dados de distribuição (contagem por categoria)
const aggregateDistributionData = (data, categoryKey) => {
  const counts = data.reduce((acc, item) => {
    const key = item[categoryKey] || 'N/A';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

 
  return Object.keys(counts).map(key => ({
    name: key,
    value: counts[key],
  }));
};

export function useReportData() {
  const [data, setData] = useState([]); // Dados brutos da API
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    course: 'all',
    ageRange: 'all',
    gender: 'all',
    status: 'all',
    timeframe: 'month',
    distributionCategory: 'gender', // Novo filtro para o gráfico de pizza: 'gender' ou 'status'
  });

  // 1. Fetch dos Dados (Simulação)
  useEffect(() => {
    // Dados Mockados para Demonstração:
    const mockData = [
      { id: 1, date: '2025-09-01', course: 'Engenharia', age: 22, gender: 'M', status: 'completed' },
      { id: 2, date: '2025-09-15', course: 'Medicina', age: 19, gender: 'F', status: 'pending' },
      { id: 3, date: '2025-10-05', course: 'Engenharia', age: 25, gender: 'F', status: 'completed' },
      { id: 4, date: '2025-10-10', course: 'Medicina', age: 30, gender: 'M', status: 'completed' },
      { id: 5, date: '2025-10-12', course: 'Direito', age: 21, gender: 'F', status: 'pending' },
      // ... muitos mais dados
    ];
    setData(mockData);
    setLoading(false);
  }, []);

  // 2. Lógica de Filtragem (Otimizada com useMemo)
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Aplique todos os filtros (course, ageRange, gender, status)
      const matchesCourse = filters.course === 'all' || item.course === filters.course;
      const matchesGender = filters.gender === 'all' || item.gender === filters.gender;
      const matchesStatus = filters.status === 'all' || item.status === filters.status;
      // ... outros filtros aqui
      return matchesCourse && matchesGender && matchesStatus; 
    });
  }, [data, filters]);

  // 3. Processamento dos Dados para o Gráfico de Barras/Linhas (Timeframe)
  const getBarChartData = (data, timeframe) => {
    // Lógica de agregação por dia, semana ou mês
    // ... (Mantida a estrutura da implementação anterior)
    return [
        { name: 'Set/25', count: 2 },
        { name: 'Out/25', count: 3 },
    ];
  };

  const barChartData = useMemo(() => {
    return getBarChartData(filteredData, filters.timeframe);
  }, [filteredData, filters.timeframe]);

  // 4. Processamento dos Dados para o Gráfico de Pizza (Distribuição)
  const pieChartData = useMemo(() => {
    return aggregateDistributionData(filteredData, filters.distributionCategory);
  }, [filteredData, filters.distributionCategory]); // Depende do filtro e da categoria escolhida

  return { 
    loading, 
    filters, 
    setFilters, 
    filteredData, 
    barChartData, 
    pieChartData // Expondo os dados do gráfico de pizza
  };
}