import React from 'react';


export default function AbaSeguranca({ formData, handleChange }) {
    return (
        <>
            <label>Senha atual:</label>
            <input type="password" 
                name="senhaAtual" 
                placeholder="Informe sua senha atual"
                value={formData.senhaAtual} 
                onChange={handleChange}
                required
            />
            
            <label>Nova senha:</label>
            <input type="password" 
                name="novaSenha" 
                value={formData.novaSenha} 
                onChange={handleChange} 
                required
            />
            
            <label>Confirmar nova senha:</label>
            <input type="password" 
                name="confirmarSenha" 
                placeholder="Confirme sua nova senha"
                value={formData.confirmarSenha} 
                onChange={handleChange}
                required
            />
        </>
    );
}