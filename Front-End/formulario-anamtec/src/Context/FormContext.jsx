import { createContext, useState, useEffect } from "react";

export const FormContext = createContext();

export function FormProvider({ children}) {
    const STORAGE_KEY = "anamtec_dados_form";

    const defaultState = {
        alunoInformacoes: {
            nome: "", 
            rm: "",
            dataNascimento: "", 
            genero: "", 
            resideCom: "",
            cpf: "",
            telefone: "",
            etnia: "",
            email: ""
        },

        logradouroInformacoes: {
            cep: "", 
            numero: "", 
            complemento: "", 
            logradouro: "", 
            bairro: "", 
            cidade: "", 
            uf: ""
        },

        cursoInformacoes: {
            curso: "",
            turno: "",
            modulo: "",
        },

        // Inicia vazio: só aparece quando o usuário clicar em 'Adicionar Responsável'
        responsavel: [],

        saude: {
            tipoSanguineo: "",
            possuiLaudo: "",
            possuiAlergia: "",
            qualAlergia: "",
            fumante: "",
            alcool: "",
            medicamentos: "",
            qualMedicamento: "",
            gravidez: "",
            quantidadeGravidez: "",
            restricaoAlimentar: "",
            qualRestricao: "",
            cirurgia: "",
            qualCirurgia: "",
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
    };

    // Carrega do localStorage, se existir, e faz merge com o estado padrão
    const loadInitial = () => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return defaultState;
            const saved = JSON.parse(raw);
            return { ...defaultState, ...(saved || {}) };
        } catch (err) {
            console.error('Erro ao carregar estado do localStorage:', err);
            return defaultState;
        }
    };

    const [dadosFormulario, setDadosFormulario] = useState(loadInitial);

    // Salva no localStorage com debounce para evitar escrita excessiva
    useEffect(() => {
        const handler = setTimeout(() => {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(dadosFormulario));
            } catch (err) {
                console.error('Erro ao salvar estado no localStorage:', err);
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(handler);
    }, [dadosFormulario]);

    return (
        <FormContext.Provider value={{ dadosFormulario, setDadosFormulario }}>
            {children}
        </FormContext.Provider>
    );
}