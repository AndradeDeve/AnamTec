import express from "express";
import { getConnection } from "../database/data-souce.js";

const routes = express.Router();
const diagnosticoValido = ["sim", "não"];

routes.get("/", async (req, res) => {
  try {
    const connection = await getConnection();
    const [results] = await connection.query("SELECT * FROM tbl_diagnostica");
    return res.status(200).json({ response: results });
  } catch (err) {
    console.error("Erro ao buscar diagnósticos:", err);
    return res.status(500).json({ erro: "Erro no servidor." });
  }
});

routes.post("/", async (req, res) => {
  const { id, diagnostico, tp_diag } = req.body;

  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ response: "Campo 'id' obrigatório e deve ser numérico." });
  }

  if (!diagnosticoValido.includes(diagnostico)) {
    return res.status(400).json({ response: "Campo 'diagnostico' inválido. Deve ser 'sim' ou 'não'." });
  }

  if (tp_diag && tp_diag.length > 200) {
    return res.status(400).json({ response: "Campo 'tp_diag' deve ter no máximo 200 caracteres." });
  }

  try {
    const connection = await getConnection();
    await connection.query(
      `INSERT INTO tbl_diagnostica (id, diagnostico, tp_diag) VALUES (?, ?, ?)`,
      [parseInt(id), diagnostico, tp_diag || null]
    );
    return res.status(201).json({ response: "Diagnóstico cadastrado com sucesso." });
  } catch (err) {
    console.error("Erro ao cadastrar diagnóstico:", err);
    return res.status(500).json({ response: "Erro ao cadastrar diagnóstico." });
  }
});

routes.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { diagnostico, tp_diag } = req.body;

  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ response: "Parâmetro 'id' inválido. Deve ser numérico." });
  }

  if (!diagnosticoValido.includes(diagnostico)) {
    return res.status(400).json({ response: "Campo 'diagnostico' deve ser 'sim' ou 'não'." });
  }

  if (tp_diag && tp_diag.length > 200) {
    return res.status(400).json({ response: "Campo 'tp_diag' deve ter no máximo 200 caracteres." });
  }

  try {
    const connection = await getConnection();
    const [result] = await connection.query(
      `UPDATE tbl_diagnostica SET diagnostico = ?, tp_diag = ? WHERE id = ?`,
      [diagnostico, tp_diag || null, parseInt(id)]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ response: "Diagnóstico não encontrado." });
    }

    return res.status(200).json({ response: "Diagnóstico atualizado com sucesso." });
  } catch (err) {
    console.error("Erro ao atualizar diagnóstico:", err);
    return res.status(500).json({ response: "Erro ao atualizar diagnóstico." });
  }
});

export default routes;
