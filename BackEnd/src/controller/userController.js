import express from "express";
import { AppDataSource } from "../database/data-souce.js";
import { Like } from "typeorm";

const routes = express.Router();
userRepository = AppDataSource.getRepository()

export default routes;