import express from "express";
import userController from "./controller/userController";

const routes = express();

routes.use("/user", userController);

export default routes;