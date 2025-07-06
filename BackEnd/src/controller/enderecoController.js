import express from "express";
import { getConnection } from "../database/data-souce.js";

const routes = express.Router();

const ufValido = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

const textoRegex = /^[\p{L}\s\-']{2,50}$/u;

routes.get("/", async (req, res) => {
  try {
    const connection = await getConnection();
    const [results] = await connection.query("SELECT * FROM tbl_endereco WHERE deletedAt IS NULL");
    return res.status(200).json({ response: results });
  } catch (err) {
    console.error("Erro ao buscar endereços:", err);
    return res.status(500).json({ erro: "Erro no servidor." });
  }
});

routes.post("/", async (req, res) => {
  const { CEP, logradouro, bairro, cidade, numero, UF } = req.body;

  if (!CEP || isNaN(CEP) || CEP.toString().length !== 8) {
    return res.status(400).json({ response: "O campo 'CEP' deve conter exatamente 8 dígitos numéricos." });
  }

  if (!logradouro || !textoRegex.test(logradouro.trim())) {
    return res.status(400).json({ response: "O campo 'Logradouro' é inválido." });
  }

  if (!bairro || !/^[\p{L}\s\-']{2,20}$/u.test(bairro.trim())) {
    return res.status(400).json({ response: "O campo 'Bairro' é inválido." });
  }

  if (!cidade || !/^[\p{L}\s\-']{2,40}$/u.test(cidade.trim())) {
    return res.status(400).json({ response: "O campo 'Cidade' é inválido." });
  }

  if (!numero || numero.trim().length === 0 || numero.length > 10) {
    return res.status(400).json({ response: "O campo 'Número' deve conter até 10 caracteres e não pode estar vazio." });
  }

  if (!UF || !ufValido.includes(UF.toUpperCase())) {
    return res.status(400).json({ response: "O campo 'UF' deve ser uma sigla de estado válida do Brasil." });
  }

  try {
    const connection = await getConnection();
    const dataAtual = new Date();
    await connection.query(
      `INSERT INTO tbl_endereco (CEP, logradouro, bairro, cidade, numero, UF, createAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [CEP, logradouro.trim(), bairro.trim(), cidade.trim(), numero.trim(), UF.toUpperCase(), dataAtual]
    );
    return res.status(201).json({ response: "Endereço cadastrado com sucesso." });
  } catch (err) {
    console.error("Erro ao cadastrar endereço:", err);
    return res.status(500).json({ response: "Erro ao cadastrar endereço." });
  }
});

routes.put("/:ID", async (req, res) => {
  const ID = Number(req.params.ID);
  const { CEP, logradouro, bairro, cidade, numero, UF } = req.body;

  if (isNaN(ID)) {
    return res.status(400).json({ response: "O ID deve ser um valor numérico." });
  }

  if (!CEP || isNaN(CEP) || CEP.toString().length !== 8) {
    return res.status(400).json({ response: "O campo 'CEP' deve conter exatamente 8 dígitos numéricos." });
  }

  if (!logradouro || !textoRegex.test(logradouro.trim())) {
    return res.status(400).json({ response: "O campo 'Logradouro' é inválido." });
  }

  if (!bairro || !/^[\p{L}\s\-']{2,20}$/u.test(bairro.trim())) {
    return res.status(400).json({ response: "O campo 'Bairro' é inválido." });
  }

  if (!cidade || !/^[\p{L}\s\-']{2,40}$/u.test(cidade.trim())) {
    return res.status(400).json({ response: "O campo 'Cidade' é inválido." });
  }

  if (!numero || numero.trim().length === 0 || numero.length > 10) {
    return res.status(400).json({ response: "O campo 'Número' deve conter até 10 caracteres e não pode estar vazio." });
  }

  if (!UF || !ufValido.includes(UF.toUpperCase())) {
    return res.status(400).json({ response: "O campo 'UF' deve ser uma sigla de estado válida do Brasil." });
  }

  try {
    const connection = await getConnection();
    const [result] = await connection.query(
      `UPDATE tbl_endereco 
       SET CEP = ?, logradouro = ?, bairro = ?, cidade = ?, numero = ?, UF = ?
       WHERE ID = ? AND deletedAt IS NULL`,
      [CEP, logradouro.trim(), bairro.trim(), cidade.trim(), numero.trim(), UF.toUpperCase(), ID]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ response: "Endereço não encontrado." });
    }

    return res.status(200).json({ response: "Endereço atualizado com sucesso." });
  } catch (err) {
    console.error("Erro ao atualizar endereço:", err);
    return res.status(500).json({ response: "Erro ao atualizar endereço." });
  }
});

routes.delete("/:ID", async (req, res) => {
  const ID = Number(req.params.ID);

  if (isNaN(ID)) {
    return res.status(400).json({ response: "O ID do endereço deve ser um valor numérico." });
  }

  try {
    const connection = await getConnection();
    const dataDelete = new Date();
    const [result] = await connection.query(
      `UPDATE tbl_endereco SET deletedAt = ? WHERE ID = ? AND deletedAt IS NULL`,
      [dataDelete, ID]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ response: "Endereço não encontrado ou já deletado." });
    }

    return res.status(200).json({ response: "Endereço deletado com sucesso." });
  } catch (err) {
    console.error("Erro ao deletar endereço:", err);
    return res.status(500).json({ response: "Erro ao deletar endereço." });
  }
});

export default routes;
