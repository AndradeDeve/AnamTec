import express from "express";
import cadastroAlunoController from "./controller/cadastoAlunoController.js"

const routes = express();

routes.use("/aluno", cadastroAlunoController);

export default routes;