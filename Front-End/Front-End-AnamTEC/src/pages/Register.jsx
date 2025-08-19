// src/pages/Cadastro.jsx
import React, { useState, useEffect } from "react";
import { postFunction } from "../services/APISevice"; // seu serviço de API
import logoAnamTec from "../assets/Anamtec-logo.png"; // Importa a logo 
import "./Register.css";
//ARQUIVO ATUALIZADO PEN
export default function Cadastro() {
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
    "Desenvolvimento de Sistemas",
    "Redes de Computadores",
    "Administração",
    "Logística",
    "Não se aplica"
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

  // submit do formulário
  async function handleSubmit(e) {
    e.preventDefault();

    // validações simples
    if (!formData.cargo) {
      alert("Selecione um cargo.");
      return;
    }
    if (precisaCurso(formData.cargo) && !formData.curso) {
      alert("Para esse cargo, selecione um curso.");
      return;
    }
    if (!formData.nome || !formData.email || !formData.senha) {
      alert("Preencha os campos obrigatórios (nome, email, senha).");
      return;
    }

    try {
      const result = await postFunction(formData); // chama seu serviço
      console.log("Resposta do servidor:", result);
      alert("Cadastro realizado com sucesso!");
      // opcional: limpar formulário
      setFormData({ rm: "",cpf:"" ,nome: "", email: "", senha: "", cargo: "", curso: "" });
    } catch (err) {
      console.error("Erro ao cadastrar:", err);
      alert("Erro ao cadastrar. Veja console para detalhes.");
    }
  }

  return (
    <div className="cadastro-wrapper">
            {/* TOPO - Logo e Título */}
      <div className="asideContainerCadastro">
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
          required
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
              required
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
          <label htmlFor="rm">RM:</label>
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
            required
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
            required
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
            required
          />
        </div>

        <div className="actions">
          <button type="submit" className="btn-submit">
            Cadastrar
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}
