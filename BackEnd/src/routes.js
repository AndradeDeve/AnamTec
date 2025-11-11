import express from 'express';
import alunoController from './controller/alunoController.js';
import usuarioController from './controller/usuarioController.js';
import responsavelController from './controller/responsavelController.js';
import alergiaController from './controller/alergiaController.js';
import deficienciaController from './controller/deficienciaController.js'
import cirurgiasController from './controller/cirurgiasController.js';
import loginController from './controller/loginController.js';
import cursoController from './controller/cursoController.js';
import typeController from './controller/typeController.js'
import enderecoController from './controller/enderecoController.js'
import diagnosticaController from './controller/diagnosticaController.js'
import restricoesController from './controller/restricoesController.js'
import registroAulasController from './controller/registroAulasController.js'
import medicamentosController from './controller/medicamentosController.js'
import dadosMedicosController from './controller/dadosMedicosController.js'
import resetSenhaController from './controller/resetSenhaController.js'
import formularioAnamneseController from './controller/formularioAnamneseController.js';
import { authenticate } from "./utils/jwt.js";
import { authorizationRoles } from './utils/jwt.js';
//   Exemplo de como usar 

const routes = express();   

routes.use("/formularioAnamnese", formularioAnamneseController);
routes.use("/cirurgias", cirurgiasController);
routes.use('/resetSenha', authenticate, resetSenhaController);
routes.use("/deficiencia", deficienciaController);
routes.use("/alergias", alergiaController);     
routes.use("/responsavel", responsavelController);
routes.use("/aluno", alunoController);
routes.use("/user", authenticate,usuarioController);
routes.use("/login", loginController);
routes.use('/cursos', cursoController);
routes.use("/type", typeController);
routes.use("/endereco", enderecoController);
routes.use("/diagnostico", diagnosticaController);
routes.use("/restricoes", restricoesController);
routes.use("/registroAulas", registroAulasController);
routes.use("/medicamentos", medicamentosController);
routes.use("/dadosMedicos", dadosMedicosController);    

export default routes;