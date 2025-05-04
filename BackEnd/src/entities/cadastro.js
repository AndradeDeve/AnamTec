import { EntitySchema } from "typeorm";

const cadastro = new EntitySchema({
    name: "cadastro",
    tableName: "tbl_cadastro",
    columns:{
        id:{primary: true, type:"varchar", length:"15" ,unique: true, nullable:false},
        ra:{type:"varchar", length: 15, nullable:false},
        nome:{type:"varchar", length: 45, nullable: false},
        data_nasc:{type:"date", nullable: false}, 
        genero:{type:"varchar", length: 45, nullable: true},
        email:{type:"varchar", length: 45, nullable: false, unique: true}, //geralmente email é unico então adicionei isso
        numero_tel:{type:"varchar", length: 15, nullable: true},      
        createAt:{type:"datetime", nullable:false, default: () => "CURRENT_TIMESTAMP"},
        deletAt:{type:"datetime", nullable: true},
    }
})

export default cadastro;