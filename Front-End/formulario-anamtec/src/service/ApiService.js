import axios from 'axios';
const apiUrl = 'http://localhost:3332';

// --- Função única para mandar o formulário completo ---
export const postFormularioAnamnese = async (dados) => {
  try {
    // If there's a File object under dados.saude.laudo, send multipart/form-data
    if (dados && dados.saude && dados.saude.laudo && typeof window !== 'undefined' && dados.saude.laudo instanceof File) {
      const formData = new FormData();
      // send the entire payload as a single field so server can parse
      formData.append('forms', JSON.stringify(dados));
      // append file under the field name expected by upload.single('laudo')
      formData.append('laudo', dados.saude.laudo);

      const response = await axios.post(`${apiUrl}/formularioAnamnese`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response;
    }

    const response = await axios.post(`${apiUrl}/formularioAnamnese`, dados);
    return response; // retorna só os dados
  } catch (error) {
    console.error("Erro ao enviar formulário:", error);
    throw error;
  }
};

// --- Caso precise ainda das funções separadas, mantive elas abaixo ---

// Rotas para cadastro de alunos
export const postFunctionAlunos = async (data) => {
  const response = await axios.post(`${apiUrl}/alunos`, data);
  return response;
}

export const getFunctionAlunos = async () => {
  const response = await axios.get(`${apiUrl}/alunos`);
  return response;
}

export const postFunctionDadosMedicos = async (data) => {
  const response = await axios.post(`${apiUrl}/dadosMedicos`, data);
  return response;
}

export const getFunctionDadosMedicos = async () => {
  const response = await axios.get(`${apiUrl}/dadosMedicos`);
  return response;
}

export const postFunctionEndereco = async (dados) => {
  const response = await axios.post(`${apiUrl}/endereco`, dados);
  return response;
}

export const getFunctionEndereco = async () => {
  const response = await axios.get(`${apiUrl}/endereco`);
  return response;
}
