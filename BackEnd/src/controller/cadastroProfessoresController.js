import express, { request, response } from 'express';
import { getConnection } from '../database/data-souce.js';
import {validarCPF} from '../utils/cpfValidator.js';
// import  {generateNewPassword} from '../utils/geradorSenha.js'; importação para gerar uma nova senha para o usuário
// import { sendEmail } from '../helpers/nodemailer.js'; Função para mandar o email

const routes = express.Router();
const connection = await getConnection()

routes.get("/", async (request, response) => {
    const {nome, cpf, rm} = request.query;
    
    try{
        let sql = `SELECT * FROM tbl_login_professor WHERE deletedAt IS NULL`;
        const params = [];
        if(nome){
            sql += ` AND nome LIKE ?`;
            params.push(`%${nome}%`);
        }

        if(cpf){
            sql += ` AND CPF = ?`;
            params.push(cpf);
        }

        if(rm){
        sql += ` AND RM = ?`;
        params.push(rm);
        }
        const [rows] = await connection.execute(sql, params);

        if (!Array.isArray(rows) || rows.length === 0) {
            return response.status(404).json({ err: "Professor não encontrado." });
        }

        return response.status(200).json({response: rows});
    }catch(err){
        console.log("Erro ao buscar professor:", err);
        return response.status(500).json({err: "Erro no servidor."});
    }
});


routes.post("/", async (request, response) => {
    const {rm, cpf, nome, email, senha} = request.body;

    try{
        const rmString = String(rm).trim();
        const rmRegex = /^\d{6,8}$/;
        if(!rmRegex.test(rmString)){
            return response.status(400).json({err: "RM inválido."});
        }

        if(!validarCPF(cpf)){
            return response.status(400).json({err: "Cpf inválido."});
        }

        const nomeRegex = /^[\p{L}\s\-']{2,45}$/u;
        if(!nome || !nomeRegex.test(nome.trim())){
            return response.status(400).json({erro: "Nome inválido."});
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!email || !emailRegex.test(email.trim())){
            return response.status(400).json({erro: "E-mail inválido"});
        }

        if(senha.length < 6){
            return response.status(400).json({err: "A senha deve conter no minimo 6 caracteres."});
        }

        await connection.execute(`INSERT INTO tbl_login_professor (RM, CPF, nome, email, senha) VALUES(?, ?, ?, ?, ?)`,
            [rm, cpf, nome, email, senha]
        );
        return response.status(201).json({response: "Professor cadastrado com sucesso."});  
    }catch(err){
        console.log("Erro ao cadastrar professor:", err);
        return response.status(500).json({err: "Erro no servidor."});
    }
});

routes.put("/:rm", async (request, response) => {
    const {rm} = request.params;
    const {RM, CPF, nome, email, senha} = request.body;


    try{
    
        const rmString = String(RM).trim();
        const rmRegex = /^\d{7}$/;
        if(!rmRegex.test(rmString)){
            return response.status(400).json({err: "RM inválido."});
        }

        if(!validarCPF(CPF)){
            return response.status(400).json({err: "Cpf inválido."});
        }

        const nomeRegex = /^[\p{L}\s\-']{2,45}$/u;
        if(!nome || !nomeRegex.test(nome.trim())){
            return response.status(400).json({erro: "Nome inválido."});
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!email || !emailRegex.test(email.trim())){
            return response.status(400).json({erro: "E-mail inválido"});
        }

        if(senha.length < 6){
            return response.status(400).json({err: "A senha deve conter no minimo 6 caracteres."});
        }

        const [rows] = await connection.execute(
            `UPDATE tbl_login_professor SET RM = ?, CPF = ?, nome = ?, email = ?, senha = ? WHERE deletedAt IS NULL AND RM = ?`,
            [RM, CPF, nome, email, senha, rm]
        );

        if(rows.length === 0){
            return response.status(400).json({err: "Professor não encontrado."})
        }
        return response.status(201).json({response: "Professor atualizado com sucesso."}); 
    }catch(err){
        console.log("Erro ao atualizar professor:", err);
        return response.status(500).json({err: "Erro no servidor."});   
    }
});

// routes.put("/reset", async(request, response) => {
//     const {email} = request.body;

//     try{
//         const [rows] = await connection.execute(
//             `SELECT * FROM tbl_login_professor WHERE deletedAt IS NULL AND email = ?`,[email]
//         );

//         if(rows.length === 0){
//             return response.status(400).json({err: "Email inválido."})
//         }

//         const newPassword = generateNewPassword();
//         console.log(email)
//         const results = await connection.execute(
//             `UPDATE tbl_login_professor SET senha = ? WHERE email = ?`, [newPassword, email]
//         );
//         sendEmail(newPassword, rows[0].email);
//         return response.status(200).json({response: "Senha enviada para o email cadastrado."})
//     }catch(err){
//         console.log("Erro ao enviar email: ", err)
//         return response.status(500).json({err: "Erro no servidor."})
//     }
    
// })Exemplo de como usar o nodemailer para recuperação de senhas....

routes.delete("/:rm", async(request, response) => {
    const {rm} = request.params;

    if(isNaN(rm)){
        return response.status(400).json({err: "O rm deve conter um valor válido."});
    }

    try{
        const dataDelet = new date;
        const [rows] = connection.execute(
            `UPDATE tbl_login_professor SET deletedAt = ? WHERE RM = ?`,
             [dataDelet, rm]);

         if(rows.affectedRows === 0){
            return response.status(400).json({err: "Professor não encontrado."});
        };
        return response.status(200).json({err: "Professor deletado com sucesso"});
    }catch(err){
        console.log("Erro ao deletar professor:", err);
        return response.status(500).json({err: "Erro no servidor."});
    }
})

export default routes;