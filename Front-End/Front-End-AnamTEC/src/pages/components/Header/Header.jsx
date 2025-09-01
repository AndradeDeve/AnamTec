import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import homeIcon from '../../../assets/home.png';
import personIcon from '../../../assets/person.png';
import passWordIcon from '../../../assets/password.png';
import nsaIcon from '../../../assets/nsa.png';
import controlAcessIcon from '../../../assets/control-acess.png';
import relatorioIcon from '../../../assets/relatorio.png';
import logoAnamtec from '../../../assets/Anamtec-logo.png';
import configIcon from '../../../assets/config-icon.png'

import './Header.css'; // mantém seu CSS personalizado

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  }
  const [configOpen, setconfigOpen] = useState(false);
  const toggleConfig = () => {
    setconfigOpen((prev) => !prev);
  };


  const navigate = useNavigate();

  return (
    <header className="header py-3">
      <div className="container-fluid">
      {/* Linha principal do Header */}
      <div className="row align-items-center justify-content-between">

        {/* Ícone de menu e dropdown */}
        <div className="col-auto">
          <div className="menu-toggle d-md-flex" onClick={toggleMenu}>☰</div>


          {/* Dropdown - aparece abaixo do menu */}
          <div className={`dropdown-menu-custom ${menuOpen ? 'show' : ''}`}>
            <ul className="list-unstyled m-0 p-2">
              {/*NAVEGAÇÂO ENTRE AS PÁGINAS ==> */}
              <li onClick={() => navigate('/')}>
              <img src={homeIcon} alt="Página Home" />
              <span>Home</span>
              </li>
              <li onClick={() => navigate('/Cadastro')}>
              <img src={personIcon} alt="Página de Cadastro" />
              <span>Cadastrar</span>
              </li>
              <li onClick={() => navigate('/ResetarSenha')}>
              <img src={passWordIcon} alt="Página de Resetar a Senha" />
              <span>Resetar Senha</span>
              </li>
              <li><img src={nsaIcon} alt="Link de Acesso para o site do NSA" />
              <span>Acesso ao NSA</span>
              </li>
              <li>
              <img src={controlAcessIcon} alt="Controle de Acesso de Professores" />
              <span>Controle de Acesso</span></li>
              <li>
              <img src={relatorioIcon} alt="Página de Relatórios" />
              <span>Relatório</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Logo */}
        <div className="col text-center">
          <span className='d-md-inline fw-bold fs-4'>
          AnamTec
          </span> 
          <img src={logoAnamtec} alt="Logo AnamTec" className='ms-2' height="60"/>
        </div>

        {/* Mensagem de Saudação */}
        <div className="col-auto d-flex align-items-center gap-3">
           {/* Saudação só aparece em telas maiores */}
          <span className="user-section d-none d-md-inline">
            Bem-vindo <strong>(Coordenador Pedagógico)</strong>
          </span>

          {/* Configurações (engrenagem) */} 
          <div className="position-relative ">
          <div className="menu-toggle" onClick={toggleConfig}>⚙</div>

          <div className={`dropdown-config-custom ${configOpen ? 'show' : ''}`}>
            <ul className="list-unstyled m-0 p-2">
            
              <li onClick={() => navigate('')}>
                <img src={configIcon} alt="Configurações" />
                <span>Configurações</span>
              </li>
              <li onClick={() => navigate('/login')}>
              <img src={personIcon} alt="Sair do sistema" />
              <span>Sair</span>
              </li>
            </ul>
          </div>
          </div>
        </div>
      </div>
    </div>
    </header>
  );
};

export default Header;
