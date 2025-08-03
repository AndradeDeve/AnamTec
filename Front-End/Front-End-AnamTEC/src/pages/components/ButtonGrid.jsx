import React from "react";
import EnviarEmailModal from './EnviarEmail';
import './ButtonGrid.css';

const ButtonGrid = ({ onCadastrar, onEnviarEmail, onPesquisar, showModal, setShowModal, alunosPendentes, onEnviar }) => {
  return (
    <div className="btn-actions">
      <button className="btn-cadastro" onClick={onCadastrar}>Cadastrar</button>

      <button className="btn-EnviarEmail" onClick={onEnviarEmail}>
        Enviar Email
      </button>

      <EnviarEmailModal 
      className="btn-EnviarEmail"
        show={showModal}
        onClose={() => setShowModal(false)}
        alunosPendentes={alunosPendentes}
        onEnviar={onEnviar}
      />

      <button className="btn-Pesquisar" onClick={onPesquisar}>Pesquisar</button>
    </div>
  );
};

export default ButtonGrid;
