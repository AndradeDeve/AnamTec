import express from "express";
import { getConnection } from "../database/data-source.js";
import { enviarEmailAlunos } from "../helpers/emailAlunos.js";

const routes = express.Router();
const connection = await getConnection();

routes.get("/", async (req, res) => {
  const { id, ra, nome } = req.query;

  try {
    let sql = `SELECT * FROM tbl_cadastro_al WHERE deletedAt IS NULL`;
    const params = [];

    if (id) {
      sql += ` AND id = ?`;
      params.push(id);
    }

    if (ra) {
      sql += ` AND ra = ?`;
      params.push(ra);
    }

    if (nome) {
      sql += ` AND nome LIKE ?`;
      params.push(`%${nome}%`);
    }

    const [rows] = await connection.execute(sql, params);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ err: "Aluno não encontrado." });
    }

    return res.status(200).json(rows);
  } catch (err) {
    console.error("Erro ao buscar alunos:", err);
    return res.status(500).json({ err: "Erro no servidor." });
  }
});

routes.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await connection.execute(
      `SELECT * FROM tbl_cadastro_al WHERE id = ? AND deletedAt IS NULL`,
      [id]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ err: "Aluno não encontrado." });
    }
    
    return res.status(200).json(rows[0]);
  } catch (err) {
    console.error("Erro ao buscar aluno:", err);
    return res.status(500).json({ err: "Erro no servidor." });
  }
});

routes.post("/", async (req, res) => {
  const { ra, nome, data_nasc, genero, email, telefone, cep } = req.body;
  
  try {
    const [enderecoExistente] = await connection.execute(
      "SELECT * FROM tbl_endereco WHERE cep = ? AND deletedAt IS NULL",
      [cep]
    );
    const id_endereco = enderecoExistente[0]?.id;
    if (!id_endereco) {
      return res.status(400).json({ err: "Endereço não encontrado." });
    }

    const [existeRa] = await connection.execute(
      "SELECT * FROM tbl_cadastro_al WHERE ra = ? AND deletedAt IS NULL",
      [ra]
    );
    if (existeRa.length > 0) {
      return res.status(400).json({ err: "Este RA já está em uso." });
    }

    const [existeEmail] = await connection.execute(
      "SELECT * FROM tbl_cadastro_al WHERE email = ? AND deletedAt IS NULL",
      [email]
    );
    if (existeEmail.length > 0) {
      return res.status(400).json({ err: "Este e-mail já está em uso." });
    }

    const [existeTel] = await connection.execute(
      "SELECT * FROM tbl_cadastro_al WHERE telefone = ? AND deletedAt IS NULL",
      [telefone]
    );
    if (existeTel.length > 0) {
      return res.status(400).json({ err: "Este telefone já está em uso." });
    }
    
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
    
    await connection.execute(
      `INSERT INTO tbl_cadastro_al 
      (ra, nome, data_nasc, genero, email, telefone, id_endereco) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [ra, nome, data_nasc, genero, email, telefone, id_endereco]
    );

    return res.status(201).json({ msg: "Aluno cadastrado com sucesso." });
  } catch (err) {
    console.error("Erro ao cadastrar aluno:", err);
    return res.status(500).json({ err: "Erro no servidor." });
  }
});

routes.post('/emailAluno', async (request, response) => {
  try {
    console.log("Olá: ");
    const [pegaDados] = await connection.execute(
      `SELECT a.id, a.nome, a.email
       FROM tbl_cadastro_al a
       LEFT JOIN tbl_dadosMedicos d ON a.id = d.id_aluno
       WHERE a.deletedAt IS NULL
       AND d.id_aluno IS NULL;`
    );
    if (pegaDados.length === 0) {
      return response.status(404).json({ err: "Nenhum aluno encontrado." });
    }
    for(let i = 0; i < pegaDados.length; i++){
      // console.log(`ID: Nome: ${pegaDados[i].nome}, Email: ${pegaDados[i].email}`);
      let dados = {
        emailAluno: pegaDados[i].email,
        nomeAluno: pegaDados[i].nome
      };
      console.log(dados);
      await enviarEmailAlunos(dados);
    }
    return response.status(200).json({response: "Emails processados com sucesso."});

  } catch (err) {
    console.log("Erro ao buscar alunos:", err);
    return response.status(500).json({ err: "Erro no servidor." });
  }
}); 

routes.put("/:RA", async (req, res) => {
  const { RA } = req.params;
  const { ra, nome, data_nasc, genero, email, telefone, cep } = req.body;
  
  try {
    const [enderecoExistente] = await connection.execute(
      "SELECT * FROM tbl_endereco WHERE cep = ? AND deletedAt IS NULL",
      [cep]
    );
    const id_endereco = enderecoExistente[0]?.id;
    if (!id_endereco) {
      return res.status(400).json({ err: "Endereço não encontrado." });
    }

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

    const [rows] = await connection.execute(
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


routes.delete("/:RA", async (req, res) => {
  const { RA } = req.params;

  if (!RA) {
    return res.status(400).json({ err: "Informe o RA do aluno." });
  }

  try {
    const dataDelete = new Date();

    const [rows] = await connection.execute(
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