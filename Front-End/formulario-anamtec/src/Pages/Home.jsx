import React, { useState} from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../IMG/AnamTecCompleto.png";
import "../Styles/Home.css";

function Home() {
  const navigate = useNavigate(); 

  const [aceito, setAceito] = useState(false);

  const handleStart = () => {
    if (aceito) {
      navigate("/FormInform");
    } else {
      alert("Você precisa aceitar o termo de consentimento para continuar.");
    }
  };

  return (
    <div className="home-container">
      <div className="home-left">
        <img src={Logo} alt= "Logo AnamTec" className="home-logo" />
      </div>

      <div className="home-right">
        <h1>Bem-vindo!</h1>

        <h2>Termo de Consentimento</h2>
        <p>
          O <strong>AnamTec</strong> é um formulário de anamnese que tem como objetivo colaborar com o processo de ensino e aprendizagem dos alunos da {""} <strong>ETEC Embu das Artes</strong>.
          O preenchimento deste formulário é importante para que os professores, coordenadores e gestores possam compreender melhor o contexto dos estudantes e oferecer suporte adequado.
        </p>

        <p>
          Ao prosseguir, você declara que compreende e concorda em fornecer as informações solicitadas de forma verdadeira e consciente.
        </p>

        <div className="consentimento">
          <input type="checkbox" id="aceito" checked={aceito} onChange={(e) => setAceito(e.target.checked)} />
          <label htmlFor="aceito">Li e concordo com o termo de consentimento.</label>
        </div>

        <button className="btn-iniciar" onClick={handleStart} disabled={!aceito}>Iniciar preenchimento</button>
        
      </div>
    </div>
  );
}

export default Home;
