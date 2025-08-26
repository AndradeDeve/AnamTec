    import { response } from 'express';
    import jwt from 'jsonwebtoken';
    import bcrypt from 'bcrypt';

    function genereteToken(payload){
        return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn : 60*60+5});
    }

    function authenticate( request, response, next){
        const {authorization} = request.headers;

        if(!authorization){
            return response.status(401).json({err: "Token não informado."});
        }

        const bearer = authorization.split(' ')[0];
        const token = authorization.split(' ')[1];

        if(bearer != "Bearer"){
            return response.status(401).json({err: "Token não possuí 'Bearer'."})
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, user) =>{
            if(err)
                return response.status(401).json({Mensagem: "Acesso não autorizado. Token inválido."});
            request.user = user;
            next();
        });
    }



    function authorizationRoles(...allowedRoles){
        return (request, response, next)=>{
            const userRole = request.user?.tipo;

            if(!allowedRoles.includes(userRole)){
                return response.status(403).json({mensage: "Acesso negado. Permissão insuficiente."})
            }
            next();
        }
    }

    async function VerificarSenha(senha, hashedSenha) {
        try {
            const verificarSenha = await bcrypt.compare(senha, hashedSenha)
            return verificarSenha;
        }catch (error) {
            console.error("Erro ao hashear a senha:", error);
            throw new Error("Erro ao processar a senha.");
        }
    }

    export {genereteToken, authenticate, authorizationRoles, VerificarSenha};