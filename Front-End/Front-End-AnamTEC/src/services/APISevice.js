// Importa a biblioteca axios, usada para fazer requisições HTTP (GET, POST, etc)
import axios from "axios";

// Define a URL base da API. Tenta pegar do arquivo .env (variável de ambiente), se não encontrar usa localhost como padrão
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3332";

// Função assíncrona que faz uma requisição GET para buscar dados dos alunos
export async function getFunctionaluno() {
  // Faz uma requisição GET para: http://localhost:3332/aluno (ou URL definida no .env)
  const response = await axios.get(`${API_URL}/aluno`);
  
  // Retorna apenas os dados da resposta (sem cabeçalhos e outras informações do axios)
  return response.data;
}

// Função assíncrona que envia dados para a API usando o método POST
export async function postFunctionaluno(dados) {
  // Mostra no console os dados que serão enviados — útil para depuração
  console.log(dados);

  // Faz a requisição POST para http://localhost:3332/aluno com os dados fornecidos
  const response = await axios.post(`${API_URL}/aluno`, dados);

  // Retorna os dados da resposta (ex: mensagem de sucesso, objeto salvo, etc.)
  return response.data;
}

export async function postFunctionUser(dados) {
    const response = await axios.post(`${API_URL}/login`, dados);
    return response;
}

export async function putFunctionResetSenha(dados) {
  console.log("dados: ",dados)
  const response = await axios.put(`${API_URL}/login/`, dados);
  console.log("Resposta do servidor:", response); 
  return response;
}
