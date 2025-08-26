import express from "express";
import { getConnection } from "../database/data-souce.js";

const routes = express.Router();
const connection = await getConnection();

routes.get("/", async (request, response) => {
  const {id, rm, nome} = request.query;
  try {
    let sql = `SELECT * FROM tbl_cadastro_aluno WHERE deletedAt IS NULL`;
    const params = [];

    if(id){
      sql += ` AND ID = ?`;
      params.push(id);
    }

    if(rm){
      sql += ` AND RM = ?`;
      params.push(rm);
    }

    if(nome){
      sql += ` AND nome LIKE ?`;
      params.push(`%${nome}%`);
    }

    const [rows] = await connection.execute(sql, params);
    if (!Array.isArray(rows) || rows.length === 0) {
            return response.status(404).json({ err: "Aluno não encontrado." });
    }

    return response.status(200).json({response: rows })
  } catch (err) {
    console.error("Erro ao buscar alunos:", err);
    return response.status(500).json({ err: "Erro no servidor." });
  }
});


routes.post("/", async(request, response) =>{
  const { rm, nome, data_nasc, genero, email, telefone } = request.body;

  try{

    const [existe] = await connection.execute(
      "SELECT * FROM tbl_cadastro_aluno WHERE rm = ? AND deletedAt IS NULL",
      [rm]
    );
    if (existe.length > 0) {
      return response.status(400).json({ err: "Este RM já está em uso por outro aluno." });
    }

    const rmRegex = /^\d{7}$/;
    if(!rm || !rmRegex.test(rm.toLowerCase().trim())){
      return response.status(400).json({err: "Rm inválido"})
    }

    if(data_nasc <= "1935/01/01"){
      return response.status(400).json({err: "A data de nascimento não pode ser anterior a 01/01/1935."})
    }

    const nomeRegex = /^[\p{L}\s\-']{2,45}$/u;
    if(!nome || !nomeRegex.test(nome.trim())){
      return response.status(400).json({err: "Nome inválido."});
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!email || !emailRegex.test(email.trim())){
      return response.status(400).json({err: "E-mail inválido"});
    }

    if(genero.toLowerCase() !== "feminino" && genero.toLowerCase() !== "masculino" && genero.toLowerCase() !== "não binario" && genero.toLowerCase() !== "prefiro não informar" && genero.toLowerCase() !== "outros"){
      return response.status(400).json({err: "Genero inválido."});
    } 

    const telefoneRegex = /^\d{10,20}$/;
    if(!telefone || !telefoneRegex.test(telefone.trim())){
      return response. status(400).json({err: "Telefone inválido."});
    }
    await connection.execute(
      `INSERT INTO tbl_cadastro_aluno (RM, nome, data_nasc, genero, email, telefone) values(?, ?, ?, ?, ?, ?)`,
      [rm, nome, data_nasc, genero, email, telefone]
    );
    return response.status(201).json({response: "Aluno cadastrado com sucesso."})
  } catch (err) {
    console.error("Erro ao cadastrar aluno:", err);
    return response.status(400).json({ err: "Erro ao cadastrar aluno," });
  }

});

routes.put("/:RM", async (request, response) =>{
  const { RM } = request.params;
  const { rm, nome, data_nasc, genero, email, telefone } = request.body;

  try{

    const rmRegex = /^\d{7}$/;
    if(!rm || !rmRegex.test(rm.toLowerCase().trim())){
      return response.status(400).json({err: "Rm inválido"})
    }

    const nomeRegex = /^[\p{L}\s\-']{2,45}$/u;
    if(!nome || !nomeRegex.test(nome.trim())){
      return response.status(400).json({err: "O campo 'Nome' não pode conter numeros ou caracteres especiais, e deve conter entre 2 a 45 caracteres."});
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!email || !emailRegex.test(email.trim())){
      return response.status(400).json({err: "E-mail inválido"});
    }

    if(genero.toLowerCase() !== "feminino" && genero.toLowerCase() !== "masculino" && genero.toLowerCase() !== "não binario" && genero.toLowerCase() !== "prefiro não informar" && genero.toLowerCase() !== "outros"){
      return response.status(400).json({err: "Campo 'Genero' inválido"});
    }
    
    const telefoneRegex = /^\d{10,20}$/;
    if(!telefone || !telefoneRegex.test(telefone.trim())){
      return response. status(400).json({err: "Telefone inválido."});
    }
    
    const [rows] = await connection.execute(
      `UPDATE tbl_cadastro_aluno set RM = ?, nome = ?, data_nasc = ?, genero = ?, email = ?, telefone = ? WHERE deletedAt IS NULL AND RM = ?`,
      [rm, nome, data_nasc, genero, email, telefone, RM]
    );
    if(rows.affectedRows === 0){
      return response.status(400).json({err: "Aluno não encontrado."});
    }

    return response.status(201).json({response: "Aluno atualizado com sucesso."})
  }catch(error){
    console.error("Erro ao atualizar aluno", error);
    return response.status(500).json({err: "Erro no servidor."})
  }
})

routes.delete("/:id", async (request, response) =>{
  const { id } = request.params;
  

  if(isNaN(id)){
    return response.status(400).json({err: "O id do aluno deve conter um valor númerico."})
  }
  try{
    const dataDelete = new Date();
    const [rows] = await connection.execute(`UPDATE tbl_cadastro_aluno SET deletedAt = ? WHERE ID = ?`, [dataDelete, id]);

    if(rows.affectedRows == 0){
      return response.status(400).json({err: "Aluno não encontrado."});
    };
    return response.status(201).json({response: "Aluno deletado com sucesso."});
  }catch (err){
    console.error("Erro ao deletar aluno",err);
    return response.status(500).json({err: "Erro no servidor."});
  };
});

export default routes;  
