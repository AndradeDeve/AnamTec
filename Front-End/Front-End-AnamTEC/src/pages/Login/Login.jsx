import React, { useState } from 'react';
import { showToast } from "../../Utils/toast";
import { postFunctionLogin } from '../../services/APIService';
import logoAnamTec from "../../assets/Anamtec-logo.png";
import { useNavigate } from 'react-router-dom';
import RedefineSenha from "../components/EmailPassword/index"
import "./Login.css";

export default function Login() {

const [showModal, setShowModal] = useState(false)
const [formData, setFormData] = useState({ email: "", senha: "" });

const navigate = useNavigate();

const navCoord = () => {
    navigate("/home", { replace: true}); 
}

  function isValidEmail(email){ 
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

const handleLogin = async (e) => {
    e.preventDefault(); 

  if (!formData.email) {
    showToast("warn",'Ocampo e-mail é obrigatório.')
    return;
  }
  if (!isValidEmail(formData.email)) {
      showToast("warn",'Digite um e-mail válido.')
      return;
  }
  if (!formData.senha) {
      showToast("warn", 'O campo senha é obrigatório.')
      return;
  }
    try{
        const data = await postFunctionLogin(formData)
        if(data.status === 200) {
          showToast("sucess", 'Login efetuado com sucesso.')

          localStorage.setItem("token", data.data.token); 
          navCoord(); 
        }
    }catch(error){
      console.error("Erro ao efetuar o login, verifique se o e-mail e a senha estão corretos.", error);

      showToast("error", 'Erro ao efetuar Login.')
    }
  };

  return (
    <div className="login-container col-12 col-md-6 col-lg-12">
      <div className="aside-containerLogin d-flex">
        <div className="header-logo">
            <h1 className="d-none d-sm-block">AnamTec</h1>
            <img src={logoAnamTec} alt="Logo" className="logoa"/>
        </div>
            <p className="frase">Dados que importam.<br/> Decisões que transformam </p>
      </div>

      <div className="login-card">
        <div className="title-login">
          <h2>Acesso ao Sistema</h2>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          
          <label htmlFor="email">Digite seu e-mail</label>
          <input type="email" id="email" placeholder="E-mail" value={formData.email} 
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <label htmlFor="senha">Digite sua senha</label>
          <input type="password" id="senha" placeholder="Senha" value={formData.senha}
                  onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
          />
          <a className="redefineSenha" onClick={() => setShowModal(true)}>
              Esqueci minha Senha
          </a>
          <button type="submit" className="btn-submit" >
              ENTRAR
          </button>
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