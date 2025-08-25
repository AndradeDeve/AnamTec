import React from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../Components/Header/Header";
import NavButtons from "../Components/NavButtons/NavButtons";


function FormResp() {
  const navigate = useNavigate();

  const [responsaveis, setResponsaveis] = useState([
    { nome: "", parentesco: "", telefone: "", estadoCivil: "", email: ""},
  ]);

  const handleAddResponsaveis = () => {
    setResponsaveis([
        ...responsaveis,
        { nome: "", parentesco: "", telefone: "", estadoCivil: "", email: ""},
    ]);
  };

  const handleChange = (index, field,value) => {
    const novosResponsaveis = [...responsaveis];
    novosResponsaveis[index][field] = value;
    setResponsaveis(novosResponsaveis);
  };

  const handleRemove = (index) => {
    const novosResponsaveis = responsaveis.filter((_, i) => i !== index);
    setResponsaveis(novosResponsaveis);
  };

  const handleVoltar = () => {
    navigate("/FormAspec");
  };

  const handleProximo = () => {
    navigate("/FormSaude");
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
        <div className="linha" />
      </div>

      <form className="form-box">
        {responsaveis.map((responsavel, index) => (
            <div key={index} className="mb- border-b pb-4">
                <h3 className="font-semibold mb-2">Responsável {index + 1}</h3>

                <div className="linha-form">
                    <label>Nome do Responsável:</label>
                    <input type="text" value={responsavel.nome} onChange={(e) => handleChange(index, "nome", e.target.value)} />

                    <label>Parentesco:</label>
                    <select value={responsavel.parentesco} onChange={(e) => handleChange(index, "parentesco", e.target.value)}>
                        <option value="">Selecione</option>
                        <option value="Pai">Pai</option>
                        <option value="Mãe">Mãe</option>
                        <option value="Avô/Avó">Avô/Avó</option>
                        <option value="Outro">Outro</option>
                    </select>
                </div>

                <div className="linha-form">
                    <label>Telefone:</label>
                    <input type="text" value={responsavel.telefone} onChange={(e) => handleChange(index, "telefone", e.target.value)} />

                    <label>Estado Civil:</label>
                    <select value={responsavel.estadoCivil} onChange={(e) => handleChange(index, "estadoCivil", e.target.value)} >
                        <option value="">Selecione</option>
                        <option value="Solteiro(a)">Solteiro(a)</option>
                        <option value="Casado(a)">Casado(a)</option>
                        <option value="Divorciado(a)">Divorciado(a)</option>
                        <option value="Viúvo(a)">Viúvo(a)</option>
                    </select>                        
                </div>

                <div className="linha-form">
                    <label>Email:</label>
                    <input type="email" value={responsavel.email} onChange={(e) => handleChange(index, "email", e.target.value)} />
                </div>

                {responsaveis.length > 1 && (
                <button type="button" onClick={() => handleRemove(index)}
                className="absolute top-0 rigth-0 bg-red-600 hover:bg-red-700 text-white px-2 py-1">
                    Remover
                </button> 
                )}
            </div>
        ))}

        <div className="botoes flex justify-between mt-6">
            <button type="button" onClick={handleAddResponsaveis} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                + Adiconar Responsável
            </button>
        </div>

        <div className="botoes flex justify-between mt-6">
          <button type="button" onClick={handleVoltar} className="bg-[#044654] hover:bg-[#033d47] text-white"> Voltar </button>
          
          <button type="button" onClick={handleProximo} className="bg-[#044654] hover:bg-[#033d47] text-white"> Próximo </button>
        </div>
      </form>
    </div>
  );
}

export default FormResp;