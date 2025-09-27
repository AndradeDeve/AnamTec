import express from 'express';
import pool from '../database/data-source.js';
import { hash } from 'bcrypt';
import { VerificarSenha } from '../utils/jwt.js';

const routes = express.Router();

routes.put("/", async(request, response) => {
    const email = request.user.email;
    const {senhaAtual, novaSenha, confirmarSenha} = request.body;
    try{
        const [results] = await pool.query(`select * from tbl_usuario where email = ? and deletedAt is null`, [email]);
        if(results.length === 0){
            return response.status(404).json({err: "Usuário não encontrado. Tente fazer o login novamente."});
        }

        if(novaSenha !== confirmarSenha){
            return response.status(400).json({err: "As senhas não conferem."});
        }

        if(!senhaAtual || senhaAtual.length < 6){
            return response.status(400).json({err: "A senha deve conter no mínimo 6 caracteres."});
        }

        const user = results[0];
        const senhaValida = await VerificarSenha(senhaAtual, user.senha);
        if(!senhaValida){
            return response.status(401).json({err: "Senha inválida."});
        }

        const hashedSenha = await hash(novaSenha, 10);
        const [updateResult] = await pool.query(`UPDATE tbl_usuario SET senha = ? WHERE email = ? and deletedAt is null`, [hashedSenha, email]);
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
