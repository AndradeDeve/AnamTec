import express from "express";

const server = express();
server.use(express.json)

server.listen(333, () => {
    console.log("O servidor está funcionando! 😎")
})