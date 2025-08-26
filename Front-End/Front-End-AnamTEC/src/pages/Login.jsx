// Importa o React e o useState, que vamos usar para controlar os campos do formulário
import React, { useState, useEffect } from 'react';

import { ToastContainer, toast } from 'react-toastify';

// Importa o CSS específico da tela de login
import "./Login.css";

// Importa a função post para fazer o login do usuario 
import { postFunctionLogin, postFunctionUser } from '../services/APISevice';

// Importa a imagem da logo

import logoAnamTec from "../assets/Anamtec-logo.png";
import { useNavigate } from 'react-router-dom';

// Componente funcional da tela de login
export default function Login() {

// Cria o estado formData para armazenar email e senha digitados
const [formData, setFormData] = useState({ email: "", senha: "" });
useEffect(() => {
    if (formData.email) {
      localStorage.setItem("email", formData.email);
    }
  }, [formData.email]);

  const navigate = useNavigate(); // Hook do React Router para navegar entre páginas
const navCoord = () => {
  
    navigate("/Coord", { replace: true}); // Redireciona para a página do coordenador pedagógico
  
}

  // Função executada quando o usuário clica no botão "ENTRAR"
  const handleLogin = async (e) => {
    e.preventDefault(); // Evita o recarregamento da página
    
     // Chama a função para enviar os dados do login
    try{
        const data = await postFunctionLogin(formData)
        if(data.status === 200) {
          toast.success('Login efetuado com sucesso', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          });
          
          localStorage.setItem("email", data.data.email); // Armazena o e-mail no localStorage
          localStorage.setItem("token", data.data.token); // Armazena o token de autenticação no localStorage
          navCoord(); // Redireciona para a página do coordenador pedagógico
        }
    }catch(error){
      console.error("Erro ao efetuar o login, verifique se o e-mail e a senha estão corretos.", error);
      toast.warn('Erro ao efetuar Login,', {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      });
    }
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
