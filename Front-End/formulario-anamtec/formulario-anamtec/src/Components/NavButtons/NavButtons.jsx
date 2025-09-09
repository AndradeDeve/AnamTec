import React from "react";
import { Button } from "react-bootstrap";
import "./NavButtons.css";

function NavButtons({ onVoltar, onProximo }) { 
    return (
        <div className="d-flex justify-content-between mt-4">
            <Button type="button" className="custom-btn" onClick={onVoltar}>
                Voltar
            </Button>

            <Button type="button" className="custom-btn" onClick={onProximo}>
                Próximo
            </Button>
        </div>
    );
}

export default NavButtons;