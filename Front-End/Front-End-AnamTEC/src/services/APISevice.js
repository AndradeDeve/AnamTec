import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3332"; 


export async function getFunction() {
  const response = await axios.get(`${API_URL}/aluno`);
  return response.data;
}

export async function postFunction(dados) {
  console.log(dados);
  const response = await axios.post(`${API_URL}/aluno`, dados);
  return response.data;
}
