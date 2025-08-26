import express from 'express';
import cadastroAlunoController from './controller/cadastroAlunoController.js';
import usuarioController from './controller/usuarioController.js';
import responsavelController from './controller/responsavelController.js';
import alergiaController from './controller/alergiaController.js';
import deficienciaController from './controller/deficienciaController.js'
import cirurgiasController from './controller/cirurgiasController.js';
import loginController from './controller/loginController.js';
import { authenticate } from "./utils/jwt.js";
import { authorizationRoles } from './utils/jwt.js';
//  authorizationRoles("coordenador curso") Exemplo de como usar 

const routes = express();

routes.use("/cirurgias", cirurgiasController);
routes.use("/deficiencia", deficienciaController);
routes.use("/alergias", alergiaController);     
routes.use("/responsavel", responsavelController);
routes.use("/aluno", cadastroAlunoController);
routes.use("/user", authenticate, usuarioController);
routes.use("/login", loginController);

export default routes;