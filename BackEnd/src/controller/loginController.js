import express from 'express';
import pool from '../database/data-source.js';
import { genereteToken } from '../utils/jwt.js';
import {generateNewPassword} from '../utils/geradorSenha.js'; 
import { sendEmail } from '../helpers/nodemailer.js'; 
import { hash } from 'bcrypt';
import { VerificarSenha } from '../utils/jwt.js';

const routes = express.Router();

routes.post("/", async(request, response) => {
    const {email, senha} = request.body;

    try{
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!email || !emailRegex.test(email.trim())){
            return response.status(401).json({err: "E-mail inválido"});
        }

        const [rows] = await pool.query(`
            SELECT
            u.nome as nome,
            u.senha as senha,
            u.email as email,
            t.tipo as type
            FROM tbl_usuario u
            INNER JOIN juncao_type_user jut ON u.id = jut.id_user
            INNER JOIN tbl_type t ON jut.id_type = t.id 
            WHERE u.email = ? AND u.deletedAt IS NULL
            `, [email]);

        if(rows.length === 0){
            return response.status(401).json({err: "Usuário não encontrado."});
        }

        const user = rows[0];       
        
        const senhaValida = await VerificarSenha(senha, user.senha);
        if(!senhaValida){
            return response.status(401).json({err: "Senha inválida."});
        }        
        const token = genereteToken({user:user.nome, email:user.email, type:user.type});
        return response.status(200).json({response: "Login efetuado com sucesso.", token, typeUser:user.type, email:user.email});
    }catch(err){
        console.log("Erro ao efetuar o login:", err);
        return response.status(500).json({err: "Erro no servidor."});
    }
})

routes.put("/emailReset", async(request, response) => {
    const {email} = request.body;
    try{
        const [rows] = await pool.query(
            `SELECT * FROM tbl_usuario WHERE deletedAt IS NULL AND email = ?`,[email]
        );

        if(rows.length === 0){
            return response.status(400).json({err: "Email inválido."})
        }

        const newPassword = generateNewPassword();
        const hashedSenha = await hash(newPassword, 10);
        const [results] = await pool.query(
            `UPDATE tbl_usuario SET senha = ? WHERE email = ?`, [hashedSenha, email]
        );
        sendEmail(newPassword, rows[0].email);
        return response.status(200).json({response: "Senha enviada para o email cadastrado."})
    }catch(err){
        console.log("Erro ao enviar email: ", err)
        return response.status(500).json({err: "Erro no servidor."})
    }
    
})

export default routes;