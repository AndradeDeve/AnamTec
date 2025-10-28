const express = require('express');
import mongoose from 'mongoose';
const mongosse = require('mongosse');
const routes = express.Router();


const conectar = async () => {
    try{
        let dbUrl = 'mongodb+srv://NathashaGama:ILoveBts.7@cluster0.ggor31v.mongodb.net/';
        await mongoose.connect(dbURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('HELLO WORLD!')
    }catch (error) {
         console.error('Erro de conexão:', error);
    }
};
conectar();
export default routes;