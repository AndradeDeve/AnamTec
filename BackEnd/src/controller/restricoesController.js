import express from 'express';
import pool from '../database/data-source.js';

const routes = express.Router();

routes.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM tbl_restricoes");
    if (!rows.length) {
      return res.status(404).json({ err: "Nenhuma restrição encontrada." });
    }
    return res.status(200).json({ response: rows });
  } catch (err) {
    console.log("Erro ao buscar restrições:", err);
    return res.status(500).json({ err: "Erro no servidor." });
  }
});

routes.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({ err: "ID inválido." });
  }

  try {
    const [rows] = await pool.query("SELECT * FROM tbl_restricoes WHERE id = ?", [id]);
    if (!rows.length) {
      return res.status(404).json({ err: "Restrição não encontrada." });
    }
    return res.status(200).json({ response: rows[0] });
  } catch (err) {
    console.log("Erro ao buscar restrição por ID:", err);
    return res.status(500).json({ err: "Erro no servidor." });
  }
});

routes.post("/", async (req, res) => {
  const {restri_alimentar, tp_restricao } = req.body;

  try {
    const restricoesValidas = ["sim", "não"];
    if (!restricoesValidas.includes(restri_alimentar?.toLowerCase())) {
      return res.status(400).json({ err: "Opção de restrição alimentar inválida." });
    }

    if (tp_restricao?.length > 200) {
      return res.status(400).json({ err: "Tipo de restrição inválido." });
    }

    await pool.query(
      "INSERT INTO tbl_restricoes (restri_alimentar, tp_restricao) VALUES ( ?, ?)",
      [restri_alimentar.toLowerCase(), tp_restricao]
    );
    return res.status(201).json({ response: "Restrição cadastrada com sucesso." });
  } catch (err) {
    console.log("Erro ao cadastrar restrição:", err);
    return res.status(500).json({ err: "Erro no servidor." });
  }
});

routes.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { restri_alimentar, tp_restricao } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ err: "ID inválido." });
  }

  const restricoesValidas = ["sim", "não"];
  if (!restricoesValidas.includes(restri_alimentar?.toLowerCase())) {
    return res.status(400).json({ err: "Opção de restrição alimentar inválida." });
  }

  if (tp_restricao?.length > 200) {
    return res.status(400).json({ err: "Tipo de restrição inválido." });
  }

  try {
    const [result] = await pool.query(
      "UPDATE tbl_restricoes SET restri_alimentar = ?, tp_restricao = ? WHERE id = ?",
      [restri_alimentar.toLowerCase(), tp_restricao, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ err: "Restrição não encontrada." });
    }

    return res.status(200).json({ response: "Restrição atualizada com sucesso." });
  } catch (err) {
    console.log("Erro ao atualizar restrição:", err);
    return res.status(500).json({ err: "Erro no servidor." });
  }
});

export default routes;
