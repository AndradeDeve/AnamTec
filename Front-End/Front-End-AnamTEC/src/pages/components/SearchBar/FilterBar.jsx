
import  React,{ useState } from 'react';
import BtnSearch from '../../../assets/search-icon.png';
import './FilterBar.css';


function FilterBar({onSearch}) {
  const [termo, setTermo] = useState(""); 
  const [filtro, setFiltro] = useState("");

 const handleAcess = () => {
  if (!termo.trim()) {
    alert("Digite algo para pesquisar");
    return;
  }

  // Chama a função de busca recebida via props
  onSearch(filtro, termo);
};


 return (
  <div className="d-flex  align-items-center justify-content-center container-fluid ">
      <div className="d-flex row g-3 align-items-center ">
        
        {/* Dropdown */}
        <div className="col-12 col-sm-6 col-md-5">
          <select
            className="form-select"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          >
            <option value="rm">RM</option>
            <option value="nome">Nome do Aluno</option>
            <option value="curso">Curso</option>
            <option value="turno">Turno</option>
            <option value="coordenador">Coordenador</option>
            <option value="status">Status Anamnese</option>
          </select>
        </div>
       <div className="col-12 col-sm-6 col-md-7">
        <div className="search-bar">
          <input
            type="text"
            className="search-input"
            placeholder={`Pesquisar por ${filtro.toLocaleLowerCase()}`}
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
          />
          <button className="search-button" onClick={handleAcess}>
            <img src={BtnSearch} alt="Pesquisar" />
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}

export default FilterBar;

