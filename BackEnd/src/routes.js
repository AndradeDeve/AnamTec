import express from 'express';
import cadastroAlunoController from './controller/cadastroAlunoController.js';
import cadastroProfessoresController from './controller/cadastroProfessoresController.js';
import responsavelController from './controller/responsavelController.js';
import alergiaController from './controller/alergiaController.js';
import deficienciaController from './controller/deficienciaController.js'
import cirurgiasController from './controller/cirurgiasController.js';

const routes = express();

routes.use("/cirurgias", cirurgiasController);
routes.use("/deficiencia", deficienciaController);
routes.use("/alergias", alergiaController);     
routes.use("/responsavel", responsavelController);
routes.use("/aluno", cadastroAlunoController);
routes.use("/professor", cadastroProfessoresController);

export default routes;