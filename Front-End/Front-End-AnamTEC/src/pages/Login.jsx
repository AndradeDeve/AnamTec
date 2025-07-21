// src/pages/Login.jsx
import React from 'react';
import "./Login.css";
import logoAnamTec from "../IMG/logoAnamTEC.png"

export default function Login() {
  return (
    <div className="login-container">
      <div className="header">
        <h1>AnamTec</h1>
      <img src={logoAnamTec} alt="Logo" className="logo" />
      </div>

      <div className="login-card">
        <div className="card-header">
          <h2>Acesso ao Sistema</h2>
        </div>
        <div className="card-body">
          <label htmlFor="email">Digite seu e-mail</label>
          <input type="email" id="email" placeholder="E-mail" />

          <label htmlFor="senha">Digite sua senha</label>
          <input type="password" id="senha" placeholder="Senha" />

          <button>ENTRAR</button>
        </div>
      </div>
    </div>
  );
}

