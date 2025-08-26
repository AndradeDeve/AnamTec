import express, { request, response } from 'express';
import { getConnection } from '../database/data-souce.js';
import {validarCPF} from '../utils/cpfValidator.js';
import { hash } from 'bcrypt';

const routes = express.Router();
const connection = await getConnection()

routes.get("/", async (request, response) => {
    const {nome, cpf} = request.query;
    
    try{
        let sql = `SELECT id, rm, CPF, nome, email, id_curso, id_type  FROM tbl_usuario WHERE deletedAt IS NULL`;
        const params = [];
        if(nome){
            sql += ` AND nome LIKE ?`;
            params.push(`%${nome}%`);
        }

        if(cpf){
            sql += ` AND CPF = ?`;
            params.push(cpf);
        }

        const [rows] = await connection.execute(sql, params);

        if (!Array.isArray(rows) || rows.length === 0) {
            return response.status(404).json({ err: "Usuário não encontrado." });
        }

        return response.status(200).json({response: rows});
    }catch(err){
        console.log("Erro ao buscar usuário:", err);
        return response.status(500).json({err: "Erro no servidor."});
    }
});


routes.post("/", async (request, response) => {
    const {cpf, nome, email, senha, cargo, curso} = request.body;
    let {rm} = request.body;
    try{
        if(rm){
            const rmRegex = /^\d{7,15}$/;
            if(!rm || !rmRegex.test(rm.toLowerCase().trim())){
                return response.status(400).json({err: "Rm inválido"})
            }
        }else{
            rm = null;
        }
        
        let id_curso; 

        if (curso) {
            const [cursoExiste] = await connection.execute(
                `SELECT * FROM tbl_curso WHERE curso = ?`, 
                [curso]
            );

            if (cursoExiste.length === 0) {
                return response.status(400).json({ err: "Curso inválido" });
            }

            id_curso = cursoExiste[0]?.id; // só atribui depois da validação
        } else {
            id_curso = null;
        }   
        
        if(!validarCPF(cpf)){
            return response.status(400).json({err: "Cpf inválido."});
        }
        cargo.toLowerCase()
        const [tipoExiste] =  await connection.execute(`SELECT * FROM tbl_type WHERE tipo = ?`, [cargo]);
        
        const id_tipo = tipoExiste[0]?.id;

        if (tipoExiste.length === 0) {
            return response.status(400).json({ erro: "Tipo de usuário inválido." });
        }

        const nomeRegex = /^[\p{L}\s\-']{2,45}$/u;
        if(!nome || !nomeRegex.test(nome.trim())){
            return response.status(400).json({err: "Nome inválido."});
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!email || !emailRegex.test(email.trim())){
            return response.status(400).json({erro: "E-mail inválido"});
        }

        if(!senha || senha.length < 6){
            return response.status(400).json({err: "A senha deve conter no minimo 6 caracteres."});
        }

        const hashedSenha = await hash(senha, 10);

        await connection.execute(`INSERT INTO tbl_usuario (rm, CPF, nome, email, senha, id_type, id_curso) VALUES(?, ?, ?, ?, ?, ?, ?)`,
            [rm, cpf, nome, email, hashedSenha, id_tipo, id_curso]
        );
        return response.status(201).json({response: "Cadastro efetuado com sucesso."});  
    }catch(err){
        console.log("Erro ao efetuar o cadastrar:", err);
        return response.status(500).json({err: "Erro no servidor."});
    }
});

routes.put("/:id", async (request, response) => {
    const {id} = request.params;
    const {cpf, nome, email, senha, id_type, id_curso} = request.body;


    try{
        if(!validarCPF(cpf)){
            return response.status(400).json({err: "Cpf inválido."});
        }

         const [cursoExiste] = await connection.execute(`SELECT * FROM tbl_curso WHERE id = ?`, [id_curso]);

        if(cursoExiste.length === 0){
            return response.status(400).json({err: "Curso inválido"});
        }

        const [tipoExiste] =  await connection.execute(`SELECT * FROM tbl_type WHERE id = ?`, [id_type]);

        if (tipoExiste.length === 0) {
            return res.status(400).json({ erro: "Tipo de usuário inválido." });
        }

        const nomeRegex = /^[\p{L}\s\-']{2,45}$/u;
        if(!nome || !nomeRegex.test(nome.trim())){
            return response.status(400).json({err: "Nome inválido."});
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!email || !emailRegex.test(email.trim())){
            return response.status(400).json({erro: "E-mail inválido"});
        }

        if(senha.length < 6){
            return response.status(400).json({err: "A senha deve conter no minimo 6 caracteres."});
        }


        const [rows] = await connection.execute(
            `UPDATE tbl_usuario SET CPF = ?, nome = ?, email = ?, senha = ?, id_type = ?, id_curso = ? WHERE deletedAt IS NULL AND id = ?`,
            [cpf, nome, email, senha, id_type, id_curso, id]
        );

        if(rows.length === 0){
            return response.status(400).json({err: "Usuário não encontrado."})
        }
        return response.status(201).json({response: "Usuário atualizado com sucesso."}); 
    }catch(err){
        console.log("Erro ao atualizar Usuário:", err);
        return response.status(500).json({err: "Erro no servidor."});   
    }
});

// /Exemplo de como usar o nodemailer para recuperação de senhas....

routes.delete("/:cpf", async(request, response) => {
    const {cpf} = request.params;

    if(!validarCPF(cpf)){
            return response.status(400).json({err: "Cpf inválido."});
        }
    try{
        const dataDelet = new Date();
        const [rows] = await connection.execute(
            `UPDATE tbl_usuario SET deletedAt = ? WHERE CPF = ?`,
             [dataDelet, cpf]);

         if(rows.affectedRows === 0){
            return response.status(400).json({err: "Usuário não encontrado."});
        };
        return response.status(200).json({err: "Usuário deletado com sucesso"});
    }catch(err){
        console.log("Erro ao deletar usuário:", err);
        return response.status(500).json({err: "Erro no servidor."});
    }
})

export default routes;