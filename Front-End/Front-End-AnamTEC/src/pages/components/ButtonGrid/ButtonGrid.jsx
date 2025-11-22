import React from "react";
import EnviarEmailModal from '../SendingEmail/EnviarEmail';
import './ButtonGrid.css';

const ButtonGrid = ({ onCadastrar, onEnviarEmail, showModal, setShowModal, alunosPendentes, onEnviar }) => {
  return (
 
      <div className=" d-flex container mb-4 row justify-content-center">
        <div className="button-row">
          <a href="http://localhost:3001/" target="_blanck"><button className="custom-btn" onClick={onCadastrar}>Cadastrar</button></a>
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
