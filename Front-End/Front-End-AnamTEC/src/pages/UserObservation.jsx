import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import './UserObservation.css'; // Estilos personalizados
import Header from "./components/Header/Header"; 

export default function TelaObservacoes() {
  // Lista de professores
  const professores = [
    "Lúcie Épité",
    "Marcos Costa",
    "Marcos Nogueira",
    "Emerson Silva",
    "Aline Francisca"
  ];

  // Dados do aluno atual
  const aluno = {
    nome: "Welisely Samuel Novaes Santana",
    rm: "202300215"
  };

  // Comentários principais com respostas
  const [comentarios, setComentarios] = useState([
    {
      autor: "Marcos Costa",
      texto: "Aluno com boa presença e participa bem das atividades.",
      data: "20/09/2023",
      respostas: [
        {
          autor: "Professor Atual",
          texto: "Contudo, precisamos observar mais nas aulas práticas.",
          data: "20/09/2023"
        }
      ]
    }
  ]);

  // Novo comentário principal
  const [novoComentario, setNovoComentario] = useState("");

  // Respostas temporárias por índice
  const [respostasTemp, setRespostasTemp] = useState({});

  // Visibilidade das respostas por comentário
  const [respostasVisiveis, setRespostasVisiveis] = useState({});

  // Adiciona novo comentário principal
  const adicionarComentario = () => {
    if (!novoComentario.trim()) return;

    const novo = {
      autor: "Professor Atual",
      texto: novoComentario,
      data: new Date().toLocaleDateString("pt-BR"),
      respostas: []
    };

    setComentarios([...comentarios, novo]);
    setNovoComentario("");
  };

  // Adiciona resposta a comentário específico
  const adicionarResposta = (index) => {
    const textoResposta = respostasTemp[index];
    if (!textoResposta || !textoResposta.trim()) return;

    const novaResposta = {
      autor: "Professor Atual",
      texto: textoResposta,
      data: new Date().toLocaleDateString("pt-BR")
    };

    const atualizados = [...comentarios];
    atualizados[index].respostas.push(novaResposta);
    setComentarios(atualizados);
    setRespostasTemp({ ...respostasTemp, [index]: "" });
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
        <ul>
          {professores.map((nome, i) => (
            <li key={i}>{nome}</li>
          ))}
        </ul>
      </div>

      {/* Área central com rolagem */}
      <div className="conteudo-central">
        <div className="comentarios-scroll">
          <h4>Observações dos Professores</h4>

          {/* Campo para novo comentário */}
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Escreva uma nova observação..."
              value={novoComentario}
              onChange={(e) => setNovoComentario(e.target.value)}
            />
            <Button variant="primary" className="mt-2" onClick={adicionarComentario}>
              Adicionar Comentário
            </Button>
          </Form.Group>

          {/* Lista de comentários */}
          {comentarios.map((comentario, index) => (
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
                  {respostasVisiveis[index]
                    ? "Ocultar respostas"
                    : `Ver respostas (${comentario.respostas.length})`}
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

              {/* Campo para nova resposta */}
              <Form.Group className="mt-2">
                <Form.Control
                  type="text"
                  placeholder="Responder a este comentário..."
                  value={respostasTemp[index] || ""}
                  onChange={(e) =>
                    setRespostasTemp({ ...respostasTemp, [index]: e.target.value })
                  }
                />
                <Button variant="secondary" className="mt-1" onClick={() => adicionarResposta(index)}>
                  Responder
                </Button>
              </Form.Group>
            </div>
          ))}
        </div>
      </div>

      {/* Painel de dados do aluno */}
      <div className="painel-direito">
        <h5>Dados do Aluno</h5>
        <p><strong>Nome:</strong> {aluno.nome}</p>
        <p><strong>RM:</strong> {aluno.rm}</p>
      </div>
    </div>
    </>
  );
}
