import express from 'express';
import { getConnection } from '../database/data-source.js';

const routes = express.Router();
const connection = await getConnection();

const enumSexo = ['feminino', 'masculino'];
const enumTpSangue = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const enumSimNao = ['sim', 'não'];

routes.get('/', async (req, res) => {
  try {
    const [rows] = await connection.execute('SELECT * FROM tbl_dadosMedicos');
    if (!rows.length) return res.status(404).json({ err: 'Nenhum dado médico encontrado.' });
    return res.status(200).json({ response: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ err: 'Erro no servidor.' });
  }
});

routes.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) return res.status(400).json({ err: 'ID inválido.' });

  try {
    const [rows] = await connection.execute('SELECT * FROM tbl_dadosMedicos WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ err: 'Dado médico não encontrado.' });
    return res.status(200).json({ response: rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ err: 'Erro no servidor.' });
  }
});

routes.post('/', async (req, res) => {
  const {
    sexo,
    tp_sangue,
    peso,
    altura,
    gravidez,
    idade,
    alcool,
    fumo,
    drogas,
    obs,
    laudo,
    id_alergias,
    id_diagnostico,
    id_deficiencias,
    id_restricoes,
    id_cirurgias,
    id_medicamentos,
    id_aluno
  } = req.body;
  try {
    if (!enumSexo.includes(sexo)) return res.status(400).json({ err: 'Sexo inválido.' });
    if (!enumTpSangue.includes(tp_sangue)) return res.status(400).json({ err: 'Tipo sanguíneo inválido.' });
    if (typeof !peso === 'number' || peso <= 0) return res.status(400).json({ err: 'Peso inválido.' });
    if (typeof !altura === 'number' || altura <= 0) return res.status(400).json({ err: 'Altura inválida.' });
    if (!enumSimNao.includes(gravidez)) return res.status(400).json({ err: 'Gravidez inválido.' });
    if (!Number.isInteger(idade) || idade < 0) return res.status(400).json({ err: 'Idade inválida.' });
    if (!enumSimNao.includes(alcool)) return res.status(400).json({ err: 'Álcool inválido.' });
    if (!enumSimNao.includes(fumo)) return res.status(400).json({ err: 'Fumo inválido.' });
    if (!enumSimNao.includes(drogas)) return res.status(400).json({ err: 'Drogas inválido.' });

    if (
      isNaN(id_alergias) ||
      isNaN(id_diagnostico) ||
      isNaN(id_deficiencias) ||
      isNaN(id_restricoes) ||
      isNaN(id_cirurgias) ||
      isNaN(id_medicamentos)
    ) {
      return res.status(400).json({ err: 'IDs de chaves estrangeiras inválidos.' });
    }

      const [idExiste] =  await connection.execute(`SELECT * FROM tbl_cadastro_al WHERE id = ?`, [id_aluno]);
      if(id_aluno !== undefined && idExiste.length === 0 ){
          return res.status(400).json({ err: "Aluno não encontrado." });
      }

    if (isNaN(id_aluno)) {
      return res.status(400).json({ err: 'ID do aluno inválido.' });
    }

    if (obs && typeof obs !== 'string') return res.status(400).json({ err: 'Obs deve ser string.' });
    if (laudo && typeof laudo !== 'string') return res.status(400).json({ err: 'Laudo deve ser string.' });

    
    const [result] = await connection.execute(
      `INSERT INTO tbl_dadosMedicos
      (sexo, tp_sangue, peso, altura, gravidez, idade, alcool, fumo, drogas, obs, laudo,
      id_alergias, id_diagnostico, id_deficiencias, id_restricoes, id_cirurgias, id_medicamentos, id_aluno)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        sexo, tp_sangue, peso, altura, gravidez, idade, alcool, fumo, drogas,
        obs || null, laudo || null,
        id_alergias, id_diagnostico, id_deficiencias, id_restricoes,
        id_cirurgias, id_medicamentos, id_aluno || null
      ]
    );
    return res.status(201).json({ response: 'Dados médicos cadastrados com sucesso.', id: result.insertId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ err: 'Erro no servidor.' });
  }
});

routes.put('/:id', async (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) return res.status(400).json({ err: 'ID inválido.' });

  const allowedFields = [
    'sexo', 'tp_sangue', 'peso', 'altura', 'gravidez', 'idade', 'alcool', 'fumo', 'drogas',
    'obs', 'laudo', 'id_alergias', 'id_diagnostico', 'id_deficiencias', 'id_restricoes',
    'id_cirurgias', 'id_medicamentos', 'id_aluno'
  ];

  const fieldsToUpdate = {};
  for (const key of allowedFields) {
    if (req.body[key] !== undefined) {
      fieldsToUpdate[key] = req.body[key];
    }
  }

  if (Object.keys(fieldsToUpdate).length === 0) {
    return res.status(400).json({ err: 'Nenhum campo para atualizar.' });
  }

  if ('sexo' in fieldsToUpdate && !enumSexo.includes(fieldsToUpdate.sexo)) {
    return res.status(400).json({ err: 'Sexo inválido.' });
  }
  if ('tp_sangue' in fieldsToUpdate && !enumTpSangue.includes(fieldsToUpdate.tp_sangue)) {
    return res.status(400).json({ err: 'Tipo sanguíneo inválido.' });
  }
  if ('peso' in fieldsToUpdate && (typeof fieldsToUpdate.peso !== 'number' || fieldsToUpdate.peso <= 0)) {
    return res.status(400).json({ err: 'Peso inválido.' });
  }
  if ('altura' in fieldsToUpdate && (typeof fieldsToUpdate.altura !== 'number' || fieldsToUpdate.altura <= 0)) {
    return res.status(400).json({ err: 'Altura inválida.' });
  }
  if ('gravidez' in fieldsToUpdate && !enumSimNao.includes(fieldsToUpdate.gravidez)) {
    return res.status(400).json({ err: 'Gravidez inválido.' });
  }
  if ('idade' in fieldsToUpdate && (!Number.isInteger(fieldsToUpdate.idade) || fieldsToUpdate.idade < 0)) {
    return res.status(400).json({ err: 'Idade inválida.' });
  }
  if ('alcool' in fieldsToUpdate && !enumSimNao.includes(fieldsToUpdate.alcool)) {
    return res.status(400).json({ err: 'Álcool inválido.' });
  }
  if ('fumo' in fieldsToUpdate && !enumSimNao.includes(fieldsToUpdate.fumo)) {
    return res.status(400).json({ err: 'Fumo inválido.' });
  }
  if ('drogas' in fieldsToUpdate && !enumSimNao.includes(fieldsToUpdate.drogas)) {
    return res.status(400).json({ err: 'Drogas inválido.' });
  }
  if ('obs' in fieldsToUpdate && fieldsToUpdate.obs !== null && typeof fieldsToUpdate.obs !== 'string') {
    return res.status(400).json({ err: 'Obs deve ser string.' });
  }
  if ('laudo' in fieldsToUpdate && fieldsToUpdate.laudo !== null && typeof fieldsToUpdate.laudo !== 'string') {
    return res.status(400).json({ err: 'Laudo deve ser string.' });
  }
  if (
    ('id_alergias' in fieldsToUpdate && isNaN(fieldsToUpdate.id_alergias)) ||
    ('id_diagnostico' in fieldsToUpdate && isNaN(fieldsToUpdate.id_diagnostico)) ||
    ('id_deficiencias' in fieldsToUpdate && isNaN(fieldsToUpdate.id_deficiencias)) ||
    ('id_restricoes' in fieldsToUpdate && isNaN(fieldsToUpdate.id_restricoes)) ||
    ('id_cirurgias' in fieldsToUpdate && isNaN(fieldsToUpdate.id_cirurgias)) ||
    ('id_medicamentos' in fieldsToUpdate && isNaN(fieldsToUpdate.id_medicamentos))
  ) {
    return res.status(400).json({ err: 'IDs de chaves estrangeiras inválidos.' });
  }
  if ('id_aluno' in fieldsToUpdate && fieldsToUpdate.id_aluno !== null && isNaN(fieldsToUpdate.id_aluno)) {
    return res.status(400).json({ err: 'ID do aluno inválido.' });
  }

  const setClause = Object.keys(fieldsToUpdate)
    .map(field => `${field} = ?`)
    .join(', ');

  const values = Object.values(fieldsToUpdate);
  values.push(id);

  try {
    const [result] = await connection.execute(
      `UPDATE tbl_dadosMedicos SET ${setClause} WHERE id = ?`,
      values
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ err: 'Dado médico não encontrado para atualizar.' });
    }
    return res.status(200).json({ response: 'Dados médicos atualizados com sucesso.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ err: 'Erro no servidor.' });
  }
});

export default routes;
