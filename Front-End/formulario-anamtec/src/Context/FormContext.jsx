import { createContext, useState } from "react";

export const FormContext = createContext();

export function FormProvider({ children}) {
    const [dadosFormulario, setDadosFormulario] = useState({
    
        informacoesPrincipais: {
        nome: "", 
        rm: "",
        curso: "", 
        dataNascimento: "", 
        turno: "", 
        modulo: "",  
        genero: "", 
        resideCom: "", 
        email: "", 
        cep: "", 
        numero: "", 
        complemento: "", 
        logradouro: "", 
        bairro: "", 
        cidade: "", 
        uf: "",
    },

    responsaveis: [{
        nome: "",
        telefone: "",
        parentesco: "",
        email: "",
        endereco: "",
    }],

    saude: {
        tipoSanguineo: "",
        possuiLaudo: "",
        possiAlergia: "",
        fumante: "",
        alcool: "",
        medicamentos: "",
        gravidez: "",
        restricaoAlimentar: "",
        cirurgia: "",
        laudo: null, 
    },

    comportamento: {
        dificuldadesAprendizagem: "",
        comportamento: "",
        emocionais: "",
    }
});

    return (
        <FormContext.Provider value={{ dadosFormulario, setDadosFormulario }}>
            {children}
        </FormContext.Provider>
    );
}