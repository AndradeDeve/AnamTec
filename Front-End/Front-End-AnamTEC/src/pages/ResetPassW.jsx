import React, { useState } from 'react';
import "./ResetPassW.css";
import logoAnamTec from "../assets/Anamtec-logo.png";
import RedefineSenha from "../pages/components/EmailPassword/index"
import { toast } from 'react-toastify';
import { putFunctionResetSenha } from '../services/APIService';
import { useNavigate } from 'react-router-dom';

export default function ResetPassW() {

    const [showModal, setShowModal] = useState(false)

    const navigate = useNavigate()

    const [returnLogin, setReturnLogin] = useState("");
    const navLogin = () => {
        setReturnLogin(navigate("/Login", {replace: true}));
    }
    
    const [formData, setFormData] = useState({
        senha: "",
        senhaNova: "",
        confirmaSenha: "",
    });

    const  handleResetPassW = async (e) => {
        e.preventDefault(); // Evita o recarregamento da página
        try{
            console.log("Dados enviados:", formData);
            const data = await putFunctionResetSenha(formData);
            if(data.status === 200) {
                toast.success('Senha alterada com sucesso.', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                });
            }
        }catch(error) {
            console.error("Erro ao resetar a senha:", error);
            toast.warn('Erro ao resetar a senha.', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
        }
    };

    return (
        <div className="reset-container col-12 col-md-12 col-lg-12">
            <div className="aside-containerReset d-flex">
            <div className="reset-header">
                <h1>AnamTec</h1>
                <img src={logoAnamTec} alt="Logo" className='logoa' />
            </div>
                <p className="frase">Dados que importam.<br/> Decisões que transformam </p>
            </div>
            <div className="reset-card">
                <div className="reset-card-header">
                    <h2>Resetar Senha</h2>
                </div>
                <form onSubmit={handleResetPassW} className="resetForm">
                    <label htmlFor='senhaAtual'>Senha atual:</label>
                    <input
                        type="password"
                        id="senhaAtual"
                        placeholder="Informe a senha atual"
                        value={formData.senha}
                        onChange={(e) =>
                            setFormData({ ...formData, senha: e.target.value })
                        }
                    />
                    <label htmlFor='NovaSenha'>Nova Senha:</label>
                    <input
                        type="password"
                        id="NovaSenha"
                        placeholder="Informe a nova senha"
                        value={formData.senhaNova}
                        onChange={(e) =>
                            setFormData({ ...formData, senhaNova: e.target.value })
                        }
                    />

                    <label htmlFor='ConfirmaSenha'>Confirmar Senha:</label>
                    <input
                        type="password"
                        id="ConfirmaSenha"
                        placeholder="Confirme a sua nova senha"
                        value={formData.confirmaSenha}
                        onChange={(e) =>
                            setFormData({ ...formData, confirmaSenha: e.target.value })
                        }
                    />
                        <div className="footer-modal">
                            <p className="voltar-login"
                                onClick={navLogin}
                                >voltar 
                            </p>
                            <p className="redefineSenha"
                                onClick={() => setShowModal(true)}>
                                Enviar nova senha no email
                            </p>
                        </div>
                    <button type="submit" className="btn-submit">Salvar</button>
                </form>
            </div>
                    <RedefineSenha 
                        show={showModal} 
                        onClose={() => setShowModal(false)} 
                        onEnviar={() => {
                            console.log("Enviar nova senha por email");
                        setShowModal(false);

                        }}
                    />
        </div>
    );
}
