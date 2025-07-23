import React, { useState } from "react";
import "./Register.css";
import logoAnamTec from "../IMG/logoAnamTEC.png"
import {getFunction, postFunction} from "../services/APISevice"


function Register() {
  const [activeTab, setActiveTab] = useState("register");

  function bntGetFunctionClick(e){
    e.preventDefault(); 
    {/*impede que o botão recarregue a página (comportamento padrão de um  */}


    getFunction()
    .then(data => console.log(data))
    .catch(err => console.log(err));
    }



  function bntPostFunctionClick(e) {
  e.preventDefault(); // previne o reload da página

  postFunction(formData)
    .then(data => console.log("Dados salvos:", data))
    .catch(err => console.error("Erro ao salvar:", err));
}
  {/*Dados que serão enviados para o banco. */}
  const [formData, setFormData] = useState({
    rm: "",
    nome: "",
    email: "",
    senha: "",
    cargo: ""
  });

  return (

    <div className="register-container">
      
      {/* TOPO - Logo e Título */}
      <header className="header">
        <h1 className="TitleLogo">AnamTec</h1>
        <img src={logoAnamTec} alt="Logo" className="logo" />
      </header>
    <main className="Forms-box">
      {/* NAVEGAÇÃO ENTRE AS ABAS */}
      <div className="tabs">
        <button onClick={() => setActiveTab("register")}>Cadastro de Profissional</button>
      </div>

      {/* FORMULÁRIO DE CADASTRO */}
      {activeTab === "register" && (
        <form className="register-form">
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
    </main>
    </div>
  );
}

// axios()

export default Register;
