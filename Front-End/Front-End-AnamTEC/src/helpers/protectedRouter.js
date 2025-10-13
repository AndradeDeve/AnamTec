import { getUser } from "./auth";   
import { useNavigate } from "react-router-dom";
import { useEffect } from "react"; 


function ProtectedRouter({children, roles}){
    const navigate = useNavigate();
    const user = getUser(); // Obtém o objeto decodificado do token, que deve ter a 'role'

    useEffect(() => {
        // 1. Verificar se o usuário está logado
        if (!user) {
            // Se não estiver logado, redireciona para a tela de Login
            navigate("/", { replace: true });
            return;
        }

        const userRole = user.type; 

        // Se 'roles' foi fornecido E a role do usuário NÃO está no array de 'roles' permitidos
        if (roles && !roles.includes(userRole)) {
            // Se não tem permissão, redireciona para a dashboard principal
            // ou para uma página de "Acesso Negado"
            console.log(roles, userRole)
            navigate("/home", { replace: true }); 
        }
    }, [user, roles, navigate]);
    
    // Evita renderizar a rota se o usuário não estiver logado 
    // ou se estiver logado mas sem permissão (pois o useEffect vai redirecionar)
    if (!user || (roles && !roles.includes(user.type))) {
        return null; // Não renderiza nada enquanto o redirecionamento acontece
    }

    // Se passou em todas as verificações, renderiza o componente filho (a tela)
    return children; 


    // Uso dentro de um componente
/*
<div>
    <h1>Lista de Usuários</h1>
    // Este botão só aparece se o usuário for Admin ou Secretary
    <HasRole roles={['Admin', 'Secretary']}>
        <button>Adicionar Novo Usuário</button>
    </HasRole>
</div>
*/
}

export default ProtectedRouter