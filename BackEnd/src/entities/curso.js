import { EntitySchema } from "typeorm";
// Pronta
const cursos = new EntitySchema({
    nome: "Cursos",
    tableName: "tbl_cursos",
    columns: {
        id: {primary: true, type: "int", generated: "increment"},
        curso: {type: "varchar", length: 20, nullable: false },
        turno: {type: "enum", enum:["Manhã", "Tarde","Noite"] , nullable: false },
        semestre: {type: "int", nullable: false},
        modalidade:{type: "enum", enum:["Presencial","Híbrido","EAD"]},
        createdAt: {type: "datetime", nullable: false, default: ()=>
            "CURRENT_TIMESTAMP"},
        deletdAt: {type: "datetime", nullable: true},
    }
})

export default cursos;