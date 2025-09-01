import React from "react";
import EnviarEmailModal from '../SendingEmail/EnviarEmail';
import './ButtonGrid.css';

const ButtonGrid = ({ onCadastrar, onEnviarEmail, showModal, setShowModal, alunosPendentes, onEnviar }) => {
  return (
    <div className="container my-3">
      <div className="row justify-content-center">
        <div className="col-12">
          <button className="custom-btn" onClick={onCadastrar}>Cadastrar</button>
        </div>

        <div className="col-12">
          <button className="custom-btn" onClick={onEnviarEmail}>Enviar Email</button>
        </div>

        <EnviarEmailModal
          show={showModal}
          onClose={() => setShowModal(false)}
          alunosPendentes={alunosPendentes}
          onEnviar={onEnviar}
        />
      </div>
    </div>
  );
};

export default ButtonGrid;
