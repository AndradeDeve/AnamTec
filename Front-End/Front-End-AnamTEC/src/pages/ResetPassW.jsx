import React, { useState } from 'react';
import "./ResetPassW.css";
import logoAnamTec from "../IMG/Anamtec-logo.png";

export default function ResetPassW() {
    const [formData, setFormData] = useState({
        senhaAtual: "",
        senhaNova: "",
        confirmSenha: ""
    });

    const handleResetPassW = (e) => {
        e.preventDefault(); // Evita o recarregamento da página
        console.log("Resetar a Senha", formData); // Aqui podemos enviar os dados para um backend ou API
    };

    return (
        <div className="reset-container">
            <div className="reset-header">
                <h1>AnamTec</h1>
                <img src={logoAnamTec} alt="Logo" className='reset-logo' />
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
                        value={formData.senhaAtual}
                        onChange={(e) =>
                            setFormData({ ...formData, senhaAtual: e.target.value })
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
                        value={formData.confirmSenha}
                        onChange={(e) =>
                            setFormData({ ...formData, confirmSenha: e.target.value })
                        }
                    />

                    <button type="submit">Salvar</button>
                </form>
            </div>
        </div>
    );
}
