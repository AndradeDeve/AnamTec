import axios from 'axios';
const apiUrl = 'http://localhost:3332';

// Rotas para cadastro de alunos

// Manda todas as informações do aluno para o BackEnd
export const postFunctionAlunos = async (data) => {
    const response = await axios.post(`${apiUrl}/alunos`, data);
    return response;
}

// Busca todos os alunos cadastrados no banco de dados
export const getFunctionAlunos = async () => {
    const response = await axios.get(`${apiUrl}/alunos`);
    return response;
}

// Manda todas as informações médicas do aluno para o BackEnd
export const postFunctionDadosMedicos = async (data) => {
    const response = await axios.post(`${apiUrl}/dadosMedicos`, data);
    return response;
}

// Busca todos os dados médicos cadastrados no banco de dados
export const getFunctionDadosMedicos = async () => {
    const response = await axios.get(`${apiUrl}/dadosMedicos`);
    return response;
}


// Manda todas as informações do endereço para o BackEnd
export const postFunctionEndereco = async (dados) => {
    const response = await axios.post(`${apiUrl}/endereco`, dados);
    return response;
}

// Busca todos os endereços cadastrados no banco de dados
export const getFunctionEndereco = async () => {
    const response = await axios.get(`${apiUrl}/endereco`);
    return response;
}