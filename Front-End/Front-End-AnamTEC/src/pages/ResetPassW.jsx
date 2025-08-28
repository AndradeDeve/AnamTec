import React, { useState } from 'react';
import "./ResetPassW.css";
import logoAnamTec from "../assets/Anamtec-logo.png";

import { ToastContainer, toast } from 'react-toastify';
import { putFunctionResetSenha } from '../services/APISevice';

export default function ResetPassW() {
    const [formData, setFormData] = useState({
        senha: "",
        senhaNova: "",
        confirmaSenha: "",
        email: localStorage.getItem("email")
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
        <div className="reset-container">
            <div className="aside-container">
            <div className="reset-header">
                <h1>AnamTec</h1>
                <img src={logoAnamTec} alt="Logo" className='reset-logo' />
            </div>
                <p className="frase">Dados que importam.<br/> Decisões que transformam </p>
            </div>
            <div className="reset-card">
                <div className="reset-card-header">
                    <h2>Resetar Senha</h2>
                </div>

                <form onSubmit={handleResetPassW} className="reset-card-body">
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

                    <button type="submit">Salvar</button>
                </form>
            </div>
        </div>
    );
}
