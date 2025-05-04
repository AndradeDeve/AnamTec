import { EntitySchema } from "typeorm";

const endereco = new EntitySchema({
    name: "endereco",
    tableName: "tbl_endereco",
    columns:{
        cep:{type:"int", primary: true, width: 8, nullable:false},
        logradouro:{type:"varchar", length: 80, nullable: false},
        numero:{type:"int", width:5, nullable: false},
        uf:{type:"char", length: 2, nullable: false},
        bairro:{type:"varchar", length: 25, nullable: false},
        cidade:{type:"varchar", length: 35, nullable: false},
        createdAt:{type:"datetime", nullable:false, default: () => "CURRENT_TIMESTAMP"},
        deletedAt:{type:"datetime", nullable: true}
    }
})

export default endereco;