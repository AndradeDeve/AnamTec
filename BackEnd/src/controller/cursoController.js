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

routes.get("/", async (req, res) => {
  const { ids } = req.body;
  try {
    if(!ids){
      return res.status(400).json({ err: "ID do aluno é obrigatório." });
    }

    const [rows_curso] = await pool.query(
      `SELECT id_curso FROM juncao_al_curso WHERE id_aluno = ?`,
      [ids]
    );
    for (let i = 0; i < rows_curso.length; i++) {
      console.log(rows_curso[i]);
    }
    console.log(rows_curso)
    const idsArray = ids.split(",").map(id => parseInt(id));

    const [rows] = await connection.query(
      `SELECT a.id AS id_aluno, c.*
       FROM juncao_al_curso a
       JOIN tbl_curso c ON a.id_curso = c.id
       WHERE a.id_aluno IN (?) AND c.deletedAt IS NULL`,
      [idsArray]
    );

    if (!rows_curso || rows_curso.length === 0) {
      return res.status(404).json({ err: "Curso não encontrado." });
    }
    return res.status(200).json(rows);
  } catch (err) {
    console.error("Erro ao buscar curso:", err);
    return res.status(500).json({ err: "Erro no servidor." });
  }
});

routes.post("/", async (req, res) => {
  let { curso, turno, semestre, modalidade, coordenador } = req.body;

  try {
    if (!curso || curso.trim().length < 2 || curso.trim().length > 35) {
      return res.status(400).json({ err: "Nome do curso inválido." });
    }

    const coordenadorRegex = /^[\p{L}\s\-']{2,45}$/u;
    if (!coordenador || !coordenadorRegex.test(coordenador.trim())) {
      return res.status(400).json({ err: "Nome inválido." });
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
      `INSERT INTO tbl_curso (curso, turno, semestre, modalidade, coordenador)
       VALUES (?, ?, ?, ?, ?)`,
      [curso, turno, semestre, modalidade, coordenador]
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
