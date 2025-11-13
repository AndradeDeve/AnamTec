import express from "express";
import mongoose from "mongoose";

const routes = express.Router();


const conectar = async (req, res) => {
    try{
        let dbUrl = 'mongodb+srv://NathashaGama:ILoveBts.7@cluster0.ggor31v.mongodb.net/';
        await mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        return res.status(200).json(' foiiiiiiii')
    }catch (err) {
         console.error('Erro de conexão:', err);
         return res.status(500).json({err: "Servidor foi não em"})
    }
};

conectar();
// calma que eu vi agora que etem que colocar um modelo de dados no banco de dados não relacional
//isso o cristiano não explica hahahahahahahahahahha
//Nathasha você esqueceu de colocar o modelo, lembra de colocar amanhã
const comentarios_Aulas = new mongoose.Schema({
    comentario: {
        type: String,
        required: true, //não faço a minima ideia pra que isso serve, tem que pesquisar depois
        maxlength: 3000,
        minlength: 10
    },
    id_professor:{
        type: String,
        required: true
    },
    rm_aluno:{
      type: String,
      maxlength: 8,
      required: true
    },
    ativo:{
      type: Boolean,
      default: true
    }
  },{
    timestamps: true //isso aqui é createdAt 👍👍👍👍👍👍👍
        //acho que esse createdAt tem que ficar fora do bloco de codigo, mas não tenho certeza 
});

const Registro = mongoose.model('Registro', comentarios_Aulas)

// estou tentando fazer um crud baseado na logica que o gui tá usando nos outros arquivos 
routes.get('/', async (req, res) => {
  try {
    const registros = await db.collection('comentarios')
      .find({ ativo: true })  
      .toArray();
      if(!registros.length){
        return res.status(404).json({err: 'nenhum registro encontrado'})
      }
    return res.status(200).json( registros );
  } catch (err) {
    console.error('Erro ao buscar registros', err);
    return res.status(500).json({err: 'Erro no servidor queridos'})
  }
});


//post ainda em desenvolvimento porque eu não sei como fazer ;-;
routes.post('/', async (req, res) =>{
    const {comentario, id_professor, rm_aluno} = req.body;
    if(!comentario || comentario.length > 3000 || comentario.length < 10){
        return res.status(400).json({err: 'Comentario inexistente, muito curto ou muito longo'})
    }
    if(!id_professor){
      return res.status(400).json({err: 'Professor não encontrado'})
    }
    if(!rm_aluno){
      return res.status(400).json({err: 'Aluno não registrado'})
    }
    try {
        comentario.trim();
        const modificar = await db.collection('comentarios').insertOne({comentario: comentario,
           id_professor: id_professor,
           rm_aluno: rm_aluno,
           createdAt: new Date(), 
           ativo: true});
        return res.status(201).json('Comentario atualizado com sucesso');
    }catch (err){
      console.error('Erro ao cadastrar comentario de aula:', err);
      return res.status(500).json({err: 'Erro no servidor'}) //Acho que tá Certo 
    }
});

routes.put('/', async (req, res) =>{
  const {comentario, id_professor, rm_aluno} = req.body;
  if (!comentario || comentario.length > 3000 || comentario.length < 10){
    return res.status(400).json({err: 'Registo de aula inválido, muito curto ou muito longo'})
  }
  if(!id_professor){
      return res.status(400).json({err: 'Professor não encontrado'})
  }
  if(!rm_aluno){
      return res.status(400).json({err: 'Aluno não registrado'})
  }
  try{
    comentario.trim();
    const cadastrar = await db.updateOne({comentario});
    return res.status(201).json('Comentario cadastrado');
  }catch (err){
    console.error('Erro ao cadastrar comentario')
    return res.status(500).json({err: 'Erro no servidor'})
  } // Put cadatrado 
})
routes.put('/:id', async (req, res) => { // Esse é o do gui
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
    const [result] = await pool.query(
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
export default routes;