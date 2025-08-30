
import  React,{ useState } from 'react';
import './FilterBar.css';


function FilterBar({onSearch}) {
  const [termo, setTermo] = useState(""); 
  const [filtro, setFiltro] = useState("");

  const handleSearch = () =>{

    if (!termo){
      alert("Digite algo para pesquisar")
      return;
    }

    onSearch(filtro, termo)
  }

 return (
  <div className="d-flex  align-items-center justify-content-center container-fluid ">
      <div className="d-flex row g-3 align-items-center ">
        
        {/* Dropdown */}
        <div className="col-12 col-sm-6 col-md-3">
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

        {/* Campo de pesquisa */}
        <div className="col-12  col-sm-6 col-md-7">
          <input
            type="text"
            className="form-control"
            placeholder={`Pesquisar por ${filtro.toLocaleLowerCase()}`}
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
          />
        </div>

        {/* Botão */}
        <div className="col-12 col-sm-12 col-md-2 d-grid">
          <button className="custon-btn" onClick={handleSearch}>
            Pesquisar
          </button>
        </div>
      </div>
    </div>
  );
}

export default FilterBar;

