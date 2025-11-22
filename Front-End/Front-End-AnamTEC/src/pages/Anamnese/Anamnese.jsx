import React, { useState, useEffect } from "react";
import { Container, Card, Button } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from 'react-router-dom';
import Header from "../components/Header/Header";
import "./Anamnese.css"
import { getFunctionAnamnese } from "../../services/APIService";


import "react-toastify/dist/ReactToastify.css";
// import { FormContext } from "../Context/FormContext";


function Anamnese() {
    const navigate = useNavigate();
    const location = useLocation();
    const aluno = location.state?.aluno;

    const [dadosAluno, setDadosAluno] = useState({});

    useEffect(() => {
        if (!aluno) return;

        const getAnamnese = async () => {
            try {
                const response = await getFunctionAnamnese(aluno.id);

                if (response.status === 200) {
                    toast.success("Dados do aluno");
                    setDadosAluno(response.data[0]);
                }
            } catch (err) {
                console.error("Erro:", err);
                toast.error("Erro ao buscra dados do aluno.");
            }
        };

        getAnamnese();
    }, [aluno]);

    const navCoord = () => {
        navigate("/home", { replace: true}); 
    }

  return (
    <>
      
        <Header />
        <Container className="mt-4">
            <div className="form-box form-revisao-body">

            <h3 className="font-semibold mb-4 text-center">Revisão dos Dados</h3>

            {/* Informações Principais */}
            <Card className="p-3 mb-3 shadow-sm">
                <h5>Informações Principais</h5>
                <p><strong>Nome:</strong> {dadosAluno?.nome_aluno}</p>
                <p><strong>RM:</strong> {dadosAluno?.rm}</p>
                <p><strong>Curso:</strong> {dadosAluno?.nome_curso}</p>
                <p><strong>Data de Nascimento:</strong> {
                    new Date(dadosAluno.data_nasc).toLocaleDateString("pt-BR")
                }</p>
                <p><strong>Turno:</strong> {dadosAluno?.turno_curso}</p>
                <p><strong>Módulo:</strong> {dadosAluno?.modulo_curso}</p>
                <p><strong>Gênero:</strong> {dadosAluno?.genero_aluno}</p>
                <p><strong>Email:</strong> {dadosAluno?.email_aluno}</p>
                <p><strong>Endereço:</strong> {`Rua: ${dadosAluno?.logradouro}, N°: ${dadosAluno?.numero}, Bairro: ${dadosAluno?.bairro}`}</p>
            </Card>

            {/* Responsável */}
            <Card className="p-3 mb-3 shadow-sm">
                <h5>Responsável</h5>
                <p><strong>Nome:</strong> {dadosAluno?.responsavel_nome}</p>
                <p><strong>CPF:</strong> {dadosAluno?.responsavel_CPF}</p>
                <p><strong>Telefone:</strong> {dadosAluno?.responsavel_telefone}</p>
                <p><strong>Email:</strong> {dadosAluno?.responsavel_email}</p>
                <p><strong>Parentesco:</strong> {dadosAluno?.responsavel_parentesco}</p>
            </Card>

            {/* Saúde */}
            <Card className="p-3 mb-3">
                <h5>Histórico de Saúde</h5>
                <p><strong>Tipo sanguíneo:</strong> {dadosAluno?.tp_sangue}</p>
                <p><strong>Fumante:</strong> {dadosAluno?.fumo}</p>
                <p><strong>Possui alergia:</strong> {dadosAluno?.possui_alergia}</p>
                <p><strong>Tipo alergia:</strong> {dadosAluno?.tp_alergia}</p>
                <p><strong>Medicamentos:</strong> {dadosAluno?.usa_medicamento}</p>
                <p><strong>Tipo medicamento:</strong> {dadosAluno?.tp_medi}</p>
                <p><strong>Cirurgia:</strong> {dadosAluno?.possui_cirurgia}</p>
                <p><strong>Tipo cirurgia:</strong> {dadosAluno?.tp_cirurgia}</p>
                <p><strong>Restrição Alimentar:</strong> {dadosAluno?.possui_restricao}</p>
                <p><strong>Tipo de restrição:</strong> {dadosAluno?.tp_restricao}</p>
            </Card>

            {/* Comportamento */}
            <Card className="p-3 mb-3">
                <h5>Comportamento e Emocional</h5>
                <p><strong>Dificuldade de aprendizagem:</strong> {dadosAluno?.possui_dificuldade}</p>
                <p><strong>Quais dificuldades:</strong> {dadosAluno?.tp_dificuldades}</p>
                <p><strong>Acompanhamento psicológico/psiquiátrico:</strong> {dadosAluno?.acompanhamento_psicologico}</p>
                <p><strong>Qual acompanhamento:</strong> {dadosAluno?.tp_psi}</p>
                <p><strong>Possui acesso à internet/dispositivos:</strong> {dadosAluno?.acesso_internet}</p>
                <p><strong>Quais acessos:</strong> {dadosAluno?.tp_acesso}</p>
                <p><strong>Pratica atividades físicas:</strong> {dadosAluno?.pratica_atividade}</p>
                <p><strong>Quais atividades:</strong> {dadosAluno?.tp_ativ}</p>
            </Card>

                <div className="d-flex justify-content-between mt-3 mb-5">
                    <Button
                    type="button"
                    className="custom-btn mt-3"
                    onClick={navCoord}
                    >
                    Voltar
                    </Button>
                </div>
            </div>
        </Container>
    </>
  );
}

export default Anamnese;