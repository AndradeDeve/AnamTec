import React from 'react';
import '../components/DashboardCards.css'
const cards = [
  { title: 'Alunos Cadastrados', value: 1000, color: 'bg-cyan-600' },
  { title: 'Anamneses Concluídas', value: 856, color: 'bg-green-600' },
  { title: 'Anamneses Pendentes', value: 144, color: 'bg-red-600' },
];

export default function DashboardCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card, index) => (
        <div key={index} className={`${card.color} text-white p-6 rounded-lg shadow`}>
          <h3 className="text-lg font-semibold">{card.title}</h3>
          <p className="text-2xl">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
