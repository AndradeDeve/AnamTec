// src/features/reports/hooks/useReportData.js
import { useState, useEffect, useMemo } from 'react';
import { getFunctionAluno } from '../../../../services/APIService';

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
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    course: 'all',
    ageRange: 'all',
    timeframe: 'month',
    distributionCategory: 'gender',
  });

  // 1. Buscar dados da API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getFunctionAluno();
        console.log("📊 Dados recebidos da API:", result);

        const normalized = result.map(item => ({
          id: item.id,
          date: item.anamineseData || "Não efetuada",
          course: item.nome_curso || "Não informado",
          age: item.dataNascimento || null,
          gender: item.genero_aluno || "N/A",
          status: item.status || "Não informado",
        }));

        setData(normalized);
      } catch (error) {
        console.error('❌ Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 2. Filtragem de dados (incluindo faixa etária)
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesCourse = filters.course === 'all' || item.course === filters.course;

      // Calcula idade a partir da data de nascimento
      let matchesAgeRange = true;
      if (filters.ageRange !== 'all' && item.age) {
        const birthYear = new Date(item.age).getFullYear();
        const currentYear = new Date().getFullYear();
        const age = currentYear - birthYear;

        matchesAgeRange =
          (filters.ageRange === 'Entre: 14 a 16' && age >= 14 && age <= 16) ||
          (filters.ageRange === 'Entre 17 a 20' && age >= 17 && age <= 20) ||
          (filters.ageRange === 'Entre 21 a 25' && age >= 21 && age <= 25) ||
          (filters.ageRange === 'Entre 26 a 30' && age >= 26 && age <= 30) ||
          (filters.ageRange === 'Entre 30+' && age >= 30);
      }

      return matchesCourse && matchesAgeRange;
    });
  }, [data, filters]);

  // 3. Processamento dos dados para o gráfico de barras
  const getBarChartData = (data, timeframe) => {
    if (!data || data.length === 0) return [];

    const validData = data.filter(item => item.date && item.date !== "Não efetuada");
    const counts = {};

    validData.forEach(item => {
      const date = new Date(item.date);
      if (isNaN(date)) return;

      let key = "";
      switch (timeframe) {
        case "day":
          key = date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
          break;
        case "week":
          const week = Math.ceil(date.getDate() / 7);
          key = `${week}ª Sem/${date.getMonth() + 1}`;
          break;
        case "year":
          key = date.getFullYear().toString();
          break;
        default:
          key = date.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
          break;
      }

      counts[key] = (counts[key] || 0) + 1;
    });

    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  };

  const barChartData = useMemo(() => {
    return getBarChartData(filteredData, filters.timeframe);
  }, [filteredData, filters.timeframe]);

  // 4. Processamento dos dados para o gráfico de pizza
  const pieChartData = useMemo(() => {
    return aggregateDistributionData(filteredData, filters.distributionCategory);
  }, [filteredData, filters.distributionCategory]);

  return { 
    loading, 
    filters, 
    setFilters, 
    filteredData, 
    barChartData, 
    pieChartData 
  };
}
