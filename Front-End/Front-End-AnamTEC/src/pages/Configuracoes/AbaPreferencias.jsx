import React from 'react';

export default function AbaPreferencias({ formData, handleChange }) {
    return (
        <>
            <label>Tema:</label>
            <select name="tema" value={formData.tema} onChange={handleChange}>
                <option value="claro">Claro</option>
                <option value="escuro">Escuro</option>
            </select>

            <label className="checkbox-label">
                <input type="checkbox" 
                    name="notificacoes" 
                    checked={formData.notificacoes} 
                    onChange={handleChange} 
                />
                Receber notificações por e-mail
            </label>
        </>
    );
}