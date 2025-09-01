import React from "react";
import "./ProgressBar.css";

function ProgressBar({ etapas, etapaAtual }) {
    return (
        <div className="progress-bar-container">
            {etapas.map((etapa, index) => (
               <div key={index} className="step-container">
                <div className={`circle ${index === etapaAtual ? "active" : ""}`}>
                    {index + 1}
                </div> 
                <span className={`etapa-label ${index === etapaAtual ? "active" : ""}`}>
                    {etapa}
                </span>
                {index < etapas.length -1 && <div className="line" />}
            </div>
        ))}
        </div>
    );
}

export default ProgressBar;