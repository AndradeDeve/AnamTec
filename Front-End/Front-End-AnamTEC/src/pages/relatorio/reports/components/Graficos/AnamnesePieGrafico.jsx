// src/features/reports/components/Charts/AnamnesisPieChart.jsx
import React, { useCallback } from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

// Cores que serão usadas para as fatias do gráfico (escolha cores que contrastam bem)
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

// Componente Customizado para o Rótulo (opcional, mas comum para Pie Charts)
const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const AnamnesisPieChart = ({ data, title }) => {
  // Garantir que os dados existam para evitar erros de renderização
  if (!data || data.length === 0) {
    return <div className="p-3 text-center">Nenhum dado para mostrar neste gráfico.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"         // A chave que contém o valor (a contagem)
          nameKey="name"          // A chave que contém o rótulo (ex: 'Homens')
          cx="50%"                // Centro X
          cy="50%"                // Centro Y
          outerRadius={100}       // Raio do gráfico de pizza
          fill="#8884d8"
          labelLine={false}
          // label={<CustomLabel />} // Habilita o rótulo de porcentagem
        >
          {/* Mapeia os dados para aplicar cores diferentes a cada fatia (Cell) */}
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value, name) => [`${value} anamneses`, name]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default AnamnesisPieChart;