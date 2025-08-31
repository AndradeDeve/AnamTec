import express from 'express';
import { getConnection } from '../database/data-souce.js';

const routes = express.Router();
const connection = await getConnection();

routes.get('/', async (req, res) => {
  try {
    const [rows] = await connection.execute('SELECT * FROM registros_aulas WHERE deletedAt IS NULL');
    if (!rows.length) {
      return res.status(404).json({ err: 'Nenhum registro de aula encontrado.' });
    }
    return res.status(200).json({ response: rows });
  } catch (err) {
    console.error('Erro ao buscar registros de aula:', err);
    return res.status(500).json({ err: 'Erro no servidor.' });
  }
});

routes.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) {
    return res.status(400).json({ err: 'ID inválido.' });
  }
  try {
    const [rows] = await connection.execute('SELECT * FROM registros_aulas WHERE id = ? AND deletedAt IS NULL', [id]);
    if (!rows.length) {
      return res.status(404).json({ err: 'Registro de aula não encontrado.' });
    }
    return res.status(200).json({ response: rows[0] });
  } catch (err) {
    console.error('Erro ao buscar registro de aula:', err);
    return res.status(500).json({ err: 'Erro no servidor.' });
  }
});

routes.post('/', async (req, res) => {
  const { comentario, id_professor } = req.body;

  if (!comentario || comentario.length > 1000) {
    return res.status(400).json({ err: 'Comentário inválido ou muito longo (máx 1000 caracteres).' });
  }

  if (!id_professor || isNaN(id_professor)) {
    return res.status(400).json({ err: 'ID do professor inválido.' });
  }

  try {
    const [result] = await connection.execute(
      'INSERT INTO registros_aulas (comentario, id_professor) VALUES (?, ?)',
      [comentario.trim(), id_professor]
    );
    return res.status(201).json({ response: 'Registro de aula cadastrado com sucesso.', id: result.insertId });
  } catch (err) {
    console.error('Erro ao cadastrar registro de aula:', err);
    return res.status(500).json({ err: 'Erro no servidor.' });
  }
});

routes.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { comentario, id_professor } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ err: 'ID inválido.' });
  }

  if (!comentario || comentario.length > 1000) {
    return res.status(400).json({ err: 'Comentário inválido ou muito longo (máx 1000 caracteres).' });
  }

  if (!id_professor || isNaN(id_professor)) {
    return res.status(400).json({ err: 'ID do professor inválido.' });
  }

  try {
    const [result] = await connection.execute(
      'UPDATE registros_aulas SET comentario = ?, id_professor = ? WHERE id = ? AND deletedAt IS NULL',
      [comentario.trim(), id_professor, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ err: 'Registro de aula não encontrado.' });
    }

    return res.status(200).json({ response: 'Registro de aula atualizado com sucesso.' });
  } catch (err) {
    console.error('Erro ao atualizar registro de aula:', err);
    return res.status(500).json({ err: 'Erro no servidor.' });
  }
});

routes.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({ err: 'ID inválido.' });
  }

  try {
    const now = new Date();
    const [result] = await connection.execute(
      'UPDATE registros_aulas SET deletedAt = ? WHERE id = ? AND deletedAt IS NULL',
      [now, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ err: 'Registro de aula não encontrado ou já deletado.' });
    }

    return res.status(200).json({ response: 'Registro de aula deletado com sucesso.' });
  } catch (err) {
    console.error('Erro ao deletar registro de aula:', err);
    return res.status(500).json({ err: 'Erro no servidor.' });
  }
});

export default routes;
