import express from "express";
import { getConnection } from "../database/data-souce.js";

const routes = express.Router();
const binarioValido = ["sim", "não"];

routes.get("/", async (req, res) => {
  try {
    const connection = await getConnection();
    const [results] = await connection.query("SELECT * FROM tbl_restricoes");
    return res.status(200).json({ response: results });
  } catch (err) {
    console.error("Erro ao buscar restrições:", err);
    return res.status(500).json({ erro: "Erro no servidor." });
  }
});

routes.post("/", async (req, res) => {
  const { id, restri_alimentar, tp_restricao } = req.body;

  if (!id || isNaN(id)) {
    return res.status(400).json({ response: "O campo 'id' é obrigatório e deve ser numérico." });
  }

  if (!binarioValido.includes(restri_alimentar)) {
    return res.status(400).json({ response: "O campo 'restri_alimentar' deve ser 'sim' ou 'não'." });
  }

  if (tp_restricao && tp_restricao.length > 150) {
    return res.status(400).json({ response: "O campo 'tp_restricao' deve ter no máximo 150 caracteres." });
  }

  try {
    const connection = await getConnection();
    await connection.query(
      `INSERT INTO tbl_restricoes (id, restri_alimentar, tp_restricao) VALUES (?, ?, ?)`,
      [id, restri_alimentar, tp_restricao || null]
    );
    return res.status(201).json({ response: "Restrição cadastrada com sucesso." });
  } catch (err) {
    console.error("Erro ao cadastrar restrição:", err);
    return res.status(500).json({ response: "Erro ao cadastrar restrição." });
  }
});

routes.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { restri_alimentar, tp_restricao } = req.body;

  if (!id || isNaN(id)) {
    return res.status(400).json({ response: "O parâmetro 'id' da URL deve ser numérico." });
  }

  if (!binarioValido.includes(restri_alimentar)) {
    return res.status(400).json({ response: "O campo 'restri_alimentar' deve ser 'sim' ou 'não'." });
  }

  if (tp_restricao && tp_restricao.length > 150) {
    return res.status(400).json({ response: "O campo 'tp_restricao' deve ter no máximo 150 caracteres." });
  }

  try {
    const connection = await getConnection();
    const [result] = await connection.query(
      `UPDATE tbl_restricoes 
       SET restri_alimentar = ?, tp_restricao = ?
       WHERE id = ?`,
      [restri_alimentar, tp_restricao || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ response: "Restrição não encontrada." });
    }

    return res.status(200).json({ response: "Restrição atualizada com sucesso." });
  } catch (err) {
    console.error("Erro ao atualizar restrição:", err);
    return res.status(500).json({ response: "Erro ao atualizar restrição." });
  }
});

export default routes;
