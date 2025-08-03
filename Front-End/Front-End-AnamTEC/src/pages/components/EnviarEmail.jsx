import React from "react";
import { Modal, Button } from "react-bootstrap";
import './EnviarEmail.css'
const EnviarEmailModal = ({ show, onClose, alunosPendentes, onEnviar }) => {
  return (
    <Modal className="modal" show={show} onHide={onClose}>
      <Modal.Header className="modalheader" closeButton>
        <Modal.Title className= "modalTitle">Envio de E-mails Anamnese pendentes</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modalbody">
        <p>O objetivo desse email é para recordar alunos e responsáveis de concluir as informações da Anamnese :</p>
        <ul>
          {alunosPendentes.map(aluno => (
            <li key={aluno.id}>{aluno.nome} - {aluno.emailResponsavel}</li>
          ))}
        </ul>
      </Modal.Body>
      <Modal.Footer className="modalfooter">
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button variant="primary" onClick={onEnviar}>Enviar Lembretes</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EnviarEmailModal;
