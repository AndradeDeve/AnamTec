import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { showToast } from "../../Utils/toast";
import { putFunctionResetSenha } from "../../services/APIService";
import "./Config.css";
import { getUser } from "../../helpers/auth";

export default function Configuracoes() {

    const [abaAtiva, setAbaAtiva] = useState("usuario");
    const navegar = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [pendingTheme, setPendingTheme] = useState(null);

    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        type: "",
        senha: "",
        novaSenha: "",
        confirmarSenha: "",
        tema: "claro",
        notificacoes: true,
    });
    
    const [formSeg, setFormSeg] = useState({
        senhaAtual: "",
        novaSenha: "",
        confirmarSenha: "",
    });

    const applyTheme = (novoTema) => {
        const root = document.documentElement;
        
        root.classList.remove('tema-claro', 'tema-escuro'); 

        if (novoTema === 'escuro') {
            root.classList.add('tema-escuro');
        } else {
            root.classList.add('tema-claro');
        }
        
        localStorage.setItem('temaPreferido', novoTema);
        showToast("success", "Tema atualizado com sucesso!");
        setShowModal(false); // Fecha o modal
    };
    
    useEffect(() => {
        const userdata = getUser();
        
        const temaSalvo = localStorage.getItem('temaPreferido') || 'claro';
        const root = document.documentElement;

        // Sempre limpa classes antigas para evitar conflitos
        root.classList.remove('tema-claro', 'tema-escuro');

        if (temaSalvo === 'escuro') {
            root.classList.add('tema-escuro');
        } else {
            root.classList.add('tema-claro');
        }

        setFormData(prev => ({
            ...prev,
            tema: temaSalvo || prev.tema 
        }));

        if (userdata) {
            setFormData(prev => ({
                ...prev,
                nome: userdata.user || prev.user,
                email: userdata.email || prev.email,
                type: userdata.type || prev.type,
                tema: temaSalvo || prev.tema
            }));
        }
    }, []);

    const navPrincipal = () => {
        navegar(-1);
    };

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        const novoValor = type === 'checkbox' ? checked : value;

        if (['senhaAtual', 'novaSenha', 'confirmarSenha'].includes(name)) {
            setFormSeg(prev => ({ 
                ...prev, 
                [name]: novoValor 
            }));
        } else {

            setFormData(prev => ({ 
                ...prev, 
                [name]: novoValor 
            }));

        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

    if (abaAtiva === "preferencias") {
        const temaSelecionado = formData.tema;
        const temaAtual = localStorage.getItem('temaPreferido') || 'claro';
        
        if (temaSelecionado !== temaAtual) {
            setPendingTheme(temaSelecionado);
            setShowModal(true);
            return; 
        } 
            showToast("success","Configurações salvas!");
            console.log("Configurações salvas (sem tema):", formData); 
            return;
        }

        if (abaAtiva === "seguranca") {
            try {
                if (formSeg.novaSenha !== formSeg.confirmarSenha) {
                    showToast ("error","A nova senha e a confirmação não coincidem.");
                    return;
                }
                // Chama a API de reset de senha
                const data = await putFunctionResetSenha(formSeg);
                
                if (data && data.status === 200) {
                    showToast ("success","Senha atualizada com sucesso!.");
                } else {
                    showToast("error","Erro ao atualizar senha. Verifique a senha atual.");
                }
                    
            } catch(err) {
                console.error("Erro: ", err);
                showToast("error","Erro ao tentar salvar a senha. Tente novamente.");
            }
            return;
        }
        showToast("success","Configurações salvas!");
        console.log("Configurações salvas:", formData); 
        return;
    }

const ConfirmationModal = () => {
    if (!showModal) return null;
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Confirmação de Tema</h3>
                <p>Você tem certeza que deseja alterar o tema para 
                    (<strong>{pendingTheme === 'escuro' ? 'Escuro' : 'Claro'}</strong>)?
                </p>
                <div className="modal-actions">
                    <button type="button"className="btn-salvar btn-cancel" 
                            onClick={() => setShowModal(false)}
                    >
                        Cancelar
                    </button>
                    <button type="button" className="btn-salvar btn-confirm" 
                            onClick={() => applyTheme(pendingTheme)}
                    >
                        Confirmar e Aplicar
                    </button>
                </div>
            </div>
        </div>
    );
};

return (
    <div className="config-wrapper">
        <h2 className="config-title">Configurações</h2>
            <div className="config-container">
            <aside className="config-menu">
                <ul>
                    <li className={abaAtiva === "usuario" ? "ativo" : ""} 
                        onClick={() => setAbaAtiva("usuario")}
                    >
                        Usuário
                    </li>
                    <li className={abaAtiva === "preferencias" ? "ativo" : ""} 
                        onClick={() => setAbaAtiva("preferencias")}
                    >
                        Preferências
                    </li>
                    <li className={abaAtiva === "seguranca" ? "ativo" : ""} 
                        onClick={() => setAbaAtiva("seguranca")}
                    >
                        Segurança
                    </li>
                </ul>
            </aside>

            <main className="config-content">
                <form className="config-form" onSubmit={handleSubmit}>
                    {abaAtiva === "usuario" && (
                        <>
                        <label>Nome:</label>
                            <input type="text" name="nome" value={formData.nome} 
                                    onChange={handleChange} 
                            />
                            <label>Email:</label>
                            <input type="email" name="email" value={formData.email} 
                                    onChange={handleChange} 
                            />
                            <label>Cargo:</label>
                            <input type="text" value={formData.type} 
                                    disabled
                            />
                        </>
                    )}

                    {abaAtiva === "preferencias" && (
                        <>
                        <label>Tema:</label>
                            <select name="tema" value={formData.tema} 
                                    onChange={handleChange}
                            >
                                <option value="claro">Claro</option>
                                <option value="escuro">Escuro</option>
                            </select>

                            <label className="checkbox-label">
                                <input type="checkbox" name="notificacoes" 
                                        checked={formData.notificacoes} onChange={handleChange} 
                                />
                                    Receber notificações por e-mail
                            </label>
                        </>
                    )}
                       
                    {abaAtiva === "seguranca" && (
                        <>
                        <label>Senha atual:</label>
                        <input type="password" name="senhaAtual" 
                                placeholder="Informe sua senha atual"
                                value={formSeg.senhaAtual} onChange={handleChange}
                                required
                        />
                        <label>Nova senha:</label>
                        <input type="password" name="novaSenha" 
                                value={formSeg.novaSenha} onChange={handleChange} 
                        />
                        <label>Confirmar nova senha:</label>
                        <input type="password" name="confirmarSenha" 
                                placeholder="Confirme sua nova senha"
                                value={formSeg.confirmarSenha} onChange={handleChange}
                                required
                        />
                        </>
                    )}
                    
                    <div className="actions">
                        <button type="button" className="btn-salvar"
                                onClick={navPrincipal}
                        >
                            Voltar
                        </button>

                        <button type="submit" className="btn-salvar">
                            Salvar Alterações
                        </button>
                    </div>
                </form>
            </main>
        </div>
        <ConfirmationModal />
    </div>
    );
};