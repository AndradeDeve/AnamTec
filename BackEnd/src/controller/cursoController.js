import express from "express";
import { getConnection } from "../database/data-souce.js";

const routes = express.Router();

routes.get("/", async (req, res) => {
  try {
    const connection = await getConnection();
    const [results] = await connection.execute("SELECT * FROM tbl_curso WHERE deletedAt IS NULL");
    return res.status(200).json({ response: results });
  } catch (err) {
    console.error("Erro ao buscar cursos:", err);
    return res.status(500).json({ erro: "Erro no servidor." });
  }
});

routes.post("/", async (req, res) => {
  const { curso, turno, semestre, modalidade } = req.body;

  const cursoRegex = /^[\p{L}\s\-']{2,35}$/u;
  const turnoValido = ["manhã", "tarde", "noite"];
  const modalidadeValida = ["presencial", "hibrido", "ead"];

  if (!curso || !cursoRegex.test(curso.trim())) {
    return res.status(400).send({ response: "Curso inválido." });
  }

  if (!turnoValido.includes(turno.toLowerCase())) {
    return res.status(400).send({ response: "Turno inválido." });
  }

  if (isNaN(semestre) || semestre <= 0 || semestre > 20) {
    return res.status(400).send({ response: "Semestre inválido." });
  }

  if (!modalidadeValida.includes(modalidade.toLowerCase())) {
    return res.status(400).send({ response: "Modalidade inválida." });
  }

  try {
    const dataAtual = new Date();
    const connection = await getConnection();
    await connection.execute(
      `INSERT INTO tbl_curso (curso, turno, semestre, modalidade, createAt) VALUES (?, ?, ?, ?, ?)`,
      [curso, turno, semestre, modalidade, dataAtual]
    );
    return res.status(201).send({ response: "Curso cadastrado com sucesso." });
  } catch (err) {
    console.error("Erro ao cadastrar curso:", err);
    return res.status(500).send({ response: "Erro ao cadastrar curso." });
  }
});

routes.put("/:ID", async (req, res) => {
  const { ID } = req.params;
  const { curso, turno, semestre, modalidade } = req.body;

  const cursoRegex = /^[\p{L}\s\-']{2,35}$/u;
  const turnoValido = ["manhã", "tarde", "noite"];
  const modalidadeValida = ["presencial", "hibrido", "ead"];

  if (isNaN(ID) || !curso || !cursoRegex.test(curso.trim()) ||
      !turnoValido.includes(turno.toLowerCase()) ||
      isNaN(semestre) || semestre <= 0 || semestre > 20 ||
      !modalidadeValida.includes(modalidade.toLowerCase())) {
    return res.status(400).send({ response: "Dados inválidos." });
  }

  try {
    const connection = await getConnection();
    const [result] = await connection.execute(
      `UPDATE tbl_curso SET curso = ?, turno = ?, semestre = ?, modalidade = ? WHERE ID = ? AND deletedAt IS NULL`,
      [curso, turno, semestre, modalidade, ID]
    );

    if (result.affectedRows === 0) {
      return res.status(404).send({ response: "Curso não encontrado." });
    }

    return res.status(200).send({ response: "Curso atualizado com sucesso." });
  } catch (err) {
    console.error("Erro ao atualizar curso:", err);
    return res.status(500).send({ response: "Erro no servidor." });
  }
});

routes.delete("/:ID", async (req, res) => {
  const { ID } = req.params;
  if (isNaN(ID)) {
    return res.status(400).send({ response: "ID inválido." });
  }

  try {
    const dataDelete = new Date();
    const connection = await getConnection();
    const [result] = await connection.execute(
      `UPDATE tbl_curso SET deletedAt = ? WHERE ID = ?`,
      [dataDelete, ID]
    );

    if (result.affectedRows === 0) {
      return res.status(404).send({ response: "Curso não encontrado." });
    }

    return res.status(200).send({ response: "Curso deletado com sucesso." });
  } catch (err) {
    console.error("Erro ao deletar curso:", err);
    return res.status(500).send({ response: "Erro no servidor." });
  }
});

export default routes;
