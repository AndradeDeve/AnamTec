import React, { useState } from 'react';
import {toast } from 'react-toastify';
import "./Login.css";
import { postFunctionLogin } from '../services/APIService';
import logoAnamTec from "../assets/Anamtec-logo.png";
import { useNavigate } from 'react-router-dom';
import RedefineSenha from "../pages/components/EmailPassword/index"

export default function Login() {

const [showModal, setShowModal] = useState(false)

// Cria o estado formData para armazenar email e senha digitados
const [formData, setFormData] = useState({ email: "", senha: "" });


const navigate = useNavigate(); // Hook do React Router para navegar entre páginas
const navResetSenha = () => {
  (navigate("/ResetarSenha", {replace: true}));    

}
const navCoord = () => {
    navigate("/Home", { replace: true}); // Redireciona para a página do coordenador pedagógico
}

function isValidEmail(email){ 
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

  // Função executada quando o usuário clica no botão "ENTRAR"
  const handleLogin = async (e) => {
    e.preventDefault(); // Evita o recarregamento da página

  // [Validação 1] - Verifica se o email está vazio
  if (!formData.email) {
      toast.warn('O campo e-mail é obrigatório.', {  
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark" });
      return;
  }

   // [Validação 2] - Verifica o formato do e-mail
  if (!isValidEmail(formData.email)) {
      toast.warn('Digite um e-mail válido.', { 
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark" });
      return;
  }
  
  // [Validação 3] - Verifica se a senha está vazia
  if (!formData.senha) {
      toast.warn('O campo senha é obrigatório.', { 
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined, theme: "dark" });
      return;
  }
  
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
        theme: "dark",
      });
    }
  };

  return (
    <div className="login-container col-12 col-md-6 col-lg-12">
      {/* Cabeçalho com logo e nome do sistema */}
      <div className="aside-containerLogin d-flex">
      <div className="header-logo">
        <h1 className="d-none d-sm-block">AnamTec</h1>
        <img src={logoAnamTec} alt="Logo" className="logoa"/>
      </div>
       <p className="frase">Dados que importam.<br/> Decisões que transformam </p>
      </div>

      {/* Cartão de login */}
      <div className="login-card">
        <div className="title-login">
          <h2>Acesso ao Sistema</h2>
        </div>

        {/* Formulário de login com os campos controlados */}
        <form onSubmit={handleLogin} className="login-form">
          
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
       
             <a className="redefineSenha"
                onClick={() => setShowModal(true)}>
                Esqueci minha Senha
            </a>
          {/* Botão de envio do formulário */}
          <button type="submit" className="btn-submit" >ENTRAR</button>
        </form>
      </div>
          <RedefineSenha 
                    show={showModal} 
                    onClose={() => setShowModal(false)} 
                    onEnviar={() => {
                        console.log("Enviar nova senha por email");
                    setShowModal(false);

                    }}
                />
    </div>
  );
}