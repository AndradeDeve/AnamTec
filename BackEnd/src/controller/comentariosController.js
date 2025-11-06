import express from 'express';
import pool from '../database/data-source.js';

const router = express.Router();

router.get("/", async (req, res) => {
 try{
    const [rows] = await pool.query("SELECT id, nome, curso FROM tbl_usuario WHERE tipo = 'professor'");
    res.json(rows);
 }catch(err){
    console.log("Erro ao buscar professores:", err);
    return res.status(500).json({err: "Erro no servidor."});
 }
});

router.get("/:professorId", async (req, res) => {
  try {
    const { professorId } = req.params;

    const [comentarios] = await pool.query(
        `SELECT c.*, u.nome AS aluno_nome 
        FROM tbl_comentario c
        JOIN tbl_usuario u ON c.id_aluno = u.id
        WHERE c.id_professor = ?`, 
        [professorId]
    );

    for (const comentario of comentarios) {
        const [respostas] = await pool.query(
        "SELECT r.*, u.nome AS autor_nome FROM tbl_resposta r JOIN tbl_usuario u ON r.id_autor = u.id WHERE r.id_comentario = ?",
        [comentario.id]
        );
        comentario.respostas = respostas;
    }

    res.json(comentarios);
  }catch (err) {
    console.log("Erro ao buscar comentários:", err);
    return res.status(500).json({err: "Erro no servidor."});
  }
});


router.post("/", async (req, res) => {
  try{
    const { id_professor, id_aluno, texto } = req.body;
    await pool.query("INSERT INTO tbl_comentario (id_professor, id_aluno, texto) VALUES (?, ?, ?)", [id_professor, id_aluno, texto]);
    res.status(201).json({ message: "Comentário criado com sucesso!" });
  }catch(err){
    console.log("Erro ao adicionar comentário:", err);
    return res.status(500).json({err: "Erro no servidor."});
  }
});


router.post(":comentarioId/respostas", async (req, res) => {
  try{
    const { comentarioId } = req.params;
    const { id_autor, texto } = req.body;
    await pool.query("INSERT INTO tbl_resposta (id_comentario, id_autor, texto) VALUES (?, ?, ?)", [comentarioId, id_autor, texto]);
    res.status(201).json({ message: "Resposta adicionada com sucesso!" });
  }catch(err){
    console.log("Erro ao adicionar resposta:", err);
    return res.status(500).json({err: "Erro no servidor."});
  }
});

export default router;