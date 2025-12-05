import express from "express";
import routes from "./routes.js";
import uploadRoutes from "./utils/uploadRoutes.js";
import pool from "./database/data-source.js";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const server = express();
server.use(cors());
server.use(express.json());

server.use("/uploads", express.static(path.resolve("uploads")));

server.use("/", routes);

server.use("/upload", uploadRoutes);

async function startServer() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Banco conectado com sucesso!");

        server.listen(3332, ()=>{
            console.log("O servidor está funcionando 😎 port: 3332");
        })
        connection.release()
    }catch (error){
        console.log("Erro ao se conextar com o banco de dados! 🤨", error);
    };
};

startServer();


// Querido programador:

// Quando escrevi este código, só Deus e eu 
// sabíamos como ele funcionava.
// Agora, só Deus sabe!

// Portanto, se você está tentando otimizar 
// alguma função e ela falhar (o que é bem provável),
// por favor, aumente o contador a baixo e invoque o nome de Deus em sua mente
// antes de começar a depurar o código.
// Eu lhe asseguro que isso ajudará.
// Obrigado por sua compreensão.

// total_de_Horas_pedidas_para_entender_este_codigo = 2.142


