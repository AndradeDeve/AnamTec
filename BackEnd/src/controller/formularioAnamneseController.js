import express, { response } from "express";
import pool from "../database/data-source.js";

const router = express.Router();

router.post("/", async (req, res) => {;
  try {
    const dados = req.body;
    const info = dados.informacoesPrincipais;
    const saude = dados.saude;
    const comportamento = dados.comportamento;
    const infoResponsaveis = dados.infoResponsaveis;
    console.log("Dados: ", dados);
    console.log("inf:", info);
    console.log("saude: ", saude);
    console.log("Comportamento: ", comportamento);
    console.log("InfoResp", infoResponsaveis);
    const [cursoExistente] = await pool.query(
      `SELECT id FROM tbl_curso WHERE curso = ? AND turno = ? LIMIT 1`,
      [info.curso, info.turno]
    );
    let id_curso;
    if (cursoExistente.length < 0) {
      return res.status(400).json({err: "Curso não existente."})
    }
    const [enderecoResult] = await pool.query(
      `INSERT INTO tbl_endereco (CEP, logradouro, bairro, cidade, numero, UF)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [info.cep, info.logradouro, info.bairro, info.cidade, info.numero, info.uf]
    );
    const rmAlunoExist = await pool.query(
      `SELECT rm FROM tbl_cadastro_al where rm = ? `,
      [dados.rm]
    );

    if( rmAlunoExist.length !== 0){
      return res.status(400).json({err: "O Rm já está sendo utilizado."})
    }
    const id_endereco = enderecoResult.insertId;
    console.log(`✅ Endereço salvo (id: ${id_endereco})`);

    console.log("👤 Salvando aluno...");
    const [alunoResult] = await pool.query(
      `INSERT INTO tbl_cadastro_al (rm, nome, data_nasc, genero, email, telefone, id_endereco)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        info.rm,
        info.nome,
        info.dataNascimento,
        info.genero,
        info.email,
        info.telefone,
        id_endereco
      ]
    );
    const id_aluno = alunoResult.insertId;
    console.log(`✅ Aluno salvo (id: ${id_aluno})`);

    console.log("🔗 Relacionando aluno ao curso...");
    await pool.query(
      `INSERT INTO juncao_al_curso (id_aluno, id_curso) VALUES (?, ?)`,
      [id_aluno, id_curso]
    );
    console.log(`✅ Relação aluno-curso salva`);

    console.log("👨‍👩‍👧 Salvando responsáveis...");
    if (infoResponsaveis && infoResponsaveis.length > 0) {
      for (const responsavel of infoResponsaveis) {
        if (responsavel.nome) {
          // Se CPF estiver vazio, gera um valor temporário único
          const cpfSeguro = responsavel.CPF && responsavel.CPF.trim() !== ""
            ? responsavel.CPF
            : `sem-cpf5180-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

          const [responsavelResult] = await pool.query(
            `INSERT INTO tbl_responsavel (nome, CPF, telefone, estado_civil, email) 
             VALUES (?, ?, ?, ?, ?)`,
            [
              responsavel.nome,
              cpfSeguro,
              responsavel.telefone || null,
              responsavel.estadoCivil || null,
              responsavel.email || null
            ]
          );
          const idResponsavel = responsavelResult.insertId;
          await pool.query(
            `INSERT INTO juncao_al_responsaveis (id_aluno, id_responsaveis) VALUES (?, ?)`,
            [id_aluno, idResponsavel]
          );
          console.log(`👨‍👩‍👧 Responsável salvo: ${responsavel.nome} (id: ${idResponsavel})`);
        }
      }
    } else {
      console.log("ℹ️ Nenhum responsável fornecido.");
    }

    console.log("💉 Inserindo dados de saúde...");
    const [alergiaResult] = await pool.query(
      `INSERT INTO tbl_alergias (alergias, tp_alergia) VALUES (?, ?)`,
      [saude.possuiAlergia || "não", saude.quaisAlergias || null]
    );
    const id_alergias = alergiaResult.insertId;
    console.log(`✅ Alergias salvas (id: ${id_alergias})`);

    let laudoUrl = null;
    if (saude.laudo && saude.laudo.path) {
      laudoUrl = saude.laudo.path.replace(/\\/g, "/");
      console.log(`📄 Laudo recebido e armazenado em: ${laudoUrl}`);
    }

    const [diagResult] = await pool.query(
      `INSERT INTO tbl_diagnostico (diagnostico, tp_diag) VALUES (?, ?)`,
      [saude.possuiLaudo || "não", laudoUrl]
    );
    const id_diagnostico = diagResult.insertId;
    console.log(`✅ Diagnóstico salvo (id: ${id_diagnostico})`);

    const [defiResult] = await pool.query(
      `INSERT INTO tbl_deficiencias (deficiencia, tp_defi) VALUES (?, ?)`,
      ["não", ""]
    );
    const id_deficiencias = defiResult.insertId;
    console.log(`✅ Deficiências salvas (id: ${id_deficiencias})`);

    const [restriResult] = await pool.query(
      `INSERT INTO tbl_restricoes (restri_alimentar, tp_restricao) VALUES (?, ?)`,
      [saude.restricaoAlimentar || "não", saude.quaisRestricoes || null]
    );
    const id_restricoes = restriResult.insertId;
    console.log(`✅ Restrições salvas (id: ${id_restricoes})`);

    const [medResult] = await pool.query(
      `INSERT INTO tbl_medicamentos (medicamento, tp_medi) VALUES (?, ?)`,
      [saude.medicamentos || "não", saude.quaisMedicamentos || null]
    );
    const id_medicamentos = medResult.insertId;
    console.log(`✅ Medicamentos salvos (id: ${id_medicamentos})`);

    const [cirurgiaResult] = await pool.query(
      `INSERT INTO tbl_cirurgias (internacao_cirurgia, tp_cirurgia) VALUES (?, ?)`,
      [saude.cirurgia || "não", saude.quaisCirurgias || null]
    );
    const id_cirurgias = cirurgiaResult.insertId;
    console.log(`✅ Cirurgias salvas (id: ${id_cirurgias})`);

    const [difResult] = await pool.query(
      `INSERT INTO tbl_dificuldades_educacionais (dificuldades, tp_dificuldades) VALUES (?, ?)`,
      [
        comportamento.dificuldadesAprendizagem === "sim" ? "sim" : "não",
        comportamento.emocionais || ""
      ]
    );
    const id_dificuldades = difResult.insertId;
    console.log(`✅ Dificuldades educacionais salvas (id: ${id_dificuldades})`);

    console.log("💊 Inserindo dados médicos...");
    await pool.query(
      `INSERT INTO tbl_dadosMedicos (
        sexo, tp_sangue, peso, altura, gravidez, idade, alcool, fumo, drogas, 
        obs, laudo, id_alergias, id_diagnostico, id_deficiencias, id_restricoes, 
        id_cirurgias, id_medicamentos, id_aluno, id_dificuldades
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        info.genero.toLowerCase(),
        saude.tipoSanguineo || null,
        parseFloat(saude.peso) || null,
        parseFloat(saude.altura) || null,
        saude.gravidez || "não",
        18,
        saude.alcool || "não",
        saude.fumante || "não",
        saude.drogas || "não",
        saude.historicoFamiliar || null,
        laudoUrl,
        id_alergias,
        id_diagnostico,
        id_deficiencias,
        id_restricoes,
        id_cirurgias,
        id_medicamentos,
        id_aluno,
        id_dificuldades
      ]
    );
    console.log("🎉 Dados médicos e de saúde salvos com sucesso!");

    console.log("✅ Formulário completo salvo com sucesso!");
    res.status(201).json({ message: "Formulário completo salvo com sucesso!" });
  } catch (err) {
    console.error("❌ Erro ao salvar formulário:", err);
    res.status(500).json({ error: "Erro ao salvar formulário", details: err.message });
  }
});

export default router;
