import React, { useState, useEffect } from 'react'; 
import { Form, Button, InputGroup } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { getFunctonCurso, getFunctonCursoProfessor, getFunctionComentarios, postFunctionComentario,
        deleteFunctionComentario, postRespostaComentario, deleteFunctionResposta
 } from '../../services/APIService';
import { getUser } from '../../helpers/auth';

import { Send } from 'react-feather'; 
import './UserObservation.css';
import Header from "../components/Header/Header"; 
import { toast } from 'react-toastify';



// Dados do Aluno com novos campos (Tarefa 1)
// const aluno = { 
//   nome: "Weslley Samuel Novaes Santana",
//   rm: "202300215",
//   curso: "Desenvolvimento de Sistemas",
//   dataNascimento: "15/05/2006",
//   turma: "3º A",
//   turno: "Vespertino",
//   anamneseLink: "#link-para-anamnese" // Link de exemplo
// };

// Lista completa de professores com IDs e Cursos
// const todosProfessores = [
//   { id: 1, nome: "Lúcie Épité", curso: "Desenvolvimento de Sistemas" },
//   { id: 2, nome: "Marcos Costa", curso: "Desenvolvimento de Sistemas" },
//   { id: 3, nome: "Marcos Nogueira", curso: "Desenvolvimento de Sistemas" },
//   { id: 4, nome: "Emerson Silva", curso: "Desenvolvimento de Sistemas" },
//   { id: 5, nome: "Aline Francisca", curso: "Desenvolvimento de Sistemas" },
//   { id: 6, nome: "Beatriz Almeida", curso: "Desenvolvimento de Sistemas" },
//   { id: 7, nome: "Carlos Eduardo", curso: "Desenvolvimento de Sistemas" },
//   { id: 8, nome: "Daniela Rocha", curso: "Desenvolvimento de Sistemas" },
//   { id: 9, nome: "Fábio Guedes", curso: "Redes de Computadores" },
//   { id: 10, nome: "Helena Matos", curso: "Redes de Computadores" },
//   { id: 11, nome: "Igor Valente", curso: "Redes de Computadores" },
//   { id: 12, nome: "Juliana Paes", curso: "Redes de Computadores" },
//   { id: 13, nome: "Lucas Mendes", curso: "Redes de Computadores" },
//   { id: 14, nome: "Natália Oliveira", curso: "Redes de Computadores" },
//   { id: 15, nome: "Otávio Bernardes", curso: "Administração" },
//   { id: 16, nome: "Patrícia Lins", curso: "Administração" },
//   { id: 17, nome: "Ricardo Jorge", curso: "Administração" },
//   { id: 18, nome: "Simone Tavares", curso: "Administração" },
//   { id: 19, nome: "Tiago Leifert", curso: "Administração" },
//   { id: 20, nome: "Vanessa Dias", curso: "Administração" },
//   { id: 21, nome: "Wagner Moura", curso: "Administração" },
//   { id: 22, nome: "Zilda Arns", curso: "Administração" },
//   { id: 23, nome: "Bruno Gagliasso", curso: "Redes de Computadores" },
//   { id: 24, nome: "Caio Castro", curso: "Desenvolvimento de Sistemas" },
//   { id: 25, nome: "Débora Secco", curso: "Administração" }
// ];

// Comentários MOCK (Tarefa 3) - Map by Professor ID
// ==============================================
// FIM DADOS
// ==============================================

export default function TelaObservacoes() {

    const location = useLocation();
    const aluno = location.state?.aluno;
    
    const [todosCursos, setTodosCursos] = useState([]);
    const [todosProfessores, setTodosProfessores] = useState([])
    const [cursoFiltro, setCursoFiltro] = useState("Todos");
    const [professoresFiltrados, setProfessoresFiltrados] = useState([]);
    const [professorSelecionado, setProfessorSelecionado] = useState(null); 
    const [professorAtual, setProfessorAtual] = useState(null);

    const [comentariosPorProfessor, setComentariosPorProfessor] = useState([]);

    
    const comentariosAtuais = professorSelecionado && aluno
    ? (
        Array.isArray(comentariosPorProfessor)
            ? comentariosPorProfessor.filter(c =>
                c.id_professor === professorSelecionado.id_professor &&
                c.id_aluno === aluno.id
            )
            : (comentariosPorProfessor[professorSelecionado.id_professor] || [])
                .filter(c => c.id_aluno === aluno.id || [])
    )
    : [];


    const [novoComentario, setNovoComentario] = useState("");
    const [respostasTemp, setRespostasTemp] = useState({});
    const [respostasVisiveis, setRespostasVisiveis] = useState({});

    // Lógica de filtragem de professores
// 1. Buscar cursos e professores ao montar o componente
    useEffect(() => {
        const fetchCursos = async () => {
            try {
                const user = getUser();
                const comentariosResponse = await getFunctionComentarios();

                if (comentariosResponse && comentariosResponse.status === 200) {
                    // armazena array bruto; a variável `comentariosAtuais` faz o filtro por professor
                    setComentariosPorProfessor(comentariosResponse.data || []);
                }

                const professores = await getFunctonCursoProfessor();
                if(professores.status === 200){
                    setTodosProfessores(professores.data);
                    setProfessorAtual(user)
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
    }, [novoComentario]);

    const comentariosDoProfessorLogado = comentariosPorProfessor.filter(
        (comentario) => 
            comentario.id_professor === professorAtual?.id &&
            comentario.id_aluno === aluno.id
    );


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

    

    // Adiciona novo comentário (envia ao backend e atualiza estado)
    const adicionarComentario = async () => {
        if (!novoComentario.trim() ) return;

        const payload = {
            id_professor: professorAtual?.id,
            id_aluno: aluno?.id || aluno?.id_aluno || aluno?.id_aluno_fk || null,
            texto: novoComentario
        };
        try {
            const resp = await postFunctionComentario(payload);
            // Se backend retornar o comentário criado, use ele; senão constrói localmente
            const created = resp && resp.data ? resp.data : null;

            const comentarioParaInserir = created
                ? {
                    ...created,
                    // normaliza nomes para UI
                    texto: created.texto || created.comentario || created.body || novoComentario,
                    autor: created.autor || created.nome_autor || professorAtual?.user || professorAtual?.nome || 'Você',
                    data: created.data_criacao || created.data || created.created_at || new Date().toLocaleDateString('pt-BR'),
                    respostas: created.respostas || []
                }
                : {
                    autor: professorAtual?.user || professorAtual?.nome || 'Você',
                    texto: novoComentario,
                    data: new Date().toLocaleDateString('pt-BR'),
                    respostas: []
                };

            // atualiza estado: suporta ambos formatos (array ou mapa)
            setComentariosPorProfessor(prev => {
                if (Array.isArray(prev)) {
                    return [...prev, { id_professor: professorAtual?.id, ...comentarioParaInserir }];
                }

                // se for um mapa por id
                const professorId = professorSelecionado.id_professor;
                return {
                    ...prev,
                    [professorId]: [...(prev[professorId] || []), comentarioParaInserir]
                };
            });

            setNovoComentario("");
            toast.success('Comentário enviado.');
        } catch (error) {
            console.error('Erro ao postar comentário:', error);
            toast.error('Não foi possível enviar o comentário.');
        }
    };

    const handleEnterPress = (e) => {
        // Envia apenas se for a tecla Enter e se for o input principal
        if (e.key === 'Enter' && e.target.id === 'input-comentario-principal') {
            e.preventDefault(); 
            adicionarComentario(novoComentario);
        }
    };

    // Adiciona resposta a comentário específico
    const adicionarResposta = async (index, id_comentario) => {
        const textoResposta = respostasTemp[index];
        if (!textoResposta || !textoResposta.trim()) return;
        const novaResposta = {
            id_autor: professorAtual?.id || 'Você',
            autor: professorAtual?.user || 'Você',
            id_comentario: id_comentario || null,
            texto: textoResposta,
            data: new Date().toLocaleDateString("pt-BR")
        };

        try{
            const resp = await postRespostaComentario(novaResposta)

            const created = resp && resp.data ? resp.data : null;

            // Construir o objeto de resposta que será inserido no estado, garantindo o campo `id`
            const respostaInserir = created
                ? {
                    id: created.id_resposta || created.id || created.insertId,
                    id_autor: novaResposta.id_autor,
                    autor: novaResposta.autor,
                    id_comentario: id_comentario,
                    texto: created.texto || created.comentario || created.body || textoResposta,
                    data_criacao: created.data_criacao || created.data || created.created_at || new Date().toLocaleDateString('pt-BR')
                }
                : {
                    id: Date.now(), // fallback temporário
                    id_autor: novaResposta.id_autor,
                    autor: novaResposta.autor,
                    id_comentario: id_comentario,
                    texto: textoResposta,
                    data_criacao: new Date().toLocaleDateString('pt-BR')
                };


            setComentariosPorProfessor(prev => {
                if (Array.isArray(prev)) {
                    return prev.map(c => {
                        if (c.id === id_comentario) {
                            const respostas = Array.isArray(c.respostas) ? c.respostas : [];
                            return { ...c, respostas: [...respostas, respostaInserir] };
                        }
                        return c;
                    });
                }

                // Caso seja um mapa por professores
                const professorId = professorSelecionado?.id_professor || professorAtual?.id;
                return {
                    ...prev,
                    [professorId]: (prev[professorId] || []).map(c => {
                        if (c.id === id_comentario) {
                            const respostas = Array.isArray(c.respostas) ? c.respostas : [];
                            return { ...c, respostas: [...respostas, respostaInserir] };
                        }
                        return c;
                    })
                };
            });

            setRespostasTemp(prev => ({ ...prev, [index]: "" }));
        } catch(error){
            console.error('Erro ao adicionar resposta:', error, error?.response?.data);
            toast.error('Não foi possível enviar a resposta.');
        }
  };

    // Enviar com ENTER no Input de Resposta (TAREFA 3: Nova Lógica)
    const handleRespostaEnterPress = (e, index) => {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            // colocar a função aquiiiiiiiiiiiii
        }
    };

    const excluirComentario = async (idComentario) => {
        try {
            const resp = await deleteFunctionComentario(idComentario);
            if(resp.status === 200){
                setComentariosPorProfessor(prev => {
                    if (Array.isArray(prev)) {
                        return prev.filter(c => c.id !== idComentario);
                    }

                    // Caso seja mapa por professor
                    const professorId = professorSelecionado?.id_professor || professorAtual?.id;
                    if (!professorId) return prev;

                    const comentariosDoProfessor = Array.isArray(prev[professorId]) ? prev[professorId].filter(c => c.id !== idComentario) : [];
                    return {
                        ...prev,
                        [professorId]: comentariosDoProfessor
                    };
                });
                toast.success('Comentário deletado com sucesso.');
            }
        } catch (error) {
            console.error('Erro ao deletar comentário:', error);
            toast.error('Não foi possível deletar o comentário.');
        }
    }

    const excluirResposta = async (idResposta, idComentario) => {
        try {
            const idNum = Number(idResposta);
            if (!idNum || isNaN(idNum)) {
                toast.error('ID da resposta inválido (frontend).');
                return;
            }

            const resp = await deleteFunctionResposta(idNum);

            if (resp && resp.status === 200) {
                setComentariosPorProfessor(prev => {
                    if (Array.isArray(prev)) {
                        return prev.map(comentario => {
                            if (comentario.id === idComentario) {
                                return {
                                    ...comentario,
                                    respostas: (comentario.respostas || []).filter(r => r.id !== idNum)
                                };
                            }
                            return comentario;
                        });
                    }

                    // Caso seja estrutura em MAP (por professor)
                    const professorId = professorSelecionado?.id_professor || professorAtual?.id;
                    if (!professorId) return prev;

                    return {
                        ...prev,
                        [professorId]: (prev[professorId] || []).map(comentario => {
                            if (comentario.id === idComentario) {
                                return {
                                    ...comentario,
                                    respostas: (comentario.respostas || []).filter(r => r.id !== idNum)
                                };
                            }
                            return comentario;
                        })
                    };
                });

                toast.success('Resposta deletada.');
            } else {
                const errMsg = resp?.data?.err || 'Falha ao deletar resposta';
                console.warn('Falha ao deletar resposta:', resp && resp.data);
                toast.error(errMsg);
            }
        } catch (error) {
            console.error('Erro ao deletar resposta:', error, error?.response?.data);
            const serverMsg = error?.response?.data?.err || error.message;
            toast.error(`Não foi possível deletar a resposta: ${serverMsg}`);
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
                                <h4>Observações de {professorSelecionado.nome_professor}</h4>

                                {/* Lista de comentários */}
                                {comentariosAtuais.map((comentario, index) => (
                                    <div key={index} className="comentario">
                                        <p className="texto">{comentario.texto}</p>
                                        <span className="autor">{comentario.autor || professorSelecionado?.nome_professor || comentario.id_professor} ({comentario.data || comentario.data_criacao || comentario.created_at || '-'})</span>

                                        {/* Botão para mostrar/ocultar respostas */}
                                        {(comentario.respostas && comentario.respostas.length > 0) && ( 
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
                                                    <span className="autor">{resposta.autor} ({resposta.data_criacao})</span>

                                                    {/* Só mostra o botão se foi o professor que escreveu */}
                                                    {resposta.id_autor === professorAtual?.id && (
                                                        <button
                                                            className="botao-deletar-resposta"
                                                            onClick={() => excluirResposta(resposta.id, comentario.id)}
                                                        >
                                                            <img src="https://img.icons8.com/?size=100&id=99971&format=png&color=000000" />
                                                        </button>
                                                    )}
                                                </div>
                                            ))
                                        }


                                        
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
                                            <Button variant="secondary" onClick={() => adicionarResposta(index, comentario?.id)}>
                                                Responder
                                            </Button>
                                        </InputGroup>
                                    </div>
                                ))}
                                {/* Mensagem quando não há comentários */}
                                {comentariosAtuais.length === 0 && (
                                    <p className="text-center">Ainda não há observações para {professorSelecionado.nome_professor}.</p>
                                )}
                            </div>

                        </>
                    ) : (
                        <>
                            {comentariosDoProfessorLogado.length > 0 ? (
                                    <div className="comentarios-scroll">
                                        <h4>Seus comentários</h4>
                                        {comentariosDoProfessorLogado.map((comentario, index) => (
                                            <div key={index} className="comentario">
                                                <p><strong>Você:</strong></p>
                                                <button className="botao-deletar" onClick={() => excluirComentario(comentario?.id)}>
                                                    <img src="https://img.icons8.com/?size=100&id=99971&format=png&color=000000" alt="Deletar comentário" />
                                                </button>
                                                <p>{comentario?.texto}</p>
                                                <p><strong>Data:</strong> {comentario?.data_criacao}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="mensagem-central">
                                        <p>Você ainda não fez comentários para este aluno.</p>
                                    </div>
                            )}

                             <div>
                                 {/* Input principal (TAREFA 1: Largura total garantida pelo CSS) */}
                            <InputGroup className="mt-3 input-comentario-principal-container">
                                <Form.Control
                                    type="text"
                                    id="input-comentario-principal" 
                                    placeholder={`Comentário para ${aluno?.nome_aluno}...`}
                                    value={novoComentario}
                                    onChange={(e) => setNovoComentario(e.target.value)}
                                    onKeyDown={handleEnterPress} 
                                />
                                <Button variant="primary" onClick={adicionarComentario}>
                                    <Send size={20} />
                                </Button>
                            </InputGroup>
                            </div>
                        </>
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