import express from "express";
import { getConnection } from "../database/data-souce.js";

const routes = express.Router();

const sexoValido = ["feminino", "masculino"];
const sangueValido = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const binarioValido = ["sim", "não"];

routes.get("/", async (req, res) => {
  try {
    const connection = await getConnection();
    const [results] = await connection.query("SELECT * FROM tbl_dadosMedicos");
    return res.status(200).json({ response: results });
  } catch (err) {
    console.error("Erro ao buscar dados médicos:", err);
    return res.status(500).json({ erro: "Erro no servidor." });
  }
});

routes.post("/", async (req, res) => {
  const {
    id,
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
    laudo
  } = req.body;

  if (!id || isNaN(id)) return res.status(400).json({ response: "Campo 'id' obrigatório e deve ser numérico." });
  if (!sexoValido.includes(sexo)) return res.status(400).json({ response: "Campo 'sexo' inválido." });
  if (!sangueValido.includes(tp_sangue)) return res.status(400).json({ response: "Campo 'tp_sangue' inválido." });
  if (peso !== undefined && (isNaN(peso) || peso <= 0)) return res.status(400).json({ response: "Campo 'peso' deve ser número positivo." });
  if (altura !== undefined && (isNaN(altura) || altura <= 0)) return res.status(400).json({ response: "Campo 'altura' deve ser número positivo." });
  if (!binarioValido.includes(gravidez)) return res.status(400).json({ response: "Campo 'gravidez' inválido." });
  if (!idade || isNaN(idade) || idade <= 0) return res.status(400).json({ response: "Campo 'idade' obrigatório e deve ser número positivo." });
  if (!binarioValido.includes(alcool)) return res.status(400).json({ response: "Campo 'alcool' inválido." });
  if (!binarioValido.includes(fumo)) return res.status(400).json({ response: "Campo 'fumo' inválido." });
  if (!binarioValido.includes(drogas)) return res.status(400).json({ response: "Campo 'drogas' inválido." });

  try {
    const connection = await getConnection();
    await connection.query(
      `INSERT INTO tbl_dadosMedicos 
        (id, sexo, tp_sangue, peso, altura, gravidez, idade, alcool, fumo, drogas, obs, laudo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, sexo, tp_sangue, peso, altura, gravidez, idade, alcool, fumo, drogas, obs, laudo]
    );
    return res.status(201).json({ response: "Dados médicos cadastrados com sucesso." });
  } catch (err) {
    console.error("Erro ao cadastrar dados médicos:", err);
    return res.status(500).json({ response: "Erro ao cadastrar dados médicos." });
  }
});

routes.put("/:id", async (req, res) => {
  const { id } = req.params;
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
    laudo
  } = req.body;

  if (!id || isNaN(id)) return res.status(400).json({ response: "Parâmetro 'id' inválido. Deve ser numérico." });
  if (!sexoValido.includes(sexo)) return res.status(400).json({ response: "Campo 'sexo' inválido." });
  if (!sangueValido.includes(tp_sangue)) return res.status(400).json({ response: "Campo 'tp_sangue' inválido." });
  if (peso !== undefined && (isNaN(peso) || peso <= 0)) return res.status(400).json({ response: "Campo 'peso' deve ser número positivo." });
  if (altura !== undefined && (isNaN(altura) || altura <= 0)) return res.status(400).json({ response: "Campo 'altura' deve ser número positivo." });
  if (!binarioValido.includes(gravidez)) return res.status(400).json({ response: "Campo 'gravidez' inválido." });
  if (!idade || isNaN(idade) || idade <= 0) return res.status(400).json({ response: "Campo 'idade' obrigatório e deve ser número positivo." });
  if (!binarioValido.includes(alcool)) return res.status(400).json({ response: "Campo 'alcool' inválido." });
  if (!binarioValido.includes(fumo)) return res.status(400).json({ response: "Campo 'fumo' inválido." });
  if (!binarioValido.includes(drogas)) return res.status(400).json({ response: "Campo 'drogas' inválido." });

  try {
    const connection = await getConnection();
    const [result] = await connection.query(
      `UPDATE tbl_dadosMedicos 
       SET sexo = ?, tp_sangue = ?, peso = ?, altura = ?, gravidez = ?, idade = ?, 
           alcool = ?, fumo = ?, drogas = ?, obs = ?, laudo = ?
       WHERE id = ?`,
      [sexo, tp_sangue, peso, altura, gravidez, idade, alcool, fumo, drogas, obs, laudo, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ response: "Dados médicos não encontrados." });
    }

    return res.status(200).json({ response: "Dados médicos atualizados com sucesso." });
  } catch (err) {
    console.error("Erro ao atualizar dados médicos:", err);
    return res.status(500).json({ response: "Erro ao atualizar dados médicos." });
  }
});

export default routes;
