import React from "react";
import EnviarEmailModal from '../SendingEmail/EnviarEmail';
import './ButtonGrid.css';

const ButtonGrid = ({ onCadastrar, onEnviarEmail, showModal, setShowModal, alunosPendentes, onEnviar }) => {
  return (
 
      <div className=" d-flex container my-5 row justify-content-center">
        <div className="button-row">
          <button className="custom-btn" onClick={onCadastrar}>Cadastrar</button>
          <button className="custom-btn" onClick={onEnviarEmail}>Enviar Email</button>
        </div>

        <EnviarEmailModal
          show={showModal}
          onClose={() => setShowModal(false)}
          alunosPendentes={alunosPendentes}
          onEnviar={onEnviar}
        />
      </div>
 
  );
};

export default ButtonGrid;
