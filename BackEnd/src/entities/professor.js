import { EntitySchema } from "typeorm";
// Pronta
const professor = new EntitySchema({
    name: "professor",
    tableName: "tbl_professor",
    columns:{
        id:{primary:true, type:"int", generated: true},
        cpf:{type:"int", unique:true, nullable: false},
        rm:{type:"int",unique: true, nullable:false},
        name:{type:"varchar", length: 50, nullable: false},
        email:{type:"varchar", length: 50, nullable: false, unique: true},
        password:{type:"varchar", length: 20, nullable:false},
        typeUser:{type:"enum", enum: ["adimin", "common"], nullable:false},
        createdAt:{type:"datetime", nullable:false, defalt: () => "CURRENT_TIMESTAMP"},
        deletedAt:{type:"datetime", nullable: true}
        
    }
})

export default professor;