import express, { request, response } from 'express';
import { getConnection } from '../database/data-souce.js';

const routes = express.Router();
const connection = await getConnection();

routes.get("/", async (request, response) => {
    
    try{
        const [rows] = await connection.execute(`SELECT * FROM tbl_alergias`);

        if (!Array.isArray(rows) || rows.length === 0) {
            return response.status(404).json({ err: "Alergia não encontrada." });
        }
        return response.status(200).json({response: rows});
    } catch(err){
        console.log("Erro ao buscar alergia:", err);
        return response.status(500).json({err: "Erro no servidor."});
    }
});

routes.post("/", async(request, response) => {
    const {alergias, tp_alergias} = request.body;

    try{
        const alergiasOpitions = ["sim", "não"];
        if(!alergiasOpitions.includes(alergias.toLowerCase())){
            return response.status(400).json({err: "Opção de alergias inválida."});
        }

        if (tp_alergias.length > 200) {
            return response.status(400).json({ err: "Tipo de alergia inválido." });
        }
        const [rows] = await connection.execute(`INSERT INTO tbl_alergias (alergias, tp_alergia) values(?, ?)`, [alergias, tp_alergias]);

        return response.status(201).json({response: "Alergia cadastrada com sucesso."});
    }catch(err){
        console.log("Erro ao cadastrar alergia.", err);
        return response.status(500).json({err: "Erro no servidor."});
    }
})

routes.put("/:id", async (request, response) => {
    const {id} = request.params;
    const {alergias, tp_alergia} = request.body;

    try{
        const alergiasOpitions = ["sim", "não"];
        if(!alergiasOpitions.includes(alergias.toLowerCase())){
            return response.status(400).json({err: "Opção de alergias inválida."});
        }
        console.log(tp_alergia)
        if (tp_alergia.length > 200) {
            return response.status(400).json({ err: "Tipo de alergia inválido." });
        }
        const [rows] = await connection.execute(`UPDATE tbl_alergias SET alergias = ?, tp_alergia = ? WHERE id = ?`, [alergias, tp_alergia, id]);

        if (rows.affectedRows === 0) {
            return response.status(400).json({ err: "Alergia não encontrada." });
        }
        return response.status(200).json({response: "Alergia atualizada com sucesso."})
    }catch(err){
        console.log("Erro ao atualizar alergia:", err);
        return response.status(500).json({err: "Erro no servidor."});
    }
})

    //Precisa de um delete aqui?????????????????????????????????? 🤔;

export default routes;
