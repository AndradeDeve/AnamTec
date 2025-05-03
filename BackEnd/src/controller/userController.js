import express from "express";
import { AppDataSource } from "../database/data-souce.js";
import { Like } from "typeorm";

routes = express.Router();
userRepository = AppDataSource.getRepository()

export default routes;