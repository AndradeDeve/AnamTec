import express from "express";
// import routes from "./Routes.js";
import {AppDataSource} from "./database/data-souce.js";
import cors from 'cors';
//Criando o servidor

const server = express();
server.use(cors())
server.use(express.json)
// server.use("/", routes)

AppDataSource.initialize().then(async () => {
    console.log("Banco de dados conectado!!")

    server.listen(3333, () => {
        console.log("O servidor está funcionando! 😎")
    });
});

