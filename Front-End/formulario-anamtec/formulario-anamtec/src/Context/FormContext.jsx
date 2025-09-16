import { createContext, useState } from "react";

export const FormContext = createContext();

export function FormProvider({ children}) {
    const [informacoes, setInformacoes] = useState({
        nome: "", 
        curso: "", 
        dataNascimento: "", 
        turno: "", 
        modulo: "", 
        idade: "", 
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
    });

    return (
        <FormContext.Provider value={{ informacoes, setInformacoes }}>
            {children}
        </FormContext.Provider>
    );
}