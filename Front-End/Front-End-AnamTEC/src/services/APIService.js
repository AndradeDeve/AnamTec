// Importa a biblioteca axios, usada para fazer requisições HTTP (GET, POST, etc)
import axios from "axios";

// Define a URL base da API. Tenta pegar do arquivo .env (variável de ambiente), se não encontrar usa localhost como padrão
const apiUrl = process.env.REACT_APP_API_URL;


// Função assíncrona que faz uma requisição GET para buscar dados dos alunos
export async function getFunctionaluno() {
  // Faz uma requisição GET para: http://localhost:3332/aluno (ou URL definida no .env)
  const response = await axios.get(`${apiUrl}/aluno`);
  
  // Retorna apenas os dados da resposta (sem cabeçalhos e outras informações do axios)
  return response.data;
}

// Função assíncrona que envia dados para a API usando o método POST
export async function postFunctionaluno(dados) {
  // Mostra no console os dados que serão enviados — útil para depuração
  console.log(dados);

  // Faz a requisição POST para http://localhost:3332/aluno com os dados fornecidos
  const response = await axios.post(`${apiUrl}/aluno`, dados);

  // Retorna os dados da resposta (ex: mensagem de sucesso, objeto salvo, etc.)
  return response.data;
}

export async function postFunctionUser(dados) {
  // console.log("dados: ", dados);
  const response = await axios.post(`${apiUrl}/user`, dados , { 
    headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}});
  return response;
}

export async function postFunctionLogin(dados) {
    const response = await axios.post(`${apiUrl}/login`, dados);
    return response;
}

export async function putFunctionResetSenha(dados ) {
  const response = await axios.put(`${apiUrl}/login/`, dados , { 
    headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}});
  return response;
}
