import React from "react";
import { Modal, Button } from "react-bootstrap";
import './EmailPassword.css'
const RedefineSenha = ({ show, onClose,  onEnviar }) => {
  return (
    <Modal className="modal" show={show} onHide={onClose}>
      <Modal.Header className="modalheader" closeButton>
        <Modal.Title className= "title-modal">Redefinição de Senha</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">
          <p>Informe um email abaixo para redefição de senha:</p>
        
        <ul>
          <label className="text-email">Email: </label>
             <input
                className="input-email"
                type="text"
                id="email"
                name="email"
                placeholder="Informe o email"
            />
        </ul>
      </Modal.Body>
      <Modal.Footer className="modal-footer">
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button variant="primary" onClick={onEnviar}>Enviar Lembretes</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RedefineSenha;