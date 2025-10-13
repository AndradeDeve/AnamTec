import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { putFunctionResetSenha } from "../../services/APIService";
import "./Config.css";
import { getUser } from "../../helpers/auth";

export default function Configuracoes() {
    // ======================================
    // 1. ESTADOS
    // ======================================
    const [abaAtiva, setAbaAtiva] = useState("usuario");
    const navegar = useNavigate();

    // Estado geral do formulário (Usuário e Preferências)
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

    // Estado do formulário de Segurança
    const [formSeg, setFormSeg] = useState({
        senhaAtual: "",
        novaSenha: "",
        confirmarSenha: "",
    });

    // ======================================
    // 2. EFEITO DE INICIALIZAÇÃO (TEMA)
    // ======================================
    useEffect(() => {
        const userdata = getUser();
        
        const temaSalvo = localStorage.getItem('temaPreferido') || 'claro';
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

        if (userdata) {
        setFormData(prev => ({
            ...prev,
            nome: userdata.user || userdata.user || prev.user,
            email: userdata.email || prev.email,
            type: userdata.type || userdata.role || prev.type,
            tema: temaSalvo || prev.tema
        }));
    }

    }, []);

    // ======================================
    // 3. FUNÇÕES HANDLERS
    // ======================================

    const navPrincipal = () => {
        navegar("/Home");
    };
    
    // FUNÇÃO UNIFICADA: Atualiza formSeg ou formData e lida com o tema
    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        const novoValor = type === 'checkbox' ? checked : value;

        // Verifica se o campo pertence ao formulário de SEGURANÇA
        if (['senhaAtual', 'novaSenha', 'confirmarSenha'].includes(name)) {
            setFormSeg(prev => ({ 
                ...prev, 
                [name]: novoValor 
            }));
        } else {
            // Caso contrário, pertence ao formulário GERAL
            setFormData(prev => ({ 
                ...prev, 
                [name]: novoValor 
            }));
            
            // Lógica de TEMA (só executa se 'tema' for alterado)
            if (name === 'tema') {
                const root = document.documentElement;
                
                // Limpa as classes existentes
                root.classList.remove('tema-claro', 'tema-escuro');
                
                if (novoValor === 'escuro') {
                    root.classList.add('tema-escuro');
                } else {
                    root.classList.add('tema-claro');
                }
                
                localStorage.setItem('temaPreferido', novoValor);
            }
        }
    }

    // FUNÇÃO SUBMIT: Lida com submissão condicional
    async function handleSubmit(e) {
        e.preventDefault();
        
        // Se não estiver na Aba Segurança, salva apenas as outras configurações (preferências/usuário)
        if (abaAtiva !== "seguranca") {
            // Em uma aplicação real, você chamaria a API PUT/POST para formData aqui
            toast.success("Configurações salvas!");
            console.log("Configurações salvas:", formData); 
            return;
        }

        // LÓGICA DE SEGURANÇA (só executa na aba "seguranca")
        try {
            if (formSeg.novaSenha !== formSeg.confirmarSenha) {
                toast.error("A nova senha e a confirmação não coincidem.");
                return;
            }

            // Chama a API de reset de senha
            const data = await putFunctionResetSenha(formSeg);
            
            if (data && data.status === 200) {
                toast.success("Senha atualizada com sucesso!");
            } else {
                 toast.error("Erro ao atualizar senha. Verifique a senha atual.");
            }
            
        } catch(err) {
            console.error("Erro: ", err);
            toast.error("Erro ao tentar salvar a senha. Tente novamente.");
        }
    }
    
    // ======================================
    // 4. RENDERIZAÇÃO (JSX)
    // ======================================
    return (
        <div className="config-wrapper">
            <h2 className="config-title">Configurações</h2>
            <div className="config-container">
                
                {/* MENU LATERAL */}
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

                {/* CONTEÚDO DA ABA */}
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

                                <label className="checkbox-label">
                                    <input 
                                        type="checkbox" 
                                        name="notificacoes" 
                                        checked={formData.notificacoes} 
                                        onChange={handleChange} 
                                    />
                                    Receber notificações por e-mail
                                </label>
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
        </div>
    );
};