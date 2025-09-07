import express from 'express';
import { getConnection } from '../database/data-source.js';

const routes = express.Router();
const connection = await getConnection();

const ops = ["sim", "não"];

routes.get("/", async (req, res) => {
  const { id } = req.query;
  try {
    let sql = `SELECT * FROM tbl_cirurgias`;
    const params = [];
    if (id) {
      if (isNaN(id)) return res.status(400).json({ err: "Id inválido." });
      sql += ` WHERE id = ?`;
      params.push(id);
    }
    const [rows] = await connection.execute(sql, params);
    if (!rows.length) return res.status(404).json({ err: "Cirurgia não encontrada." });
    return res.status(200).json({ response: rows });
  } catch {
    return res.status(500).json({ err: "Erro no servidor." });
  }
});

routes.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) return res.status(400).json({ err: "Id inválido." });
  try {
    const [rows] = await connection.execute(
      `SELECT * FROM tbl_cirurgias WHERE id = ?`,
      [id]
    );
    if (!rows.length) return res.status(404).json({ err: "Cirurgia não encontrada." });
    return res.status(200).json({ response: rows[0] });
  } catch {
    return res.status(500).json({ err: "Erro no servidor." });
  }
});

routes.post("/", async (req, res) => {
  const {internacao_cirurgia, tp_cirurgia } = req.body;

  try {
    if (!internacao_cirurgia || !ops.includes(internacao_cirurgia.toLowerCase())) {
      return res.status(400).json({ err: "Internação inválida." });
    }
    if (tp_cirurgia && tp_cirurgia.length > 200) {
      return res.status(400).json({ err: "Tipo de cirurgia inválido." });
    }
    await connection.execute(
      `INSERT INTO tbl_cirurgias (internacao_cirurgia, tp_cirurgia) VALUES (?, ?)`,
      [ internacao_cirurgia.toLowerCase(), tp_cirurgia || null]
    );
    return res.status(201).json({ response: "Cirurgia cadastrada com sucesso." });
  } catch(err) {
    console.error("Erro: ", err)
    return res.status(500).json({ err: "Erro no servidor." });
  }
});

routes.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { internacao_cirurgia, tp_cirurgia } = req.body;
  if (isNaN(id)) return res.status(400).json({ err: "Id inválido." });
  if (!internacao_cirurgia || !ops.includes(internacao_cirurgia.toLowerCase())) {
    return res.status(400).json({ err: "Internação inválida." });
  }
  if (tp_cirurgia && tp_cirurgia.length > 200) {
    return res.status(400).json({ err: "Tipo de cirurgia inválido." });
  }
  try {
    const [result] = await connection.execute(
      `UPDATE tbl_cirurgias SET internacao_cirurgia = ?, tp_cirurgia = ? WHERE id = ?`,
      [internacao_cirurgia.toLowerCase(), tp_cirurgia || null, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ err: "Cirurgia não encontrada." });
    return res.status(200).json({ response: "Cirurgia atualizada com sucesso." });
  } catch {
    return res.status(500).json({ err: "Erro no servidor." });
  }
});

export default routes;