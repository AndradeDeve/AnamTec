import React, { useState} from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../IMG/Anamtec-logo.png";
import "../Styles/Home.css";
import "../Styles/Paletas.css";

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
      <div className="header-logo">  
        <h1 className="d-none d-sm-block">AnamTec</h1>
        <img src={Logo} alt= "Logo AnamTec" className="home-logo" />
      </div>
        <p className="slogan">Dados que importam.<br/> Decisões que transformam.</p>
      </div>

      <div className="home-right">
        <h1>Bem-vindo!</h1>

        <h2>Termo de Consentimento</h2>
        <p>
          O <strong>AnamTec</strong> é um formulário de anamnese desenvolvido com o propósito de contribuir para o processo de ensino e aprendizagem dos estudantes da {""} <strong>ETEC de Embu</strong>.
          As informações fornecidas permitirão que professores, coordenadores e gestores compreendam melhor o contexto individual de cada aluno, possibilitando um acompanhamento mais sensível e adequado às necessidades apresentadas.
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
