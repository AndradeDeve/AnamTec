import express from "express";
import mongoose from "mongoose";

const routes = express.Router();

let db;
const conectar = async () => {
    try{
        let dbUrl = 'mongodb+srv://NathashaGama:ILoveBts.7@cluster0.ggor31v.mongodb.net/';
        await mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        db = mongoose.connection.db;
        console.log('FOIIIIIIIIIIIII')
    }catch (err) {
         console.error('Erro de conexão:', err);
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
        maxlength: 1000,
        minlength: 10,
        trim: true
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
    const registros = await Registro.find({ativo: true}) 
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
    if(!comentario || comentario.length > 1000 || comentario.length < 10){
        return res.status(400).json({err: 'Comentario inexistente, muito curto ou muito longo'})
    }
    if(!id_professor){
      return res.status(400).json({err: 'Professor não encontrado'})
    }
    if(!rm_aluno){
      return res.status(400).json({err: 'Aluno não registrado'})
    }
    try {
        const novoRegistro = new Registro({
          comentario: comentario.trim(),
          id_professor,
          rm_aluno
        });
        await novoRegistro.save();
        return res.status(201).json({message: 'Comentario atualizado com sucesso', data: novoRegistro});
    }catch (err){
      console.error('Erro ao cadastrar comentario de aula:', err);
      return res.status(500).json({err: 'Erro no servidor'}) //Acho que tá Certo 
    }
});

routes.put('/:id', async (req, res) =>{
  const {id} = req.params;
  const {comentario, id_professor} = req.body;

  if(!mongoose.Types.ObjectId.isValid(id)){
    return res.status(400).json({err: 'O ID não tá no Banco não filhão'})
  }
  if (!comentario || comentario.length > 1000 || comentario.length < 10){
    return res.status(400).json({err: 'Registo de aula inválido, muito curto ou muito longo'})
  }
  if(!id_professor){
      return res.status(400).json({err: 'Professor não encontrado'})
  }
  if(!rm_aluno){
      return res.status(400).json({err: 'Aluno não registrado'})
  }

  try{
    const registroAtualizado= await Registro.findbyIdAndUpdate(
      id,
      {comentario: comentario.trim(),
      id_professor
    },
    {new: true});
    if (!registroAtualizado){
      return res.status(404).json({err: 'O comentario não entrou no banco T-T'});
    }
    return res.status(200).json({
      message:'Comentario cadastrado',
      data: registroAtualizado
    });
  }catch (err){
    console.error('Erro ao cadastrar comentario')
    return res.status(500).json({err: 'Erro no servidor'})
  } // Put cadatrado 
});

routes.delete('/:id', async (req, res)=> {
  const {id} = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ err: 'ID não é inválido.' });
}

try {
    const registroDesativado = await Registro.findByIdAndUpdate(
        id,
        { ativo: false },
        { new: true }
    );

    if (!registroDesativado) {
        return res.status(404).json({ err: 'Comentario não encontrado.' });
    }

    return res.status(200).json({ message: 'Registro desativado com sucesso.' });
} catch (err) {
    console.error('Erro ao desativar registro de aula:', err);
    return res.status(500).json({ err: 'Erro no servidor.' });
}
})
export default routes;