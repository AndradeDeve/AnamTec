import express, { request, response } from 'express';
import { validarCPF } from '../utils/cpfValidator.js';
import { getConnection } from '../database/data-souce.js';

const routes = express.Router();
const connection = await getConnection();

routes.get("/", async (request, response) => {
    const {id, cpf, nome} = request.query;
    try{
        let sql = `SELECT * FROM tbl_responsavel WHERE deletedAt IS NULL`;
        const params = [];

        if(id){
            sql += ` AND ID = ?`;
            params.push(id); 
        }

        if(cpf){
            sql += ` AND CPF = ?`;
            params.push(cpf);
        }

        if(nome){
            sql += ` AND nome LIKE ?`;
            params.push(`%${nome}%`);
        }
        const [rows] = await connection.execute(sql, params);

        if (!Array.isArray(rows) || rows.length === 0) {
            return response.status(404).json({ err: "Responsavel não encontrado." });
        }
        return response.status(200).json({response: rows});
    }catch(err){
        console.log("Erro ao buscar responsável:", err);
        return response.status(500).json({err: "Erro no servidor."});
    }
})

routes.post("/", async (request, response) =>{
    const {cpf, nome, data_nasc, estado_civil, email, telefone} = request.body;
    try{
        if(!validarCPF(cpf)){
            return response.status(400).json({err: "CPF inválido."});
        }

        const nomeRegex = /^[\p{L}\s\-']{2,45}$/u;
        if(!nome || !nomeRegex.test(nome.trim())){
            return response.status(400).json({erro: "Nome inválido."});
        }

        if(data_nasc <= "1935/01/01"){
            return response.status(400).json({err: " A data de nascimento não pode ser anterior a 01/01/1935."})
        }

        const estadoCivel = ["solteiro(a)", "casado(a)", "divorciado(a)", "viúvo(a)", "separado(a)"];
        if(!estadoCivel.includes(estado_civil.toLowerCase())){
            return response.status(400).json({err: "Estado civil invalido."})
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!email || !emailRegex.test(email.trim())){
            return response.status(400).json({err: "E-mail inválido"});
        }

        const telefoneRegex = /^\d{10,20}$/;
        if(!telefone || !telefoneRegex.test(telefone.trim())){
            return response. status(400).json({err: "Telefone inválido."});
        }

        await connection.execute(
            `INSERT INTO tbl_responsavel (CPF, nome, data_nasc, estado_civil, email, telefone) VALUES(?, ?, ?, ?, ?, ?)`,
            [cpf, nome, data_nasc, estado_civil, email, telefone]
        );
        return response.status(201).json({response: "Responsável cadastrado com sucesso."})

    }catch(err){
        console.log("Erro ao adicionar responsavel:", err);
        return response.status(500).json({err: "Erro no servidor."});
    }

})

routes.put("/:CPF", async (request, response) => {
    const {CPF} = request.params;
    const {cpf, nome, data_nasc, estado_civil, email, telefone} = request.body;
    try{
        if(!validarCPF(cpf)){
            return response.status(400).json({err: "CPF inválido."});
        }

        const nomeRegex = /^[\p{L}\s\-']{2,45}$/u;
        if(!nome || !nomeRegex.test(nome.trim())){
            return response.status(400).json({erro: "Nome inválido."});
        }

        if(data_nasc <= "1935/01/01"){
            return response.status(400).json({err: " A data de nascimento não pode ser anterior a 01/01/1935."})
        }

        const estadoCivel = ["solteiro(a)", "casado(a)", "divorciado(a)", "viúvo(a)", "separado(a)"];
        if(!estadoCivel.includes(estado_civil.toLowerCase())){
            return response.status(400).json({err: "Estado civil invalido."})
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!email || !emailRegex.test(email.trim())){
            return response.status(400).json({err: "E-mail inválido"});
        }

        const telefoneRegex = /^\d{10,20}$/;
        if(!telefone || !telefoneRegex.test(telefone.trim())){
            return response. status(400).json({err: "Telefone inválido."});
        }

        const [rows] = await connection.execute(
            `UPDATE tbl_responsavel SET CPF = ?, nome = ?, data_nasc = ?, estado_civil = ?, email = ?, telefone = ? WHERE deletedAt IS NULL AND CPF = ?`,
            [cpf, nome, data_nasc, estado_civil, email, telefone, CPF]
        );
        if(rows.affectedRows === 0){
            return response.status(400).json({err: "Responsavel não encontrado."})
        }
        
        return response.status(200).json({response: "Responsavel atualizado com sucesso."});
    }catch(err){
        console.log("Erro ao atualizar responsavel:", err);
        return response.status(500).json({err: "Erro no servidor."});
    }
})

routes.delete("/:cpf", async (request, response) => {
    const {cpf} = request.params;

    if(isNaN(cpf)){
        return response.status(400).json({err: "O CPF deve conter um valor válido."});
    }

    try{
        const dataDelet = new Date;
        const [rows] = await connection.execute(
            `UPDATE tbl_responsavel SET deletedAt = ? WHERE CPF = ?`,
            [dataDelet, cpf]
        );

        if(rows.affectedRows == 0){
            return response.status(400).json({err: "Professor não encontrado."});
        };
        return response.status(200).json({err: "Responsavel deletado com sucesso."});

    }catch(err){
        console.log("Erro ao deleter responsavel:", err);
        return response.status(500).json({err: "Erro no servidor."});
    }
})

export default routes;
