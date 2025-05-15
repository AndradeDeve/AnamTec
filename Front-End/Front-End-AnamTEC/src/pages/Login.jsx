import React from 'react';
import './Login.css';

function Login() {
  return (
    <div className="login-container">
      <h2>Login</h2>
      <form className="login-form">
        <label>Email:</label>
        <input type="email" placeholder="Digite seu e-mail" />

        <label>Senha:</label>
        <input type="password" placeholder="Digite sua senha" />

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default Login;
