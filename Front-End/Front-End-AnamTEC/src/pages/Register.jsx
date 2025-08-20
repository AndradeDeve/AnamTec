import React, { useState } from "react";

import "./Register.css";
import logoAnamTec from "../assets/Anamtec-logo.png"
import {getFunction, postFunction} from "../services/APISevice"
import { useNavigate } from 'react-router-dom';


function Register() {
  const [activeTab, setActiveTab] = useState("register");

  function bntGetFunctionClick(e){
    e.preventDefault(); 
    {/*impede que o botão recarregue a página (comportamento padrão de um  */}


    // getFunctionaluno()
    // .then(data => console.log(data))
    // .catch(err => console.log(err));
    }



  function bntPostFunctionClick(e) {
  e.preventDefault(); // previne o reload da página

    <nav>
        <link to="/"/>
    </nav>
  // postFunctiona(formData) arrumar função para enviar os dados do formulário

    // .then(data => console.log("Dados salvos:", data))
    // .catch(err => console.error("Erro ao salvar:", err));
}
  {/*Dados que serão enviados para o banco. */}

  const token = localStorage.getItem("token"); // Pega o token do localStorage
  const [formData, setFormData] = useState({
    rm: "",
    nome: "",
    email: "",
    senha: "",
    cargo: "",
    token
  });

  

  return (

    <div className="register-container">
      
      {/* TOPO - Logo e Título */}
      <div className="asideContainerCadastro">
      <header className="header-Cadastro">
        <h1>AnamTec</h1>
        <img src={logoAnamTec} alt="Logo" className="logoa" />
      </header>
      <p className="frase">Dados que importam.<br/> Decisões que transformam </p>
      </div>

 
    

      {/* FORMULÁRIO DE CADASTRO */}
      {activeTab === "register" && (
        <form className="register-form">
       <div className="register-card-header">
          <h2>Cadastro de Profissional</h2>
        </div>
          <div className="group">
            <label>RM:</label>
            <input 
              className="input" type="number" placeholder="Informe o RM" value={formData.rm}
              onChange={(e) => setFormData({ ...formData, rm: e.target.value })}
            />
          </div>
          <div className="group">
          <label for= "nome">Nome de Usuário:</label>
          <input 
            className="input" type="Text" placeholder="Nome"  value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value})}
            />
      </div>
         <div className="group">
          <label>Email:</label>
          <input
            className="input" type="text" placeholder="Email" value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value})}
          />
          </div>
          <div className="group">
           <label>Senha:</label>
              <input
            className="input" type="text" placeholder="Senha" value={formData.senha}
            onChange={(e) => setFormData({ ...formData, senha: e.target.value})}
          />
          </div>
        <div className="group">
           <label>Cargo:</label>
              <select
            className="input" value={formData.cargo} onChange={(e) => setFormData({ ...formData, cargo: e.target.value})}
          >
            <option value="">Selecione o Cargo de acesso</option>
             <option value="Secretária">Secretária</option>
              <option value="Coordenador de Curso">Coordenador de Curso</option>
              <option value="Professor">Professor</option>
          </select>
        </div>
          <button type="submit" onClick={bntPostFunctionClick}>Cadastrar</button>

        </form>
        
    )}
    </div>
  );
}

// axios()

export default Register;
