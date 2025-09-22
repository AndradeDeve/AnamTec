import express from 'express';
import pool from '../database/data-source.js';

const routes = express.Router();

routes.get("/", async (req, res) => {
    try {
        const [rows] = await pool.query(`SELECT * FROM tbl_alergias`);
        if (!Array.isArray(rows) || rows.length === 0) {
            return res.status(404).json({ err: "Nenhuma alergia encontrada." });
        }
        return res.status(200).json(rows);
    } catch (err) {
        console.log("Erro ao buscar alergias:", err);
        return res.status(500).json({ err: "Erro no servidor." });
    }
});

routes.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query(`SELECT * FROM tbl_alergias WHERE id = ?`, [id]);
        if (!rows || rows.length === 0) {
            return res.status(404).json({ err: "Alergia não encontrada." });
        }
        return res.status(200).json(rows[0]);
    } catch (err) {
        console.log("Erro ao buscar alergia:", err);
        return res.status(500).json({ err: "Erro no servidor." });
    }
});

routes.post("/", async (req, res) => {
    const { alergias, tp_alergia } = req.body;

    try {
        const alergiasOptions = ["sim", "não"];
        if (!alergiasOptions.includes(alergias.toLowerCase())) {
            return res.status(400).json({ err: "Opção de alergias inválida." });
        }

        if (tp_alergia && tp_alergia.length > 200) {
            return res.status(400).json({ err: "Tipo de alergia inválido." });
        }

        await pool.query(
            `INSERT INTO tbl_alergias (alergias, tp_alergia) VALUES (?, ?)`,
            [alergias, tp_alergia]
        );

        return res.status(201).json({ msg: "Alergia cadastrada com sucesso." });
    } catch (err) {
        console.log("Erro ao cadastrar alergia:", err);
        return res.status(500).json({ err: "Erro no servidor." });
    }
});


routes.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { alergias, tp_alergia } = req.body;

    try {
        const alergiasOptions = ["sim", "não"];
        if (!alergiasOptions.includes(alergias.toLowerCase())) {
            return res.status(400).json({ err: "Opção de alergias inválida." });
        }

        if (tp_alergia && tp_alergia.length > 200) {
            return res.status(400).json({ err: "Tipo de alergia inválido." });
        }

        const [rows] = await pool.query(
            `UPDATE tbl_alergias SET alergias = ?, tp_alergia = ? WHERE id = ?`,
            [alergias, tp_alergia, id]
        );

        if (rows.affectedRows === 0) {
            return res.status(404).json({ err: "Alergia não encontrada." });
        }

        return res.status(200).json({ msg: "Alergia atualizada com sucesso." });
    } catch (err) {
        console.log("Erro ao atualizar alergia:", err);
        return res.status(500).json({ err: "Erro no servidor." });
    }
});

routes.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query(`DELETE FROM tbl_alergias WHERE id = ?`, [id]);

        if (rows.affectedRows === 0) {
            return res.status(404).json({ err: "Alergia não encontrada." });
        }

        return res.status(200).json({ msg: "Alergia excluída com sucesso." });
    } catch (err) {
        console.log("Erro ao excluir alergia:", err);
        return res.status(500).json({ err: "Erro no servidor." });
    }
});

export default routes;