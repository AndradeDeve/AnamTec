import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import homeIcon from '../../../assets/home.png';
import personIcon from '../../../assets/person.png';
import nsaIcon from '../../../assets/nsa.png';
import controlAcessIcon from '../../../assets/control-acess.png';
import relatorioIcon from '../../../assets/relatorio.png';
import logoAnamtec from '../../../assets/Anamtec-logo.png';
// import configIcon from '../../../assets/config-icon.png'  // Não mais necessário, pois o ícone navega direto
import './Header.css'; // mantém seu CSS personalizado

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  }
  // Os estados e funções configOpen/toggleConfig foram removidos pois o ícone navega direto.

    // Função para abrir o link do NSA em uma nova aba
   const handleNsaAccess = () => {
    // Abre o URL em uma nova aba (_blank)
    window.open('https://nsa.cps.sp.gov.br/', '_blank');
    // Fecha o menu após o clique
    setMenuOpen(false);
  };

const navigate = useNavigate();

return (
  <header className="header py-3">
    <div className="container-fluid">
      <div className="row align-items-center justify-content-between">
        <div className="col-auto">
          <div className="menu-toggle d-md-flex" onClick={toggleMenu}>☰</div>
          
          {/* Sidebar Menu - Usa display: flex column para ancorar o footer */}
          <div className={`sidebar-menu-custom ${menuOpen ? 'show' : ''}`}>
             
             {/* Botão para Fechar o menu (TOPO) */}
             <div className="close-btn" onClick={toggleMenu}>&times;</div> 
            
            {/* CONTAINER PRINCIPAL/COM SCROLL: Apenas este bloco rola */}
            <div className='sidebar-list-container'> 
                <ul className="list-unstyled sidebar-list">
                  {/* Opções de Navegação */}
                  <li className='mx-2' onClick={() => { navigate('/'); toggleMenu(); }}>
                    <img src={homeIcon} alt="Página Home" />
                  <span>Home</span>
                  </li>
                  <li className='mx-2' onClick={() => { navigate('/Cadastro'); toggleMenu(); }}>
                    <img src={personIcon} alt="Página de Cadastro" />
                  <span>Cadastrar</span>
                  </li>
                  <li className='mx-2'  onClick={() => { handleNsaAccess(); toggleMenu(); }}>
                    <img src={nsaIcon} alt="Link de Acesso para o site do NSA" />
                  <span>Acesso ao NSA</span>
                  </li>
                  <li className='mx-2' onClick={() => { navigate('/controle'); toggleMenu(); }}>
                    <img src={controlAcessIcon} alt="Controle de Acesso de Professores" />
                  <span>Controle de Acesso</span></li>         
                  <li className='mx-2' onClick={() => { navigate('/relatorios'); toggleMenu(); }}>
                    <img src={relatorioIcon} alt="Página de Relatórios" />
                  <span>Relatório</span>
                  </li>
                </ul>
             </div>
             {/* FIM DO CONTAINER DE SCROLL */}

            {/* ITEM ANCORADO: Opção Sair (RODAPÉ) */}
            <ul className="list-unstyled sidebar-footer-list">
                 <li className='mx-2' onClick={() => { navigate('/Login'); toggleMenu(); }}>
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
            Bem-vindo <strong>(Coordenador Pedagógico)</strong>
          </span>
          {/* O ícone de engrenagem agora navega diretamente para a página de Configurações */}
          <div className="menu-toggle config-toggle" onClick={() => navigate('/config')}>
             ⚙
          </div>
        </div>
      </div>
    </div>
  </header>
  );
};

export default Header;