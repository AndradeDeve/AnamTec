import React from 'react';
import './DashboardCards.css';
import formIcon from '../../../assets/forms-icon.png';
import ConfirmedIcon from '../../../assets/confirmedCheck.png';
import ErrorIcon from '../../../assets/errorIcon.png';

const cards = [
  { title: 'Alunos Cadastrados', value: 17, color: 'bg-cyan', icon:formIcon },
  { title: 'Anamneses Concluídas', value: 9, color: 'bg-green', icon: ConfirmedIcon },
  { title: 'Anamneses Pendentes', value: 8, color: 'bg-red', icon:ErrorIcon },
];

export default function DashboardCards() {
  return (
    <div className="container  my-1">
      <div className="row g-4">
        {cards.map((card, index) => (
          <div key={index} className="col-4 col-sm-6 col-md-4 mb-3" >
            <div className={`dashboard-card text-white text-center p-4 rounded shadow 
              ${card.color}`}>
              <img src={card.icon} alt={`ícone ${card.title}`} className="mb-2" />
              <p className="display-5">{card.value}</p>
              <h3 className="h4">{card.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
