import express from "express";
// import routes from "./Routes.js";
import {AppDataSource} from "./database/data-souce.js";

const server = express();
server.use(express.json)
// server.use("/", routes)

AppDataSource.initialize().then(async () => {
    console.log("Banco de dados conectado!!")

    server.listen(3333, () => {
        console.log("O servidor está funcionando! 😎")
    });
});

