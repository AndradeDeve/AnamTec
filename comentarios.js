import express from "express";
import mongoose from "mongoose";

const routes = express.Router();


const conectar = async () => {
    try{
        let dbUrl = 'mongodb+srv://NathashaGama:ILoveBts.7@cluster0.ggor31v.mongodb.net/';
        await mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        return res.status(200).json({response:' foiiiiiiii'})
    }catch (err) {
         console.error('Erro de conexão:', err , 'T-T');
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
        minlength: 30
    },
    id_professor:{
        type: String,
        required: true
    },
    
        timestamps: true //isso aqui é createdAt 👍👍👍👍👍👍👍
        //acho que esse createdAt tem que ficar fora do bloco de codigo, mas não tenho certeza 
});

const Registro = mongoose.model('Registro', comentarios)


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
//esse aqui é outro modelo de get que eu peguei pela ia ;-;
routes.get('/aulas', async (req, res) => {
    try {
        const Aula = mongoose.model('Aula'); //porque isso??????
        const aulas = await Aula.find({ ativo: true });
        
        if (!aulas.length) {
            return res.status(404).json({ err: 'Nenhuma aula encontrada.' });
        }
        
        return res.status(200).json({ response: aulas });
    } catch (err) {
        console.error('Erro ao buscar aulas:', err);
        return res.status(500).json({ err: 'Erro no servidor.' });
    }
});



//post do gui no mysql para usar de base 
routes.post('/', async (req, res) => {
  const { comentario, id_professor } = req.body;

  if (!comentario || comentario.length > 1000) {
    return res.status(400).json({ err: 'Comentário inválido ou muito longo (máx 1000 caracteres).' });
  }

  if (!id_professor || isNaN(id_professor)) {  //não preciso desse porque não tem tabela pra puxar o id do professor
    return res.status(400).json({ err: 'ID do professor inválido.' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO registros_aulas (comentario, id_professor) VALUES (?, ?)',
      [comentario.trim(), id_professor] //pra quê serve isso???
    );
    return res.status(201).json({ response: 'Registro de aula cadastrado com sucesso.', id: result.insertId });
  } catch (err) {
    console.error('Erro ao cadastrar registro de aula:', err);
    return res.status(500).json({ err: 'Erro no servidor.' });
  }
});

//post meu 
routes.post('/', async (req, res) =>{
    const modificar = req.body;
    if(!modificar || modificar.length > 3000 || modificar.length < 30){
        return res.status(400).json({err: 'Comentario inexistente, muito curto ou muito longo'})
    }
    try {
        modificar.trim();
        return res.status(201).json('Comentario atualizado com sucesso')
    }catch (err){

    }
});

export default routes;