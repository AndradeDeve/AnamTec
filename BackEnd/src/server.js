import express from "express";
import routes from "./routes.js";
import {connection} from "./database/data-souce.js";
import cors from 'cors';

const server = express();
server.use(cors())
server.use(express.json())
server.use("/", routes)

connection.connect(async () => {
    server.listen(3332, () => {
        console.log("O servidor está funcionando! 😎")
    });
});

