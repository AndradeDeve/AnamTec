import React, { useState, useEffect } from "react";
import { postFunctionUser } from "../../services/APIService.js"; // seu serviço de API
import logoAnamTec from "../../assets/Anamtec-logo.png"; // Importa a logo 
import { toast } from 'react-toastify';
import { showToast } from "../../Utils/toast.js"; // importamos o helper
import { useNavigate } from 'react-router-dom';
import "./Register.css";
import { formHelperTextClasses } from "@mui/material";

export default function Cadastro() {


  const navegar = useNavigate()
  
  const navPrincipal = () => {
    navegar("/Home");
  }

  const [formData, setFormData] = useState({
    rm: "",
    cpf: "",
    nome: "",
    email: "",
    senha: "",
    cargo: "",
    curso: "", 
    disciplina:"",
  });

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

  const disciplinasDisponiveis = [
    "Programação e Desenvolvimento",
    "Banco de Dados",
    "Programação Web",
    "Designer Digital",
    "Fundamentos da Informática",
    "Desenvolvimento de Sistema",
    "Sistemas Embarcados",
    "Análise e Projeto de Sistemas"
  ];
  const cargos = [
    { value: "", label: "Selecione o cargo" },
    { value: "Coordenador Pedagógico", label:"Coordenador Pedagógico" },
    { value: "Secretaria", label: "Secretaria" },
    { value: "Coordenador de Curso", label: "Coordenador de Curso" },
    { value: "Professor", label: "Professor" }
  ];

  const precisaCursoEDisciplina = (cargo) =>
    cargo === "Professor";

  const precisaCurso = (cargo) =>
    cargo === "Coordenador de Curso"
  useEffect(() => {
    if (!precisaCursoEDisciplina(formData.cargo) && (formData.curso !== "" || formData.disciplina)){
      setFormData((prev) => ({ 
        ...prev, 
        curso: "", 
        disciplina:"" 
      }));
    }
    
  }, [formData.cargo]);
  
  const mascaraCPF = (value) => {
    value = value.substring(0,14);
  
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  
    return value;
  };
  function handleChange(e) {
    const { name, value } = e.target;

    if (name ==="cpf"){
        const mascaraCPFValue = mascaraCPF(value);
        setFormData((prev) => ({ ...prev, [name]: mascaraCPFValue}));
        return;
      }
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function isValidEmail(email) {
  // Regex simples que cobre a maioria dos casos
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

  function isValidCpf(cpf) {
    return cpf.length === 14;
  }
  
  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.cargo) {
      showToast ("warn","Selecione um cargo.");
      return;
    }
    if (precisaCursoEDisciplina(formData.cargo) && !formData.curso) {
      showToast("warn","Para esse cargo, selecione um curso.");
      return;
    }
    if (precisaCursoEDisciplina(formData.cargo) && !formData.disciplina) {
        showToast("warn", "Para esse cargo, selecione uma disciplina.");
        return;
    }
    const rmNãoObrigatorio = formData.cargo ==="Secretaria" || formData.cargo === "Coordenador Pedagógico";
    if (!rmNãoObrigatorio && !formData.rm){
      showToast ("warn", "O campo RM é obrigátorio para o seu cargo.");
      return;
    }
    if (!formData.cpf){
      showToast("warn","Preencha o CPF");
      return;
    }
    if(!isValidCpf(formData.cpf)){
      showToast("warn","O CPF deve ter 11 digitos.Por favor, verifique.");
      return;
    }
    if (!formData.nome || !formData.email || !formData.senha) {
       showToast("warn","Preencha o restante dos campos obrigatórios (nome, email, senha).");
      return;
    }
    if (!isValidEmail(formData.email)) {
    showToast("warn", "Digite um e-mail válido.");
    return;
    }

    try {
      const data = await postFunctionUser(formData); 
      
      if(data.status === 201) {
        showToast("success", 'Cadastro efetuado com sucesso')
      }
      if(data.status === 400){
        showToast("error", data.data.err || 'Erro ao cadastrar');
      }
  
    } catch (error) {
      console.log("Erro ao cadastrar:", error);
      showToast("error", "Erro no servidor.");
    }
  }

  return (
    <div className="cadastro-wrapper col-12 col-md-6 col-lg-12">
       
      <div className="asideContainerCadastro d-flex-">
      <header className="header-Cadastro">
        <h1 className="d-none d-sm-block">AnamTec</h1>
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
        {precisaCursoEDisciplina(formData.cargo) || precisaCurso(formData.cargo) && (
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
         {/* [NOVO CAMPO] Se cargo for Coordenador ou Professor mostra o select de disciplina */}
        {precisaCursoEDisciplina(formData.cargo) && (
        <div className="field">
            <label htmlFor="disciplina">Disciplina:</label>
            <select
                id="disciplina"
                name="disciplina"
                value={formData.disciplina}
                onChange={handleChange}
            >
                <option value="">Selecione a disciplina</option>
                {disciplinasDisponiveis.map((d) => (
                    <option key={d} value={d}>
                        {d}
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
            type="text"
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