module.exports = class Db1746233291771 {
    name = 'Db1746233291771'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE \`tbl_professor\` (\`rm\` varchar(10) NOT NULL, \`nome\` varchar(45) NOT NULL, \`email\` varchar(50) NOT NULL, \`senha\` varchar(20) NOT NULL, \`tipo\` enum ('adimin', 'common') NOT NULL, \`createdAt\` datetime NOT NULL, \`deletedAt\` datetime NULL, UNIQUE INDEX \`IDX_f04f560f00919998f7a2d8dccb\` (\`rm\`), PRIMARY KEY (\`rm\`)) ENGINE=InnoDB`);
    }

    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX \`IDX_f04f560f00919998f7a2d8dccb\` ON \`tbl_professor\``);
        await queryRunner.query(`DROP TABLE \`tbl_professor\``);
    }
}
