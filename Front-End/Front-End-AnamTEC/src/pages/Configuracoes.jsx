import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./Config.css";

export default function Configuracoes() {
  // Estado para armazenar qual aba está ativa
  const [abaAtiva, setAbaAtiva] = useState("usuario");
  const [abaSeguranca, setAbaSeguranca] = useState("seguranca");

   const navegar = useNavigate()
    
    const navPrincipal = () => {
      navegar("/Coord");
    }
  
  
  // Estado geral do formulário
  const [formData, setFormData] = useState({
    nome: "Weslley Samuel",
    email: "weslley@exemplo.com",
    cargo: "Coordenador Pedagógico",
    senha: "",
    novaSenha: "",
    confirmarSenha: "",
    tema: "claro",
    notificacoes: true,
  });
  
  // Atualiza os dados dos inputs
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  }

//Estado do formulário de Segurança
const [formSeg, setFormSeg] = useState({
  senhaAtual: "",
  novaSenha: "",
  confirmarSenha: "",
 
});

//Captura mudanças nos inputs
function handleChange(e){
  const {name, value} = e.target;
  setFormSeg(prev => ({
    ...prev,
    [name]: value
  }));
}

//Validação e envio
function handleSubmit(e) {
  e.preventDefault();

  if (formSeg.novaSenha !== formSeg.confirmarSenha) {
    alert ("A nova senha e a confirmação não coincidem.");
    return;
  }

  console.log("Nova senha salva:", formSeg);
  alert("Senha atualizada com sucesso!");
  // Guilherme você chama a API aqui!!!
}


  // Envia os dados
  function handleSubmit(e) {
    e.preventDefault();
    console.log("Configurações salvas:", formData);
    alert("Configurações atualizadas!");
  }

  return (
    <div className="config-wrapper">
      <h2 className="config-title">Configurações</h2>
      <div className="config-container">
        
        {/* MENU LATERAL */}
        <aside className="config-menu">
          <ul>
            <li 
              className={abaAtiva === "usuario" ? "ativo" : ""} 
              onClick={() => setAbaAtiva("usuario")}
            >
              Usuário
            </li>
            <li 
              className={abaAtiva === "preferencias" ? "ativo" : ""} 
              onClick={() => setAbaAtiva("preferencias")}
            >
              Preferências
            </li>
            <li 
              className={abaAtiva === "seguranca" ? "ativo" : ""} 
              onClick={() => setAbaAtiva("seguranca")}
            >
              Segurança
            </li>
          </ul>
        </aside>

        {/* CONTEÚDO DA ABA */}
        <main className="config-content">
          <form className="config-form" onSubmit={handleSubmit}>
            
            {/* === Aba Usuário === */}
            {abaAtiva === "usuario" && (
              <>
                <label>Nome:</label>
                <input 
                  type="text" 
                  name="nome" 
                  value={formData.nome} 
                  onChange={handleChange} 
                />

                <label>Email:</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                />

                <label>Cargo:</label>
                <input 
                  type="text" 
                  value={formData.cargo} 
                  disabled
                />
              </>
            )}

            {/* === Aba Preferências === */}
            {abaAtiva === "preferencias" && (
              <>
                <label>Tema:</label>
                <select 
                  name="tema" 
                  value={formData.tema} 
                  onChange={handleChange}
                >
                  <option value="claro">Claro</option>
                  <option value="escuro">Escuro</option>
                </select>

                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    name="notificacoes" 
                    checked={formData.notificacoes} 
                    onChange={handleChange} 
                  />
                  Receber notificações por e-mail
                </label>
              </>
            )}

            {/* === Aba Segurança === */}
            {abaAtiva === "seguranca" && (
              <>
              <label>Senha atual:</label>
              <input 
                type="password" 
                name="senhaAtual" 
                placeholder="Informe sua senha atual"
                value={formSeg.senhaAtual}
                onChange={handleChange}
                required
              />
                <label>Nova senha:</label>
                <input 
                  type="password" 
                  name="senha" 
                  value={formSeg.senha} 
                  onChange={handleChange} 
                />

              <label>Confirmar nova senha:</label>
              <input 
                type="password" 
                name="confirmarSenha" 
                placeholder="Confirme sua nova senha"
                value={formSeg.confirmarSenha}
                onChange={handleChange}
                required
              />
              </>
            )}

            {/* BOTÃO DE SALVAR */}
            <div className="actions">
              <button type="button" className="btn-salvar"
              onClick={navPrincipal}>
              Voltar
              </button>

               <button type="submit" className="btn-salvar">
                Salvar Alterações
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
