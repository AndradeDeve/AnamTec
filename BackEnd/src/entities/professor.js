import { EntitySchema } from "typeorm";

const professor = new EntitySchema({
    name: "professor",
    tableName: "tbl_professor",
    columns:{
        nome:{type:"varchar", length: 45, nullable: false}
        
    }
})