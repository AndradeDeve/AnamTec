import React from 'react';

export default function ConfirmationModal({ showModal, pendingTheme, onConfirm, onCancel }) {
    if (!showModal) return null;

    const themeName = pendingTheme === 'escuro' ? 'Escuro' : 'Claro';

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Confirmação de Tema</h3>
                <p>
                    Você tem certeza que deseja alterar o tema para 
                    (<strong>{themeName}</strong>)?
                </p>
                <div className="modal-actions">
                    <button 
                        type="button" 
                        className="btn-salvar btn-cancel" 
                        onClick={onCancel} // Chama a função onCancel (fecha o modal)
                    >
                        Cancelar
                    </button>
                    <button 
                        type="button" 
                        className="btn-salvar btn-confirm" 
                        onClick={() => onConfirm(pendingTheme)} // Chama a função de confirmação com o tema pendente
                    >
                        Confirmar e Aplicar
                    </button>
                </div>
            </div>
        </div>
    );
}