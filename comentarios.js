import express from "express";
import mongoose from "mongoose";
const routes = express.Router();


const conectar = async () => {
    try{
        let dbUrl = 'mongodb+srv://NathashaGama:ILoveBts.7@cluster0.ggor31v.mongodb.net/';
        await mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('Banco conectado com suceso!')
    }catch (error) {
         console.error('Erro de conexão:', error);
    }
};

conectar();
export default routes;