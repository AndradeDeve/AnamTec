import express from 'express';
import pool from '../database/data-source.js';

const routes = express.Router();

routes.get("/curso", async (req, res) => {
  const { id, curso, turno, semestre, modalidade } = req.query;

  try {
    let sql = `SELECT * FROM tbl_curso WHERE deletedAt IS NULL`;
    const params = [];

    if (id) {
      sql += ` AND id = ?`;
      params.push(id);
    }
    if (curso) {
      sql += ` AND curso LIKE ?`;
      params.push(`%${curso}%`);
    }
    if (turno) {
      sql += ` AND turno = ?`;
      params.push(turno.toLowerCase());
    }
    if (semestre) {
      sql += ` AND semestre = ?`;
      params.push(Number(semestre));
    }
    if (modalidade) {
      sql += ` AND modalidade = ?`;
      params.push(modalidade.toLowerCase());
    }

    const [rows] = await pool.query(sql, params);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ err: "Nenhum curso encontrado." });
    }

    return res.status(200).json(rows);
  } catch (err) {
    console.error("Erro ao buscar cursos:", err);
    return res.status(500).json({ err: "Erro no servidor." });
  }
});

routes.get("/professores", async (req, res) =>{
  try{
    const [rows_professores] = await pool.query(
      `SELECT
        c.id AS id_curso,
        c.curso AS nome_curso,
        c.modalidade,
        c.semestre,
        c.turno,
        u.id AS id_professor,
        u.nome AS nome_professor
        FROM tbl_curso c
        INNER JOIN juncao_curso_user jcu ON c.id = jcu.id_curso
        INNER JOIN tbl_usuario u ON jcu.id_user = u.id
        WHERE c.deletedAt IS NULL
        AND u.deletedAt IS NULL;
      `);
      if(!rows_professores || rows_professores.length === 0){
        return res.status(404).json({err: "Professore não encontrado."})
      }
      return res.status(200).json(rows_professores)
  }catch(err){
    console.error("Erro: ", err);
    return res.status(500).json({err: "Erro no servidor."})
  }
});

routes.get("/", async (req, res) => {

  try {
    const [rows_curso] = await pool.query(
      `SELECT * FROM tbl_curso WHERE deletedAt IS NULL;`);

    
    if (!rows_curso || rows_curso.length === 0) {
      return res.status(404).json({ err: "Curso não encontrado." });
    }
    return res.status(200).json(rows_curso);
  } catch (err) {
    console.error("Erro ao buscar curso:", err);
    return res.status(500).json({ err: "Erro no servidor." });
  }
});

routes.post("/", async (req, res) => {
  const { curso, turno, semestre, modalidade } = req.body;

  try {
    console.log(curso)
    if (!curso || curso.trim().length < 2) {
      return res.status(400).json({ err: "Nome do curso inválido." });
    }

    const turnosValidos = ["manhã", "tarde", "noite"];
    const modalidadesValidas = ["presencial", "hibrido", "ead"];

    if (!turnosValidos.includes(turno.toLowerCase())) {
      return res.status(400).json({ err: "Turno inválido." });
    }

    if (!modalidadesValidas.includes(modalidade.toLowerCase())) {
      return res.status(400).json({ err: "Modalidade inválida." });
    }

    if (!Number.isInteger(semestre) || semestre < 1 || semestre > 20) {
      return res.status(400).json({ err: "Semestre inválido (1 a 20)." });
    }

    await pool.query(
      `INSERT INTO tbl_curso (curso, turno, semestre, modalidade)
       VALUES (?, ?, ?, ?)`,
      [curso, turno, semestre, modalidade]
    );

    return res.status(201).json({ msg: "Curso cadastrado com sucesso." });
  } catch (err) {
    console.error("Erro ao cadastrar curso:", err);
    return res.status(500).json({ err: "Erro no servidor." });
  }
});

routes.put("/:id", async (req, res) => {
  const { id } = req.params;
  let { curso, turno, semestre, modalidade, coordenador } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ err: "ID inválido." });
  }

  const coordenadorRegex = /^[\p{L}\s\-']{2,45}$/u;
  if (!coordenador || !coordenadorRegex.test(coordenador.trim())) {
    return res.status(400).json({ err: "Nome inválido." });
  }

  try {
    if (!curso || curso.trim().length < 2 || curso.trim().length > 35) {
      return res.status(400).json({ err: "Nome do curso inválido." });
    }

    const turnosValidos = ["manhã", "tarde", "noite"];
    const modalidadesValidas = ["presencial", "hibrido", "ead"];

    if (!turnosValidos.includes(turno.toLowerCase())) {
      return res.status(400).json({ err: "Turno inválido." });
    }

    if (!modalidadesValidas.includes(modalidade.toLowerCase())) {
      return res.status(400).json({ err: "Modalidade inválida." });
    }

    if (!Number.isInteger(semestre) || semestre < 1 || semestre > 20) {
      return res.status(400).json({ err: "Semestre inválido (1 a 20)." });
    }

    const [result] = await pool.query(
      `UPDATE tbl_curso 
       SET curso = ?, turno = ?, semestre = ?, modalidade = ?, coordenador = ?
       WHERE id = ? AND deletedAt IS NULL`,
      [curso, turno, semestre, modalidade,coordenador,  id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ err: "Curso não encontrado." });
    }

    return res.status(200).json({ msg: "Curso atualizado com sucesso." });
  } catch (err) {
    console.error("Erro ao atualizar curso:", err);
    return res.status(500).json({ err: "Erro no servidor." });
  }
});

routes.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({ err: "ID inválido." });
  }

  try {
    const [result] = await pool.query(
      `UPDATE tbl_curso SET deletedAt = ? WHERE id = ? AND deletedAt IS NULL`,
      [new Date(), id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ err: "Curso não encontrado ou já deletado." });
    }

    return res.status(200).json({ msg: "Curso deletado com sucesso." });
  } catch (err) {
    console.error("Erro ao deletar curso:", err);
    return res.status(500).json({ err: "Erro no servidor." });
  }
});

export default routes;
