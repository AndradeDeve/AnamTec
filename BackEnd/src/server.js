import express from "express";
import routes from "./routes.js";
import pool from "./database/data-source.js";
import cors from 'cors';
import dotenv from 'dotenv';


dotenv.config();
const server = express();
server.use(cors());
server.use(express.json());
server.use("/", routes);

async function startServer() {
    try{
        const connection = await pool.getConnection();
        console.log("Banco conectado com sucesso!");

        server.listen(3332, ()=>{
            console.log("O servidor está funcionando 😎 port: 3332");
        })
        connection.release()
    }catch (error){
        console.log("Erro ao se conextar com o banco de dados! 🤨", error);
    };
};

startServer();