import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoAnamTec from "../../assets/Anamtec-logo.png"; 
import './Not-found.css'; // Usando o nome do seu arquivo CSS

// O estilo inline foi removido. A cor agora será definida no CSS.
const LockIcon = () => (
    <div className="lock-icon-403">🔒</div>
);

const RestrictedAccess = () => {
    const navigate = useNavigate();

    const goHome = () => {
        navigate('/home'); 
    };

    const goToSupport = (e) => {
        e.preventDefault();
        navigate('/support'); 
    }

    return (
        <div className="not-found-wrapper"> 
            
            {/* COLUNA ESQUERDA: ASIDE (Fundo Escuro) */}
            <div className="asideContainerNotFound">
                <header className="header-Not-Found">
                    <h1 className="d-none d-sm-block">AnamTec</h1>
                    <img src={logoAnamTec} alt="Logo" className="logoa" />
                </header>
                <p className="frase">
                    Dados que importam.<br/> Decisões que transformam
                </p>
            </div>

            {/* COLUNA DIREITA: CONTEÚDO 403 (Card) */}
            <div className="not-card access-denied-card">
                <div className="titleNF">
                    <h2 style={{ fontSize: '1.2rem', margin: '0' }}>Acesso Restrito ao Sistema</h2>
                </div>
                <div>
                    <div className="message-content">
                        <LockIcon /> 
                        
                        <h1 className="error-code-403">403 Forbidden</h1>
                        
                        {/* 🚨 Mensagens usando var(--cor-texto-principal) e var(--cor-texto-secundario) */}
                        <p className="main-message">
                            Sua conta não tem o <strong> nível de permissão </strong>necessário para visualizar esta página.
                        </p>
                        
                        <p className="details-message">
                            Se você acredita que isso é um erro, por favor, entre em contato com o suporte ou retorne ao seu painel principal.
                        </p>
                    </div>
                </div>

                {/* Botões de Ação */}
                <div className="action-buttons-403">
                    <button 
                        type="button" 
                        className="btn-submit" 
                        onClick={goHome}
                    >
                        Ir para o Dashboard
                    </button>
                    
                    <a href="#" className="support-link" onClick={goToSupport}>
                        Falar com o Suporte
                    </a>
                </div>
            </div>
        </div>
    );
};

export default RestrictedAccess;