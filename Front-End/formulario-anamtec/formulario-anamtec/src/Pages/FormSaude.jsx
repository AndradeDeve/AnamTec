import React from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header/Header";
import NavButtons from "../Components/NavButtons/NavButtons";


function FormSaude() {
  const navigate = useNavigate();

  const [tipoSanguineo, setTipoSanguineo] = useState("");
  const [sexo, setSexo] = useState("");

  const handleTipoSanguineoChange = (e) => {
    setTipoSanguineo(e.target.value);
  };

  const handleSexoChange = (e) => {
    setSexo(e.target.value);
  };

  const handleVoltar = () => {
    navigate("/FormResp");
  };

  const handleProximo = () => {
        navigate("/FormComportEmocio");
  };

  return (
    <div className="form-container">
      <header className="form-header">
        <img src={logo} alt="Logo" className="logo" />
        <h2>Formulário Anamnese</h2>
      </header>

      <div className="progress-bar">
        <span className="etapa ativa">Informações principais</span>
        <span className="etapa ativa">Dados do Responsável</span>
        <span className="etapa ativa">Histórico de Saúde</span>
        <div className="linha" />
      </div>

      <form className="form-box">
        <div className="linha-form">
          <label>Tipo Sanguíneo:</label>
          <select value={tipoSanguineo} onChange={handleTipoSanguineoChange} className="border p-2 rounded">
            <option value="">Selecione</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>

        <div className="linha-form">
          <label>Sexo:</label>
          <select value={sexo} onChange={handleSexoChange} className="border p-2 rounded">
            <option value="">Selecione</option>
            <option value="Feminino">Feminino</option>
            <option value="Masculino">Maculino</option>
            <option value="Outros">Outros</option>
          </select>
        </div>

        <div className="linha-form">
          <label>Peso:</label>
          <input type="number" />

          <label>Gravidez:</label>
          <select>
            <option>Selecione</option>
          </select>
        </div>

        <div className="botoes flex justify-between mt-6">
          <button type="button" onClick={handleVoltar} className="bg-[#044654] hover:bg-[#033d47] text-white"> Voltar </button>
          
          <button type="button" onClick={handleProximo} className="bg-[#044654] hover:bg-[#033d47] text-white"> Próximo </button>
        </div>
      </form>
    </div>
  );
}

export default FormSaude;