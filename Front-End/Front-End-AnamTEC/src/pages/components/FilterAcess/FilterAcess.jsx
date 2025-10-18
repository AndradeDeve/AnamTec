import React,{useState} from 'react'
import { Form, Button, Row, Col } from "react-bootstrap";
import './FilterAcess.css'
function FilterAcess({onSearch}) {
  const [termo, setTermo] = useState("");
  const [pesquisa, setPesquisa] = useState("RM");

const handleAcess = () =>{
  if (!termo){
    alert(setPesquisa)
    alert(`Digite algo para pesquisar ${pesquisa}`)
    return;
  }
  onSearch(pesquisa,termo)
}
  return (
    <div className="d-flex align-items-center justify-content-center container-fluid">
    <div className="d-flex row g-3 align-items-center">
      <div className='col-12 col-sm-6 col-md-3'>
        <select
          className='form-select'
          value={pesquisa}
          onChange={(e) => setPesquisa(e.target.value)}
        >
          <option value="RM">RM</option>
          <option value="nome">Nome do Aluno</option>
          <option value="curso">Curso</option>
          <option value="coordenador">Coordenador</option>
        </select>
      </div>
      <div className='col-12 col-sm-6 col-md-3'>
        <input 
          type="text" 
          className="form-control"
          placeholder={`Pesquisar por ${pesquisa.toLocaleLowerCase()}`}
          value={termo}
          onChange={(e) => setTermo(e.target.value)} 
          />
      </div>
      <div className="col-12 col-sm-12-col-md-4 d-grid">
      <button className="custon-btn" onClick={handleAcess}>
        Pesquisar
      </button>
      </div>
    </div>
    </div>
  );
};

export default FilterAcess;
