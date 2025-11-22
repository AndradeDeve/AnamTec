import React, { useState, useEffect } from "react";
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
    if (e && e.preventDefault) e.preventDefault();
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
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Confirmar Alteração</h3>
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

        <div className="modal-actions">
          <button
            type="button"
            className="btn-salvar btn-cancel"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="btn-salvar btn-confirm"
            onClick={sendUpdate}
          >
            Confirmar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};

export default RedefineInfo;
