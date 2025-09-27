import React, {useState, useEffect} from 'react';
import './DashboardCards.css';
import formIcon from '../../../assets/forms-icon.png';
import ConfirmedIcon from '../../../assets/confirmedCheck.png';
import ErrorIcon from '../../../assets/errorIcon.png';
import {getFunctionAlunoCards} from '../../../services/APIService'





export default function DashboardCards() {
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
        console.log(response.data)
        setNumerosAl({
          totalAlunos: response.data.total_alunos,
          anamineseConcluida: response.data.anaminese_concluida,
          anaminesePendente: response.data.anaminese_pendente
        });
        console.log("Resposta completa:",numerosAl);
      } catch(err) {
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

  const cards = [
  { title: 'Alunos Cadastrados', value: numerosAl.totalAlunos, color: 'bg-cyan', icon:formIcon },
  { title: 'Anamneses Concluídas', value: numerosAl.anamineseConcluida, color: 'bg-green', icon: ConfirmedIcon },
  { title: 'Anamneses Pendentes', value: numerosAl.anaminesePendente, color: 'bg-red', icon:ErrorIcon },
];

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
