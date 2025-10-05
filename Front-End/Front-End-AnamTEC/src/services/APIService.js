// Importa a biblioteca axios, usada para fazer requisições HTTP (GET, POST, etc)
import axios from "axios";

// Define a URL base da API. Tenta pegar do arquivo .env (variável de ambiente), se não encontrar usa localhost como padrão
const apiUrl = process.env.REACT_APP_API_URL;


export async function getFunctionAlunoSpecific(specific, value){
  const response = await axios.get(`${apiUrl}/aluno/specific?${specific}=${encodeURIComponent(value)}`, { 
    headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}});
  return response;
}

export async function  getFunctionAlunoCards() {
  const response = await axios.get(`${apiUrl}/aluno/card`, { 
    headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}});
  return response;
}

export async function postEmailAlunosPendentes() {
  const response = await axios.post(`${apiUrl}/aluno/emailAluno`, { 
    headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}});
  return response;
}

export async function getFunctionAlunoControll() {
  const response = await axios.get(`${apiUrl}/aluno`, { 
    headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}});
  return response
}

export async function getFunctionAlunoControllSpacific(spacific, value) {
  const response = await axios.get(`${apiUrl}/aluno/controll?${spacific}=${encodeURIComponent(value)}`, { 
    headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}});
  return response;
}


// Função assíncrona que faz uma requisição GET para buscar dados dos alunos
export async function getFunctionAluno() {
  // Faz uma requisição GET para: http://localhost:3332/aluno (ou URL definida no .env)
  const response = await axios.get(`${apiUrl}/aluno/curso`, { 
    headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}});
  
  // Retorna apenas os dados da resposta (sem cabeçalhos e outras informações do axios)
  return response.data;
}


// Função assíncrona que envia dados para a API usando o método POST
export async function postFunctionaluno(dados) {
  // Faz a requisição POST para http://localhost:3332/aluno com os dados fornecidos
  const response = await axios.post(`${apiUrl}/aluno`, encodeURIComponent(dados), { 
    headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}});
  
  // Retorna os dados da resposta (ex: mensagem de sucesso, objeto salvo, etc.)
  return response;
}

export async function getFunctionUser() {
  const response = await axios.get(`${apiUrl}/user`, { 
    headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}});
  return response;
}

export async function getFunctionUserSpecific(specific, value) {
  const response = await axios.get(`${apiUrl}/user/specific?${specific}=${encodeURIComponent(value)}`, { 
    headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}});
  return response
}

export async function postFunctionUser(dados) {
  const response = await axios.post(`${apiUrl}/user`, dados , { 
    headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}});
  return response;
}

export async function postFunctionLogin(dados) {
    const response = await axios.post(`${apiUrl}/login`, dados, { 
    headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}});
    return response;
}

export async function putFunctionResetSenha(dados ) {
  const response = await axios.put(`${apiUrl}/resetSenha/`, dados , { 
    headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}});
  return response;
}

export async function putFunctionEmailReset(dados ) {
  const response = await axios.put(`${apiUrl}/login/emailReset`, encodeURIComponent(dados), { 
    headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}});
  return response;
}

