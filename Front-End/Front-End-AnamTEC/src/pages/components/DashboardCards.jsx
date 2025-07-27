import React from 'react';
import './DashboardCards.css';
import formIcon from '../../IMG/forms-icon.png';
const cards = [
  { title: 'Alunos Cadastrados', value: 1000, color: 'bg-cyan' },
  { title: 'Anamneses Concluídas', value: 856, color: 'bg-green' },
  { title: 'Anamneses Pendentes', value: 144, color: 'bg-red' },
];

export default function DashboardCards() {
  return (
    <div className="cards-container">
      {cards.map((card, index) => (
        <div key={index} className={`dashboard-card ${card.color}`}>
          <img src={formIcon} alt="" />
          <p>{card.value}</p>
          <h3>{card.title}</h3>
        </div>
      ))}
    </div>
  );
}
