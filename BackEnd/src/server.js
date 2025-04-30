import express from "express";
// import routes from "./Routes.js";
import {AppDataSource} from "./database/data-souce.js";
import cors from 'cors';


const server = express();
server.use(cors())
server.use(express.json)
// server.use("/", routes)

AppDataSource.initialize().then(async () => {
    console.log("Banco de dados conectado!!")

    server.listen(333, () => {
        console.log("O servidor está funcionando! 😎")
    });
});

