import express from 'express';
import { getConnection } from '../database/data-souce.js';
import  {generateNewPassword} from '../utils/geradorSenha.js'; 
import { sendEmail } from '../helpers/nodemailer.js'; 
import { genereteToken } from '../utils/jwt.js';
import { VerificarSenha } from '../utils/jwt.js';

const routes = express.Router();
const connection = await getConnection();

routes.post("/", async(request, response) => {
    const {email, senha} = request.body;

    try{
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!email || !emailRegex.test(email.trim())){
            return response.status(401).json({err: "E-mail inválido"});
        }

        const [rows] = await connection.execute(`SELECT * FROM tbl_usuario WHERE email = ? AND deletedAt IS NULL`, [email]);

        if(rows.length === 0){
            return response.status(401).json({err: "Usuário não encontrado."});
        }

        const user = rows[0];
        
        const senhaValida = await VerificarSenha(senha, user.senha);
        if(!senhaValida){
            return response.status(401).json({err: "Senha inválida."});
        }        
        const token = genereteToken({user:user.nome, email:user.email, id_type:user.id_type});
        
        return response.status(200).json({response: "Login efetuado com sucesso.", token});
    }catch(err){
        console.log("Erro ao efetuar o login:", err);
        return response.status(500).json({err: "Erro no servidor."});
    }
})

routes.put("/reset", async(request, response) => {
    const {email} = request.body;

    try{
        const [rows] = await connection.execute(
            `SELECT * FROM tbl_usuario WHERE deletedAt IS NULL AND email = ?`,[email]
        );

        if(rows.length === 0){
            return response.status(400).json({err: "Email inválido."})
        }

        const newPassword = generateNewPassword();
        console.log(email)
        const results = await connection.execute(
            `UPDATE tbl_usuario SET senha = ? WHERE email = ?`, [newPassword, email]
        );
        sendEmail(newPassword, rows[0].email);
        return response.status(200).json({response: "Senha enviada para o email cadastrado."})
    }catch(err){
        console.log("Erro ao enviar email: ", err)
        return response.status(500).json({err: "Erro no servidor."})
    }
    
})

export default routes;