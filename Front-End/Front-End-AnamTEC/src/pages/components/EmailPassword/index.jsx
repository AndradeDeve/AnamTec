import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { toast } from 'react-toastify';
import { putFunctionEmailReset } from '../../../services/APIService.js'
import './EmailPassword.css';

const RedefineSenha = ({ show, onClose,  onEnviar }) => {

  const [formData, setFormData] = useState({email: ""});

  const sendEmail = async (e) => {
    e.preventDefault();
    try{
      const data = await putFunctionEmailReset(formData);
      if(data.status === 200){
        toast.success('E-mail enviado com sucesso.', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }

    }catch(erro){
      console.log("Erro: ", erro);
      toast.warn('Erro ao enviar e-mail.', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }

  return (
    <Modal className="modal" show={show} onHide={onClose}>
      <Modal.Header className="modalheader" closeButton>
        <Modal.Title className= "title-modal">Redefinição de Senha</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">
          <p>Informe um email abaixo para redefição de senha:</p>
        
        <ul>
          <form onSubmit={sendEmail}>
            <label className="text-email">Email: </label>
              <input
                  className="input-email"
                  type="text"
                  id="email"
                  name="email"
                  placeholder="Informe o email"
                  value={setFormData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
              />
            </form>
        </ul>
      </Modal.Body>
      <Modal.Footer className="modal-footer">
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button type="submit" >Enviar e-mail</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RedefineSenha;