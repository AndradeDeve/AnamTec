// Importa o React e o useState, que vamos usar para controlar os campos do formulário
import React, { useState } from 'react';

// Importa o CSS específico da tela de login
import "./Login.css";

// Importa a imagem da logo
import logoAnamTec from "../assets/Anamtec-logo.png";

// Componente funcional da tela de login
export default function Login() {

// Cria o estado formData para armazenar email e senha digitados
const [formData, setFormData] = useState({ email: "", senha: "" });

  // Função executada quando o usuário clica no botão "ENTRAR"
  const handleLogin = (e) => {
    e.preventDefault(); // Evita o recarregamento da página
    console.log("Login com:", formData); // Aqui podemos enviar os dados para um backend ou API
  };

  // Estrutura visual (HTML JSX) da tela de login
  return (
    <div className="login-container">
      {/* Cabeçalho com logo e nome do sistema */}
      <div className="aside-containerLogin">
      <div className="header-logo">
        <h1>AnamTec</h1>
        <img src={logoAnamTec} alt="Logo" className="logo" />
      </div>
       <p className="frase">Dados que importam.<br/> Decisões que transformam </p>
      </div>

      {/* Cartão de login */}
      <div className="login-card">
        <div className="login-card-header">
          <h2>Acesso ao Sistema</h2>
        </div>

        {/* Formulário de login com os campos controlados */}
        <form onSubmit={handleLogin} className="card-body">

          {/* Campo de e-mail */}
          <label htmlFor="email">Digite seu e-mail</label>
          <input
            type="email"
            id="email"
            placeholder="E-mail"
            value={formData.email} // Valor do input controlado pelo estado
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} // Atualiza o estado ao digitar
          />

          {/* Campo de senha */}
          <label htmlFor="senha">Digite sua senha</label>
          <input
            type="password"
            id="senha"
            placeholder="Senha"
            value={formData.senha}
            onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
          />

          {/* Botão de envio do formulário */}
          <button type="submit">ENTRAR</button>
        </form>
      </div>
    </div>
  );
}
