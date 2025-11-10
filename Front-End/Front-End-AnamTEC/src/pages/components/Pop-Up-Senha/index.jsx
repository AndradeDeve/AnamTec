import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { toast } from 'react-toastify';
import { putFunctionUsuario } from '../../../services/APIService.js';
import  { jwtDecode } from "jwt-decode";
import './Senha.css'

const RedefineInfo = ({ show, onClose, emailUser, NomeUser }) => {

  const [formData, setFormData] = useState({
    email: "",
    senha: "",
    nome: "",
  });

  // Quando o modal abre, preenche o email e nome vindos das props
  useEffect(() => {
    if (show) {
      setFormData({
        email: emailUser || "",
        nome: NomeUser || "",
        senha: "",
      });
    }
  }, [show, emailUser, NomeUser]);

  const sendUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const infoUser = jwtDecode(token);
      const data = await putFunctionUsuario(infoUser.id, formData);
      if (data.status === 201) {
        toast.success('Informações atualizadas com sucesso!', { theme: "dark" });
        onClose();
      }
    } catch (erro) {
      console.log("Erro: ", erro);
      toast.error('Erro ao atualizar informações.', { theme: "dark" });
    }
  };

  return (
    <Modal className="" show={show} onHide={onClose} centered>
      <Modal.Header className="modalheader" closeButton>
        <Modal.Title className="title-modal">Confirmar Alteração</Modal.Title>
      </Modal.Header>

      <Modal.Body className="modal-body">
        <p>Confirme sua senha para salvar as alterações de nome ou e-mail.</p>

        <form onSubmit={sendUpdate}>

          <label>Senha:</label>
          <input
            type="password"
            placeholder="Digite sua senha para confirmar"
            value={formData.senha}
            onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
            required
          />
        </form>
      </Modal.Body>

      <Modal.Footer className="modal-footer">
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button variant="primary" onClick={sendUpdate}>Confirmar Alterações</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RedefineInfo;
