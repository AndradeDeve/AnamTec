import express from "express";
import { getConnection } from "../database/data-souce.js";

const routes = express.Router();

routes.get("/", async (req, res) => {
  try {
    const connection = await getConnection();
    const [results] = await connection.execute("SELECT * FROM tbl_cadastro_aluno WHERE deletedAt IS NULL");
    return res.status(200).json({ response: results });
  } catch (err) {
    console.error("Erro ao buscar alunos:", err);
    return res.status(500).json({ erro: "Erro no servidor." });
  }
});

routes.post("/", async (req, res) => {
  const { ra, nome, data_nasc, genero, email, telefone } = req.body;

  try {
    if (!ra || ra.length !== 13) {
      return res.status(400).send({ response: "O campo 'RA' deve conter exatamente 13 caracteres." });
    }

    const nomeRegex = /^[\p{L}\s\-']{2,45}$/u;
    if (!nome || !nomeRegex.test(nome.trim())) {
      return res.status(400).send({
        response: "O campo 'Nome' não pode conter números ou caracteres especiais e deve ter entre 2 a 45 caracteres."
      });
    }

    if (!email || !email.toLowerCase().includes("@")) {
      return res.status(400).send({ response: "E-mail inválido." });
    }

    const generosValidos = ["feminino", "masculino", "não binario", "prefiro não informar", "outros"];
    if (!generosValidos.includes(genero.toLowerCase())) {
      return res.status(400).send({ response: "Campo 'Gênero' inválido." });
    }

    if (!telefone || telefone.length < 11 || telefone.length > 20) {
      return res.status(400).send({ response: "O campo 'Telefone' deve conter entre 11 e 20 caracteres." });
    }

    const connection = await getConnection();
    await connection.execute(
      `INSERT INTO tbl_cadastro_aluno (ra, nome, data_nasc, genero, email, telefone) VALUES (?, ?, ?, ?, ?, ?)`,
      [ra, nome, data_nasc, genero, email, telefone]
    );

    return res.status(201).send({ response: "Aluno cadastrado com sucesso." });
  } catch (err) {
    console.error("Erro ao cadastrar aluno:", err);
    return res.status(500).json({ response: "Erro ao cadastrar aluno." });
  }
});

routes.delete("/:ID", async (req, res) => {
  const { ID } = req.params;

  if (isNaN(ID)) {
    return res.status(400).send({ response: "O ID do aluno deve ser um valor numérico." });
  }

  try {
    const dataDelete = new Date();
    const connection = await getConnection();
    const [result] = await connection.execute(
      `UPDATE tbl_cadastro_aluno SET deletedAt = ? WHERE ID = ?`,
      [dataDelete, ID]
    );

    if (result.affectedRows === 0) {
      return res.status(404).send({ response: "Aluno não encontrado." });
    }

    return res.status(200).send({ response: "Aluno deletado com sucesso." });
  } catch (err) {
    console.error("Erro ao deletar aluno:", err);
    return res.status(500).send({ response: "Erro ao deletar aluno." });
  }
});

export default routes;
