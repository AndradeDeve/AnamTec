import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { showToast } from "../../Utils/toast";
import { putFunctionResetSenha } from "../../services/APIService";
import { getUser } from "../../helpers/auth";
import AbaUsuario from "./AbaUsuario";
import AbaPreferencias from "./AbaPreferencias";
import AbaSeguranca from "./AbaSeguranca";
import ConfirmationModal from "./ConfirmationModal";
import "./Config.css";

const aplicarTema = (novoTema) => {
    const root = document.documentElement;
    root.classList.remove('tema-claro', 'tema-escuro');

    if (novoTema === 'escuro') {
        root.classList.add('tema-escuro');
    } else {
        root.classList.add('tema-claro');
    }
    
    localStorage.setItem('temaPreferido', novoTema);
};

export default function Configuracoes() {
    const navegar = useNavigate();
    const [abaAtiva, setAbaAtiva] = useState("usuario");
    const [showModal, setShowModal] = useState(false);
    const [pendingTheme, setPendingTheme] = useState(null);

    
    const [formUsuario, setFormUsuario] = useState({ 
        nome: "", 
        email: "", 
        type: "" 
    });
    const [formPreferencias, setFormPreferencias] = useState({ 
        tema: "claro", 
        notificacoes: true 
    });
    const [formSeguranca, setFormSeguranca] = useState({
        senhaAtual: "",
        novaSenha: "",
        confirmarSenha: "",
    });

    useEffect(() => {
 
        const userData = getUser();
        if (userData) {
            setFormUsuario({
                nome: userData.user || "",
                email: userData.email || "",
                type: userData.type || "",
            });
        }
        
        const temaSalvo = localStorage.getItem('temaPreferido') || 'claro';
        aplicarTema(temaSalvo); 
        setFormPreferencias(prev => ({ ...prev, tema: temaSalvo }));

    }, []);

    const handleChangeUsuario = (e) => {
        const { name, value } = e.target;
        setFormUsuario(prev => ({ ...prev, [name]: value }));
    };

    const handleChangePreferencias = (e) => {
        const { name, value, type, checked } = e.target;
        const novoValor = type === 'checkbox' ? checked : value;
        setFormPreferencias(prev => ({ ...prev, [name]: novoValor }));
    };

    const handleChangeSeguranca = (e) => {
        const { name, value } = e.target;
        setFormSeguranca(prev => ({ ...prev, [name]: value }));
    };

    const handleApplyTheme = useCallback((novoTema) => {
        aplicarTema(novoTema);
        showToast("success", "Tema atualizado com sucesso!");
        setShowModal(false); 
        setFormPreferencias(prev => ({ ...prev, tema: novoTema })); // Sincroniza o select
    }, []);

    const handleSubmitPreferencias = () => {
        const temaSelecionado = formPreferencias.tema;
        const temaAtual = localStorage.getItem('temaPreferido') || 'claro';
        
        if (temaSelecionado !== temaAtual) {
            setPendingTheme(temaSelecionado);
            setShowModal(true);
            return; 
        } 

        showToast("success", "Configurações salvas!");
    };

    const handleSubmitSeguranca = async () => {
        if (formSeguranca.novaSenha !== formSeguranca.confirmarSenha) {
            showToast ("error", "A nova senha e a confirmação não coincidem.");
            return;
        }

        try {
            const data = await putFunctionResetSenha(formSeguranca); 

            if (data && data.status === 200) {
                showToast ("success", "Senha atualizada com sucesso!.");
                setFormSeguranca({ senhaAtual: "", novaSenha: "", confirmarSenha: "" }); // Limpa o formulário
            } else {
                showToast("error", "Erro ao atualizar senha. Verifique a senha atual.");
            }
                
        } catch(err) {
            console.error("Erro ao salvar senha: ", err);
            showToast("error", "Erro ao tentar salvar a senha. Tente novamente.");
        }
    };

    const handleSubmitUsuario = () => {
        showToast("success", "Configurações de Usuário salvas!");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (abaAtiva === "usuario") {
            handleSubmitUsuario();
        } else if (abaAtiva === "preferencias") {
            handleSubmitPreferencias();
        } else if (abaAtiva === "seguranca") {
            handleSubmitSeguranca();
        }
    };
    
    const handleVoltar = () => {
        navegar(-1);
    };

    return (
        <div className="config-wrapper">
            <h2 className="config-title">Configurações</h2>
            <div className="config-container">
                <aside className="config-menu">
                    <ul>
                        <li className={abaAtiva === "usuario" ? "ativo" : ""} 
                            onClick={() => setAbaAtiva("usuario")}>Usuário</li>
                        <li className={abaAtiva === "preferencias" ? "ativo" : ""} 
                            onClick={() => setAbaAtiva("preferencias")}>Preferências</li>
                        <li className={abaAtiva === "seguranca" ? "ativo" : ""} 
                            onClick={() => setAbaAtiva("seguranca")}>Segurança</li>
                    </ul>
                </aside>

                <main className="config-content">
                    <form className="config-form" onSubmit={handleSubmit}>
                        {abaAtiva === "usuario" && (
                            <AbaUsuario formData={formUsuario} handleChange={handleChangeUsuario} />
                        )}

                        {abaAtiva === "preferencias" && (
                            <AbaPreferencias formData={formPreferencias} handleChange={handleChangePreferencias} />
                        )}
                        
                        {abaAtiva === "seguranca" && (
                            <AbaSeguranca formData={formSeguranca} handleChange={handleChangeSeguranca} />
                        )}
                        
                        <div className="actions">
                            <button type="button" className="btn-salvar" onClick={handleVoltar}>
                                Voltar
                            </button>
                            <button type="submit" className="btn-salvar">
                                Salvar Alterações
                            </button>
                        </div>
                    </form>
                </main>
            </div>
            <ConfirmationModal 
                showModal={showModal} 
                pendingTheme={pendingTheme}
                onConfirm={handleApplyTheme}
                onCancel={() => setShowModal(false)}
            />
        </div>
    );
}