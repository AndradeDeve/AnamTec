import express from "express";
import pool from "../database/data-source.js";
import { enviarEmailAlunos } from "../helpers/emailAlunos.js";

const routes = express.Router();

// Buscar aluno(s) com filtros
routes.get("/specific", async (req, res) => {
  const { curso, ra, nome, coordenador, status } = req.query;

  try {
    let sql =`SELECT 
              al.id AS id_aluno,  
              al.nome AS nome_aluno,
              al.ra AS ra,
              c.curso AS nome_curso,
              c.semestre AS semestre,
              c.turno AS turno,
              c.coordenador as coordenador,
              CASE 
              WHEN dm.id IS NOT NULL THEN 'Concluída' 
              ELSE 'Não' 
              END AS status
              FROM tbl_cadastro_al al
              INNER JOIN juncao_al_curso jac ON al.id = jac.id_aluno
              INNER JOIN tbl_curso c ON jac.id_curso = c.id
              LEFT JOIN tbl_dadosMedicos dm ON al.id = dm.id_aluno
              WHERE al.deletedAt IS NULL  
              AND c.deletedAt IS NULL`;
    const params = [];

    if (curso) {
      sql += ` AND c.curso = ?`;
      params.push(curso);
    }

    if (coordenador) {
      sql += ` AND c.coordenador = ?`;
      params.push(coordenador);
    }

    if (ra) {
      sql += ` AND ra = ?`;
      params.push(ra);
    }

    if (status) {
      sql += ` AND dm.status = ?`;
      params.push(status);
    }

    if (nome) {
      sql += ` AND nome LIKE ?`;
      params.push(`%${nome}%`);
    }

    const [rows] = await pool.query(sql, params);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ err: "Aluno não encontrado." });
    }

    return res.status(200).json(rows);
  } catch (err) {
    console.error("Erro ao buscar alunos:", err);
    return res.status(500).json({ err: "Erro no servidor." });
  }
});

// Buscar todos
routes.get("/curso", async (req, res) => {
  try {
    const [rows] = await pool.query(
        `SELECT 
          al.id AS id_aluno,  
          al.nome AS nome_aluno,
          al.ra AS ra,
          c.curso AS nome_curso,
          c.semestre AS semestre,
          c.turno AS turno,
          c.coordenador as coordenador,
          CASE 
          WHEN dm.id IS NOT NULL THEN 'Concluída' 
          ELSE 'Não' 
          END AS status
          FROM tbl_cadastro_al al
          INNER JOIN juncao_al_curso jac ON al.id = jac.id_aluno
          INNER JOIN tbl_curso c ON jac.id_curso = c.id
          LEFT JOIN tbl_dadosMedicos dm ON al.id = dm.id_aluno
          WHERE al.deletedAt IS NULL  
          AND c.deletedAt IS NULL;`
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ err: "Aluno não encontrado." });
    }

    return res.status(200).json(rows);
  } catch (err) {
    console.error("Erro ao buscar aluno:", err);
    return res.status(500).json({ err: "Erro no servidor." });
  }
});

// Cadastro de aluno
routes.post("/", async (req, res) => {
  const { ra, nome, data_nasc, genero, email, telefone, cep, curso } = req.body;

  try {
    const [enderecoExistente] = await pool.query(
      "SELECT * FROM tbl_endereco WHERE cep = ? AND deletedAt IS NULL",
      [cep]
    );
    const id_endereco = enderecoExistente[0]?.id;
    if (!id_endereco) {
      return res.status(400).json({ err: "Endereço não encontrado." });
    }

    const [existeRa] = await pool.query(
      "SELECT * FROM tbl_cadastro_al WHERE ra = ? AND deletedAt IS NULL",
      [ra]
    );
    if (existeRa.length > 0) {
      return res.status(400).json({ err: "Este RA já está em uso." });
    }

    const [existeEmail] = await pool.query(
      "SELECT * FROM tbl_cadastro_al WHERE email = ? AND deletedAt IS NULL",
      [email]
    );
    if (existeEmail.length > 0) {
      return res.status(400).json({ err: "Este e-mail já está em uso." });
    }

    const [existeTel] = await pool.query(
      "SELECT * FROM tbl_cadastro_al WHERE telefone = ? AND deletedAt IS NULL",
      [telefone]
    );
    if (existeTel.length > 0) {
      return res.status(400).json({ err: "Este telefone já está em uso." });
    }

    const [existeCurso] = await pool.query(
      "SELECT * FROM tbl_curso WHERE curso = ? AND deletedAt IS NULL",
      [curso]
    );
    if (existeCurso.length === 0) {
      return res.status(400).json({ err: "Curso inválido." });
    }

    // Validações básicas
    const raRegex = /^\d{1,15}$/;
    if (!ra || !raRegex.test(ra.trim())) {
      return res.status(400).json({ err: "RA inválido." });
    }

    const nomeRegex = /^[\p{L}\s\-']{2,45}$/u;
    if (!nome || !nomeRegex.test(nome.trim())) {
      return res.status(400).json({ err: "Nome inválido." });
    }

    if (new Date(data_nasc) <= new Date("1935-01-01")) {
      return res.status(400).json({ err: "Data de nascimento inválida." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return res.status(400).json({ err: "E-mail inválido." });
    }

    const generosValidos = [
      "Feminino",
      "Masculino",
      "Não Binario",
      "Prefiro não informar",
      "Outros",
    ];
    if (!generosValidos.includes(genero)) {
      return res.status(400).json({ err: "Gênero inválido." });
    }

    const telefoneRegex = /^\d{10,20}$/;
    if (!telefone || !telefoneRegex.test(telefone.trim())) {
      return res.status(400).json({ err: "Telefone inválido." });
    }

    await pool.query(
      `INSERT INTO tbl_cadastro_al 
        (ra, nome, data_nasc, genero, email, telefone, id_endereco) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [ra, nome, data_nasc, genero, email, telefone, id_endereco]
    );

    const [alunoCadastrado] = await pool.query(
      `SELECT id FROM tbl_cadastro_al WHERE ra = ? AND deletedAt IS NULL`,
      [ra]
    );
    const id_aluno = alunoCadastrado[0]?.id;

    if (!id_aluno) {
      return res.status(400).json({ err: "Erro no id do aluno." });
    }

    await pool.query(
      `INSERT INTO juncao_al_curso (id_curso, id_aluno) VALUES(?, ?)`,
      [existeCurso[0].id, id_aluno]
    );

    return res.status(201).json({ msg: "Aluno cadastrado com sucesso." });
  } catch (err) {
    console.error("Erro ao cadastrar aluno:", err);
    return res.status(500).json({ err: "Erro no servidor." });
  }
});

// Envio de e-mails
routes.post("/emailAluno", async (req, res) => {
  try {
    const [pegaDados] = await pool.query(
      `SELECT a.id, a.nome, a.email
       FROM tbl_cadastro_al a
       LEFT JOIN tbl_dadosMedicos d ON a.id = d.id_aluno
       WHERE a.deletedAt IS NULL
       AND d.id_aluno IS NULL;`
    );

    if (pegaDados.length === 0) {
      return res.status(404).json({ err: "Nenhum aluno encontrado." });
    }

    for (let i = 0; i < pegaDados.length; i++) {
      let dados = {
        emailAluno: pegaDados[i].email,
        nomeAluno: pegaDados[i].nome,
      };
      await enviarEmailAlunos(dados);
    }

    return res.status(200).json({ response: "Emails processados com sucesso." });
  } catch (err) {
    console.error("Erro ao buscar alunos:", err);
    return res.status(500).json({ err: "Erro no servidor." });
  }
});

// Atualizar aluno
routes.put("/:RA", async (req, res) => {
  const { RA } = req.params;
  const { ra, nome, data_nasc, genero, email, telefone, cep } = req.body;

  try {
    const [enderecoExistente] = await pool.query(
      "SELECT * FROM tbl_endereco WHERE cep = ? AND deletedAt IS NULL",
      [cep]
    );
    const id_endereco = enderecoExistente[0]?.id;
    if (!id_endereco) {
      return res.status(400).json({ err: "Endereço não encontrado." });
    }

    // Validações
    const raRegex = /^\d{1,15}$/;
    if (!ra || !raRegex.test(ra.trim())) {
      return res.status(400).json({ err: "RA inválido." });
    }

    const nomeRegex = /^[\p{L}\s\-']{2,45}$/u;
    if (!nome || !nomeRegex.test(nome.trim())) {
      return res.status(400).json({ err: "Nome inválido." });
    }

    if (new Date(data_nasc) <= new Date("1935-01-01")) {
      return res.status(400).json({ err: "Data de nascimento inválida." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return res.status(400).json({ err: "E-mail inválido." });
    }

    const generosValidos = [
      "Feminino",
      "Masculino",
      "Não Binario",
      "Prefiro não informar",
      "Outros",
    ];
    if (!generosValidos.includes(genero)) {
      return res.status(400).json({ err: "Gênero inválido." });
    }

    const telefoneRegex = /^\d{10,20}$/;
    if (!telefone || !telefoneRegex.test(telefone.trim())) {
      return res.status(400).json({ err: "Telefone inválido." });
    }

    const [rows] = await pool.query(
      `UPDATE tbl_cadastro_al 
       SET ra = ?, nome = ?, data_nasc = ?, genero = ?, email = ?, telefone = ?, id_endereco = ?
       WHERE deletedAt IS NULL AND ra = ?`,
      [ra, nome, data_nasc, genero, email, telefone, id_endereco, RA]
    );

    if (rows.affectedRows === 0) {
      return res.status(404).json({ err: "Aluno não encontrado." });
    }

    return res.status(200).json({ msg: "Aluno atualizado com sucesso." });
  } catch (err) {
    console.error("Erro ao atualizar aluno:", err);
    return res.status(500).json({ err: "Erro no servidor." });
  }
});

// Deletar aluno
routes.delete("/:RA", async (req, res) => {
  const { RA } = req.params;

  if (!RA) {
    return res.status(400).json({ err: "Informe o RA do aluno." });
  }

  try {
    const dataDelete = new Date();

    const [rows] = await pool.query(
      `UPDATE tbl_cadastro_al 
       SET deletedAt = ? 
       WHERE ra = ? AND deletedAt IS NULL`,
      [dataDelete, RA]
    );

    if (rows.affectedRows === 0) {
      return res.status(404).json({ err: "Aluno não encontrado." });
    }

    return res.status(200).json({ msg: "Aluno deletado com sucesso." });
  } catch (err) {
    console.error("Erro ao deletar aluno:", err);
    return res.status(500).json({ err: "Erro no servidor." });
  }
});

export default routes;
