import { EntitySchema } from "typeorm";
// Pronta
const responsavel = new EntitySchema({
    nome: "Responsavel",
    tableName: "tbl_responsaveis",
    columns: {
        id: {primary: true, type: "int", generated: "increment"},
        name: {type: "varchar",length: 50, nullable: false },
        dataNasc: {type: "date", nullable: false },
        estCivil: {type: "enum", enum: ["Solteiro(a)", "Casado(a)",
            "Divorciado(a)","Viúvo(a)","Separado(a)"], nullable: false },
        email: {type: "varchar", length: 50, nullable: false},
        tell: {type: "int",  nullable: false},
        createdAt: {type: "datetime", nullable: false, default: ()=>
            "CURRENT_TIMESTAMP"},
        deletdAt: {type: "datetime", nullable: true},
    }
})

export default responsavel;
