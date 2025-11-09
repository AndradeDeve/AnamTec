import React from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { Send } from 'react-feather';

// Subcomponente: Comentário e Respostas
const ComentarioItem = ({ 
    comentario, index, respostasTemp, respostasVisiveis,
    alternarRespostas, setRespostasTemp, handleRespostaEnterPress, adicionarResposta
}) => {
    return (
        <div key={index} className="comentario">
            <p className="texto">{comentario.texto} </p>
            <span className="autor">
                {comentario.autor} ({comentario.data})
            </span>

            {comentario.respostas.length > 0 && ( 
                <Button variant="link" className="toggle-respostas"
                    onClick={() => alternarRespostas(index)}
                >
                    {respostasVisiveis[index] ? "Ocultar respostas" : `Ver respostas (${comentario.respostas.length})`}
                </Button>
            )}

            {respostasVisiveis[index] &&
                comentario.respostas.map((resposta, i) => ( 
                    <div key={i} className="resposta">
                        <p className="texto">{resposta.texto}</p>
                        <span className="autor">
                            {resposta.autor} ({resposta.data})
                        </span>
                    </div>
            ))} 

            <InputGroup className="mt-2">
                <Form.Control type="text"
                    placeholder="Responder a este comentário..."
                    value={respostasTemp[index] || ""} 
                    onChange={(e) => setRespostasTemp(prev => ({ ...prev, [index]: e.target.value }))}
                    onKeyDown={(e) => handleRespostaEnterPress(e, index)}
                />
                <Button variant="secondary" onClick={() => adicionarResposta(index)}>
                    Responder
                </Button>
            </InputGroup>
        </div>
    );
};


export default function ConteudoCentral({
    professorSelecionado, comentariosAtuais, novoComentario, 
    setNovoComentario, adicionarComentario, handleEnterPress,
    respostasTemp, setRespostasTemp, respostasVisiveis, 
    alternarRespostas, handleRespostaEnterPress, adicionarResposta
}) {
    if (!professorSelecionado) {
        return (
            <div className="conteudo-central">
                <div className="mensagem-central">
                    <p>Selecione um curso no painel lateral, e depois um professor para visualizar e adicionar observações.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="conteudo-central">
            <>
            <div className="comentarios-scroll">
                <h4>Observações de {professorSelecionado.nome_professor || professorSelecionado.nome}</h4>

                {comentariosAtuais.map((comentario, index) => (
                    <ComentarioItem
                        key={index}
                        comentario={comentario}
                        index={index}
                        respostasTemp={respostasTemp}
                        respostasVisiveis={respostasVisiveis}
                        alternarRespostas={alternarRespostas}
                        setRespostasTemp={setRespostasTemp}
                        handleRespostaEnterPress={handleRespostaEnterPress}
                        adicionarResposta={adicionarResposta}
                    />
                ))}
                
                {comentariosAtuais.length === 0 && (
                    <p className="text-center">Ainda não há observações para {professorSelecionado.nome_professor || professorSelecionado.nome}.</p>
                )}
            </div>

            <InputGroup className="mt-3 input-comentario-principal-container">
                <Form.Control type="text" id="input-comentario-principal" 
                    placeholder={`Comentário para ${professorSelecionado.nome_professor || professorSelecionado.nome}...`}
                    value={novoComentario}
                    onChange={(e) => setNovoComentario(e.target.value)}
                    onKeyDown={handleEnterPress} 
                />
                <Button variant="primary" onClick={adicionarComentario}>
                    <Send size={20} />
                </Button>
            </InputGroup>
            </>
        </div>
    );
}