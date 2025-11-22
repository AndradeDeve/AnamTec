import express from 'express';
import pool from '../database/data-source.js';

const routes = express.Router();

routes.get("/", async (req, res) => {
    try {
        // Busca todos os comentários
        const [comentarios] = await pool.query(`
            SELECT 
            id,
            id_professor,
            id_aluno,
            texto,
            DATE_FORMAT(data_criacao, '%d/%m/%Y %H:%i') AS data_criacao,
            deletedAt
            FROM tbl_comentario

        `);

        if (!comentarios.length) {
            return res.status(200).json([]);
        }

        const [respostas] = await pool.query(`
            SELECT 
            r.*,
            u.nome AS nome_autor,
            DATE_FORMAT(r.data_criacao, '%d/%m/%Y %H:%i') AS data_criacao
            FROM tbl_resposta r
            INNER JOIN tbl_usuario u ON u.id = r.id_autor
            WHERE r.deletedAt IS NULL
                `);

        const respostasPorComentario = {};
        respostas.forEach(r => {
            if (!respostasPorComentario[r.id_comentario]) {
                respostasPorComentario[r.id_comentario] = [];
            }
            respostasPorComentario[r.id_comentario].push(r);
        });

        const comentariosComRespostas = comentarios.map(c => ({
            ...c,
            respostas: respostasPorComentario[c.id] || []
        }));

        return res.status(200).json(comentariosComRespostas);

    } catch (error) {
        console.error("Erro: ", error);
        return res.status(500).json({ err: "Erro no servidor." });
    }
});


routes.get("/resposta", async (req, res) => {
    try{
        const [rows] =  await pool.query(`SELECT * FROM tbl_resposta WHERE deletedAt IS NULL`);
        if(!Array.isArray(rows) || rows.length === 0){
            return res.status(404).json({ err: "Nenhum comentário encontrado." });
        }
        return res.status(200).json(rows );
    }catch(error){
        console.error("Erro: ", error);
        return res.status(500).json({ err: "Erro no servidor." });
    }
});

routes.post("/", async (req, res) => {
    const { id_professor, id_aluno, texto, data_comentario } = req.body;
    try{
        if(!id_professor || isNaN(id_professor)){
            return res.status(400).json({ err: "ID do professor inválido." });
        }
        if(!id_aluno || isNaN(id_aluno)){
            return res.status(400).json({ err: "ID do aluno inválido." });
        }
        if(!texto || texto.length > 500){
            return res.status(400).json({ err: "Texto do comentário inválido." });
        }

        const [rows] = await pool.query(
            `INSERT INTO tbl_comentario (id_professor, id_aluno, texto, data_criacao) VALUES (?, ?, ?, ?)`,
            [id_professor, id_aluno, texto, data_comentario || new Date()]
        );
        if(rows.affectedRows === 0){
            return res.status(500).json({ err: "Falha ao criar comentário." });
        }
        return res.status(201).json({ response: "Comentário criado com sucesso.", id_comentario: rows.insertId });
    }catch(error){
        console.error("Erro: ", error);
        return res.status(500).json({ err: "Erro no servidor." });
    }
});

routes.post("/resposta", async ( req, res) => {
    const { id_comentario, id_autor, texto } = req.body
    try{
        if(!id_comentario || isNaN(id_comentario)){
            return res.status(400).json({ err: "ID do comentário inválido." });
        }
        if(!id_autor || isNaN(id_autor)){
            return res.status(400).json({ err: "ID do autor inválido." });
        }
        if(!texto || texto.length > 500){
            return res.status(400).json({ err: "Texto do comentário inválido." });
        }

        const data_criacao = new Date();

        const [rows] = await pool.query(
            `INSERT INTO tbl_resposta (id_comentario, id_autor, texto, data_criacao)values(?, ?, ?, ?)`,
            [id_comentario, id_autor, texto, data_criacao]
        );

        if(rows.affectedRows === 0){
            return res.status(400).json({err: "Erro ao criar resposta."});
        };

        return res.status(200).json({response: "Reaposta do comentário enviado com sucesso", id_resposta: rows.insertId})
    }catch(error){
        console.log("Erro: ", error);
        return res.status(500).json({err: "Erro no servidor."});
    }
})

routes.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try{
        console.log("ID recebido para exclusão:", id);
        if(!id || isNaN(id)){
            return res.status(400).json({ err: "ID do comentário inválido." });
        }
        const deletedAt = new Date();
        const [rows] = await pool.query(
            `UPDATE tbl_comentario SET deletedAt = ? WHERE id = ?`,
            [deletedAt, id]
        );
        if(rows.affectedRows === 0){
            return res.status(404).json({ err: "Comentário não encontrado." });
        }
        return res.status(200).json({ response: "Comentário deletado com sucesso." });
    }catch(error){
        console.error("Erro: ", error);
        return res.status(500).json({ err: "Erro no servidor." });
    }
});

routes.delete("/Resposta/:id", async (req, res) => {
    const { id } = req.params;
    try{
        console.log("ID recebido para exclusão:", id);
        if(!id || isNaN(id)){
            return res.status(400).json({ err: "ID da resposta inválido." });
        }
        const deletedAt = new Date();
        const [rows] = await pool.query(
            `UPDATE tbl_resposta SET deletedAt = ? WHERE id = ?`,
            [deletedAt, id]
        );
        if(rows.affectedRows === 0){
            return res.status(404).json({ err: "Resposta não encontrada." });
        }
        return res.status(200).json({ response: "resposta deletada com sucesso." });
    }catch(error){
        console.error("Erro: ", error);
        return res.status(500).json({ err: "Erro no servidor." });
    }
});


export default routes;