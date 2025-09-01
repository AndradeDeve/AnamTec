import express from 'express';
import { getConnection } from '../database/data-source.js';

const routes = express.Router();
const connection = await getConnection();

const estadosValidos = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA",
  "MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN",
  "RS","RO","RR","SC","SP","SE","TO"
];

routes.get("/", async (req, res) => {
  try {
    const [rows] = await connection.execute(
      `SELECT * FROM tbl_endereco WHERE deletedAt IS NULL`
    );
    if (!rows.length) {
      return res.status(404).json({ err: "Nenhum endereço encontrado." });
    }
    return res.status(200).json({ response: rows });
  } catch (err) {
    console.log("Erro ao buscar endereços:", err);
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
      `SELECT * FROM tbl_endereco WHERE id = ? AND deletedAt IS NULL`,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ err: "Endereço não encontrado." });
    }

    return res.status(200).json({ response: rows[0] });
  } catch (err) {
    console.log("Erro ao buscar endereço:", err);
    return res.status(500).json({ err: "Erro no servidor." });
  }
});

routes.post("/", async (req, res) => {
  const { CEP, logradouro, bairro, cidade, numero, UF } = req.body;

  if (!CEP || isNaN(CEP)) {
    return res.status(400).json({ err: "CEP inválido." });
  }
  if (!logradouro || logradouro.length > 50) {
    return res.status(400).json({ err: "Logradouro inválido." });
  }
  if (!bairro || bairro.length > 20) {
    return res.status(400).json({ err: "Bairro inválido." });
  }
  if (!cidade || cidade.length > 40) {
    return res.status(400).json({ err: "Cidade inválida." });
  }
  if (!numero || numero.length > 10) {
    return res.status(400).json({ err: "Número inválido." });
  }
  if (!UF || !estadosValidos.includes(UF)) {
    return res.status(400).json({ err: "UF inválido." });
  }

  try {
    await connection.execute(
      `INSERT INTO tbl_endereco (CEP, logradouro, bairro, cidade, numero, UF) VALUES (?, ?, ?, ?, ?, ?)`,
      [CEP, logradouro, bairro, cidade, numero, UF]
    );

    return res.status(201).json({ response: "Endereço cadastrado com sucesso." });
  } catch (err) {
    console.log("Erro ao cadastrar endereço:", err);
    return res.status(500).json({ err: "Erro no servidor." });
  }
});

routes.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { CEP, logradouro, bairro, cidade, numero, UF } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ err: "Id inválido." });
  }
  if (!CEP || isNaN(CEP)) {
    return res.status(400).json({ err: "CEP inválido." });
  }
  if (!logradouro || logradouro.length > 50) {
    return res.status(400).json({ err: "Logradouro inválido." });
  }
  if (!bairro || bairro.length > 20) {
    return res.status(400).json({ err: "Bairro inválido." });
  }
  if (!cidade || cidade.length > 40) {
    return res.status(400).json({ err: "Cidade inválida." });
  }
  if (!numero || numero.length > 10) {
    return res.status(400).json({ err: "Número inválido." });
  }
  if (!UF || !estadosValidos.includes(UF)) {
    return res.status(400).json({ err: "UF inválido." });
  }

  try {
    const [result] = await connection.execute(
      `UPDATE tbl_endereco SET CEP = ?, logradouro = ?, bairro = ?, cidade = ?, numero = ?, UF = ? WHERE id = ? AND deletedAt IS NULL`,
      [CEP, logradouro, bairro, cidade, numero, UF, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ err: "Endereço não encontrado." });
    }

    return res.status(200).json({ response: "Endereço atualizado com sucesso." });
  } catch (err) {
    console.log("Erro ao atualizar endereço:", err);
    return res.status(500).json({ err: "Erro no servidor." });
  }
});

routes.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({ err: "Id inválido." });
  }

  try {
    const now = new Date();
    const [result] = await connection.execute(
      `UPDATE tbl_endereco SET deletedAt = ? WHERE id = ? AND deletedAt IS NULL`,
      [now, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ err: "Endereço não encontrado." });
    }

    return res.status(200).json({ response: "Endereço deletado com sucesso." });
  } catch (err) {
    console.log("Erro ao deletar endereço:", err);
    return res.status(500).json({ err: "Erro no servidor." });
  }
});

export default routes;
