import express, { request, response } from 'express';
import { getConnection } from '../database/data-souce.js';

const routes = express.Router();
const connection = await getConnection();

routes.get("/", async(request, response) => {
    try{
        const [rows] = await connection.execute(`SELECT * FROM tbl_cirurgias`)
      if (!Array.isArray(rows) || rows.length === 0) {
            return response.status(404).json({ err: "Cirurgia não encontrada." });
        }
        return response.status(200).json({response: rows});
    } catch(err){
        console.log("Erro ao buscar cirurgias:", err);
        return response.status(500).json({err: "Erro no servidor."});
    }
});

routes.post("/", async(request, response) => {
    const {internacao_cirugia, tp_cirurgia} = request.body;

    try{
        const internacao_cirugiaOption = ["sim", "não"];
        if(!internacao_cirugiaOption.includes(internacao_cirugia.toLowerCase())){
            return response.status(400).json({err: "Opção de cirurgia inválida."});
        }

        if(tp_cirurgia.length > 200){
            return response.status(400).json({err: "Tipo de cirurgia inválido."});
        }

        const [rows] = await connection.execute(`INSERT INTO tbl_cirurgias (internacao_cirurgia, tp_cirurgia) VALUES(?, ?)`, [internacao_cirugia, tp_cirurgia]);
        
        return response.status(201).json({response: "Cirurgia cadastrada com sucesso."});
    }catch(err){
        console.log("Erro ao cadastrar cirurgia:", err);
        return response.status(500).json({err: "Erro no servidor."});
    }
})

routes.put("/:id", async(request, response) => {
    const {id} = request.params;
    const {internacao_cirugia, tp_cirurgia} = request.body;

    if(isNaN(id)){
        return response.status(400).json({err: "O Id deve conter um valor válido."});
    }
 try{
        const internacao_cirugiaOption = ["sim", "não"];
        if(!internacao_cirugiaOption.includes(internacao_cirugia.toLowerCase())){
            return response.status(400).json({err: "Opção de cirurgia inválida."});
        }

        if(tp_cirurgia.length > 200){
            return response.status(400).json({err: "Tipo de cirurgia inválido."});
        }

        const [rows] = await connection.execute(`UPDATE tbl_cirurgias SET internacao_cirurgia = ?, tp_cirurgia = ? WHERE id = ?`, [internacao_cirugia, tp_cirurgia, id]);
        
        if(rows.affectedRows === 0){
            return response.status(404).json({err: "Cirurgia não encontrada."})
        }

        return response.status(201).json({response: "Cirurgia atualizada com sucesso."});
    }catch(err){
        console.log("Erro ao Atualizar cirurgia:", err);
        return response.status(500).json({err: "Erro no servidor."});
    }
})
export default routes;