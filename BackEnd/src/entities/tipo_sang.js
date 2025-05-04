import { EntitySchema } from "typeorm";

const tipoSang = new EntitySchema({
    name: "tipo_sang",
    tableName: "tbl_tipo_sang",
    columns:{
       tipo_sanguineo:{type:"varchar", length: 3, nullable:false},
        createdAt:{type:"datetime", nullable:false, default: () => "CURRENT_TIMESTAMP"},
        deletedAt:{type:"datetime", nullable: true}
    }
})

export default tipoSang;

