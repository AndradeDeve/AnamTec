import React from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header/Header";
import NavButtons from "../Components/NavButtons/NavButtons";


function FormComportEmocio() {
  const navigate = useNavigate();

  const handleVoltar = () => {
    navigate("/FormSaude");
  };

  const handleProximo = () => {
    navigate("/");
  };

  return (
    <div className="form-container">
      <header className="form-header">
        <img src={Logo} alt="Logo" className="logo" />
        <h2>Formulário Anamnese</h2>
      </header>

      <div className="progress-bar">
        <span className="etapa ativa">Informações principais</span>
        <div className="linha" />
      </div>

      <form className="form-box">
        <div className="linha-form">
          <label>Nome:</label>
          <input type="text" />

          <label>Curso:</label>
          <select>
            <option>Selecione o curso</option>
          </select>
        </div>

        <div className="linha-form">
          <label>Data de Nascimento:</label>
          <input type="date" />

          <label>Turno:</label>
          <select>
            <option>Turno</option>
          </select>

          <label>Semestre:</label>
          <select>
            <option>Semestre</option>
          </select>
        </div>

        <div className="linha-form">
          <label>Idade:</label>
          <input type="number" />

          <label>Gênero:</label>
          <select>
            <option>Selecione o Gênero</option>
          </select>

          <label>Reside com:</label>
          <input type="text" />
        </div>

        <div className="linha-form">
          <label>Email:</label>
          <input type="email" />
        </div>

        <div className="linha-form">
          <label>CEP:</label>
          <input type="text" />

          <label>Número:</label>
          <input type="text" />

          <label>Complemento:</label>
          <input type="text" />
        </div>

        <div className="linha-form">
          <label>Logradouro:</label>
          <input type="text" />
        </div>

        <div className="linha-form">
          <label>Bairro:</label>
          <input type="text" />

          <label>Cidade:</label>
          <input type="text" />

          <label>UF:</label>
          <input type="text" />
        </div>

        <div className="botoes flex justify-between mt-6">
          <button type="button" onClick={handleVoltar} className="bg-[#044654] hover:bg-[#033d47] text-white"> Voltar </button>
          
          <button type="button" onClick={handleProximo} className="bg-[#044654] hover:bg-[#033d47] text-white"> Próximo </button>
        </div>
      </form>
    </div>
  );
}

export default FormComportEmocio;
