import express, { response } from "express";
import pool from "../database/data-source.js";
import { validarCPF } from "../utils/cpfValidator.js";
import { upload } from "../utils/cloudinaryConfig.js";

const enumSexo = ["feminino", "masculino", "não binario", "prefiro não informar", "outros" ];
const enumTpSangue = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const enumSimNao = ["sim", "nao", "eventualmente"];

const router = express.Router();

const estadosValidos = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA",
  "MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN",
  "RS","RO","RR","SC","SP","SE","TO"
];

const normalizeYesNo = (v) => (String(v || "").toLowerCase() === "sim" ? "sim" : "não");

router.get("/:id", async (req, res) => {
  try{
    const {id} = req.params
    const [rows] = await pool.query(
      `SELECT 
        al.id AS id_aluno,
        al.nome AS nome_aluno,
        al.rm AS rm,
        al.data_nasc,
        al.genero AS genero_aluno,
        al.email AS email_aluno,
        al.telefone AS telefone_aluno,

        -- Curso
        c.curso AS nome_curso,
        c.turno AS turno_curso,
        c.semestre AS modulo_curso,

        -- Endereço
        e.CEP,
        e.logradouro,
        e.bairro,
        e.cidade,
        e.numero,
        e.complemento,
        e.UF,

        -- Responsável
        r.nome AS responsavel_nome,
        r.CPF AS responsavel_CPF,
        r.telefone AS responsavel_telefone,
        r.email AS responsavel_email,
        r.estado_civil AS responsavel_estado_civil,
        r.parentesco AS responsavel_parentesco,

        -- Dados médicos gerais
        dm.id AS id_dadosMedicos,
        dm.sexo,
        dm.tp_sangue,
        dm.peso,
        dm.altura,
        dm.gravidez,
        dm.idade,
        dm.alcool,
        dm.fumo,
        dm.drogas,
        dm.obs,
        dm.laudo,
        dm.createAt AS data_anamnese,

        -- Alergias
        a.alergias AS possui_alergia,
        a.tp_alergia,

        -- Diagnóstico
        d.diagnostico AS possui_diagnostico,
        d.tp_diag,

        -- Deficiências
        def.deficiencia AS possui_deficiencia,
        def.tp_defi,

        -- Restrições alimentares
        r2.restri_alimentar AS possui_restricao,
        r2.tp_restricao,

        -- Cirurgias
        c2.internacao_cirurgia AS possui_cirurgia,
        c2.tp_cirurgia,

        -- Medicamentos
        m.medicamento AS usa_medicamento,
        m.tp_medi,

        -- Psicológico
        psi.psicologico AS acompanhamento_psicologico,
        psi.tp_psi,

        -- Internet
        i.acesso AS acesso_internet,
        i.tp_acesso,

        -- Atividade física
        af.pratica AS pratica_atividade,
        af.tp_ativ,

        -- Dificuldades educacionais
        di.dificuldades AS possui_dificuldade,
        di.tp_dificuldades


      FROM tbl_cadastro_al al

      -- ENDEREÇO
      LEFT JOIN tbl_endereco e ON e.id = al.id_endereco

      -- RESPONSÁVEIS (N-N)
      LEFT JOIN juncao_al_responsaveis jar ON jar.id_aluno = al.id
      LEFT JOIN tbl_responsavel r ON r.id = jar.id_responsaveis

      -- CURSO (N-N)
      LEFT JOIN juncao_al_curso jac ON jac.id_aluno = al.id
      LEFT JOIN tbl_curso c ON c.id = jac.id_curso

      -- Dados médicos (1-N)
      LEFT JOIN tbl_dadosMedicos dm ON dm.id_aluno = al.id

      -- Tabelas derivadas dos dadosMedicos
      LEFT JOIN tbl_alergias a ON dm.id_alergias = a.id
      LEFT JOIN tbl_diagnostico d ON dm.id_diagnostico = d.id
      LEFT JOIN tbl_deficiencias def ON dm.id_deficiencias = def.id
      LEFT JOIN tbl_restricoes r2 ON dm.id_restricoes = r2.id
      LEFT JOIN tbl_cirurgias c2 ON dm.id_cirurgias = c2.id
      LEFT JOIN tbl_medicamentos m ON dm.id_medicamentos = m.id
      LEFT JOIN tbl_psicologico psi ON dm.id_psicologico = psi.id
      LEFT JOIN tbl_internet i ON dm.id_internet = i.id
      LEFT JOIN tbl_atividadeFisica af ON dm.id_atividadeFisica = af.id
      LEFT JOIN tbl_dificuldades_educacionais di ON dm.id_dificuldades = di.id

      WHERE 
          al.deletedAt IS NULL 
          AND (c.deletedAt IS NULL OR c.deletedAt IS NULL)
          AND al.id = ?;
      `,[id]);
    if(rows.length === 0){
      return res.status(400).json({err: "Aluno não encontrado."})
    }
    return res.status(200).json(rows);
  }catch(err){
    console.log("Erro: ", err);
    return response.status(500).json({err: "Erro no servidor"})
  }
})

router.post("/", (req, res, next) => {
  upload.single("laudo")(req, res, function (err) {
    if (err) {
      console.error("Erro no upload:", err);
      return res.status(500).json({ error: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    // Parse incoming payload: support JSON body or multipart where the whole
    // payload is sent as a stringified field `forms`.
    let forms = req.body || {};
    if (forms && typeof forms === 'object' && typeof forms.forms === 'string') {
      try {
        forms = JSON.parse(forms.forms);
      } catch (e) {
        // ignore parse error and fall back to original req.body
        console.warn('[formularioAnamnese] failed to parse req.body.forms as JSON');
      }
    } else if (typeof forms === 'string') {
      try {
        forms = JSON.parse(forms);
      } catch (e) {
        forms = {};
      }
    }

    const alunoInformacoes = forms.alunoInformacoes || {};
    const logradouroInformacoes = forms.logradouroInformacoes || {};
    const cursoInformacoes = forms.cursoInformacoes || {};
    const responsaveis = Array.isArray(forms.responsavel) ? forms.responsavel : [];
    let saude = forms.saude || {};
    console.log("AlunoInfo: ", alunoInformacoes)
    console.log("Logradouro: ", logradouroInformacoes)
    console.log("curso: ", cursoInformacoes);
    console.log("responsalvel: ", responsaveis);
    console.log("saúde: ", saude)
    
    if(cursoInformacoes.curso === 'Administração - Ensino Médio'){
      cursoInformacoes.curso = 'Administração (Ensino médio)'
    }
    if ((!saude || Object.keys(saude).length === 0) && req.body && (req.body.sexo || req.body.tp_sangue || req.body.peso)) {
      saude = { ...req.body };
    }
    
    const comportamento = forms.comportamento || {};

    // Validação básica endereço
    const cepRaw = String(logradouroInformacoes.cep || "").replace(/\D/g, "");
    if (!/^[0-9]{8}$/.test(cepRaw)) return res.status(400).json({ err: "CEP inválido." });
    const logradouro = String(logradouroInformacoes.logradouro || "").trim();
    if (!logradouro || logradouro.length > 50) return res.status(400).json({ err: "Logradouro inválido." });
    const bairro = String(logradouroInformacoes.bairro || "").trim();
    if (!bairro || bairro.length > 20) return res.status(400).json({ err: "Bairro inválido." });
    const cidade = String(logradouroInformacoes.cidade || "").trim();
    if (!cidade || cidade.length > 40) return res.status(400).json({ err: "Cidade inválida." });
    const numero = String(logradouroInformacoes.numero || "").trim();
    if (!numero || numero.length > 10) return res.status(400).json({ err: "Número inválido." });
    const uf = String((logradouroInformacoes.uf || "").toUpperCase()).trim();
    if (!uf || !estadosValidos.includes(uf)) return res.status(400).json({ err: "UF inválido." });

    // Usando pool.query para operações (sem transação explícita)

    // Verifica se endereço já existe (por CEP + logradouro + numero + UF)
    let enderecoId = null;
    const [existingEndereco] = await pool.query(
      `SELECT id FROM tbl_endereco WHERE CEP = ? AND logradouro = ? AND numero = ? AND UF = ? AND deletedAt IS NULL LIMIT 1`,
      [cepRaw, logradouro, numero, uf]
    );
    if (existingEndereco && existingEndereco.length > 0) {
      enderecoId = existingEndereco[0].id;
    } else {
      const [endResult] = await pool.query(
        `INSERT INTO tbl_endereco (CEP, logradouro, bairro, cidade, numero, UF, complemento) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [cepRaw, logradouro, bairro, cidade, numero, uf, logradouroInformacoes.complemento || null]
      );
      enderecoId = endResult.insertId;
      if (!enderecoId) {
        return res.status(500).json({ err: "Erro ao inserir endereço." });
      }
    }

    // Insere aluno
    const rm = String(alunoInformacoes.rm || "").trim() || null;
    const nome = String(alunoInformacoes.nome || "").trim();
    const data_nasc = alunoInformacoes.dataNascimento || null;
    const genero = alunoInformacoes.genero || null;
    const etnia = alunoInformacoes.etnia || null;
    const email = String(alunoInformacoes.email || "").trim() || null;
    const telefone = String(alunoInformacoes.telefone || "").replace(/\D/g, "") || null;
    const resideCom = alunoInformacoes.resideCom || null;

    if (!nome) {
      return res.status(400).json({ err: "Nome do aluno é obrigatório." });
    }

    if (!email) {
      return res.status(400).json({ err: "Email do aluno é obrigatório." });
    }

    // Verifica se aluno existe por RM ou email
    let alunoId = null;
    if (rm) {
      const [rowRm] = await pool.query(`SELECT id FROM tbl_cadastro_al WHERE rm = ? `, [rm]);
      if (rowRm && rowRm.length > 0) alunoId = rowRm[0].id;
    }

    if (alunoId) {
      // Atualiza dados do aluno existente
      const [alunosUp]  = await pool.query(
        `UPDATE tbl_cadastro_al set rm = ?, nome = ?, data_nasc =?,  genero = ?, etnia = ?, email = ?, telefone = ?, resideCom = ?, id_endereco =?
          where id = ?
        `, [rm, nome, data_nasc, genero, etnia, email, telefone, resideCom, enderecoId, alunoId]
      )
    } else {
      const [alunoResult] = await pool.query(
        `INSERT INTO tbl_cadastro_al (rm, nome, data_nasc, genero, etnia, email, telefone, resideCom, id_endereco) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [rm, nome, data_nasc, genero, etnia, email, telefone, resideCom, enderecoId]
      );
      alunoId = alunoResult.insertId;
      if (!alunoId) {
        return res.status(500).json({ err: "Erro ao inserir aluno." });
      }
    }

    // Insere responsáveis e junção
    const responsaveisIds = [];
    for (const r of responsaveis) {
      const rCpf = String((r.cpf || "").replace(/\D/g, ""));
      const rNome = String(r.nome || "").trim();
      const rEstadoCivil = r.estadoCivil || null;
      const rEmail = String(r.email || "").trim();
      const rTelefone = String((r.telefone || "").replace(/\D/g, ""));
      const rParentesco = String(r.parentesco || "").trim();

      if (!validarCPF(rCpf)) {
        return res.status(400).json({ err: `CPF inválido do responsável: ${rNome || rCpf}` });
      }
      if (!rNome) {
        return res.status(400).json({ err: "Nome do responsável é obrigatório." });
      }

      // Verifica se responsável já existe por CPF
      let respId = null;
      const [existingResp] = await pool.query(`SELECT id FROM tbl_responsavel WHERE CPF = ? AND deletedAt IS NULL LIMIT 1`, [rCpf]);
      if (existingResp && existingResp.length > 0) {
        respId = existingResp[0].id;
        // Atualiza dados do responsável
        await pool.query(`INSERT INTO juncao_al_responsaveis (id_aluno, id_responsaveis) VALUES (?, ?)`, [alunoId, respId]);
      } else {
        const [resResult] = await pool.query(
          `INSERT INTO tbl_responsavel (CPF, nome, estado_civil, email, telefone, parentesco) VALUES (?, ?, ?, ?, ?, ?)`,
          [rCpf, rNome, rEstadoCivil, rEmail, rTelefone, rParentesco]
        );
        respId = resResult.insertId;
        if (!respId) {
          return res.status(500).json({ err: "Erro ao inserir responsável." });
        }
      }

      responsaveisIds.push(respId);
      // Insere junção somente se não existir
      const [existingJuncao] = await pool.query(`SELECT 1 FROM juncao_al_responsaveis WHERE id_aluno = ? AND id_responsaveis = ? LIMIT 1`, [alunoId, respId]);
      if (!existingJuncao || existingJuncao.length === 0) {
        await pool.query(`INSERT INTO juncao_al_responsaveis (id_aluno, id_responsaveis) VALUES (?, ?)`, [alunoId, respId]);
      }
    }

    // Insere curso (se fornecido) e junção
    if (cursoInformacoes && cursoInformacoes.curso) {
      const curso = String(cursoInformacoes.curso || "").trim();
      const turno = String((cursoInformacoes.turno || "").toLowerCase()).trim() || 'manhã';
      const semestre = parseInt(cursoInformacoes.modulo ? String(cursoInformacoes.modulo).replace(/\D/g, '') : '1') || 1;
      const modalidade = cursoInformacoes.modalidade || 'presencial';

      // Verifica curso existente
      let cursoId = null;
      const [existingCurso] = await pool.query(`SELECT id FROM tbl_curso WHERE curso = ? and semestre = ?`, [curso, semestre]);
      if (existingCurso && existingCurso.length > 0) {
        cursoId = existingCurso[0].id;
      }else{
        return res.status(400).json({err: "Curso inválido."})
      }
      if (cursoId) {
        const [existingJ] = await pool.query(`SELECT 1 FROM juncao_al_curso WHERE id_aluno = ? AND id_curso = ? LIMIT 1`, [alunoId, cursoId]);
        if (!existingJ || existingJ.length === 0) {
          await pool.query(`INSERT INTO juncao_al_curso (id_aluno, id_curso) VALUES (?, ?)`, [alunoId, cursoId]);
        }
      }
    }

    let idAlergias = null;
    const alergiaFlag = normalizeYesNo(saude.possuiAlergia || saude.possiuAlergia || saude.possuiAlergia);
    const [existsAlergia] = await pool.query(`SELECT id FROM tbl_alergias WHERE alergias = ? AND tp_alergia <=> ? LIMIT 1`, [alergiaFlag, saude.qualAlergia || null]);
    if (existsAlergia && existsAlergia.length > 0) idAlergias = existsAlergia[0].id;
    else {
      const [alergiasRes] = await pool.query(`INSERT INTO tbl_alergias (alergias, tp_alergia) VALUES (?, ?)`, [alergiaFlag, saude.qualAlergia || null]);
      idAlergias = alergiasRes.insertId;
    }

    // diagnostico
    let idDiag = null;
    const diagFlag = normalizeYesNo(saude.diagnostica || saude.diagnostico);
    const [existsDiag] = await pool.query(`SELECT id FROM tbl_diagnostico WHERE diagnostico = ? AND tp_diag <=> ? LIMIT 1`, [diagFlag, saude.tp_diag || null]);
    if (existsDiag && existsDiag.length > 0) idDiag = existsDiag[0].id;
    else {
      const [diagRes] = await pool.query(`INSERT INTO tbl_diagnostico (diagnostico, tp_diag) VALUES (?, ?)`, [diagFlag, saude.tp_diag || null]);
      idDiag = diagRes.insertId;
    }

    // deficiencias
    let idDef = null;
    const defFlag = normalizeYesNo(saude.deficiencia);
    const [existsDef] = await pool.query(`SELECT id FROM tbl_deficiencias WHERE deficiencia = ? AND tp_defi <=> ? LIMIT 1`, [defFlag, saude.tp_defi || null]);
    if (existsDef && existsDef.length > 0) idDef = existsDef[0].id;
    else {
      const [defRes] = await pool.query(`INSERT INTO tbl_deficiencias (deficiencia, tp_defi) VALUES (?, ?)`, [defFlag, saude.tp_defi || null]);
      idDef = defRes.insertId;
    }

    // restricoes
    let idRestr = null;
    const restrFlag = normalizeYesNo(saude.restricaoAlimentar);
    const [existsRestr] = await pool.query(`SELECT id FROM tbl_restricoes WHERE restri_alimentar = ? AND tp_restricao <=> ? LIMIT 1`, [restrFlag, saude.qualRestricao || null]);
    if (existsRestr && existsRestr.length > 0) idRestr = existsRestr[0].id;
    else {
      const [restrRes] = await pool.query(`INSERT INTO tbl_restricoes (restri_alimentar, tp_restricao) VALUES (?, ?)`, [restrFlag, saude.qualRestricao || null]);
      idRestr = restrRes.insertId;
    }

    // medicamentos
    let idMedi = null;
    const mediFlag = normalizeYesNo(saude.medicamentos);
    const [existsMedi] = await pool.query(`SELECT id FROM tbl_medicamentos WHERE medicamento = ? AND tp_medi <=> ? LIMIT 1`, [mediFlag, saude.qualMedicamento || null]);
    if (existsMedi && existsMedi.length > 0) idMedi = existsMedi[0].id;
    else {
      const [mediRes] = await pool.query(`INSERT INTO tbl_medicamentos (medicamento, tp_medi) VALUES (?, ?)`, [mediFlag, saude.qualMedicamento || null]);
      idMedi = mediRes.insertId;
    }

    // cirurgias
    let idCirc = null;
    const circFlag = normalizeYesNo(saude.cirurgia);
    const [existsCirc] = await pool.query(`SELECT id FROM tbl_cirurgias WHERE internacao_cirurgia = ? AND tp_cirurgia <=> ? LIMIT 1`, [circFlag, saude.qualCirurgia || null]);
    if (existsCirc && existsCirc.length > 0) idCirc = existsCirc[0].id;
    else {
      const [circRes] = await pool.query(`INSERT INTO tbl_cirurgias (internacao_cirurgia, tp_cirurgia) VALUES (?, ?)`, [circFlag, saude.qualCirurgia || null]);
      idCirc = circRes.insertId;
    }

    // psicologico
    let idPsi = null;
    const psiFlag = normalizeYesNo(comportamento.acompPsi);
    const [existsPsi] = await pool.query(`SELECT id FROM tbl_psicologico WHERE psicologico = ? AND tp_psi <=> ? LIMIT 1`, [psiFlag, comportamento.qualAcompPsi || null]);
    if (existsPsi && existsPsi.length > 0) idPsi = existsPsi[0].id;
    else {
      const [psiRes] = await pool.query(`INSERT INTO tbl_psicologico (psicologico, tp_psi) VALUES (?, ?)`, [psiFlag, comportamento.qualAcompPsi || null]);
      idPsi = psiRes.insertId;
    }

    // internet
    let idInt = null;
    const intFlag = normalizeYesNo(comportamento.acesInternet);
    const [existsInt] = await pool.query(`SELECT id FROM tbl_internet WHERE acesso = ? AND tp_acesso <=> ? LIMIT 1`, [intFlag, comportamento.quaisAcessos || null]);
    if (existsInt && existsInt.length > 0) idInt = existsInt[0].id;
    else {
      const [intRes] = await pool.query(`INSERT INTO tbl_internet (acesso, tp_acesso) VALUES (?, ?)`, [intFlag, comportamento.quaisAcessos || null]);
      idInt = intRes.insertId;
    }

    // atividade fisica
    let idAtiv = null;
    const ativFlag = normalizeYesNo(comportamento.pratAtiv);
    const [existsAtiv] = await pool.query(`SELECT id FROM tbl_atividadeFisica WHERE pratica = ? AND tp_ativ <=> ? LIMIT 1`, [ativFlag, comportamento.quaisAtividades || null]);
    if (existsAtiv && existsAtiv.length > 0) idAtiv = existsAtiv[0].id;
    else {
      const [ativRes] = await pool.query(`INSERT INTO tbl_atividadeFisica (pratica, tp_ativ) VALUES (?, ?)`, [ativFlag, comportamento.quaisAtividades || null]);
      idAtiv = ativRes.insertId;
    }

    // dificuldades educacionais
    let idDiff = null;
    const diffFlag = normalizeYesNo(comportamento.dificulAprendizagem);
    const [existsDiff] = await pool.query(`SELECT id FROM tbl_dificuldades_educacionais WHERE dificuldades = ? AND tp_dificuldades <=> ? LIMIT 1`, [diffFlag, comportamento.quaisAprendizagens || null]);
    if (existsDiff && existsDiff.length > 0) idDiff = existsDiff[0].id;
    else {
      const [diffRes] = await pool.query(`INSERT INTO tbl_dificuldades_educacionais (dificuldades, tp_dificuldades) VALUES (?, ?)`, [diffFlag, comportamento.quaisAprendizagens || null]);
      idDiff = diffRes.insertId;
    }

    
    const sexoVal = saude.sexo || saude.sexoMedico || alunoInformacoes.genero || null;
    const tp_sangue = saude.tp_sangue || saude.tipoSanguineo || null;
    const gravidezVal = saude.gravidez || saude.gravidez;
    const alcoolVal = saude.alcool || saude.alcool;
    const fumoVal = saude.fumante || saude.fumo;
    const drogasVal = saude.drogas || saude.drogas;
    const obs = saude.obs || saude.historicoFamiliar || null;

    
    let laudo = null;
    if (req.file) {
      laudo = req.file.path || req.file.url || req.file.secure_url || req.file.location || req.file.filename || req.file.publicUrl || null;
    }
    if (!laudo && saude && typeof saude.laudo === 'string' && saude.laudo.trim()) {
      laudo = saude.laudo.trim();
    }
  
    if (sexoVal && !enumSexo.includes(String(sexoVal).toLowerCase())) return res.status(400).json({ err: "Sexo inválido." });
    if (tp_sangue && !enumTpSangue.includes(String(tp_sangue))) return res.status(400).json({ err: "Tipo sanguíneo inválido." });
    if (gravidezVal && !enumSimNao.includes(String(gravidezVal).toLocaleLowerCase())) return res.status(400).json({ err: "Gravidez inválida." });
    if (alcoolVal && !enumSimNao.includes(String(alcoolVal).toLowerCase())) return res.status(400).json({ err: "Álcool inválido." });
    if (fumoVal && !enumSimNao.includes(String(fumoVal).toLowerCase())) return res.status(400).json({ err: "Fumo inválido." });
    if (drogasVal && !enumSimNao.includes(String(drogasVal).toLowerCase())) return res.status(400).json({ err: "Drogas inválida." });

    const peso = saude.peso ? parseFloat(String(saude.peso).replace(',', '.')) : null;
    const altura = saude.altura ? parseFloat(String(saude.altura).replace(',', '.')) : null;

    // Calcula idade: prefer saude.idade, senão tenta derivar de data_nasc do aluno, senão usa 0 para satisfazer NOT NULL
    let idade = null;
    if (saude.idade) {
      idade = parseInt(String(saude.idade).replace(/\D/g, ''));
      if (isNaN(idade) || idade <= 0) return res.status(400).json({ err: "Idade inválida." });
    } else if (data_nasc) {
      // espera formato YYYY-MM-DD ou compatível
      const nasc = new Date(data_nasc);
      if (!isNaN(nasc)) {
        const now = new Date();
        let computed = now.getFullYear() - nasc.getFullYear();
        const m = now.getMonth() - nasc.getMonth();
        if (m < 0 || (m === 0 && now.getDate() < nasc.getDate())) computed--;
        idade = computed >= 0 ? computed : 0;
      } else {
        idade = 0;
      }
    } else {
      idade = 0;
    }

    if (saude.peso && (isNaN(peso) || peso <= 0)) return res.status(400).json({ err: "Peso inválido." });
    if (saude.altura && (isNaN(altura) || altura <= 0)) return res.status(400).json({ err: "Altura inválida." });
    const [anamAlu]= await pool.query(
      `SELECT * FROM tbl_dadosMedicos WHERE id_aluno = ?`, [alunoId]
    )

    if(anamAlu.length > 0){
      return res.status(200).json({err: "Aluno Cadastrado com sucesso."})
    }
    const [dmRes] = await pool.query(
      `INSERT INTO tbl_dadosMedicos (sexo, tp_sangue, peso, altura, gravidez, idade, alcool, fumo, drogas, obs, laudo, id_alergias, id_diagnostico, id_deficiencias, id_restricoes, id_cirurgias, id_medicamentos, id_aluno, id_dificuldades, id_psicologico, id_internet, id_atividadeFisica) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [sexoVal || alunoInformacoes.genero || null, tp_sangue, peso, altura, normalizeYesNo(gravidezVal), idade, normalizeYesNo(alcoolVal), normalizeYesNo(fumoVal), normalizeYesNo(drogasVal), obs, laudo, idAlergias, idDiag, idDef, idRestr, idCirc, idMedi, alunoId, idDiff, idPsi, idInt, idAtiv]
    );
    return res.status(200).json({ response: "Dados recebidos e salvos" });
  } catch (err) {
    console.error("❌ Erro ao salvar formulário:", err);
    return res.status(500).json({ error: "Erro ao salvar formulário", details: err.message });
  }
});

export default router;














// Vamos lá, akkakakka
// Caro programador aqui é o Guilherme,
// Eu sinto muito pelo pecado que eu vou cometer aqui
// mas por questões muito mais importates (isso tem q funcionar o mais rápido possivel)
// eu sinto muito mesmo, boa sorte para entender oque está aqui.
// Se por algum mótivo você queira minha ajuda para tentar entender alguma coisa 
// este é meu email pessoal: andrade171120@gmail.com
// Não garanto que vou conseguir te ajudar
// Então Boa sorte e que Deus tenha piedade da sua alma 🥲