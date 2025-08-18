import express, { request, response } from 'express';
import { getConnection } from '../database/data-souce.js';
import { param } from 'express-validator';

const routes = express.Router();
const connection = await getConnection();

routes.get("/", async(request, response) => {
    try{
        const [rows] = await connection.execute(`SELECT * FROM tbl_deficiencias`)
        if (!Array.isArray(rows) || rows.length === 0) {
            return response.status(404).json({ err: "Deficiência não encontrada." });
        }
        return response.status(200).json({response: rows});
    } catch(err){
        console.log("Erro ao buscar deficiência:", err);
        return response.status(500).json({err: "Erro no servidor."});
    }
}); 

routes.post("/", async(request, response) => {
    const {deficiencia, tp_deficiencia} = request.body;

    try{
        const deficienciaOptions = ["sim", "não"];
        if(!deficienciaOptions.includes(deficiencia.toLowerCase())){
            return response.status(400).json({err: "Opção de deficiência inválida."});
        }
        
        if(tp_deficiencia.length > 200){
            return response.status(400).json({  err: "Tipo de deficiência inválido."});
        }

        const [rows] = await connection.execute(`INSERT INTO tbl_deficiencias (deficiencia, tp_defi) VALUES(?, ?)`, [deficiencia, tp_deficiencia]);
        return response.status(201).json({response: "Deficiência cadastrada com sucesso."});
    }catch(err){
        console.log("Erro ao cadastrar deficiência:", err);
        return response.status(500).json({err: "Erro no servidor."});
    }
})

routes.put("/:id", async(request, response) => {
    const {id} = request.params;
    const {deficiencia, tp_deficiencia} = request.body;

    if(isNaN(id)){
        return response.status(400).json({err: "Id deve conter um valor válido."});
    }

    try{
        const deficienciaOptions = ["sim", "não"];
        if(!deficienciaOptions.includes(deficiencia.toLowerCase())){
            return response.status(400).json({err: "Opção de deficiência inválida."});
        }
        
        if(tp_deficiencia.length > 200){
            return response.status(400).json({err: "Tipo de deficiência inválido."});
        }

        const [rows] = await connection.execute(`UPDATE tbl_deficiencias SET deficiencia = ?, tp_defi = ? WHERE id = ?`, [deficiencia, tp_deficiencia, id]);

        if(rows.affectedRows === 0 ){
            return response.status(404).json({err: "Deficiência não encontrada."});
        }
        return response.status(200).json({response: "Deficiência atualizada com sucesso."})
    }catch(err){
        console.log("Erro ao atualizar deficiência:", err);
        return response.status(500).json({err: "Erro no servidor."});
    }
});

//Precisa de um delete aqui?????????????????????????????????? 🤔;

export default routes;