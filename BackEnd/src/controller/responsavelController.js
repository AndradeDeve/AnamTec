import express from 'express';
import { validarCPF } from '../utils/cpfValidator.js';
import { getConnection } from '../database/data-souce.js';

const routes = express.Router();
const connection = await getConnection();

routes.get("/", async (request, response) => {
    const { id, cpf, nome } = request.query;
    try {
        let sql = `SELECT * FROM tbl_responsavel WHERE deletedAt IS NULL`;
        const params = [];

        if (id) {
            sql += ` AND id = ?`;
            params.push(id);
        }

        if (cpf) {
            sql += ` AND CPF = ?`;
            params.push(cpf);
        }

        if (nome) {
            sql += ` AND nome LIKE ?`;
            params.push(`%${nome}%`);
        }

        const [rows] = await connection.execute(sql, params);

        if (!Array.isArray(rows) || rows.length === 0) {
            return response.status(404).json({ err: "Responsável não encontrado." });
        }
        return response.status(200).json({ response: rows });
    } catch (err) {
        console.log("Erro ao buscar responsável:", err);
        return response.status(500).json({ err: "Erro no servidor." });
    }
});

routes.post("/", async (request, response) => {
    const { cpf, nome, data_nasc, estado_civil, email, telefone } = request.body;
    try {
        if (!validarCPF(cpf)) {
            return response.status(400).json({ err: "CPF inválido." });
        }

        const nomeRegex = /^[\p{L}\s\-']{2,50}$/u;
        if (!nome || !nomeRegex.test(nome.trim())) {
            return response.status(400).json({ err: "Nome inválido." });
        }

        if (new Date(data_nasc) <= new Date("1935-01-01")) {
            return response.status(400).json({ err: "A data de nascimento não pode ser anterior a 01/01/1935." });
        }

        const estadoCivilOptions = ["solteiro(a)", "casado(a)", "divorciado(a)", "viúvo(a)", "separado(a)"];
        if (!estadoCivilOptions.includes(estado_civil.toLowerCase())) {
            return response.status(400).json({ err: "Estado civil inválido." });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email.trim())) {
            return response.status(400).json({ err: "E-mail inválido." });
        }

        const telefoneRegex = /^\d{10,20}$/;
        if (!telefone || !telefoneRegex.test(telefone.trim())) {
            return response.status(400).json({ err: "Telefone inválido." });
        }

        await connection.execute(
            `INSERT INTO tbl_responsavel (CPF, nome, data_nasc, estado_civil, email, telefone) VALUES (?, ?, ?, ?, ?, ?)`,
            [cpf, nome.trim(), data_nasc, estado_civil.toLowerCase(), email.trim(), telefone.trim()]
        );
        return response.status(201).json({ response: "Responsável cadastrado com sucesso." });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            if (err.message.includes('CPF')) {
                return response.status(409).json({ err: "CPF já cadastrado." });
            }
            if (err.message.includes('email')) {
                return response.status(409).json({ err: "E-mail já cadastrado." });
            }
            if (err.message.includes('telefone')) {
                return response.status(409).json({ err: "Telefone já cadastrado." });
            }
        }
        console.log("Erro ao cadastrar responsável:", err);
        return response.status(500).json({ err: "Erro no servidor." });
    }
});

routes.put("/:cpf", async (request, response) => {
    const { cpf: cpfParam } = request.params;
    const { cpf, nome, data_nasc, estado_civil, email, telefone } = request.body;
    try {
        if (!validarCPF(cpf)) {
            return response.status(400).json({ err: "CPF inválido." });
        }

        const nomeRegex = /^[\p{L}\s\-']{2,50}$/u;
        if (!nome || !nomeRegex.test(nome.trim())) {
            return response.status(400).json({ err: "Nome inválido." });
        }

        if (new Date(data_nasc) <= new Date("1935-01-01")) {
            return response.status(400).json({ err: "A data de nascimento não pode ser anterior a 01/01/1935." });
        }

        const estadoCivilOptions = ["solteiro(a)", "casado(a)", "divorciado(a)", "viúvo(a)", "separado(a)"];
        if (!estadoCivilOptions.includes(estado_civil.toLowerCase())) {
            return response.status(400).json({ err: "Estado civil inválido." });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email.trim())) {
            return response.status(400).json({ err: "E-mail inválido." });
        }

        const telefoneRegex = /^\d{10,20}$/;
        if (!telefone || !telefoneRegex.test(telefone.trim())) {
            return response.status(400).json({ err: "Telefone inválido." });
        }

        const [rows] = await connection.execute(
            `UPDATE tbl_responsavel SET CPF = ?, nome = ?, data_nasc = ?, estado_civil = ?, email = ?, telefone = ? WHERE deletedAt IS NULL AND CPF = ?`,
            [cpf, nome.trim(), data_nasc, estado_civil.toLowerCase(), email.trim(), telefone.trim(), cpfParam]
        );

        if (rows.affectedRows === 0) {
            return response.status(404).json({ err: "Responsável não encontrado." });
        }
        return response.status(200).json({ response: "Responsável atualizado com sucesso." });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            if (err.message.includes('CPF')) {
                return response.status(409).json({ err: "CPF já cadastrado." });
            }
            if (err.message.includes('email')) {
                return response.status(409).json({ err: "E-mail já cadastrado." });
            }
            if (err.message.includes('telefone')) {
                return response.status(409).json({ err: "Telefone já cadastrado." });
            }
        }
        console.log("Erro ao atualizar responsável:", err);
        return response.status(500).json({ err: "Erro no servidor." });
    }
});

export default routes;