// src/hooks/useControleAcessoData.js
import { useState, useEffect, useCallback, useMemo } from "react";
import { showToast } from "../../../Utils/toast.js";
import { 
    getFunctionAlunoControllSpacific, getFunctionUser, getFunctionAlunoControll,
    getFunctionUserSpecific, deleteFunctionAluno, ativarFunctionAluno,
    ativarFunctionUser, deleteFunctionUser
} from "../../../services/APIService.js";

const ITENS_POR_PAGINA = 6;

export const useControleAcessoData = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [filtroStatus, setFiltroStatus] = useState("");   
    const [filtroAlunoProf, setFiltroAlunoProf] = useState("");
    const [campoBusca, setcampoBusca] = useState("rm");   // Renomeado tipoPesquisa
    const [valorBusca, setvalorBusca] = useState("");     // Renomeado valorPesquisa
    const [usuarios, setUsuarios] = useState([]);
    const [alunos, setAlunos] = useState([]);
    const [entidadesFiltradas, setEntidadesFiltradas] = useState([]); //usuariosFiltrados

    // 1. Fetch Inicial: Busca todos os dados (Alunos e Usuários/Professores)
    const fetchAllEntities = useCallback(async () => {
        try {
            // Usando Promise.all para buscar as duas listas em paralelo
            const [responseUser, responseAl] = await Promise.all([
                getFunctionUser(), 
                getFunctionAlunoControll() 
            ]);
            setUsuarios(responseUser.data || []); 
            setAlunos(responseAl.data || []); 
        } catch(err) {
            console.error("Erro ao buscar entidades iniciais: ", err);
            showToast("warn", 'Erro ao buscar usuários.'); 
        }
    }, []);

    useEffect(() => {
        fetchAllEntities();
    }, [fetchAllEntities]);

    // 2. Manipulação de Dados e Paginação (usando useMemo para otimizar)
    const entidadesGerais = useMemo(() => [...alunos, ...usuarios], [alunos, usuarios]); 

    const dadosParaExibir = useMemo(() => {
        return entidadesFiltradas.length > 0 ? entidadesFiltradas : entidadesGerais; 
    }, [entidadesFiltradas, entidadesGerais]);

    const totalPaginas = Math.ceil(dadosParaExibir.length / ITENS_POR_PAGINA); 

    const itensPagina = useMemo(() => {
        const indexUltimoItem = currentPage * ITENS_POR_PAGINA; 
        const indexPrimeiroItem = indexUltimoItem - ITENS_POR_PAGINA; 
        return dadosParaExibir.slice(indexPrimeiroItem, indexUltimoItem); 
    }, [dadosParaExibir, currentPage]);
    

    const irParaPagina = (numero) => {
        if (numero < 1 || numero > totalPaginas) return; 
        setCurrentPage(numero); 
    };

    const paginaAnterior = () => irParaPagina(currentPage - 1); 
    const proximaPagina = () => irParaPagina(currentPage + 1); 

    const updateEntityList = (id, entitySetter) => {
        entitySetter((prev) =>
            prev.map((e) =>
                e.id === id ? { ...e, status: e.status === "ativo" ? "inativo" : "ativo" } : e 
            )
        );
        setEntidadesFiltradas((prev) =>
            prev.map((e) =>
                e.id === id ? { ...e, status: e.status === "ativo" ? "inativo" : "ativo" } : e 
            )
        );
    };

    const toggleEntityStatus = async (id, tipo, status) => {
        try {
            const isAtivo = status === "ativo";
            let response;
            let message;

            if (tipo === "aluno") {
                // Se está ativo, vamos inativar (deleteFunctionAluno) 
                response = isAtivo ? await deleteFunctionAluno(id) : await ativarFunctionAluno(id); 
                message = isAtivo ? 'Aluno inativado com sucesso.' : 'Aluno ativo com sucesso.'; 
                if (response.status === 200) updateEntityList(id, setAlunos); 

            } else { // Professor/Usuário
                // Se está ativo, vamos inativar (deleteFunctionUser) 
                response = isAtivo ? await deleteFunctionUser(id) : await ativarFunctionUser(id); 
                message = isAtivo ? 'Usuário inativado com sucesso.' : 'Usuário ativado com sucesso.'; 
                if (response.status === 200) updateEntityList(id, setUsuarios); 
            }
            if (response && response.status === 200) {
                showToast("success", message);
            } else {
                 throw new Error("Falha na API");
            }

        } catch (err) {
            console.error("Erro ao atualizar status:", err); 
            showToast("error", 'Erro ao atualizar status da entidade.'); 
        }
    };

    const normalizarEntidade = useCallback((tipo) => {
        if (!tipo) return "aluno"; 
        const t = tipo.toLowerCase(); 
        if (t.includes("professor")) return "professor";
        return t;
    }, []);

    const fetchSearchData = async () => {
        const searchParam = valorBusca + (campoBusca !== "rm" ? "%" : "");
        
        const promises = [
            getFunctionAlunoControllSpacific(campoBusca, searchParam), 
            getFunctionUserSpecific(campoBusca, searchParam) 
        ];

        const [alunoRes, userRes] = await Promise.allSettled(promises);
        
        let resultado = [];
        if (alunoRes.status === 'fulfilled') resultado.push(...(alunoRes.value.data || [])); 
        if (userRes.status === 'fulfilled' && userRes.value.data) resultado.push(...(userRes.value.data.response || [])); 
        
        return resultado;
    }

    const handlePesquisar = async () => {
        setCurrentPage(1); // Volta para a primeira página após a pesquisa 
        let resultado = entidadesGerais;
        
        try {
            if (valorBusca.trim() !== "") {
                if (valorBusca.length < 3 && campoBusca !== "rm") {
                    showToast("warn", `O ${campoBusca.toLocaleUpperCase()} deve conter no mínimo 3 caracteres.`); 
                    return;
                }
                resultado = await fetchSearchData(); 
                if (resultado.length === 0) {
                    showToast("warn", 'Nenhuma entidade encontrada para a pesquisa.'); 
                }
            }

            if (filtroStatus) {
                resultado = resultado.filter((u) => u.status && u.status.toLowerCase() === filtroStatus.toLowerCase()); 
                 if (resultado.length === 0) {
                     showToast("warn", 'Nenhuma entidade encontrada com os filtros aplicados.'); 
                }
            }

            if (filtroAlunoProf) {
                resultado = resultado.filter((u) => {
                    return normalizarEntidade(u.entidade) === filtroAlunoProf.toLowerCase(); 
                });
            }

            setEntidadesFiltradas(resultado);
        } catch(err) {
            console.error("Erro ao buscar entidades: ", err); 
            showToast("error", 'Erro ao buscar entidades(s).'); 
            setEntidadesFiltradas(entidadesGerais);
        }
    };

    return {
       /* Dados e Paginação */ itensPagina, currentPage, totalPaginas,
        /* Filtros e Busca */ campoBusca, setcampoBusca, valorBusca, setvalorBusca,
        filtroStatus, setFiltroStatus, filtroAlunoProf, setFiltroAlunoProf,
        /* Handlers */ toggleEntityStatus, handlePesquisar, irParaPagina, paginaAnterior, proximaPagina
    };
};