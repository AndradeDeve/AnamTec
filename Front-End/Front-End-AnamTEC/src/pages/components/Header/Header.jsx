import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import homeIcon from '../../../assets/home.png';
import personIcon from '../../../assets/person.png';
import passWordIcon from '../../../assets/password.png';
import nsaIcon from '../../../assets/nsa.png';
import controlAcessIcon from '../../../assets/control-acess.png';
import relatorioIcon from '../../../assets/relatorio.png';
import logoAnamtec from '../../../assets/Anamtec-logo.png';

import './Header.css'; // mantém seu CSS personalizado

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const navigate = useNavigate();

  return (
    <header className="header d-flex justify-content-around mt-0 mb-5 container-fluid   py-3 px-4">
      {/* Linha principal do Header */}
      <div className="d-flex justify-content-around align-items-center row">
        {/* Ícone de menu e dropdown */}
        <div className="col-auto position-relative justify-content-aroud">
          <div className="menu-toggle" onClick={toggleMenu}>☰</div>

          {/* Dropdown - aparece abaixo do menu */}
          <div className={`dropdown-menu-custom ${menuOpen ? 'show' : ''}`}>
            <ul className="list-unstyled m-0 p-2">
              {/*NAVEGAÇÂO ENTRE AS PÁGINAS ==> */}
              <li onClick={() => navigate('/')}><img src={homeIcon} alt="Página Home" /><span>Home</span></li>
              <li onClick={() => navigate('/Cadastro')}><img src={personIcon} alt="Página de Cadastro" /><span>Cadastrar</span></li>
              <li onClick={() => navigate('/ResetarSenha')}><img src={passWordIcon} alt="Página de Resetar a Senha" /><span>Resetar Senha</span></li>
              <li><img src={nsaIcon} alt="Link de Acesso para o site do NSA" /><span>Acesso ao NSA</span></li>
              <li><img src={controlAcessIcon} alt="Controle de Acesso de Professores" /><span>Controle de Acesso</span></li>
              <li><img src={relatorioIcon} alt="Página de Relatórios" /><span>Relatório</span></li>
            </ul>
          </div>
        </div>

        {/* Logo */}
        <div className="col text-center logo d-none d-md-block">
          AnamTec <img src={logoAnamtec} alt="Logo AnamTec" />
        </div>

        {/* Saudação e engrenagem */}
        <div className="col-auto d-flex align-items-center gap-2">
          <span className="user-section">
            Bem-vindo <strong>(Coordenador Pedagógico)</strong>
          </span>
          <button className="config-btn">⚙</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
