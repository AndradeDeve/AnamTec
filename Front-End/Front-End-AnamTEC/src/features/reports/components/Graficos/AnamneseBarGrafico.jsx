// src/features/reports/components/Charts/AnamnesisBarChart.jsx
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const AnamnesisBarChart = ({ data }) => {
  return (
    // ResponsiveContainer garante que o gráfico se ajuste à div do Bootstrap
    <ResponsiveContainer width="100%" height="100%">
      <BarChart 
        data={data}
        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" /> {/* 'name' é o rótulo (Set/25) */}
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#3b71ca" /> {/* 'count' é o valor (10, 15) */}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AnamnesisBarChart;