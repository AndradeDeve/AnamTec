import express from "express";
import professor from "../entities/professor";
import { AppDataSource } from "../database/data-souce";
import { Like } from "typeorm";
import routes from "./userController";

routes = express.Router();
professorRepository = AppDataSource.getRepository(professor);

routes.get("/", async(request, response) =>{
    const professores = await professorRepository.findBy({tipo:"common"});
    return response.status(200).send({"response": professores});
});

routes.get("/:nameFound", async (request, response) => {
    const {nameFound} = request.params;
    const userFound = await userRepository.findBy({name: Like
        (`%${nameFound}%`)
    });
    return response.status(200).send({"response": userFound});
});


routes.post("/", async (request, response) => {
    const {rm, nome, email, senha, tipo} = request.body;

    if (!email.toLowerCase().includes("@")){
        return response.status(400).send({"response": "O email está incorreto"});
    };
    if(senha.length < 6){
        return response.status(400).send({"response": "Campo 'Senha' deve conter no minimo 6 carcteres"});
    };
    //Colocar mais uma validação do nome. Ele n pode conter números
    if(nome.length < 1){
        return response.status(400).send({"response":"Campo 'Nome' deve conter no minimo 1 caracter"});
    };
    if(rm.length > 10 || rm.length < 4){
        return response.status(400).send({"response": "Campo 'RM' deve conter entre 4 a 10 caracteres"});
    };
    if(tipo.toLowerCase() !== "adimin" && tipo.toLowerCase() !== "common"){
        return response.status(400).send({"response": "O tipo de usuário deve ser 'adimin' ou 'common'"});
    };

    const newProfessor = professorRepository.create({rm, nome, email, senha, tipo});
    await professorRepository.save(newProfessor);
    return response.status(201).send("Professor cadastrado com sucesso");
});

export default routes;
