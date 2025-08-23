import express from "express";
import { getConnection } from "../database/data-souce.js";

const routes = express.Router();
const connection = await getConnection();

routes.get("/", async (request, response) => {
  const {id, ra, nome} = request.query;
  try {
    let sql = `SELECT * FROM tbl_cadastro_al WHERE deletedAt IS NULL`;
    const params = [];

    if(id){
      sql += ` AND ID = ?`;
      params.push(id);
    }

    if(ra){
      sql += ` AND ra = ?`;
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
  const { ra, nome, data_nasc, genero, email, telefone, cep } = request.body;

  try{

    const enderecoExistente = await connection.execute("SELECT * FROM tbl_endereco WHERE CEP = ? AND deletedAt IS NULL", [cep]);
    const id_endereco = enderecoExistente[0][0]?.id;
    if(enderecoExistente[0].length === 0){
      return response.status(400).json({err: "Endereço não encontrado."})
    }

    const [existe] = await connection.execute(
      "SELECT * FROM tbl_cadastro_al WHERE ra = ? AND deletedAt IS NULL",
      [ra]
    );
    if (existe.length > 0) {
      return response.status(400).json({ err: "Este RA já está em uso por outro aluno." });
    }

    const raRegex = /^\d{7}$/;
    if(!ra || !raRegex.test(ra.toLowerCase().trim())){
      return response.status(400).json({err: "Ra inválido"})
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
      `INSERT INTO tbl_cadastro_al (ra, nome, data_nasc, genero, email, telefone, id_endereco) values(?, ?, ?, ?, ?, ?, ?)`,
      [ra, nome, data_nasc, genero, email, telefone, id_endereco]
    );
    return response.status(201).json({response: "Aluno cadastrado com sucesso."})
  } catch (err) {
    console.error("Erro ao cadastrar aluno:", err);
    return response.status(400).json({ err: "Erro ao cadastrar aluno," });
  }

});

routes.put("/:RA", async (request, response) =>{
  const { RA } = request.params;
  const { ra, nome, data_nasc, genero, email, telefone, cep } = request.body;

  try{

     const enderecoExistente = await connection.execute("SELECT * FROM tbl_endereco WHERE CEP = ? AND deletedAt IS NULL", [cep]);
    const id_endereco = enderecoExistente[0][0]?.id;
    if(enderecoExistente[0].length === 0){
      return response.status(400).json({err: "Endereço não encontrado."})
    }
    
    const raRegex = /^\d{7}$/;
    if(!ra || !raRegex.test(ra.toLowerCase().trim())){
      return response.status(400).json({err: "Ra inválido"})
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
      `UPDATE tbl_cadastro_al set ra = ?, nome = ?, data_nasc = ?, genero = ?, email = ?, telefone = ?, id_endereco = ? WHERE deletedAt IS NULL AND ra = ?`,
      [ra, nome, data_nasc, genero, email, telefone, id_endereco, RA]
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

routes.delete("/:RA", async (request, response) =>{
  const { RA } = request.params;
  

  if(!RA){
    return response.status(400).json({err: "O Ra do aluno deve conter algum um valor númerico."})
  }
  try{
    const dataDelete = new Date();
    const [rows] = await connection.execute(`UPDATE tbl_cadastro_al SET deletedAt = ? WHERE ra = ?`, [dataDelete, RA]);

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
