import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { showToast } from "../../../Utils/toast.js";
import { putFunctionEmailReset } from '../../../services/APIService.js'
import './EmailPassword.css';

const RedefineSenha = ({ show, onClose,  onEnviar }) => {

  const [formData, setFormData] = useState({email: ""});

  const sendEmail = async (e) => {
    e.preventDefault();
    try{
      console.log(formData)
      const data = await putFunctionEmailReset(formData);
      if(data.status === 200){
        showToast("success", 'Senha enviada para o E-mail.')
      }

    }catch(erro){
      console.log("Erro: ", erro);
      showToast("warn",'Informe um e-mail válido.')
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
              <input className="input-email" type="text" id="email" name="email"
                      placeholder="Informe o email" value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })
                  }
              />
          </form>
        </ul>
      </Modal.Body>
      <Modal.Footer className="modal-footer">
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button onClick={sendEmail}>Enviar e-mail</Button>
      </Modal.Footer>
    </Modal>
  );
};
export default RedefineSenha;