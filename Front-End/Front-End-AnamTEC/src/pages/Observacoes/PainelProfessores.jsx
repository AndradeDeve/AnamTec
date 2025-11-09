import React from 'react';
import { Form } from 'react-bootstrap';

export default function PainelProfessores({
    todosCursos, cursoFiltro, setCursoFiltro, 
    professoresFiltrados, professorSelecionado, setProfessorSelecionado
}) {
    return (
        <div className="painel-esquerdo">
            <h5>Professores</h5>
            <Form.Group className="mb-3">
                <Form.Select aria-label="Selecionar curso" value={cursoFiltro}
                             onChange={(e) => setCursoFiltro(e.target.value)}
                >
                    {todosCursos.map((curso, index) => (
                        <option key={index} value={curso}>
                            {curso}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>
            
            <div className="lista-professores-cards">
                {professoresFiltrados.map((prof) => (
                    <div key={prof.id_professor} 
                        className={`professor-card ${professorSelecionado?.id_professor === prof.id_professor ? 'selecionado' : ''}`}
                        onClick={() => setProfessorSelecionado(prof)}
                    >
                        {prof.nome_professor}
                    </div>
                ))}
            </div>
        </div>
    );
}