import React, { useState, useEffect } from 'react';
import './DashboardCards.css';
import formIcon from '../../../assets/forms-icon.png';
import ConfirmedIcon from '../../../assets/confirmedCheck.png';
import ErrorIcon from '../../../assets/errorIcon.png';
import { getFunctionAlunoCards } from '../../../services/APIService';

export default function DashboardCards({ onCardClick }) {
  const [numerosAl, setNumerosAl] = useState({
    totalAlunos: 0,
    anamineseConcluida: 0,
    anaminesePendente: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNumerosAl = async () => {
      try {
        const response = await getFunctionAlunoCards();
        setNumerosAl({
          totalAlunos: response.data.total_alunos,
          anamineseConcluida: response.data.anaminese_concluida,
          anaminesePendente: response.data.anaminese_pendente
        });
      } catch (err) {
        console.log("Erro: ", err);
        setNumerosAl({
          totalAlunos: 0,
          anamineseConcluida: 0,
          anaminesePendente: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNumerosAl();
  }, []);

  // 🔹 Agora definimos qual "tipo" cada card representa
  const cards = [
    { title: 'Alunos Cadastrados', value: numerosAl.totalAlunos, color: 'bg-cyan', icon: formIcon, type: 'todos' },
    { title: 'Anamneses Concluídas', value: numerosAl.anamineseConcluida, color: 'bg-green', icon: ConfirmedIcon, type: 'concluida' },
    { title: 'Anamneses Pendentes', value: numerosAl.anaminesePendente, color: 'bg-red', icon: ErrorIcon, type: 'pendente' },
  ];

  return (
    <div className="container my-1">
      <div className="row g-3">
        {cards.map((card, index) => (
          <div key={index} className="col-4 col-md-4 mb-3">
            <div
              className={`dashboard-card text-white text-center p-4 rounded shadow ${card.color}`}
              style={{ cursor: 'pointer' }}
              onClick={() => onCardClick && onCardClick(card.type)} 
            >
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
