import express, { request, response, Router } from 'express';
import pool from '../database/data-source.js';
import {validarCPF} from '../utils/cpfValidator.js';
import { hash } from 'bcrypt';
import { VerificarSenha } from '../utils/jwt.js';

const routes = express.Router();

routes.get("/", async (req, res) => {
    try{
        const [rows] = await pool.query(
            `SELECT 
                u.id AS id,
                u.nome AS nome_user,
                u.RM AS rm,
                u.disciplina AS disciplina, 
                c.curso AS nome_curso,
                t.tipo AS entidade,
                coord.nome AS coordenador,
                CASE    
                WHEN u.deletedAt IS NULL THEN 'ativo'
                ELSE 'inativo'
                END AS status
                FROM tbl_usuario u
                INNER JOIN juncao_curso_user juc ON u.id = juc.id_user
                INNER JOIN tbl_curso c ON juc.id_curso = c.id
                INNER JOIN juncao_type_user jut ON u.id = jut.id_user
                INNER JOIN tbl_type t ON jut.id_type = t.id
                LEFT JOIN tbl_usuario coord ON c.id_coordenador = coord.id;
            `
        );

        if(!rows && rows.length === 0){
            return res.status(404).json({err: "Usuários não encontrados."});
        }

        return res.status(200).json(rows);
    }catch(err){
        console.error("Erro: ", err);
        return response.status(500).json({err: "Erro no servisor."})
    }
})

routes.get("/count", async (request, response) => {
    try{
        const {id} = request.query;
        const [rows] = await pool.query(
            `SELECT nome, email FROM tbl_usuario WHERE id = ? AND deletedAt IS NULL`, [id]
        );

        if(!rows || rows.length === 0){
            return response.status(404).json({err: "Usuário não encontrado."});
        }
        return response.status(200).json(rows);
    }catch(err){
        console.log("Erro ao contar usuários:", err);
        return response.status(500).json({err: "Erro no servidor."});
    }
});

routes.get("/specific", async (request, response) => {
    const { id, curso, rm, nome, coordenador, turno} = request.query;
    try{
        let sql = `SELECT 
            u.id as id,
            u.nome as nome_user,
            u.RM as rm,
            u.disciplina as disciplina, 
            c.curso as nome_curso,
            t.tipo as entidade,
            c.curso as curso_user,
            coord.nome as coordenador, 
            CASE
            WHEN u.deletedAt IS NULL  THEN 'ativo'
            ELSE 'inativo'
            END AS status
            FROM tbl_usuario u
            INNER JOIN juncao_curso_user juc ON u.id = juc.id_user  
            INNER JOIN tbl_curso c ON juc.id_curso = c.id
            INNER JOIN juncao_type_user jut ON u.id = jut.id_user
            INNER JOIN tbl_type t ON jut.id_type = t.id
            LEFT JOIN tbl_usuario coord ON c.id_coordenador = coord.id`;
        const params = [];

        if (turno) {
            sql += `WHERE c.turno LIKE ?`;
            params.push(turno);
        }

        if (curso) {
        sql += ` WHERE c.curso LIKE ?`;
        params.push(curso);
        }

        if (coordenador) {
        sql += ` WHERE coord.nome LIKE ?`;
        params.push(coordenador);
        }

        if (rm) {
        sql += ` WHERE u.RM = ?`;
        params.push(rm);
        }
        if (id) {
        sql += ` WHERE u.id = ?`;
        params.push(id);
        }

        if (nome) {
        sql += ` WHERE u.nome LIKE ?`;
        params.push(nome);
        }
        const [rows] = await pool.query(sql, params);

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
    const {cpf, nome, email, senha, curso} = request.body;
    let {rm, cargo, disciplina} = request.body;
    try{
        const cpfsemPontuacao = cpf.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()"?]/g, "");
        const disciplinaRegex = /^[\p{L}\s\-']{2,35}$/u;
        if(disciplina && cargo.toLowerCase() === "professor"){
            if(!disciplinaRegex.test(disciplina.trim())){
                return response.status(400).json({err: "Disciplina inválida"});
            }
        }else{
            disciplina = null;
        }



        const rmRegex = /^\d{7,15}$/;
        if(!rm || !rmRegex.test(rm.toLowerCase().trim())){
            return response.status(400).json({err: "Rm inválido"})
        }

        
        let id_curso; 

        if (curso) {
            const [cursoExiste] = await pool.query(
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
        
        if(!validarCPF(cpfsemPontuacao)){
            return response.status(400).json({err: "Cpf inválido."});
        }
        cargo = cargo.toLowerCase()
        const [tipoExiste] =  await pool.query(`SELECT * FROM tbl_type WHERE tipo = ?`, [cargo]);
        
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
        const emailExiste = await pool.query(
            `SELECT * FROM tbl_usuario WHERE email = ? AND deletedAt IS NULL`, 
            [email]
        );

        if(emailExiste[0].length > 0){
            return response.status(400).json({err: "E-mail já cadastrado."});
        }

        if(!senha || senha.length < 6){
            return response.status(400).json({err: "A senha deve conter no minimo 6 caracteres."});
        }

        if (cargo.toLowerCase() === "coordenador de curso") {

            // Verifica se o coordenador já coordena outro curso
            const [jaCoordena] = await pool.query(
                `SELECT curso 
                FROM tbl_curso 
                WHERE id_coordenador = (SELECT id FROM tbl_usuario WHERE email = ?) 
                AND deletedAt IS NULL`,
                [email]
            );

            if (jaCoordena.length > 0) {
                return response.status(400).json({
                    err: `Este usuário já é coordenador do curso: ${jaCoordena[0].curso}`
                });
            }

            // Verifica se o curso NÃO possui coordenador ainda
            const [cursoLivre] = await pool.query(
                `SELECT * FROM tbl_curso 
                WHERE curso = ? 
                AND id_coordenador IS NULL`,
                [curso]
            );

            if (cursoLivre.length === 0) {
                return response.status(400).json({ 
                    err: "Este curso já possui um coordenador." 
                });
            }

            await pool.query(
                `UPDATE tbl_curso 
                SET id_coordenador = (SELECT id FROM tbl_usuario WHERE email = ?) 
                WHERE curso = ?`,
                [email, curso]
            );
        }

        const hashedSenha = await hash(senha, 10);

        await pool.query(`INSERT INTO tbl_usuario (RM, CPF, nome, email, senha, disciplina) VALUES(?, ?, ?, ?, ?, ?)`,
            [rm, cpfsemPontuacao, nome, email, hashedSenha, disciplina]
        );
        const [idUserExiste] = await pool.query(`SELECT * FROM tbl_usuario WHERE CPF = ?`, [cpfsemPontuacao])

        if(idUserExiste.length === 0){
            return response.status(400).json({response: "Erro ao cadastrar usuário."})
        }
        const id_user = idUserExiste[idUserExiste.length - 1];

        if (id_curso) {
            await pool.query(
                `INSERT INTO juncao_curso_user (id_curso, id_user) VALUES(?, ?)`,
                [id_curso, id_user.id]
             );
        }

        if (cargo.toLowerCase() === "coordenador de curso") {

            // Verifica se o coordenador já coordena outro curso
            const [jaCoordena] = await pool.query(
                `SELECT curso 
                FROM tbl_curso 
                WHERE id_coordenador = (SELECT id FROM tbl_usuario WHERE email = ?) 
                AND deletedAt IS NULL`,
                [email]
            );

            if (jaCoordena.length > 0) {
                return response.status(400).json({
                    err: `Este usuário já é coordenador do curso: ${jaCoordena[0].curso}`
                });
            }

            // Verifica se o curso NÃO possui coordenador ainda
            const [cursoLivre] = await pool.query(
                `SELECT * FROM tbl_curso 
                WHERE curso = ? 
                AND id_coordenador IS NULL`,
                [curso]
            );

            if (cursoLivre.length === 0) {
                return response.status(400).json({ 
                    err: "Este curso já possui um coordenador." 
                });
            }

            // Atualiza com segurança
            await pool.query(
                `UPDATE tbl_curso 
                SET id_coordenador = (SELECT id FROM tbl_usuario WHERE email = ?) 
                WHERE curso = ?`,
                [email, curso]
            );
        }


        await pool.query(`INSERT INTO juncao_type_user (id_type, id_user) VALUES(?, ?)`, [id_tipo, id_user.id])

        return response.status(201).json({response: "Cadastro efetuado com sucesso."});  
    }catch(err){
        console.log("Erro ao efetuar o cadastrar:", err);
        return response.status(500).json({err: "Erro no servidor."});
    }
});

routes.put("/:id", async (request, response) => {
    const {id} = request.params;
    const {nome, email, senha} = request.body;

    try{
        const userExists = await pool.query(
            `SELECT senha FROM tbl_usuario WHERE deletedAt IS NULL AND id = ?`, [id]
        );
        const senhaUser = userExists[0][0].senha;
        const senhaAtual = await VerificarSenha(senha, senhaUser);
        if(!senhaAtual){
            return response.status(400).json({err: "A senha atual não confere."});
        }
        const nomeRegex = /^[\p{L}\s\-']{2,45}$/u;
        if(!nome || !nomeRegex.test(nome.trim())){
            return response.status(400).json({err: "Nome inválido."});
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!email || !emailRegex.test(email.trim())){
            return response.status(400).json({erro: "E-mail inválido"});
        }


        const [rows] = await pool.query(
            `UPDATE tbl_usuario set nome = ?, email = ? WHERE deletedAt IS NULL AND id = ?`,
            [nome, email, id]
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


routes.delete("/:ID", async(request, response) => {
    const {ID} = request.params;

    if(!ID){
            return response.status(400).json({err: "ID inválido."});
        }
    try{
        const deletedAt = new Date();
        const [rows] = await pool.query(
            `UPDATE tbl_usuario SET deletedAt = ? WHERE id = ?`,
             [deletedAt, ID]);

         if(rows.affectedRows === 0){
            return response.status(400).json({err: "Usuário não encontrado."});
        };
        return response.status(200).json({err: "Usuário deletado com sucesso"});
    }catch(err){
        console.log("Erro ao deletar usuário:", err);
        return response.status(500).json({err: "Erro no servidor."});
    }
})

routes.put("/ativo/:ID", async (request, response) => {
    const {ID} = request.params;

    if(!ID){
            return response.status(400).json({err: "ID inválido."});
        }
    try{
        const deletedAt = null;
        const [rows] = await pool.query(
            `UPDATE tbl_usuario SET deletedAt = ? WHERE id = ?`,
             [deletedAt, ID]);

         if(rows.affectedRows === 0){
            return response.status(400).json({err: "Usuário não encontrado."});
        };
        return response.status(200).json({err: "Usuário Ativado  com sucesso"});
    }catch(err){
        console.log("Erro ao deletar usuário:", err);
        return response.status(500).json({err: "Erro no servidor."});
    }
});

export default routes;


