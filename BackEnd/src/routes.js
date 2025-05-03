import express from "express";
import professorController from "./controller/professorController.js";

const routes = express();

routes.use("/", professorController);

export default routes;