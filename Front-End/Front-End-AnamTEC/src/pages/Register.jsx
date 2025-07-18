import React, { useState } from "react";
import "./Register.css";
import logoAnamTec from "../IMG/logoAnamTEC.png"


function Register() {
  const [activeTab, setActiveTab] = useState("register");

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
        
        <button onClick={() => setActiveTab("register")}>Register</button>
        
      </div>

      {/* FORMULÁRIO DE CADASTRO */}
      {activeTab === "register" && (
        <form className="register-form">
          <input className="input" type="text" placeholder="Nome de Usuário" />
          <input className="input" type="email" placeholder="Digite o seu e-mail aqui" />
          <input className="input" type="password" placeholder="Digite sua senha aqui" />
          <input className="input" type="password" placeholder="Confirme sua senha" />
          <div className="terms">
            <input type="checkbox" id="terms" />
            <label htmlFor="terms">Concordo com os Termos de Uso</label>
          </div>
          <button type="submit">Cadastrar</button>
        </form>
      
    )}
    </main>
    </div>
  );
}

export default Register;
