import React, { useState } from 'react';
import homeIcon from '../../IMG/home.png';
import personIcon from '../../IMG/person.png';
import passWordIcon from '../../IMG/password.png';
import nsaIcon from '../../IMG/nsa.png';
import controlAcessIcon from '../../IMG/control-acess.png';
import relatorioIcon from '../../IMG/relatorio.png';
import logoAnamtec from '../../IMG/Anamtec-logo.png';
import '../components/Header.css'; // mantém seu CSS personalizado

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

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
              <li><img src={homeIcon} alt="Home" /><span>Home</span></li>
              <li><img src={personIcon} alt="Cadastrar" /><span>Cadastrar</span></li>
              <li><img src={passWordIcon} alt="Senha" /><span>Resetar Senha</span></li>
              <li><img src={nsaIcon} alt="NSA" /><span>Acesso ao NSA</span></li>
              <li><img src={controlAcessIcon} alt="Acesso" /><span>Controle de Acesso</span></li>
              <li><img src={relatorioIcon} alt="Relatório" /><span>Relatório</span></li>
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
