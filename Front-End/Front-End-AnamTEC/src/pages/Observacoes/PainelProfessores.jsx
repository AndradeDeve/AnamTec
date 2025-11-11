import React, { useState, useEffect } from 'react'; 
import { Form, Button, InputGroup } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { getFunctonCurso, getFunctonCursoProfessor } from '../../services/APIService';

import { Send } from 'react-feather'; 
import './UserObservation.css';
import Header from "../components/Header/Header"; 
import { toast } from 'react-toastify';


const cursos = [
  "Desenvolvimento de Sistemas",
  "Redes de Computadores",
  "Administração"
];

// Comentários MOCK (Tarefa 3) - Map by Professor ID
const mockComentariosPorProfessor = {
    2: [ // Comentários para Marcos Costa (ID 2)
        {
            autor: "Marcos Costa",
            texto: "Aluno com boa presença e participa bem das atividades.",
            data: "20/09/2023",
            respostas: [{ autor: "Professor Atual", texto: "Contudo, precisamos observar mais nas aulas práticas.", data: "20/09/2023" }]
        }
    ],
    1: [ // Comentários para Lúcie Épité (ID 1)
        { autor: "Lúcie Épité", texto: "Excelente desenvolvimento em lógica de programação.", data: "10/10/2023", respostas: [] }
    ],
};
// ==============================================
// FIM DADOS
// ==============================================

export default function TelaObservacoes() {

    const location = useLocation();
    const aluno = location.state?.aluno;
    
    const [todosCursos, setTodosCursos] = useState([]);
    const [todosProfessores, setTodosProfessores] = useState([])
    const [cursoFiltro, setCursoFiltro] = useState("Todos");
    const [professoresFiltrados, setProfessoresFiltrados] = useState([todosProfessores]);
    const [professorSelecionado, setProfessorSelecionado] = useState(null); 
    
    const [comentariosPorProfessor, setComentariosPorProfessor] = useState(mockComentariosPorProfessor);
    
    const comentariosAtuais = professorSelecionado ? (comentariosPorProfessor[professorSelecionado.id] || []) : [];

    const [novoComentario, setNovoComentario] = useState("");
    const [respostasTemp, setRespostasTemp] = useState({});
    const [respostasVisiveis, setRespostasVisiveis] = useState({});

    // Lógica de filtragem de professores
// 1. Buscar cursos e professores ao montar o componente
useEffect(() => {
    const fetchCursos = async () => {
        try {
            const professores = await getFunctonCursoProfessor();
            console.log("professores:", professores.data)
            if(professores.status === 200){
                setTodosProfessores(professores.data);
            }

            const cursos = await getFunctonCurso();
            if(cursos.status === 200){
                setTodosCursos(cursos.data);
            }
        } catch (error) {
            console.error("Erro ao buscar cursos:", error);
        }
    }

    fetchCursos();
}, []);

// 2. Filtrar professores sempre que mudar cursoFiltro ou todosProfessores
useEffect(() => {
    let filtrados = todosProfessores;

    if (cursoFiltro !== "Todos") {
        filtrados = todosProfessores.filter(
            (p) => p.nome_curso === cursoFiltro
        );
    }

    setProfessoresFiltrados(filtrados);
    setProfessorSelecionado(null);
}, [cursoFiltro, todosProfessores]);



    // Adiciona novo comentário (TAREFA 2: Duplicação resolvida garantindo um único ponto de chamada)
    const adicionarComentario = () => {
        if (!novoComentario.trim() || !professorSelecionado) return;

        const novo = {
            autor: "Professor Atual",
            texto: novoComentario,
            data: new Date().toLocaleDateString("pt-BR"),
            respostas: []
        };

        const professorId = professorSelecionado.id;
        
        // Atualiza o mapa de comentários (imutabilidade)
        setComentariosPorProfessor(prev => ({
            ...prev,
            [professorId]: [...(prev[professorId] || []), novo]
        }));
        setNovoComentario("");
    };

    const handleEnterPress = (e) => {
        // Envia apenas se for a tecla Enter e se for o input principal
        if (e.key === 'Enter' && e.target.id === 'input-comentario-principal') {
            e.preventDefault(); 
            adicionarComentario();
        }
    };

    // Adiciona resposta a comentário específico
    const adicionarResposta = (index) => {
        const textoResposta = respostasTemp[index];
        if (!textoResposta || !textoResposta.trim() || !professorSelecionado) return;

        const novaResposta = {
            autor: "Professor Atual",
            texto: textoResposta,
            data: new Date().toLocaleDateString("pt-BR")
        };
        
        setComentariosPorProfessor(prev => {
            const professorId = professorSelecionado.id;

        // Clona os comentários do professor
        const comentariosDoProfessor = prev[professorId]
            ? prev[professorId].map(c => ({ ...c, respostas: [...c.respostas] }))
            : [];

        // Adiciona a nova resposta de forma imutável
        comentariosDoProfessor[index].respostas = [
            ...comentariosDoProfessor[index].respostas,
            novaResposta
        ];

        return {
            ...prev,
            [professorId]: comentariosDoProfessor
        };
    });

    setRespostasTemp(prev => ({ ...prev, [index]: "" }));
  };

    // Enviar com ENTER no Input de Resposta (TAREFA 3: Nova Lógica)
    const handleRespostaEnterPress = (e, index) => {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            adicionarResposta(index);
        }
    };

    // Alterna visibilidade das respostas
    const alternarRespostas = (index) => {
        setRespostasVisiveis((prev) => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    return (
        <>
            <Header />
            <div className="tela-observacoes">
                
                {/* Painel de professores */}
                <div className="painel-esquerdo">
                    <h5>Professores</h5>

                    {/* Filtro por Curso (TAREFA 4: O estilo CSS garantirá a largura total) */}
                    <Form.Group className="mb-3">
                        <Form.Select 
                            aria-label="Selecionar curso"
                            value={cursoFiltro}
                            onChange={(e) => setCursoFiltro(e.target.value)}
                        >
                            <option value="Todos">Todos os Cursos</option>
                            {todosCursos.map((curso) => (
                                <option key={curso.id} value={curso.curso}>
                                    {curso.curso}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    
                    {/* Lista de professores filtrados - Cards */}
                    {cursoFiltro !== "Todos" && (
                        <div className="lista-professores-cards">
                            {professoresFiltrados.map((prof) => (
                                <div 
                                    key={prof.id_professor} 
                                    className={`professor-card ${professorSelecionado?.id_professor === prof.id_professor ? 'selecionado' : ''}`}
                                    onClick={() => setProfessorSelecionado(prof)}
                                    value={prof.nome_professor}
                                >
                                    {prof.nome_professor}
                                </div>
                            ))}
                        </div>
                    )}
                
                </div> 

                {/* Área central com rolagem */}
                <div className="conteudo-central">
                    {professorSelecionado ? (
                        <>
                            <div className="comentarios-scroll">
                                <h4>Observações de {professorSelecionado.nome}</h4>

                                {/* Lista de comentários */}
                                {comentariosAtuais.map((comentario, index) => (
                                    <div key={index} className="comentario">
                                        <p className="texto">{comentario.texto}</p>
                                        <span className="autor">{comentario.autor} ({comentario.data})</span>

                                        {/* Botão para mostrar/ocultar respostas */}
                                        {comentario.respostas.length > 0 && ( 
                                            <Button
                                                variant="link"
                                                className="toggle-respostas"
                                                onClick={() => alternarRespostas(index)}
                                            >
                                                {respostasVisiveis[index] ? "Ocultar respostas" : `Ver respostas (${comentario.respostas.length})`}
                                            </Button>
                                        )}

                                        {/* Respostas visíveis */}
                                        {respostasVisiveis[index] &&
                                            comentario.respostas.map((resposta, i) => ( 
                                                <div key={i} className="resposta">
                                                    <p className="texto">{resposta.texto}</p>
                                                    <span className="autor">{resposta.autor} ({resposta.data})</span>
                                                </div>
                                            ))} 

                                        
                                        <InputGroup className="mt-2">
                                            <Form.Control
                                                type="text"
                                                placeholder="Responder a este comentário..."
                                                value={respostasTemp[index] || ""} 
                                                onChange={(e) =>
                                                    setRespostasTemp({ ...respostasTemp, [index]: e.target.value })
                                                }
                                                onKeyDown={(e) => handleRespostaEnterPress(e, index)}
                                            />
                                            <Button variant="secondary" onClick={() => adicionarResposta(index)}>
                                                Responder
                                            </Button>
                                        </InputGroup>
                                    </div>
                                ))}
                                {/* Mensagem quando não há comentários */}
                                {comentariosAtuais.length === 0 && (
                                    <p className="text-center">Ainda não há observações para {professorSelecionado.nome}.</p>
                                )}
                            </div>

                            {/* Input principal (TAREFA 1: Largura total garantida pelo CSS) */}
                            <InputGroup className="mt-3 input-comentario-principal-container">
                                <Form.Control
                                    type="text"
                                    id="input-comentario-principal" 
                                    placeholder={`Comentário para ${professorSelecionado.nome}...`}
                                    value={novoComentario}
                                    onChange={(e) => setNovoComentario(e.target.value)}
                                    onKeyDown={handleEnterPress} 
                                />
                                <Button variant="primary" onClick={adicionarComentario}>
                                    <Send size={20} />
                                </Button>
                            </InputGroup>
                        </>
                    ) : (
                        <div className="mensagem-central">
                            <p>Selecione um curso no painel lateral, e depois um professor para visualizar e adicionar observações.</p>
                        </div>
                    )}
                </div>

                {/* Painel de dados do aluno */}
                <div className="painel-direito">
                    <h5>Dados do Aluno</h5>
                    <p><strong>Nome:</strong> {aluno.nome_aluno}</p>
                    <p><strong>RM:</strong> {aluno.rm}</p>
                    <hr/>
                    <p><strong>Curso:</strong> {aluno.nome_curso}</p>
                    <p><strong>Turma:</strong> {aluno.semestre}</p>
                    <p><strong>Turno:</strong> {aluno.turno}</p>
                    <p><strong>Nascimento:</strong> {new Date(aluno.dataNascimento).toLocaleDateString("pt-BR")}</p>
                    <hr/>
                    <a href={aluno.anamneseLink} target="_blank" rel="noopener noreferrer">
                        Acessar Anamnese
                    </a>
                </div>
            </div>
        </>
    );
}