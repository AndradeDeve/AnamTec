
// src/pages/Cadastro.jsx
import React, { useState, useEffect } from "react";
import { postFunctionUser } from "../services/APIService"; // seu serviço de API
import logoAnamTec from "../assets/Anamtec-logo.png"; // Importa a logo 
import { toast } from 'react-toastify';
import { showToast } from "../Utils/toast.js"; // importamos o helper
import { useNavigate } from 'react-router-dom';
import "./Register.css";
//ARQUIVO ATUALIZADO PEN
export default function Cadastro() {
  //Botão de voltar para a tela principal

  const navegar = useNavigate()
  
  const navPrincipal = () => {
    navegar("/");
  }

  // estado do formulário
  const [formData, setFormData] = useState({
    rm: "",
    cpf: "",
    nome: "",
    email: "",
    senha: "",
    cargo: "",
    curso: "" // será usado apenas quando necessário
  });

  // lista de cursos (pode vir da API futuramente)
  const cursosDisponiveis = [
    "Administração",
    "Recursos Humanos",
    "Contabilidade",
    "Administração (Ensino médio)",
    "Desenvolvimento de Sistemas",
    "Redes de Computadores",
    "Redes de Computadores (Ensino médio)",
    "Desenvolvimento de Sistemas (Ensino médio)",
    "Informática",
    "Eletroeletrônica",
    "Automação Industrial (Ensino Médio)",
    "Agenciamento de viagens",
  ];

  // cargos possíveis
  const cargos = [
    { value: "", label: "Selecione o cargo" },
    { value: "Coordenador Pedagógico", label:"Coordenador Pedagógico" },
    { value: "Secretaria", label: "Secretaria" },
    { value: "Coordenador de Curso", label: "Coordenador de Curso" },
    { value: "Professor", label: "Professor" }
  ];

  // helper para saber se devemos mostrar o campo de curso
  const precisaCurso = (cargo) =>
    cargo === "Coordenador de Curso" || cargo === "Professor";

  // quando o cargo mudar e não precisar de curso, limpamos o campo curso
  useEffect(() => {
    if (!precisaCurso(formData.cargo) && formData.curso !== "") {
      setFormData((prev) => ({ ...prev, curso: "" }));
    }
  }, [formData.cargo]);

  // manipula mudanças nos inputs/selects
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function isValidEmail(email) {
  // Regex simples que cobre a maioria dos casos
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}


  // submit do formulário
  async function handleSubmit(e) {
    e.preventDefault();

    // validações simples
    if (!formData.cargo) {
      showToast ("warn","Selecione um cargo.");
      return;
    }
    if (precisaCurso(formData.cargo) && !formData.curso) {
      showToast("warn","Para esse cargo, selecione um curso.");
      return;
    }
    if (!formData.nome || !formData.email || !formData.senha) {
       showToast("warn","Preencha os campos obrigatórios (RM, CPF, nome, email, senha).");
      return;
    }
    if (!isValidEmail(formData.email)) {
    showToast("warn", "Digite um e-mail válido.");
    return;
}

    try {
      const data = await postFunctionUser(formData); // chama seu serviço
      // console.log("Resposta do servidor:", result);
      if(data.status === 201) {
        showToast("success", 'Login efetuado com sucesso')
     
      }
      // opcional: limpar formulário
      // setFormData({ rm: "",cpf:"" ,nome: "", email: "", senha: "", cargo: "", curso: "" });
    } catch (error) {
      console.log("Erro ao cadastrar:", error);
      showToast("error", "Erro ao efetuar cadastro. Tente novamente.");
    }
  }

  return (
    <div className="cadastro-wrapper col-12 col-md-6 col-lg-12">
            {/* TOPO - Logo e Título */}
      <div className="asideContainerCadastro d-flex-">
      <header className="header-Cadastro">
        <h1>AnamTec</h1>
        <img src={logoAnamTec} alt="Logo" className="logoa" />
      </header>
      <p className="frase">Dados que importam.<br/> Decisões que transformam </p>
      </div>
      <div className="register-card">
        <div className="title">
        <h2>Cadastro de Profissional</h2>
        </div>
      <form className="cadastro-form" onSubmit={handleSubmit}>
          <div className="field">
        <label htmlFor="cargo">Cargo:</label>
        <select
          id="cargo"
          name="cargo"
          value={formData.cargo}
          onChange={handleChange}
         
        >
          {cargos.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        </div>

        {/* Se cargo for Coordenador ou Professor mostra o select de curso */}
        {precisaCurso(formData.cargo) && (
          <div className="field">
            <label htmlFor="curso">Curso:</label>
            <select
              id="curso"
              name="curso"
              value={formData.curso}
              onChange={handleChange}
            
            >
              <option value="">Selecione o curso</option>
              {cursosDisponiveis.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="field">
          <label htmlFor="rm">
            RM:
          {(formData.cargo === "Secretaria" || formData.cargo === "Coordenador Pedagógico") &&(
            <span 
              className="tooltip-icon"
              title="O campo RM não é obrigatório para esse usuário"
            >
             *
            </span>
          )}

          </label>
          <input
            type="text"
            id="rm"
            name="rm"
            placeholder="Informe o RM"
            value={formData.rm}
            onChange={handleChange}
            
          />
        </div>
        <div className="field">
          <label htmlFor="cpf">CPF:</label>
          <input
            type="number"
            id="cpf"
            name="cpf"
            placeholder="Informe o CPF"
            value={formData.cpf}
            onChange={handleChange}
          />
        </div>

        <div className="field">
          <label htmlFor="nome">Nome:</label>
          <input
            type="text"
            id="nome"
            name="nome"
            placeholder="Nome"
            value={formData.nome}
            onChange={handleChange}
          
          />
        </div>

        <div className="field">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            
          />
        </div>

        <div className="field">
          <label htmlFor="senha">Senha:</label>
          <input
            type="password"
            id="senha"
            name="senha"
            placeholder="Senha"
            value={formData.senha}
            onChange={handleChange}
            
          />
        </div>
            <div className="voltar">
              <a className="voltarPrincipal" onClick={navPrincipal}>
              Voltar
              </a>
            </div>

        <footer className="btns col-12 row col-md-12">
          <div className="actionss">
       
            <button type="submit" className="btn-submit">
            Cadastrar
            </button>
          </div>
        </footer>
      </form>
    </div>
  </div>
  );
}