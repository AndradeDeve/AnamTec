import { EntitySchema } from "typeorm";
//Prota
const cadastro = new EntitySchema({
    name: "Alunos",
    tableName: "tbl_alunos",
    columns:{
        id:{primary: true, type:"int", generatd: true},
        ra:{type:"varchar",  nullable:false, unique: true},
        nome:{type:"varchar", length: 50, nullable: false},
        data_nasc:{type:"date", nullable: false}, 
        genero:{type:"enum",enum:["Feminino", "Masculino", "Não Binario", "Prefiro não informar", "Outros"], nullable: true},
        email:{type:"varchar", length: 50, nullable: false, unique: true},
        tell:{type:"int", nullable: true, unique:true },      
        createAt:{type:"datetime", nullable:false, default: () => "CURRENT_TIMESTAMP"},
        deletAt:{type:"datetime", nullable: true},
    }
})

export default cadastro;