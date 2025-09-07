import axios from "axios";

const apiBaseUrl = "http://localhost:3002"; 

export async function enviarEmailAlunos(dados) {
  try {
    const response = await axios.post(`${apiBaseUrl}/alertAluno/sendEmail`, dados);
    const emails = response.data;
    console.log("Emails dos alunos:", emails);
    return emails;
  } catch (error) {
    console.error("Erro ao buscar emails dos alunos:", error);
    throw error;
  }
}

