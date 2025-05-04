import { EntitySchema } from "typeorm";

const responsavel = new EntitySchema({ 
    name: "responsavel",
    tableName: "tbl_responsavel",
    columns:{
        cpf:{primary: true, type:"int",nullable:false},
        nome:{type:"varchar", length: 45, nullable: false},
        estado_civil:{type:"varchar", length: 10, nullable: false},
        email:{type:"varchar", length: 45, nullable: false},
        numero_tel:{type:"varchar", length: 15, nullable: false},    
        createAt:{type:"datetime", nullable:false, default: () => "CURRENT_TIMESTAMP"},
        deletAt:{type:"datetime", nullable: true},
    }
})

export default responsavel;