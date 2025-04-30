import express from "express";
import { AppDataSource } from "../database/data-souce.js";

routes = express.Router();
userRepository = AppDataSource.getRepository()

export default Routes