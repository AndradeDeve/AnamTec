import React from 'react';

export default function AbaUsuario({ formData, handleChange }) {
    return (
        <>
            <label>Nome:</label>
            <input type="text" 
                name="nome" 
                value={formData.nome} 
                onChange={handleChange} 
            />
            
            <label>Email:</label>
            <input type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
            />
            
            <label>Cargo:</label>
            <input type="text" 
                value={formData.type} 
                disabled 
            />
        </>
    );
}