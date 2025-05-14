import { EntitySchema } from "typeorm";
// Pronta
const endereco = new EntitySchema({
    nome: "Endereco",
    tableName: "tbl_endereco",
    columns: {
        id: {primary: true, type: "int", generated: "increment"},
        cep: {type: "varchar", length:9 ,  nullable: false },
        logradouro: {type: "varchar", length: 20, nullable: false },
        bairo: {type: "varchar", length:20 , nullable: false },
        cidade: {type: "varchar", length: 40, nullable: false},
        numero: {type: "varchar", length: 10, nullable: false},
        uf: {type: "enum", enum: ["AC","AL","AP",
            "AM","BA","CE","DF","ES","GO","MA",
            "MT","MS","MG","PA","PB","PR","PE",
            "PI","RJ","RN", "RS","RO","RR","SC",
            "SP", "SE","TO"], nullable: false},
        createdAt: {type: "datetime", nullable: false, default: ()=>
            "CURRENT_TIMESTAMP"},
        deletdAt: {type: "datetime", nullable: true},
    },
    relations:{
            id_aluno: {type:"many-to-one", target:"tbl_alunos", nullable: false},
        }
})

export default endereco;