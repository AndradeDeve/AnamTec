import express from 'express';
import pool from '../database/data-source.js';

const routes = express.Router();

const medicamentosValidos = ['sim', 'não'];

routes.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tbl_medicamentos');
    if (!rows.length) {
      return res.status(404).json({ err: 'Nenhum medicamento encontrado.' });
    }
    return res.status(200).json({ response: rows });
  } catch (err) {
    console.error('Erro ao buscar medicamentos:', err);
    return res.status(500).json({ err: 'Erro no servidor.' });
  }
});

routes.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({ err: 'ID inválido.' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT * FROM tbl_medicamentos WHERE id = ?',
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ err: 'Medicamento não encontrado.' });
    }

    return res.status(200).json({ response: rows[0] });
  } catch (err) {
    console.error('Erro ao buscar medicamento por ID:', err);
    return res.status(500).json({ err: 'Erro no servidor.' });
  }
});

routes.post('/', async (req, res) => {
  const { medicamento, tp_medi } = req.body;

  if (!medicamento || !medicamentosValidos.includes(medicamento.toLowerCase())) {
    return res.status(400).json({ err: 'Valor de medicamento inválido. Use "sim" ou "não".' });
  }

  if (!tp_medi.length > 200) {
    return res.status(400).json({ err: 'Tipo de medicamento inválido ou muito longo (máx 200 caracteres).' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO tbl_medicamentos (medicamento, tp_medi) VALUES (?, ?)',
      [medicamento.toLowerCase(), tp_medi.trim()]
    );

    return res.status(201).json({ response: 'Medicamento cadastrado com sucesso.',});
  } catch (err) {
    console.error('Erro ao cadastrar medicamento:', err);
    return res.status(500).json({ err: 'Erro no servidor.' });
  }
});

routes.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { medicamento, tp_medi } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ err: 'ID inválido.' });
  }

  if (!medicamento || !medicamentosValidos.includes(medicamento.toLowerCase())) {
    return res.status(400).json({ err: 'Valor de medicamento inválido. Use "sim" ou "não".' });
  }

  if (!tp_medi || tp_medi.length > 200) {
    return res.status(400).json({ err: 'Tipo de medicamento inválido ou muito longo (máx 200 caracteres).' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE tbl_medicamentos SET medicamento = ?, tp_medi = ? WHERE id = ?',
      [medicamento.toLowerCase(), tp_medi.trim(), id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ err: 'Medicamento não encontrado.' });
    }

    return res.status(200).json({ response: 'Medicamento atualizado com sucesso.' });
  } catch (err) {
    console.error('Erro ao atualizar medicamento:', err);
    return res.status(500).json({ err: 'Erro no servidor.' });
  }
});

export default routes;
