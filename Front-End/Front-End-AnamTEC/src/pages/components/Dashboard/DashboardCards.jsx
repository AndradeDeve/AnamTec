import React from 'react';
import './DashboardCards.css';
import formIcon from '../../../assets/forms-icon.png';

const cards = [
  { title: 'Alunos Cadastrados', value: 17, color: 'bg-cyan' },
  { title: 'Anamneses Concluídas', value: 9, color: 'bg-green' },
  { title: 'Anamneses Pendentes', value: 8, color: 'bg-red' },
];

export default function DashboardCards() {
  return (
    <div className="container my-1">
      <div className="row g-3">
        {cards.map((card, index) => (
          <div
            key={index}
            className="col-12 col-sm-6 col-md-4 col-lg-4 mb-4"
          >
            <div className={`dashboard-card text-white text-center p-4 rounded shadow ${card.color}`}>
              <img src={formIcon} alt="ícone formulário" className="mb-2" />
              <p className="display-5">{card.value}</p>
              <h3 className="h4">{card.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
