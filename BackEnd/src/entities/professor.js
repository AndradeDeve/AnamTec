import { EntitySchema } from "typeorm";

const professor = new EntitySchema({
    name: "professor",
    tableName: "tbl_professor",
    columns:{
        rm:{primary: true, type:"varchar", length: 10,unique: true, nullable:false},
        nome:{type:"varchar", length: 45, nullable: false},
        email:{type:"varchar", length: 50, nullable: false},
        senha:{type:"varchar", length: 20, nullable:false},
        tipo:{type:"enum", enum: ["adimin", "common"], nullable:false},
        createdAt:{type:"datetime", nullable:false, defalt: () => "CURRENT_TIMESTAMP"},
        deletedAt:{type:"datetime", nullable: true}
        
    }
})

export default professor;