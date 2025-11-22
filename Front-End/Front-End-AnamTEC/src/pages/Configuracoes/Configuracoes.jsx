import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { showToast } from "../../Utils/toast";
import { putFunctionResetSenha } from "../../services/APIService";
import "./Config.css";
import { getFunctionUser } from "../../services/APIService.js";
import { getUser } from "../../helpers/auth";
import RedefineInfo from "../components/Pop-Up-Senha";

export default function Configuracoes() {

    const [abaAtiva, setAbaAtiva] = useState("usuario");
    const navegar = useNavigate();
    // Novos estados para o Modal de Confirmação
    const [showModal, setShowModal] = useState(false);
    const [ showModalInf, setShowModalInf ] = useState(false);
    const [pendingTheme, setPendingTheme] = useState(null);
    const [originalUserData, setOriginalUserData] = useState({
        nome: "",
        email: "",
    });


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

    // Função para aplicar o tema visualmente e salvar no localStorage
    const applyTheme = (novoTema) => {
        const root = document.documentElement;
        
        // Limpa as classes existentes
        root.classList.remove('tema-claro', 'tema-escuro'); 
        
        // Aplica a nova classe
        if (novoTema === 'escuro') {
            root.classList.add('tema-escuro');
        } else {
            root.classList.add('tema-claro');
        }
        
        // Atualiza localStorage e estado local para refletir a mudança imediatamente
        localStorage.setItem('temaPreferido', novoTema);
        setFormData(prev => ({ ...prev, tema: novoTema }));
        setPendingTheme(null);
        showToast("success", "Tema atualizado com sucesso!");
        setShowModal(false); // Fecha o modal
    };
    
    useEffect(() => {
        try{
            const temaSalvo = localStorage.getItem('temaPreferido') || 'claro';
            const handUser = async () => {
                const userdata = getUser(); 
                const user = await getFunctionUser("id", userdata.id);
                console.log("Dados do usuário obtidos:", user);
                if (userdata) {
                setFormData(prev => ({
                    ...prev,
                    nome: user[0].nome || prev.nome,
                    email: user[0].email || prev.email,
                    type: userdata.type || prev.type,
                    tema: temaSalvo || prev.tema
                }));

                setOriginalUserData({
                    nome: userdata.nome || "",
                    email: userdata.email || "",
                });
            }
            }
            handUser();
            const root = document.documentElement;

            // Sempre limpa classes antigas para evitar conflitos
            root.classList.remove('tema-claro', 'tema-escuro');

            // Aplica o tema escuro se estiver salvo
            if (temaSalvo === 'escuro') {
                root.classList.add('tema-escuro');
            } else {
                root.classList.add('tema-claro'); // Explícito para consistência
            }

            // Atualiza o estado para que o select reflita a preferência salva
            setFormData(prev => ({
                ...prev,
                tema: temaSalvo || prev.tema 
            }));

        }catch(error){
            console.log("Erro: ", error)
        }
        

        
    }, []);

    const navPrincipal = () => {
        navegar("/Home");
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
            // Caso contrário, pertence ao formulário GERAL (inclui o tema)
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
        if (abaAtiva === "usuario") {
            const nomeAlterado = formData.nome !== originalUserData.nome;
            const emailAlterado = formData.email !== originalUserData.email;

            if (nomeAlterado || emailAlterado) {
                setShowModalInf(true);
                return;
            }

            showToast("success", "Nenhuma alteração em nome ou e-mail detectada.");
            return
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
                    <p>Você tem certeza que deseja alterar o tema para (<strong>{pendingTheme === 'escuro' ? 'Escuro' : 'Claro'}</strong>)?</p>
                    <div className="modal-actions">
                        <button 
                            type="button"
                            className="btn-salvar btn-cancel" 
                            onClick={() => setShowModal(false)}
                        >
                            Cancelar
                        </button>
                        <button 
                            type="button"
                            className="btn-salvar btn-confirm" 
                            onClick={() => applyTheme(pendingTheme)}
                        >
                            Confirmar e Aplicar
                        </button>
                    </div>
                </div>
            </div>
        );
    };
    // --- Fim Componente Modal ---

    return (
        <div className="config-wrapper">
            <h2 className="config-title">Configurações</h2>
            <div className="config-container">
                <aside className="config-menu">
                    <ul>
                        <li 
                            className={abaAtiva === "usuario" ? "ativo" : ""} 
                            onClick={() => setAbaAtiva("usuario")}
                        >
                            Usuário
                        </li>
                        <li 
                            className={abaAtiva === "preferencias" ? "ativo" : ""} 
                            onClick={() => setAbaAtiva("preferencias")}
                        >
                            Preferências
                        </li>
                        <li 
                            className={abaAtiva === "seguranca" ? "ativo" : ""} 
                            onClick={() => setAbaAtiva("seguranca")}
                        >
                            Segurança
                        </li>
                    </ul>
                </aside>

                <main className="config-content">
                    <form className="config-form" onSubmit={handleSubmit}>
                        
                        {/* === Aba Usuário === */}
                        {abaAtiva === "usuario" && (
                            <>
                                <label>Nome:</label>
                                <input 
                                    type="text" 
                                    name="nome" 
                                    value={formData.nome} 
                                    onChange={handleChange} 
                                />

                                <label>Email:</label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    value={formData.email} 
                                    onChange={handleChange} 
                                />

                                <label>Cargo:</label>
                                <input 
                                    type="text" 
                                    value={formData.type} 
                                    disabled
                                />
                            </>
                        )}

                        {/* === Aba Preferências === */}
                        {abaAtiva === "preferencias" && (
                            <>
                                <label>Tema:</label>
                                <select 
                                    name="tema" 
                                    value={formData.tema} 
                                    onChange={handleChange}
                                >
                                    <option value="claro">Claro</option>
                                    <option value="escuro">Escuro</option>
                                </select>

                            </>
                        )}
                        {/* === Aba Segurança === */}
                        {abaAtiva === "seguranca" && (
                            <>
                            <label>Senha atual:</label>
                            <input 
                                type="password" 
                                name="senhaAtual" 
                                placeholder="Informe sua senha atual"
                                value={formSeg.senhaAtual}
                                onChange={handleChange}
                                required
                            />
                                <label>Nova senha:</label>
                                <input 
                                    type="password" 
                                    name="novaSenha" 
                                    value={formSeg.novaSenha} 
                                    onChange={handleChange} 
                                />

                            <label>Confirmar nova senha:</label>
                            <input 
                                type="password" 
                                name="confirmarSenha" 
                                placeholder="Confirme sua nova senha"
                                value={formSeg.confirmarSenha}
                                onChange={handleChange}
                                required
                            />
                            </>
                        )}
                        {/* BOTÃO DE SALVAR */}
                        <div className="actions">
                            <button 
                                type="button" 
                                className="btn-salvar"
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
            <div>
                <RedefineInfo 
                    show={showModalInf} 
                    onClose={() => setShowModalInf(false)} 
                    emailUser={formData.email}
                    NomeUser={formData.nome}
                />
            </div>
            {/* Renderiza o Modal de Confirmação */}
            <ConfirmationModal
            
            />
        </div>
    );
};