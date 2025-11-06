import express, { response } from 'express';
import pool from '../database/data-source.js';

const routes = express.Router();

const opcoesValidas = ['sim', 'não'];

routes.get("/", async (req, res) => {
  const { id } = req.query;
  try {
    let sql = `SELECT * FROM tbl_diagnostico`;
    const params = [];
    if (id) {
      if (isNaN(id)) return res.status(400).json({ err: "Id inválido." });
      sql += ` WHERE id = ?`;
      params.push(id);
    }
    const [rows] = await pool.query(sql, params);
    if (!rows.length) return res.status(404).json({ err: "Diagnóstico não encontrado." });
    return res.status(200).json({ response: rows });
  } catch {
    return res.status(500).json({ err: "Erro no servidor." });
  }
});

routes.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) return res.status(400).json({ err: "Id inválido." });
  try {
    const [rows] = await pool.query(
      `SELECT * FROM tbl_diagnostico WHERE id = ?`,
      [id]
    );
    if (!rows.length) return res.status(404).json({ err: "Diagnóstico não encontrado." });
    return res.status(200).json({ response: rows[0] });
  } catch {
    return res.status(500).json({ err: "Erro no servidor." });
  }
});

routes.post("/", async (req, res) => {
  const { diagnostico, tp_diag } = req.body;
  try {
    if (!diagnostico || !opcoesValidas.includes(diagnostico.toLowerCase())) {
      return res.status(400).json({ err: "Diagnóstico inválido." });
    }
    if (tp_diag && tp_diag.length > 200) {
      return res.status(400).json({ err: "Tipo de diagnóstico inválido." });
    }
    await pool.query(
      `INSERT INTO tbl_diagnostico ( diagnostico, tp_diag) VALUES (?, ?)`,
      [ diagnostico.toLowerCase(), tp_diag || null]
    );
    return res.status(201).json({ response: "Diagnóstico cadastrado com sucesso." });
  } catch(err) {
    console.error("Erro: ", err);
    return res.status(500).json({ err: "Erro no servidor." });
  }
});

routes.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { diagnostico, tp_diag } = req.body;
    if (isNaN(id)) return res.status(400).json({ err: "Id inválido." });
    if (!diagnostico || !opcoesValidas.includes(diagnostico.toLowerCase())) {
      return res.status(400).json({ err: "Diagnóstico inválido." });
    }
    if (tp_diag && tp_diag.length > 200) {
      return res.status(400).json({ err: "Tipo de diagnóstico inválido." });
    }
    const [result] = await pool.query(
      `UPDATE tbl_diagnostico SET diagnostico = ?, tp_diag = ? WHERE id = ?`,
      [diagnostico.toLowerCase(), tp_diag || null, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ err: "Diagnóstico não encontrado." });
    }
    return res.status(200).json({ response: "Diagnóstico atualizado com sucesso." });
  } catch(err) {
    console.error("Erro: ", err);
    return res.status(500).json({ err: "Erro no servidor." });
  }
});

export default routes;
