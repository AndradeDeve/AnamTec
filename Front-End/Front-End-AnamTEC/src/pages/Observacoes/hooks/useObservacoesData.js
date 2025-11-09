import { useState, useEffect, useCallback, useMemo } from 'react'; 
import { getFunctonCurso, getFunctonCursoProfessor } from '../services/APIService';
import { showToast } from '../Utils/toast'; 
import { useLocation } from 'react-router-dom';

const MOCK_COMENTARIOS = {
 
};
export const useObservacoesData = () => {
    const location = useLocation();
    // O hook extrai os dados do aluno do location (aluno é imutável) 
    const aluno = location.state?.aluno || {}; 

    // Estados Movidos para o Hook 
    const [todosCursos, setTodosCursos] = useState([]);
    const [todosProfessores, setTodosProfessores] = useState([])
    const [cursoFiltro, setCursoFiltro] = useState("Todos");
    const [professoresFiltrados, setProfessoresFiltrados] = useState([]); // Inicializa vazio
    const [professorSelecionado, setProfessorSelecionado] = useState(null); 
    
    // Comentários e Interação
    const [comentariosPorProfessor, setComentariosPorProfessor] = useState(MOCK_COMENTARIOS); // Usando MOCK
    const [novoComentario, setNovoComentario] = useState("");
    const [respostasTemp, setRespostasTemp] = useState({});
    const [respostasVisiveis, setRespostasVisiveis] = useState({});

    // 1. Fetch de Dados e Efeitos (Side Effects)
    useEffect(() => {
        const fetchDadosIniciais = async () => {
            try {
                // Fetch de Professores
                const professores = await getFunctonCursoProfessor();
                if(professores.status === 200){
                    setTodosProfessores(professores.data);
                } else {
                    console.error("Erro ao buscar professores.");
                }

                // Fetch de Cursos
                const cursos = await getFunctonCurso();
                if(cursos.status === 200){
                    // Mapeia a resposta para uma lista simples de cursos
                    setTodosCursos(cursos.data.map(c => c.curso) || []); // Ajustado para simplificar
                } else {
                     console.error("Erro ao buscar cursos.");
                }
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
                showToast("error", "Erro ao carregar dados de cursos e professores.");
            }
        }
        fetchDadosIniciais();
    }, []);

    // 2. Efeito de Filtragem de Professores 
    useEffect(() => {
        let filtrados = todosProfessores;

        if (cursoFiltro !== "Todos") {
            filtrados = todosProfessores.filter(
                (p) => p.nome_curso === cursoFiltro
            );
        }

        // Garante que o professor selecionado ainda está na lista, senão limpa
        const selecionadoAindaExiste = filtrados.some(p => 
            p.id_professor === professorSelecionado?.id_professor
        );
        
        setProfessoresFiltrados(filtrados);
        if (!selecionadoAindaExiste) {
            setProfessorSelecionado(null);
        }
    }, [cursoFiltro, todosProfessores]);

    // 3. Funções de Manipulação de Comentários (Handlers)
    // Dado Derivado: Comentários Atuais (useMemo para performance) 
    const comentariosAtuais = useMemo(() => {
        if (!professorSelecionado) return [];
        // Usa id_professor, que é o campo correto da API
        return comentariosPorProfessor[professorSelecionado.id_professor] || []; 
    }, [professorSelecionado, comentariosPorProfessor]);

    // Adiciona novo comentário 
    const adicionarComentario = useCallback(() => {
        if (!novoComentario.trim() || !professorSelecionado) {
             showToast("warn", "Selecione um professor e insira um texto.");
             return;
        }

        const novo = {
            autor: "Professor Atual",
            texto: novoComentario,
            data: new Date().toLocaleDateString("pt-BR"),
            respostas: []
        };
        const professorId = professorSelecionado.id_professor;
        
        setComentariosPorProfessor(prev => ({
            ...prev,
            [professorId]: [...(prev[professorId] || []), novo]
        }));
        setNovoComentario("");
        showToast("success", "Observação adicionada!");
    }, [novoComentario, professorSelecionado]);

    // Adiciona resposta a comentário específico 
    const adicionarResposta = useCallback((index) => {
        const textoResposta = respostasTemp[index];
        if (!textoResposta || !textoResposta.trim() || !professorSelecionado) return;

        const novaResposta = {
            autor: "Professor Atual",
            texto: textoResposta,
            data: new Date().toLocaleDateString("pt-BR")
        };
        
        setComentariosPorProfessor(prev => {
            const professorId = professorSelecionado.id_professor;

            // Lógica de imutabilidade garantida
            const comentariosDoProfessor = prev[professorId]
                ? prev[professorId].map(c => ({ ...c, respostas: [...c.respostas] }))
                : [];

            if (comentariosDoProfessor[index]) {
                comentariosDoProfessor[index].respostas = [
                    ...comentariosDoProfessor[index].respostas,
                    novaResposta
                ];
            } else {
                console.error("Índice de comentário inválido.");
                return prev;
            }

            return {
                ...prev,
                [professorId]: comentariosDoProfessor
            };
        });
        setRespostasTemp(prev => ({ ...prev, [index]: "" }));
        showToast("success", "Resposta adicionada!");
    }, [respostasTemp, professorSelecionado]);


    // Handlers de Input e Eventos (Simplificados)
    const handleEnterPress = (e) => { 
        if (e.key === 'Enter') {
            e.preventDefault();
            adicionarComentario();
        }
    };

    const handleRespostaEnterPress = (e, index) => { 
        if (e.key === 'Enter') {
            e.preventDefault();
            adicionarResposta(index);
        }
    };
    
    const alternarRespostas = (index) => { 
        setRespostasVisiveis((prev) => ({
            ...prev,
            [index]: !prev[index]
        }));
    };
    
    return {
        // Dados Imutáveis
        aluno, 
        todosCursos: ["Todos", ...todosCursos], // Adiciona "Todos" para o filtro
        // Estados e Setters
        cursoFiltro, setCursoFiltro,
        professoresFiltrados,
        professorSelecionado, setProfessorSelecionado,
        comentariosAtuais,
        novoComentario, setNovoComentario,
        respostasTemp, setRespostasTemp,
        respostasVisiveis,
        // Handlers e Ações
        adicionarComentario,
        adicionarResposta,
        handleEnterPress,
        handleRespostaEnterPress,
        alternarRespostas,
    };
};