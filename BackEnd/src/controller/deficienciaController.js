import express from 'express';
import pool from '../database/data-source.js';

const routes = express.Router();

routes.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM tbl_deficiencias`);
    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(404).json({ err: "Deficiência não encontrada." });
    }
    return res.status(200).json(rows);
  } catch (err) {
    console.log("Erro ao buscar deficiência:", err);
    return res.status(500).json({ err: "Erro no servidor." });
  }
});

routes.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) {
    return res.status(400).json({ err: "Id inválido." });
  }
  try {
    const [rows] = await pool.query(
      "SELECT * FROM tbl_deficiencias WHERE id = ?",
      [id]
    );
    if (!rows || rows.length === 0) {
      return res.status(404).json({ err: "Deficiência não encontrada." });
    }
    return res.status(200).json(rows[0]);
  } catch (err) {
    console.log("Erro ao buscar deficiência:", err);
    return res.status(500).json({ err: "Erro no servidor." });
  }
});

routes.post("/", async (req, res) => {
  const { deficiencia, tp_defi } = req.body;
  try {
    const deficienciaOptions = ["sim", "não"];
    if (!deficienciaOptions.includes(deficiencia.toLowerCase())) {
      return res.status(400).json({ err: "Opção de deficiência inválida." });
    }
    if (tp_defi && tp_defi.length > 200) {
      return res.status(400).json({ err: "Tipo de deficiência inválido." });
    }
    await pool.query(
      `INSERT INTO tbl_deficiencias (deficiencia, tp_defi) VALUES (?, ?)`,
      [deficiencia, tp_defi]
    );
    return res.status(201).json({ response: "Deficiência cadastrada com sucesso." });
  } catch (err) {
    console.log("Erro ao cadastrar deficiência:", err);
    return res.status(500).json({ err: "Erro no servidor." });
  }
});

routes.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { deficiencia, tp_defi } = req.body;
  if (isNaN(id)) {
    return res.status(400).json({ err: "Id deve conter um valor válido." });
  }
  try {
    const deficienciaOptions = ["sim", "não"];
    if (!deficienciaOptions.includes(deficiencia.toLowerCase())) {
      return res.status(400).json({ err: "Opção de deficiência inválida." });
    }
    if (tp_defi && tp_defi.length > 200) {
      return res.status(400).json({ err: "Tipo de deficiência inválido." });
    }
    const [rows] = await pool.query(
      `UPDATE tbl_deficiencias SET deficiencia = ?, tp_defi = ? WHERE id = ?`,
      [deficiencia, tp_defi, id]
    );
    if (rows.affectedRows === 0) {
      return res.status(404).json({ err: "Deficiência não encontrada." });
    }
    return res.status(200).json({ response: "Deficiência atualizada com sucesso." });
  } catch (err) {
    console.log("Erro ao atualizar deficiência:", err);
    return res.status(500).json({ err: "Erro no servidor." });
  }
});

export default routes;