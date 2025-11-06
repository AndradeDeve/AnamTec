import express, { response } from "express";
import pool from "../database/data-source.js";
import { enviarEmailAlunos } from "../helpers/emailAlunos.js";

const routes = express.Router();

routes.get("/", async (req, res) => {
  try{
    const [rows] = await pool.query(
        `SELECT 
          al.id AS id,  
          al.nome AS nome_aluno,
          al.rm AS rm,
          al.genero as genero_aluno,
          c.curso AS nome_curso,
          c.semestre AS semestre,
          c.turno AS turno,
          u.nome as coordenador,
          CASE 
          WHEN al.deletedAt IS NULL THEN 'ativo' 
          ELSE 'inativo' 
          END AS status
          FROM tbl_cadastro_al al
          INNER JOIN juncao_al_curso jac ON al.id = jac.id_aluno
          INNER JOIN tbl_curso c ON jac.id_curso = c.id
          INNER JOIN tbl_usuario u ON c.id_coordenador = u.id;`
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ err: "Aluno não encontrado." });
    }

    return res.status(200).json(rows);
  }catch(err){
    console.error("Erro: ", err);
    return res.status(500).json({err: "Erro no servidor."})
  }
})

routes.get("/card", async (req, res) => {
  try {
    const [result] = await pool.query(`
      SELECT 
        COUNT(DISTINCT a.id) as total_alunos,
        COUNT(DISTINCT CASE WHEN d.id_aluno IS NULL THEN a.id END) as anaminese_pendente,
        COUNT(DISTINCT d.id_aluno) as anaminese_concluida
      FROM tbl_cadastro_al a
      LEFT JOIN tbl_dadosMedicos d ON a.id = d.id_aluno
      WHERE a.deletedAt IS NULL
    `);

    if (!result || result.length === 0) {
      return res.status(200).json({
        totalAlunos: 0,
        anaminesePendente: 0,
        anamineseConcluida: 0
      });
    }
    const stats = result[0];
    return res.status(200).json(stats);
    
  } catch(err) {
    console.error("Erro:", err);
    return res.status(500).json({err: "Erro no servidor."});
  }
});

routes.get("/controll", async (req, res) => {
  const { curso, rm, nome, coordenador, turno} = req.query;

  try {
    let sql =`SELECT 
          al.id AS id,  
          al.nome AS nome_aluno,
          al.rm AS rm,
          c.curso AS nome_curso,
          c.semestre AS semestre,
          c.turno AS turno,
          u.nome as coordenador,
          CASE 
          WHEN al.deletedAt IS NULL THEN 'ativo' 
          ELSE 'inativo' 
          END AS status
          FROM tbl_cadastro_al al
          INNER JOIN juncao_al_curso jac ON al.id = jac.id_aluno
          INNER JOIN tbl_curso c ON jac.id_curso = c.id
          INNER JOIN tbl_usuario u ON c.id_coordenador = u.id`;
    const params = [];

    if (turno) {
      sql += ` WHERE c.turno LIKE ?`;
      params.push(turno);
    }

    if (curso) {
      sql += ` WHERE c.curso LIKE ?`;
      params.push(curso);
    }

    if (coordenador) {
      sql += ` WHERE u.nome LIKE ?`;
      params.push(coordenador);
    }

    if (rm) {
      sql += ` WHERE al.rm = ?`;
      params.push(rm);
    }

    if (nome) {
      sql += ` AND al.nome LIKE ?`;
      params.push(nome);
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


// Buscar aluno(s) com filtros
routes.get("/specific", async (req, res) => {
  const { curso, rm, nome, coordenador, turno,  status, todos } = req.query;

  try {
    let sql =`SELECT 
              al.id AS id,  
              al.nome AS nome_aluno,
              al.rm AS rm,
              c.curso AS nome_curso,
              c.semestre AS semestre,
              c.turno AS turno,
              u.nome as coordenador,
              CASE 
              WHEN dm.id IS NOT NULL THEN 'Concluída' 
              ELSE 'Não' 
              END AS status
              FROM tbl_cadastro_al al
              INNER JOIN juncao_al_curso jac ON al.id = jac.id_aluno
              INNER JOIN tbl_curso c ON jac.id_curso = c.id
              INNER JOIN tbl_usuario u ON c.id_coordenador = u.id
              LEFT JOIN tbl_dadosMedicos dm ON al.id = dm.id_aluno
              WHERE al.deletedAt IS NULL  
              AND c.deletedAt IS NULL`;
    const params = [];

    if (turno) {
      sql += ` AND c.turno LIKE ?`;
      params.push(turno);
    }

    if (curso) {
      sql += ` AND c.curso LIKE ?`;
      params.push(curso);
    }

    if (coordenador) {
      sql += ` AND u.nome LIKE ?`;
      params.push(coordenador);
    }

    if (rm) {
      sql += ` AND al.rm = ?`;
      params.push(rm);
    }

    if (status) {
      sql += ` AND dm.status = ?`;
      params.push(status);
    }

    if (nome) {
      sql += ` AND al.nome LIKE ?`;
      params.push(nome);
    }
    if(todos){
      const [rows] = await pool.query(sql);

      if (!rows || rows.length === 0) {
        return res.status(404).json({ err: "Aluno não encontrado." });
      }
      return res.status(200).json(rows);
    }

    const [rows] = await pool.query(sql, params);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ err: "Aluno não encontrado." });
    }
    console.log("Bom dia");
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
          al.id AS id,  
          al.nome AS nome_aluno,
          al.rm AS rm,
          al.data_nasc AS dataNascimento,
          al.genero as genero_aluno,
          c.curso AS nome_curso,
          c.semestre AS semestre,
          c.turno AS turno,
          dm.createAt as anamineseData,
          u.nome as coordenador,
          CASE 
          WHEN dm.id IS NOT NULL THEN 'Concluída' 
          ELSE 'Não' 
          END AS status
          FROM tbl_cadastro_al al
          INNER JOIN juncao_al_curso jac ON al.id = jac.id_aluno
          INNER JOIN tbl_curso c ON jac.id_curso = c.id
          INNER JOIN tbl_usuario u ON c.id_coordenador = u.id
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
  const { rm, nome, data_nasc, genero, email, telefone, cep, curso } = req.body;

  try {
    const [enderecoExistente] = await pool.query(
      "SELECT * FROM tbl_endereco WHERE cep = ? AND deletedAt IS NULL",
      [cep]
    );
    const id_endereco = enderecoExistente[0]?.id;
    if (!id_endereco) {
      return res.status(400).json({ err: "Endereço não encontrado." });
    }

    const [existeRm] = await pool.query(
      "SELECT * FROM tbl_cadastro_al WHERE rm = ? AND deletedAt IS NULL",
      [rm]
    );
    if (existeRm.length > 0) {
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
    const rmRegex = /^\d{1,15}$/;
    if (!rm || !rmRegex.test(rm.trim())) {
      return res.status(400).json({ err: "RM inválido." });
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
        (rm, nome, data_nasc, genero, email, telefone, id_endereco) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [rm, nome, data_nasc, genero, email, telefone, id_endereco]
    );

    const [alunoCadastrado] = await pool.query(
      `SELECT * FROM tbl_cadastro_al WHERE rm = ? AND deletedAt IS NULL`,
      [rm]
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
routes.put("/:RM", async (req, res) => {
  const { RM } = req.params;
  const { rm, nome, data_nasc, genero, email, telefone, cep } = req.body;

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
    const rmRegex = /^\d{1,15}$/;
    if (!rm || !rmRegex.test(rm.trim())) {
      return res.status(400).json({ err: "RM inválido." });
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
       SET rm = ?, nome = ?, data_nasc = ?, genero = ?, email = ?, telefone = ?, id_endereco = ?
       WHERE deletedAt IS NULL AND rm = ?`,
      [rm, nome, data_nasc, genero, email, telefone, id_endereco, RM]
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
routes.delete("/:ID", async (req, res) => {
  const { ID } = req.params;

  if (!ID) {
    return res.status(400).json({ err: "Informe o RM do aluno." });
  }

  try {
    const dataDelete = new Date();

    const [rows] = await pool.query(
      `UPDATE tbl_cadastro_al 
       SET deletedAt = ? 
       WHERE id = ? AND deletedAt IS NULL`,
      [dataDelete, ID]
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

routes.put("/ativo/:ID", async (req, res) => {
  const { ID } = req.params;

  if (!ID) {
    return res.status(400).json({ err: "Informe o ID do aluno." });
  }

  try {
    const deletedAt = null
    const [rows] = await pool.query(
      `UPDATE tbl_cadastro_al 
       SET deletedAt = ? 
       WHERE id = ? `,
      [deletedAt, ID]
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
