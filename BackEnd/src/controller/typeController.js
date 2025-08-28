import express from 'express';
import { getConnection } from '../database/data-souce.js';

const routes = express.Router();
const connection = await getConnection();

const tiposValidos = [
  "coordenador pedagógico",
  "secretaria",
  "coordenador de curso",
  "professor"
];

function validarTipo(tipo) {
  if (!tipo) return null;
  const tipoLower = tipo.toLowerCase();
  const encontrado = tiposValidos.find(t => t.toLowerCase() === tipoLower);
  return encontrado || null;
}

routes.get("/", async (req, res) => {
  try {
    const [rows] = await connection.execute(`SELECT * FROM tbl_type`);
    if (!rows.length) {
      return res.status(404).json({ err: "Nenhum tipo encontrado." });
    }
    return res.status(200).json({ response: rows });
  } catch (err) {
    console.log("Erro ao buscar tipos:", err);
    return res.status(500).json({ err: "Erro no servidor." });
  }
});

routes.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({ err: "Id inválido." });
  }

  try {
    const [rows] = await connection.execute(
      `SELECT * FROM tbl_type WHERE id = ?`,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ err: "Tipo não encontrado." });
    }

    return res.status(200).json({ response: rows[0] });
  } catch (err) {
    console.log("Erro ao buscar tipo:", err);
    return res.status(500).json({ err: "Erro no servidor." });
  }
});

routes.post("/", async (req, res) => {
  const tipoValidado = validarTipo(req.body.tipo);

  if (!tipoValidado) {
    return res.status(400).json({ err: "Tipo inválido." });
  }

  try {
    const [result] = await connection.execute(
      `INSERT INTO tbl_type (tipo) VALUES (?)`,
      [tipoValidado]
    );

    return res.status(201).json({ response: "Tipo cadastrado com sucesso.", id: result.insertId });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ err: "Tipo já cadastrado." });
    }
    console.log("Erro ao cadastrar tipo:", err);
    return res.status(500).json({ err: "Erro no servidor." });
  }
});

routes.put("/:id", async (req, res) => {
  const { id } = req.params;
  const tipoValidado = validarTipo(req.body.tipo);

  if (isNaN(id)) {
    return res.status(400).json({ err: "Id inválido." });
  }

  if (!tipoValidado) {
    return res.status(400).json({ err: "Tipo inválido." });
  }

  try {
    const [result] = await connection.execute(
      `UPDATE tbl_type SET tipo = ? WHERE id = ?`,
      [tipoValidado, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ err: "Tipo não encontrado." });
    }

    return res.status(200).json({ response: "Tipo atualizado com sucesso." });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ err: "Tipo já cadastrado." });
    }
    console.log("Erro ao atualizar tipo:", err);
    return res.status(500).json({ err: "Erro no servidor." });
  }
});

export default routes;
