import { EntitySchema } from "typeorm";
// Pronta
const endereco = new EntitySchema({
    nome: "Endereco",
    tableName: "tbl_endereco",
    columns: {
        id: {primary: true, type: "int", generated: "increment"},
        cep: {type: "int(9)", nullable: false },
        logradouro: {type: "varchar", length: 20, nullable: false },
        bairo: {type: "varchar", length:20 , nullable: false },
        cidade: {type: "varchar", length: 40, nullable: false},
        numero: {type: "varchar", length: 10, nullable: false},
        uf: {type: "enum", enum: ["AC","AL","AP",
            "AM","BA","CE","DF","ES","GO","MA",
            "MT","MS","MG","PA","PB","PR","PE",
            "PI","RJ","RN", "RS","RO","RR","SC",
            "SP", "SE","TO"], nullable: false},
        id_Aluno: {foreign: true, },
        createdAt: {type: "datetime", nullable: false, default: ()=>
            "CURRENT_TIMESTAMP"},
        deletdAt: {type: "datetime", nullable: true},
    }
})

export default endereco;