import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import homeIcon from '../../../assets/home.png';
import personIcon from '../../../assets/person.png';
import nsaIcon from '../../../assets/nsa.png';
import controlAcessIcon from '../../../assets/control-acess.png';
import relatorioIcon from '../../../assets/relatorio.png';
import logoAnamtec from '../../../assets/Anamtec-logo.png';
import { getUser } from '../../../helpers/auth';
import './Header.css'; 


const Header = () => {
  const [ typeUser, setTypeUser ] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const user = getUser();
    setTypeUser(user ? user.type : "");
  }, []);
  
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  }
   const handleNsaAccess = () => {
    window.open('https://nsa.cps.sp.gov.br/', '_blank');
    setMenuOpen(false);
  };

const navigate = useNavigate();

return (
  <header className="header py-3">
    <div className="container-fluid">
      <div className="row align-items-center justify-content-between">
        <div className="col-auto">
          <div className="menu-toggle d-md-flex" onClick={toggleMenu}>☰</div>
            <div className={`sidebar-menu-custom ${menuOpen ? 'show' : ''}`}>
              <div className="close-btn" onClick={toggleMenu}>&times;</div> 
                <div className='sidebar-list-container'> 
                  <ul className="list-unstyled sidebar-list">
                    <li className='mx-2' 
                        onClick={() => { navigate('/home'); toggleMenu(); }}>
                    <img src={homeIcon} alt="Página Home" />
                      <span>Home</span>
                    </li>
                    <li className='mx-2' 
                        onClick={() => { navigate('/Cadastro'); toggleMenu(); }}>
                    <img src={personIcon} alt="Página de Cadastro" />
                      <span>Cadastrar</span>
                    </li>
                  <li className='mx-2' 
                      onClick={() => { handleNsaAccess(); toggleMenu(); }}>
                    <img src={nsaIcon} alt="Link de Acesso para o site do NSA" />
                      <span>Acesso ao NSA</span>
                  </li>
                  <li className='mx-2' 
                      onClick={() => { navigate('/controle'); toggleMenu(); }}>
                  <img src={controlAcessIcon} alt="Controle de Acesso" />
                      <span>Controle de Acesso</span></li>         
                  <li className='mx-2' 
                      onClick={() => { navigate('/relatorios'); toggleMenu(); }}>
                  <img src={relatorioIcon} alt="Página de Relatórios" />
                      <span>Relatório</span>
                  </li>
                </ul>
             </div>
            <ul className="list-unstyled sidebar-footer-list">
              <li className='mx-2' 
                  onClick={() => { navigate('/'); toggleMenu(); }}>
              <img src={personIcon} alt="Sair do sistema" />
                  <span>Sair</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="col text-center">
          <span className='d-md-inline fw-bold fs-4 d-none d-sm-block'>
              AnamTec
          </span> 
        <img src={logoAnamtec} alt="Logo AnamTec" className='ms-2' height="60"/>
        </div>
        <div className="col-auto d-flex align-items-center gap-3">
          <span className="user-section d-none d-md-inline">
            Bem-vindo <strong>({typeUser})</strong>
          </span>
          <div className="menu-toggle config-toggle" 
                onClick={() => navigate('/config')}>
             ⚙
          </div>
        </div>
      </div>
    </div>
  </header>
  );
};

export default Header;