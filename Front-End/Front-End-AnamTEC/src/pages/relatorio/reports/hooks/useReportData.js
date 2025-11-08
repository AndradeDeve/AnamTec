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
    gender: 'all',
    status: 'all',
    timeframe: 'month',
    distributionCategory: 'gender', // Novo filtro para o gráfico de pizza: 'gender' ou 'status'
  });

  // 1. Fetch dos Dados (Simulação)
   useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getFunctionAluno();
        console.log("📊 Dados recebidos da API:", result);

        const normalized = result.map(item => ({
          id: item.id,
          date: item.anamineseData || "Não efetuada",
          course: item.nome_curso || "Não informado",
          age: item.dataNascimento || 0,
          gender: item.genero_aluno || "N/A",
          status: item.status || "Não informado",
        }));

        console.log('dados normalizados:', normalized);
        setData(normalized);
      } catch (error) {
        console.error('❌ Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesCourse = filters.course === 'all' || item.course === filters.course;
      const matchesGender = filters.gender === 'all' || item.gender === filters.gender;
      const matchesStatus = filters.status === 'all' || item.status === filters.status;

      return matchesCourse && matchesGender && matchesStatus; 
    });
  }, [data, filters]);

const getBarChartData = (data, timeframe) => {
  if (!data || data.length === 0) return [];

  const validData = data.filter(item => item.date && item.date !== "Não efetuada");

  const counts = {};

  validData.forEach(item => {
    const date = new Date(item.date);
    if (isNaN(date)) return; // ignora datas inválidas

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
      default: // "month"
        key = date.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
        break;
    }

    counts[key] = (counts[key] || 0) + 1;
  });

  // Converte em array [{ name, count }]
  return Object.entries(counts).map(([name, count]) => ({ name, count }));
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