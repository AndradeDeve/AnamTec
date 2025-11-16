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

    responsavel: [
    {
        nome: "",
        cpf: "",
        parentesco: "",
        telefone: "",
        estadoCivil: "",
        email: "",
    }
],


    saude: {
        tipoSanguineo: "",
        possuiLaudo: "",
        possiuAlergia: "",
        fumante: "",
        alcool: "",
        medicamentos: "",
        gravidez: "",
        restricaoAlimentar: "",
        cirurgia: "",
        laudo: null, 
    },

    comportamento: {
        dificulAprendizagem: "",
        quaisAprendizagens: "",
        acomPsi: "",
        qualAcompPsi: "",
        acesInternet: "",
        quaisAcessos: "",
        pratAtiv: "",
        quaisAtividades: "",
    }
});

    return (
        <FormContext.Provider value={{ dadosFormulario, setDadosFormulario }}>
            {children}
        </FormContext.Provider>
    );
}