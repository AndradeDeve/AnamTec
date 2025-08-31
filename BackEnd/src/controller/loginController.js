import express from 'express';
import { getConnection } from '../database/data-souce.js';
import  {generateNewPassword} from '../utils/geradorSenha.js'; 
import { sendEmail } from '../helpers/nodemailer.js'; 
import { genereteToken } from '../utils/jwt.js';
import { hash } from 'bcrypt';
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
        
        return response.status(200).json({response: "Login efetuado com sucesso.", token, typeUser:user.id_type, email:user.email});
    }catch(err){
        console.log("Erro ao efetuar o login:", err);
        return response.status(500).json({err: "Erro no servidor."});
    }
})

routes.put("/emailReset", async(request, response) => {
    const {email} = request.body;

    try{
        const [rows] = await connection.execute(
            `SELECT * FROM tbl_usuario WHERE deletedAt IS NULL AND email = ?`,[email]
        );

        if(rows.length === 0){
            return response.status(400).json({err: "Email inválido."})
        }

        const newPassword = generateNewPassword();
        const hashedSenha = await hash(newPassword, 10);
        const [results] = await connection.execute(
            `UPDATE tbl_usuario SET senha = ? WHERE email = ?`, [hashedSenha, email]
        );
        sendEmail(newPassword, rows[0].email);
        return response.status(200).json({response: "Senha enviada para o email cadastrado."})
    }catch(err){
        console.log("Erro ao enviar email: ", err)
        return response.status(500).json({err: "Erro no servidor."})
    }
    
})

routes.put("/", async(request, response) => {
    const email = request.user.email;
    const {senha, senhaNova, confirmaSenha} = request.body;
    console.log("email", email);
    try{
        const [results] = await connection.execute(`select * from tbl_usuario where email = ? and deletedAt is null`, [email]);
        if(results.length === 0){
            return response.status(404).json({err: "Usuário não encontrado. Tente fazer o login novamente."});
        }

        if(senhaNova !== confirmaSenha){
            return response.status(400).json({err: "As senhas não conferem."});
        }

        if(!senha || senha.length < 6){
            return response.status(400).json({err: "A senha deve conter no mínimo 6 caracteres."});
        }

        const user = results[0];
        const senhaValida = await VerificarSenha(senha, user.senha);
        if(!senhaValida){
            return response.status(401).json({err: "Senha inválida."});
        }

        const hashedSenha = await hash(senhaNova, 10);
        const [updateResult] = await connection.execute(`UPDATE tbl_usuario SET senha = ? WHERE email = ? and deletedAt is null`, [hashedSenha, email]);
        if(updateResult.length === 0){
            return response.status(400).json({err: "Erro ao atualizar a senha. Tente novamente."});
        }
        
        return response.status(200).json({response: "Senha atualizada com sucesso."});
    }catch(err){
        console.log("Erro ao resetar senha:", err);
        return response.status(500).json({err: "Erro no servidor."});
    }
})

export default routes;