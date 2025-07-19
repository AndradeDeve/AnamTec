// src/pages/Login.jsx
import React from 'react';
import "./Login.css";
import logoAnamTec from "../IMG/logoAnamTEC.png"
function Login() {
    
  return (
    <div className='top-layout' >
        <header className="header">
            <h1 className="TitleLogo">AnamTec</h1>
            <img src={logoAnamTec} alt="Logo" className="logo" />
      </header>
 <div className='bottom-layout'>
        <h2 className='title'>Acesso ao Sistema</h2>
      <form className='forms'>
        <label>Digite seu Email</label>
        <input className='input' type="text" placeholder="Email" />
           <label>Digite sua Senha</label>
        <input className='input' type="password" placeholder="Senha" />
        <button className='btn-login' type="submit">Entrar</button>
      </form>
    </div>
   </div>
  );
}

export default Login;
