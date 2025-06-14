import React, { useState } from "react";
import "./Register.css";
import logoAnamTec from "../IMG/logoAnamTEC.png"
import {getFunction, postFunction} from "../services/APISevice"


function Register() {
  const [activeTab, setActiveTab] = useState("register");

  function bntGetFunctionClick(e){
    e.preventDefault();

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

  const [formData, setFormData] = useState({
    ra: "",
    nome: "",
    data_nasc: "",
    genero: "",
    email: "",
    telefone: ""
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
        <button onClick={() => setActiveTab("login")}>LOGIN</button>
        <button onClick={() => setActiveTab("register")}>Register</button>
        <button onClick={() => setActiveTab("reset")}>Reset Password</button>
        
      </div>

      {/* FORMULÁRIO DE CADASTRO */}
      {activeTab === "register" && (
        <form className="register-form">
          
          <input 
            className="input"
            type="text"
            placeholder="RA"
            value={formData.ra}
            onChange={(e) => setFormData({ ...formData, ra: e.target.value })}
          />
          <input 
            className="input"
            type="Text"
            placeholder="Nome" 
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value})}
            />
          <input
            className="input" 
            type="date"
            placeholder="Data de nascimento"
            value={formData.data_nasc}
            onChange={(e) => setFormData({ ...formData, data_nasc: e.target.value })}
          />
          <input
          className="input"
          type="text"
          placeholder="Genero"
          value={formData.genero}
          onChange={(e) => setFormData({ ...formData, genero: e.target.value})}
          />
          <input
            className="input"
            type="text"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value})}
          />
          <input
          className="input"
          type="text"
          placeholder="telefone"
          value={formData.telefone}
          onChange={(e) => setFormData({ ...formData, telefone: e.target.value})}
          />
          <div className="terms">
            <input type="checkbox" id="terms" />
            <label htmlFor="terms">Concordo com os Termos de Uso</label>
          </div>
          <button type="submit" onClick={bntGetFunctionClick} >Get function </button>
          <button type="submit" onClick={bntPostFunctionClick}>Post function </button>
        </form>
      
    )}
    </main>
    </div>
  );
}

// axios()

export default Register;
