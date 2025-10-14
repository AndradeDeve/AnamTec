
import React,{ useState } from 'react';
import BtnSearch from '../../../assets/search-icon.png';
import { getFunctionAlunoSpecific } from '../../../services/APIService.js';
import {toast } from 'react-toastify';
import './FilterBar.css';


function FilterBar({onSearch}) {
  const [termo, setTermo] = useState(""); 
  const [filtro, setFiltro] = useState("todos");


 const  handleAcess = async (e) => {
  e.preventDefault();
  try{
    if(termo.length <3 && filtro !== "todos"  ){
      toast.warn(`O ${filtro.toLocaleUpperCase()} deve conter no mínimo 3 caracteres.`, { 
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined, theme: "dark" 
      });
      return
    }
    const data = await getFunctionAlunoSpecific(filtro, termo+(filtro!="rm"?"%":""));
    if(data.status === 200){
      onSearch(data.data || [])
    } 
  }catch(error){
    console.log("Erro: ", error);
    toast.error('Erro ao buscar dados.', { 
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined, theme: "dark" 
      });
  }
  
};


 return (
  <div className="d-flex align-items-center justify-content-center container-fluid ">
      <div className="d-flex row g-4 align-items-center ">
        
        {/* Dropdown */}
        <div className="col-12 col-md-5">
          <select
            className="form-select"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="rm">RM</option>
            <option value="nome">Nome do Aluno</option>
            <option value="curso">Curso</option>
            <option value="turno">Turno</option>
            <option value="coordenador">Coordenador</option>
          </select>
        </div>
       <div className="col-12 col-md-7">
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

