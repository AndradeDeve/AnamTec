import React from "react";
import "./ProgressBar.css";

function ProgressBar({ etapas, etapaAtual }) {
    return (
        <div className="progress-bar-container">
            {etapas.map((etapa, index) => {
                const isActive = index === etapaAtual;
                const isCompleted = index < etapaAtual;

                return (
                    <div key={index} className="step-container">
                <div className={`circle 
                    ${isActive ? "active" : ""}
                    ${isCompleted ? "completed" : ""}`}
                    aria-current={isActive ? "step" : undefined}>
                    {index + 1}
                </div> 
                <span 
                className={`etapa-label 
                ${isActive ? "active" : ""}
                ${isCompleted ? "completed" : ""}`
            }
            title={etapa}
                
        >
                    {etapa}
                </span>
            </div>
        );
    })}
               
    </div>
    );
}

export default ProgressBar;