import React from "react";
import { Modal, Button } from "react-bootstrap";
import './EmailPassword.css'
const RedefineSenha = ({ show, onClose,  onEnviar }) => {
  return (
    <Modal className="modal" show={show} onHide={onClose}>
      <Modal.Header className="modalheader" closeButton>
        <Modal.Title className= "modalTitle">Redefinição de Senha</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modalbody">
        <p>Informe um email abaixo para redefição de senha:</p>
          <label htmlFor="rm">Email: </label>
        
        <ul>
             <input
                type="text"
                id="email"
                name="email"
                placeholder="Informe o email"
            />
        </ul>
      </Modal.Body>
      <Modal.Footer className="modalfooter">
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button variant="primary" onClick={onEnviar}>Enviar Lembretes</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RedefineSenha;