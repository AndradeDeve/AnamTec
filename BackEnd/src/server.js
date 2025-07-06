import express from "express";
import cors from "cors";

import routes from "./routes.js";
import cursoRoutes from "./controller/cursoController.js";
import enderecoController from "./controller/enderecoController.js";
import dadosMedicosController from "./controller/dadosMedicosController.js";
import diagnosticaController from "./controller/diagnosticaController.js";
import restricoesController from "./controller/restricoesController.js";

const server = express();

server.use(cors());
server.use(express.json());

server.use("/", routes);
server.use("/curso", cursoRoutes);
server.use("/endereco", enderecoController);
server.use("/dadosMedicos", dadosMedicosController);
server.use("/diagnosticos", diagnosticaController);
server.use("/restricoes", restricoesController);

server.listen(3332, () => {
  console.log("O servidor está funcionando! 😎");
});