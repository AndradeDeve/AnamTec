import React, { useState } from 'react';
import homeIcon from '../../IMG/home.png';
import personIcon from '../../IMG/person.png';
import passWordIcon from '../../IMG/password.png';
import nsaIcon from '../../IMG/nsa.png';
import controlAcessIcon from '../../IMG/control-acess.png';
import relatorioIcon from '../../IMG/relatorio.png';
import logoAnamtec from '../../IMG/Anamtec-logo.png'
import '../components/Header.css';

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <header className="header">
      <div className="left-section">
        <div className="menu-toggle" onClick={toggleMenu}>☰</div>

        {menuOpen && (
          <aside className="dropdown-menu">
            <ul className="menu-dropdown">
              <li><img src={homeIcon} alt="Home" /><p>Home</p></li>
              <li><img src={personIcon} alt="Cadastrar" /><p>Cadastrar</p></li>
              <li><img src={passWordIcon} alt="Senha" /><p>Resetar Senha</p></li>
              <li><img src={nsaIcon} alt="NSA" /><p>Acesso ao NSA</p></li>
              <li><img src={controlAcessIcon} alt="Acesso" /><p>Controle de Acesso</p></li>
              <li><img src={relatorioIcon} alt="Relatório" /><p>Relatório</p></li>
            </ul>
          </aside>
        )}
      </div>

      <div className="logo">AnamTec <img src={logoAnamtec}alt="Imagem logo" /></div>

      <div className="user-section">
        <span>Bem-vindo <strong>(Coordenador Pedagógico)</strong></span>
      </div>
        <button className="config-btn">⚙</button>
    </header>
  );
};
