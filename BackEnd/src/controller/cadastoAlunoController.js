import express, { request } from "express";
import { connection } from "../database/data-souce.js";

const routes = express.Router();

routes.get("/", async(req, res) => {
  const sql = await connection.execute("SELECT * FROM tbl_cadastro_aluno WHERE deletedAt IS NULL");

  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Erro ao buscar alunos:", err);
      return res.status(500).json({ erro: "Erro no servidor." });
    }

    return res.status(200).json({ response: results });
  });
});

routes.post("/", async(request, response) =>{
  const { ra, nome, data_nasc, genero, email, telefone } = request.body;

  try{
    if(ra.length < 13 || ra.length > 13){
      return response.status(400).send({"response": "O campo 'RA' deve conter 13 caracteres."});
    }

    const nomeRegex = /^[\p{L}\s\-']{2,45}$/u;
    if(!nome || !nomeRegex.test(nome.trim())){
      return response.status(400).send({"response": "O campo 'Nome' não pode conter numeros ou caracteres especiais, e deve conter entre 2 a 45 caracteres."});
    }

    if(!email.toLowerCase().includes("@")){
      return response.status(400).send({"response": "E-mail inválido"});
    }

    if(genero.toLowerCase() !== "feminino" && genero.toLowerCase() !== "masculino" && genero.toLowerCase() !== "não binario" && genero.toLowerCase() !== "prefiro não informar" && genero.toLowerCase() !== "outros"){
      return response.status(400).send({"response": "Campo 'Genero' inválido"});
    }


    if(telefone.length < 11 || telefone.length > 20){
      return response. status(400).send({"response": "O campo 'Telefone' conter entre 11 e 20 caracteres."});
    }
    await connection.execute(
      `INSERT INTO tbl_cadastro_aluno (ra, nome, data_nasc, genero, email, telefone) values(?, ?, ?, ?, ?, ?)`,
      [ra, nome, data_nasc, genero, email, telefone]
    );
    return response.status(201).send({"response": "Aluno cadastrado com sucesso."})
  } catch (err) {
    console.error("Erro ao cadastrar aluno:", err);
    return response.status(400).json({ response: "Erro ao cadastrar aluno," });
  }

});

routes.delete("/:ID", async (request, response) =>{
  const { ID } = request.params;
  

  if(isNaN(ID)){
    return response.status(400).send({"response": "O id do aluno deve conter um valor númerico."})
  }
  try{
    const dataDelete = new Date();
    const resut = connection.execute(`UPDATE tbl_cadastro_aluno SET deletedAt = ? WHERE ID = ?`, [dataDelete, ID]);

    if(resut.affectedRows == 0){
      return response.status(400).send({"response": "Aluno não encontrado."});
    };
    return response.status(201).send({"response": "Aluno deletado com sucesso."});
  }catch (err){
    console.error("Erro ao deletar aluno",err);
    return response.status(500).send({"response": "Erro ao deletar aluno."});
  };
});

export default routes;  
