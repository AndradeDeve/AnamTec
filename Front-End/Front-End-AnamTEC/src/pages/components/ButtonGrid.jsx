import React from "react";
import './ButtonGrid.css'

  // Função executada quando o usuário clica no botão "ENTRAR"
  const BtnActions =({onCadastrar, onEnviarEmail, onPesquisar }) => {
    return (
        <div className="btn-actions">
            <button className="btn-cadastro" onClick={onCadastrar}>Cadastrar</button>
            <button className="btn-EnviarEmail" onClick={onEnviarEmail}>Enviar Email</button>
            <button className="btn-Pesquisar" onClick={onPesquisar}>Pesquisar</button>
        </div>
    );
  };

  export default BtnActions;