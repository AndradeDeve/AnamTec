import express from "express";
import routes from "./routes.js";
import {getConnection} from "./database/data-souce.js";
import cors from 'cors';
import dotenv from 'dotenv';


dotenv.config();
const server = express();
server.use(cors());
server.use(express.json());
server.use("/", routes);

async function startServer() {
    try{
        await getConnection();
        console.log("Banco conectado com sucesso!");

        server.listen(3332, ()=>{
            console.log("O servidor está funcionando 😎");
        })
    }catch (error){
        console.log("Erro ao se conextar com o banco de dados! 🤨", error);
    };
};

startServer();