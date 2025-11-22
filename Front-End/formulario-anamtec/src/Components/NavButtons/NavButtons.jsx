import React from "react";
import { Button } from "react-bootstrap";
import "./NavButtons.css";

function NavButtons({ onVoltar, onProximo, mostrarProximo = true, id }) { 
    return (
        <div className="d-flex justify-content-between mt-3">
            <Button type="button" className="custom-btn" onClick={onVoltar}>
                Voltar
            </Button>

            {mostrarProximo && (
                <button 
                    id={id} // ID QUE FOI CRIADO NO FormInform para o botão Próximo
                    type="button" 
                    className="custom-btn" 
                    onClick={onProximo}
                >
                    Próximo
                </button>
            )}
        </div>
    );
}

export default NavButtons;
